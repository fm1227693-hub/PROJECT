/**
 * LUSION DOM — HeroOverlay
 * Editorial typography, character-mask stagger entrance, case cards that glide in during 50-75% scroll
 * Production-grade GSAP ScrollTrigger
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface HeroOverlayProps {
  scrollProgress?: number
}

const projects = [
  {
    id: '01',
    title: 'NEURAL\nGARDEN',
    category: 'FLUID SIMULATION / WEBGL',
    year: '2024',
    color: '#7a2bff',
    desc: 'Organic fluid body Icosa(2.4,128) + hydrodynamic ripple damped spring oscillation.',
    stats: ['Icosa 2.4,128', 'snoise*0.45', 'Impulse 0.68', 'Damping 0.85'],
  },
  {
    id: '02',
    title: 'DISPERSION\nPRISM',
    category: 'MATERIAL SCIENCE / GLSL',
    year: '2024',
    color: '#00f0ff',
    desc: 'True physical dispersion glass: transmission 0.99, ior 1.54, thickness 3.2, chromatic 0.12.',
    stats: ['Rough 0.03', 'IOR 1.54', 'Trans 0.99', 'Chroma 0.12'],
  },
  {
    id: '03',
    title: 'CURL\nRIBBONS',
    category: 'GPGPU PARTICLES / 8K',
    year: '2023',
    color: '#ffb347',
    desc: '8000 points GPU vector field, curl-noise orbital, aggressive swirl on velocity spikes.',
    stats: ['8000 pts', 'Curl 0.65', 'Vortex 0.055', 'Bloom 1.25'],
  },
  {
    id: '04',
    title: 'VISCOUS\nSCROLL',
    category: 'LENIS + GSAP',
    year: '2023',
    color: '#ffffff',
    desc: 'Inertial scroll choreography 4 phases, 45° camera Z-orbit, spring dampening.',
    stats: ['Lerp 0.055', 'Wheel 0.85', '45° glide', 'Trigger scrub'],
  },
]

export default function HeroOverlay({ scrollProgress = 0 }: HeroOverlayProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLDivElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const scrollIndicatorRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Character-mask stagger entrance per [0%-25%] spec
      const title = titleRef.current
      if (title) {
        const lines = title.querySelectorAll('.line')
        lines.forEach((line, lineIndex) => {
          const chars = line.querySelectorAll('.char')
          gsap.fromTo(
            chars,
            { yPercent: 115, rotateX: -18, opacity: 0 },
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              duration: 1.5,
              ease: 'power4.out',
              stagger: { each: 0.022, from: 'start' },
              delay: 0.5 + lineIndex * 0.14,
            }
          )
        })
      }

      gsap.fromTo(
        subtitleRef.current,
        { y: 32, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.25, ease: 'power3.out', delay: 1.35 }
      )

      if (taglineRef.current) {
        gsap.fromTo(
          taglineRef.current.children,
          { y: 22, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.09, ease: 'power3.out', delay: 1.55 }
        )
      }

      gsap.fromTo(scrollIndicatorRef.current, { opacity: 0 }, { opacity: 1, duration: 1, delay: 2.1 })

      // Scroll scrub for title parallax — Phase 1 resting breathing
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: '+=85%',
        scrub: 0.85,
        onUpdate: (self) => {
          const p = self.progress
          if (title) {
            gsap.to(title, {
              y: p * -130,
              scale: 1 - p * 0.09,
              opacity: 1 - p * 0.65,
              filter: `blur(${p * 4.5}px)`,
              duration: 0.35,
              overwrite: 'auto',
            })
          }
          if (subtitleRef.current) {
            gsap.to(subtitleRef.current, {
              y: p * -90,
              opacity: 1 - p * 1.25,
              duration: 0.35,
              overwrite: 'auto',
            })
          }
        },
      })

      // Case-study typography glides in during [50%-75%] per spec
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          { y: 140, opacity: 0, rotateX: -16, scale: 0.9 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1.5,
            ease: 'elastic.out(1, 0.58)',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 52%',
              scrub: 0.65,
            },
            delay: i * 0.07,
          }
        )
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  const splitLine = (text: string) =>
    text.split('').map((char, i) => (
      <span key={i} className="char inline-block will-change-transform" style={{ transformOrigin: 'bottom' }}>
        {char === ' ' ? '\u00A0' : char}
      </span>
    ))

  const handleCardMove = (e: React.MouseEvent, index: number) => {
    const card = cardsRef.current[index]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = (y - cy) / 13
    const ry = (cx - x) / 13

    gsap.to(card, {
      rotateX: -rx,
      rotateY: ry,
      transformPerspective: 1400,
      duration: 0.85,
      ease: 'power3.out',
    })

    const hl = card.querySelector('.magnetic-highlight') as HTMLElement
    if (hl) {
      gsap.to(hl, { x: x - cx, y: y - cy, opacity: 1, duration: 0.5, ease: 'power2.out' })
    }
  }

  const handleCardLeave = (index: number) => {
    const card = cardsRef.current[index]
    if (!card) return
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1.25, ease: 'elastic.out(1,0.48)' })
    const hl = card.querySelector('.magnetic-highlight') as HTMLElement
    if (hl) gsap.to(hl, { opacity: 0, duration: 0.4 })
  }

  return (
    <div ref={containerRef} className="relative z-10">
      {/* HERO — Phase 1 */}
      <section className="relative min-h-[100vh] flex flex-col justify-center px-6 md:px-10 lg:px-14 pointer-events-none">
        <div className="absolute top-[22vh] md:top-[24vh] left-6 md:left-10 lg:left-14 flex gap-6 md:gap-10 text-[10px] font-mono tracking-[0.22em] text-white/40">
          <span>001 / INTRO — RESTING BREATHING</span>
          <span className="hidden md:block">— Icosa(2.4,128) • snoise*0.45 • 8000 PTS</span>
        </div>

        <div className="mt-[12vh] md:mt-[8vh] max-w-[92vw] lg:max-w-[88vw]">
          <h1 ref={titleRef} className="font-black tracking-[-0.055em] leading-[0.84] text-white select-none">
            <div className="line overflow-hidden text-[13.5vw] md:text-[10.5vw] lg:text-[8.8vw] xl:text-[7.8vw]">{splitLine('WE CRAFT')}</div>
            <div className="line overflow-hidden text-[13.5vw] md:text-[10.5vw] lg:text-[8.8vw] xl:text-[7.8vw] -mt-[0.02em]">
              {splitLine('SENSORY')}
            </div>
            <div className="line overflow-hidden text-[13.5vw] md:text-[10.5vw] lg:text-[8.8vw] xl:text-[7.8vw] -mt-[0.02em] flex flex-wrap items-baseline gap-[0.16em]">
              <span className="overflow-hidden inline-flex">{splitLine('DIGITAL')}</span>
              <span className="text-[5vw] md:text-[3.2vw] lg:text-[2.2vw] font-light tracking-[-0.02em] text-white/50 ml-[0.2em] translate-y-[-0.15em]">
                (2026)
              </span>
            </div>
            <div className="line overflow-hidden text-[13.5vw] md:text-[10.5vw] lg:text-[8.8vw] xl:text-[7.8vw] -mt-[0.02em] text-transparent bg-clip-text bg-gradient-to-r from-[#7a2bff] via-[#00f0ff] to-[#ffb347]">
              {splitLine('EXPERIENCES')}
            </div>
          </h1>
        </div>

        <div ref={subtitleRef} className="mt-8 md:mt-12 max-w-[540px] pointer-events-auto">
          <p className="text-[15px] md:text-[17px] leading-[1.65] tracking-[-0.01em] text-white/70 font-light">
            Independent creative studio crafting{' '}
            <span className="text-white font-medium">true physical dispersion glass (trans 0.99, ior 1.54, thickness 3.2)</span>, organic
            fluid body with hydrodynamic surface tension, and 8000-point curl-noise ribbon simulation.
            <br />
            <span className="text-white/40">Reverse-engineered from Lusion.co — WebGL2, GLSL, R3F, Lenis, GSAP.</span>
          </p>
          <div className="mt-8 flex gap-4">
            <button className="group relative px-7 py-[14px] rounded-full bg-white text-black text-[12px] tracking-[0.14em] font-bold overflow-hidden cursor-pointer hover:bg-white/90 transition-colors">
              <span className="relative z-10 flex items-center gap-2">
                ENTER LAB
                <span className="w-[18px] h-[18px] rounded-full bg-black text-white flex items-center justify-center text-[10px] group-hover:rotate-45 transition-transform duration-500">
                  ↗
                </span>
              </span>
            </button>
            <button className="px-7 py-[14px] rounded-full border border-white/15 text-white/80 text-[12px] tracking-[0.14em] font-medium hover:border-white/30 hover:text-white transition-all cursor-pointer backdrop-blur">
              MANIFESTO
            </button>
          </div>
        </div>

        <div
          ref={taglineRef}
          className="hidden lg:flex absolute right-14 top-1/2 -translate-y-1/2 flex-col gap-6 pointer-events-auto"
        >
          <div className="w-[1px] h-[80px] bg-gradient-to-b from-transparent via-white/20 to-transparent" />
          <div className="writing-vertical text-[10px] tracking-[0.32em] font-mono text-white/30 [writing-mode:vertical-rl]">
            ORGANIC FLUID • Icosahedron(2.4,128) • snoise(vec4(pos*1.5,time*0.8))*0.45 • 8000 CURL
          </div>
        </div>

        <div
          ref={scrollIndicatorRef}
          className="absolute bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 pointer-events-auto"
        >
          <div className="text-[10px] tracking-[0.22em] font-mono text-white/30">SCROLL</div>
          <div className="w-[1px] h-[56px] bg-white/10 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-[20px] bg-white animate-[scrollLine_1.8s_ease-in-out_infinite]" />
          </div>
        </div>

        <div className="fixed top-0 left-0 right-0 h-[2px] z-[101] origin-left pointer-events-none">
          <div
            className="h-full bg-gradient-to-r from-[#7a2bff] via-[#00f0ff] to-[#ffb347] transition-none"
            style={{ width: `${scrollProgress * 100}%` }}
          />
        </div>
      </section>

      {/* PHASE 2 — Elongation */}
      <section className="relative min-h-[110vh] flex items-center px-6 md:px-10 lg:px-14">
        <div className="max-w-[1600px] mx-auto w-full grid lg:grid-cols-[1.1fr_0.9fr] gap-12 md:gap-20 items-center">
          <div className="order-2 lg:order-1">
            <div className="text-[10px] font-mono tracking-[0.22em] text-white/30 mb-8">002 / PHASE 02 — PRISM MORPH • 25%–50% • Y-STRETCH + Z-ORBIT</div>
            <h2 className="text-[11vw] md:text-[7vw] lg:text-[5.5vw] font-black leading-[0.84] tracking-[-0.055em]">
              ELONGATES
              <br />
              <span className="text-white/20">&</span> SHEARS
              <br />
              <span className="bg-gradient-to-r from-[#7a2bff] to-[#00f0ff] bg-clip-text text-transparent">ALONG</span>
              <br />
              VECTOR
            </h2>
            <div className="mt-10 grid grid-cols-2 gap-8 max-w-[480px] border-t border-white/10 pt-8">
              <div>
                <div className="text-[10px] tracking-widest font-mono text-white/30 mb-2">MATERIAL</div>
                <div className="text-[13px] leading-[1.5] text-white/60">
                  transmission: 0.99
                  <br />
                  ior: 1.54
                  <br />
                  thickness: 3.2
                  <br />
                  chromatic: 0.12
                </div>
              </div>
              <div>
                <div className="text-[10px] tracking-widest font-mono text-white/30 mb-2">DEFORMATION</div>
                <div className="text-[13px] leading-[1.5] text-white/60">
                  Icosahedron(2.4,128)
                  <br />
                  snoise*0.45
                  <br />
                  impulse 0.68
                  <br />
                  damping 0.85
                </div>
              </div>
            </div>
          </div>
          <div className="order-1 lg:order-2 lg:pl-12">
            <div className="relative rounded-[28px] border border-white/10 bg-white/[0.02] backdrop-blur-2xl p-8 md:p-10 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-[#7a2bff]/20 via-transparent to-[#00f0ff]/15 pointer-events-none" />
              <div className="relative">
                <div className="text-[10px] font-mono tracking-[0.22em] text-white/40 mb-6">GLSL / VERTEX DISPLACEMENT</div>
                <pre className="text-[11px] leading-[1.7] font-mono text-white/70 overflow-x-auto">
                  {`vec3 displacedPos = position + normal * (
  snoise(vec4(position * uFrequency,
  uTime * uSpeed)) * uAmplitude
);

// Damped harmonic spring
float spring = exp(-uDamping*t) *
  sin(freq*t);
float impulse = falloff * vel *
  (0.7 + spring*0.35);`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PHASE 3 — Explosion into droplets + case cards glide in */}
      <section className="relative min-h-[180vh] px-6 md:px-10 lg:px-14 py-24">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-20 md:mb-28">
          <div>
            <div className="text-[10px] font-mono tracking-[0.22em] text-white/40 mb-6">003 / PHASE 03 — EXPLOSION • 50%–75% • DROPLETS + RIBBONS</div>
            <h2 className="text-[12vw] md:text-[8vw] lg:text-[6.5vw] font-black tracking-[-0.055em] leading-[0.84] text-white">
              LABORATORY
              <br />
              <span className="text-white/20">ARCHIVE</span>
            </h2>
          </div>
          <div className="md:max-w-[380px] flex flex-col justify-end">
            <p className="text-[13px] leading-[1.7] text-white/50 font-mono">
              Phase 3: prism explodes into constellation of refractive droplets and fluid ribbons sweeping across borders; case-study typography glides in with elastic spring.
            </p>
            <div className="mt-6 flex gap-2">
              <span className="px-3 py-1 rounded-full border border-white/10 text-[10px] tracking-widest text-white/40">PHASE 3 ACTIVE</span>
              <span className="px-3 py-1 rounded-full bg-white text-black text-[10px] tracking-widest font-bold">
                {Math.round(scrollProgress * 100)}% SCROLL
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-[1600px] mx-auto perspective-[2000px]">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              onMouseMove={(e) => handleCardMove(e, i)}
              onMouseLeave={() => handleCardLeave(i)}
              className="group relative aspect-[4/3] md:aspect-[5/4] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#0a0a0f] border border-white/[0.06] will-change-transform cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div
                className="absolute inset-0 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-700"
                style={{
                  background: `radial-gradient(120% 120% at 0% 0%, ${p.color}, transparent 60%), radial-gradient(100% 100% at 100% 100%, ${p.color}40, transparent)`,
                }}
              />
              <div
                className="magnetic-highlight pointer-events-none absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[60px]"
                style={{ background: `radial-gradient(circle, ${p.color}30, transparent 70%)` }}
              />
              <div className="relative h-full flex flex-col justify-between p-7 md:p-10">
                <div className="flex justify-between items-start">
                  <span className="text-[11px] font-mono tracking-[0.22em] text-white/30">
                    {p.id} / {p.year}
                  </span>
                  <span className="text-[10px] font-mono tracking-[0.16em] px-3 py-1 rounded-full border border-white/10 text-white/50 group-hover:text-white/80 group-hover:border-white/20 transition-colors">
                    {p.category}
                  </span>
                </div>
                <div>
                  <h3 className="text-[12vw] md:text-[5vw] lg:text-[4vw] font-black leading-[0.84] tracking-[-0.045em] text-white whitespace-pre-line group-hover:tracking-[-0.03em] transition-all duration-700">
                    {p.title}
                  </h3>
                  <p className="mt-4 text-[13px] leading-[1.6] text-white/50 max-w-[90%] group-hover:text-white/70 transition-colors">
                    {p.desc}
                  </p>
                  <div className="mt-6 flex flex-wrap gap-2">
                    {p.stats.map((s) => (
                      <span
                        key={s}
                        className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/40 group-hover:text-white/60 transition-colors"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-[11px] tracking-[0.16em] text-white/40 group-hover:text-white transition-colors">
                    <span>EXPLORE EXPERIMENT</span>
                    <span className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">
                      ↗
                    </span>
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-bold group-hover:scale-110 transition-transform">
                    {p.id}
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 rounded-[inherit] border border-white/[0.08] pointer-events-none group-hover:border-white/[0.15] transition-colors" />
            </div>
          ))}
        </div>

        <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1600px] mx-auto border-t border-white/10 pt-10">
          {[
            { k: 'TRIANGLES', v: '196,608' },
            { k: 'PARTICLES', v: '8,000+' },
            { k: 'SHADERS', v: 'GLSL 3.0 + 4D' },
            { k: 'FPS TARGET', v: '60-120' },
          ].map((item) => (
            <div key={item.k} className="space-y-1">
              <div className="text-[10px] font-mono tracking-[0.22em] text-white/30">{item.k}</div>
              <div className="text-[20px] md:text-[24px] font-bold tracking-[-0.02em] text-white">{item.v}</div>
            </div>
          ))}
        </div>
      </section>

      <style>{`
        @keyframes scrollLine {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(56px); }
        }
      `}</style>
    </div>
  )
}
