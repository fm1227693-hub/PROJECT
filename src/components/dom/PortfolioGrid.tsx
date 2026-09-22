/**
 * LUSION HOMEPAGE — PortfolioGrid
 * Typography huge display Bold Ideas, / Brought to Life with masked stagger reveal
 * Subtext block on right: We combine design, motion, 3D, and development...
 * Case Studies Grid: 2-column rounded cards (Devin AI laptop, Tree canopy, Spaaace NFT, DDD 2024, Soda Experience) with hover-depth parallax
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: '01',
    title: 'Devin AI',
    subtitle: 'AI laptop — autonomous software engineer',
    category: 'AI / PRODUCT',
    year: '2024',
    color: '#e8e6f0',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80',
    accent: '#0b0b0d',
  },
  {
    id: '02',
    title: 'Tree Canopy',
    subtitle: 'Canopy — forest data visualization',
    category: 'DATA / ENVIRONMENT',
    year: '2024',
    color: '#d6e8d0',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80',
    accent: '#1a3d1a',
  },
  {
    id: '03',
    title: 'Spaaace NFT',
    subtitle: 'Spaaace — cosmic collectibles',
    category: 'WEB3 / MOTION',
    year: '2023',
    color: '#d6eef5',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=900&q=80',
    accent: '#0f2a3a',
  },
  {
    id: '04',
    title: 'DDD 2024',
    subtitle: 'Domain-Driven Design conference',
    category: 'EVENT / BRANDING',
    year: '2024',
    color: '#f5e6d3',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&q=80',
    accent: '#4a2a0a',
  },
  {
    id: '05',
    title: 'Soda Experience',
    subtitle: 'Soda — immersive beverage ritual',
    category: 'EXPERIMENTAL / 3D',
    year: '2023',
    color: '#f0d6e8',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80',
    accent: '#3d0a2a',
  },
  {
    id: '06',
    title: 'Elastic Lab',
    subtitle: 'Lab — ribbon physics experiments',
    category: 'LAB / R&D',
    year: '2024',
    color: '#e0e0e0',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&q=80',
    accent: '#0b0b0d',
  },
]

export default function PortfolioGrid() {
  const sectionRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLDivElement>(null)
  const subtextRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      if (titleRef.current) {
        const lines = titleRef.current.querySelectorAll('.line')
        gsap.fromTo(
          lines,
          { yPercent: 115, opacity: 0 },
          {
            yPercent: 0,
            opacity: 1,
            duration: 1.2,
            stagger: 0.14,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 84%',
              end: 'top 58%',
              scrub: 0.6,
            },
          }
        )
      }

      if (subtextRef.current) {
        gsap.fromTo(
          subtextRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: subtextRef.current,
              start: 'top 85%',
              end: 'top 65%',
              scrub: 0.5,
            },
          }
        )
      }

      cardsRef.current.forEach((card, i) => {
        if (!card) return
        gsap.fromTo(
          card,
          { y: 90, opacity: 0, scale: 0.95, rotateX: -8 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            rotateX: 0,
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: card,
              start: 'top 90%',
              end: 'top 64%',
              scrub: 0.55,
            },
            delay: i * 0.03,
          }
        )
      })
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  const handleMove = (e: React.MouseEvent, index: number) => {
    const card = cardsRef.current[index]
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2
    const rx = (y - cy) / 20
    const ry = (cx - x) / 20

    gsap.to(card, {
      rotateX: -rx,
      rotateY: ry,
      transformPerspective: 1400,
      duration: 0.75,
      ease: 'power3.out',
    })

    const img = card.querySelector('.card-image') as HTMLElement
    if (img) {
      gsap.to(img, {
        scale: 1.1,
        x: (x - cx) * 0.05,
        y: (y - cy) * 0.05,
        duration: 0.75,
        ease: 'power2.out',
      })
    }

    const content = card.querySelector('.card-content') as HTMLElement
    if (content) {
      gsap.to(content, {
        x: (x - cx) * 0.02,
        y: (y - cy) * 0.02,
        duration: 0.6,
        ease: 'power2.out',
      })
    }
  }

  const handleLeave = (index: number) => {
    const card = cardsRef.current[index]
    if (!card) return
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1.1, ease: 'elastic.out(1,0.42)' })
    const img = card.querySelector('.card-image') as HTMLElement
    if (img) gsap.to(img, { scale: 1, x: 0, y: 0, duration: 0.9, ease: 'power3.out' })
    const content = card.querySelector('.card-content') as HTMLElement
    if (content) gsap.to(content, { x: 0, y: 0, duration: 0.7, ease: 'power3.out' })
  }

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#f7f7f9] px-6 md:px-8 lg:px-10 py-20 md:py-28">
      <div className="max-w-[1600px] mx-auto">
        {/* Typography huge display Bold Ideas, / Brought to Life with masked stagger reveal */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-16 items-end mb-16 md:mb-24">
          <div ref={titleRef}>
            <div className="text-[11px] font-mono tracking-[0.2em] text-black/40 mb-8">002 / FEATURED WORK</div>
            <h2 className="font-black tracking-[-0.055em] leading-[0.82] text-[#0b0b0d]">
              <div className="line overflow-hidden text-[12vw] md:text-[8.5vw] lg:text-[6.8vw]">Bold Ideas,</div>
              <div className="line overflow-hidden text-[12vw] md:text-[8.5vw] lg:text-[6.8vw] text-[#0b0b0d]/20">Brought to Life</div>
            </h2>
          </div>

          {/* Subtext block on right: We combine design, motion, 3D, and development... */}
          <div ref={subtextRef} className="lg:pb-4">
            <p className="text-[15px] md:text-[17px] leading-[1.6] tracking-[-0.01em] text-black/60 max-w-[420px]">
              We combine design, motion, 3D, and development to craft bold digital experiences that blur the line between physical
              and virtual. Each project is an experiment in elastic physics and editorial storytelling.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#0b0b0d] text-white text-[11px] font-mono tracking-[0.12em]">6 PROJECTS</span>
              <span className="text-[11px] font-mono tracking-[0.15em] text-black/30">2023 — 2024 • SCROLL TO EXPLORE</span>
            </div>
          </div>
        </div>

        {/* Case Studies Grid 2-column rounded cards with hover-depth parallax */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 perspective-[2000px]">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              onMouseMove={(e) => handleMove(e, i)}
              onMouseLeave={() => handleLeave(i)}
              data-cursor-hover
              className="group relative rounded-[20px] md:rounded-[28px] overflow-hidden bg-white border border-black/[0.06] will-change-transform cursor-pointer"
              style={{ transformStyle: 'preserve-3d' }}
            >
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="absolute top-4 left-4 right-4 flex justify-between items-start">
                  <span className="px-3 py-1 rounded-full bg-white/92 backdrop-blur text-[10px] font-mono tracking-[0.15em] text-black/70 border border-black/5">
                    {p.category}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/92 backdrop-blur flex items-center justify-center text-black/60 group-hover:rotate-45 transition-transform duration-500 border border-black/5">
                    ↗
                  </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-7 bg-gradient-to-t from-black/50 via-black/15 to-transparent">
                  <h3 className="text-[22px] md:text-[26px] font-bold tracking-[-0.02em] text-white leading-[0.9]">{p.title}</h3>
                  <p className="mt-1 text-[12px] text-white/70 font-mono tracking-[0.02em]">{p.subtitle}</p>
                </div>
              </div>

              <div className="card-content p-6 md:p-7 flex justify-between items-end bg-white will-change-transform">
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-mono tracking-[0.15em] text-black/40 mb-2">
                    <span>{p.id}</span>
                    <span className="w-3 h-[1px] bg-black/15" />
                    <span>{p.year}</span>
                  </div>
                  <p className="text-[13px] leading-[1.5] text-black/50 max-w-[300px]">{p.subtitle}</p>
                </div>
                <div className="hidden md:flex w-10 h-10 rounded-full border border-black/10 items-center justify-center text-black/40 group-hover:bg-[#0b0b0d] group-hover:text-white group-hover:border-[#0b0b0d] transition-all duration-300">
                  →
                </div>
              </div>

              <div className="absolute inset-0 rounded-[inherit] border border-black/0 group-hover:border-black/10 transition-colors pointer-events-none" />
            </div>
          ))}
        </div>

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
