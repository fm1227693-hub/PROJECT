/* =====================================================================
   PAGE / WORK
   Editorial gallery. Twelve live generative plates, filtered in place with
   a real FLIP animation, each one tilting toward the pointer and feeding
   the 3D panel field behind it (state.page.workIndex).
   ===================================================================== */
import { gsap, ScrollTrigger } from '../core/vendor.js';
import { state } from '../core/state.js';
import { scroll } from '../core/scroll.js';
import { cursor } from '../core/cursor.js';
import { bindReveals } from '../components/textReveal.js';
import { anim } from '../components/generative.js';
import { magnetic } from '../components/magnetic.js';
import { WORKS } from '../data/content.js';
import { byId, qs, qsa, clamp, inv } from '../core/utils.js';

export const workPage = {
  route: '/work',
  sys: null,
  pageEl: null,
  filter: 'all',
  tiles: [],

  mount(pageEl, sys) {
    this.pageEl = pageEl;
    this.sys = sys;
    this.buildGrid();
    this.bindFilters(sys);
    this.createHeroScroll(sys);
    this.createGridScroll(sys);
    this.createCtaScroll(sys);
    bindReveals(pageEl, sys);
    magnetic.scan(pageEl);
    anim.setGroup('work', true);
    scroll.refresh();
  },

  buildGrid() {
    const host = byId('workGrid');
    if (!host) return;
    if (!host.children.length) {
      host.innerHTML = WORKS.map((w, i) => `
        <article class="work-tile" data-i="${i}" data-tags="${w.tags.join(' ')}" data-cursor="Explore">
          <div class="thumb">
            <canvas></canvas>
            <div class="sheen"></div>
            ${w.award ? `<span class="badge">${w.award}</span>` : ''}
          </div>
          <div class="cap"><h3>${w.t}</h3><span>${w.c} · ${w.y}</span></div>
          <div class="tile-tags">${w.tags.map(t => `<span>${t}</span>`).join('')}</div>
        </article>`).join('');
    }
    if (host.dataset.bound === '1') { this.tiles = qsa('.work-tile', host); return; }
    host.dataset.bound = '1';

    this.tiles = qsa('.work-tile', host);
    this.tiles.forEach((tile, i) => {
      const cv = tile.querySelector('canvas');
      if (!anim.items.some(it => it.canvas === cv)) {
        anim.add(cv, WORKS[i].kind, WORKS[i].pal, { group: 'work', fps: 32 });
      }
      tile._rxTo = gsap.quickTo(tile, 'rotateX', { duration: 0.7, ease: 'power3' });
      tile._ryTo = gsap.quickTo(tile, 'rotateY', { duration: 0.7, ease: 'power3' });

      tile.addEventListener('mousemove', e => {
        const r = tile.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width;
        const my = (e.clientY - r.top) / r.height;
        tile.querySelector('.thumb').style.setProperty('--mx', mx.toFixed(3));
        tile.querySelector('.thumb').style.setProperty('--my', my.toFixed(3));
        tile._ryTo((mx - 0.5) * 11);
        tile._rxTo((0.5 - my) * 9);
      });
      tile.addEventListener('mouseleave', () => {
        tile._ryTo(0); tile._rxTo(0);
        state.page.workIndex = -1;
      });
      tile.addEventListener('mouseenter', () => {
        state.page.workIndex = i;
        cursor.setLabel('Explore');
      });
      /* no dead links: a plate opens a pre-filled brief on the contact page */
      tile.addEventListener('click', () => {
        const w = WORKS[i];
        gsap.fromTo(tile, { scale: 0.97 }, { scale: 1, duration: 0.7, ease: 'elastic.out(1, 0.6)' });
        state.pendingBrief = `We saw "${w.t}" (${w.c}, ${w.y}) and would like to talk about something in that territory.`;
        window.location.hash = '#/contact';
      });
    });
  },

  /* ------------------------------------------------------------- filtering */
  bindFilters(sys) {
    const host = byId('filters');
    const count = byId('workCount');
    if (!host || host.dataset.bound === '1') return;
    host.dataset.bound = '1';

    const buttons = qsa('button', host);
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        const f = btn.dataset.f;
        if (f === this.filter) return;
        buttons.forEach(b => b.classList.toggle('on', b === btn));
        this.filter = f;
        this.applyFilter(count);
      });
    });
    sys.cleanup(() => { /* listeners live on persistent DOM; filter state resets below */ });
  },

  applyFilter(countEl) {
    const f = this.filter;
    let shown = 0;
    /* FLIP: record, change, invert, play */
    const first = new Map();
    this.tiles.forEach(t => first.set(t, t.getBoundingClientRect()));

    this.tiles.forEach(tile => {
      const tags = (tile.dataset.tags || '').split(' ');
      const match = f === 'all' || tags.indexOf(f) >= 0;
      tile.style.display = match ? '' : 'none';
      if (match) shown++;
    });

    if (countEl) {
      countEl.textContent = `${shown} project${shown === 1 ? '' : 's'}`;
      gsap.fromTo(countEl, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' });
    }

    this.tiles.forEach(tile => {
      if (tile.style.display === 'none') return;
      const f0 = first.get(tile);
      const l = tile.getBoundingClientRect();
      if (!f0 || !f0.width) {
        gsap.fromTo(tile, { opacity: 0, y: 34, scale: 0.97 }, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' });
        return;
      }
      const dx = f0.left - l.left, dy = f0.top - l.top;
      if (Math.abs(dx) < 1 && Math.abs(dy) < 1) {
        gsap.fromTo(tile, { opacity: 0.2 }, { opacity: 1, duration: 0.5, ease: 'power2.out' });
        return;
      }
      gsap.fromTo(tile, { x: dx, y: dy, opacity: 0.3 }, { x: 0, y: 0, opacity: 1, duration: 0.85, ease: 'expo.out' });
    });

    scroll.refresh();
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
        if (h1) gsap.set(h1, { y: p * -70, opacity: clamp(1 - p * 1.4, 0, 1) });
        if (meta) gsap.set(meta, { y: p * -34, opacity: clamp(1 - p * 1.8, 0, 1) });
      }
    }));
  },

  createGridScroll(sys) {
    const grid = byId('workGrid');
    if (!grid) return;

    this.tiles.forEach((tile, i) => {
      gsap.set(tile, { opacity: 0, y: 60, yPercent: 0 });
      sys.add(ScrollTrigger.create({
        trigger: tile, start: 'top 94%', once: true,
        onEnter: () => gsap.to(tile, { opacity: 1, y: 0, duration: 1.2, ease: 'expo.out', delay: (i % 2) * 0.08 })
      }));
    });

    /* alternating columns drift against the scroll — the grid breathes */
    sys.add(ScrollTrigger.create({
      trigger: grid, start: 'top bottom', end: 'bottom top', scrub: 0.9,
      onUpdate: self => {
        const p = self.progress - 0.5;
        this.tiles.forEach((tile, i) => {
          if (tile.style.display === 'none') return;
          gsap.set(tile.querySelector('.thumb'), { yPercent: p * (i % 2 === 0 ? -7 : 7) });
        });
      }
    }));

    /* velocity shear on the whole grid */
    const shearTo = gsap.quickTo(grid, 'skewY', { duration: 0.7, ease: 'power3' });
    sys.ticker(() => {
      shearTo(clamp(state.velocity * 0.5, -1.4, 1.4));
    });
  },

  createCtaScroll(sys) {
    const cta = qs('.cta', this.pageEl);
    if (!cta) return;
    const big = qs('.big', cta);
    const row = qs('.row', cta);
    const chars = big ? qsa('.ch', big) : [];
    sys.add(ScrollTrigger.create({
      trigger: cta, start: 'top bottom', end: 'bottom bottom', scrub: 0.5,
      onUpdate: self => {
        const p = self.progress;
        if (chars.length) {
          chars.forEach((c, i) => {
            const d = (i - chars.length / 2) / chars.length;
            gsap.set(c, { x: d * (1 - p) * 170, opacity: clamp(p * 2.1 - Math.abs(d), 0.05, 1) });
          });
        }
        if (row) gsap.set(row, { y: (1 - p) * 44, opacity: clamp(p * 1.9 - 0.3, 0, 1) });
        state.page.focus = clamp(inv(0.45, 1, p), 0, 1);
      }
    }));
  },

  tick() {},

  destroy() {
    anim.setGroup('work', false);
    magnetic.release(this.pageEl || document);
    state.page.workIndex = -1;
    state.page.focus = 0;
    this.pageEl = null;
    this.sys = null;
  }
};

export default workPage;
