/* =====================================================================
   STAGES / MANAGER
   Builds only the stages the current route needs, disposes the rest, and
   cross-fades their presence between sections so the world morphs instead
   of cutting. Exactly one stage owns the camera at any moment (the
   dominant one), which is what keeps camera moves intentional.
   ===================================================================== */
import { state } from '../state.js';
import { ROUTE_STAGES } from '../config.js';
import { clamp, lerp } from '../utils.js';
import { SculptureStage } from './sculpture.js';
import { PortalStage } from './portal.js';
import { RibbonStage } from './ribbon.js';
import { PanelsStage } from './panels.js';
import { ServiceStage } from './service.js';
import { CarouselStage } from './carousel.js';
import { OrbStage } from './orb.js';

const FACTORIES = {
  sculpture: SculptureStage,
  portal: PortalStage,
  ribbon: RibbonStage,
  panels: PanelsStage,
  serviceObject: ServiceStage,
  carousel: CarouselStage,
  orb: OrbStage,
  shards: null,   /* shard field lives inside the sculpture stage */
  dust: null,     /* ambient dust lives inside the atmosphere stage */
  labField: null  /* dust switches to curl mode on /lab */
};

const BLEND_TIME = 0.55;

export class StageManager {
  constructor(world) {
    this.world = world;
    this.stages = new Map();
    this.route = null;
    this.blend = 1;
    this.prevSection = state.section;
    this.dominant = null;
    this._ready = false;
  }

  get ready() { return this._ready; }

  setRoute(route) {
    const names = ROUTE_STAGES[route] || ROUTE_STAGES['/'];
    /* dispose what this route does not use */
    for (const [name, stage] of Array.from(this.stages.entries())) {
      if (!names.includes(name)) {
        stage.dispose();
        this.stages.delete(name);
      }
    }
    /* build what is missing (all procedural — a few ms, hidden by the curtain) */
    names.forEach(name => {
      const F = FACTORIES[name];
      if (F && !this.stages.has(name)) this.stages.set(name, new F(this.world));
    });
    this.route = route;
    this.blend = 0;
    this.prevSection = state.section;
    this._ready = true;
  }

  get(name) { return this.stages.get(name); }

  onSectionChange(name) {
    this.prevSection = state.section === name ? this.prevSection : state.section;
    this.blend = 0;
  }

  update(dt, ctx) {
    this.blend = clamp(this.blend + dt / BLEND_TIME, 0, 1);
    const b = this.blend;

    /* presence targets, cross-faded between the outgoing and incoming section */
    let best = null, bestScore = -1;
    for (const [name, stage] of this.stages) {
      const W = stage.constructor.weights || {};
      const cur = W[state.section] || 0;
      const prev = W[this.prevSection] || 0;
      const target = lerp(prev, cur, b) * (this._ready ? 1 : 0);
      stage.setPresence(target);
      if (cur > bestScore) { bestScore = cur; best = name; }
    }
    this.dominant = best;

    for (const [name, stage] of this.stages) {
      ctx.controlCamera = name === this.dominant && bestScore > 0.55;
      try {
        stage.update(dt, ctx);
      } catch (err) {
        console.error('[stage:' + name + ']', err);
        stage.setPresence(0);
      }
    }
  }

  disposeAll() {
    for (const [, stage] of this.stages) {
      try { stage.dispose(); } catch (e) { /* already gone */ }
    }
    this.stages.clear();
    this._ready = false;
  }
}
