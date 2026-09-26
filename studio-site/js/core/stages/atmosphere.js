/* =====================================================================
   STAGES / ATMOSPHERE
   The always-on world: pointer/scroll ink trail (ping-pong FBO), the sky
   dome that carries section colour, and the ambient particle field that
   switches personality per page.
   ===================================================================== */
import * as THREE from 'three';
import { state } from '../state.js';
import { DEVICE } from '../config.js';

const TRAIL_FRAG = /* glsl */`
uniform sampler2D uPrev;
uniform vec2 uMouse;
uniform vec2 uVel;
uniform float uAspect;
uniform float uScrollVel;
uniform float uTime;
uniform float uSplat;
varying vec2 vUv;
void main() {
  vec4 prev = texture2D(uPrev, vUv);
  /* self-advection — the ink keeps moving after you stop */
  vec2 adv = vUv - prev.xy * 0.0038;
  adv.y -= uScrollVel * 0.0016;
  prev = texture2D(uPrev, adv) * 0.968;

  vec2 d = vUv - uMouse; d.x *= uAspect;
  float splat = exp(-dot(d, d) * 150.0);
  prev.xy += uVel * splat * 3.2;
  prev.z += splat * length(uVel) * 4.5 * uSplat;

  /* scrolling paints a broad vertical smear through the world */
  float band = exp(-pow((vUv.x - 0.5) * 2.6, 2.0));
  prev.z += abs(uScrollVel) * band * 0.05;
  prev.z *= 0.978;
  gl_FragColor = vec4(prev.xyz, 1.0);
}
`;

const SKY_FRAG = /* glsl */`
uniform float uTime;
uniform sampler2D uTrail;
uniform vec2 uRes;
uniform vec3 uSkyA;
uniform vec3 uSkyB;
uniform vec3 uAccent;
uniform float uDark;
uniform float uGain;
uniform float uVel;
uniform float uPortal;
uniform float uIntensity;
uniform float uSweep;
varying vec3 vDir;
varying vec2 vScreen;

float hash21(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
float vnoise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash21(i), b = hash21(i + vec2(1.0, 0.0));
  float c = hash21(i + vec2(0.0, 1.0)), d = hash21(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}
float fbm(vec2 p){
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * vnoise(p); p = p * 2.03 + 7.31; a *= 0.5; }
  return v;
}

void main() {
  vec4 tr = texture2D(uTrail, vScreen);

  /* direction-based equirect-ish uv so the sky survives camera moves */
  vec3 dir = normalize(vDir);
  vec2 uv = vec2(atan(dir.z, dir.x) * 0.15915494 + 0.5, dir.y * 0.5 + 0.5);

  /* portal pulls the atmosphere toward the centre of the frame */
  vec2 sc = vScreen - 0.5;
  float cd = length(sc);
  uv -= sc * uPortal * 0.05 * smoothstep(0.95, 0.0, cd);
  uv += tr.xy * 0.022;

  /* vertical stretch when scrolling hard */
  uv.y += uVel * 0.012 * sin(uv.x * 6.0);

  float t = uTime * 0.035;
  vec2 q = vec2(fbm(uv * 2.1 + t), fbm(uv * 2.1 - t * 0.7 + 4.2));
  float f = fbm(uv * 2.6 + q * 1.5 + t * 0.35);

  float grad = smoothstep(-0.35, 0.95, dir.y);
  vec3 col = mix(uSkyA, uSkyB, grad);

  /* soft marble clouds, barely there on paper, stronger in the dark */
  float marble = smoothstep(0.42, 0.92, f);
  col = mix(col, uSkyA * 1.18 + 0.02, marble * (0.34 + uDark * 0.3));
  col = mix(col, uAccent, smoothstep(0.62, 0.98, q.x * f) * (0.10 + uIntensity * 0.12));
  col = mix(col, uAccent * 0.7 + uSkyB * 0.4, smoothstep(0.60, 0.95, q.y) * 0.07);

  /* pointer ink */
  float ink = clamp(tr.z, 0.0, 1.4);
  vec3 inkCol = mix(uAccent, uSkyB * 1.6 + 0.08, clamp(tr.x * 0.45 + 0.5, 0.0, 1.0));
  col = mix(col, inkCol, clamp(ink * (0.42 + uDark * 0.4), 0.0, 0.85));

  /* horizon light bloom behind the subject */
  float halo = smoothstep(0.85, 0.0, length(vec2(dir.x * 0.7, dir.y - 0.06)));
  col += halo * mix(uAccent, vec3(1.0), 0.55) * (0.05 + uIntensity * 0.16) * (0.3 + uDark);

  /* light sweep (reel portal moment) */
  float sw = exp(-pow((sc.x * 0.8 + sc.y * 0.6 - uSweep) * 5.0, 2.0));
  col += sw * uSweep * 0.5 * vec3(1.0, 0.96, 0.92);

  /* vignette */
  float vig = smoothstep(1.25, 0.25, length(sc) * 1.35);
  col *= mix(1.0, vig, 0.55);

  col *= uGain;
  gl_FragColor = vec4(col, 1.0);
}
`;

