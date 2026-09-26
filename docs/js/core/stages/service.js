/* =====================================================================
   STAGES / SERVICE
   Behind the horizontal services track a single object changes nature as
   each discipline passes the centre of the screen:

     01 Real-time 3D & WebGL  → glowing wireframe cage
     02 Interactive Design    → the studio sculpture, small and precise
     03 Creative Development  → abstract digital architecture (lattice)
     04 CGI & Motion          → liquid metal simulation
     05 Spatial & Immersive   → glass + shard cluster

   `state.page.serviceIndex` (float) is written by the services scroll.
   ===================================================================== */
import * as THREE from 'three';
import { state } from '../state.js';
import { damp, clamp } from '../utils.js';
import { createFigureGeometry, createBlobGeometry, createLatticeGeometry, createShardGeometry, createRingGeometry } from '../geometry.js';
import { applyLiquidDisplacement, liquidUniforms } from '../materials.js';

export class ServiceStage {
  constructor(world) {
    this.world = world;
    this.q = world.quality;
    this.group = new THREE.Group();
    this.group.name = 'service';
    this.presence = 0;
    this.targetPresence = 0;
    this.index = 0;
    this.ownGeos = [];
    this.ownMats = [];
    this.variants = [];

    /* ---- 01 wireframe cage ---- */
    const cageGeo = new THREE.IcosahedronGeometry(1.55, 2);
    const cageMat = new THREE.MeshBasicMaterial({
      color: 0xff6a3d, wireframe: true, transparent: true, opacity: 0.85,
      blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false
    });
    const cage = new THREE.Mesh(cageGeo, cageMat);
    const cageCoreGeo = createBlobGeometry(0.72, 12);
    const cageCore = new THREE.Mesh(cageCoreGeo, world.materials.glow(0xff4d1f, 1.5, { opacity: 0.5 }));
    const v1 = new THREE.Group(); v1.add(cage, cageCore);
    this.ownGeos.push(cageGeo, cageCoreGeo);
    this.ownMats.push(cageMat);
    this.variants.push({ obj: v1, spin: 0.22, mats: [cageMat] });

    /* ---- 02 the sculpture, miniaturised ---- */
    const figGeo = createFigureGeometry({ detail: 0.55, height: 3.1, twist: 0.9 });
    const fig = new THREE.Mesh(figGeo, world.materials.chrome({ color: 0xe6e9ee, roughness: 0.1, clearcoat: 0.5, env: 1.5 }));
    const v2 = new THREE.Group(); v2.add(fig);
    this.ownGeos.push(figGeo);
    this.variants.push({ obj: v2, spin: 0.14, mats: [] });

    /* ---- 03 digital architecture ---- */
    const latGeo = createLatticeGeometry(this.q.tier >= 2 ? 70 : 40, 2.7);
    const lat = new THREE.Mesh(latGeo, world.materials.brushedSteel({ color: 0xa8adb6 }));
    const latBox = new THREE.Mesh(new THREE.BoxGeometry(2.9, 2.9, 2.9), new THREE.MeshBasicMaterial({
      color: 0x4f7dff, wireframe: true, transparent: true, opacity: 0.24, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false
    }));
    const v3 = new THREE.Group(); v3.add(lat, latBox);
    this.ownGeos.push(latGeo, latBox.geometry);
    this.ownMats.push(latBox.material);
    this.variants.push({ obj: v3, spin: 0.1, mats: [latBox.material] });

    /* ---- 04 liquid metal ---- */
    this.liquidUniforms = liquidUniforms({ disp: 0.3, freq: 0.95, flow: 0.3, pointerR: 2.0 });
    const liqMat = world.materials.chrome({ color: 0xdfe3e8, roughness: 0.07, clearcoat: 0.7, env: 1.7 });
    applyLiquidDisplacement(liqMat, this.liquidUniforms);
    const liqGeo = createBlobGeometry(1.45, this.q.tier >= 2 ? 40 : 20);
    const liq = new THREE.Mesh(liqGeo, liqMat);
    const v4 = new THREE.Group(); v4.add(liq);
    this.ownGeos.push(liqGeo);
    this.variants.push({ obj: v4, spin: 0.06, mats: [] });

    /* ---- 05 spatial cluster ---- */
    const v5 = new THREE.Group();
    const shellGeo = createBlobGeometry(1.15, 16);
    const shell = new THREE.Mesh(shellGeo, world.materials.glass({ thickness: 1.8, ior: 1.4, iridescence: 0.8, attenuation: 0x9fc4ff, attenuationDistance: 2.2, side: THREE.DoubleSide }));
    v5.add(shell);
    const shardGeo = createShardGeometry();
    const shards = new THREE.InstancedMesh(shardGeo, world.materials.chrome({ color: 0xcfd4da, roughness: 0.18 }), 18);
    shards.frustumCulled = false;
    v5.add(shards);
    const ringGeo = createRingGeometry(1.95, 0.01, 5, 160);
    const ring = new THREE.Mesh(ringGeo, world.materials.chrome({ color: 0xffffff, roughness: 0.06, env: 2 }));
    ring.rotation.x = Math.PI / 2.4;
    v5.add(ring);
    this.ownGeos.push(shellGeo, shardGeo, ringGeo);
    this.variants.push({ obj: v5, spin: 0.18, mats: [], shards, ring });

    this.variants.forEach(v => { this.group.add(v.obj); v.obj.visible = false; });

    this.light = new THREE.PointLight(0xffffff, 0, 18, 2);
    this.light.position.set(2.5, 3, 3.5);
    this.group.add(this.light);

    this.group.position.set(0, 0, -1.5);
    world.scene.add(this.group);

    this._m4 = new THREE.Matrix4();
    this._qq = new THREE.Quaternion();
    this._e = new THREE.Euler();
    this._v = new THREE.Vector3();
    this._s = new THREE.Vector3();
  }

