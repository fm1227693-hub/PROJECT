/* =====================================================================
   CORE / SCROLL
   Lenis + ScrollTrigger as one system.

   Everything scroll-related is registered through a ScrollSystem so a route
   change can tear it all down in one call — no orphan triggers, no duplicate
   tickers, no leaks. Velocity is measured, smoothed and published into the
   global state so *every* layer (type, 3D, grain, marquee, post FX) reacts
   to how fast the user is actually moving.
   ===================================================================== */
import { gsap, ScrollTrigger, LenisCtor } from './vendor.js';
import { state, setSection, bus } from './state.js';
import { clamp, qsa, byId, damp } from './utils.js';

class ScrollSystem {
  constructor(name) {
    this.name = name;
    this.triggers = [];
    this.tickers = [];
    this.timers = [];
    this.cleanups = [];
    this.listeners = [];
    this.killed = false;
  }

  add(st) { if (st) this.triggers.push(st); return st; }

  /** GSAP's ticker passes (time[s], deltaTime[ms]) — systems get (dt[s], time[s]). */
  ticker(fn) {
    const wrap = (time, dtMs) => fn(Math.min(0.05, dtMs / 1000), time);
    gsap.ticker.add(wrap);
    this.tickers.push(wrap);
    return fn;
  }

  after(ms, fn) { const id = setTimeout(fn, ms); this.timers.push(id); return id; }

  on(target, type, fn, opts) {
    target.addEventListener(type, fn, opts);
    this.listeners.push([target, type, fn, opts]);
    return fn;
  }

  cleanup(fn) { this.cleanups.push(fn); return fn; }

  kill() {
    if (this.killed) return;
    this.killed = true;
    this.triggers.forEach(t => { try { t.kill(); } catch (e) { /* noop */ } });
    this.tickers.forEach(fn => gsap.ticker.remove(fn));
    this.timers.forEach(clearTimeout);
    this.listeners.forEach(([t, ty, fn, o]) => t.removeEventListener(ty, fn, o));
    this.cleanups.forEach(fn => { try { fn(); } catch (e) { /* noop */ } });
    this.triggers.length = 0; this.tickers.length = 0; this.timers.length = 0;
    this.cleanups.length = 0; this.listeners.length = 0;
  }
}

export const scroll = {
  lenis: null,
  systems: [],
  listeners: [],
  lastY: 0,
  lastT: 0,
  ready: false,

  init() {
    if (this.ready) return;
    this.lenis = new LenisCtor({
      duration: 1.25,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.6,
      gestureOrientation: 'vertical',
      syncTouch: false
    });
    window.lenis = this.lenis;

    this.lenis.on('scroll', ScrollTrigger.update);
    this.lenis.on('scroll', e => {
      const now = performance.now();
      const dt = Math.max(1, now - this.lastT) / 1000;
      this.lastT = now;
      const y = (e && e.scroll !== undefined) ? e.scroll : (window.scrollY || 0);
      const own = (y - this.lastY) / dt;
      this.lastY = y;

      state.scroll = y;
      state.rawVelocity = clamp(own, -9000, 9000);
      if (Math.abs(own) > 12) state.direction = own > 0 ? 1 : -1;
      state.isScrolling = Math.abs(own) > 8;
      clearTimeout(state.scrollTimeout);
      state.scrollTimeout = setTimeout(() => { state.isScrolling = false; }, 140);

      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      state.scrollProgress = clamp(y / max, 0, 1);

      this.listeners.forEach(fn => fn(e));
    });

    gsap.ticker.add(t => this.lenis.raf(t * 1000));
    this.ready = true;
  },

  on(fn) { this.listeners.push(fn); return () => { this.listeners = this.listeners.filter(f => f !== fn); }; },

  /** ScrollTrigger's own velocity (px/s) — used by the systems that want it raw. */
  velocity() { try { return ScrollTrigger.getVelocity(); } catch (e) { return 0; } },

  createSystem(name) {
    const sys = new ScrollSystem(name);
    this.systems.push(sys);
    return sys;
  },

  killSystem(sys) {
    if (!sys) return;
    sys.kill();
    this.systems = this.systems.filter(s => s !== sys);
  },

  killAll() {
    this.systems.slice().forEach(s => s.kill());
    this.systems.length = 0;
  },

  refresh() {
    requestAnimationFrame(() => {
      try { ScrollTrigger.refresh(); } catch (e) { /* noop */ }
    });
  },

  to(target, opts) { this.lenis && this.lenis.scrollTo(target, opts); },
  top(immediate) {
    if (!this.lenis) { window.scrollTo(0, 0); return; }
    this.lenis.scrollTo(0, { immediate: !!immediate, force: true });
    window.scrollTo(0, 0);
  },
  stop() { this.lenis && this.lenis.stop(); },
  start() { this.lenis && this.lenis.start(); },
  resize() { this.lenis && this.lenis.resize(); }
};

