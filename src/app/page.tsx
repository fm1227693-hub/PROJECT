'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Navbar from '@/components/dom/Navbar'
import HeroSection from '@/components/dom/HeroSection'
import ProjectGrid from '@/components/dom/ProjectGrid'
import LiquidCursor from '@/components/ui/LiquidCursor'

import useLenisScroller from '@/hooks/useLenisScroller'
import usePointerDynamics from '@/hooks/usePointerDynamics'

const HeroRibbon = dynamic(() => import('@/components/canvas/HeroRibbon'), { ssr: false })

gsap.registerPlugin(ScrollTrigger)

export default function Page() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHoveringRibbon, setIsHoveringRibbon] = useState(false)
  const { scrollProgress: lenisProgress } = useLenisScroller()
  usePointerDynamics()

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      if (e.detail && typeof e.detail.progress === 'number') {
        setScrollProgress(e.detail.progress)
      }
    }
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => window.removeEventListener('lusion-scroll' as any, onScroll as any)
  }, [])

  useEffect(() => {
    if (lenisProgress > 0) setScrollProgress(lenisProgress)
  }, [lenisProgress])

  return (
    <main className="relative bg-[#f9f9fb] text-[#0b0b0d] selection:bg-[#0b0b0d] selection:text-white overflow-x-hidden">
      <LiquidCursor />
      <Navbar />
      {/* 3D Ribbon Canvas — fixed behind */}
      <div className="fixed inset-0 z-0 h-[92vh] pointer-events-none">
        <HeroRibbon scrollProgress={scrollProgress} onHoverChange={setIsHoveringRibbon} />
      </div>

      <div className="relative z-10">
        <HeroSection isHoveringRibbon={isHoveringRibbon} />
        <ProjectGrid />

        {/* Footer — light */}
        <footer className="bg-[#f9f9fb] border-t border-black/10 px-6 md:px-8 lg:px-10 py-10 flex flex-col md:flex-row justify-between gap-6 text-[11px] font-mono tracking-[0.15em] text-black/30">
          <div className="flex flex-wrap gap-6">
            <span>©2026 LUSION® — LIGHT THEME • ELASTIC RIBBON • PLANE(16,6,64,32)</span>
            <span className="hidden md:block">•</span>
            <span>LENIS 0.08 • GSAP • R3F • SHOWREEL</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/fm1227693-hub/PROJECT/archive/refs/heads/arena/01a0c8ff-project.zip" className="hover:text-black transition-colors">
              GITHUB ZIP ↓
            </a>
            <a href="https://lusion.co" target="_blank" className="hover:text-black transition-colors">
              LUSION.CO →
            </a>
          </div>
        </footer>
      </div>
    </main>
  )
}
