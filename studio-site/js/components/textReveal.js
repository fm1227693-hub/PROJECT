/* =====================================================================
   COMPONENTS / TEXT REVEAL
   Splits [data-reveal] elements and gives each reveal type its own
   choreography. Everything is ScrollTrigger-bound through the page's
   ScrollSystem so a route change tears it all down cleanly.

   Modes: lines | words | chars | mask | blur | (default: eyebrow slide)
   ===================================================================== */
import { gsap, ScrollTrigger } from '../core/vendor.js';
import { clamp } from '../core/utils.js';

let gate = null;                 /* set by main.js: fn that waits for the preloader */
export function setRevealGate(fn) { gate = fn; }

/* -------------------------------------------------------------- splitting */
export function splitWords(el) {
  if (el.dataset.split === 'words') return;
  const walk = node => {
    const kids = Array.prototype.slice.call(node.childNodes);
    kids.forEach(k => {
      if (k.nodeType === 3) {
        const frag = document.createDocumentFragment();
        k.textContent.split(/(\s+)/).forEach(part => {
          if (!part) return;
          if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
          const s = document.createElement('span');
          s.className = 'wd';
          s.textContent = part;
          frag.appendChild(s);
        });
        node.replaceChild(frag, k);
      } else if (k.nodeType === 1 && !k.classList.contains('wd')) {
        walk(k);
      }
    });
  };
  walk(el);
  el.dataset.split = 'words';
}

export function splitChars(el) {
  if (el.dataset.split === 'chars') return;
  splitWords(el);
  el.querySelectorAll('.wd').forEach(w => {
    const frag = document.createDocumentFragment();
    w.textContent.split('').forEach(ch => {
      const s = document.createElement('span');
      s.className = 'ch';
      s.textContent = ch;
      frag.appendChild(s);
    });
    w.appendChild(frag);
  });
  el.dataset.split = 'chars';
}

/* -------------------------------------------------------------- animations */
function animFor(el, mode) {
  const d = parseFloat(el.dataset.delay || '0');
  const dur = parseFloat(el.dataset.dur || '0.95');

  if (mode === 'chars') {
    splitChars(el);
    const chars = el.querySelectorAll('.ch');
    gsap.set(chars, { yPercent: 118, rotateX: -52, opacity: 0, transformOrigin: '50% 100%' });
    return gsap.fromTo(chars,
      { yPercent: 118, rotateX: -52, opacity: 0 },
      { yPercent: 0, rotateX: 0, opacity: 1, duration: dur * 0.9, ease: 'power3.out', stagger: { each: 0.012, from: 'start' }, delay: d });
  }

  if (mode === 'words') {
    splitWords(el);
    const words = el.querySelectorAll('.wd');
    gsap.set(words, { yPercent: 112, opacity: 0, filter: 'blur(4px)' });
    return gsap.fromTo(words,
      { yPercent: 112, opacity: 0, filter: 'blur(4px)' },
      { yPercent: 0, opacity: 1, filter: 'blur(0px)', duration: dur, ease: 'power3.out', stagger: { each: 0.028 }, delay: d });
  }

  if (mode === 'lines') {
    /* headings ship with .line > span markup; paragraphs fall back to words */
    const lines = el.querySelectorAll('.line > span');
    if (!lines.length) return animFor(el, 'words');
    gsap.set(lines, { yPercent: 116, rotate: 1.6, opacity: 0 });
    return gsap.fromTo(lines,
      { yPercent: 116, rotate: 1.6, opacity: 0 },
      { yPercent: 0, rotate: 0, opacity: 1, duration: dur * 1.1, ease: 'expo.out', stagger: 0.075, delay: d });
  }

  if (mode === 'mask') {
    gsap.set(el, { clipPath: 'inset(0% 100% 0% 0%)' });
    return gsap.fromTo(el,
      { clipPath: 'inset(0% 100% 0% 0%)' },
      { clipPath: 'inset(0% 0% 0% 0%)', duration: dur * 1.5, ease: 'expo.inOut', delay: d });
  }

  if (mode === 'blur') {
    gsap.set(el, { opacity: 0, filter: 'blur(14px)', y: 26 });
    return gsap.fromTo(el,
      { opacity: 0, filter: 'blur(14px)', y: 26 },
      { opacity: 1, filter: 'blur(0px)', y: 0, duration: dur * 1.4, ease: 'power2.out', delay: d });
  }

  /* default: quiet eyebrow slide */
  gsap.set(el, { opacity: 0, x: -16 });
  return gsap.fromTo(el, { opacity: 0, x: -16 }, { opacity: 1, x: 0, duration: dur, ease: 'power3.out', delay: d });
}

/* -------------------------------------------------------------- binding */
/**
 * Bind every reveal inside `root` to ScrollTrigger, registered on `sys`.
 * Nothing animates before the preloader completes (the gate).
 */
export function bindReveals(root, sys, opts = {}) {
  const els = root.querySelectorAll('[data-reveal], .reveal');
  const start = opts.start || 'top 88%';
  els.forEach(el => {
    const mode = el.dataset.reveal || 'fade';
    if (!el.dataset.reveal) el.dataset.reveal = 'fade';
    /* hide immediately so nothing flashes in before its trigger */
    if (mode === 'fade') gsap.set(el, { opacity: 0, y: 34 });

    const st = ScrollTrigger.create({
      trigger: el,
      start,
      once: !opts.replay,
      onEnter: () => {
        const fire = () => animFor(el, mode);
        if (gate) gate(fire); else fire();
      }
    });
    sys.add(st);
  });
  return els.length;
}

/** Immediate reveal (used for the intro sequence, above the fold). */
export function revealNow(el, mode) {
  const fire = () => animFor(el, mode || el.dataset.reveal || 'fade');
  if (gate) gate(fire); else fire();
}

/** Reveal a whole page's first screen without waiting for scroll. */
export function revealAboveFold(root) {
  const els = root.querySelectorAll('[data-hero-reveal]');
  els.forEach((el, i) => {
    el.dataset.delay = String(clamp(i * 0.06, 0, 0.8));
    revealNow(el, el.dataset.reveal || 'fade');
  });
}