  static weights = { services: 1, carousel: 0.1, marquee: 0.12 };

  setPresence(v) { this.targetPresence = v; }

  update(dt, ctx) {
    this.presence = damp(this.presence, this.targetPresence, 3, dt);
    const p = this.presence;
    this.group.visible = p > 0.004;
    if (!this.group.visible) return;

    const t = this.world.time;
    const w = state.world;
    const target = clamp(ctx.serviceIndex || 0, 0, this.variants.length - 1);
    this.index = damp(this.index, target, 4.5, dt);

    this.group.position.x = damp(this.group.position.x, state.mouse.sx * 1.6 - 0.4, 2.4, dt);
    this.group.position.y = damp(this.group.position.y, state.mouse.sy * 0.9 + Math.sin(t * 0.3) * 0.12, 2.4, dt);
    this.group.position.z = damp(this.group.position.z, -1.5 + Math.sin(this.index * 1.1) * 0.5, 2.4, dt);
    this.group.rotation.y += dt * (0.08 + state.absVelocity * 0.9);
    this.group.rotation.x = damp(this.group.rotation.x, -state.mouse.sy * 0.18 + state.velocity * 0.06, 2.5, dt);
    this.group.scale.setScalar((0.5 + p * 0.62) * (0.92 + w.intensity * 0.16));

    for (let i = 0; i < this.variants.length; i++) {
      const v = this.variants[i];
      const w2 = clamp(1 - Math.abs(this.index - i) * 1.35, 0, 1);
      v.obj.visible = w2 > 0.01;
      if (!v.obj.visible) continue;
      v.obj.rotation.y += dt * v.spin * (1 + state.absVelocity * 3);
      v.obj.rotation.z = Math.sin(t * 0.2 + i) * 0.08;
      const s = 0.72 + w2 * 0.42;
      v.obj.scale.setScalar(s);
      v.mats.forEach(m => { m.opacity = (0.25 + w2 * 0.75) * (0.5 + w.intensity * 0.6); });
      if (v.shards) {
        for (let k = 0; k < 18; k++) {
          const a = (k / 18) * Math.PI * 2 + t * 0.25;
          const r = 1.5 + Math.sin(t * 0.7 + k) * 0.22;
          this._v.set(Math.cos(a) * r, Math.sin(a * 1.3 + k) * 0.75, Math.sin(a) * r);
          this._e.set(a, a * 0.7, t * 0.3 + k);
          this._qq.setFromEuler(this._e);
          const sc = 0.6 + Math.sin(k * 2.1 + t) * 0.25;
          this._s.set(sc, sc, sc);
          this._m4.compose(this._v, this._qq, this._s);
          v.shards.setMatrixAt(k, this._m4);
        }
        v.shards.instanceMatrix.needsUpdate = true;
        v.ring.rotation.z = t * 0.2;
      }
    }

    if (this.liquidUniforms) {
      this.liquidUniforms.uTime.value = t;
      this.liquidUniforms.uDisp.value = 0.24 + w.distortion * 0.3 + state.absVelocity * 0.35;
      this.liquidUniforms.uFlow.value = 0.24 + state.absVelocity * 1.4;
      this.liquidUniforms.uPointer.value.set(state.mouse.sx * 2.2, state.mouse.sy * 2.2, state.mouse.speed * 1.6);
    }

    this.light.intensity = damp(this.light.intensity, (40 + w.intensity * 90) * p, 3, dt);
    this.light.color.setRGB(state.colors.accent[0] * 0.6 + 0.5, state.colors.accent[1] * 0.4 + 0.45, state.colors.accent[2] * 0.3 + 0.45);
  }

  dispose() {
    this.ownGeos.forEach(g => g && g.dispose());
    this.ownMats.forEach(m => m && m.dispose());
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}