const DUST_VERT = /* glsl */`
attribute float aSeed;
attribute float aScale;
attribute vec3 aTint;
uniform float uTime;
uniform float uPixelRatio;
uniform float uSize;
uniform float uSpeed;
uniform float uMode;      /* 0 = ambient dust, 1 = curl field */
uniform float uConverge;  /* 0..1 pull toward the centre (orb / cta) */
uniform float uVel;
uniform float uSpread;
varying vec3 vTint;
varying float vFade;

vec3 driftMotion(vec3 p, float s, float t) {
  p.x += sin(t * 0.21 * s + s * 12.0) * 0.7;
  p.y += cos(t * 0.17 * s + s * 7.0) * 0.55 + sin(t * 0.05 * s) * 0.4;
  p.z += sin(t * 0.13 * s + s * 3.0) * 0.7;
  return p;
}
vec3 curlMotion(vec3 p, float s, float t) {
  float f = 0.42;
  p.x += sin(p.y * f + t * 0.55 * s) * 1.5;
  p.y += cos(p.z * f - t * 0.42 * s) * 1.5;
  p.z += sin(p.x * f + t * 0.33 * s) * 1.5;
  p.y += sin(t * 0.2 + s * 9.0) * 0.6;
  return p;
}

void main() {
  vec3 p = position * uSpread;
  float s = 0.4 + aSeed;
  float t = uTime * (0.5 + uSpeed);

  vec3 d = driftMotion(p, s, t);
  vec3 c = curlMotion(p, s, t);
  vec3 pos = mix(d, c, clamp(uMode, 0.0, 1.0));

  /* scroll velocity throws the field backwards */
  pos.y += uVel * (1.5 + aSeed * 3.0);

  /* converge toward the centre for the orb / cta moments */
  float r = length(pos);
  pos = mix(pos, normalize(pos + 0.0001) * (1.2 + fract(aSeed * 7.3) * 1.4), clamp(uConverge, 0.0, 1.0));

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  float dist = -mv.z;
  vFade = smoothstep(46.0, 6.0, dist) * (0.35 + 0.65 * fract(aSeed * 13.7));
  vTint = aTint;
  gl_PointSize = uSize * aScale * uPixelRatio * (150.0 / max(dist, 0.6));
  gl_Position = projectionMatrix * mv;
}
`;

const DUST_FRAG = /* glsl */`
uniform float uOpacity;
varying vec3 vTint;
varying float vFade;
void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = smoothstep(0.5, 0.05, d);
  gl_FragColor = vec4(vTint, a * vFade * uOpacity);
}
`;

