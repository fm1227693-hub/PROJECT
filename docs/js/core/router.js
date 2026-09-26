/* =====================================================================
   CORE / ROUTER
   Hash routing with a real transition: curtain in → tear down every scroll
   system, dispose route-scoped WebGL stages, reset scroll, build the new
   page → curtain out → intro.

   Back/forward keep working because we react to hashchange rather than
   intercepting clicks; the browser owns history.
   ===================================================================== */
import { gsap, ScrollTrigger } from './vendor.js';
import { state, resetWorldForRoute, bus } from './state.js';
import { scroll, buildSectionSystem } from './scroll.js';
import { setRouteStages } from './scene.js';
import { cursor } from './cursor.js';
import { magnetic } from '../components/magnetic.js';
import { anim } from '../components/generative.js';
import { byId, qsa } from './utils.js';

import homePage from '../pages/home.js';
import aboutPage from '../pages/about.js';
import workPage from '../pages/work.js';
import labPage from '../pages/lab.js';
import contactPage from '../pages/contact.js';

export const ROUTES = {
  '/': { page: homePage, label: 'Home', idx: '01', title: 'LUSION — Real-time Creative Production Studio' },
  '/about': { page: aboutPage, label: 'About', idx: '02', title: 'About the studio — LUSION' },
  '/work': { page: workPage, label: 'Work', idx: '03', title: 'Selected work — LUSION' },
  '/lab': { page: labPage, label: 'Lab', idx: '04', title: 'Lusion Labs — Experiments' },
  '/contact': { page: contactPage, label: 'Contact', idx: '05', title: 'Contact — LUSION' }
};

