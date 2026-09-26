/* =====================================================================
   PAGE / ABOUT
   A narrative, not a stack of blocks: the studio sculpture stays with you
   from the hero, values open into live visualisations, the team hangs as
   physical plates that tilt with the pointer and drift with scroll, and the
   journey draws its own line as you travel it.
   ===================================================================== */
import { gsap, ScrollTrigger } from '../core/vendor.js';
import { state } from '../core/state.js';
import { scroll } from '../core/scroll.js';
import { cursor } from '../core/cursor.js';
import { bindReveals } from '../components/textReveal.js';
import { createBrandMarquee } from '../components/marquee.js';
import { anim } from '../components/generative.js';
import { magnetic } from '../components/magnetic.js';
import { VALUES, TEAM, TIMELINE, BRANDS, PHILOSOPHY_STRIP } from '../data/content.js';
import { byId, qs, qsa, clamp, inv } from '../core/utils.js';

const PAL = ['#ff4d1f', '#f8fafc', '#0b0b0c'];

export const aboutPage = {
  route: '/about',
  sys: null,
  pageEl: null,
  brandMarquee: null,
  unsub: [],

  mount(pageEl, sys) {
    this.pageEl = pageEl;
    this.sys = sys;

    this.buildPhilosophy();
    this.buildValues();
    this.buildTeam();
    this.buildTimeline();
    this.buildBrands();

    this.createHeroScroll(sys);
    this.createPhilosophyScroll(sys);
    this.createValuesScroll(sys);
    this.createTeamScroll(sys);
    this.createTimelineScroll(sys);
    this.createBrandsScroll(sys);
    this.createCtaScroll(sys);

    bindReveals(pageEl, sys);
    magnetic.scan(pageEl);
    anim.setGroup('about', true);
    scroll.refresh();
  },

  /* -------------------------------------------------------------- builders */
  buildPhilosophy() {
    const host = byId('phiStrip');
    if (!host || host.children.length) return;
    host.innerHTML = PHILOSOPHY_STRIP.map(f => `
      <figure data-cursor="Open">
        <canvas></canvas>
        <figcaption class="mono">${f.cap}</figcaption>
      </figure>`).join('');
    qsa('figure', host).forEach((fig, i) => {
      const cv = fig.querySelector('canvas');
      if (anim.items.some(it => it.canvas === cv)) return;
      anim.add(cv, PHILOSOPHY_STRIP[i].k, PAL, { group: 'about', fps: 34 });
      fig.dataset.bound = '1';
    });
  },

  buildValues() {
    const host = byId('valuesList');
    if (!host || host.children.length) return;
    host.innerHTML = VALUES.map(v => `
      <article class="value-row" data-i="${v.idx}">
        <span class="idx">${v.idx}</span>
        <h3>${v.t}</h3>
        <p>${v.d}</p>
        <span></span>
        <div class="v-vis"><canvas></canvas></div>
        <div class="v-glow"></div>
      </article>`).join('');

    if (host.dataset.bound === '1') return;
    host.dataset.bound = '1';
    qsa('.value-row', host).forEach((row, i) => {
      const cv = row.querySelector('.v-vis canvas');
      if (!anim.items.some(it => it.canvas === cv)) {
        anim.add(cv, VALUES[i].kind, [VALUES[i].col, '#f8fafc', '#0b0b0c'], {
          group: 'about', fps: 32, active: false
        });
      }
      const item = anim.items.find(it => it.canvas === cv);
      row.addEventListener('mousemove', e => {
        const r = row.getBoundingClientRect();
        row.style.setProperty('--mx', ((e.clientX - r.left) / r.width).toFixed(3));
      });
      row.addEventListener('mouseenter', () => { if (item) item.active = true; });
      row.addEventListener('mouseleave', () => { if (item) item.active = false; });
    });
  },

  buildTeam() {
    const host = byId('teamGrid');
    if (!host || host.children.length) return;
    host.innerHTML = TEAM.map((m, i) => `
      <article class="member" data-i="${i}" data-cursor="Open">
        <canvas></canvas>
        <div class="light"></div>
        <div class="info"><b>${m.n}</b><small class="mono">${m.r}</small></div>
      </article>`).join('');

    if (host.dataset.bound === '1') return;
    host.dataset.bound = '1';
    qsa('.member', host).forEach((card, i) => {
      const cv = card.querySelector('canvas');
      if (!anim.items.some(it => it.canvas === cv)) {
        anim.add(cv, TEAM[i].kind, [`hsl(${TEAM[i].h} 62% 58%)`, '#f1f5f9', '#0a0a0c'], { group: 'about', fps: 26 });
      }
      card._rxTo = gsap.quickTo(card, 'rotateX', { duration: 0.6, ease: 'power3' });
      card._ryTo = gsap.quickTo(card, 'rotateY', { duration: 0.6, ease: 'power3' });
      card.addEventListener('mousemove', e => {
        const r = card.getBoundingClientRect();
        const mx = (e.clientX - r.left) / r.width - 0.5;
        const my = (e.clientY - r.top) / r.height - 0.5;
        card._ryTo(mx * 16);
        card._rxTo(-my * 14);
        const light = card.querySelector('.light');
        if (light) {
          light.style.opacity = '1';
          light.style.background = `radial-gradient(240px circle at ${(mx + 0.5) * 100}% ${(my + 0.5) * 100}%, rgba(255,255,255,0.22), transparent 62%)`;
        }
      });
      card.addEventListener('mouseleave', () => {
        card._ryTo(0); card._rxTo(0);
        const light = card.querySelector('.light');
        if (light) light.style.opacity = '';
      });
    });
  },

  buildTimeline() {
    const host = byId('tlRows');
    if (!host || host.children.length) return;
    host.innerHTML = TIMELINE.map(t => `
      <div class="tl-row">
        <span class="y">${t.y}</span>
        <div><h3 style="font-size:1.35rem;font-weight:500;letter-spacing:-0.03em;margin-bottom:10px;">${t.t}</h3><p>${t.d}</p></div>
        <div class="t-vis"><canvas></canvas></div>
      </div>`).join('');

    qsa('.tl-row', host).forEach((row, i) => {
      const cv = row.querySelector('canvas');
      if (anim.items.some(it => it.canvas === cv)) return;
      anim.add(cv, TIMELINE[i].kind, PAL, { group: 'about', fps: 30 });
    });
  },

  buildBrands() {
    const host = byId('brandInner');
    if (!host || host.children.length) return;
    this.brandMarquee = createBrandMarquee(host, BRANDS);
  },

  /* ---------------------------------------------------------- scroll systems */
  createHeroScroll(sys) {
    const hero = qs('.about-hero', this.pageEl);
    if (!hero) return;
    const title = byId('aboutTitle');
    const meta = qs('.meta', hero);

    sys.add(ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.4,
      onUpdate: self => {
        const p = self.progress;
        state.page.heroAct = p * 0.4;          /* the sculpture keeps a little choreography */
        if (title) gsap.set(title, { y: p * -90, opacity: clamp(1 - p * 1.35, 0, 1), filter: p > 0.2 ? `blur(${(p * 4).toFixed(2)}px)` : '' });
        if (meta) gsap.set(meta, { y: p * -46, opacity: clamp(1 - p * 1.7, 0, 1) });
      }
    }));
  },

  createPhilosophyScroll(sys) {
    const sec = qs('.philosophy', this.pageEl);
    if (!sec) return;
    const figs = qsa('.phi-strip figure', sec);

    sys.add(ScrollTrigger.create({
      trigger: sec,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.6,
      onUpdate: self => {
        const p = self.progress;
        figs.forEach((f, i) => {
          const dir = i % 2 === 0 ? 1 : -1;
          gsap.set(f, { y: (0.5 - p) * 130 * dir * (0.6 + i * 0.24), rotate: (0.5 - p) * 4 * dir });
        });
      }
    }));

    /* the sticky heading reacts to how far you have travelled through it */
    const sticky = qs('.phi-sticky', sec);
    if (sticky) {
      sys.add(ScrollTrigger.create({
        trigger: sec, start: 'top 40%', end: 'bottom 70%', scrub: 0.5,
        onUpdate: self => {
          gsap.set(sticky, { x: self.progress * -26, opacity: 1 - self.progress * 0.25 });
        }
      }));
    }
  },

  createValuesScroll(sys) {
    const rows = qsa('.value-row', this.pageEl);
    rows.forEach((row, i) => {
      gsap.set(row, { opacity: 0, x: i % 2 === 0 ? -46 : 46 });
      sys.add(ScrollTrigger.create({
        trigger: row, start: 'top 90%', once: true,
        onEnter: () => gsap.to(row, { opacity: 1, x: 0, duration: 1.1, ease: 'expo.out', delay: (i % 2) * 0.05 })
      }));
      sys.on(row, 'mouseenter', () => cursor.setMode('link'));
    });
  },

  createTeamScroll(sys) {
    const grid = byId('teamGrid');
    if (!grid) return;
    const cards = qsa('.member', grid);

    /* plates drift at different rates — the wall feels like it has depth */
    sys.add(ScrollTrigger.create({
      trigger: grid,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.8,
      onUpdate: self => {
        const p = self.progress - 0.5;
        cards.forEach((c, i) => {
          const col = i % 4;
          const rate = [1, -0.6, 0.8, -1.1][col];
          gsap.set(c, { yPercent: p * 26 * rate });
        });
      }
    }));

    cards.forEach((c, i) => {
      gsap.set(c, { opacity: 0, scale: 0.94 });
      sys.add(ScrollTrigger.create({
        trigger: c, start: 'top 94%', once: true,
        onEnter: () => gsap.to(c, { opacity: 1, scale: 1, duration: 1.15, ease: 'expo.out', delay: (i % 4) * 0.07 })
      }));
    });
  },

  createTimelineScroll(sys) {
    const sec = byId('timelineSec');
    const fill = byId('tlLineFill');
    const yearEl = byId('tlYear');
    const rows = qsa('.tl-row', this.pageEl);
    if (!sec || !rows.length) return;

    let current = -1;
    sys.add(ScrollTrigger.create({
      trigger: sec,
      start: 'top 72%',
      end: 'bottom 78%',
      scrub: 0.35,
      onUpdate: self => {
        const p = self.progress;
        if (fill) fill.style.height = (p * 100).toFixed(2) + '%';
        /* which milestone owns the centre of the screen */
        const idx = clamp(Math.floor(p * rows.length + 0.15), 0, rows.length - 1);
        if (idx !== current) {
          current = idx;
          rows.forEach((r, i) => {
            r.classList.toggle('active', i === idx);
            r.classList.toggle('dim', i !== idx);
          });
          if (yearEl && yearEl.textContent !== TIMELINE[idx].y) {
            gsap.fromTo(yearEl, { y: 18, opacity: 0 }, { y: 0, opacity: 0.9, duration: 0.55, ease: 'expo.out', overwrite: true });
            yearEl.textContent = TIMELINE[idx].y;
          }
        }
        /* the 3D filament behind the timeline draws with the same progress */
        state.page.line = clamp(inv(0, 1, p), 0, 1);
      }
    }));

    rows.forEach((r, i) => {
      gsap.set(r, { opacity: 0, y: 34 });
      sys.add(ScrollTrigger.create({
        trigger: r, start: 'top 92%', once: true,
        onEnter: () => gsap.to(r, { opacity: 1, y: 0, duration: 1, ease: 'expo.out', delay: (i % 3) * 0.05 })
      }));
    });
  },

  createBrandsScroll(sys) {
    if (!this.brandMarquee) return;
    const sec = qs('.brands', this.pageEl);
    if (!sec) return;
    sys.ticker(this.brandMarquee.ticker);
    void sec;
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
            gsap.set(c, { y: (1 - p) * Math.abs(d) * 90, opacity: clamp(p * 2 - Math.abs(d) * 0.8, 0.05, 1) });
          });
        }
        if (row) gsap.set(row, { y: (1 - p) * 40, opacity: clamp(p * 1.9 - 0.35, 0, 1) });
        state.page.focus = clamp(inv(0.4, 1, p), 0, 1);
      }
    }));
  },

  tick() { /* nothing per-frame — everything is scrub-driven */ },

  destroy() {
    this.unsub.forEach(fn => fn());
    this.unsub.length = 0;
    anim.setGroup('about', false);
    if (this.brandMarquee) { this.brandMarquee.destroy(); this.brandMarquee = null; }
    magnetic.release(this.pageEl || document);
    state.page.focus = 0;
    state.page.line = 0;
    this.pageEl = null;
    this.sys = null;
  }
};

export default aboutPage;