/* ------------------------------------------------------------------ sections */
let indicatorEls = null;
let barEl = null;

/**
 * Builds the global section tracker for the active page: drives the world
 * atmosphere (via setSection), the section indicator and the progress bar.
 */
export function buildSectionSystem(pageEl, route) {
  const sys = scroll.createSystem('sections:' + route);
  const els = qsa('[data-section]', pageEl);
  if (!els.length) return sys;

  if (!indicatorEls) {
    indicatorEls = { index: byId('secIndex'), total: byId('secTotal'), name: byId('secName') };
    barEl = document.querySelector('#scrollProgress i');
  }
  if (indicatorEls.total) indicatorEls.total.textContent = String(els.length).padStart(2, '0');

  els.forEach((el, i) => {
    const name = el.dataset.section || ('sec' + i);
    /* a pinned section is wrapped in a .pin-spacer whose height includes the
       whole pin distance — track that, or the world would change atmosphere
       halfway through a pinned moment */
    const host = (el.parentElement && el.parentElement.classList.contains('pin-spacer')) ? el.parentElement : el;
    const st = ScrollTrigger.create({
      trigger: host,
      start: 'top 68%',
      end: 'bottom 32%',
      onToggle: self => {
        if (!self.isActive) return;
        setSection(name, i, els.length);
        state.sectionIndex = i;
        if (indicatorEls.index) indicatorEls.index.textContent = String(i + 1).padStart(2, '0');
        if (indicatorEls.name) indicatorEls.name.textContent = el.dataset.secName || name;
      },
      onUpdate: self => {
        if (self.isActive) state.sectionProgress = self.progress;
      }
    });
    sys.add(st);
  });

  /* whole-page progress bar */
  if (barEl) {
    sys.add(ScrollTrigger.create({
      trigger: pageEl,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        state.scrollProgress = self.progress;
        barEl.style.transform = `scaleX(${self.progress.toFixed(4)})`;
      }
    }));
    barEl.style.transformOrigin = 'left';
    barEl.style.width = '100%';
    barEl.style.transform = 'scaleX(0)';
  }

  /* first section is active immediately */
  const first = els[0];
  setSection(first.dataset.section, 0, els.length);
  if (indicatorEls.index) indicatorEls.index.textContent = '01';
  if (indicatorEls.name) indicatorEls.name.textContent = first.dataset.secName || first.dataset.section;

  return sys;
}

/** Shared helper: smoothed velocity 0..1 for systems that need "how fast". */
export function velocity01() { return clamp(Math.abs(state.velocity), 0, 1); }

/**
 * gsap.matchMedia wrapper bound to a system so desktop/mobile variants are
 * reverted automatically when the page is torn down.
 */
export function matchMedia(sys, spec, fn) {
  const mm = gsap.matchMedia();
  mm.add(spec, ctx => {
    const out = fn(ctx);
    sys.cleanup(() => { if (typeof out === 'function') out(); });
    return out;
  });
  sys.cleanup(() => mm.revert());
  return mm;
}

export { ScrollSystem, gsap, ScrollTrigger };
