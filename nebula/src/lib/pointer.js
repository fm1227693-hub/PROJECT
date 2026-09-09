/**
 * Pointer bus.
 *
 * One passive `pointermove` listener serves the entire site. The custom
 * cursor, the WebGL rig and the atmosphere light all subscribe here instead
 * of installing their own mouse-tracking systems, and none of them touch
 * React state — subscribers read the store and hand the values to GSAP
 * `quickTo` functions that run on the shared ticker.
 */
const subs = new Set();

export const pointer = {
  x: 0,
  y: 0,
  /** Normalised −1 → 1 across the viewport, for parallax-style reactions. */
  nx: 0,
  ny: 0,
  inside: false,
  down: false,
  primed: false,
};

let bound = false;

function emit(e) {
  for (const fn of subs) fn(pointer, e);
}

function onMove(e) {
  pointer.x = e.clientX;
  pointer.y = e.clientY;
  pointer.nx = (e.clientX / window.innerWidth) * 2 - 1;
  pointer.ny = (e.clientY / window.innerHeight) * 2 - 1;
  if (!pointer.inside) pointer.inside = true;
  pointer.primed = true;
  emit(e);
}

function onDown(e) {
  pointer.down = true;
  onMove(e);
}

function onUp() {
  pointer.down = false;
  emit();
}

function onLeave() {
  pointer.inside = false;
  pointer.down = false;
  emit();
}

function bind() {
  if (bound || typeof window === 'undefined') return;
  bound = true;
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('pointerdown', onDown, { passive: true });
  window.addEventListener('pointerup', onUp, { passive: true });
  window.addEventListener('blur', onLeave);
  document.documentElement.addEventListener('pointerleave', onLeave);
}

/**
 * Register a subscriber. Returns an unsubscribe function; when the last
 * subscriber leaves, the global listeners stay bound (they are one frame of
 * math at worst, and re-binding on every remount is the bigger cost).
 */
export function subscribePointer(fn) {
  bind();
  subs.add(fn);
  fn(pointer);
  return () => subs.delete(fn);
}
