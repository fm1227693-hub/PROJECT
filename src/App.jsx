/**
 * LUSION LAB — Root App (Vite)
 * Completely new project — no legacy code
 * Binds Canvas, Lenis, DOM layers together per spec page.tsx
 */

import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LusionCanvas from './components/canvas/LusionCanvas'
import Header from './components/dom/Header'
import HeroOverlay from './components/dom/HeroOverlay'
import LiquidCursor from './components/ui/LiquidCursor'

import useLenisScroller from './hooks/useLenisScroller'
import usePointerDynamics from './hooks/usePointerDynamics'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const footerRingRef = useRef(null)
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

  useEffect(() => {
    if (!footerRingRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(
        footerRingRef.current,
        { scale: 0.62, opacity: 0, y: 90 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.3,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: footerRingRef.current,
            start: 'top 86%',
            end: 'top 42%',
            scrub: 0.85,
          },
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div className="relative bg-[#050508] text-white selection:bg-[#7a2bff] overflow-x-hidden">
      <LiquidCursor />
      <Header />
      <LusionCanvas scrollProgress={scrollProgress} />
      <div className="relative z-10">
        <HeroOverlay scrollProgress={scrollProgress} />

        {/* Phase 4 — coalesce */}
        <section className="relative min-h-[110vh] flex flex-col justify-end px-6 md:px-10 lg:px-14 pb-24 overflow-hidden">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row justify-between gap-12 items-end">
              <div>
                <div className="text-[10px] font-mono tracking-[0.22em] text-white/30 mb-6">
                  004 / PHASE 04 — COALESCE • 75%–100% • GLOWING LOOP
                </div>
                <h2 className="text-[13vw] md:text-[9vw] lg:text-[7vw] font-black leading-[0.82] tracking-[-0.06em]">
                  GLOWING
                  <br />
                  RING
                  <br />
                  <span className="text-white/15">ANCHOR</span>
                </h2>
              </div>
              <div className="lg:max-w-[420px] pb-4">
                <p className="text-[15px] leading-[1.6] text-white/60">
                  Elements coalesce back into an ambient, glowing loop anchoring adjacent to the interactive footer. Bloom
                  intensity 1.25, luminance threshold 0.85. Micro film grain 0.04 eliminates banding.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold">↓</div>
                  <div className="text-[11px] font-mono tracking-[0.16em] text-white/40">SCROLL END / FOOTER RING • Icosa 2.4,128</div>
                </div>
              </div>
            </div>

            <div ref={footerRingRef} className="mt-24 md:mt-32 relative flex justify-center">
              <div className="relative w-[300px] h-[300px] md:w-[460px] md:h-[460px]">
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute inset-[12%] rounded-full border border-[#7a2bff]/30 blur-[0.5px]" />
                <div className="absolute inset-[22%] rounded-full border border-[#00f0ff]/20" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7a2bff]/20 via-transparent to-[#00f0ff]/20 blur-[30px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_22px_5px_white]" />
                <div
                  className="absolute inset-0 rounded-full animate-[spin_12s_linear_infinite]"
                  style={{
                    background: `conic-gradient(from 0deg, transparent, #7a2bff, #00f0ff, transparent)`,
                    mask: 'radial-gradient(circle, transparent 68%, black 70%)',
                    WebkitMask: 'radial-gradient(circle, transparent 68%, black 70%)',
                  }}
                />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-[10px] font-mono tracking-[0.32em] text-white/20">LUSION</div>
                <div className="text-[22px] font-black tracking-[-0.03em] text-white mt-1">©2026</div>
              </div>
            </div>
          </div>

          <footer className="mt-32 md:mt-40 border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between gap-6 text-[11px] font-mono tracking-[0.16em] text-white/30">
            <div className="flex flex-wrap gap-6">
              <span>PRINCIPAL CREATIVE TECHNOLOGIST • LEAD WEBGL / WEBGPU ENGINEER</span>
              <span className="hidden md:block">•</span>
              <span>WEBGL2 • GLSL • R3F • GSAP • LENIS • 8000 PARTICLES</span>
            </div>
            <div className="flex gap-6">
              <a href="https://github.com/fm1227693-hub/PROJECT/archive/refs/heads/arena/01a0c8ff-project.zip" className="hover:text-white transition-colors">
                GITHUB ZIP ↓
              </a>
              <a href="https://lusion.co" target="_blank" className="hover:text-white transition-colors">
                LUSION.CO →
              </a>
            </div>
          </footer>
        </section>
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
