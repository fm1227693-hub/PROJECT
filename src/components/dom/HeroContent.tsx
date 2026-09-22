/**
 * CLEAN LUSION — HeroContent
 * No PLAY REEL text per user request, only hover animations on showreel
 * Kulrang narsa ustiga hover bo'lsa animatsiyalar
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface HeroContentProps {
  isHoveringRibbon?: boolean
}

export default function HeroContent({ isHoveringRibbon = false }: HeroContentProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const playButtonRef = useRef<HTMLDivElement>(null)

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
          x: dx * force * 0.5,
          y: dy * force * 0.5,
          scale: 1 + force * 0.08,
          duration: 0.6,
          ease: 'power3.out',
        })
      } else {
        gsap.to(el, { x: 0, y: 0, scale: 1, duration: 0.9, ease: 'elastic.out(1,0.4)' })
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMouseMove)
  }, [])

  return (
    <section ref={containerRef} className="relative z-10 min-h-[92vh] flex flex-col justify-between px-6 md:px-8 lg:px-10 pt-[88px] pb-8 pointer-events-none">
      <div className="h-[24px]" />

      {/* Center — showreel plane is in canvas, no PLAY REEL text, only hover play button */}
      <div className="flex-1 flex items-center justify-center relative">
        <div
          ref={playButtonRef}
          className="pointer-events-auto will-change-transform"
          style={{ transform: 'translate3d(0,0,0)' }}
        >
          {/* Play button appears only on hover over showreel */}
          <button
            className={`group relative w-[72px] h-[72px] md:w-[92px] md:h-[92px] rounded-full bg-white text-black flex items-center justify-center text-[24px] md:text-[28px] shadow-[0_16px_40px_rgba(0,0,0,0.22)] transition-all duration-500 cursor-pointer ${
              isHoveringRibbon ? 'opacity-100 scale-100' : 'opacity-0 scale-90 pointer-events-none'
            }`}
          >
            <span className="translate-x-[2px]">▶</span>
            <span className="absolute inset-0 rounded-full border border-white/30 scale-100 group-hover:scale-[1.22] transition-transform duration-700" />
            <span className="absolute inset-0 rounded-full bg-white/10 scale-0 group-hover:scale-100 transition-transform duration-500" />
          </button>
        </div>
      </div>

      {/* No crosshairs, no debug */}
      <div className="h-[44px]" />
    </section>
  )
}
