/**
 * LUSION HOMEPAGE — Completely New Light Theme + Preloader + Blue Ribbon
 * Exact real-world Lusion.co: #f7f7f9, elastic showreel ribbon, blue organic spline
 */

import { useEffect, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

import Navbar from './components/dom/Navbar'
import HeroContent from './components/dom/HeroContent'
import PortfolioGrid from './components/dom/PortfolioGrid'
import Preloader from './components/preloader/Preloader'
import LiquidCursor from './components/ui/LiquidCursor'
import ElasticShowreel from './components/canvas/ElasticShowreel'

import useLenisScroller from './hooks/useLenisScroller'
import usePointerDynamics from './hooks/usePointerDynamics'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHoveringRibbon, setIsHoveringRibbon] = useState(false)
  const { scrollProgress: lenisProgress } = useLenisScroller()
  usePointerDynamics()

  useEffect(() => {
    const onScroll = (e) => {
      if (e.detail && typeof e.detail.progress === 'number') {
        setScrollProgress(e.detail.progress)
      }
    }
    window.addEventListener('lusion-scroll', onScroll)
    return () => window.removeEventListener('lusion-scroll', onScroll)
  }, [])

  useEffect(() => {
    if (lenisProgress > 0) setScrollProgress(lenisProgress)
  }, [lenisProgress])

  return (
    <div className="relative bg-[#f7f7f9] text-[#0b0b0d] selection:bg-[#0b0b0d] selection:text-white overflow-x-hidden">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <LiquidCursor />
      <Navbar />

      <div className="fixed inset-0 z-0 h-[92vh] pointer-events-none">
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          camera={{ fov: 32, position: [0, 0, 7], near: 0.1, far: 100 }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          onCreated={({ gl }) => gl.setClearColor('#f7f7f9', 1)}
        >
          <Suspense fallback={null}>
            <ElasticShowreel scrollProgress={scrollProgress} onHoverChange={setIsHoveringRibbon} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10">
        <HeroContent isHoveringRibbon={isHoveringRibbon} />
        <PortfolioGrid />

        <footer className="bg-[#f7f7f9] border-t border-black/10 px-6 md:px-8 lg:px-10 py-10 flex flex-col md:flex-row justify-between gap-6 text-[11px] font-mono tracking-[0.15em] text-black/30">
          <div className="flex flex-wrap gap-6">
            <span>©2026 LUSION® — LIGHT THEME • ELASTIC SHOWREEL • BLUE ORGANIC RIBBON</span>
            <span className="hidden md:block">•</span>
            <span>LENIS 0.08 • GSAP • R3F • PRELOADER L GLYPH • #f7f7f9</span>
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
    </div>
  )
}
