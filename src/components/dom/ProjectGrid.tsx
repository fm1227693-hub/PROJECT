/**
 * LUSION HOMEPAGE — ProjectGrid
 * Section title: Featured Work and huge statement: Bold Ideas, Brought to Life.
 * 2-column editorial project grid (interactive cards with rounded corners and smooth scale on hover)
 * Light theme #f9f9fb / #0b0b0d
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: '01',
    title: 'NEURAL GARDEN',
    category: 'FLUID SIMULATION / WEBGL',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80',
    color: '#e8e6f0',
    desc: 'Organic fluid experience with hydrodynamic interaction.',
  },
  {
    id: '02',
    title: 'DISPERSION PRISM',
    category: 'MATERIAL SCIENCE / GLSL',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    color: '#d6eef5',
    desc: 'Hyper-realistic glass prism with spectral dispersion.',
  },
  {
    id: '03',
    title: 'CURL RIBBONS',
    category: 'PARTICLE SYSTEM / 8K',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80',
    color: '#f5e6d3',
    desc: 'GPGPU curl-noise particle stream orbiting central fluid.',
  },
  {
    id: '04',
    title: 'VISCOUS SCROLL',
    category: 'INTERACTION / LENIS',
    year: '2023',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&q=80',
    color: '#e0e0e0',
    desc: 'Inertial scroll choreography with 45° camera glide.',
  },
]

export default function ProjectGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Huge statement reveal
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.line')
        gsap.fromTo(
          lines,
          { yPercent: 110, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.1,
            stagger: 0.12,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 82%',
              end: 'top 55%',
              scrub: 0.6,
            },
          }
        )
      }

      // Cards stagger
      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          { y: 80, opacity: 0, scale: 0.96 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 88%',
              end: 'top 62%',
              scrub: 0.5,
            },
            delay: i * 0.04,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMouseMove = (e: React.MouseEvent, index: number) => {
    const card = cardsRef.current[index]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = (y - cy) / 18
    const ry = (cx - x) / 18

    gsap.to(card, {
      rotateX: -rx,
      rotateY: ry,
      transformPerspective: 1200,
      duration: 0.7,
      ease: 'power3.out',
    })

    const img = card.querySelector('.card-image') as HTMLElement
    if (img) {
      gsap.to(img, {
        scale: 1.08,
        x: (x - cx) * 0.04,
        y: (y - cy) * 0.04,
        duration: 0.7,
        ease: 'power2.out',
      })
    }
  }

  const handleMouseLeave = (index: number) => {
    const card = cardsRef.current[index]
    if (!card) return
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1, 0.45)' })
    const img = card.querySelector('.card-image') as HTMLElement
    if (img) {
      gsap.to(img, { scale: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out' })
    }
  }

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#f9f9fb] px-6 md:px-8 lg:px-10 py-20 md:py-28">
      {/* Header */}
      <div className="max-w-[1600px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8 mb-16 md:mb-24">
          <div className="flex items-center gap-3 text-[11px] font-mono tracking-[0.2em] text-black/40">
            <span className="w-2 h-2 rounded-full bg-[#0b0b0d]" />
            FEATURED WORK / 2023 — 2024
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] text-black/30">
            <span>4 PROJECTS</span>
            <span className="w-6 h-[1px] bg-black/15" />
            <span>SCROLL TO EXPLORE</span>
          </div>
        </div>

        <div ref={titleRef} className="mb-16 md:mb-24">
          <h2 className="font-black tracking-[-0.05em] leading-[0.85] text-[#0b0b0d]">
            <div className="line overflow-hidden text-[12vw] md:text-[8vw] lg:text-[6.5vw]">Bold Ideas,</div>
            <div className="line overflow-hidden text-[12vw] md:text-[8vw] lg:text-[6.5vw] text-[#0b0b0d]/20">Brought to Life.</div>
          </h2>
          <div className="mt-8 max-w-[420px]">
            <p className="text-[14px] leading-[1.6] text-black/50">
              Selected experiments crafted with elastic physics, refractive glass, and curl-noise ribbons. Each case study explores the boundary between physical and digital.
            </p>
          </div>
        </div>

        {/* 2-column editorial project grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 perspective-[2000px]">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              onMouseMove={(e) => handleMouseMove(e, i)}
              onMouseLeave={() => handleMouseLeave(i)}
              className="group relative rounded-[20px] md:rounded-[28px] overflow-hidden bg-white border border-black/[0.06] will-change-transform cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Image */}
              <div className="relative aspect-[4/3] overflow-hidden bg-[#f5f5f7]">
                <div
                  className="card-image absolute inset-0 will-change-transform"
                  style={{
                    backgroundColor: p.color,
                    backgroundImage: `url(${p.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                {/* Overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Top meta */}
                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-white/90 backdrop-blur text-[10px] font-mono tracking-[0.15em] text-black/70 border border-black/5">
                    {p.category}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-black/60 group-hover:rotate-45 transition-transform duration-500 border border-black/5">
                    ↗
                  </span>
                </div>

                {/* Bottom title on image */}
                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 bg-gradient-to-t from-black/40 via-black/10 to-transparent">
                  <h3 className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em] text-white leading-[0.9]">{p.title}</h3>
                </div>
              </div>

              {/* Content */}
              <div className="p-6 md:p-7 flex justify-between items-end bg-white">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] text-black/40 mb-2">
                    <span>{p.id}</span>
                    <span className="w-3 h-[1px] bg-black/15" />
                    <span>{p.year}</span>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-black/50 max-w-[300px]">{p.desc}</p>
                </div>
                <div className="hidden md:flex w-10 h-10 rounded-full border border-black/10 items-center justify-center text-black/40 group-hover:bg-[#0b0b0d] group-hover:text-white group-hover:border-[#0b0b0d] transition-all duration-300">
                  →
                </div>
              </div>

              {/* Hover border */}
              <div className="absolute inset-0 rounded-[inherit] border border-black/0 group-hover:border-black/10 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 md:mt-28 flex flex-col md:flex-row justify-between items-start md:items-end gap-8 border-t border-black/10 pt-10">
          <div>
            <h3 className="text-[28px] md:text-[36px] font-bold tracking-[-0.03em] leading-[0.9] text-[#0b0b0d]">Let&apos;s build something bold.</h3>
            <p className="mt-3 text-[14px] text-black/50 max-w-[360px]">We&apos;re always open to new collaborations and experimental ideas.</p>
          </div>
          <button className="group flex items-center gap-3 px-6 py-3 rounded-full bg-[#0b0b0d] text-white text-[14px] font-medium hover:bg-black transition-colors cursor-pointer">
            <span>START A PROJECT</span>
            <span className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center group-hover:rotate-45 transition-transform">↗</span>
          </button>
        </div>
      </div>
    </section>
  )
}
