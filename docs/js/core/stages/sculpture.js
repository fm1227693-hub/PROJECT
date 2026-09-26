/* =====================================================================
   STAGES / SCULPTURE
   The hero object: an abstract figurative monolith in polished metal with
   a liquid-displacement shader, a glass satellite, a chrome halo, an
   orbiting shard field and a real contact shadow.

   Its whole journey is bound to `state.page.heroAct` (0 → 1) which the home
   page derives from hero → reel → manifesto → works scroll progress:

     0.00–0.20  slow rotation, camera closes in, breathing, light lifts
     0.20–0.40  lateral drift, camera orbits, type and object share space
     0.40–0.60  passes behind the content, aggressive orbit, distortion up
     0.60–0.80  recedes, scale drops, atmosphere changes
     0.80–1.00  leaves the world
   ===================================================================== */
import * as THREE from 'three';
import { state } from '../state.js';
import { damp, piecewise, clamp } from '../utils.js';
import { createFigureGeometry, createShardGeometry, createPlinthGeometry, createGroundGeometry, createRingGeometry, createBlobGeometry } from '../geometry.js';
import { applyLiquidDisplacement, liquidUniforms } from '../materials.js';

const SHARD_COUNT = 34;

export class SculptureStage {
  constructor(world) {
    this.world = world;
    this.q = world.quality;
    this.group = new THREE.Group();
    this.group.name = 'sculpture';
    this.presence = 0;
    this.targetPresence = 0;
    this.breath = 0;

    /* ---- materials ---- */
    this.dispUniforms = liquidUniforms({ disp: 0.085, freq: 1.15, flow: 0.17, pointerR: 1.5 });
    this.chrome = world.materials.chrome({ roughness: 0.115, clearcoat: 0.45, env: 1.4 });
    applyLiquidDisplacement(this.chrome, this.dispUniforms);

    this.darkChrome = world.materials.chrome({ color: 0x9aa0a8, roughness: 0.28, clearcoat: 0.2, env: 1.1 });
    this.glassMat = world.materials.glass({ thickness: 1.4, ior: 1.55, iridescence: 0.55, attenuation: 0xff9a6a, attenuationDistance: 2.6, roughness: 0.045 });
    this.matte = world.materials.matte({ color: 0x101014, roughness: 0.85, metalness: 0.15, env: 0.45 });

    /* ---- the figure ---- */
    this.figureGeo = createFigureGeometry({ detail: this.q.sculptureDetail, height: 4.25, twist: 0.5 });
    this.figure = new THREE.Mesh(this.figureGeo, this.chrome);
    this.figure.position.y = 0.1;
    this.figure.castShadow = this.q.shadows;
    this.figure.receiveShadow = false;
    this.figure.name = 'figure';
    this.group.add(this.figure);

    /* ---- glass satellite ---- */
    this.coreGeo = createBlobGeometry(0.44, this.q.tier >= 2 ? 24 : 12);
    this.core = new THREE.Mesh(this.coreGeo, this.glassMat);
    this.core.scale.set(1, 1.25, 1);
    this.core.position.set(1.15, 1.55, 0.4);
    this.core.name = 'core';
    this.group.add(this.core);

    /* ---- halo ring ---- */
    this.haloGeo = createRingGeometry(1.62, 0.016, 6, 200);
    this.halo = new THREE.Mesh(this.haloGeo, this.darkChrome);
    this.halo.position.y = 2.05;
    this.halo.rotation.set(Math.PI / 2.35, 0.2, 0);
    this.group.add(this.halo);

    this.halo2Geo = createRingGeometry(2.05, 0.008, 5, 180);
    this.halo2 = new THREE.Mesh(this.halo2Geo, this.darkChrome);
    this.halo2.position.y = 0.9;
    this.halo2.rotation.set(Math.PI / 1.9, -0.4, 0.2);
    this.group.add(this.halo2);

    /* ---- shard field ---- */
    this.shardGeo = createShardGeometry();
    this.shards = new THREE.InstancedMesh(this.shardGeo, this.darkChrome, SHARD_COUNT);
    this.shards.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    this.shardData = [];
    for (let i = 0; i < SHARD_COUNT; i++) {
      this.shardData.push({
        r: 1.9 + Math.random() * 2.4,
        a: Math.random() * Math.PI * 2,
        y: (Math.random() - 0.45) * 4.2,
        s: 0.35 + Math.random() * 1.1,
        sp: 0.05 + Math.random() * 0.22,
        rx: Math.random() * Math.PI,
        ry: Math.random() * Math.PI,
        rz: Math.random() * Math.PI
      });
    }
    this.shards.castShadow = false;
    this.shards.frustumCulled = false;
    this.group.add(this.shards);

    /* ---- plinth + ground ---- */
    this.plinthGeo = createPlinthGeometry(1.02, 0.16);
    this.plinth = new THREE.Mesh(this.plinthGeo, this.matte);
    this.plinth.position.y = -2.02;
    this.plinth.receiveShadow = this.q.shadows;
    this.plinth.castShadow = this.q.shadows;
    this.group.add(this.plinth);

    this.groundGeo = createGroundGeometry(46);
    this.shadowMat = new THREE.ShadowMaterial({ opacity: 0.3, color: 0x000000, transparent: true });
    this.ground = new THREE.Mesh(this.groundGeo, this.shadowMat);
    this.ground.position.y = -2.11;
    this.ground.receiveShadow = true;
    this.group.add(this.ground);

    /* soft baked contact shadow (always on — grounds the object even with no shadow map) */
    this.contactTex = makeContactTexture();
    this.contactMat = new THREE.MeshBasicMaterial({ map: this.contactTex, transparent: true, opacity: 0.5, depthWrite: false, color: 0x000000, blending: THREE.MultiplyBlending, toneMapped: false });
    this.contact = new THREE.Mesh(new THREE.PlaneGeometry(6.4, 6.4), this.contactMat);
    this.contact.rotation.x = -Math.PI / 2;
    this.contact.position.y = -2.09;
    this.group.add(this.contact);

    /* ---- dedicated rim light so the object separates from the sky ---- */
    this.rim = new THREE.SpotLight(0xffd8c4, 0, 26, Math.PI / 5, 0.7, 2);
    this.rim.position.set(-4.5, 4.2, -5.5);
    this.rim.target = this.figure;
    this.group.add(this.rim);

    this.key = new THREE.SpotLight(0xffffff, 0, 30, Math.PI / 4.2, 0.85, 2);
    this.key.position.set(5.2, 6.4, 4.6);
    this.key.target = this.figure;
    if (this.q.shadows) {
      this.key.castShadow = true;
      this.key.shadow.mapSize.set(this.q.tier >= 2 ? 1024 : 512, this.q.tier >= 2 ? 1024 : 512);
      this.key.shadow.camera.near = 1;
      this.key.shadow.camera.far = 26;
      this.key.shadow.bias = -0.0012;
      this.key.shadow.normalBias = 0.022;
      this.key.shadow.radius = 3;
    }
    this.group.add(this.key);

    this.group.position.set(1.5, -0.35, 0);
    world.scene.add(this.group);

    this._m4 = new THREE.Matrix4();
    this._q = new THREE.Quaternion();
    this._e = new THREE.Euler();
    this._v3 = new THREE.Vector3();
    this._s3 = new THREE.Vector3();
    this._proj = new THREE.Vector3();
  }

