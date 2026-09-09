/**
 * Boot latch.
 *
 * The preloader owns the first 1.4 seconds of the experience. Anything that
 * is choreographed *against* that curtain — the hero timeline, the scroll
 * progress rail — waits on this latch instead of guessing a delay, so the
 * entrance never plays half-hidden behind the loader or twice in a row.
 *
 * Under reduced motion (or if the preloader never mounts) `markBooted` is
 * called immediately and the promise resolves on the same tick it is awaited.
 */
let resolveBoot;
let booted = false;

export const bootPromise = new Promise((resolve) => {
  resolveBoot = resolve;
});

export function markBooted() {
  if (booted || typeof document === 'undefined') return;
  booted = true;
  document.documentElement.dataset.booted = 'true';
  resolveBoot();
}

export function isBooted() {
  return booted;
}

/**
 * Run `fn` once the curtain has lifted (immediately if it already has).
 * Returns a cancel function for effects that may unmount mid-boot.
 */
export function whenBooted(fn) {
  if (booted) {
    fn();
    return () => {};
  }
  let cancelled = false;
  bootPromise.then(() => {
    if (!cancelled) fn();
  });
  return () => {
    cancelled = true;
  };
}
