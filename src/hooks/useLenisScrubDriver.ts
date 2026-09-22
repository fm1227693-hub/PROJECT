/**
 * LUSION — useLenisScrubDriver — Decoupled virtual scroll interpolation
 * Lenis + GSAP ScrollTrigger coupling, lerp 0.08, lagSmoothing 0, memory clean
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { LenisScrubDriverOptions, LenisScrubDriverReturn, ScrollMetrics } from '@/types/hyperspace'

gsap.registerPlugin(ScrollTrigger)

export default function useLenisScrubDriver(options: LenisScrubDriverOptions = {}): LenisScrubDriverReturn {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
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
    const lenis = new Lenis({
      lerp,
      wheelMultiplier,
      gestureOrientation: 'vertical',
      smoothWheel,
      infinite,
      autoRaf: false,
      easing,
    })

    lenisRef.current = lenis

    const tickerCallback = (time: number): void => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', (e: { progress: number; scroll: number; velocity: number; direction: number }) => {
      ScrollTrigger.update()

      const currentTime = performance.now()
      const deltaTime = Math.max(currentTime - lastTimeRef.current, 1)
      const deltaScroll = e.scroll - lastScrollRef.current

      const instantVelocity = deltaScroll / deltaTime
      velocityRef.current = gsap.utils.interpolate(velocityRef.current, instantVelocity, 0.18)

      lastScrollRef.current = e.scroll
      lastTimeRef.current = currentTime

      const progress = e.progress ?? 0
      const metrics: ScrollMetrics = {
        scrollY: e.scroll,
        velocity: e.velocity,
        progress,
        direction: e.direction,
        deltaTime,
      }

      setScrollProgress(progress)
      setScrollVelocity(e.velocity)
      setScrollY(e.scroll)

      window.dispatchEvent(
        new CustomEvent('lusion-scroll', {
          detail: {
            progress,
            scroll: e.scroll,
            velocity: e.velocity,
            direction: e.direction,
            instantVelocity: velocityRef.current,
            metrics,
          },
        })
      )

      window.dispatchEvent(
        new CustomEvent('lenis-scrub', {
          detail: metrics,
        })
      )
    })

    const raf = (time: number): void => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    const onResize = (): void => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize, { passive: true })

    return (): void => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      gsap.ticker.remove(tickerCallback)
      window.removeEventListener('resize', onResize)
      lenis.destroy()
      lenisRef.current = null
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      velocityRef.current = 0
      lastScrollRef.current = 0
    }
  }, [lerp, wheelMultiplier, smoothWheel, infinite, easing])

  const scrollTo = useCallback((target: number | string | HTMLElement, opts?: Record<string, unknown>): void => {
    lenisRef.current?.scrollTo(target, opts as never)
  }, [])

  return {
    lenis: lenisRef.current,
    scrollProgress,
    scrollVelocity,
    scrollY,
    scrollTo,
  }
}
