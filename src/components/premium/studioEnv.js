/* Shared environment probes for the studio layer.
   Single source of truth so animation logic is never duplicated. */

export const isCoarsePointer = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(hover: none), (pointer: coarse)').matches;

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Device tier drives adaptive rendering: 0 = reduced, 1 = mobile, 2 = tablet, 3 = desktop */
export function deviceTier() {
  if (prefersReducedMotion()) return 0;
  const w = window.innerWidth;
  const cores = navigator.hardwareConcurrency || 4;
  if (w < 768) return 1;
  if (w < 1180 || cores <= 4) return 2;
  return 3;
}

/* Fired once the preloader has left the stage so entrance choreography can start. */
export const READY_EVENT = 'studio:ready';

export function emitReady() {
  window.dispatchEvent(new CustomEvent(READY_EVENT));
}

export function onReady(fn) {
  if (window.__studioReady) {
    fn();
    return () => {};
  }
  const handler = () => fn();
  window.addEventListener(READY_EVENT, handler, { once: true });
  return () => window.removeEventListener(READY_EVENT, handler);
}
