import { useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onReady, prefersReducedMotion } from './studioEnv'

gsap.registerPlugin(ScrollTrigger)

/**
 * useSplitReveal — the single place line-mask reveals are driven.
 * Elements marked `[data-split]` containing `.st-line > span` are animated
 * either immediately (hero / above the fold) or on scroll into view.
 *
 * @param {React.RefObject} scope  container to search within
 * @param {object} opts
 * @param {boolean} opts.immediate  animate on `studio:ready` instead of on scroll
 * @param {number}  opts.delay      seconds to wait before starting
 * @param {number}  opts.stagger    seconds between lines
 */
export default function useSplitReveal(scope, { immediate = false, delay = 0, stagger = 0.09 } = {}) {
  useEffect(() => {
    const root = scope?.current
    if (!root) return

    const targets = [...root.querySelectorAll('[data-split]')]
      .map((el) => ({ el, lines: [...el.querySelectorAll('.st-line > span')] }))
      .filter((t) => t.lines.length)

    if (!targets.length) return

    const reduced = prefersReducedMotion()

    const play = () => {
      targets.forEach(({ lines }, i) => {
        if (reduced) {
          gsap.set(lines, { yPercent: 0, opacity: 1 })
          return
        }
        gsap.fromTo(
          lines,
          { yPercent: 120, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.25,
            stagger,
            ease: 'expo.out',
            delay: delay + i * 0.06,
          }
        )
      })
    }

    if (immediate) {
      const off = onReady(play)
      return off
    }

    const triggers = targets.map(({ el, lines }) => {
      gsap.set(lines, { yPercent: reduced ? 0 : 120, opacity: reduced ? 1 : 0 })
      return ScrollTrigger.create({
        trigger: el,
        start: 'top 88%',
        once: true,
        onEnter: () => {
          if (reduced) {
            gsap.set(lines, { yPercent: 0, opacity: 1 })
          } else {
            gsap.fromTo(
              lines,
              { yPercent: 120, opacity: 0 },
              { yPercent: 0, opacity: 1, duration: 1.25, stagger, ease: 'expo.out' }
            )
          }
        },
      })
    })

    return () => triggers.forEach((t) => t.kill())
  }, [scope, immediate, delay, stagger])
}
