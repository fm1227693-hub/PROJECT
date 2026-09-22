/**
 * LUSION — ULTRA LIGHTWEIGHT NO LAG
 */

import { useEffect, useState, useRef } from 'react'

import Navbar from './components/dom/Navbar'
import BroughtToLifeSection from './components/dom/BroughtToLifeSection'
import ParallaxProjectGrid from './components/portfolio/ParallaxProjectGrid'
import Preloader from './components/preloader/Preloader'
import BlueRibbon2D from './components/dom/BlueRibbon2D'
import Showreel2D from './components/dom/Showreel2D'
import AstronautPortalExperience from './components/experiential/AstronautPortalExperience'

import useLenisScrubDriver from './hooks/useLenisScrubDriver'
import usePointerDynamics from './hooks/usePointerDynamics'

export default function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isHovering, setIsHovering] = useState(false)
  const lastScroll = useRef(0)

  useLenisScrubDriver({ lerp: 0.08, wheelMultiplier: 0.9, smoothWheel: true, infinite: false })
  usePointerDynamics()

  useEffect(() => {
    let ticking = false
    const onScroll = (e) => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        if (e.detail) {
          setScrollProgress(e.detail.progress ?? 0)
          lastScroll.current = e.detail.scroll ?? lastScroll.current
        }
        ticking = false
      })
    }
    window.addEventListener('lusion-scroll', onScroll)
    return () => window.removeEventListener('lusion-scroll', onScroll)
  }, [])

  const dockProgress = Math.min(Math.max((scrollProgress - 0.12) / 0.5, 0), 1)

  return (
    <div className="relative bg-[#f7f7f9] text-[#0b0b0d] selection:bg-[#0b0b0d] selection:text-white overflow-x-hidden">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <Navbar />
      <BlueRibbon2D scrollProgress={scrollProgress} />
      <Showreel2D scrollProgress={scrollProgress} onHoverChange={setIsHovering} />

      <div className="relative z-10 min-h-[92vh] flex flex-col justify-between px-6 md:px-8 lg:px-10 pt-[88px] pb-8 pointer-events-none">
        <div className="h-[24px]" />
        <div className="flex-1 flex items-center justify-center">
          <div
            className="flex items-center gap-6 md:gap-10 will-change-transform"
            style={{
              opacity: 1 - dockProgress * 1.2,
              transform: `translate3d(0, ${dockProgress * -20}px, 0) scale(${1 - dockProgress * 0.15})`,
            }}
          >
            <span className="text-white font-black tracking-[-0.04em] leading-none text-[13vw] md:text-[9vw] lg:text-[7.5vw] drop-shadow-[0_2px_24px_rgba(0,0,0,0.18)] select-none">PLAY</span>
            <button className={`pointer-events-auto group relative w-[64px] h-[64px] md:w-[84px] md:h-[84px] rounded-full bg-white text-black flex items-center justify-center text-[22px] md:text-[26px] shadow-[0_12px_36px_rgba(0,0,0,0.2)] transition-transform duration-300 cursor-pointer ${isHovering ? 'scale-[1.08]' : 'scale-100'}`}>
              <span className="translate-x-[2px]">▶</span>
            </button>
            <span className="text-white font-black tracking-[-0.04em] leading-none text-[13vw] md:text-[9vw] lg:text-[7.5vw] drop-shadow-[0_2px_24px_rgba(0,0,0,0.18)] select-none">REEL</span>
          </div>
        </div>
        <div className="h-[44px] flex justify-between items-center px-2 md:px-8">
          <div className="flex gap-8 md:gap-12 opacity-20">
            {[0, 1].map((i) => (
              <div key={`l-${i}`} className="w-[14px] h-[14px] relative flex items-center justify-center">
                <span className="absolute w-[14px] h-[1px] bg-black/50" />
                <span className="absolute w-[1px] h-[14px] bg-black/50" />
              </div>
            ))}
          </div>
          <div className="flex gap-8 md:gap-12 opacity-20">
            {[0, 1].map((i) => (
              <div key={`r-${i}`} className="w-[14px] h-[14px] relative flex items-center justify-center">
                <span className="absolute w-[14px] h-[1px] bg-black/50" />
                <span className="absolute w-[1px] h-[14px] bg-black/50" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relative z-10">
        <BroughtToLifeSection dockProgress={dockProgress} />
        <ParallaxProjectGrid />
        <AstronautPortalExperience totalFrames={60} />
        <footer className="relative z-10 bg-[#f7f7f9] border-t border-black/10 px-6 md:px-8 lg:px-10 py-10 flex flex-col md:flex-row justify-between gap-6 text-[11px] font-mono tracking-[0.15em] text-black/30">
          <div>©2026 LUSION® — ULTRA LIGHTWEIGHT • NO LAG • 60FPS</div>
          <div className="flex gap-6">
            <a href="https://github.com/fm1227693-hub/PROJECT/archive/refs/heads/arena/01a0c8ff-project.zip" className="hover:text-black">GITHUB ZIP ↓</a>
            <a href="https://lusion.co" target="_blank" className="hover:text-black">LUSION.CO →</a>
          </div>
        </footer>
      </div>

      <div className="fixed bottom-6 left-6 md:bottom-8 md:left-8 z-[5] pointer-events-none transition-all duration-500" style={{ opacity: dockProgress > 0.55 ? 1 : 0, transform: `translateY(${dockProgress > 0.55 ? 0 : 8}px)` }}>
        <div className="flex items-center gap-3 bg-white/80 backdrop-blur-[12px] border border-black/10 rounded-full pl-3 pr-5 py-2 shadow-[0_8px_24px_rgba(0,0,0,0.08)]">
          <div className="w-2 h-2 rounded-full bg-[#2563eb]" />
          <span className="text-[11px] font-mono tracking-[0.12em] text-black/60">ULTRA LIGHT • 60FPS • NO LAG</span>
        </div>
      </div>
    </div>
  )
}
