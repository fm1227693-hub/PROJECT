/**
 * LUSION — useLenisScrubDriver — Decoupled virtual scroll interpolation
 * Singleton Lenis + GSAP ScrollTrigger, lerp 0.08, lagSmoothing 0, memory clean
 * OPTIMIZED FOR NO LAG: single instance, autoRaf false but single RAF, shared global
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LenisScrubDriverOptions, LenisScrubDriverReturn, ScrollMetrics } from '@/types/hyperspace'

gsap.registerPlugin(ScrollTrigger)

// Singleton guard to prevent double Lenis
let globalLenis: Lenis | null = null
let globalRafId: number | null = null
let globalTickerCb: ((time: number) => void) | null = null
let refCount = 0

export default function useLenisScrubDriver(options: LenisScrubDriverOptions = {}): LenisScrubDriverReturn {
  const lenisRef = useRef<Lenis | null>(null)
  const lastScrollRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(performance.now())
  const velocityRef = useRef<number>(0)

  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [scrollVelocity, setScrollVelocity] = useState<number>(0)
  const [scrollY, setScrollY] = useState<number>(0)

  const {
    lerp = 0.08,
    wheelMultiplier = 0.9,
    smoothWheel = true,
    infinite = false,
    easing = (t: number): number => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  } = options

  useEffect(() => {
    refCount++

    if (globalLenis) {
      lenisRef.current = globalLenis
      return () => {
        refCount--
        if (refCount <= 0) {
          if (globalRafId !== null) {
            cancelAnimationFrame(globalRafId)
            globalRafId = null
          }
          if (globalTickerCb) {
            gsap.ticker.remove(globalTickerCb)
            globalTickerCb = null
          }
          globalLenis?.destroy()
          globalLenis = null
          ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        }
      }
    }

    const lenis = new Lenis({
      lerp,
      wheelMultiplier,
      gestureOrientation: 'vertical',
      smoothWheel,
      infinite,
      autoRaf: false,
      easing,
    })

    globalLenis = lenis
    lenisRef.current = lenis

    const tickerCallback = (time: number): void => {
      lenis.raf(time * 1000)
    }
    globalTickerCb = tickerCallback

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    // Single RAF fallback for non-ticker environments
    const raf = (time: number): void => {
      lenis.raf(time)
      globalRafId = requestAnimationFrame(raf)
    }
    globalRafId = requestAnimationFrame(raf)

    const onScrollHandler = (e: { progress: number; scroll: number; velocity: number; direction: number }): void => {
      ScrollTrigger.update()

      const currentTime = performance.now()
      const deltaTime = Math.max(currentTime - lastTimeRef.current, 1)

      const instantVelocity = (e.scroll - lastScrollRef.current) / deltaTime
      velocityRef.current = gsap.utils.interpolate(velocityRef.current, instantVelocity, 0.18)

      lastScrollRef.current = e.scroll
      lastTimeRef.current = currentTime

      const metrics: ScrollMetrics = {
        scrollY: e.scroll,
        velocity: e.velocity,
        progress: e.progress ?? 0,
        direction: e.direction,
        deltaTime,
      }

      setScrollProgress(e.progress ?? 0)
      setScrollVelocity(e.velocity)
      setScrollY(e.scroll)

      window.dispatchEvent(
        new CustomEvent('lusion-scroll', {
          detail: {
            progress: e.progress ?? 0,
            scroll: e.scroll,
            velocity: e.velocity,
            direction: e.direction,
            instantVelocity: velocityRef.current,
            metrics,
          },
        })
      )
      window.dispatchEvent(new CustomEvent('lenis-scrub', { detail: metrics }))
    }

    lenis.on('scroll', onScrollHandler as never)

    const onResize = (): void => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize, { passive: true })

    return (): void => {
      refCount--
      window.removeEventListener('resize', onResize)
      lenis.off('scroll', onScrollHandler as never)

      // Only destroy when last consumer unmounts
      if (refCount <= 0) {
        if (globalRafId !== null) {
          cancelAnimationFrame(globalRafId)
          globalRafId = null
        }
        if (globalTickerCb) {
          gsap.ticker.remove(globalTickerCb)
          globalTickerCb = null
        }
        lenis.destroy()
        globalLenis = null
        lenisRef.current = null
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
        velocityRef.current = 0
        lastScrollRef.current = 0
      }
    }
  }, [lerp, wheelMultiplier, smoothWheel, infinite, easing])

  const scrollTo = useCallback((target: number | string | HTMLElement, opts?: Record<string, unknown>): void => {
    const targetLenis = lenisRef.current ?? globalLenis
    targetLenis?.scrollTo(target, opts as never)
  }, [])

  return {
    lenis: lenisRef.current ?? globalLenis,
    scrollProgress,
    scrollVelocity,
    scrollY,
    scrollTo,
  }
}
