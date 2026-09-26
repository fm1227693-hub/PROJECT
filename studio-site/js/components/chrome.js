/* =====================================================================
   COMPONENTS / CHROME
   The persistent furniture: header, nav glider, fullscreen menu, footer
   wordmark and the GMT clock. One set of listeners for the whole session.
   ===================================================================== */
import { gsap } from '../core/vendor.js';
import { state, bus } from '../core/state.js';
import { scroll } from '../core/scroll.js';
import { moveGlider } from '../core/router.js';
import { byId, qs, qsa, clamp, pad2 } from '../core/utils.js';
import { DEVICE } from '../core/config.js';

export const chrome = {
  header: null,
  menuOpen: false,
  clockAcc: 0,
  bound: false,

  init() {
    if (this.bound) return;
    this.bound = true;
    this.header = byId('header');

    /* ------------------------------------------------------- header hide */
    let lastY = 0;
    scroll.on(e => {
      const y = (e && e.scroll !== undefined) ? e.scroll : window.scrollY;
      if (!this.header) return;
      const down = y > lastY && y > 160;
      lastY = y;
      if (this.menuOpen) return;
      this.header.classList.toggle('hidden', down && !state.isHoverNav);
    });

    /* --------------------------------------------------------- nav glider */
    const pill = byId('navPill');
    if (pill) {
      qsa('a', pill).forEach(a => {
        a.addEventListener('mouseenter', () => { state.isHoverNav = true; moveGlider(a); });
      });
      pill.addEventListener('mouseleave', () => {
        state.isHoverNav = false;
        const active = qs('a.active', pill);
        if (active) moveGlider(active);
        this.header && this.header.classList.remove('hidden');
      });
    }

    /* --------------------------------------------------------------- menu */
    const btn = byId('menuBtn');
    if (btn) btn.addEventListener('click', () => this.toggleMenu());
    window.addEventListener('keydown', e => { if (e.key === 'Escape' && this.menuOpen) this.toggleMenu(false); });
    qsa('#menuOverlay a').forEach(a => a.addEventListener('click', () => this.toggleMenu(false)));
    bus.on('route', () => this.toggleMenu(false));

    /* -------------------------------------------------- footer wordmark */
    const giant = byId('giant');
    if (giant) {
      const letters = qsa('span', giant);
      if (!DEVICE.touch) {
        /* per-letter hover lift (GSAP owns the letters) */
        letters.forEach((l, i) => {
          l._yTo = gsap.quickTo(l, 'y', { duration: 0.9, ease: 'elastic.out(1, 0.5)' });
          l._rTo = gsap.quickTo(l, 'rotate', { duration: 0.9, ease: 'elastic.out(1, 0.55)' });
          l.addEventListener('mouseenter', () => { l._yTo(-26 - i * 1.6); l._rTo(i % 2 ? 4 : -4); });
          l.addEventListener('mouseleave', () => { l._yTo(0); l._rTo(0); });
        });
      }
      /* the whole wordmark reacts to scroll velocity (container, so it never
         fights the letter transforms) */
      gsap.ticker.add(() => {
        const v = clamp(state.velocity, -1, 1);
        gsap.set(giant, { y: v * 12, skewX: v * 1.6, scaleY: 1 - Math.abs(v) * 0.02 });
      });
    }

    /* ---------------------------------------------------------- clocks */
    gsap.ticker.add((t, dtMs) => {
      this.clockAcc += dtMs / 1000;
      if (this.clockAcc < 1) return;
      this.clockAcc = 0;
      const d = new Date();
      const s = `${pad2(d.getUTCHours())}:${pad2(d.getUTCMinutes())}:${pad2(d.getUTCSeconds())} GMT`;
      const mc = byId('menuClock');
      if (mc) mc.textContent = s;
    });
  },

  toggleMenu(force) {
    const open = force !== undefined ? !!force : !this.menuOpen;
    if (open === this.menuOpen) return;
    this.menuOpen = open;
    document.body.classList.toggle('menu-open', open);
    const links = qsa('#menuOverlay li a');
    const foot = qs('#menuOverlay .menu-foot');

    if (open) {
      scroll.stop();
      this.header && this.header.classList.remove('hidden');
      gsap.fromTo(links, { y: 70, opacity: 0, rotate: 2.5 },
        { y: 0, opacity: 1, rotate: 0, duration: 0.95, stagger: 0.055, ease: 'expo.out', delay: 0.14 });
      gsap.fromTo(foot, { opacity: 0 }, { opacity: 1, duration: 0.6, delay: 0.5 });
      state.page.converge = 0.5;
    } else {
      scroll.start();
      gsap.to(links, { y: -34, opacity: 0, duration: 0.4, stagger: 0.03, ease: 'power2.in' });
      gsap.to(foot, { opacity: 0, duration: 0.3 });
      state.page.converge = 0;
      scroll.refresh();
    }
  }
};