export const router = {
  current: null,
  controller: null,
  sys: null,
  secSys: null,
  busy: false,
  first: true,
  onReady: null,

  parse(hash) {
    let r = String(hash || '').replace(/^#/, '');
    if (!r || r === '/') r = '/';
    if (!ROUTES[r]) r = '/';
    return r;
  },

  init(onReady) {
    this.onReady = onReady || null;
    window.addEventListener('hashchange', () => {
      const raw = String(window.location.hash || '').replace(/^#/, '');
      if (!raw) return;                 /* empty hash = placeholder click, ignore */
      const r = this.parse(raw);
      if (r === this.current) { scroll.top(false); return; }
      this.go(r);
    });

    /* in-page route links: let the browser set the hash (history stays honest) */
    document.addEventListener('click', e => {
      const a = e.target.closest && e.target.closest('a[data-route]');
      if (!a) {
        /* placeholder links must not blow away the hash (and the route) */
        const dead = e.target.closest && e.target.closest('a[href="#"]');
        if (dead) e.preventDefault();
        return;
      }
      const r = a.dataset.route;
      if (!ROUTES[r]) return;
      if (r === this.current) { e.preventDefault(); scroll.top(false); }
      /* otherwise: default behaviour sets location.hash → hashchange → go() */
      cursor.setMode('default', true);
    });

    const r = this.parse(window.location.hash);
    this.current = r;
    this.mount(r);
    this.first = false;
  },

  /* ------------------------------------------------------------- transition */
  go(route) {
    if (this.busy || route === this.current) return;
    this.busy = true;
    const meta = ROUTES[route];
    const curtain = byId('curtain');

    scroll.stop();
    this.curtainIn(curtain, meta, () => {
      this.unmount();
      scroll.top(true);
      this.current = route;
      this.mount(route);
      this.curtainOut(curtain, () => {
        scroll.start();
        this.busy = false;
        bus.emit('route:done', route);
      });
    });
  },

  curtainIn(curtain, meta, done) {
    if (!curtain) { done(); return; }
    const label = byId('curtainLabel');
    const idx = byId('curtainIndex');
    if (label) label.textContent = meta.label;
    if (idx) idx.textContent = meta.idx;
    cursor.setMode('default', true);

    const tl = gsap.timeline({ onComplete: done });
    tl.set(curtain, { pointerEvents: 'auto' })
      .set('.curtain .c', { transformOrigin: 'bottom', scaleY: 0 })
      .to('.curtain .c2', { scaleY: 1, duration: 0.5, ease: 'power3.inOut' })
      .to('.curtain .c1', { scaleY: 1, duration: 0.55, ease: 'power3.inOut' }, '-=0.42')
      .fromTo([label, idx], { opacity: 0, y: 26 }, { opacity: 1, y: 0, duration: 0.42, stagger: 0.05, ease: 'power3.out' }, '-=0.2')
      .to([label, idx], { opacity: 0, y: -18, duration: 0.28, stagger: 0.03, ease: 'power2.in' }, '+=0.14');
  },

  curtainOut(curtain, done) {
    if (!curtain) { done(); return; }
    const tl = gsap.timeline({ onComplete: () => { curtain.style.pointerEvents = 'none'; done && done(); } });
    tl.set('.curtain .c', { transformOrigin: 'top' })
      .to('.curtain .c1', { scaleY: 0, duration: 0.62, ease: 'power3.inOut' })
      .to('.curtain .c2', { scaleY: 0, duration: 0.58, ease: 'power3.inOut' }, '-=0.5');
  },

  /* ----------------------------------------------------------------- mount */
  mount(route) {
    const meta = ROUTES[route];
    const pageEl = document.querySelector(`.page[data-page="${route}"]`);
    if (!pageEl) return;

    /* pages toggle; footer lives outside <main> and is shared */
    qsa('.page').forEach(p => p.classList.toggle('active', p === pageEl));
    document.title = meta.title;
    this.syncNav(route);

    /* world: reset damped state + build only this route's stages */
    const firstSection = pageEl.querySelector('[data-section]');
    resetWorldForRoute(route, firstSection ? firstSection.dataset.section : 'hero');
    setRouteStages(route);

    /* scroll: fresh system for the page, then section tracking.
       Order matters — the page creates its pinned triggers first, so the
       section tracker can measure the pin-spacers (full pinned range). */
    this.sys = scroll.createSystem('page:' + route);

    anim.setGroup('preview', false);
    try {
      this.controller = meta.page.mount(pageEl, this.sys) || meta.page;
    } catch (err) {
      console.error('[router] page mount failed', route, err);
      this.controller = null;
    }

    try { ScrollTrigger.refresh(); } catch (e) { /* noop */ }
    this.secSys = buildSectionSystem(pageEl, route);

    magnetic.scan(pageEl);
    scroll.refresh();
    bus.emit('route', route);
    if (this.onReady) { const f = this.onReady; this.onReady = null; f(route); }
  },

  unmount() {
    if (this.controller && this.controller.destroy) {
      try { this.controller.destroy(); } catch (e) { console.warn('[router] destroy', e); }
    }
    this.controller = null;
    scroll.killSystem(this.sys);
    scroll.killSystem(this.secSys);
    this.sys = null;
    this.secSys = null;
    /* anything left over from the outgoing page */
    qsa('.work-row, .work-tile, .lab-tile, .svc-card').forEach(el => {
      el.style.opacity = '';
      gsap.set(el, { clearProps: 'transform,opacity,filter' });
    });
    document.body.classList.remove('cursor-drag', 'cursor-label', 'cursor-hover', 'lab-focus');
  },

  syncNav(route) {
    qsa('#navPill a').forEach(a => {
      const on = a.dataset.route === route;
      a.classList.toggle('active', on);
      if (on) moveGlider(a);
    });
    qsa('#menuOverlay a').forEach(a => a.classList.toggle('active', a.dataset.route === route));
  },

  tick(dt) {
    if (this.controller && this.controller.tick) this.controller.tick(dt);
  }
};

export function moveGlider(a) {
  const g = byId('navGlider');
  if (!g || !a) return;
  gsap.to(g, {
    x: a.offsetLeft, width: a.offsetWidth, duration: 0.65, ease: 'expo.out', overwrite: 'auto'
  });
}

export function currentRoute() { return router.current; }
