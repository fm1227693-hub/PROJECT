/**
 * Scroll bus — a single source of truth for scroll position that lives
 * *outside* React state. Components that animate per-frame (the WebGL
 * scene, parallax layers) read `scrollState.y` inside their own RAF
 * loop, so continuous scrolling never triggers a re-render.
 */
export const scrollState = {
  y: 0,
  limit: 0,
  velocity: 0,
};

export function setScroll(y, limit, velocity) {
  scrollState.y = y;
  scrollState.limit = limit || document.documentElement.scrollHeight - window.innerHeight;
  scrollState.velocity = velocity || 0;
}

/** Normalised 0..1 progress through the whole document. */
export function scrollProgress() {
  return scrollState.limit > 0 ? Math.min(1, Math.max(0, scrollState.y / scrollState.limit)) : 0;
}

/**
 * One eased jump for every in-page anchor, so the header, the footer and the
 * back-to-top control all move the way the rest of the page moves. Falls back
 * to scrollIntoView when smoothing is off.
 */
export function scrollToSection(target, { offset = -64, duration = 1.45 } = {}) {
  const el = typeof target === 'string' ? document.querySelector(target) : target;
  if (!el) return;
  const lenis = window.nebulaLenis;
  if (lenis) {
    lenis.scrollTo(el, { offset, duration });
    return;
  }
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  el.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'start' });
}
