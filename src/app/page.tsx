'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navigation from '@/components/dom/Navigation'
import HeroTypography from '@/components/dom/HeroTypography'
import ProjectCardShowcase from '@/components/dom/ProjectCardShowcase'
import InteractiveCursor from '@/components/dom/InteractiveCursor'

import useLenisScroll from '@/hooks/useLenisScroll'
import usePointerPhysics from '@/hooks/usePointerPhysics'

// Dynamic import for R3F Canvas (no SSR)
const LusionCanvas = dynamic(() => import('@/components/canvas/LusionCanvas'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const { scrollProgress: lenisProgress } = useLenisScroll()
  usePointerPhysics()

  useEffect(() => {
    const onScroll = (e: CustomEvent) => setScrollProgress(e.detail.progress)
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => window.removeEventListener('lusion-scroll' as any, onScroll as any)
  }, [])

  useEffect(() => {
    if (lenisProgress > 0) setScrollProgress(lenisProgress)
  }, [lenisProgress])

  return (
    <main className="relative bg-[#050508] text-white">
      <InteractiveCursor />
      <Navigation />
      <LusionCanvas scrollProgress={scrollProgress} />
      <div className="relative z-10">
        <HeroTypography scrollProgress={scrollProgress} />
        {/* Phase 2 */}
        <section className="min-h-[110vh] flex items-center px-6 md:px-10 lg:px-14">
          <div className="max-w-[1600px] mx-auto w-full">
            <h2 className="text-[11vw] md:text-[7vw] font-black leading-[0.85] tracking-[-0.05em]">
              ELONGATES & SHEARS<br />ALONG VECTOR
            </h2>
          </div>
        </section>
        <ProjectCardShowcase scrollProgress={scrollProgress} />
        <section className="min-h-[110vh] flex flex-col justify-end px-6 md:px-10 lg:px-14 pb-24">
          <h2 className="text-[13vw] md:text-[9vw] font-black leading-[0.82] tracking-[-0.06em]">GLOWING<br />RING<br /><span className="text-white/15">ANCHOR</span></h2>
        </section>
      </div>
    </main>
  )
}
