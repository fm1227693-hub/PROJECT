/**
 * CLEAN LUSION — Exact Homepage 1:1 + GLOBAL BLUE RIBBON throughout whole site
 * Light #f6f6f8, elastic showreel ribbon 16:7, blue organic spline #2563eb glossy, PLAY REEL magnetic
 * No debug typography, blue ribbon butun sayt bo'ylab
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
import GlobalBlueRibbon from './components/canvas/GlobalBlueRibbon'

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
    <div className="relative bg-[#f6f6f8] text-[#0b0b0d] selection:bg-[#0b0b0d] selection:text-white overflow-x-hidden">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      <LiquidCursor />
      <Navbar />

      {/* BLUE RIBBON — faqat hero qismida, qolgan joylarda ko'rinmasin */}
      <div className="fixed inset-0 z-0 w-full h-[92vh] pointer-events-none">
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          camera={{ fov: 38, position: [0, 0, 10], near: 0.1, far: 100 }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          onCreated={({ gl }) => gl.setClearColor('#f6f6f8', 0)}
        >
          <ambientLight intensity={0.95} color="#ffffff" />
          <directionalLight position={[5, 8, 6]} intensity={1.1} color="#ffffff" />
          <directionalLight position={[-4, -2, 4]} intensity={0.5} color="#dbeafe" />
          <Suspense fallback={null}>
            <GlobalBlueRibbon scrollProgress={scrollProgress} />
          </Suspense>
        </Canvas>
      </div>

      {/* HERO SHOWREEL — rounded frame 16:7 */}
      <div className="fixed inset-0 z-[1] h-[92vh] pointer-events-none">
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          dpr={[1, 2]}
          camera={{ fov: 32, position: [0, 0, 7], near: 0.1, far: 100 }}
          style={{ background: 'transparent', width: '100%', height: '100%' }}
          onCreated={({ gl }) => gl.setClearColor('#f6f6f8', 0)}
        >
          <Suspense fallback={null}>
            <ElasticShowreel scrollProgress={scrollProgress} onHoverChange={setIsHoveringRibbon} />
          </Suspense>
        </Canvas>
      </div>

      <div className="relative z-10">
        <HeroContent isHoveringRibbon={isHoveringRibbon} />
        <PortfolioGrid />

        <footer className="relative z-10 bg-[#f6f6f8] border-t border-black/10 px-6 md:px-8 lg:px-10 py-10 flex flex-col md:flex-row justify-between gap-6 text-[11px] font-mono tracking-[0.15em] text-black/30">
          <div>©2026 LUSION® — KO'K LENTA FAQAT HERO'DA • #2563eb</div>
          <div className="flex gap-6">
            <a href="https://github.com/fm1227693-hub/PROJECT/archive/refs/heads/arena/01a0c8ff-project.zip" className="hover:text-black">
              GITHUB ZIP ↓
            </a>
            <a href="https://lusion.co" target="_blank" className="hover:text-black">
              LUSION.CO →
            </a>
          </div>
        </footer>
      </div>
    </div>
  )
}
