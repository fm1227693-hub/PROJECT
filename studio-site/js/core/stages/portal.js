/* =====================================================================
   STAGES / PORTAL
   The reel is not "a card that gets bigger" — it is a doorway. A chrome
   gate opens in 3D, a membrane of light ignites behind it, the atmosphere
   is pulled toward the centre and the camera pushes through.
   `state.page.reelOpen` (0→1) drives everything.
   ===================================================================== */
import * as THREE from 'three';
import { state } from '../state.js';
import { damp, clamp } from '../utils.js';
import { createRingGeometry } from '../geometry.js';

const MEMBRANE_VERT = /* glsl */`
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const MEMBRANE_FRAG = /* glsl */`
uniform float uTime;
uniform float uOpen;
uniform float uEnergy;
uniform vec3 uColA;
uniform vec3 uColB;
varying vec2 vUv;

float hash(vec2 p){ return fract(sin(dot(p, vec2(41.3, 289.1))) * 43758.5453); }
float noise(vec2 p){
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
}
float fbm(vec2 p){ float v = 0.0, a = 0.5; for (int i = 0; i < 5; i++){ v += a * noise(p); p *= 2.07; a *= 0.5; } return v; }

void main() {
  vec2 c = vUv - 0.5;
  float d = length(c) * 2.0;
  if (d > 1.0) discard;

  float ring = smoothstep(1.0, 0.72, d);
  float t = uTime * 0.35;
  float n = fbm(c * 3.4 + vec2(t, -t * 0.6));
  float n2 = fbm(c * 7.0 - vec2(t * 1.4, t));

  float energy = pow(1.0 - d, 1.6) * (0.35 + n * 0.9);
  energy += pow(max(0.0, n2 - 0.55), 2.0) * 2.4 * uEnergy;

  /* iris closing as the portal opens */
  float iris = smoothstep(0.98 - uOpen * 0.96, 1.0, d);
  energy *= (1.0 - iris * 0.85);

  vec3 col = mix(uColA, uColB, clamp(n * 1.2 + d * 0.4, 0.0, 1.0));
  col *= energy * (0.6 + uOpen * 1.5);

  /* hot edge */
  float edge = smoothstep(0.06, 0.0, abs(d - (0.94 - uOpen * 0.1)));
  col += edge * vec3(1.0, 0.92, 0.86) * (0.5 + uEnergy);

  float a = clamp(energy * ring * (0.35 + uOpen * 0.8), 0.0, 1.0);
  gl_FragColor = vec4(col, a);
}
`;

export class PortalStage {
  constructor(world) {
    this.world = world;
    this.q = world.quality;
    this.group = new THREE.Group();
    this.group.name = 'portal';
    this.presence = 0;
    this.targetPresence = 0;
    this.open = 0;

    this.chrome = world.materials.chrome({ color: 0xcfd3d8, roughness: 0.16, clearcoat: 0.5, env: 1.5 });
    this.dark = world.materials.matte({ color: 0x0a0a0c, roughness: 0.5, metalness: 0.6, env: 0.7 });

    /* gate: two counter-rotating rings + tick marks */
    this.ringA = new THREE.Mesh(createRingGeometry(3.05, 0.035, 8, 220), this.chrome);
    this.ringB = new THREE.Mesh(createRingGeometry(3.42, 0.012, 6, 200), this.dark);
    this.ringC = new THREE.Mesh(createRingGeometry(2.62, 0.008, 5, 180), this.chrome);
    this.group.add(this.ringA, this.ringB, this.ringC);

    /* membrane */
    this.memUniforms = {
      uTime: { value: 0 },
      uOpen: { value: 0 },
      uEnergy: { value: 0 },
      uColA: { value: new THREE.Color('#ff4d1f') },
      uColB: { value: new THREE.Color('#4f46e5') }
    };
    this.membrane = new THREE.Mesh(
      new THREE.PlaneGeometry(6.6, 6.6, 1, 1),
      new THREE.ShaderMaterial({
        uniforms: this.memUniforms,
        vertexShader: MEMBRANE_VERT,
        fragmentShader: MEMBRANE_FRAG,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        fog: false
      })
    );
    this.membrane.position.z = -0.35;
    this.group.add(this.membrane);

    /* radial light shafts */
    this.shaftGeo = new THREE.PlaneGeometry(0.16, 9, 1, 1);
    this.shaftMat = new THREE.MeshBasicMaterial({
      color: 0xffd9c6, transparent: true, opacity: 0, blending: THREE.AdditiveBlending,
      depthWrite: false, side: THREE.DoubleSide, toneMapped: false, fog: false
    });
    this.shafts = new THREE.InstancedMesh(this.shaftGeo, this.shaftMat, 14);
    this.shafts.frustumCulled = false;
    this.group.add(this.shafts);

    this.light = new THREE.PointLight(0xff6a3d, 0, 24, 2);
    this.light.position.set(0, 0, 1.4);
    this.group.add(this.light);

    this.group.position.set(0, 0, -1.2);
    world.scene.add(this.group);

    this._m4 = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
    this._e = new THREE.Euler();
    this._v = new THREE.Vector3();
    this._s = new THREE.Vector3();
  }

  static weights = { reel: 1, hero: 0.06, manifesto: 0.22, cta: 0.16, 'about-cta': 0.16, 'work-cta': 0.16 };

  setPresence(v) { this.targetPresence = v; }

  update(dt, ctx) {
    this.presence = damp(this.presence, this.targetPresence, 3.4, dt);
    const p = this.presence;
    this.group.visible = p > 0.004;
    if (!this.group.visible) return;

    const t = this.world.time;
    const w = state.world;
    const targetOpen = clamp(ctx.reelOpen || 0, 0, 1);
    this.open = damp(this.open, targetOpen, 4.2, dt);
    const o = this.open;

    /* gate opens: rings split apart and rotate in opposite directions */
    this.group.rotation.z = damp(this.group.rotation.z, (1 - o) * 0.28 + state.velocity * 0.12, 3, dt);
    this.group.position.z = damp(this.group.position.z, -1.2 + o * 2.6, 3, dt);
    this.group.scale.setScalar(damp(this.group.scale.x, (0.55 + o * 0.85) * (0.4 + p * 0.6), 3.4, dt));

    this.ringA.rotation.z = t * 0.06 + o * 1.1;
    this.ringA.scale.setScalar(1 + o * 0.16);
    this.ringB.rotation.z = -t * 0.09 - o * 0.7;
    this.ringB.scale.setScalar(1 + o * 0.3);
    this.ringC.rotation.z = t * 0.14;
    this.ringC.scale.setScalar(1 - o * 0.12);

    this.memUniforms.uTime.value = t;
    this.memUniforms.uOpen.value = o;
    this.memUniforms.uEnergy.value = 0.35 + w.intensity * 0.7 + state.absVelocity * 1.4;
    this.memUniforms.uColA.value.setRGB(state.colors.accent[0], state.colors.accent[1], state.colors.accent[2]);
    this.memUniforms.uColB.value.setRGB(state.colors.skyB[0] * 2.2 + 0.1, state.colors.skyB[1] * 2.2 + 0.12, state.colors.skyB[2] * 2.2 + 0.2);
    this.membrane.material.opacity = p;
    this.membrane.lookAt(ctx.camera.position);

    /* shafts */
    this.shaftMat.opacity = (0.05 + o * 0.2) * p;
    for (let i = 0; i < 14; i++) {
      const a = (i / 14) * Math.PI * 2 + t * 0.05;
      this._e.set(0, 0, a);
      this._q.setFromEuler(this._e);
      const len = 6 + Math.sin(t * 1.4 + i) * 1.2 + o * 3;
      this._v.set(Math.cos(a) * (1.6 + o * 1.2), Math.sin(a) * (1.6 + o * 1.2), -0.2);
      this._s.set(0.5 + o * 0.9, len / 9, 1);
      this._m4.compose(this._v, this._q, this._s);
      this.shafts.setMatrixAt(i, this._m4);
    }
    this.shafts.instanceMatrix.needsUpdate = true;

    this.light.intensity = damp(this.light.intensity, (10 + o * 130) * p, 4, dt);
    this.light.color.setRGB(0.6 + state.colors.accent[0] * 0.5, 0.32, 0.24);

    /* camera pushes through the gate */
    if (ctx.controlCamera && p > 0.6) {
      const push = 5.4 - o * 1.5;
      state.camera.tPos[0] = state.mouse.sx * 0.5;
      state.camera.tPos[1] = 0.05 + state.mouse.sy * 0.35;
      state.camera.tPos[2] = push;
      state.camera.tLook[0] = 0; state.camera.tLook[1] = 0; state.camera.tLook[2] = -1;
      state.camera.tFov = 40 + o * 7;
    }
  }

  dispose() {
    [this.ringA.geometry, this.ringB.geometry, this.ringC.geometry, this.membrane.geometry, this.shaftGeo]
      .forEach(g => g && g.dispose());
    this.membrane.material.dispose();
    this.shaftMat.dispose();
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}
