/**
 * CLEAN LUSION — HeroContent
 * Rounded horizontal showcase frame 16:7, high-energy looping videos / 3D renders
 * Over center: Large clean bold white typography PLAY left, REEL right, magnetic white circular play icon ▶ middle
 * Elastic inertia: scroll/drag warps organically cloth/mesh wave physics
 * No debug labels, clean #f6f6f8
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroContentProps {
  isHoveringRibbon?: boolean
}

export default function HeroContent({ isHoveringRibbon = false }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLDivElement>(null)
  const crosshairsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = playButtonRef.current
    if (!el) return

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const dx = e.clientX - centerX
      const dy = e.clientY - centerY
      const dist = Math.sqrt(dx * dx + dy * dy)
      const maxDist = 320

      if (dist < maxDist) {
        const force = (maxDist - dist) / maxDist
        gsap.to(el, {
          x: dx * force * 0.48,
          y: dy * force * 0.48,
          scale: 1 + force * 0.06,
          duration: 0.6,
          ease: 'power3.out',
        })
      } else {
        gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1,0.4)' })
      }

      // Crosshair markers underneath canvas
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
          const mMax = 160
          if (mDist < mMax) {
            const mForce = (mMax - mDist) / mMax
            gsap.to(m, {
              x: mdx * mForce * 0.26,
              y: mdy * mForce * 0.26,
              scale: 1 + mForce * 0.5,
              opacity: 0.8,
              duration: 0.5,
              ease: 'power2.out',
            })
          } else {
            gsap.to(m, { x: 0, y: 0, scale: 1, opacity: 0.4, duration: 0.7, ease: 'power2.out' })
          }
        })
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (crosshairsRef.current) {
        gsap.fromTo(
          crosshairsRef.current.querySelectorAll('.crosshair'),
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 0.4, duration: 0.8, stagger: 0.08, ease: 'back.out(1.7)', delay: 1.2 }
        )
      }
    }, containerRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={containerRef} className="relative z-10 min-h-[92vh] flex flex-col justify-between px-6 md:px-8 lg:px-10 pt-[88px] pb-8 pointer-events-none">
      {/* Top spacer — no noisy text */}
      <div className="h-[24px]" />

      {/* Center — rounded horizontal showcase frame 16:7 embedded in clean white page */}
      {/* The actual 3D mesh is in ElasticShowreel canvas behind, this is overlay PLAY REEL */}
      <div className="flex-1 flex items-center justify-center relative">
        {/* Large clean bold white typography PLAY left, REEL right, magnetic white circular play icon ▶ middle per spec */}
        <div
          ref={playButtonRef}
          className="pointer-events-auto flex items-center gap-6 md:gap-10 will-change-transform"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {/* PLAY */}
          <span className="text-white font-black tracking-[-0.04em] leading-none text-[13vw] md:text-[9vw] lg:text-[7.5vw] drop-shadow-[0_2px_20px_rgba(0,0,0,0.15)] select-none">PLAY</span>

          {/* Magnetic white circular play icon ▶ resting precisely in middle */}
          <button
            className={`group relative w-[64px] h-[64px] md:w-[84px] md:h-[84px] rounded-full bg-white text-black flex items-center justify-center text-[22px] md:text-[26px] shadow-[0_12px_32px_rgba(0,0,0,0.18)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.24)] transition-all duration-300 cursor-pointer ${isHoveringRibbon ? 'scale-[1.08]' : 'scale-100'}`}
          >
            <span className="translate-x-[2px]">▶</span>
            <span className="absolute inset-0 rounded-full border border-white/20 scale-100 group-hover:scale-[1.18] transition-transform duration-500" />
          </button>

          {/* REEL */}
          <span className="text-white font-black tracking-[-0.04em] leading-none text-[13vw] md:text-[9vw] lg:text-[7.5vw] drop-shadow-[0_2px_20px_rgba(0,0,0,0.15)] select-none">REEL</span>
        </div>
      </div>

      {/* Subtle alignment grid markers + + + + underneath canvas per spec — no debug text */}
      <div ref={crosshairsRef} className="relative h-[44px] flex justify-between items-center px-2 md:px-8 pointer-events-none">
        <div className="flex gap-8 md:gap-12">
          {[0, 1].map((i) => (
            <div key={`l-${i}`} className="crosshair w-[14px] h-[14px] relative flex items-center justify-center opacity-40 will-change-transform">
              <span className="absolute w-[14px] h-[1px] bg-black/40" />
              <span className="absolute w-[1px] h-[14px] bg-black/40" />
            </div>
          ))}
        </div>
        <div className="flex gap-8 md:gap-12">
          {[0, 1].map((i) => (
            <div key={`r-${i}`} className="crosshair w-[14px] h-[14px] relative flex items-center justify-center opacity-40 will-change-transform">
              <span className="absolute w-[14px] h-[1px] bg-black/40" />
              <span className="absolute w-[1px] h-[14px] bg-black/40" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
