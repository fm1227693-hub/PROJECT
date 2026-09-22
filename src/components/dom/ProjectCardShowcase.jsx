import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: '01',
    title: 'NEURAL\nGARDEN',
    category: 'FLUID SIMULATION / WEBGL',
    year: '2024',
    color: '#7928ca',
    desc: 'Organic jelly-like mesh with hydrodynamic mouse repulsion and raymarched vertex noise.',
    stats: ['Icosahedron 2.2,64', 'snoise *0.45', 'Impulse 0.6'],
  },
  {
    id: '02',
    title: 'DISPERSION\nPRISM',
    category: 'MATERIAL SCIENCE / GLSL',
    year: '2024',
    color: '#00f0ff',
    desc: 'Hyper-realistic refractive glass with chromatic aberration 0.08 and thin-film iridescence.',
    stats: ['Rough 0.04', 'IOR 1.52', 'Trans 0.98'],
  },
  {
    id: '03',
    title: 'CURL\nRIBBONS',
    category: 'GPGPU PARTICLES / 6K',
    year: '2023',
    color: '#ffb347',
    desc: 'Instanced particle stream orbiting with curl-noise vector field and magnetic cursor cuts.',
    stats: ['6000 pts', 'Vortex 0.055', 'Bloom 1.2'],
  },
  {
    id: '04',
    title: 'VISCOUS\nSCROLL',
    category: 'LENIS + GSAP',
    year: '2023',
    color: '#ffffff',
    desc: 'Inertial scroll choreography with 4 phases, 45° camera glide, and spring dampening.',
    stats: ['Lerp 0.055', 'Wheel 0.85', 'Trigger scrub'],
  },
]

