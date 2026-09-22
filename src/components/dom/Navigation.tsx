import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Navigation() {
  const navRef = useRef()
  const [isMuted, setIsMuted] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, 
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.4, ease: 'power4.out', delay: 0.3 }
      )
    })
    return () => ctx.revert()
  }, [])

  return (
    <>
      <nav ref={navRef} className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 lg:px-14 py-6 md:py-8 mix-blend-difference">
        {/* Minimal brandmark */}
        <div className="flex items-center gap-8">
          <div className="group cursor-pointer">
            <h1 className="text-white font-black tracking-[-0.04em] text-[22px] md:text-[26px] leading-none">
              LUSION
              <span className="inline-block w-[6px] h-[6px] bg-white rounded-full ml-[3px] mb-[3px] group-hover:scale-[1.8] transition-transform duration-500" />
            </h1>
            <div className="h-[1px] w-0 bg-white group-hover:w-full transition-all duration-700 ease-[cubic-bezier(0.76,0,0.24,1)] mt-1" />
          </div>
          <div className="hidden md:flex items-center gap-2 text-[10px] tracking-[0.2em] text-white/60 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            EST. 2018 / PARIS — TOKYO
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-6 md:gap-10">
          {/* Sound wave toggle */}
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="group flex items-center gap-3 cursor-pointer"
            aria-label="Toggle sound"
          >
            <div className="hidden md:block text-[10px] tracking-[0.15em] text-white/50 font-mono group-hover:text-white/80 transition-colors">
              {isMuted ? 'SOUND OFF' : 'SOUND ON'}
            </div>
            <div className="flex items-center gap-[2px] h-[16px]">
              {[0.3, 0.8, 0.5, 1, 0.6].map((h, i) => (
                <span
                  key={i}
                  className="w-[2px] bg-white/80 group-hover:bg-white transition-colors"
                  style={{
                    height: `${isMuted ? 2 : h * 16}px`,
                    transition: 'height 0.3s ease',
                    animation: isMuted ? 'none' : `soundWave 0.6s ease-in-out infinite ${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </button>

          {/* Minimal menu */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="relative w-[44px] h-[44px] rounded-full border border-white/20 flex items-center justify-center group hover:border-white/40 transition-colors cursor-pointer"
          >
            <div className="w-[18px] flex flex-col gap-[4px]">
              <span className={`block h-[1.5px] bg-white transition-all duration-500 ${isMenuOpen ? 'rotate-45 translate-y-[2.75px]' : ''}`} />
              <span className={`block h-[1.5px] bg-white transition-all duration-500 ${isMenuOpen ? '-rotate-45 -translate-y-[2.75px]' : ''}`} />
            </div>
            <div className="absolute inset-0 rounded-full border border-white/0 group-hover:border-white/20 scale-90 group-hover:scale-100 transition-all duration-500" />
          </button>
        </div>
      </nav>

      {/* Fullscreen menu overlay */}
      <div className={`fixed inset-0 z-[90] bg-[#050508] transition-all duration-[900ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="h-full flex flex-col justify-center px-6 md:px-14 lg:px-24">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-4">
              {['WORK', 'STUDIO', 'LAB', 'CONTACT'].map((item, i) => (
                <div key={item} className="overflow-hidden">
                  <a
                    href="#"
                    className="block text-[12vw] md:text-[8vw] font-black tracking-[-0.05em] leading-[0.85] text-white hover:text-white/60 transition-colors duration-300"
                    style={{ transitionDelay: `${i * 60}ms` }}
                  >
                    {item}
                  </a>
                </div>
              ))}
            </div>
            <div className="flex flex-col justify-end gap-8 md:pb-8">
              <div className="text-white/40 font-mono text-[11px] tracking-[0.15em] leading-relaxed max-w-[320px]">
                WE CRAFT SENSORY DIGITAL EXPERIENCES THAT BLUR THE LINE BETWEEN PHYSICAL AND VIRTUAL. ORGANIC FLUID PHYSICS, REFRACTIVE DISPERSION GLASS, AND MAGNETIC INTERACTIONS.
              </div>
              <div className="flex gap-6 text-white/60 text-[11px] tracking-widest font-mono">
                <a href="#" className="hover:text-white transition-colors">INSTAGRAM</a>
                <a href="#" className="hover:text-white transition-colors">TWITTER</a>
                <a href="#" className="hover:text-white transition-colors">ARE.NA</a>
              </div>
            </div>
          </div>
        </div>
        <div className="absolute bottom-8 left-6 md:left-14 right-6 md:right-14 flex justify-between text-[10px] font-mono tracking-[0.15em] text-white/30">
          <span>©2026 LUSION® ALL RIGHTS RESERVED</span>
          <span className="hidden md:block">SCROLL PHYSICS: LENIS 0.055 • GSAP • WEBGL2</span>
        </div>
      </div>

      <style>{`
        @keyframes soundWave {
          0%, 100% { transform: scaleY(0.5); }
          50% { transform: scaleY(1); }
        }
      `}</style>
    </>
  )
}
