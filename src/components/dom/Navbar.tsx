/**
 * CLEAN LUSION — Navbar
 * Left: Simple bold LUSION logo
 * Right: Two clean pill buttons OUR APPROACH and dark pill LET'S TALK • followed by MENU =
 * No noisy text in header area
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function Navbar() {
  const navRef = useRef<HTMLElement>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(navRef.current, { y: -80, opacity: 0 }, { y: 0, opacity: 1, duration: 1.1, ease: 'power4.out', delay: 0.9 })
    }, navRef)
    return () => ctx.revert()
  }, [])

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-8 lg:px-10 py-5 md:py-6 bg-[#f6f6f8]/85 backdrop-blur-[14px] border-b border-black/[0.06]"
      >
        {/* Left: Simple bold LUSION logo per spec */}
        <a href="#" className="flex items-center cursor-pointer">
          <span className="text-[#0b0b0d] font-black tracking-[-0.045em] text-[22px] md:text-[24px] leading-none">LUSION</span>
        </a>

        {/* Right: Two clean pill buttons OUR APPROACH and dark pill LET'S TALK • followed by MENU = per spec */}
        <div className="flex items-center gap-3 md:gap-3.5">
          <button className="hidden md:flex items-center px-5 py-[10px] rounded-full border border-black/12 text-[#0b0b0d] text-[13px] font-medium hover:border-black/25 hover:bg-black/[0.03] transition-all cursor-pointer">
            OUR APPROACH
          </button>

          <button className="group flex items-center gap-2.5 pl-5 pr-[6px] py-[6px] rounded-full bg-[#0b0b0d] text-white text-[13px] font-medium hover:bg-black transition-colors cursor-pointer">
            <span>LET&apos;S TALK</span>
            <span className="w-[28px] h-[28px] rounded-full bg-white text-black flex items-center justify-center text-[12px] group-hover:rotate-45 transition-transform duration-300">
              •
            </span>
          </button>

          <button
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

      {/* Menu overlay — clean */}
      <div
        className={`fixed inset-0 z-[90] bg-[#f6f6f8] transition-transform duration-[850ms] ease-[cubic-bezier(0.76,0,0.24,1)] ${isMenuOpen ? 'translate-y-0' : '-translate-y-full'}`}
      >
        <div className="h-full flex flex-col justify-center px-6 md:px-10 lg:px-16 pt-20">
          <div className="space-y-2">
            {['WORK', 'STUDIO', 'LAB', 'CONTACT'].map((label) => (
              <a key={label} href="#" className="block group">
                <span className="text-[13vw] md:text-[8vw] font-black tracking-[-0.05em] leading-[0.85] text-[#0b0b0d] group-hover:text-black/50 transition-colors">
                  {label}
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
