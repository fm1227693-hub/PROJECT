/**
 * LUSION HOMEPAGE — Lenis Scroll
 * lerp 0.08 synced with GSAP ScrollTrigger to fold/unfold ribbon into curved arc
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useLenisScroller() {
  const lenisRef = useRef<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,
      wheelMultiplier: 0.9,
      gestureOrientation: 'vertical',
      smoothWheel: true,
      infinite: false,
      autoRaf: false,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis

    const tickerCallback = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(tickerCallback)
    gsap.ticker.lagSmoothing(0)

    lenis.on('scroll', (e: any) => {
      ScrollTrigger.update()
      const progress = e.progress ?? 0
      setScrollProgress(progress)
      window.dispatchEvent(
        new CustomEvent('lusion-scroll', {
          detail: { progress, scroll: e.scroll, velocity: e.velocity },
        })
      )
    })

    const raf = (time: number) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    const onResize = () => {
      lenis.resize()
      ScrollTrigger.refresh()
    }
    window.addEventListener('resize', onResize, { passive: true })

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      gsap.ticker.remove(tickerCallback)
      window.removeEventListener('resize', onResize)
      lenis.destroy()
      lenisRef.current = null
      ScrollTrigger.getAll().forEach((t) => t.kill())
    }
  }, [])

  const scrollTo = useCallback((target: number | string | HTMLElement, opts?: any) => {
    lenisRef.current?.scrollTo(target, opts)
  }, [])

  return { lenis: lenisRef.current, scrollProgress, scrollTo }
}
