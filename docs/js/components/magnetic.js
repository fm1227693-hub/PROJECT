/* =====================================================================
   COMPONENTS / MAGNETIC
   One shared ticker pulls every [data-magnetic] element toward the cursor
   while it is inside a field around it, then springs it home. Movement is
   capped (10–18px) so buttons never feel like they are jumping.
   ===================================================================== */
import { gsap } from '../core/vendor.js';
import { DEVICE } from '../core/config.js';
import { clamp } from '../core/utils.js';
import { cursor } from '../core/cursor.js';

const MAX_PULL = 16;
const FIELD = 84;

export const magnetic = {
  items: [],
  started: false,
  mx: 0,
  my: 0,
  dirty: true,

  init() {
    if (DEVICE.touch || this.started) return;
    this.started = true;
    window.addEventListener('mousemove', e => { this.mx = e.clientX; this.my = e.clientY; }, { passive: true });
    window.addEventListener('scroll', () => { this.dirty = true; }, { passive: true });
    window.addEventListener('resize', () => { this.dirty = true; });
    gsap.ticker.add(this.tick);
  },

  scan(root = document) {
    if (DEVICE.touch) return;
    this.init();
    root.querySelectorAll('[data-magnetic]').forEach(el => {
      if (this.items.some(i => i.el === el)) return;
      const strength = parseFloat(el.dataset.magneticStrength || '0.34');
      const item = {
        el,
        strength: clamp(strength, 0, 0.6),
        xTo: gsap.quickTo(el, 'x', { duration: 0.55, ease: 'power3' }),
        yTo: gsap.quickTo(el, 'y', { duration: 0.55, ease: 'power3' }),
        rect: el.getBoundingClientRect(),
        inside: false
      };
      el.addEventListener('mouseenter', () => { item.inside = true; });
      el.addEventListener('mouseleave', () => {
        item.inside = false;
        gsap.to(el, { x: 0, y: 0, duration: 1.05, ease: 'elastic.out(1, 0.55)', overwrite: 'auto' });
        cursor.stretch(1, 0);
      });
      this.items.push(item);
    });
    this.dirty = true;
  },

  release(root = document) {
    this.items = this.items.filter(i => {
      if (root.contains(i.el)) { gsap.set(i.el, { x: 0, y: 0 }); return false; }
      return true;
    });
  },

  tick() {
    if (!this.items.length) return;
    if (magnetic.dirty) {
      magnetic.dirty = false;
      for (const i of magnetic.items) i.rect = i.el.getBoundingClientRect();
    }
    let pullX = 0, pullY = 0, maxPull = 0;
    for (const i of magnetic.items) {
      const r = i.rect;
      if (!r.width) continue;
      const cx = r.left + r.width / 2, cy = r.top + r.height / 2;
      const dx = magnetic.mx - cx, dy = magnetic.my - cy;
      const hx = r.width / 2 + FIELD, hy = r.height / 2 + FIELD;
      const inside = Math.abs(dx) < hx && Math.abs(dy) < hy;
      if (!inside) {
        if (i.active) { i.active = false; i.xTo(0); i.yTo(0); }
        continue;
      }
      /* falloff so the pull ramps in from the edge of the field */
      const fx = clamp(1 - (hx - Math.abs(dx)) / FIELD, 0, 1);
      const fy = clamp(1 - (hy - Math.abs(dy)) / FIELD, 0, 1);
      const f = 1 - Math.max(fx, fy) * 0.85;
      const tx = clamp(dx * i.strength * f, -MAX_PULL, MAX_PULL);
      const ty = clamp(dy * i.strength * f * 0.8, -MAX_PULL, MAX_PULL);
      i.active = true;
      i.xTo(tx); i.yTo(ty);
      if (i.inside) { pullX = tx; pullY = ty; maxPull = Math.max(maxPull, Math.hypot(tx, ty)); }
    }
    if (maxPull > 0.5) {
      cursor.stretch(1 + maxPull / MAX_PULL * 0.34, Math.atan2(pullY, pullX));
    } else {
      cursor.stretch(1, 0);
    }
  }
};
