import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap, ScrollTrigger, ScrollSmoother } from '../lib/gsap'
import { getEnv } from '../lib/device'
import { SmoothScrollContext, useSmoothScroll } from './smoothScroll'

/**
 * Owns the ScrollSmoother instance and gates the rendering of the page
 * content until (a) fonts are ready and (b) the smoother exists — so that
 * every ScrollTrigger created by the sections is registered *after* the
 * smoother, which is what GSAP expects.
 */
export function SmoothScrollProvider({ children }) {
  const [ready, setReady] = useState(false)
  const smootherRef = useRef(null)
  const env = useMemo(() => getEnv(), [])

  useLayoutEffect(() => {
    let cancelled = false

    const init = () => {
      if (cancelled) return
      if (env.smooth) {
        smootherRef.current = ScrollSmoother.create({
          wrapper: '#smooth-wrapper',
          content: '#smooth-content',
          smooth: 1.1,
          effects: false,
          normalizeScroll: false,
          ignoreMobileResize: true,
        })
      }
      document.documentElement.classList.add('is-ready')
      setReady(true)
    }

    // Wait for the variable fonts so that split text measures correctly,
    // but never block the page for more than ~1.2s.
    const fonts = document.fonts?.ready ?? Promise.resolve()
    const timeout = new Promise((resolve) => setTimeout(resolve, 1200))
    Promise.race([fonts, timeout]).then(init)

    return () => {
      cancelled = true
      smootherRef.current?.kill()
      smootherRef.current = null
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [env])

  const scrollTo = useCallback(
    (target, offset = 0) => {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      if (!el) return
      if (smootherRef.current) {
        const y = smootherRef.current.offset(el, `top ${offset}px`)
        gsap.to(smootherRef.current, {
          scrollTop: y,
          duration: 1.4,
          ease: 'power3.inOut',
          overwrite: true,
        })
      } else {
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: env.reduced ? 'auto' : 'smooth' })
      }
    },
    [env.reduced],
  )

  const pause = useCallback((paused) => {
    if (smootherRef.current) {
      smootherRef.current.paused(paused)
    } else {
      document.documentElement.style.overflow = paused ? 'hidden' : ''
    }
  }, [])

  const getSmoother = useCallback(() => smootherRef.current, [])

  const value = useMemo(
    () => ({ ready, env, scrollTo, pause, getSmoother }),
    [ready, env, scrollTo, pause, getSmoother],
  )

  return <SmoothScrollContext.Provider value={value}>{children}</SmoothScrollContext.Provider>
}

/**
 * The scrollable content container. Children are only mounted once the
 * provider reports `ready`, guaranteeing correct ScrollTrigger ordering.
 */
export function SmoothContent({ children }) {
  const { ready } = useSmoothScroll()
  return (
    <div id="smooth-wrapper">
      <div id="smooth-content">{ready ? children : null}</div>
    </div>
  )
}