  /** sections this object lives in, with weights */
  static weights = { hero: 1, reel: 1, manifesto: 0.72, works: 0.34, 'about-hero': 1, philosophy: 0.5, values: 0.62, team: 0.3, timeline: 0.34, 'work-hero': 0.4 };

  setPresence(v) { this.targetPresence = v; }

  update(dt, ctx) {
    this.presence = damp(this.presence, this.targetPresence, 3.2, dt);
    const p = this.presence;
    this.group.visible = p > 0.004;
    if (!this.group.visible) return;

    const t = this.world.time;
    const w = state.world;
    const m = state.mouse;
    const act = clamp(ctx.heroAct !== undefined ? ctx.heroAct : 0, 0, 1);
    const isHome = state.route === '/';

    /* ---------- choreography ---------- */
    const lateral = isHome ? piecewise(act, [[0, 0], [0.22, -0.35], [0.42, -2.05], [0.6, -1.1], [0.8, 0.5], [1, 1.4]])
      : piecewise(ctx.pageProgress || 0, [[0, 1.2], [0.5, -1.1], [1, -2.2]]);
    const depth = isHome ? piecewise(act, [[0, 0], [0.22, 0.5], [0.42, -0.7], [0.6, -3.0], [0.8, -6.6], [1, -11]])
      : piecewise(ctx.pageProgress || 0, [[0, -0.6], [0.5, -2.4], [1, -5.5]]);
    const lift = isHome ? piecewise(act, [[0, 0], [0.4, 0.15], [0.62, 0.7], [1, 1.9]])
      : piecewise(ctx.pageProgress || 0, [[0, 0], [0.5, 0.4], [1, 1.0]]);
    const scale = (isHome ? piecewise(act, [[0, 1], [0.18, 1.075], [0.42, 1.02], [0.62, 0.86], [0.8, 0.5], [1, 0.16]])
      : piecewise(ctx.pageProgress || 0, [[0, 0.92], [0.5, 0.8], [1, 0.4]])) * (0.35 + p * 0.65);
    const spin = isHome ? piecewise(act, [[0, 0], [0.2, 0.55], [0.42, 1.45], [0.62, 2.5], [0.8, 3.3], [1, 3.9]])
      : (ctx.pageProgress || 0) * 2.2;

    /* breathing + idle float — the object is never fully still */
    this.breath = damp(this.breath, 1, 2, dt);
    const breathe = Math.sin(t * 0.55) * 0.018 + Math.sin(t * 0.23) * 0.012;
    const floatY = Math.sin(t * 0.38) * 0.075;

    this.group.position.x = damp(this.group.position.x, (isHome ? 1.5 : 1.9) + lateral, 3.4, dt);
    this.group.position.y = damp(this.group.position.y, -0.35 + lift + floatY, 3.4, dt);
    this.group.position.z = damp(this.group.position.z, depth, 3.0, dt);
    this.group.scale.setScalar(Math.max(0.001, scale * (1 + breathe)));

    /* rotation is scroll-driven, never a mindless continuous spin */
    const targetRotY = spin * Math.PI * 0.62 + m.sx * 0.34 + state.velocity * 0.5;
    this.group.rotation.y = damp(this.group.rotation.y, targetRotY, 4.5, dt);
    this.group.rotation.z = damp(this.group.rotation.z, Math.sin(t * 0.21) * 0.035 - state.velocity * 0.06, 3, dt);
    this.group.rotation.x = damp(this.group.rotation.x, m.sy * 0.07 + state.absVelocity * 0.05, 3, dt);

    /* ---------- material response ---------- */
    const dispTarget = (isHome ? piecewise(act, [[0, 0.075], [0.3, 0.1], [0.5, 0.2], [0.7, 0.34], [1, 0.5]]) : 0.11)
      + w.distortion * 0.22 + state.absVelocity * 0.16;
    this.dispUniforms.uDisp.value = damp(this.dispUniforms.uDisp.value, dispTarget, 3, dt);
    this.dispUniforms.uTime.value = t;
    this.dispUniforms.uFlow.value = 0.14 + w.intensity * 0.24 + state.absVelocity * 0.9;
    this.dispUniforms.uFreq.value = 1.05 + w.distortion * 0.9;
    /* pointer pushes the liquid surface */
    this._proj.set(m.sx * 3.2, m.sy * 2.4, 0);
    this.dispUniforms.uPointer.value.copy(this._proj);
    this.dispUniforms.uPointer.value.z = damp(this.dispUniforms.uPointer.value.z, m.speed * 1.4 + 0.25, 4, dt);

    this.chrome.envMapIntensity = 1.25 + w.intensity * 0.5;
    this.chrome.color.setRGB(
      0.86 - w.dark * 0.42, 0.875 - w.dark * 0.42, 0.9 - w.dark * 0.4
    );
    this.glassMat.envMapIntensity = 1.3 + w.intensity * 0.6;

    /* ---------- satellites ---------- */
    const ca = t * 0.32;
    this.core.position.set(Math.cos(ca) * 1.28, 1.45 + Math.sin(t * 0.5) * 0.18, Math.sin(ca) * 1.05);
    this.core.rotation.y = t * 0.4;
    this.core.rotation.x = Math.sin(t * 0.3) * 0.2;
    this.core.visible = this.q.transmission || p > 0.4;
    this.core.scale.setScalar((0.7 + p * 0.5) * (1 + Math.sin(t * 1.6) * 0.02));

    this.halo.rotation.z = t * 0.11 + act * 1.6;
    this.halo.rotation.y = Math.sin(t * 0.18) * 0.24;
    this.halo2.rotation.z = -t * 0.08;
    this.halo.scale.setScalar(1 + w.intensity * 0.06);

    /* shards */
    const speed = 0.35 + w.particleSpeed * 0.8 + state.absVelocity * 2.4;
    for (let i = 0; i < SHARD_COUNT; i++) {
      const s = this.shardData[i];
      s.a += s.sp * dt * speed;
      const rr = s.r * (1 + Math.sin(t * 0.4 + i) * 0.05);
      this._v3.set(Math.cos(s.a) * rr, s.y + Math.sin(t * 0.5 + i * 0.7) * 0.22, Math.sin(s.a) * rr * 0.82);
      this._e.set(s.rx + t * s.sp * 0.8, s.ry + t * s.sp * 0.6, s.rz);
      this._q.setFromEuler(this._e);
      const sc = s.s * (0.5 + p * 0.7) * (1 + w.intensity * 0.25);
      this._s3.set(sc, sc, sc);
      this._m4.compose(this._v3, this._q, this._s3);
      this.shards.setMatrixAt(i, this._m4);
    }
    this.shards.instanceMatrix.needsUpdate = true;

    /* ---------- lights ---------- */
    const liftI = 0.55 + w.intensity * 0.7 + p * 0.35;
    this.key.intensity = damp(this.key.intensity, 190 * liftI * p, 3, dt);
    this.rim.intensity = damp(this.rim.intensity, 120 * (0.4 + w.dark) * p, 3, dt);
    this.rim.color.setRGB(
      0.55 + state.colors.accent[0] * 0.6,
      0.5 + state.colors.accent[1] * 0.35,
      0.5 + state.colors.accent[2] * 0.3
    );

    this.shadowMat.opacity = 0.3 * p * (1 - w.dark * 0.55);
    this.contactMat.opacity = 0.46 * p * (1 - w.dark * 0.5);
    this.ground.visible = this.q.shadows;
    this.plinth.visible = p > 0.25;

    /* ---------- camera choreography ---------- */
    if (ctx.controlCamera && p > 0.55) {
      const angle = isHome ? piecewise(act, [[0, 0], [0.2, 0.22], [0.42, 0.72], [0.62, 1.28], [0.8, 1.62], [1, 1.86]])
        : piecewise(ctx.pageProgress || 0, [[0, -0.25], [0.5, 0.35], [1, 0.8]]);
      const dist = isHome ? piecewise(act, [[0, 7.5], [0.2, 6.35], [0.42, 7.0], [0.62, 8.1], [0.8, 9.6], [1, 11.5]])
        : piecewise(ctx.pageProgress || 0, [[0, 7.4], [0.5, 8.2], [1, 9.6]]);
      const camY = (isHome ? piecewise(act, [[0, 0.15], [0.45, 0.42], [0.7, 0.9], [1, 1.5]]) : 0.3) + m.sy * 0.42;
      const camX = Math.sin(angle) * dist + m.sx * 0.75 + this.group.position.x * 0.42;
      const camZ = Math.cos(angle) * dist + state.absVelocity * 0.5;
      state.camera.tPos[0] = camX;
      state.camera.tPos[1] = camY;
      state.camera.tPos[2] = camZ;
      state.camera.tLook[0] = this.group.position.x * 0.72;
      state.camera.tLook[1] = this.group.position.y * 0.55 + 0.25;
      state.camera.tLook[2] = this.group.position.z * 0.35;
      state.camera.tFov = isHome ? piecewise(act, [[0, 34], [0.4, 37], [0.75, 41], [1, 44]]) : 36;
    }
  }

