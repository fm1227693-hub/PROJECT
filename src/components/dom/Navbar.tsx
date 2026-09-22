/**
 * LUSION HOMEPAGE — Navbar
 * Header: Left bold wordmark LUSION. Right buttons OUR APPROACH, LET'S TALK ●, and MENU =
 * Light theme #f7f7f9 / #0b0b0d
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.2, ease: 'power4.out', delay: 0.8 })
    }, navRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-8 lg:px-10 py-5 md:py-6 bg-[#f7f7f9]/85 backdrop-blur-[14px] border-b border-black/[0.06]"
      >
        {/* Left: bold wordmark LUSION */}
        <div className="flex items-center gap-10">
          <a href="#" className="group flex items-center cursor-pointer">
            <span className="text-[#0b0b0d] font-black tracking-[-0.045em] text-[22px] md:text-[24px] leading-none">LUSION</span>
            <span className="ml-[1px] text-[10px] font-bold text-[#0b0b0d] translate-y-[-6px]">®</span>
          </a>
        </div>

        {/* Right: OUR APPROACH, LET'S TALK ●, MENU = */}
        <div className="flex items-center gap-3 md:gap-3.5">
          <button
            data-magnetic
            className="hidden md:flex items-center px-5 py-[10px] rounded-full border border-black/12 text-[#0b0b0d] text-[13px] font-medium hover:border-black/25 hover:bg-black/[0.03] transition-all cursor-pointer"
          >
            OUR APPROACH
          </button>

          <button
            data-magnetic
            className="group flex items-center gap-2.5 pl-5 pr-[6px] py-[6px] rounded-full bg-[#0b0b0d] text-white text-[13px] font-medium hover:bg-black transition-colors cursor-pointer"
          >
            <span>LET&apos;S TALK</span>
            <span className="w-[28px] h-[28px] rounded-full bg-white text-black flex items-center justify-center text-[12px] group-hover:rotate-45 transition-transform duration-300">
              ●
            </span>
          </button>

          <button
            data-magnetic
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="flex items-center gap-2 px-5 py-[10px] rounded-full border border-black/15 text-[#0b0b0d] text-[13px] font-medium hover:border-black/30 hover:bg-black/[0.03] transition-all cursor-pointer"
          >
            <span>MENU</span>
            <span className="flex flex-col gap-[3px] ml-1">
              <span className={`block w-[14px] h-[1.5px] bg-[#0b0b0d] transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-[2.2px]' : ''}`} />
              <span className={`block w-[14px] h-[1.5px] bg-[#0b0b0d] transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-[2.2px]' : ''}`} />
            </span>
          </button>
        </div>
      </nav>

      {/* Menu */}
      <div
        className={`fixed inset-0 z-[90] bg-[#f7f7f9] transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="h-full flex flex-col justify-center px-6 md:px-10 lg:px-16 pt-20">
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-2">
              {[
                { label: 'WORK', sub: 'Selected cases' },
                { label: 'STUDIO', sub: 'Who we are' },
                { label: 'LAB', sub: 'Experiments' },
                { label: 'CONTACT', sub: 'Start a project' },
              ].map((item) => (
                <a key={item.label} href="#" className="group block">
                  <div className="flex items-baseline gap-4">
                    <span className="text-[13vw] md:text-[8vw] font-black tracking-[-0.05em] leading-[0.85] text-[#0b0b0d] group-hover:text-black/60 transition-colors">
                      {item.label}
                    </span>
                    <span className="text-[11px] font-mono tracking-[0.15em] text-black/40">{item.sub}</span>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex flex-col justify-end gap-8 md:pb-8">
              <p className="text-[14px] leading-[1.6] text-black/60 max-w-[360px]">
                We combine design, motion, 3D, and development to craft bold digital experiences. Elastic showreel ribbon + blue organic spline.
              </p>
              <div className="flex gap-6 text-[11px] tracking-widest font-mono text-black/40">
                <a href="#" className="hover:text-black">
                  INSTAGRAM
                </a>
                <a href="#" className="hover:text-black">
                  TWITTER
                </a>
                <a href="#" className="hover:text-black">
                  LINKEDIN
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
