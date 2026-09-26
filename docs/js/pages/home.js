/* =====================================================================
   PAGE / HOME
   Scroll choreography for the whole front page. Every section gets its own
   named system — hero bands, reel portal, manifesto depth, work list,
   services rail, object theatre, marquee, stats, awards, CTA — and every
   system is registered on the page's ScrollSystem so a route change kills
   all of it in one call.
   ===================================================================== */
import { gsap, ScrollTrigger } from '../core/vendor.js';
import { state, bus } from '../core/state.js';
import { scroll } from '../core/scroll.js';
import { cursor } from '../core/cursor.js';
import { bindReveals } from '../components/textReveal.js';
import { bindCounters } from '../components/counters.js';
import { createMarquee } from '../components/marquee.js';
import { reel } from '../components/reel.js';
import { workPreview } from '../components/workPreview.js';
import { anim } from '../components/generative.js';
import { magnetic } from '../components/magnetic.js';
import { world } from '../core/scene.js';
import { WORKS, SERVICES, AWARDS, MARQUEE_ITEMS } from '../data/content.js';
import { byId, qs, qsa, clamp, inv, lerp } from '../core/utils.js';
import { DEVICE } from '../core/config.js';

const KIND_FALLBACK = { liquid: 'fluid', sculpt: 'sculpt', arch: 'arch', wire: 'wire', swarm: 'swarm' };

