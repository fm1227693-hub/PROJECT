/* =====================================================================
   CORE / CURSOR
   Dot + ring with real inertia, velocity stretch and semantic states:

     DEFAULT   small dot, tight ring
     LINK      ring opens
     VIEW      filled label disc (work rows)
     DRAG      wide ring (carousel)
     OPEN      filled label disc (links out / modals)
     PLAY      filled label disc (reel, lab tiles)
     MAGNETIC  ring stretches toward the element being pulled

   Disabled entirely on touch devices. Never lags: position is driven by
   gsap.quickTo, deformation by the shared ticker.
   ===================================================================== */
import { gsap } from './vendor.js';
import { state } from './state.js';
import { DEVICE } from './config.js';
import { byId, clamp } from './utils.js';

export const cursor = {
  enabled: false,
  dot: null,
  ring: null,
  label: null,
  mode: 'default',
  _stretch: 1,
  _angle: 0,

  init() {
    if (DEVICE.touch || this.enabled) return;
    this.dot = byId('cursor');
    this.ring = byId('cursorRing');
    this.label = byId('cursorLabel');
    if (!this.dot || !this.ring) return;

    this.enabled = true;
    document.body.classList.add('has-cursor');

    gsap.set(this.dot, { xPercent: -50, yPercent: -50 });
    gsap.set(this.ring, { xPercent: -50, yPercent: -50 });
    const dx = gsap.quickTo(this.dot, 'x', { duration: 0.1, ease: 'power3' });
    const dy = gsap.quickTo(this.dot, 'y', { duration: 0.1, ease: 'power3' });
    const rx = gsap.quickTo(this.ring, 'x', { duration: 0.48, ease: 'power3' });
    const ry = gsap.quickTo(this.ring, 'y', { duration: 0.48, ease: 'power3' });
    this._rx = rx; this._ry = ry;

    const onMove = e => {
      state.mouse.x = e.clientX; state.mouse.y = e.clientY;
      dx(e.clientX); dy(e.clientY); rx(e.clientX); ry(e.clientY);
      if (!state.mouse.inside) { state.mouse.inside = true; document.body.classList.remove('cursor-hidden'); }
    };
    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mouseleave', () => { state.mouse.inside = false; document.body.classList.add('cursor-hidden'); });
    window.addEventListener('mouseenter', () => { state.mouse.inside = true; document.body.classList.remove('cursor-hidden'); });
    window.addEventListener('blur', () => document.body.classList.add('cursor-hidden'));

    /* semantic states — delegated so dynamic content works */
    document.addEventListener('mouseover', e => {
      const labelled = e.target.closest && e.target.closest('[data-cursor]');
      const hoverable = e.target.closest && e.target.closest('a, button, input, textarea, .work-row, .work-tile, .lab-tile, .member, .value-row, .svc-card, .stat, .award-row, .tl-row');
      if (labelled) {
        this.setLabel(labelled.dataset.cursor);
      } else if (hoverable) {
        this.setMode('link');
      } else {
        this.setMode('default');
      }
    });

    document.addEventListener('mousedown', () => this.setMode(this.mode === 'default' ? 'press' : this.mode, true));
    document.addEventListener('mouseup', () => this.setMode('default'));

    /* velocity stretch */
    gsap.ticker.add(this._tick);
    this._cleanup = () => {
      gsap.ticker.remove(this._tick);
      window.removeEventListener('mousemove', onMove);
    };
  },

  _tick: null,

  setMode(mode, force) {
    if (!this.enabled) return;
    if (!force && this.mode === mode) return;
    this.mode = mode;
    const b = document.body.classList;
    b.toggle('cursor-label', mode === 'view' || mode === 'open' || mode === 'play' || mode === 'drag' || mode === 'send');
    b.toggle('cursor-hover', mode === 'link');
    b.toggle('cursor-drag', mode === 'drag');
    if (mode === 'default' || mode === 'link' || mode === 'press') this.label && (this.label.textContent = '');
    if (mode === 'press') this.ring.style.transform = '';
  },

  setLabel(text) {
    if (!this.enabled) return;
    const t = String(text || '').toLowerCase();
    if (this.label) this.label.textContent = t;
    this.setMode(t, true);
  },

  /** magnetic pull — the ring stretches toward whatever is being attracted */
  stretch(amount, angle) {
    if (!this.enabled || !this.ring) return;
    this._stretch = clamp(amount, 1, 2.4);
    this._angle = angle || 0;
  },

  destroy() {
    if (this._cleanup) this._cleanup();
    this.enabled = false;
  }
};

/* the ticker is attached after the object literal so `this` resolves */
cursor._tick = function () {
  if (!cursor.enabled || !cursor.ring) return;
  const m = state.mouse;
  const speed = clamp(Math.hypot(m.vx, m.vy) / 34, 0, 1.6);
  const ang = Math.atan2(m.vy, m.vx) * 180 / Math.PI;
  const sx = 1 + speed * 0.34 * (cursor._stretch > 1 ? 0.4 : 1);
  const sy = 1 - speed * 0.2 * (cursor._stretch > 1 ? 0.4 : 1);
  const st = cursor._stretch;
  cursor.ring.style.setProperty('--csx', (sx * st).toFixed(3));
  cursor.ring.style.setProperty('--csy', (sy / Math.sqrt(st)).toFixed(3));
  cursor.ring.style.setProperty('--crot', (speed > 0.16 ? ang : cursor._lastAngle || 0).toFixed(1) + 'deg');
  if (speed > 0.16) cursor._lastAngle = ang;
};
