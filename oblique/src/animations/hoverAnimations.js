import { gsap } from '../lib/gsap'

/**
 * Magnetic attraction: the element leans towards the pointer while it is
 * within its bounds and springs back when it leaves.
 *
 * @param {HTMLElement} el          The element that moves.
 * @param {HTMLElement} [inner]     Optional inner element with a weaker pull (text parallax).
 * @param {{ strength?: number, innerStrength?: number }} options
 * @returns {() => void} cleanup
 */
export function magnetic(el, inner, { strength = 0.35, innerStrength = 0.12 } = {}) {
  if (!el) return () => {}

  const xTo = gsap.quickTo(el, 'x', { duration: 0.9, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.9, ease: 'power3.out' })
  const ixTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.9, ease: 'power3.out' }) : null
  const iyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.9, ease: 'power3.out' }) : null

  const onMove = (e) => {
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    xTo(dx * strength)
    yTo(dy * strength)
    if (ixTo) ixTo(dx * innerStrength)
    if (iyTo) iyTo(dy * innerStrength)
  }

  const onLeave = () => {
    gsap.to(el, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
    if (inner) gsap.to(inner, { x: 0, y: 0, duration: 1.1, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
  }

  el.addEventListener('pointermove', onMove, { passive: true })
  el.addEventListener('pointerleave', onLeave)

  return () => {
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
    gsap.killTweensOf([el, inner].filter(Boolean))
  }
}

/**
 * Subtle 3D tilt for cards. Rotation is limited to a few degrees so it
 * reads as depth rather than as a gimmick.
 */
export function tilt(el, { max = 6, scale = 1.02 } = {}) {
  if (!el) return () => {}

  gsap.set(el, { transformPerspective: 900 })
  const rxTo = gsap.quickTo(el, 'rotationX', { duration: 0.8, ease: 'power3.out' })
  const ryTo = gsap.quickTo(el, 'rotationY', { duration: 0.8, ease: 'power3.out' })

  const onMove = (e) => {
    const rect = el.getBoundingClientRect()
    const px = (e.clientX - rect.left) / rect.width - 0.5
    const py = (e.clientY - rect.top) / rect.height - 0.5
    rxTo(-py * max * 2)
    ryTo(px * max * 2)
  }
  const onEnter = () => gsap.to(el, { scale, duration: 0.8, ease: 'power3.out' })
  const onLeave = () => {
    gsap.to(el, { rotationX: 0, rotationY: 0, scale: 1, duration: 1, ease: 'power3.out', overwrite: 'auto' })
  }

  el.addEventListener('pointerenter', onEnter)
  el.addEventListener('pointermove', onMove, { passive: true })
  el.addEventListener('pointerleave', onLeave)

  return () => {
    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
    gsap.killTweensOf(el)
  }
}

/**
 * A preview element that follows the pointer inside a container.
 * Returns { move, show, hide, destroy }.
 */
export function cursorFollower(el, container, { lag = 0.7, offsetX = 40, offsetY = -40 } = {}) {
  const xTo = gsap.quickTo(el, 'x', { duration: lag, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: lag, ease: 'power3.out' })

  const move = (e) => {
    // The container scrolls (and is transformed by ScrollSmoother), so the
    // rect is read on every move. It is a cheap read while layout is clean.
    const rect = container.getBoundingClientRect()
    xTo(e.clientX - rect.left + offsetX)
    yTo(e.clientY - rect.top + offsetY)
  }
  const show = () => {
    gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
  }
  const hide = () => {
    gsap.to(el, { autoAlpha: 0, scale: 0.9, duration: 0.5, ease: 'power3.out', overwrite: 'auto' })
  }
  const destroy = () => gsap.killTweensOf(el)

  return { move, show, hide, destroy }
}