export default function ProjectCardShowcase({ scrollProgress = 0 }) {
  const sectionRef = useRef()
  const cardsRef = useRef([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // High-contrast project titles enter with physics-based spring dampening per Phase 3 spec
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(card,
          { y: 120, opacity: 0, rotateX: -15, scale: 0.92 },
          {
            y: 0,
            opacity: 1,
            rotateX: 0,
            scale: 1,
            duration: 1.4,
            ease: 'elastic.out(1, 0.6)',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 55%',
              scrub: 0.6,
            },
            delay: i * 0.08,
          }
        )
      })

      // Section pin and scrub
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top 70%',
        end: 'bottom 30%',
        onUpdate: (self) => {
          const cards = cardsRef.current
          cards.forEach((card, i) => {
            if (!card) return
            const offset = (self.progress - 0.5) * (i - 1.5) * 40
            gsap.to(card, { y: offset, duration: 0.6, overwrite: 'auto' })
          })
        }
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e, index) => {
    const card = cardsRef.current[index]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const centerX = rect.width / 2
    const centerY = rect.height / 2
    const rotateX = (y - centerY) / 12
    const rotateY = (centerX - x) / 12

    gsap.to(card, {
      rotateX: -rotateX,
      rotateY: rotateY,
      transformPerspective: 1200,
      duration: 0.8,
      ease: 'power3.out',
    })

    // Magnetic highlight
    const highlight = card.querySelector('.magnetic-highlight')
    if (highlight) {
      gsap.to(highlight, {
        x: x - centerX,
        y: y - centerY,
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = (index) => {
    const card = cardsRef.current[index]
    if (!card) return
    gsap.to(card, {
      rotateX: 0,
      rotateY: 0,
      duration: 1.2,
      ease: 'elastic.out(1, 0.5)',
    })
    const highlight = card.querySelector('.magnetic-highlight')
    if (highlight) {
      gsap.to(highlight, { opacity: 0, duration: 0.4 })
    }
  }

  return (
    <section ref={sectionRef} className="relative z-10 min-h-[180vh] px-6 md:px-10 lg:px-14 py-24">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-8 mb-20 md:mb-28">
        <div>
          <div className="text-[10px] font-mono tracking-[0.2em] text-white/40 mb-6">002 / SELECTED EXPERIMENTS — 4 PHASES</div>
          <h2 className="text-[12vw] md:text-[8vw] lg:text-[6.5vw] font-black tracking-[-0.05em] leading-[0.85] text-white">
            LABORATORY<br />
            <span className="text-white/20">ARCHIVE</span>
          </h2>
        </div>
        <div className="md:max-w-[360px] flex flex-col justify-end">
          <p className="text-[13px] leading-[1.7] text-white/50 font-mono">
            Phase 3 (50-75%): Ribbon particles explode outwards, swirling around viewport borders. Project titles enter with physics-based spring dampening (stiffness 150, damping 15).
          </p>
          <div className="mt-6 flex gap-2">
            <span className="px-3 py-1 rounded-full border border-white/10 text-[10px] tracking-widest text-white/40">PHASE 3 ACTIVE</span>
            <span className="px-3 py-1 rounded-full bg-white text-black text-[10px] tracking-widest font-bold">{Math.round(scrollProgress * 100)}% SCROLL</span>
          </div>
        </div>
      </div>

      {/* Cards grid with 3D depth tilt */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 max-w-[1600px] mx-auto perspective-[2000px]">
        {projects.map((p, i) => (
          <div
            key={p.id}
            ref={(el) => (cardsRef.current[i] = el)}
            onMouseMove={(e) => handleMouseMove(e, i)}
            onMouseLeave={() => handleMouseLeave(i)}
            className="group relative aspect-[4/3] md:aspect-[5/4] rounded-[24px] md:rounded-[32px] overflow-hidden bg-[#0a0a0f] border border-white/[0.06] will-change-transform cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
          >
            {/* Gradient */}
            <div className="absolute inset-0 opacity-[0.15] group-hover:opacity-[0.25] transition-opacity duration-700" style={{
              background: `radial-gradient(120% 120% at 0% 0%, ${p.color}, transparent 60%), radial-gradient(100% 100% at 100% 100%, ${p.color}40, transparent)`,
            }} />

            {/* Magnetic highlight */}
            <div className="magnetic-highlight pointer-events-none absolute w-[400px] h-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-0 blur-[60px] transition-opacity" style={{
              background: `radial-gradient(circle, ${p.color}30, transparent 70%)`,
            }} />

            {/* Content */}
            <div className="relative h-full flex flex-col justify-between p-7 md:p-10">
              <div className="flex justify-between items-start">
                <span className="text-[11px] font-mono tracking-[0.2em] text-white/30">{p.id} / {p.year}</span>
                <span className="text-[10px] font-mono tracking-[0.15em] px-3 py-1 rounded-full border border-white/10 text-white/50 group-hover:text-white/80 group-hover:border-white/20 transition-colors">
                  {p.category}
                </span>
              </div>

              <div>
                <h3 className="text-[12vw] md:text-[5vw] lg:text-[4vw] font-black leading-[0.85] tracking-[-0.04em] text-white whitespace-pre-line group-hover:tracking-[-0.03em] transition-all duration-700">
                  {p.title}
                </h3>
                <p className="mt-4 text-[13px] leading-[1.6] text-white/50 max-w-[90%] group-hover:text-white/70 transition-colors">
                  {p.desc}
                </p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.stats.map(s => (
                    <span key={s} className="text-[10px] font-mono px-2.5 py-1 rounded-full bg-white/[0.06] border border-white/[0.08] text-white/40 group-hover:text-white/60 transition-colors">
                      {s}
                    </span>
                  ))}
                </div>
              </div>

              {/* Bottom action */}
              <div className="flex justify-between items-end">
                <div className="flex items-center gap-2 text-[11px] tracking-[0.15em] text-white/40 group-hover:text-white transition-colors">
                  <span>EXPLORE EXPERIMENT</span>
                  <span className="w-6 h-6 rounded-full border border-white/15 flex items-center justify-center group-hover:rotate-45 transition-transform duration-500">↗</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center text-[12px] font-bold group-hover:scale-110 transition-transform">
                  {p.id}
                </div>
              </div>
            </div>

            {/* Glass edge */}
            <div className="absolute inset-0 rounded-[inherit] border border-white/[0.08] pointer-events-none group-hover:border-white/[0.15] transition-colors" />
            <div className="absolute inset-0 rounded-[inherit] bg-gradient-to-b from-white/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        ))}
      </div>

      {/* Bottom stats */}
      <div className="mt-24 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-[1600px] mx-auto border-t border-white/10 pt-10">
        {[
          { k: 'TRIANGLES', v: '84,480' },
          { k: 'PARTICLES', v: '6,000+' },
          { k: 'SHADERS', v: 'GLSL 3.0' },
          { k: 'FPS TARGET', v: '60-120' },
        ].map(item => (
          <div key={item.k} className="space-y-1">
            <div className="text-[10px] font-mono tracking-[0.2em] text-white/30">{item.k}</div>
            <div className="text-[20px] md:text-[24px] font-bold tracking-[-0.02em] text-white">{item.v}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
