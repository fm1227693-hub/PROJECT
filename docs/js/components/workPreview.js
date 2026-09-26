/* =====================================================================
   COMPONENTS / WORK PREVIEW
   The cursor-following 3D preview card used by the work index.

   Layers: two blurred colour "depth" plates behind a live generative
   canvas, plus glare + grain. The whole stack tilts and rotates from
   cursor VELOCITY (fast horizontal movement = visible yaw), settles when
   you stop, and the depth plates parallax against the canvas so the card
   reads as a solid object floating in the page.
   ===================================================================== */
import { gsap } from '../core/vendor.js';
import { state } from '../core/state.js';
import { anim } from './generative.js';
import { cursor } from '../core/cursor.js';
import { DEVICE } from '../core/config.js';
import { clamp, byId } from '../core/utils.js';

export const workPreview = {
  root: null,
  stack: null,
  depths: [],
  pv: null,
  canvas: null,
  cap: null,
  item: null,
  work: null,
  active: false,
  rx: 0, ry: 0, scale: 0.72,
  xTo: null, yTo: null,

  init() {
    if (this.root || DEVICE.touch) return;
    this.root = byId('workPreview');
    if (!this.root) return;
    this.root.innerHTML = `
      <div class="pv-stack">
        <div class="pv-depth" data-d="1"></div>
        <div class="pv-depth" data-d="2"></div>
        <div class="pv"><canvas></canvas><div class="pv-grain"></div><div class="pv-cap mono"></div></div>
      </div>`;
    this.stack = this.root.querySelector('.pv-stack');
    this.depths = Array.prototype.slice.call(this.root.querySelectorAll('.pv-depth'));
    this.pv = this.root.querySelector('.pv');
    this.canvas = this.root.querySelector('canvas');
    this.cap = this.root.querySelector('.pv-cap');

    gsap.set(this.root, { xPercent: -50, yPercent: -50, opacity: 0 });
    this.xTo = gsap.quickTo(this.root, 'x', { duration: 0.75, ease: 'power3' });
    this.yTo = gsap.quickTo(this.root, 'y', { duration: 0.75, ease: 'power3' });

    this.item = anim.add(this.canvas, 'blobs', ['#ff4d1f', '#4f46e5', '#0b0b0c'], {
      group: 'preview', force: true, active: false, interactive: false, host: this.pv, fps: 40
    });
  },

  show(work) {
    if (DEVICE.touch || !this.root) return;
    this.work = work;
    if (!this.active) {
      this.active = true;
      gsap.to(this.root, { opacity: 1, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      gsap.to(this, { scale: 1, duration: 0.85, ease: 'expo.out', overwrite: 'auto' });
      this.pv.classList.add('on');
      cursor.setLabel('View');
    }
    if (this.item) {
      this.item.kind = work.kind && anim.has(work.kind) ? work.kind : 'blobs';
      this.item.pal = work.pal;
      this.item.st = {};
      this.item.active = true;
    }
    const [a, b] = work.pal;
    this.depths[0].style.background = `radial-gradient(60% 60% at 30% 30%, ${a}, transparent 70%)`;
    this.depths[1].style.background = `radial-gradient(60% 60% at 70% 70%, ${b}, transparent 72%)`;
    this.cap.textContent = `${work.c} — ${work.y}`;
  },

  hide() {
    if (!this.active) return;
    this.active = false;
    this.work = null;
    gsap.to(this.root, { opacity: 0, duration: 0.35, ease: 'power2.in', overwrite: 'auto' });
    gsap.to(this, { scale: 0.72, duration: 0.5, ease: 'power3.in', overwrite: 'auto' });
    this.pv.classList.remove('on');
    if (this.item) this.item.active = false;
    cursor.setMode('default', true);
  },

  move(x, y) {
    if (!this.active) return;
    this.xTo(x); this.yTo(y);
  },

  tick(dt) {
    if (!this.active || !this.stack) return;
    const m = state.mouse;
    /* rotation from cursor velocity — settles to zero when you stop */
    const targetY = clamp(m.vx * 0.42, -26, 26);
    const targetX = clamp(-m.vy * 0.34, -18, 18);
    this.ry += (targetY - this.ry) * Math.min(1, dt * 7);
    this.rx += (targetX - this.rx) * Math.min(1, dt * 7);
    this.stack.style.transform =
      `scale(${this.scale.toFixed(3)}) rotateX(${this.rx.toFixed(2)}deg) rotateY(${this.ry.toFixed(2)}deg)`;
    /* depth plates drift opposite to the pointer for parallax */
    const px = (m.nx - 0.5), py = (m.ny - 0.5);
    this.depths[0].style.transform = `translateZ(-70px) scale(1.06) translate(${(-px * 26).toFixed(1)}px, ${(-py * 22).toFixed(1)}px)`;
    this.depths[1].style.transform = `translateZ(-38px) scale(1.03) translate(${(px * 20).toFixed(1)}px, ${(py * 18).toFixed(1)}px)`;
  },

  destroy() {
    if (this.item) anim.destroy(this.item);
    this.item = null;
    this.active = false;
    this.work = null;
    if (this.root) this.root.innerHTML = '';
    this.root = null;
  }
};
