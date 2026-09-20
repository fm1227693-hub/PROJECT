import { useEffect } from 'react'
import { gsap } from '../lib/gsap'
import { subscribePointer } from '../lib/pointer'
import { useSmoothScroll } from '../context/smoothScroll'

/**
 * Moves an element a few pixels towards / away from the pointer.
 * Uses gsap.quickTo so there is no per-frame loop: every pointer event
 * simply retargets a tween. Disabled on touch and reduced-motion.
 *
 * @param {React.RefObject<HTMLElement>} ref
 * @param {{ strength?: number, rotate?: number, invert?: boolean }} options
 */
export function useMouseParallax(ref, { strength = 18, rotate = 0, invert = false } = {}) {
  const { env } = useSmoothScroll()

  useEffect(() => {
    const el = ref.current
    if (!el || !env.pointerFX) return

    const dir = invert ? -1 : 1
    const toX = gsap.quickTo(el, 'x', { duration: 1.6, ease: 'power3.out' })
    const toY = gsap.quickTo(el, 'y', { duration: 1.6, ease: 'power3.out' })
    const toR = rotate ? gsap.quickTo(el, 'rotation', { duration: 1.8, ease: 'power3.out' }) : null

    const unsubscribe = subscribePointer(({ nx, ny }) => {
      toX(nx * strength * dir)
      toY(ny * strength * dir)
      if (toR) toR(nx * rotate * dir)
    })

    return () => {
      unsubscribe()
      gsap.killTweensOf(el)
    }
  }, [ref, strength, rotate, invert, env.pointerFX])
}
