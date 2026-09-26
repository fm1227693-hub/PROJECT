/* =====================================================================
   PAGE / LAB
   Twelve experiments, twelve different algorithms. Only the tiles you can
   actually see are drawing (IntersectionObserver), the whole grid pauses
   when you leave the page or hide the tab, pixel ratio is capped, and any
   tile can be pulled out of the grid and expanded in place with a FLIP.
   ===================================================================== */
import { gsap, ScrollTrigger } from '../core/vendor.js';
import { state } from '../core/state.js';
import { scroll } from '../core/scroll.js';
import { cursor } from '../core/cursor.js';
import { bindReveals } from '../components/textReveal.js';
import { anim } from '../components/generative.js';
import { magnetic } from '../components/magnetic.js';
import { LABS } from '../data/content.js';
import { byId, qs, qsa, clamp } from '../core/utils.js';
import { DEVICE } from '../core/config.js';

/* frame caps: idle tiles draw slowly, hovered/expanded tiles draw fast */
const FPS_IDLE = DEVICE.touch ? 18 : 28;
const FPS_HOT = DEVICE.touch ? 26 : 60;

export const labPage = {
  route: '/lab',
  sys: null,
  pageEl: null,
  tiles: [],
  expanded: null,
  rect: null,

  mount(pageEl, sys) {
    this.pageEl = pageEl;
    this.sys = sys;
    this.buildGrid();
    this.createHeroScroll(sys);
    this.createGridScroll(sys);
    bindReveals(pageEl, sys);
    magnetic.scan(pageEl);
    anim.setGroup('lab', true);
    state.page.spread = 13;
    state.page.converge = 0.35;
    scroll.refresh();
  },

  buildGrid() {
    const host = byId('labGrid');
    if (!host) return;
    if (!host.children.length) {
      host.innerHTML = LABS.map((l, i) => `
        <article class="lab-tile" data-i="${i}" data-cursor="Play" tabindex="0">
          <canvas></canvas>
          <div class="cap">
            <div><b>${l.t}</b><small>${l.s}</small></div>
            <span class="no">${String(i + 1).padStart(2, '0')}</span>
          </div>
        </article>`).join('');
    }
    if (host.dataset.bound === '1') { this.tiles = qsa('.lab-tile', host); return; }
    host.dataset.bound = '1';

    this.tiles = qsa('.lab-tile', host);
    this.tiles.forEach((tile, i) => {
      const cv = tile.querySelector('canvas');
      const lab = LABS[i];
      if (!anim.items.some(it => it.canvas === cv)) {
        /* heavier simulations run at a lower frame cap on purpose */
        anim.add(cv, lab.k, lab.pal, { group: 'lab', fps: FPS_IDLE });
      }
      const item = anim.items.find(it => it.canvas === cv);

      tile._rxTo = gsap.quickTo(tile, 'rotateX', { duration: 0.8, ease: 'power3' });
      tile._ryTo = gsap.quickTo(tile, 'rotateY', { duration: 0.8, ease: 'power3' });

      tile.addEventListener('mousemove', e => {
        const r = tile.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5;
        const my = (e.clientY - r.top) / r.height - 0.5;
        tile.style.setProperty('--mx', (mx + 0.5).toFixed(3));
        tile.style.setProperty('--my', (my + 0.5).toFixed(3));
        tile._ryTo(mx * 13);
        tile._rxTo(-my * 11);
        if (item) item.fps = FPS_HOT;
      });
      tile.addEventListener('mouseleave', () => {
        tile._ryTo(0); tile._rxTo(0);
        if (item) item.fps = FPS_IDLE;
        cursor.setMode('default', true);
      });
      tile.addEventListener('click', () => this.toggle(tile, i));
      tile.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this.toggle(tile, i); } });
    });
  },

  /* ------------------------------------------------------- expand in place */
  toggle(tile, i) {
    if (this.expanded === tile) return this.collapse();
    if (this.expanded) this.collapse(true);

    const r = tile.getBoundingClientRect();
    this.rect = r;
    this.expanded = tile;
    document.body.classList.add('lab-focus');
    scroll.stop();
    cursor.setLabel('Close');

    gsap.set(tile, {
      position: 'fixed', left: r.left, top: r.top, width: r.width, height: r.height,
      margin: 0, zIndex: 850, rotateX: 0, rotateY: 0
    });
    const w = Math.min(window.innerWidth * (DEVICE.touch ? 0.92 : 0.66), 940);
    const h = Math.min(window.innerHeight * 0.76, w * 0.78);
    gsap.to(tile, {
      left: (window.innerWidth - w) / 2, top: (window.innerHeight - h) / 2,
      width: w, height: h, duration: 0.85, ease: 'expo.inOut'
    });

    const item = anim.items.find(it => it.canvas === tile.querySelector('canvas'));
    if (item) { item.force = true; item.active = true; item.fps = FPS_HOT; item.st = {}; }
    state.page.spread = 7;
    state.page.converge = 0.85;

    /* the rest of the grid recedes */
    gsap.to(this.tiles.filter(t => t !== tile), { opacity: 0.12, scale: 0.96, duration: 0.6, ease: 'power2.out' });
    void i;
  },

  collapse(instant) {
    const tile = this.expanded;
    if (!tile) return;
    this.expanded = null;
    document.body.classList.remove('lab-focus');
    cursor.setMode('default', true);
    scroll.start();
    state.page.spread = 13;
    state.page.converge = 0.35;

    const item = anim.items.find(it => it.canvas === tile.querySelector('canvas'));
    if (item) { item.force = false; item.fps = FPS_IDLE; }

    const done = () => {
      gsap.set(tile, { clearProps: 'position,left,top,width,height,margin,zIndex' });
      scroll.refresh();
    };
    if (instant || !this.rect) {
      gsap.set(tile, this.rect ? { left: this.rect.left, top: this.rect.top, width: this.rect.width, height: this.rect.height } : {});
      done();
    } else {
      gsap.to(tile, {
        left: this.rect.left, top: this.rect.top, width: this.rect.width, height: this.rect.height,
        duration: 0.7, ease: 'expo.inOut', onComplete: done
      });
    }
    gsap.to(this.tiles.filter(t => t !== tile), { opacity: 1, scale: 1, duration: 0.6, ease: 'power2.out' });
  },

  /* -------------------------------------------------------- scroll systems */
  createHeroScroll(sys) {
    const hero = qs('.page-hero', this.pageEl);
    if (!hero) return;
    const h1 = qs('h1', hero);
    const meta = qs('.meta', hero);
    sys.add(ScrollTrigger.create({
      trigger: hero, start: 'top top', end: 'bottom top', scrub: 0.4,
      onUpdate: self => {
        const p = self.progress;
        if (h1) {
          gsap.set(h1, { y: p * -60, opacity: clamp(1 - p * 1.35, 0, 1) });
          /* the letters pull apart as you leave — chaos starts early */
          const chars = qsa('.ch', h1);
          chars.forEach((c, i) => gsap.set(c, { x: (i % 2 ? 1 : -1) * p * (6 + (i % 5) * 5), rotate: p * (i % 2 ? 3 : -3) }));
        }
        if (meta) gsap.set(meta, { y: p * -30, opacity: clamp(1 - p * 1.8, 0, 1) });
        /* the dust field in 3D reacts to the same progress */
        state.page.converge = 0.35 + p * 0.5;
      }
    }));
  },

  createGridScroll(sys) {
    const grid = byId('labGrid');
    if (!grid) return;

    this.tiles.forEach((tile, i) => {
      gsap.set(tile, { opacity: 0, scale: 0.86 });
      sys.add(ScrollTrigger.create({
        trigger: tile, start: 'top 96%', once: true,
        onEnter: () => gsap.to(tile, {
          opacity: 1, scale: 1, duration: 1.1, ease: 'expo.out', delay: (i % 3) * 0.07
        })
      }));
    });

    /* the grid tilts as a whole when you scroll hard through it */
    const rxTo = gsap.quickTo(grid, 'rotateX', { duration: 0.9, ease: 'power3' });
    const yTo = gsap.quickTo(grid, 'y', { duration: 0.9, ease: 'power3' });
    sys.ticker(() => {
      const v = clamp(state.velocity, -1, 1);
      rxTo(v * 3.4);
      yTo(v * -10);
    });

    sys.on(window, 'keydown', e => { if (e.key === 'Escape' && this.expanded) this.collapse(); });
  },

  tick() {},

  destroy() {
    if (this.expanded) this.collapse(true);
    anim.setGroup('lab', false);
    magnetic.release(this.pageEl || document);
    document.body.classList.remove('lab-focus');
    state.page.spread = 11;
    state.page.converge = 0;
    this.pageEl = null;
    this.sys = null;
  }
};

export default labPage;
