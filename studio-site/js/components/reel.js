/* =====================================================================
   COMPONENTS / REEL
   The showreel portal.

   Scroll choreography: the card starts small and tilted, then the section
   pins while the card expands to full-bleed — radius collapses, tilt
   straightens, the letterbox bars open, the vignette lights up and the 3D
   gate (PortalStage) opens in step via state.page.reelOpen. Clicking at any
   point drops you into the modal, where the reel "plays".

   There is no video file: the footage is a live generative film render, so
   it is sharp at any size and costs one canvas.
   ===================================================================== */
import { gsap } from '../core/vendor.js';
import { ScrollTrigger } from '../core/vendor.js';
import { state } from '../core/state.js';
import { anim } from './generative.js';
import { cursor } from '../core/cursor.js';
import { scroll } from '../core/scroll.js';
import { byId, clamp } from '../core/utils.js';

const DURATION = 108; /* seconds — matches the "01:48" card label */

function tc(s) {
  const total = Math.max(0, s) % DURATION;
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const sec = Math.floor(total % 60);
  const f = Math.floor((total % 1) * 24);
  const p = n => String(n).padStart(2, '0');
  return `${p(h)}:${p(m)}:${p(sec)}:${p(f)}`;
}

export const reel = {
  sec: null, card: null, tcEl: null, pctEl: null,
  modal: null, modalCanvas: null, progEl: null, modalTc: null,
  cardItem: null, modalItem: null,
  open: false, playing: false, elapsed: 0, p: 0,

  init() {
    this.sec = byId('reelSec');
    if (this._inited) {
      /* canvases and listeners live in persistent DOM — just re-activate */
      if (this.cardItem) { this.cardItem.active = true; this.cardItem.group = 'home'; }
      anim.setGroup('reel-modal', false);
      this.measure();
      return;
    }
    this._inited = true;
    this.card = byId('reelCard');
    this.tcEl = byId('reelTc');
    this.pctEl = byId('reelPct');
    this.modal = byId('reelModal');
    this.modalCanvas = byId('reelModalCanvas');
    this.progEl = byId('reelProg');
    this.modalTc = byId('reelModalTc');

    const cardCanvas = this.card && this.card.querySelector('canvas');
    if (cardCanvas) {
      this.cardItem = anim.add(cardCanvas, 'film', ['#ff4d1f', '#4f46e5', '#0b0b0c'], {
        group: 'home', interactive: true, fps: 48
      });
    }
    if (this.modalCanvas) {
      this.modalItem = anim.add(this.modalCanvas, 'film', ['#ff4d1f', '#4f46e5', '#0b0b0c'], {
        group: 'reel-modal', force: true, active: false, interactive: false, fps: 60
      });
    }

    if (this.card) {
      this.card.addEventListener('click', () => this.openModal());
      this.card.addEventListener('mouseenter', () => cursor.setLabel('Play'));
      this.card.addEventListener('mouseleave', () => cursor.setMode('default', true));
    }
    this.cover = 1.2;
    window.addEventListener('resize', () => this.measure());
    requestAnimationFrame(() => this.measure());

    const play = byId('reelPlay');
    if (play) play.addEventListener('click', e => { e.stopPropagation(); this.openModal(); });
    const close = byId('reelClose');
    if (close) close.addEventListener('click', () => this.closeModal());
    if (this.modal) {
      this.modal.addEventListener('click', e => { if (e.target === this.modal || e.target === this.modalCanvas) this.closeModal(); });
    }
    window.addEventListener('keydown', this.onKey);
  },

  onKey(e) { if (e.key === 'Escape' && reel.open) reel.closeModal(); },

  /* ------------------------------------------------------- scroll portal */
  createScroll(sys) {
    if (!this.sec || !this.card) return;
    const card = this.card, sec = this.sec;

    const st = ScrollTrigger.create({
      trigger: sec,
      start: 'top top',
      end: '+=185%',
      pin: true,
      pinSpacing: true,
      scrub: 0.55,
      anticipatePin: 1,
      onUpdate: self => reel.apply(self.progress),
      onLeave: () => reel.apply(1),
      onLeaveBack: () => reel.apply(0)
    });
    sys.add(st);
    this.apply(0);
  },

  /** p: 0 = small tilted card, 1 = full-bleed portal */
  apply(p) {
    this.p = p;
    state.page.reelOpen = p;
    if (!this.card) return;

    const cover = this.cover;

    const e = gsap.parseEase('power2.inOut')(clamp(p, 0, 1));
    const scale = 0.86 + (cover * 1.02 - 0.86) * e;
    const rot = -4.5 * (1 - e);
    const lift = (1 - e) * 4;      /* vh */
    const radius = 28 * (1 - e);

    this.card.style.transform = `translate3d(0, ${lift.toFixed(2)}vh, 0) rotate(${rot.toFixed(3)}deg) scale(${scale.toFixed(4)})`;
    this.card.style.borderRadius = radius.toFixed(2) + 'px';
    this.card.style.boxShadow = e > 0.96 ? 'none' : '';

    /* letterbox bars retract as we go through the gate */
    const bars = this.card.querySelectorAll('.reel-bars i');
    bars.forEach(b => { b.style.height = (9 * (1 - e) + 0.4).toFixed(2) + '%'; });

    const cta = this.card.querySelector('.reel-cta');
    if (cta) cta.style.opacity = String(clamp(1 - e * 2.1, 0, 1));
    const meta = this.card.querySelector('.reel-meta');
    if (meta) meta.style.opacity = String(clamp(1 - e * 1.6, 0, 1));
    const marks = this.card.querySelector('.marks');
    if (marks) marks.style.opacity = String(clamp(1 - e * 1.8, 0, 1));

    this.sec.classList.toggle('lit', p > 0.06);
    if (this.pctEl) this.pctEl.textContent = Math.round(p * 100) + '%';
    if (this.tcEl) this.tcEl.textContent = tc(p * DURATION);
  },

  /** cached layout math — measuring inside a scrub callback would thrash layout */
  measure() {
    if (!this.card) return;
    const w = this.card.offsetWidth || 1;
    const h = this.card.offsetHeight || 1;
    this.cover = Math.max(window.innerWidth / w, window.innerHeight / h);
    this.apply(this.p);
  },

  /* ------------------------------------------------------------ the modal */
  openModal() {
    if (this.open || !this.modal) return;
    this.open = true;
    this.playing = true;
    this.elapsed = this.p * DURATION;
    this.modal.classList.add('open');
    document.body.classList.add('modal-open');
    scroll.stop();
    if (this.modalItem) { this.modalItem.active = true; this.modalItem.st = {}; }
    state.page.reelModal = 1;
    cursor.setLabel('Close');

    gsap.fromTo(this.modalCanvas,
      { scale: 0.88, opacity: 0, filter: 'blur(14px)' },
      { scale: 1, opacity: 1, filter: 'blur(0px)', duration: 0.9, ease: 'expo.out' });
    gsap.fromTo([this.modal.querySelector('.close'), this.modal.querySelector('.reel-modal-meta'), this.progEl],
      { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.5, delay: 0.35, stagger: 0.06, ease: 'power2.out' });
  },

  closeModal() {
    if (!this.open) return;
    this.open = false;
    this.playing = false;
    state.page.reelModal = 0;
    cursor.setMode('default', true);
    gsap.to(this.modalCanvas, {
      scale: 0.9, opacity: 0, filter: 'blur(10px)', duration: 0.45, ease: 'power2.in',
      onComplete: () => {
        this.modal.classList.remove('open');
        document.body.classList.remove('modal-open');
        gsap.set(this.modalCanvas, { clearProps: 'all' });
        if (this.modalItem) this.modalItem.active = false;
        scroll.start();
        scroll.refresh();
      }
    });
  },

  tick(dt) {
    if (!this.playing) return;
    this.elapsed += dt;
    if (this.progEl) {
      const i = this.progEl.querySelector('i') || this.progEl;
      i.style.width = ((this.elapsed % DURATION) / DURATION * 100).toFixed(2) + '%';
    }
    if (this.modalTc) {
      const total = this.elapsed % DURATION;
      this.modalTc.textContent = `${String(Math.floor(total / 60)).padStart(2, '0')}:${String(Math.floor(total % 60)).padStart(2, '0')}`;
    }
  },

  destroy() {
    /* the reel DOM is persistent (it lives in index.html / the home page),
       so we deactivate rather than destroy — no re-creation cost, no leak. */
    if (this.cardItem) this.cardItem.active = false;
    if (this.modalItem) this.modalItem.active = false;
    if (this.modal) this.modal.classList.remove('open');
    document.body.classList.remove('modal-open');
    this.open = false; this.playing = false;
  }
};
