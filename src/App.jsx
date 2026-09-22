import { useEffect, useState, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import LusionCanvas from './components/canvas/LusionCanvas'
import Navigation from './components/dom/Navigation'
import HeroTypography from './components/dom/HeroTypography'
import ProjectCardShowcase from './components/dom/ProjectCardShowcase'
import InteractiveCursor from './components/dom/InteractiveCursor'

import useLenisScroll from './hooks/useLenisScroll'
import usePointerPhysics from './hooks/usePointerPhysics'

gsap.registerPlugin(ScrollTrigger)

export default function App() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const mainRef = useRef()
  const footerRingRef = useRef()

  const { scrollProgress: lenisProgress } = useLenisScroll()
  const pointer = usePointerPhysics()

  // Sync scroll progress from Lenis + window event
  useEffect(() => {
    const onScroll = (e) => {
      if (e.detail && typeof e.detail.progress === 'number') {
        setScrollProgress(e.detail.progress)
      }
    }
    window.addEventListener('lusion-scroll', onScroll)
    return () => window.removeEventListener('lusion-scroll', onScroll)
  }, [])

  // Fallback: also use lenisProgress if available
  useEffect(() => {
    if (lenisProgress > 0) setScrollProgress(lenisProgress)
  }, [lenisProgress])

  // ScrollTrigger for overall progress (backup)
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.1,
      onUpdate: (self) => {
        // Only update if lenis not driving
        if (lenisProgress === 0) setScrollProgress(self.progress)
      }
    })
    return () => trigger.kill()
  }, [lenisProgress])

  // Footer ring animation Phase 4
  useEffect(() => {
    if (!footerRingRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo(footerRingRef.current,
        { scale: 0.6, opacity: 0, y: 80 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: 'power4.out',
          scrollTrigger: {
            trigger: footerRingRef.current,
            start: 'top 85%',
            end: 'top 45%',
            scrub: 0.8,
          }
        }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <div ref={mainRef} className="relative bg-[#050508] text-white selection:bg-[#7928ca] selection:text-white overflow-x-hidden">
      <InteractiveCursor />
      <Navigation />
      <LusionCanvas scrollProgress={scrollProgress} />

      {/* Scroll container - 400vh for 4 phases */}
      <div className="relative z-10">
        {/* Phase 1 (0-25%): Organic fluid core breathes in center */}
        <HeroTypography scrollProgress={scrollProgress} />

        {/* Phase 2 (25-50%): Fluid core elongates and shears, morphs into floating glass prism, camera glides 45deg */}
        <section className="relative min-h-[110vh] flex items-center px-6 md:px-10 lg:px-14">
          <div className="max-w-[1600px] mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-20 items-center">
            <div className="order-2 lg:order-1">
              <div className="text-[10px] font-mono tracking-[0.2em] text-white/30 mb-8">001 / PHASE 02 — PRISM MORPH • 25%–50%</div>
              <h2 className="text-[11vw] md:text-[7vw] lg:text-[5.5vw] font-black leading-[0.85] tracking-[-0.05em]">
                ELONGATES<br />
                <span className="text-white/20">&</span> SHEARS<br />
                <span className="bg-gradient-to-r from-[#7928ca] to-[#00f0ff] bg-clip-text text-transparent">ALONG</span><br />
                VECTOR
              </h2>
              <div className="mt-10 grid grid-cols-2 gap-8 max-w-[480px] border-t border-white/10 pt-8">
                <div>
                  <div className="text-[10px] tracking-widest font-mono text-white/30 mb-2">MATERIAL</div>
                  <div className="text-[13px] leading-[1.5] text-white/60">
                    transmission: 0.98<br />
                    ior: 1.52<br />
                    thickness: 2.4<br />
                    chromatic: 0.08
                  </div>
                </div>
                <div>
                  <div className="text-[10px] tracking-widest font-mono text-white/30 mb-2">DEFORMATION</div>
                  <div className="text-[13px] leading-[1.5] text-white/60">
                    Icosahedron(2.2,64)<br />
                    snoise*0.45<br />
                    impulse 0.6<br />
                    shear 45°
                  </div>
                </div>
              </div>
            </div>
            <div className="order-1 lg:order-2 lg:pl-12">
              <div className="relative rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8 md:p-10 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-[#7928ca]/20 via-transparent to-[#00f0ff]/15 pointer-events-none" />
                <div className="relative">
                  <div className="text-[10px] font-mono tracking-[0.2em] text-white/40 mb-6">GLSL / VERTEX DISPLACEMENT</div>
                  <pre className="text-[11px] leading-[1.7] font-mono text-white/70 overflow-x-auto">
{`vec3 newPos = pos + normal * (
  snoise(vec4(pos*1.5,
  uTime*0.8)) * 0.45
);

float dist = length(
  vWorldPos.xy - uMousePos.xy
);
float impulse = smoothstep(
  2.5, 0.0, dist
) * uMouseVel;

newPos += normal * impulse * 0.6;`}
                  </pre>
                  <div className="mt-8 flex gap-3">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-[#7928ca] to-transparent self-center" />
                    <span className="text-[10px] font-mono text-white/30 tracking-widest">LUSION SIGNATURE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Phase 3 (50-75%): Ribbon particles explode outwards */}
        <ProjectCardShowcase scrollProgress={scrollProgress} />

        {/* Phase 4 (75-100%): Mesh condenses into glowing ring that anchors at bottom near footer */}
        <section className="relative min-h-[110vh] flex flex-col justify-end px-6 md:px-10 lg:px-14 pb-24 overflow-hidden">
          <div className="max-w-[1600px] mx-auto w-full">
            <div className="flex flex-col lg:flex-row justify-between gap-12 items-end">
              <div>
                <div className="text-[10px] font-mono tracking-[0.2em] text-white/30 mb-6">004 / PHASE 04 — CONDENSE • 75%–100%</div>
                <h2 className="text-[13vw] md:text-[9vw] lg:text-[7vw] font-black leading-[0.82] tracking-[-0.06em]">
                  GLOWING<br />
                  RING<br />
                  <span className="text-white/15">ANCHOR</span>
                </h2>
              </div>
              <div className="lg:max-w-[420px] pb-4">
                <p className="text-[15px] leading-[1.6] text-white/60">
                  The mesh condenses into a luminous torus, anchoring at the footer. Bloom intensity 1.2, luminance threshold 0.85. Micro film grain 0.04 eliminates 8-bit banding on dark gradients.
                </p>
                <div className="mt-8 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center font-bold">↓</div>
                  <div className="text-[11px] font-mono tracking-[0.15em] text-white/40">SCROLL END / FOOTER RING</div>
                </div>
              </div>
            </div>

            {/* Glowing ring visual */}
            <div ref={footerRingRef} className="mt-24 md:mt-32 relative flex justify-center">
              <div className="relative w-[280px] h-[280px] md:w-[420px] md:h-[420px]">
                <div className="absolute inset-0 rounded-full border border-white/10" />
                <div className="absolute inset-[12%] rounded-full border border-[#7928ca]/30 blur-[0.5px]" />
                <div className="absolute inset-[22%] rounded-full border border-[#00f0ff]/20" />
                <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[#7928ca]/20 via-transparent to-[#00f0ff]/20 blur-[30px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[2px] h-[2px] bg-white rounded-full shadow-[0_0_20px_4px_white]" />
                <div className="absolute inset-0 rounded-full animate-[spin_12s_linear_infinite]" style={{
                  background: `conic-gradient(from 0deg, transparent, #7928ca, #00f0ff, transparent)`,
                  mask: 'radial-gradient(circle, transparent 68%, black 70%)',
                  WebkitMask: 'radial-gradient(circle, transparent 68%, black 70%)',
                }} />
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                <div className="text-[10px] font-mono tracking-[0.3em] text-white/20">LUSION</div>
                <div className="text-[22px] font-black tracking-[-0.03em] text-white mt-1">©2026</div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <footer className="mt-32 md:mt-40 border-t border-white/10 pt-10 flex flex-col md:flex-row justify-between gap-6 text-[11px] font-mono tracking-[0.15em] text-white/30">
            <div className="flex flex-wrap gap-6">
              <span>PRINCIPAL CREATIVE TECHNOLOGIST</span>
              <span className="hidden md:block">•</span>
              <span>WEBGL • GLSL • R3F • GSAP • LENIS</span>
            </div>
            <div className="flex gap-6">
              <a href="#" className="hover:text-white transition-colors">GITHUB ZIP ↓</a>
              <a href="#" className="hover:text-white transition-colors">LUSION.CO →</a>
            </div>
          </footer>
        </section>
      </div>

      {/* Background grain + vignette */}
      <div className="pointer-events-none fixed inset-0 z-[1] opacity-[0.025] mix-blend-soft-light" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
      }} />
    </div>
  )
}
