/**
 * Environment / capability detection, evaluated lazily in the browser.
 * The values are used to decide which layer of the motion language to
 * enable: full (desktop, fine pointer), touch (simplified) or reduced.
 */

const mq = (query) =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia(query).matches
    : false

export function prefersReducedMotion() {
  return mq('(prefers-reduced-motion: reduce)')
}

export function hasFinePointer() {
  return mq('(hover: hover) and (pointer: fine)')
}

export function isTouchDevice() {
  return mq('(pointer: coarse)') || !mq('(hover: hover)')
}

export function isDesktopViewport() {
  return mq('(min-width: 1024px)')
}

export function getEnv() {
  const reduced = prefersReducedMotion()
  const touch = isTouchDevice()
  const fine = hasFinePointer()
  return {
    reduced,
    touch,
    fine,
    // The custom cursor and mouse-driven parallax only make sense here.
    pointerFX: fine && !touch && !reduced,
    // Smooth scrolling is a desktop luxury; touch devices keep native scroll.
    smooth: !touch && !reduced,
  }
}