export class Atmosphere {
  constructor(world) {
    this.world = world;
    this.quality = world.quality;

    /* --- ink trail (ping-pong) --- */
    this.trailRes = this.quality.tier >= 2 ? 384 : (this.quality.tier === 1 ? 256 : 160);
    const rtOpts = {
      minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter,
      format: THREE.RGBAFormat, type: THREE.HalfFloatType, depthBuffer: false, stencilBuffer: false
    };
    this.rtA = new THREE.WebGLRenderTarget(this.trailRes, this.trailRes, rtOpts);
    this.rtB = new THREE.WebGLRenderTarget(this.trailRes, this.trailRes, rtOpts);
    this.trailScene = new THREE.Scene();
    this.trailCam = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.trailMat = new THREE.ShaderMaterial({
      uniforms: {
        uPrev: { value: null },
        uMouse: { value: new THREE.Vector2(-1, -1) },
        uVel: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: 1 },
        uScrollVel: { value: 0 },
        uTime: { value: 0 },
        uSplat: { value: 1 }
      },
      vertexShader: 'varying vec2 vUv; void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }',
      fragmentShader: TRAIL_FRAG,
      depthTest: false, depthWrite: false
    });
    this.trailQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.trailMat);
    this.trailQuad.frustumCulled = false;
    this.trailScene.add(this.trailQuad);

    /* --- sky dome --- */
    this.skyUniforms = {
      uTime: { value: 0 },
      uTrail: { value: this.rtA.texture },
      uRes: { value: new THREE.Vector2(1, 1) },
      uSkyA: { value: new THREE.Color(0.937, 0.929, 0.91) },
      uSkyB: { value: new THREE.Color(0.886, 0.87, 0.84) },
      uAccent: { value: new THREE.Color(1.0, 0.3, 0.12) },
      uDark: { value: 0 },
      uGain: { value: 2.6 },
      uVel: { value: 0 },
      uPortal: { value: 0 },
      uIntensity: { value: 0.2 },
      uSweep: { value: 0 }
    };
    this.skyMat = new THREE.ShaderMaterial({
      uniforms: this.skyUniforms,
      vertexShader: `
        varying vec3 vDir;
        varying vec2 vScreen;
        void main() {
          vDir = normalize(position);
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          gl_Position = projectionMatrix * mv;
          vScreen = gl_Position.xy / max(gl_Position.w, 0.0001) * 0.5 + 0.5;
        }`,
      fragmentShader: SKY_FRAG,
      side: THREE.BackSide,
      depthWrite: false,
      depthTest: false,
      fog: false
    });
    this.sky = new THREE.Mesh(new THREE.SphereGeometry(90, 48, 32), this.skyMat);
    this.sky.frustumCulled = false;
    this.sky.renderOrder = -1000;
    this.sky.name = 'sky';
    world.scene.add(this.sky);

    /* --- particle field --- */
    const base = 2600;
    this.count = Math.max(320, Math.round(base * this.quality.particles));
    this.dust = this.buildDust(this.count);
    world.scene.add(this.dust);

    this._v = new THREE.Vector2();
  }

  buildDust(count) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const seeds = new Float32Array(count);
    const scales = new Float32Array(count);
    const tints = new Float32Array(count * 3);
    const warm = new THREE.Color('#ff8a5c');
    const cool = new THREE.Color('#cfd8ff');
    const white = new THREE.Color('#ffffff');
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      /* unit-ish distribution; multiplied by uSpread in the shader */
      pos[i * 3] = (Math.random() - 0.5) * 2.0;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 1.4;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 1.6;
      seeds[i] = Math.random();
      scales[i] = 0.35 + Math.random() * 1.5;
      const r = Math.random();
      tmp.copy(r < 0.16 ? warm : r < 0.3 ? cool : white);
      tints[i * 3] = tmp.r; tints[i * 3 + 1] = tmp.g; tints[i * 3 + 2] = tmp.b;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    geo.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    geo.setAttribute('aScale', new THREE.BufferAttribute(scales, 1));
    geo.setAttribute('aTint', new THREE.BufferAttribute(tints, 3));
    geo.boundingSphere = new THREE.Sphere(new THREE.Vector3(), 400);

    const mat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uPixelRatio: { value: Math.min(window.devicePixelRatio || 1, 2) },
        uSize: { value: this.quality.tier >= 2 ? 2.6 : 2.0 },
        uSpeed: { value: 0.3 },
        uMode: { value: 0 },
        uConverge: { value: 0 },
        uVel: { value: 0 },
        uSpread: { value: 11 },
        uOpacity: { value: 0.5 }
      },
      vertexShader: DUST_VERT,
      fragmentShader: DUST_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      fog: false
    });
    const pts = new THREE.Points(geo, mat);
    pts.frustumCulled = false;
    pts.name = 'dust';
    pts.renderOrder = 5;
    return pts;
  }

  /** Runs before the main render — one full-screen pass into the trail FBO. */
  renderTrail(renderer) {
    const u = this.trailMat.uniforms;
    const m = state.mouse;
    u.uPrev.value = this.rtA.texture;
    u.uMouse.value.set(m.x / window.innerWidth, 1 - m.y / window.innerHeight);
    u.uVel.value.set(m.vx / window.innerWidth, -m.vy / window.innerHeight);
    u.uAspect.value = window.innerWidth / Math.max(1, window.innerHeight);
    u.uScrollVel.value = state.velocity;
    u.uTime.value = this.world.time;
    u.uSplat.value = DEVICE.touch ? 0.35 : 1;

    renderer.setRenderTarget(this.rtB);
    renderer.render(this.trailScene, this.trailCam);
    renderer.setRenderTarget(null);
    const tmp = this.rtA; this.rtA = this.rtB; this.rtB = tmp;
    this.skyUniforms.uTrail.value = this.rtA.texture;
  }

  update(dt, ctx) {
    const w = state.world;
    const c = state.colors;
    const su = this.skyUniforms;
    su.uTime.value = this.world.time;
    su.uSkyA.value.setRGB(c.skyA[0], c.skyA[1], c.skyA[2]);
    su.uSkyB.value.setRGB(c.skyB[0], c.skyB[1], c.skyB[2]);
    su.uAccent.value.setRGB(c.accent[0], c.accent[1], c.accent[2]);
    su.uDark.value = w.dark;
    /* keep paper sections matched to the CSS --paper token after ACES */
    su.uGain.value = 2.62 - w.dark * 2.32;
    su.uVel.value = state.velocity;
    su.uPortal.value = w.portal;
    su.uIntensity.value = w.intensity;
    su.uSweep.value = w.sweep;

    const du = this.dust.material.uniforms;
    du.uTime.value = this.world.time;
    du.uSpeed.value = 0.18 + w.particleSpeed * 0.7 + state.absVelocity * 1.4;
    du.uVel.value = -state.velocity * 0.9;
    du.uMode.value = ctx.labMode ? 1 : 0;
    du.uConverge.value = ctx.converge || 0;
    du.uSpread.value = ctx.spread || 11;
    du.uOpacity.value = (0.26 + w.dark * 0.5) * (0.6 + w.intensity * 0.5) * (ctx.dustOpacity !== undefined ? ctx.dustOpacity : 1);
    du.uPixelRatio.value = this.world.renderer.getPixelRatio();

    /* sky follows the camera so it never clips */
    this.sky.position.copy(ctx.camera.position);
  }

  resize(w, h) {
    this.skyUniforms.uRes.value.set(w, h);
  }

  setVisible(on) {
    this.sky.visible = on;
    this.dust.visible = on;
  }

  dispose() {
    this.rtA.dispose(); this.rtB.dispose();
    this.trailMat.dispose(); this.trailQuad.geometry.dispose();
    this.skyMat.dispose(); this.sky.geometry.dispose();
    this.dust.geometry.dispose(); this.dust.material.dispose();
    if (this.sky.parent) this.sky.parent.remove(this.sky);
    if (this.dust.parent) this.dust.parent.remove(this.dust);
  }
}
