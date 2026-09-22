/**
 * CLEAN LUSION — PortfolioGrid
 * Clear transition into Headline Bold Ideas, Brought to Life + right column paragraph
 * Clean 2-column project grid with zero debug labels
 */

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const projects = [
  {
    id: '01',
    title: 'Devin AI',
    subtitle: 'Autonomous software engineer laptop experience',
    category: 'AI PRODUCT',
    image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=900&q=80',
    color: '#eef2ff',
  },
  {
    id: '02',
    title: 'Tree Canopy',
    subtitle: 'Forest data visualization platform',
    category: 'DATA VIZ',
    image: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=900&q=80',
    color: '#dcfce7',
  },
  {
    id: '03',
    title: 'Spaaace NFT',
    subtitle: 'Cosmic collectibles universe',
    category: 'WEB3 MOTION',
    image: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=900&q=80',
    color: '#dbeafe',
  },
  {
    id: '04',
    title: 'DDD 2024',
    subtitle: 'Domain-Driven Design conference identity',
    category: 'EVENT BRANDING',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=900&q=80',
    color: '#fef3c7',
  },
  {
    id: '05',
    title: 'Soda Experience',
    subtitle: 'Immersive beverage ritual',
    category: 'EXPERIMENTAL 3D',
    image: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=900&q=80',
    color: '#fce7f3',
  },
  {
    id: '06',
    title: 'Elastic Lab',
    subtitle: 'Ribbon physics experiments',
    category: 'LAB R&D',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=900&q=80',
    color: '#f3f4f6',
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
          { y: 28, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: subtextRef.current,
              start: 'top 86%',
              end: 'top 66%',
              scrub: 0.5,
            },
          }
        )
      }

      cardsRef.current.forEach((card) => {
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
              start: 'top 90%',
              end: 'top 64%',
              scrub: 0.5,
            },
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
    const rx = (y - cy) / 22
    const ry = (cx - x) / 22

    gsap.to(card, {
      rotateX: -rx,
      rotateY: ry,
      transformPerspective: 1300,
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

  const handleLeave = (index: number) => {
    const card = cardsRef.current[index]
    if (!card) return
    gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1,0.42)' })
    const img = card.querySelector('.card-image') as HTMLElement
    if (img) gsap.to(img, { scale: 1, x: 0, y: 0, duration: 0.8, ease: 'power3.out' })
  }

  return (
    <section ref={sectionRef} className="relative z-10 bg-[#f6f6f8]/75 backdrop-blur-[8px] px-6 md:px-8 lg:px-10 py-20 md:py-28">
      {/* Subtle hint that blue ribbon is behind throughout */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 20% 30%, #2563eb 0%, transparent 50%), radial-gradient(circle at 80% 70%, #2563eb 0%, transparent 50%)`
      }} />
      <div className="max-w-[1600px] mx-auto">
        {/* Headline Bold Ideas, Brought to Life + right column paragraph */}
        <div className="grid lg:grid-cols-[1.15fr_0.85fr] gap-10 md:gap-16 items-end mb-16 md:mb-24">
          <div ref={titleRef}>
            <h2 className="font-black tracking-[-0.055em] leading-[0.82] text-[#0b0b0d]">
              <div className="line overflow-hidden text-[12vw] md:text-[8.5vw] lg:text-[6.8vw]">Bold Ideas,</div>
              <div className="line overflow-hidden text-[12vw] md:text-[8.5vw] lg:text-[6.8vw]">Brought to Life</div>
            </h2>
          </div>

          <div ref={subtextRef} className="lg:pb-3">
            <p className="text-[15px] md:text-[17px] leading-[1.6] tracking-[-0.01em] text-black/60 max-w-[420px]">
              We combine design, motion, 3D, and development to create digital experiences that go beyond the screen. Our team
              crafts bold ideas into interactive realities.
            </p>
          </div>
        </div>

        {/* Clean 2-column project grid with zero debug labels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 perspective-[2000px]">
          {projects.map((p, i) => (
            <div
              key={p.id}
              ref={(el) => {
                cardsRef.current[i] = el
              }}
              onMouseMove={(e) => handleMove(e, i)}
              onMouseLeave={() => handleLeave(i)}
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
                <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="p-6 md:p-7 flex justify-between items-center bg-white">
                <div>
                  <h3 className="text-[18px] md:text-[20px] font-bold tracking-[-0.02em] text-[#0b0b0d] leading-[1.1]">{p.title}</h3>
                  <p className="mt-1 text-[13px] leading-[1.4] text-black/45">{p.subtitle}</p>
                </div>
                <div className="w-9 h-9 rounded-full border border-black/10 flex items-center justify-center text-black/30 group-hover:bg-[#0b0b0d] group-hover:text-white group-hover:border-[#0b0b0d] transition-all duration-300">
                  ↗
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