export const homePage = {
  route: '/',
  sys: null,
  pageEl: null,
  marquees: [],
  unsub: [],
  tickers: [],
  intro: null,

  /* ------------------------------------------------------------------ mount */
  mount(pageEl, sys) {
    this.pageEl = pageEl;
    this.sys = sys;
    this.buildWorkList(pageEl);
    this.buildServices(pageEl);
    this.buildCarouselDots(pageEl);
    this.buildAwards(pageEl);
    this.buildMarquee(pageEl);

    reel.init();
    workPreview.init();

    /* scroll systems */
    this.createHeroScroll(sys);
    reel.createScroll(sys);
    this.createManifestoScroll(sys);
    this.createWorksScroll(sys);
    this.createServicesScroll(sys);
    this.createCarouselScroll(sys);
    this.createMarqueeScroll(sys);
    this.createStatsScroll(sys);
    this.createAwardsScroll(sys);
    this.createCtaScroll(sys);

    bindCounters(pageEl, sys);
    bindReveals(pageEl, sys);
    magnetic.scan(pageEl);

    /* 3D world hand-off */
    const car = world.stages && world.stages.get('carousel');
    if (car) car.bind(byId('carouselStage'));

    this.unsub.push(bus.on('carousel', idx => this.onCarousel(idx)));
    this.unsub.push(bus.on('section', s => this.onSection(s)));

    scroll.refresh();
  },

  /* --------------------------------------------------------------- builders */
  buildWorkList() {
    const host = byId('workList');
    if (!host || host.children.length) return;
    host.innerHTML = WORKS.slice(0, 6).map((w, i) => `
      <a class="work-row" href="#/work" data-route="/work" data-i="${i}" data-cursor="View">
        <span class="w-idx">${String(i + 1).padStart(2, '0')}</span>
        <span class="w-title">${w.t}<span class="arrow">↗</span></span>
        <span class="w-tags">${w.tags.map(t => `<span>${t}</span>`).join('')}</span>
        <span class="w-year">${w.y}<br><em style="font-style:normal;opacity:.55">${w.c}</em></span>
        <span class="w-bar"></span>
      </a>`).join('');
  },

  buildServices() {
    const host = byId('svcTrack');
    if (!host || host.children.length) return;
    host.innerHTML = SERVICES.map((s, i) => `
      <article class="svc-card" data-i="${i}" style="--c:${s.col}">
        <div class="glow" style="background:${s.col}"></div>
        <canvas data-kind="${KIND_FALLBACK[s.kind] || 'flow'}" data-pal="${s.col}"></canvas>
        <div>
          <div class="num">${s.n} / ${s.t.split(' ')[0]}</div>
          <h3>${s.t}</h3>
          <p>${s.d}</p>
        </div>
        <ul>${s.tags.map(t => `<li>${t}</li>`).join('')}</ul>
        <div class="svc-spine"><i></i></div>
      </article>`).join('');

    qsa('.svc-card', host).forEach(card => {
      const cv = card.querySelector('canvas');
      if (anim.items.some(i => i.canvas === cv)) return;
      anim.add(cv, cv.dataset.kind, [cv.dataset.pal, '#f8fafc', '#0b0b0c'], { group: 'home', fps: 34 });
    });
    anim.setGroup('home', true);
  },

  buildCarouselDots() {
    const host = byId('carDots');
    const total = byId('carTotal');
    const n = Math.min(9, WORKS.length);
    if (host && !host.children.length) host.innerHTML = Array.from({ length: n }, (_, i) => `<i data-i="${i}" class="${i === 0 ? 'on' : ''}"></i>`).join('');
    if (total) total.textContent = String(n).padStart(2, '0');
  },

  buildAwards() {
    const host = byId('awardList');
    if (!host || host.children.length) return;
    host.innerHTML = AWARDS.map(a => `
      <div class="award-row">
        <span class="a-org">${a.o}</span>
        <span class="a-title">${a.t}</span>
        <span class="a-year">${a.y}</span>
        <span class="a-count">${a.n}</span>
      </div>`).join('');
  },

  buildMarquee() {
    const host = byId('marquee');
    if (!host || host.children.length) return;
    const m = createMarquee(host, { items: MARQUEE_ITEMS, speed: DEVICE.touch ? 30 : 54 });
    if (m) { this.marquees.push(m); }
  },

  /* ------------------------------------------------------- hero (0→100 bands) */
  createHeroScroll(sys) {
    const hero = qs('.hero', this.pageEl);
    if (!hero) return;
    const title = byId('heroTitle');
    const top = qs('.hero-top', hero);
    const foot = qs('.hero-foot', hero);
    const lines = title ? qsa('.line > span', title) : [];

    hero.style.setProperty('--heroP', '0');

    const st = ScrollTrigger.create({
      trigger: hero,
      start: 'top top',
      end: 'bottom top',
      scrub: 0.4,
      onUpdate: self => {
        const p = self.progress;
        /* the 3D sculpture reads this — bands 0-20 / 20-40 / 40-60 / 60-80 / 80-100
           are interpreted inside SculptureStage */
        state.page.heroAct = p;
        state.page.pageProgress = p;
        hero.style.setProperty('--heroP', p.toFixed(3));

        /* typography consequences: lines separate, blur and lift away */
        lines.forEach((ln, i) => {
          const drift = p * (14 + i * 26);
          const sep = p * (i - 1) * 9;
          gsap.set(ln, {
            y: -drift,
            yPercent: 0,
            opacity: clamp(1 - p * (1.25 + i * 0.18), 0, 1),
            filter: p > 0.12 ? `blur(${(p * 5.5).toFixed(2)}px)` : '',
            letterSpacing: (p * (2 + i)).toFixed(2) + 'px',
            x: sep
          });
        });
        if (top) gsap.set(top, { y: p * -70, opacity: clamp(1 - p * 1.7, 0, 1) });
        if (foot) gsap.set(foot, { y: p * 40, opacity: clamp(1 - p * 2.2, 0, 1) });
      },
      onLeaveBack: () => { state.page.heroAct = 0; }
    });
    sys.add(st);

    /* scroll cue breathes until the user moves */
    const cue = qs('.scroll-cue .pill', hero);
    if (cue) {
      const tw = gsap.to(cue, { y: 14, duration: 1.5, repeat: -1, yoyo: true, ease: 'power2.inOut' });
      sys.cleanup(() => tw.kill());
    }
  },

  /* --------------------------------------------- manifesto (cinematic depth) */
  createManifestoScroll(sys) {
    const p = byId('manifesto');
    if (!p) return;
    const idxEl = byId('manIdx');
    const totalEl = byId('manTotal');

    /* split into .w spans, preserving the .hl highlights inside them */
    if (!p.dataset.split) {
      const frag = document.createDocumentFragment();
      Array.prototype.slice.call(p.childNodes).forEach(node => {
        if (node.nodeType === 3) {
          node.textContent.split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const s = document.createElement('span');
            s.className = 'w';
            s.textContent = part;
            frag.appendChild(s);
          });
        } else if (node.nodeType === 1) {
          const cls = node.classList.contains('hl') ? 'w hl' : 'w';
          const s = document.createElement('span');
          s.className = cls;
          s.textContent = node.textContent;
          frag.appendChild(s);
          frag.appendChild(document.createTextNode(' '));
        }
      });
      p.innerHTML = '';
      p.appendChild(frag);
      p.dataset.split = 'words';
    }

    const words = qsa('.w', p);
    if (totalEl) totalEl.textContent = String(words.length).padStart(2, '0');
    words.forEach(w => {
      /* per-word depth so the reveal reads as a camera move, not a fade */
      w.dataset.z = (Math.random() * 46 - 14).toFixed(1);
      w.dataset.r = (Math.random() * 5 - 2.5).toFixed(2);
      gsap.set(w, { opacity: 1, z: parseFloat(w.dataset.z) * 0.5, rotateY: parseFloat(w.dataset.r) });
    });

    let last = -1;
    const st = ScrollTrigger.create({
      trigger: p,
      start: 'top 82%',
      end: 'bottom 42%',
      scrub: 0.3,
      onUpdate: self => {
        const prog = self.progress;
        /* the ribbon filament draws itself in 3D behind the words */
        state.page.line = clamp(inv(0.02, 0.98, prog), 0, 1);
        const lit = Math.floor(prog * words.length * 1.06);
        if (lit === last) return;
        last = lit;
        words.forEach((w, i) => {
          const on = i < lit;
          const now = i === lit;
          if (on !== w.classList.contains('on')) w.classList.toggle('on', on);
          if (now !== w.classList.contains('now')) w.classList.toggle('now', now);
          const z = parseFloat(w.dataset.z);
          const k = now ? 1 : (on ? 0.28 : 0);
          gsap.set(w, {
            z: z * k,
            rotateY: parseFloat(w.dataset.r) * (on ? 0.3 : 1),
            rotateX: now ? -3 : 0,
            scale: now ? 1.04 : 1,
            opacity: on ? 1 : 0.34
          });
        });
        if (idxEl) idxEl.textContent = String(clamp(lit, 0, words.length)).padStart(2, '0');
      }
    });
    sys.add(st);
  },

  /* ------------------------------------------------------------- work list */
  createWorksScroll(sys) {
    const list = byId('workList');
    if (!list) return;
    const rows = qsa('.work-row', list);
    if (!rows.length) return;

    /* velocity drift — rows shear against each other when you scroll fast */
    const xTo = rows.map(r => gsap.quickTo(r, 'x', { duration: 0.65, ease: 'power3' }));
    rows.forEach(r => gsap.set(r, { opacity: 0, y: 46 }));

    rows.forEach((row, i) => {
      sys.add(ScrollTrigger.create({
        trigger: row,
        start: 'top 94%',
        once: true,
        onEnter: () => gsap.to(row, {
          opacity: 1, y: 0, duration: 1, delay: i * 0.05, ease: 'expo.out', overwrite: 'auto'
        })
      }));

      const work = WORKS[parseInt(row.dataset.i, 10)];
      sys.on(row, 'mouseenter', () => {
        state.page.workIndex = i;
        workPreview.show(work);
        gsap.to(rows.filter(r => r !== row), { opacity: 0.34, duration: 0.4, ease: 'power2.out', overwrite: 'auto' });
      });
      sys.on(row, 'mousemove', e => workPreview.move(e.clientX, e.clientY - 10));
      sys.on(row, 'mouseleave', () => {
        state.page.workIndex = -1;
        workPreview.hide();
        gsap.to(rows, { opacity: 1, duration: 0.5, ease: 'power2.out', overwrite: 'auto' });
      });
    });

    sys.ticker(dt => {
      const v = state.velocity;
      if (Math.abs(v) < 0.01 && rows.every(r => r._lx === 0)) return;
      rows.forEach((row, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const amp = 26 + (i % 3) * 14;
        const target = clamp(v * dir * amp, -70, 70);
        row._lx = lerp(row._lx || 0, target, Math.min(1, dt * 6));
        xTo[i](row._lx);
      });
    });
  },

  /* ------------------------------------------- services (pinned horizontal) */
  createServicesScroll(sys) {
    const sec = byId('services');
    const track = byId('svcTrack');
    const pin = qs('.services-pin', sec);
    const idxEl = byId('svcIndex');
    const progEl = byId('svcProgress');
    if (!sec || !track || !pin) return;

    const cards = qsa('.svc-card', track);
    const n = cards.length;
    const distance = () => Math.max(0, track.scrollWidth - window.innerWidth + 40);

    /* per-card tilt + depth as the rail moves past */
    cards.forEach((c, i) => {
      c._xTo = gsap.quickTo(c, 'rotateY', { duration: 0.7, ease: 'power3' });
      c._yTo = gsap.quickTo(c, 'y', { duration: 0.7, ease: 'power3' });
      sys.on(c, 'mousemove', e => {
        const r = c.getBoundingClientRect();
        c.style.setProperty('--mx', ((e.clientX - r.left) / r.width).toFixed(3));
        c.style.setProperty('--my', ((e.clientY - r.top) / r.height).toFixed(3));
      });
      void i;
    });

    const tween = gsap.to(track, { x: () => -distance(), ease: 'none' });

    const st = ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: () => '+=' + (distance() + window.innerHeight * 0.6),
      pin,
      pinSpacing: true,
      scrub: 0.7,
      invalidateOnRefresh: true,
      anticipatePin: 1,
      animation: tween,
      onUpdate: self => {
        const p = self.progress;
        const f = clamp(p * (n - 0.001) * 1.06, 0, n - 1);
        state.page.serviceIndex = f;
        if (idxEl) idxEl.textContent = String(Math.min(n, Math.floor(f) + 1)).padStart(2, '0');
        if (progEl) progEl.style.width = (p * 100).toFixed(2) + '%';
        /* cards lean into the direction of travel */
        cards.forEach((c, i) => {
          const d = i - f;
          c._xTo(clamp(-d * 7, -16, 16));
          c._yTo(clamp(Math.abs(d) * 9, 0, 40));
          c.style.opacity = String(clamp(1 - Math.abs(d) * 0.16, 0.42, 1));
        });
      }
    });
    sys.add(st);

    /* wheel influence is implicit (scrub); add a small inertia nudge */
    sys.ticker(dt => {
      const v = state.velocity;
      if (Math.abs(v) < 0.02) return;
      track.style.setProperty('--skew', clamp(v * 2.4, -3, 3).toFixed(2) + 'deg');
      void dt;
    });
  },

  /* ------------------------------------------------ carousel (object theatre) */
  createCarouselScroll(sys) {
    const sec = byId('carouselSec');
    const pin = qs('.carousel-pin', sec);
    const stage = byId('carouselStage');
    if (!sec || !pin) return;

    const st = ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: '+=210%',
      pin,
      pinSpacing: true,
      scrub: 0.5,
      anticipatePin: 1,
      onUpdate: self => {
        state.page.carouselScroll = self.progress;
      }
    });
    sys.add(st);

    if (stage) {
      sys.on(stage, 'mouseenter', () => cursor.setLabel('Drag'));
      sys.on(stage, 'mouseleave', () => cursor.setMode('default', true));
      sys.on(stage, 'pointerdown', () => document.body.classList.add('cursor-drag'));
      sys.on(stage, 'pointerup', () => document.body.classList.remove('cursor-drag'));
    }
  },

  onCarousel(idx) {
    const w = WORKS[idx];
    const t = byId('carTitle'), c = byId('carClient'), i = byId('carIndex');
    if (w && t && t.textContent !== w.t) {
      gsap.to(t, { y: -12, opacity: 0, duration: 0.22, ease: 'power2.in', onComplete: () => {
        t.textContent = w.t;
        gsap.fromTo(t, { y: 14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.5, ease: 'expo.out' });
      } });
      if (c) c.textContent = `${w.c} — ${w.y}`;
      if (i) i.textContent = String(idx + 1).padStart(2, '0');
      qsa('#carDots i').forEach((d, di) => d.classList.toggle('on', di === idx));
    }
  },

  /* ------------------------------------------------------------- marquee */
  createMarqueeScroll(sys) {
    const sec = qs('.marquee', this.pageEl);
    if (!sec) return;
    const m = this.marquees[0];
    if (!m) return;
    sys.add(ScrollTrigger.create({
      trigger: sec,
      start: 'top bottom',
      end: 'bottom top',
      onToggle: self => { self.isActive ? m.start() : m.stop(); }
    }));
    sys.ticker(m.ticker);
    m.stop();
  },

  /* ---------------------------------------------------------------- stats */
  createStatsScroll(sys) {
    const sec = qs('.stats', this.pageEl);
    if (!sec) return;
    const stats = qsa('.stat', sec);
    stats.forEach((s, i) => {
      gsap.set(s, { opacity: 0, y: 40 });
      sys.add(ScrollTrigger.create({
        trigger: s, start: 'top 92%', once: true,
        onEnter: () => gsap.to(s, { opacity: 1, y: 0, duration: 1.1, delay: i * 0.08, ease: 'expo.out' })
      }));
      void i;
    });
  },

  /* --------------------------------------------------------------- awards */
  createAwardsScroll(sys) {
    const rows = qsa('.award-row', this.pageEl);
    rows.forEach((r, i) => {
      gsap.set(r, { clipPath: 'inset(0 100% 0 0)', opacity: 0.001 });
      sys.add(ScrollTrigger.create({
        trigger: r, start: 'top 94%', once: true,
        onEnter: () => gsap.to(r, {
          clipPath: 'inset(0 0% 0 0)', opacity: 1, duration: 1.15,
          delay: (i % 3) * 0.06, ease: 'expo.inOut'
        })
      }));
    });
  },

  /* ------------------------------------------------------------------ cta */
  createCtaScroll(sys) {
    const cta = qs('.cta', this.pageEl);
    if (!cta) return;
    const big = qs('.big', cta);
    const row = qs('.row', cta);

    if (big) {
      const chars = qsa('.ch', big);
      sys.add(ScrollTrigger.create({
        trigger: cta, start: 'top bottom', end: 'bottom bottom', scrub: 0.5,
        onUpdate: self => {
          const p = self.progress;
          /* the closer you get, the tighter the letters pull together */
          if (chars.length) {
            chars.forEach((c, i) => {
              const d = (i - chars.length / 2) / chars.length;
              gsap.set(c, { x: d * (1 - p) * 190, opacity: clamp(p * 2.2 - Math.abs(d), 0.05, 1) });
            });
          } else {
            gsap.set(big, { letterSpacing: lerp(0.14, -0.03, p) + 'em' });
          }
          if (row) gsap.set(row, { y: (1 - p) * 46, opacity: clamp(p * 1.8 - 0.3, 0, 1) });
          /* the plasma orb behind the CTA wakes up as you arrive */
          state.page.focus = clamp(inv(0.45, 1, p), 0, 1);
        }
      }));
    }
  },

  onSection(s) {
    /* dust behaviour per home section (read by the atmosphere) */
    if (s === 'hero' || s === 'reel') { state.page.converge = 0.15; state.page.spread = 11; }
    else if (s === 'carousel' || s === 'cta') { state.page.converge = 0.6; state.page.spread = 8; }
    else { state.page.converge = 0; state.page.spread = 12; }
  },

  /* ----------------------------------------------------------------- tick */
  tick(dt) {
    workPreview.tick(dt);
    reel.tick(dt);
  },

  /* -------------------------------------------------------------- teardown */
  destroy() {
    this.unsub.forEach(fn => fn());
    this.unsub.length = 0;
    this.marquees.forEach(m => m.destroy());
    this.marquees.length = 0;
    anim.setGroup('home', false);
    anim.setGroup('reel-modal', false);
    workPreview.hide();
    magnetic.release(this.pageEl || document);
    const car = world.stages && world.stages.get('carousel');
    if (car && car.unbind) car.unbind();
    this.pageEl = null;
    this.sys = null;
  }
};

export default homePage;
