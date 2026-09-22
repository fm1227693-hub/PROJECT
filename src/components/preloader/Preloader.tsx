/**
 * LUSION HOMEPAGE — Cinematic Minimalist Preloader
 * Fullscreen black #000000, bottom-left giant tabular numeric counter 000→100 mono, center progress bar
 * Exit: forms iconic white L glyph before curtains-up wipe reveal to off-white #f7f7f9
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

interface PreloaderProps {
  onComplete?: () => void
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const counterRef = useRef<HTMLDivElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const progressFillRef = useRef<HTMLDivElement>(null)
  const lGlyphRef = useRef<HTMLDivElement>(null)
  const curtainTopRef = useRef<HTMLDivElement>(null)
  const curtainBottomRef = useRef<HTMLDivElement>(null)
  const [count, setCount] = useState(0)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Initial states
      gsap.set(counterRef.current, { y: 80, opacity: 0 })
      gsap.set(progressBarRef.current, { scaleX: 0, opacity: 0 })
      gsap.set(lGlyphRef.current, { scale: 0.3, opacity: 0, rotate: -8 })
      gsap.set(curtainTopRef.current, { yPercent: 0 })
      gsap.set(curtainBottomRef.current, { yPercent: 0 })

      // Entrance
      gsap.to(counterRef.current, { y: 0, opacity: 1, duration: 1, ease: 'power4.out', delay: 0.2 })
      gsap.to(progressBarRef.current, { scaleX: 1, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.3 })

      // Counter ramp 000→100 with mono spacing per spec
      const counterObj = { value: 0 }
      gsap.to(counterObj, {
        value: 100,
        duration: 2.4,
        ease: 'power2.inOut',
        delay: 0.5,
        onUpdate: () => {
          const v = Math.floor(counterObj.value)
          setCount(v)
          // Progress bar fill
          if (progressFillRef.current) {
            progressFillRef.current.style.width = `${v}%`
          }
        },
      })

      // Progress bar smooth fill
      gsap.to(progressFillRef.current, {
        width: '100%',
        duration: 2.4,
        ease: 'power2.inOut',
        delay: 0.5,
      })

      // Exit timeline — forms iconic white L glyph before curtains-up wipe
      const exitTl = gsap.timeline({ delay: 3.0 })

      // Hide counter
      exitTl.to(counterRef.current, { y: -40, opacity: 0, duration: 0.6, ease: 'power3.in' }, 0)

      // Hide progress bar
      exitTl.to(progressBarRef.current, { opacity: 0, y: -10, duration: 0.5, ease: 'power3.in' }, 0.1)

      // Form iconic white L glyph — center
      exitTl.to(
        lGlyphRef.current,
        { scale: 1, opacity: 1, rotate: 0, duration: 0.9, ease: 'power4.out' },
        0.4
      )

      // L glyph hold + morph
      exitTl.to(lGlyphRef.current, { scale: 1.1, duration: 0.4, ease: 'power2.out' }, 1.0)
      exitTl.to(lGlyphRef.current, { scale: 18, opacity: 0, duration: 0.9, ease: 'power4.in' }, 1.4)

      // Curtains-up wipe reveal to pristine off-white #f7f7f9
      exitTl.to(
        curtainTopRef.current,
        { yPercent: -100, duration: 1.1, ease: 'power4.inOut' },
        1.5
      )
      exitTl.to(
        curtainBottomRef.current,
        { yPercent: 100, duration: 1.1, ease: 'power4.inOut' },
        1.5
      )

      // Final fade out container
      exitTl.to(containerRef.current, { opacity: 0, duration: 0.3, ease: 'power2.out', onComplete: () => onComplete?.() }, 2.2)
    }, containerRef)

    return () => ctx.revert()
  }, [onComplete])

  const formattedCount = String(count).padStart(3, '0')

  return (
    <div ref={containerRef} className="fixed inset-0 z-[99999] bg-black overflow-hidden">
      {/* Curtains for wipe reveal */}
      <div ref={curtainTopRef} className="absolute top-0 left-0 right-0 h-1/2 bg-black z-10 will-change-transform" />
      <div ref={curtainBottomRef} className="absolute bottom-0 left-0 right-0 h-1/2 bg-black z-10 will-change-transform" />

      {/* Center progress bar */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] md:w-[360px] z-20">
        <div ref={progressBarRef} className="relative h-[1px] bg-white/15 w-full origin-left">
          <div ref={progressFillRef} className="absolute top-0 left-0 h-full bg-white w-0 will-change-[width]" />
        </div>
        <div className="mt-4 flex justify-between text-[10px] font-mono tracking-[0.2em] text-white/30">
          <span>LOADING SHOWREEL</span>
          <span>{formattedCount}%</span>
        </div>
      </div>

      {/* Iconic white L glyph — center */}
      <div ref={lGlyphRef} className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 will-change-transform opacity-0">
        <div className="text-white font-black tracking-[-0.06em] leading-none text-[22vw] md:text-[16vw]">L</div>
      </div>

      {/* Bottom-left giant tabular numeric counter 000→100 mono spacing per spec */}
      <div ref={counterRef} className="absolute bottom-6 md:bottom-10 left-6 md:left-10 z-20 will-change-transform">
        <div className="flex items-baseline gap-4">
          <div className="text-white font-mono font-bold tabular-nums tracking-[-0.06em] leading-none text-[22vw] md:text-[16vw] lg:text-[12vw]">
            {formattedCount}
          </div>
          <div className="hidden md:block text-white/30 font-mono text-[11px] tracking-[0.2em] leading-[1.4] max-w-[160px] -translate-y-6">
            LUSION®
            <br />
            EST. 2018
            <br />
            PARIS — TOKYO
          </div>
        </div>
      </div>

      {/* Top-right minimal */}
      <div className="absolute top-6 md:top-10 right-6 md:right-10 z-20 text-[10px] font-mono tracking-[0.2em] text-white/20">©2026</div>

      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-soft-light z-10"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
