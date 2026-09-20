import { useEffect, useRef } from 'react'

/**
 * useParallax — subtle, GPU-only (transform) scroll parallax.
 *
 * - Desktop only by default (never runs on touch/small viewports)
 * - Disabled with prefers-reduced-motion
 * - Uses a single rAF-throttled scroll listener; no loops when idle
 *
 * Usage:
 *   const ref = useParallax({ strength: 40 })
 *   <div ref={ref}>…</div>
 *
 * `strength` = max pixels the element drifts (positive = moves slower
 * than scroll as it approaches viewport centre).
 */
export default function useParallax({ strength = 36, desktopOnly = true, disabled = false } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || disabled || strength === 0) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    const mqDesktop = window.matchMedia('(min-width: 1024px)')
    let raf = null
    let active = !desktopOnly || mqDesktop.matches

    const update = () => {
      raf = null
      if (!active) {
        el.style.transform = ''
        return
      }
      const rect = el.getBoundingClientRect()
      if (rect.bottom < -200 || rect.top > window.innerHeight + 200) return // off-screen: skip work
      const center = rect.top + rect.height / 2
      const p = (center - window.innerHeight / 2) / (window.innerHeight / 2) // -1 … 1
      el.style.transform = `translate3d(0, ${(-p * strength).toFixed(1)}px, 0)`
    }

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    const onMq = (e) => {
      active = !desktopOnly || e.matches
      onScroll()
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    mqDesktop.addEventListener('change', onMq)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      mqDesktop.removeEventListener('change', onMq)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [strength, desktopOnly, disabled])

  return ref
}
