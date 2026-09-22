/**
 * LUSION CORE — Viscous Scroll Choreography & Camera Dynamics
 * Inertial scroll engine unified with GSAP ScrollTrigger + RAF
 * Lerp 0.055, wheelMultiplier 0.85, infinite false
 * Production-grade with proper cleanup to prevent leaks
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export interface LenisScrollState {
  scroll: number
  progress: number
  velocity: number
  direction: number
  isScrolling: boolean
}

export default function useLenisScroller() {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
  const [scrollState, setScrollState] = useState<LenisScrollState>({
    scroll: 0,
    progress: 0,
    velocity: 0,
    direction: 1,
    isScrolling: false,
  })

  const scrollProgressRef = useRef(0)

  const getScrollProgress = useCallback(() => scrollProgressRef.current, [])

  useEffect(() => {
    // Viscous smooth-scroll setup per spec
    const lenis = new Lenis({
      lerp: 0.055,
      wheelMultiplier: 0.85,
      gestureOrientation: 'vertical',
      smoothWheel: true,
      infinite: false,
      autoRaf: false,
      syncTouch: false,
      syncTouchLerp: 0.075,
      touchMultiplier: 1.5,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // exponential
    })

    lenisRef.current = lenis

    // GSAP ticker sync — update GSAP ScrollTrigger seamlessly on Lenis tick
    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // ScrollTrigger defaults
    ScrollTrigger.defaults({
      scroller: document.body,
    })

    // Unified scroll event
    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update()

      const progress = e.progress ?? 0
      scrollProgressRef.current = progress

      setScrollState({
        scroll: e.scroll ?? 0,
        progress,
        velocity: e.velocity ?? 0,
        direction: e.direction ?? 1,
        isScrolling: Math.abs(e.velocity) > 0.01,
      })

      // Dispatch global events for Canvas and DOM layers
      window.dispatchEvent(
        new CustomEvent('lusion-scroll', {
          detail: {
            progress,
            scroll: e.scroll,
            velocity: e.velocity,
            direction: e.direction,
            isScrolling: Math.abs(e.velocity) > 0.01,
          },
        })
      )

      // Scroll progress map events per spec
      // [0-25%] resting breathing, [25-50%] elongation, [50-75%] explosion, [75-100%] coalesce
      if (progress < 0.25) {
        window.dispatchEvent(new CustomEvent('lusion-phase', { detail: { phase: 1, t: progress / 0.25 } }))
      } else if (progress < 0.5) {
        window.dispatchEvent(new CustomEvent('lusion-phase', { detail: { phase: 2, t: (progress - 0.25) / 0.25 } }))
      } else if (progress < 0.75) {
        window.dispatchEvent(new CustomEvent('lusion-phase', { detail: { phase: 3, t: (progress - 0.5) / 0.25 } }))
      } else {
        window.dispatchEvent(new CustomEvent('lusion-phase', { detail: { phase: 4, t: (progress - 0.75) / 0.25 } }))
      }
    })

    // RAF fallback for Lenis (ensures smooth even if GSAP ticker lags)
    const raf = (time: number) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    // Resize handler
    const onResize = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Cleanup — prevent WebGL memory leaks, cancel RAF, kill ScrollTriggers
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      gsap.ticker.remove(tickerCallback)
      window.removeEventListener('resize', onResize)
      lenis.off('scroll', () => {})
      lenis.destroy()
      lenisRef.current = null
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  // Imperative scrollTo
  const scrollTo = useCallback((target: number | string | HTMLElement, opts?: any) => {
    lenisRef.current?.scrollTo(target, opts)
  }, [])

  return {
    lenis: lenisRef.current,
    scrollState,
    scrollProgress: scrollState.progress,
    getScrollProgress,
    scrollTo,
  }
}
