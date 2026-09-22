/**
 * LUSION HOMEPAGE — HeroContent
 * Accurate headers, pill buttons, crosshair grid + + + +, editorial typography
 * Floating center button PLAY REEL ▶ magnetically tethered
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroContentProps {
  isHoveringRibbon?: boolean
}

export default function HeroContent({ isHoveringRibbon = false }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLButtonElement>(null)
  const crosshairsRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const button = playButtonRef.current
    if (!button) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = button.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 300

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist
        gsap.to(button, {
          x: dx * force * 0.5,
          y: dy * force * 0.5,
          scale: 1 + force * 0.08,
          duration: 0.6,
          ease: 'power3.out',
        })
      } else {
        gsap.to(button, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1,0.4)' })
      }

      // Crosshair markers underneath canvas per spec
      if (crosshairsRef.current) {
        const markers = crosshairsRef.current.querySelectorAll('.crosshair')
        markers.forEach((marker) => {
          const m = marker as HTMLElement
          const mRect = m.getBoundingClientRect()
          const mx = mRect.left + mRect.width / 2
          const my = mRect.top + mRect.height / 2
          const mdx = e.clientX - mx
          const mdy = e.clientY - my
          const mDist = Math.sqrt(mdx * mdx + mdy * mdy)
          const mMax = 170
          if (mDist < mMax) {
            const mForce = (mMax - mDist) / mMax
            gsap.to(m, {
              x: mdx * mForce * 0.28,
              y: mdy * mForce * 0.28,
              scale: 1 + mForce * 0.55,
              opacity: 0.85,
              duration: 0.5,
              ease: 'power2.out',
            })
          } else {
            gsap.to(m, { x: 0, y: 0, scale: 1, opacity: 0.45, duration: 0.7, ease: 'power2.out' })
          }
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.line')
        gsap.fromTo(
          lines,
          { yPercent: 115, opacity: 0 },
          { yPercent: 0, opacity: 1, duration: 1.2, stagger: 0.13, ease: 'power4.out', delay: 0.9 }
        )
      }
      if (crosshairsRef.current) {
        gsap.fromTo(
          crosshairsRef.current.querySelectorAll('.crosshair'),
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 0.45, duration: 0.8, stagger: 0.08, ease: 'back.out(1.7)', delay: 1.2 }
        )
      }
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=60%',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress
          if (titleRef.current) {
            gsap.to(titleRef.current, { y: p * -50, opacity: 1 - p * 0.6, duration: 0.3, overwrite: 'auto' })
          }
        },
      })
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative z-10 min-h-[92vh] flex flex-col justify-between px-6 md:px-8 lg:px-10 pt-[88px] pb-8 pointer-events-none">
      <div className="hidden md:flex justify-between items-start text-[11px] font-mono tracking-[0.18em] text-black/40 pt-4">
        <div className="flex gap-8">
          <span>EST. 2018</span>
          <span className="hidden lg:block">— ELASTIC SHOWREEL • BLUE SPLINE • SCROLL VELOCITY</span>
        </div>
        <div className="flex gap-6">
          <span>SCROLL TO EXPLORE ↓</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative">
        {/* Floating center button high-contrast pill PLAY REEL ▶ tethered magnetically to center per spec */}
        <button
          ref={playButtonRef}
          className="pointer-events-auto group relative flex items-center gap-3 pl-7 pr-2 py-2 rounded-full bg-[#0b0b0d] text-white text-[13px] font-medium tracking-[0.02em] shadow-[0_12px_32px_rgba(0,0,0,0.18)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition-shadow cursor-pointer will-change-transform"
        >
          <span>PLAY REEL</span>
          <span className="w-[36px] h-[36px] rounded-full bg-white text-black flex items-center justify-center text-[14px] group-hover:scale-110 transition-transform duration-300">
            ▶
          </span>
          <span
            className={`absolute inset-0 rounded-full border border-black/10 transition-all duration-500 ${isHoveringRibbon ? 'scale-[1.15] opacity-100' : 'opacity-0 scale-100'}`}
          />
        </button>

        <div
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 mt-20 text-[10px] font-mono tracking-[0.2em] text-black/30 transition-opacity duration-300 pointer-events-none ${isHoveringRibbon ? 'opacity-100' : 'opacity-0'}`}
        >
          DRAG TO DEFORM • BLUE RIBBON CURLS BEHIND
        </div>
      </div>

      {/* Subtle alignment grid markers + + + + underneath canvas per spec */}
      <div ref={crosshairsRef} className="relative h-[44px] flex justify-between items-center px-2 md:px-8 pointer-events-none">
        <div className="flex gap-6 md:gap-10">
          {[0, 1].map((i) => (
            <div key={`l-${i}`} className="crosshair w-[14px] h-[14px] relative flex items-center justify-center opacity-45 will-change-transform">
              <span className="absolute w-[14px] h-[1px] bg-black/40" />
              <span className="absolute w-[1px] h-[14px] bg-black/40" />
            </div>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] font-mono tracking-[0.18em] text-black/30">
          <span className="w-1 h-1 rounded-full bg-black/40" />
          <span>INTERACTIVE ELASTIC SHOWREEL — BLUE ORGANIC RIBBON BEHIND</span>
          <span className="w-1 h-1 rounded-full bg-black/40" />
        </div>
        <div className="flex gap-6 md:gap-10">
          {[0, 1].map((i) => (
            <div key={`r-${i}`} className="crosshair w-[14px] h-[14px] relative flex items-center justify-center opacity-45 will-change-transform">
              <span className="absolute w-[14px] h-[1px] bg-black/40" />
              <span className="absolute w-[1px] h-[14px] bg-black/40" />
            </div>
          ))}
        </div>
      </div>

      <div ref={titleRef} className="mt-6 md:mt-8 pointer-events-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4">
          <div className="overflow-hidden">
            <div className="line text-[11px] font-mono tracking-[0.2em] text-black/40">001 / INTRODUCTION — SHOWREEL RIBBON</div>
          </div>
          <div className="hidden md:block overflow-hidden">
            <div className="line text-[11px] font-mono tracking-[0.18em] text-black/30 max-w-[340px] text-right">
              Full-width horizontal curved plane organic viewport with blue spline curling behind.
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
