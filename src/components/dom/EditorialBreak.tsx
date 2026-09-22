/**
 * LUSION — EditorialBreak — Clean version, no messy blue spline over text
 * Where Creative Ideas Become Immersive Experiences — clean typography, subtle background
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

export default function EditorialBreak({ className = '' }: EditorialBreakProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.line')
        gsap.fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 80%',
              end: 'top 45%',
              scrub: 0.7,
            },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative z-10 overflow-hidden bg-[#f7f7f9] py-20 md:py-28 px-6 md:px-8 lg:px-10 ${className}`}
    >
      <div className="max-w-[1600px] mx-auto">
        <div ref={titleRef}>
          <h2 className="font-black tracking-[-0.055em] leading-[0.85] text-[#0b0b0d] text-[9vw] md:text-[6.5vw] lg:text-[4.8vw]">
            <div className="line overflow-hidden">Where Creative</div>
            <div className="line overflow-hidden">Ideas Become</div>
            <div className="line overflow-hidden">
              Immersive <span className="text-[#2563eb]">Experiences</span>
            </div>
          </h2>
        </div>
        <div className="mt-8 max-w-[480px]">
          <p className="text-[15px] leading-[1.6] text-black/50">
            Mid-way through the feed, the narrative shifts — a seamless transition from showreel to editorial depth.
          </p>
        </div>
      </div>
    </section>
  )
}
