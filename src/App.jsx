/**
 * LUSION HOMEPAGE — Completely New Light Theme Project
 * Exact real-world Lusion.co: light #f9f9fb, elastic showreel ribbon Plane(16,6,64,32)
 * No dark purple sphere, no technical params printed on screen
 */

import { useEffect, useState } from 'react'
import Navbar from './components/dom/Navbar'
import HeroSection from './components/dom/HeroSection'
import ProjectGrid from './components/dom/ProjectGrid'
import LiquidCursor from './components/ui/LiquidCursor'
import HeroRibbon from './components/canvas/HeroRibbon'
import useLenisScroller from './hooks/useLenisScroller'
import usePointerDynamics from './hooks/usePointerDynamics'

export default function App() {
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
    <div className="relative bg-[#f9f9fb] text-[#0b0b0d] selection:bg-[#0b0b0d] selection:text-white overflow-x-hidden">
      <LiquidCursor />
      <Navbar />

      {/* Fixed 3D Ribbon Canvas */}
      <div className="fixed inset-0 z-0 h-[92vh] pointer-events-none">
        <div className="w-full h-full">
          {/* R3F Canvas inside HeroRibbon */}
          <div className="w-full h-full">
            <HeroRibbonWrapper scrollProgress={scrollProgress} onHoverChange={setIsHoveringRibbon} />
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <HeroSection isHoveringRibbon={isHoveringRibbon} />
        <ProjectGrid />

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
    </div>
  )
}

// Wrapper to mount R3F Canvas properly inside Vite
import { Canvas } from '@react-three/fiber'
import { Suspense } from 'react'

function HeroRibbonWrapper({ scrollProgress, onHoverChange }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      dpr={[1, 2]}
      camera={{ fov: 32, position: [0, 0, 7], near: 0.1, far: 100 }}
      style={{ background: 'transparent', width: '100%', height: '100%' }}
      onCreated={({ gl }) => {
        gl.setClearColor('#f9f9fb', 1)
      }}
    >
      <Suspense fallback={null}>
        <HeroRibbon scrollProgress={scrollProgress} onHoverChange={onHoverChange} />
      </Suspense>
    </Canvas>
  )
}
