/**
 * LUSION — BroughtToLifeSection
 * Left: Giant bold display heading Brought to Life
 * Right: Clean paragraph + magnetic pill ● OUR APPROACH
 * Lower-left: docked reactive 3D showreel continues looping (handled by LusionScene)
 * Light-mode #f7f7f9 / #f6f6f8, #000000 text
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface BroughtToLifeSectionProps {
  dockProgress?: number
}

export default function BroughtToLifeSection({ dockProgress = 0 }: BroughtToLifeSectionProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const descRef = useRef<HTMLDivElement>(null)
  const pillRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.line')
        gsap.fromTo(
          lines,
          { yPercent: 115, opacity: 0, rotateX: -15 },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.3,
            stagger: 0.16,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 82%',
              end: 'top 52%',
              scrub: 0.7,
            },
          }
        )
      }

      if (descRef.current) {
        gsap.fromTo(
          descRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: descRef.current,
              start: 'top 85%',
              end: 'top 62%',
              scrub: 0.6,
            },
          }
        )
      }

      if (pillRef.current) {
        gsap.fromTo(
          pillRef.current,
          { y: 20, opacity: 0, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: 'back.out(1.4)',
            scrollTrigger: {
              trigger: pillRef.current,
              start: 'top 88%',
              end: 'top 72%',
              scrub: 0.5,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    const pill = pillRef.current
    if (!pill) return

    const onMove = (e: MouseEvent) => {
      const rect = pill.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = e.clientX - cx
      const dy = e.clientY - cy
      const dist = Math.sqrt(dx * dx + dy * dy)
      const max = 180
      if (dist < max) {
        const force = (max - dist) / max
        gsap.to(pill, {
          x: dx * force * 0.32,
          y: dy * force * 0.32,
          scale: 1 + force * 0.04,
          duration: 0.6,
          ease: 'power3.out',
        })
      } else {
        gsap.to(pill, { x: 0, y: 0, scale: 1, duration: 0.8, ease: 'elastic.out(1,0.4)' })
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <section
      ref={sectionRef}
      className="relative z-10 bg-[#f6f6f8] px-6 md:px-8 lg:px-10 py-20 md:py-28 lg:py-32 min-h-[92vh] flex flex-col justify-center"
    >
      <div className="max-w-[1600px] mx-auto w-full">
        {/* Top grid: Left heading, Right paragraph + pill */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-16 lg:gap-20 items-end mb-20 md:mb-28">
          {/* Left: Giant bold display heading */}
          <div ref={titleRef} className="overflow-hidden">
            <h2 className="font-black tracking-[-0.06em] leading-[0.82] text-[#0b0b0d] text-[12vw] md:text-[8.5vw] lg:text-[6.8vw]">
              <div className="line overflow-hidden">Bold Ideas,</div>
              <div className="line overflow-hidden">Brought to Life</div>
            </h2>
            {/* Subtle docked showreel hint - space for lower-left card */}
            <div className="mt-10 md:mt-16 hidden lg:block">
              <div
                className="relative w-[320px] h-[140px] rounded-[18px] border border-black/[0.06] bg-white/60 backdrop-blur-[12px] overflow-hidden transition-all duration-700"
                style={{
                  opacity: dockProgress > 0.15 ? 0 : 0.4,
                  transform: `scale(${0.9 + dockProgress * 0.1}) translateY(${dockProgress * -10}px)`,
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-[#eef2ff] to-[#dbeafe] opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-[11px] font-mono tracking-[0.18em] text-black/25">SHOWREEL DOCKED ↓</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right: paragraph + pill */}
          <div ref={descRef} className="lg:pb-2 flex flex-col gap-8">
            <p className="text-[16px] md:text-[18px] leading-[1.65] tracking-[-0.015em] text-black/60 max-w-[440px]">
              We combine design, motion, 3D, and development to create digital experiences that go beyond the screen. Our team
              crafts bold ideas into interactive realities — from high-energy showreels to liquid glass interfaces and winding
              blue ribbons that react to every scroll.
            </p>

            <div className="flex items-center gap-4">
              <button
                ref={pillRef}
                className="group inline-flex items-center gap-3 pl-6 pr-[7px] py-[7px] rounded-full border border-black/10 bg-white text-[13.5px] font-medium tracking-[-0.01em] text-[#0b0b0d] hover:border-black/20 hover:bg-[#0b0b0d] hover:text-white transition-all duration-300 cursor-pointer will-change-transform"
              >
                <span className="w-[8px] h-[8px] rounded-full bg-[#0b0b0d] group-hover:bg-white transition-colors duration-300 animate-pulse" />
                OUR APPROACH
                <span className="w-8 h-8 rounded-full bg-[#0b0b0d] text-white group-hover:bg-white group-hover:text-black flex items-center justify-center text-[12px] transition-all duration-300">
                  →
                </span>
              </button>
            </div>

            {/* Stats / details */}
            <div className="grid grid-cols-2 gap-6 pt-6 border-t border-black/10 max-w-[440px]">
              <div>
                <div className="text-[11px] font-mono tracking-[0.15em] text-black/30 mb-2">CAPABILITIES</div>
                <div className="text-[13px] leading-[1.5] text-black/60">
                  Design / Motion / 3D / Dev / Liquid Glass / TubeGeometry
                </div>
              </div>
              <div>
                <div className="text-[11px] font-mono tracking-[0.15em] text-black/30 mb-2">SCROLL PHYSICS</div>
                <div className="text-[13px] leading-[1.5] text-black/60">Lenis + GSAP + lerp + spring • velocity → scale/position</div>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile: docked card hint */}
        <div className="lg:hidden">
          <div className="w-full h-[1px] bg-black/10 mb-8" />
          <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.15em] text-black/30">
            <span className="w-2 h-2 rounded-full bg-[#2563eb] animate-pulse" />
            SHOWREEL DOCKED TO LOWER-LEFT • SCROLL TO EXPLORE
          </div>
        </div>
      </div>
    </section>
  )
}
