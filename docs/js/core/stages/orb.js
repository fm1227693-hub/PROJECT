/* =====================================================================
   STAGES / ORB
   The destination object: a plasma core inside a glass shell, wrapped in
   three counter-rotating chrome rings. Used by the CTA (giant typography +
   3D light) and by Contact (the form floats over it and every focused
   field makes it breathe).
   ===================================================================== */
import * as THREE from 'three';
import { state } from '../state.js';
import { damp, clamp } from '../utils.js';
import { createRingGeometry, createBlobGeometry } from '../geometry.js';
import { SIMPLEX_GLSL } from '../materials.js';

const CORE_VERT = /* glsl */`
uniform float uTime;
uniform float uWobble;
varying vec3 vN;
varying vec3 vV;
varying vec3 vPos;
${SIMPLEX_GLSL}
void main() {
  vec3 p = position;
  float n = lusSnoise(p * 1.35 + vec3(0.0, uTime * 0.28, uTime * 0.12));
  n += 0.5 * lusSnoise(p * 3.1 - vec3(uTime * 0.2, 0.0, uTime * 0.16));
  p += normal * n * uWobble;
  vPos = p;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vN = normalize(normalMatrix * normal);
  vV = normalize(-mv.xyz);
  gl_Position = projectionMatrix * mv;
}
`;

const CORE_FRAG = /* glsl */`
uniform float uTime;
uniform float uEnergy;
uniform float uFocus;
uniform vec3 uColA;
uniform vec3 uColB;
varying vec3 vN;
varying vec3 vV;
varying vec3 vPos;
${SIMPLEX_GLSL}
void main() {
  vec3 N = normalize(vN);
  vec3 V = normalize(vV);
  float fres = pow(1.0 - clamp(dot(N, V), 0.0, 1.0), 2.2);

  float n = lusSnoise(vPos * 2.1 + vec3(uTime * 0.22));
  float n2 = lusSnoise(vPos * 5.4 - vec3(uTime * 0.31, uTime * 0.11, 0.0));
  float plasma = smoothstep(-0.25, 0.85, n * 0.7 + n2 * 0.5);

  vec3 col = mix(uColA, uColB, clamp(plasma + fres * 0.5, 0.0, 1.0));
  float core = pow(clamp(1.0 - fres, 0.0, 1.0), 3.0) * (0.25 + plasma * 0.5);
  col *= (core + fres * 1.6) * (0.5 + uEnergy * 1.5);

  /* filament highlights */
  float fil = smoothstep(0.72, 0.98, n2 * 0.5 + 0.5);
  col += fil * vec3(1.0, 0.93, 0.88) * (0.35 + uFocus * 1.1);

  float a = clamp(core * 0.9 + fres * 0.85 + fil * 0.3, 0.0, 1.0) * (0.35 + uEnergy);
  gl_FragColor = vec4(col, a);
}
`;

export class OrbStage {
  constructor(world) {
    this.world = world;
    this.q = world.quality;
    this.group = new THREE.Group();
    this.group.name = 'orb';
    this.presence = 0;
    this.targetPresence = 0;
    this.focus = 0;
    this.ownGeos = [];
    this.ownMats = [];

    this.coreUniforms = {
      uTime: { value: 0 },
      uWobble: { value: 0.12 },
      uEnergy: { value: 0.5 },
      uFocus: { value: 0 },
      uColA: { value: new THREE.Color('#ff4d1f') },
      uColB: { value: new THREE.Color('#4f46e5') }
    };
    this.coreGeo = createBlobGeometry(1.15, this.q.tier >= 2 ? 32 : 16);
    this.coreMat = new THREE.ShaderMaterial({
      uniforms: this.coreUniforms,
      vertexShader: CORE_VERT,
      fragmentShader: CORE_FRAG,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      fog: false
    });
    this.ownGeos.push(this.coreGeo);
    this.ownMats.push(this.coreMat);
    this.core = new THREE.Mesh(this.coreGeo, this.coreMat);
    this.group.add(this.core);

    /* glass shell */
    this.shellGeo = createBlobGeometry(1.42, this.q.tier >= 2 ? 20 : 10);
    this.shellMat = world.materials.glass({
      thickness: 2.2, ior: 1.42, roughness: 0.03, iridescence: 0.9,
      attenuation: 0x9fd0ff, attenuationDistance: 3.2, side: THREE.DoubleSide
    });
    this.shell = new THREE.Mesh(this.shellGeo, this.shellMat);
    this.ownGeos.push(this.shellGeo);
    this.group.add(this.shell);

    /* rings */
    this.rings = [];
    const radii = [1.95, 2.35, 2.8];
    const tubes = [0.014, 0.008, 0.02];
    for (let i = 0; i < 3; i++) {
      const g = createRingGeometry(radii[i], tubes[i], 6, 200);
      const m = i === 1
        ? new THREE.MeshBasicMaterial({ color: 0xff7a4d, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false })
        : world.materials.chrome({ color: 0xd7dbe1, roughness: 0.12, clearcoat: 0.6, env: 1.7 });
      if (i === 1) this.ownMats.push(m);
      this.ownGeos.push(g);
      const ring = new THREE.Mesh(g, m);
      ring.rotation.set(Math.PI / 2 + i * 0.42, i * 0.7, i * 0.3);
      this.rings.push(ring);
      this.group.add(ring);
    }

    this.light = new THREE.PointLight(0xff6a3d, 0, 22, 2);
    this.group.add(this.light);

    this.group.position.set(-2.2, 0.2, -1);
    world.scene.add(this.group);
  }

