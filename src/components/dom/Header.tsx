/**
 * LUSION DOM — Header
 * Minimal brandmark, dynamic sound visualizer toggle, magnetic elements, menu
 * Production-grade with GSAP and magnetic spring physics
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Header() {
  const headerRef = useRef<HTMLElement>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const soundBarsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { y: -120, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.6, ease: 'power4.out', delay: 0.2 }
      )

      // Magnetic elements
      const magnetics = document.querySelectorAll('[data-magnetic]')
      magnetics.forEach((el) => {
        const m = el as HTMLElement
        const onMove = (e: MouseEvent) => {
          const rect = m.getBoundingClientRect()
          const cx = rect.left + rect.width / 2
          const cy = rect.top + rect.height / 2
          const dx = e.clientX - cx
          const dy = e.clientY - cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const max = 140
          if (dist < max) {
            const force = (max - dist) / max
            gsap.to(m, {
              x: dx * force * 0.38,
              y: dy * force * 0.38,
              duration: 0.7,
              ease: 'power3.out',
            })
          } else {
            gsap.to(m, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.4)' })
          }
        }
        window.addEventListener('mousemove', onMove)
        return () => window.removeEventListener('mousemove', onMove)
      })
    }, headerRef)

    return () => ctx.revert()
  }, [])

  // Sound visualizer animation
  useEffect(() => {
    if (!soundBarsRef.current) return
    const bars = soundBarsRef.current.children
    let raf: number
    const animate = () => {
      if (isMuted) {
        for (let i = 0; i < bars.length; i++) {
          ;(bars[i] as HTMLElement).style.height = '2px'
        }
      } else {
        for (let i = 0; i < bars.length; i++) {
          const h = 3 + Math.sin(Date.now() * 0.005 + i * 0.9) * 6 + Math.random() * 4
          ;(bars[i] as HTMLElement).style.height = `${h}px`
        }
      }
      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [isMuted])

  return (
    <>
      <header
        ref={headerRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 lg:px-14 py-6 md:py-8 mix-blend-difference"
      >
        {/* Brandmark */}
        <div className="flex items-center gap-10">
          <div data-magnetic className="group cursor-pointer">
            <h1 className="text-white font-black tracking-[-0.05em] text-[22px] md:text-[26px] leading-none flex items-center">
              LUSION
              <span className="inline-block w-[7px] h-[7px] bg-white rounded-full ml-[4px] mb-[3px] group-hover:scale-[1.9] transition-transform duration-500" />
            </h1>
            <div className="h-[1px] w-0 bg-white group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] mt-1" />
          </div>
          <div className="hidden lg:flex items-center gap-3 text-[10px] tracking-[0.22em] text-white/55 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            EST. 2018 / PARIS — TOKYO / WEBGL LAB
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-7 md:gap-10">
          {/* Sound visualizer toggle */}
          <button
            data-magnetic
            onClick={() => setIsMuted(!isMuted)}
            className="group flex items-center gap-3 cursor-pointer"
            aria-label="Toggle sound"
          >
            <div className="hidden md:block text-[10px] tracking-[0.16em] text-white/50 font-mono group-hover:text-white/85 transition-colors">
              {isMuted ? 'SOUND OFF' : 'SOUND ON'}
            </div>
            <div ref={soundBarsRef} className="flex items-end gap-[2.5px] h-[18px]">
              {[0.3, 0.9, 0.5, 1, 0.65, 0.4].map((_, i) => (
                <span
                  key={i}
                  className="w-[2px] bg-white/85 group-hover:bg-white transition-colors rounded-full"
                  style={{ height: '8px', transition: 'height 0.12s ease' }}
                />
              ))}
            </div>
          </button>

          {/* Menu */}
          <button
            data-magnetic
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative w-[46px] h-[46px] rounded-full border border-white/20 flex items-center justify-center group hover:border-white/40 transition-colors cursor-pointer"
          >
            <div className="w-[19px] flex flex-col gap-[4.5px]">
              <span
                className={`block h-[1.6px] bg-white transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-[3px]' : ''}`}
              />
              <span
                className={`block h-[1.6px] bg-white transition-all duration-500 ${isMenuOpen ? '-rotate-45 -translate-y-[3px]' : ''}`}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Fullscreen menu */}
      <div
        className={`fixed inset-0 z-[90] bg-[#050508] transition-transform duration-[950ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="h-full flex flex-col justify-center px-6 md:px-14 lg:px-24">
          <div className="grid md:grid-cols-2 gap-14">
            <div className="space-y-3">
              {['WORK', 'STUDIO', 'LAB', 'CONTACT'].map((item, i) => (
                <div key={item} className="overflow-hidden">
                  <a
                    href="#"
                    className="block text-[13vw] md:text-[8.5vw] font-black tracking-[-0.055em] leading-[0.84] text-white hover:text-white/55 transition-colors duration-300"
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    {item}
                  </a>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-end gap-9 md:pb-10">
              <div className="text-white/40 font-mono text-[11px] tracking-[0.16em] leading-relaxed max-w-[360px]">
                WE CRAFT SENSORY DIGITAL EXPERIENCES THAT BLUR THE LINE BETWEEN PHYSICAL AND VIRTUAL. ORGANIC FLUID PHYSICS, DISPERSION GLASS, CURL-NOISE RIBBONS, MAGNETIC INTERACTIONS. BUILT WITH WEBGL2, GLSL, R3F, GSAP, LENIS.
              </div>
              <div className="flex gap-7 text-white/60 text-[11px] tracking-widest font-mono">
                <a href="#" className="hover:text-white transition-colors">
                  INSTAGRAM
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  TWITTER
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  ARE.NA
                </a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-6 md:left-14 right-6 md:right-14 flex justify-between text-[10px] font-mono tracking-[0.16em] text-white/30">
          <span>©2026 LUSION® ALL RIGHTS RESERVED — PRINCIPAL CREATIVE TECHNOLOGIST</span>
          <span className="hidden md:block">LENIS 0.055 • GSAP • WEBGL2 • 8000 PARTICLES • Icosa(2.4,128)</span>
        </div>
      </div>
    </>
  )
}
