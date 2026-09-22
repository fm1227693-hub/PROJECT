import { useEffect, useRef, useState } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function useLenisScroll() {
  const lenisRef = useRef(null)
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafRef = useRef(null)

  useEffect(() => {
    // Viscous smooth-scroll setup per spec: lerp 0.055, wheelMultiplier 0.85, infinite false
    const lenis = new Lenis({
      lerp: 0.055,
      wheelMultiplier: 0.85,
      gestureOrientation: 'vertical',
      smoothWheel: true,
      infinite: false,
      autoRaf: false,
    })

    lenisRef.current = lenis

    // Update GSAP ScrollTrigger seamlessly on Lenis scroll tick
    lenis.on('scroll', (e) => {
      ScrollTrigger.update()
      const progress = e.progress
      setScrollProgress(progress)
      // Dispatch custom event for canvas
      window.dispatchEvent(new CustomEvent('lusion-scroll', { detail: { progress, scroll: e.scroll, velocity: e.velocity } }))
    })

    // GSAP ticker sync
    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })
    gsap.ticker.lagSmoothing(0)

    // ScrollTrigger defaults for scrub
    ScrollTrigger.defaults({
      scroller: document.body,
    })

    // RAF loop for Lenis (fallback)
    const raf = (time) => {
      lenis.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }
    rafRef.current = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
      lenis.destroy()
      ScrollTrigger.getAll().forEach(t => t.kill())
    }
  }, [])

  return { lenis: lenisRef.current, scrollProgress }
}
