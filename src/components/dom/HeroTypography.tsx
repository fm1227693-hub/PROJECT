import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

export default function HeroTypography({ scrollProgress = 0 }) {
  const containerRef = useRef()
  const titleRef = useRef()
  const subtitleRef = useRef()
  const taglineRef = useRef()
  const scrollIndicatorRef = useRef()

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Mask-reveal GSAP scrub per spec: "WE CRAFT SENSORY DIGITAL EXPERIENCES" reveals via character mask stagger
      const title = titleRef.current
      if (!title) return

      // Split into lines and chars for stagger
      const lines = title.querySelectorAll('.line')
      lines.forEach((line, lineIndex) => {
        const chars = line.querySelectorAll('.char')
        gsap.fromTo(chars,
          { yPercent: 110, rotateX: -15, opacity: 0 },
          {
            yPercent: 0,
            rotateX: 0,
            opacity: 1,
            duration: 1.4,
            ease: 'power4.out',
            stagger: { each: 0.025, from: 'start' },
            delay: 0.6 + lineIndex * 0.15,
          }
        )
      })

      // Subtitle reveal
      gsap.fromTo(subtitleRef.current,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: 'power3.out', delay: 1.4 }
      )

      // Tagline
      gsap.fromTo(taglineRef.current?.children || [],
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, stagger: 0.08, ease: 'power3.out', delay: 1.6 }
      )

      // Scroll indicator
      gsap.fromTo(scrollIndicatorRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 1, delay: 2.2 }
      )

      // Scroll scrub for title parallax and fade (Phase 1: 0-25%)
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=80%',
        scrub: 0.8,
        onUpdate: (self) => {
          const p = self.progress
          gsap.to(title, {
            y: p * -120,
            scale: 1 - p * 0.08,
            opacity: 1 - p * 0.6,
            filter: `blur(${p * 4}px)`,
            duration: 0.3,
            overwrite: 'auto',
          })
          gsap.to(subtitleRef.current, {
            y: p * -80,
            opacity: 1 - p * 1.2,
            duration: 0.3,
            overwrite: 'auto',
          })
        }
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  // Helper to split text into chars with mask
  const splitLine = (text) => {
    return text.split('').map((char, i) => (
      <span key={i} className="char inline-block will-change-transform" style={{ transformOrigin: 'bottom' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))
  }

  return (
    <section ref={containerRef} className="relative z-10 min-h-[100vh] flex flex-col justify-center px-6 md:px-10 lg:px-14 pointer-events-none">
      {/* Top meta */}
      <div className="absolute top-[22vh] md:top-[24vh] left-6 md:left-10 lg:left-14 flex gap-6 md:gap-10 text-[10px] font-mono tracking-[0.2em] text-white/40">
        <span>001 / INTRO</span>
        <span className="hidden md:block">— FLUID SIMULATION • WEBGL2 • GLSL</span>
      </div>

      {/* Main editorial title */}
      <div ref={titleRef} className="mt-[12vh] md:mt-[8vh] max-w-[92vw] lg:max-w-[88vw]">
        <h1 className="font-black tracking-[-0.05em] leading-[0.85] text-white select-none">
          <div className="line overflow-hidden text-[13vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[7.5vw]">
            {splitLine('WE CRAFT')}
          </div>
          <div className="line overflow-hidden text-[13vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[7.5vw] -mt-[0.02em]">
            {splitLine('SENSORY')}
          </div>
          <div className="line overflow-hidden text-[13vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[7.5vw] -mt-[0.02em] flex flex-wrap items-baseline gap-[0.15em]">
            <span className="overflow-hidden inline-flex">
              {splitLine('DIGITAL')}
            </span>
            <span className="text-[5vw] md:text-[3.2vw] lg:text-[2.2vw] font-light tracking-[-0.02em] text-white/50 ml-[0.2em] translate-y-[-0.15em]">
              (2026)
            </span>
          </div>
          <div className="line overflow-hidden text-[13vw] md:text-[10vw] lg:text-[8.5vw] xl:text-[7.5vw] -mt-[0.02em] text-transparent bg-clip-text bg-gradient-to-r from-[#7928ca] via-[#00f0ff] to-[#ffb347]">
            {splitLine('EXPERIENCES')}
          </div>
        </h1>
      </div>

      {/* Subtitle */}
      <div ref={subtitleRef} className="mt-8 md:mt-12 max-w-[520px] pointer-events-auto">
        <p className="text-[15px] md:text-[17px] leading-[1.6] tracking-[-0.01em] text-white/70 font-light">
          An independent creative studio crafting <span className="text-white font-medium">hyper-realistic refractive dispersion glass</span>, organic jelly-like fluid physics, and curl-noise reactive particle ribbons.
          <br />
          <span className="text-white/40">Inspired by Lusion.co — rebuilt with WebGL2, GLSL, and viscous inertial scrolling.</span>
        </p>
        <div className="mt-8 flex gap-4">
          <button className="group relative px-7 py-[14px] rounded-full bg-white text-black text-[12px] tracking-[0.14em] font-bold overflow-hidden cursor-pointer hover:bg-white/90 transition-colors">
            <span className="relative z-10 flex items-center gap-2">
              ENTER LAB
              <span className="w-[18px] h-[18px] rounded-full bg-black text-white flex items-center justify-center text-[10px] group-hover:rotate-45 transition-transform duration-500">↗</span>
            </span>
          </button>
          <button className="px-7 py-[14px] rounded-full border border-white/15 text-white/80 text-[12px] tracking-[0.14em] font-medium hover:border-white/30 hover:text-white transition-all cursor-pointer backdrop-blur">
            MANIFESTO
          </button>
        </div>
      </div>

      {/* Right tagline - editorial */}
      <div ref={taglineRef} className="hidden lg:flex absolute right-14 top-1/2 -translate-y-1/2 flex-col gap-6 pointer-events-auto">
        <div className="w-[1px] h-[80px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
        <div className="writing-vertical text-[10px] tracking-[0.3em] font-mono text-white/30 [writing-mode:vertical-rl]">
          ORGANIC FLUID MESH • Icosahedron(2.2,64) • snoise(vec4(pos*1.5,time*0.8))*0.45
        </div>
      </div>

      {/* Scroll indicator */}
      <div ref={scrollIndicatorRef} className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto">
        <div className="text-[10px] tracking-[0.2em] font-mono text-white/30">SCROLL</div>
        <div className="w-[1px] h-[56px] bg-white/10 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-[20px] bg-white animate-[scrollLine_1.8s_ease-in-out_infinite]" />
        </div>
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 h-[2px] z-[101] origin-left pointer-events-none">
        <div className="h-full bg-gradient-to-r from-[#7928ca] via-[#00f0ff] to-[#ffb347] transition-none" style={{ width: `${scrollProgress * 100}%` }} />
      </div>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(56px); }
        }
      `}</style>
    </section>
  )
}
