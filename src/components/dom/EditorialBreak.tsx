/**
 * LUSION — EditorialBreak
 * Full-width typography: Where Creative Ideas Become Immersive Experiences
 * Background spline morphs color royal blue -> turquoise/cyan #06b6d4, undulating
 */

'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface EditorialBreakProps {
  scrollProgress?: number
  className?: string
}

export default function EditorialBreak({ scrollProgress = 0, className = '' }: EditorialBreakProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const splineRef = useRef<SVGSVGElement>(null)
  const pathRef = useRef<SVGPathElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.line')
        gsap.fromTo(
          lines,
          { yPercent: 120, opacity: 0, rotateX: -20 },
          {
            yPercent: 0,
            opacity: 1,
            rotateX: 0,
            duration: 1.4,
            stagger: 0.18,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 78%',
              end: 'top 42%',
              scrub: 0.8,
            },
          }
        )
      }

      // Spline color shift blue -> turquoise on scroll
      if (pathRef.current) {
        gsap.fromTo(
          pathRef.current,
          { stroke: '#2563eb' },
          {
            stroke: '#06b6d4',
            duration: 1,
            ease: 'power2.inOut',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 75%',
              end: 'bottom 25%',
              scrub: 1,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  // Undulating spline animation
  useEffect(() => {
    let raf = 0
    const animate = () => {
      if (splineRef.current && pathRef.current) {
        const time = performance.now() * 0.0004
        const progress = scrollProgress

        // Morph path slightly based on time + scroll for undulating
        const waveX = Math.sin(time + progress * 2) * 12
        const waveY = Math.cos(time * 0.7 + progress) * 8

        // Subtle morph via transform, not path d (perf)
        pathRef.current.style.transform = `translate3d(${waveX}px, ${waveY}px, 0) scale(${1 + Math.sin(time * 0.5) * 0.02})`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  // Color interpolation blue -> turquoise based on scroll
  const blueToTurquoise = () => {
    // #2563eb -> #06b6d4
    const t = Math.min(Math.max((scrollProgress - 0.35) / 0.35, 0), 1)
    const r1 = 37, g1 = 99, b1 = 235
    const r2 = 6, g2 = 182, b2 = 212
    const r = Math.round(r1 + (r2 - r1) * t)
    const g = Math.round(g1 + (g2 - g1) * t)
    const b = Math.round(b1 + (b2 - b1) * t)
    return `rgb(${r},${g},${b})`
  }

  return (
    <section
      ref={sectionRef}
      className={`relative z-10 overflow-hidden bg-transparent py-24 md:py-32 lg:py-40 px-6 md:px-8 lg:px-10 ${className}`}
    >
      {/* Background 3D spline — morphs color blue -> turquoise */}
      <div className="absolute inset-0 pointer-events-none">
        <svg
          ref={splineRef}
          width="100%"
          height="100%"
          viewBox="0 0 1440 800"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full"
          style={{ overflow: 'visible' }}
        >
          <defs>
            <linearGradient id="splineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.9" />
              <stop offset="50%" stopColor={blueToTurquoise()} stopOpacity="0.95" />
              <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.85" />
            </linearGradient>
            <filter id="splineGlow" x="-50%" y="-50%" width="200%" height="200%">
              <feDropShadow dx="0" dy="12" stdDeviation="18" floodColor={blueToTurquoise()} floodOpacity="0.22" />
              <feDropShadow dx="0" dy="4" stdDeviation="8" floodColor="#2563eb" floodOpacity="0.18" />
            </filter>
          </defs>

          <path
            ref={pathRef}
            d="
              M -100,200
              C 200,120  400,280  650,220
                900,160  1100,320  1350,240
                1200,450  900,480  700,550
                450,620  600,750  850,700
            "
            fill="none"
            stroke="url(#splineGrad)"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#splineGlow)"
            opacity="0.9"
            className="will-change-transform"
          />

          <path
            d="
              M -80,260
              C 220,180  420,340  670,280
                920,220  1080,380  1320,300
                1180,500  880,530  680,600
            "
            fill="none"
            stroke={blueToTurquoise()}
            strokeWidth="12"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.38"
          />
        </svg>

        {/* Soft radial glow */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full blur-[80px] pointer-events-none transition-colors duration-700"
          style={{
            background: `radial-gradient(circle, ${blueToTurquoise()}14, transparent 70%)`,
          }}
        />
      </div>

      <div className="relative max-w-[1600px] mx-auto">
        <div ref={titleRef} className="overflow-hidden">
          <h2 className="font-black tracking-[-0.06em] leading-[0.85] text-[#0b0b0d]">
            <div className="line overflow-hidden text-[10vw] md:text-[7.5vw] lg:text-[5.8vw]">Where Creative</div>
            <div className="line overflow-hidden text-[10vw] md:text-[7.5vw] lg:text-[5.8vw] flex items-center gap-4 md:gap-6">
              Ideas
              <span
                className="inline-block w-[12vw] md:w-[8vw] lg:w-[6vw] h-[4px] md:h-[6px] bg-[#0b0b0d] rounded-full"
                style={{
                  transform: `scaleX(${0.5 + scrollProgress * 0.5})`,
                  transformOrigin: 'left',
                }}
              />
            </div>
            <div className="line overflow-hidden text-[10vw] md:text-[7.5vw] lg:text-[5.8vw]">Become</div>
            <div className="line overflow-hidden text-[10vw] md:text-[7.5vw] lg:text-[5.8vw] flex flex-wrap items-baseline gap-4 md:gap-8">
              <span>Immersive</span>
              <span
                className="text-transparent bg-clip-text"
                style={{
                  backgroundImage: `linear-gradient(90deg, #2563eb, ${blueToTurquoise()})`,
                }}
              >
                Experiences
              </span>
            </div>
          </h2>
        </div>

        <div className="mt-12 md:mt-16 flex flex-col md:flex-row gap-8 md:gap-16 items-start">
          <div className="w-[1px] h-[80px] bg-black/10 hidden md:block" />
          <div className="max-w-[520px]">
            <p className="text-[15px] md:text-[17px] leading-[1.7] tracking-[-0.01em] text-black/55">
              Mid-way through the feed, the narrative shifts. The blue cord that guided you through the hero now breathes
              turquoise, morphing its path as it undulates gently behind giant typography — a seamless transition from
              showreel to editorial depth.
            </p>
            <div className="mt-6 flex items-center gap-3 text-[11px] font-mono tracking-[0.14em] text-black/30">
              <span className="w-2 h-2 rounded-full bg-[#06b6d4] animate-pulse" />
              SPLINE MORPH: #2563eb → #06b6d4 • SCROLL {Math.round(scrollProgress * 100)}%
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
