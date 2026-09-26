/* =====================================================================
   STAGES / RIBBON
   A polished chrome filament that draws itself through space as the user
   scrolls. Used by the manifesto (one continuous line under the words),
   the about philosophy and the timeline. `state.page.line` (0→1) is the
   scrub value; the leading tip carries a small point of light.
   ===================================================================== */
import * as THREE from 'three';
import { state } from '../state.js';
import { damp, clamp } from '../utils.js';
import { createRibbonGeometry } from '../geometry.js';

export class RibbonStage {
  constructor(world) {
    this.world = world;
    this.group = new THREE.Group();
    this.group.name = 'ribbon';
    this.presence = 0;
    this.targetPresence = 0;
    this.drawn = 0;

    this.chrome = world.materials.chrome({ color: 0xe8eaee, roughness: 0.09, clearcoat: 0.6, env: 1.6 });
    this.dark = world.materials.brushedSteel({ color: 0x6f737a });

    this.geoA = createRibbonGeometry({ turns: 2.2, radius: 2.9, height: 5.6, tube: 0.042, tubular: 460, radial: 8 });
    this.ribbonA = new THREE.Mesh(this.geoA, this.chrome);
    this.ribbonA.scale.z = 0.42;
    this.ribbonA.castShadow = false;
    this.group.add(this.ribbonA);

    this.geoB = createRibbonGeometry({ turns: 1.4, radius: 3.6, height: 4.4, tube: 0.016, tubular: 320, radial: 6, steps: 90 });
    this.ribbonB = new THREE.Mesh(this.geoB, this.dark);
    this.ribbonB.scale.z = 0.3;
    this.ribbonB.rotation.y = 0.7;
    this.group.add(this.ribbonB);

    this.indexCountA = this.geoA.index ? this.geoA.index.count : this.geoA.attributes.position.count;
    this.indexCountB = this.geoB.index ? this.geoB.index.count : this.geoB.attributes.position.count;

    /* leading tip */
    this.tipMat = new THREE.MeshBasicMaterial({ color: 0xff6a3d, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false });
    this.tip = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 12), this.tipMat);
    this.group.add(this.tip);
    this.tipLight = new THREE.PointLight(0xff6a3d, 0, 9, 2);
    this.group.add(this.tipLight);

    this.curveA = this.geoA.userData.curve;
    this.group.position.set(-1.2, 0.1, -0.6);
    world.scene.add(this.group);
    this._v = new THREE.Vector3();
  }

  static weights = {
    manifesto: 1, works: 0.3, philosophy: 0.9, timeline: 0.8, values: 0.4,
    'work-hero': 0.5, 'work-grid': 0.35, 'lab-hero': 0.3, brands: 0.4, stats: 0.2
  };

  setPresence(v) { this.targetPresence = v; }

  update(dt, ctx) {
    this.presence = damp(this.presence, this.targetPresence, 3, dt);
    const p = this.presence;
    this.group.visible = p > 0.004;
    if (!this.group.visible) return;

    const t = this.world.time;
    const w = state.world;
    const line = clamp(ctx.line !== undefined ? ctx.line : (ctx.pageProgress || 0), 0, 1);
    this.drawn = damp(this.drawn, line, 5, dt);

    this.geoA.setDrawRange(0, Math.max(3, Math.floor(this.indexCountA * this.drawn)));
    this.geoB.setDrawRange(0, Math.max(3, Math.floor(this.indexCountB * clamp(this.drawn * 1.12 - 0.06, 0, 1))));

    this.group.rotation.y = damp(this.group.rotation.y, -0.35 + state.mouse.sx * 0.5 + this.drawn * 0.5, 2.4, dt);
    this.group.rotation.z = Math.sin(t * 0.16) * 0.05 - state.velocity * 0.08;
    this.group.position.x = damp(this.group.position.x, -1.2 + state.mouse.sx * 0.8 + this.drawn * 1.4, 2.4, dt);
    this.group.position.y = damp(this.group.position.y, 0.1 + this.drawn * 0.5 + state.mouse.sy * 0.4, 2.4, dt);
    this.group.scale.setScalar(0.55 + p * 0.5 + w.intensity * 0.12);

    this.chrome.envMapIntensity = 1.3 + w.intensity * 0.7 + this.drawn * 0.4;

    if (this.curveA) {
      this.curveA.getPointAt(clamp(this.drawn, 0.0001, 0.9999), this._v);
      this._v.z *= 0.42;
      this.tip.position.copy(this._v);
      const pulse = 0.6 + Math.sin(t * 4) * 0.18 + state.absVelocity * 0.6;
      this.tip.scale.setScalar(pulse * (0.5 + p * 0.8));
      this.tipMat.opacity = p * (0.5 + state.absVelocity * 0.5);
      this.tipMat.color.setRGB(state.colors.accent[0], state.colors.accent[1], state.colors.accent[2]);
      this.tipLight.position.copy(this._v);
      this.tipLight.intensity = p * (6 + state.absVelocity * 22);
    }
  }

  dispose() {
    this.geoA.dispose(); this.geoB.dispose();
    this.tip.geometry.dispose(); this.tipMat.dispose();
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}