  /**
   * Swap the procedural figure for a real GLB sculpture when one is provided
   * (assets/3d/hero.glb). Materials are rebuilt so the imported mesh picks up
   * the same chrome + liquid displacement treatment.
   */
  attachModel(model) {
    if (!model) return;
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const k = 4.25 / Math.max(size.y || 1, 0.001);
    model.scale.setScalar(k);
    const center = box.getCenter(new THREE.Vector3()).multiplyScalar(k);
    model.position.sub(center);
    model.position.y += (size.y * k) / 2 - 2.0;
    model.traverse(o => {
      if (!o.isMesh) return;
      o.castShadow = this.q.shadows;
      o.receiveShadow = false;
      const m = this.world.materials.chrome({ color: 0xe4e7ec, roughness: 0.12, clearcoat: 0.5, env: 1.45 });
      applyLiquidDisplacement(m, this.dispUniforms);
      o.material = m;
    });
    this.model = model;
    this.group.add(model);
    this.figure.visible = false;
  }

  dispose() {
    [this.figureGeo, this.coreGeo, this.haloGeo, this.halo2Geo, this.shardGeo, this.plinthGeo, this.groundGeo, this.contact.geometry]
      .forEach(g => g && g.dispose());
    this.contactTex.dispose();
    this.contactMat.dispose();
    this.shadowMat.dispose();
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}

function makeContactTexture() {
  const s = 256;
  const c = document.createElement('canvas');
  c.width = c.height = s;
  const ctx = c.getContext('2d');
  const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
  g.addColorStop(0, 'rgba(255,255,255,0.95)');
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)');
  g.addColorStop(0.7, 'rgba(255,255,255,0.12)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, s, s);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}
