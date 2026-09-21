import { gsap } from '../lib/gsap'

/**
 * Magnetic pull. The element leans toward the pointer while it is within
 * `radius` px of its centre and springs back on leave. Optional inner label
 * moves a little less, which gives the button depth.
 * Returns a cleanup function.
 */
export function magnetic(el, { strength = 0.32, textStrength = 0.12, radius = 90, label } = {}) {
  if (!el) return () => {}

  const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'expo.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'expo.out' })
  const lxTo = label ? gsap.quickTo(label, 'x', { duration: 0.7, ease: 'expo.out' }) : null
  const lyTo = label ? gsap.quickTo(label, 'y', { duration: 0.7, ease: 'expo.out' }) : null

  let rect = null

  const onEnter = () => {
    rect = el.getBoundingClientRect()
  }
  const onMove = (e) => {
    if (!rect) rect = el.getBoundingClientRect()
    const cx = rect.left + rect.width / 2
    const cy = rect.top + rect.height / 2
    const dx = e.clientX - cx
    const dy = e.clientY - cy
    const dist = Math.hypot(dx, dy)
    const falloff = Math.max(0, 1 - dist / (radius + Math.max(rect.width, rect.height) / 2))
    xTo(dx * strength * falloff)
    yTo(dy * strength * falloff)
    lxTo?.(dx * textStrength * falloff)
    lyTo?.(dy * textStrength * falloff)
  }
  const onLeave = () => {
    rect = null
    gsap.to(el, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
    if (label) gsap.to(label, { x: 0, y: 0, duration: 1, ease: 'elastic.out(1, 0.45)', overwrite: 'auto' })
  }

  el.addEventListener('pointerenter', onEnter)
  el.addEventListener('pointermove', onMove)
  el.addEventListener('pointerleave', onLeave)

  return () => {
    el.removeEventListener('pointerenter', onEnter)
    el.removeEventListener('pointermove', onMove)
    el.removeEventListener('pointerleave', onLeave)
    gsap.killTweensOf([el, label].filter(Boolean))
  }
}

/**
 * Cursor follower for the work preview. Returns setters for position/visibility
 * and a cleanup. Movement uses quickTo so it trails the pointer softly.
 */
export function follower(el, { lag = 0.55 } = {}) {
  const xTo = gsap.quickTo(el, 'x', { duration: lag, ease: 'power3.out' })
  const yTo = gsap.quickTo(el, 'y', { duration: lag, ease: 'power3.out' })
  const rTo = gsap.quickTo(el, 'rotation', { duration: 0.8, ease: 'power3.out' })
  let lastX = null
  let visible = false

  return {
    move(x, y) {
      if (lastX !== null) {
        // a hint of banking in the direction of travel — capped so it never looks wobbly
        rTo(gsap.utils.clamp(-5, 5, (x - lastX) * 0.15))
      }
      lastX = x
      xTo(x)
      yTo(y)
    },
    jump(x, y) {
      gsap.set(el, { x, y })
      lastX = x
    },
    show() {
      if (visible) return
      visible = true
      gsap.to(el, { opacity: 1, scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
    },
    hide() {
      if (!visible) return
      visible = false
      gsap.to(el, { opacity: 0, scale: 0.9, duration: 0.45, ease: 'power3.out', overwrite: 'auto' })
      rTo(0)
    },
    destroy() {
      gsap.killTweensOf(el)
    },
  }
}