  static weights = {
    cta: 1, 'about-cta': 1, 'work-cta': 1,
    'contact-hero': 1, 'contact-form': 1,
    'lab-hero': 0.7, 'lab-grid': 0.55, stats: 0.18, awards: 0.1, timeline: 0.24, team: 0.34, brands: 0.42, philosophy: 0.2
  };

  setPresence(v) { this.targetPresence = v; }

  update(dt, ctx) {
    this.presence = damp(this.presence, this.targetPresence, 2.6, dt);
    const p = this.presence;
    this.group.visible = p > 0.004;
    if (!this.group.visible) return;

    const t = this.world.time;
    const w = state.world;
    const targetFocus = clamp(ctx.focus || 0, 0, 1);
    this.focus = damp(this.focus, targetFocus, 4, dt);

    const isContact = state.route === '/contact';
    const targetX = isContact ? -2.5 : (ctx.pageProgress || 0) > 0.5 ? 1.6 : 2.4;
    this.group.position.x = damp(this.group.position.x, targetX + state.mouse.sx * 0.7, 2.2, dt);
    this.group.position.y = damp(this.group.position.y, 0.1 + state.mouse.sy * 0.5 + Math.sin(t * 0.34) * 0.14, 2.2, dt);
    this.group.position.z = damp(this.group.position.z, -1 + this.focus * 0.8 - (ctx.pageProgress || 0) * 0.8, 2.2, dt);

    const s = (0.62 + p * 0.5) * (1 + this.focus * 0.09 + w.intensity * 0.1) * (1 + Math.sin(t * 1.1) * 0.012);
    this.group.scale.setScalar(clamp(s, 0.001, 3));

    this.coreUniforms.uTime.value = t;
    this.coreUniforms.uEnergy.value = 0.35 + w.intensity * 0.7 + this.focus * 0.55 + state.absVelocity * 0.5;
    this.coreUniforms.uFocus.value = this.focus;
    this.coreUniforms.uWobble.value = 0.09 + w.distortion * 0.2 + state.absVelocity * 0.16;
    this.coreUniforms.uColA.value.setRGB(state.colors.accent[0], state.colors.accent[1], state.colors.accent[2]);
    this.coreUniforms.uColB.value.setRGB(
      clamp(state.colors.skyB[0] * 2.6 + 0.12, 0, 2),
      clamp(state.colors.skyB[1] * 2.6 + 0.16, 0, 2),
      clamp(state.colors.skyB[2] * 2.6 + 0.3, 0, 2)
    );

    this.core.rotation.y = t * 0.12;
    this.core.rotation.x = Math.sin(t * 0.17) * 0.18;
    this.shell.visible = this.q.transmission && p > 0.35;
    this.shell.rotation.y = -t * 0.07;
    this.shell.scale.setScalar(1 + this.focus * 0.03);
    this.shellMat.envMapIntensity = 1 + w.intensity;

    const spin = 0.1 + w.intensity * 0.18 + this.focus * 0.35 + state.absVelocity * 1.2;
    this.rings.forEach((r, i) => {
      r.rotation.z += dt * spin * (i % 2 ? -1 : 1) * (0.6 + i * 0.3);
      r.rotation.y += dt * spin * 0.35;
      const sc = 1 + Math.sin(t * 0.5 + i) * 0.02 + this.focus * 0.05;
      r.scale.setScalar(sc);
      if (r.material.opacity !== undefined && i === 1) r.material.opacity = (0.3 + this.focus * 0.5 + w.intensity * 0.3) * p;
    });

    this.light.intensity = damp(this.light.intensity, (30 + w.intensity * 120 + this.focus * 160) * p, 3.4, dt);
    this.light.color.setRGB(
      clamp(state.colors.accent[0] + 0.3, 0, 2),
      clamp(state.colors.accent[1] * 0.5 + 0.16, 0, 2),
      clamp(state.colors.accent[2] * 0.35 + 0.12, 0, 2)
    );

    if (ctx.controlCamera && p > 0.7 && isContact) {
      state.camera.tPos[0] = -1.2 + state.mouse.sx * 0.8;
      state.camera.tPos[1] = 0.25 + state.mouse.sy * 0.5;
      state.camera.tPos[2] = 7.4 - this.focus * 0.7;
      state.camera.tLook[0] = -1.4; state.camera.tLook[1] = 0; state.camera.tLook[2] = -1;
      state.camera.tFov = 40 - this.focus * 2;
    }
  }

  dispose() {
    this.ownGeos.forEach(g => g && g.dispose());
    this.ownMats.forEach(m => m && m.dispose());
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}
