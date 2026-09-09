import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Shared GSAP bootstrap + the house animation vocabulary.
 *
 * Everything visual on this site is built from a handful of primitives so
 * the whole page moves with one accent: type rises out of a mask, media is
 * uncovered by a clip, hairlines are drawn, depth comes from scrubbed
 * transforms. No component invents its own easing or its own loop.
 */
let registered = false;

export function registerGsap() {
  if (registered || typeof window === 'undefined') return gsap;
  registered = true;

  gsap.registerPlugin(ScrollTrigger);
  gsap.ticker.lagSmoothing(0);
  gsap.defaults({ ease: 'power3.out' });
  gsap.config({ force3D: true });

  let timer;
  const refresh = () => {
    clearTimeout(timer);
    timer = setTimeout(() => ScrollTrigger.refresh(), 220);
  };
  window.addEventListener('resize', refresh);
  window.addEventListener('orientationchange', refresh);
  return gsap;
}

/** Site-wide easing vocabulary — one feel everywhere. */
export const EASE = {
  out: 'power3.out',
  soft: 'power2.out',
  inOut: 'power3.inOut',
  /** The signature: long, decelerating, unhurried. */
  cinematic: 'expo.out',
  curtain: 'expo.inOut',
  linear: 'none',
};

/** Travel distances by tier — mobile moves half as far, and that is enough. */
export function depth(scale = 1) {
  const desktop = window.matchMedia('(min-width: 1024px) and (hover: hover)').matches;
  const tablet = window.matchMedia('(min-width: 768px)').matches;
  return scale * (desktop ? 1 : tablet ? 0.6 : 0.38);
}

/**
 * Line-mask type reveal. Each `[data-reveal-line]` sits inside an
 * `overflow:hidden` mask, so the line physically enters the frame rather than
 * fading into it. Optional per-line drift + one-shot softening for the
 * headline's final line.
 */
export function typeReveal(
  lines,
  {
    trigger,
    start = 'top 84%',
    stagger = 0.13,
    duration = 1.15,
    ease = EASE.cinematic,
    fromY = 135,
    drift = 0,
    delay = 0,
    once = true,
    onComplete,
  } = {}
  ) {
  const targets = gsap.utils.toArray(lines);
  if (!targets.length) return null;

  return gsap.fromTo(
    targets,
    { yPercent: fromY, y: 0, x: drift ? -drift : 0, opacity: 0 },
    {
      yPercent: 0,
      y: 0,
      x: 0,
      opacity: 1,
      duration,
      ease,
      stagger,
      delay,
      onComplete,
      scrollTrigger: trigger ? { trigger, start, once } : undefined,
    }
  );
}

/**
 * typeSpread — words drift apart as the reader scrolls.
 *
 * The premium version of "letterspacing on scroll": tracking is a layout
 * property, so instead each word becomes an inline-block and travels on
 * transform, anchored around the centre of the line. Words are wrapped once, on
 * first use, after hydration — the server markup stays plain text, so there is
 * nothing for React to disagree about.
 */
export function typeSpread(lines, { amount = 1, start = 'top bottom', end = 'top 26%', scrub = 1 } = {}) {
  const rows = gsap.utils.toArray(lines);
  if (!rows.length) return null;

  const split = (line) => {
    if (line.dataset.spread === 'on') return gsap.utils.toArray(line.children);
    const words = line.textContent.trim().split(/\s+/).filter(Boolean);
    line.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.style.display = 'inline-block';
      span.style.whiteSpace = 'pre';
      span.textContent = i < words.length - 1 ? `${word} ` : word;
      line.appendChild(span);
    });
    line.dataset.spread = 'on';
    return gsap.utils.toArray(line.children);
  };

  rows.forEach((line) => {
    const words = split(line);
    if (words.length < 2) return;
    // Travel is expressed in type size, not percent of each word, so the gap
    // opens evenly no matter how wide the words are.
    const unit = parseFloat(getComputedStyle(line).fontSize || '16') * 0.06 * amount;
    const mid = (words.length - 1) / 2;
    words.forEach((word, i) => {
      const shift = (i - mid) * unit;
      gsap.fromTo(word, { x: -shift }, {
        x: shift,
        ease: EASE.linear,
        scrollTrigger: { trigger: line.parentElement || line, start, end, scrub },
      });
    });
  });
  return null;
}

/**
 * Hairlines that draw themselves across the page as a section arrives.
 * Any `[data-seam-line]` inside the scope gets a short scrubbed scaleX — the
 * thread that stitches sections into one continuous line of thought.
 */
export function drawSeams(scope, { start = 'top 92%', end = 'top 58%' } = {}) {
  const lines = gsap.utils.toArray('[data-seam-line]', scope);
  if (!lines.length) return;
  gsap.fromTo(
    lines,
    { scaleX: 0 },
    {
      scaleX: 1,
      ease: EASE.linear,
      scrollTrigger: { trigger: scope, start, end, scrub: 0.5 },
    }
  );
}

/** Numeric counter used for section indices and hero stats. Snap-based. */
export function countUp(el, to, { from = 0, duration = 0.9, pad = 2, trigger, start = 'top 88%' } = {}) {
  if (!el) return null;
  const state = { v: from };
  el.textContent = String(from).padStart(pad, '0');
  return gsap.to(state, {
    v: to,
    duration,
    ease: 'power2.out',
    snap: 'v',
    onUpdate: () => {
      el.textContent = String(Math.round(state.v)).padStart(pad, '0');
    },
    scrollTrigger: trigger ? { trigger, start, once: true } : undefined,
  });
}

/**
 * Media reveal: the frame is uncovered with clip-path while the image itself
 * settles from 1.08 → 1. Plays once; after that nothing about it is animated
 * per frame, which is why a page full of these still costs nothing.
 */
export function mediaReveal(frame, media, { trigger, start = 'top 80%', once = true } = {}) {
  const tl = gsap.timeline({ scrollTrigger: { trigger: trigger || frame, start, once } });
  if (frame) {
    tl.fromTo(
      frame,
      { clipPath: 'inset(0 100% 0 0)' },
      // clip-path is released afterwards: a finished reveal should leave no
      // compositing work behind.
      { clipPath: 'inset(0 0% 0 0)', duration: 1.15, ease: EASE.inOut, clearProps: 'clip-path' },
      0
    );
  }
  if (media) {
    tl.fromTo(
      media,
      { scale: 1.08 },
      { scale: 1, duration: 1.5, ease: EASE.cinematic, clearProps: 'transform' },
      0.06
    );
  }
  return tl;
}

/**
 * One scrubbed timeline that spreads layers across different speeds.
 * `items: [{ target, y, x, scale, opacity }]` — percentage transforms only.
 */
export function parallax(scope, items, { trigger, start = 'top top', end = 'bottom top', scrub = 0.7 } = {}) {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: trigger || scope,
      start,
      end,
      scrub,
      invalidateOnRefresh: true,
    },
  });
  items.forEach((item) => {
    const vars = { ease: EASE.linear };
    ['yPercent', 'xPercent', 'scale', 'opacity', 'rotate'].forEach((k) => {
      if (item[k] !== undefined) vars[k] = item[k];
    });
    const targets = typeof item.target === 'string' ? gsap.utils.toArray(item.target, scope) : item.target;
    if (targets && targets.length) tl.to(targets, vars, 0);
  });
  return tl;
}
