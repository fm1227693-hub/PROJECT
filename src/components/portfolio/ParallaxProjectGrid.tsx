/**
 * LUSION — ParallaxProjectGrid
 * 2-column responsive grid with asynchronous parallax: left y:0, right yPercent -15 to -25 scrubbed via ScrollTrigger
 * Lenis lerp 0.075, smooth inertia, intersection-observer lazy loading, 60/120 FPS
 * Interstitial EditorialBreak mid-way with color-shifting spline
 */

'use client'

import { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from './ProjectCard'
import EditorialBreak from '../dom/EditorialBreak'
import { Project, ParallaxProjectGridProps } from '@/types/project'

gsap.registerPlugin(ScrollTrigger)

const defaultProjects: Project[] = [
  {
    id: '01',
    title: 'Devin AI',
    subtitle: 'Autonomous software engineer laptop experience',
    category: 'AI PRODUCT',
    tags: ['WEB', 'DESIGN', 'DEVELOPMENT', '3D'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
      alt: 'Devin AI laptop',
    },
    color: '#eef2ff',
    year: '2024',
    featured: true,
  },
  {
    id: '02',
    title: 'Of The Oak',
    subtitle: 'Ethereal ancient tree data visualization',
    category: 'DATA VIZ',
    tags: ['WEB', 'DC7RA'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
      alt: 'Ancient tree',
    },
    color: '#dcfce7',
    year: '2024',
  },
  {
    id: '03',
    title: 'Spaaace - NFT Marketplace',
    subtitle: 'Cosmic collectibles universe with 3D typography',
    category: 'WEB3 MOTION',
    tags: ['WEB', 'DESIGN', '3D', 'MOTION'],
    media: {
      type: 'video',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      poster: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&q=80',
      alt: 'Space NFT',
    },
    color: '#dbeafe',
    year: '2024',
  },
  {
    id: '04',
    title: 'Digital Design Days Fall 2024',
    subtitle: 'Domain-Driven Design conference identity',
    category: 'EVENT BRANDING',
    tags: ['BRANDING', 'EVENT', '2024'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=1200&q=80',
      alt: 'DDD 2024',
    },
    color: '#fef3c7',
    year: '2024',
  },
  {
    id: '05',
    title: 'Soda Experience',
    subtitle: 'Immersive beverage ritual with particle hills',
    category: 'EXPERIMENTAL 3D',
    tags: ['WEB', '3D', 'EXPERIMENTAL'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=1200&q=80',
      alt: 'Soda',
    },
    color: '#fce7f3',
    year: '2023',
  },
  {
    id: '06',
    title: 'Elastic Lab',
    subtitle: 'Ribbon physics experiments and VR headsets',
    category: 'LAB R&D',
    tags: ['LAB', 'R&D', 'PHYSICS'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=1200&q=80',
      alt: 'Elastic Lab',
    },
    color: '#f3f4f6',
    year: '2024',
  },
  {
    id: '07',
    title: 'Neon Drift',
    subtitle: 'Cybernetic visuals and colorful particle hills',
    category: 'WEB • DESIGN • DEVELOPMENT • 3D',
    tags: ['WEB', 'DESIGN', 'DEVELOPMENT', '3D'],
    media: {
      type: 'video',
      src: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
      poster: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
      alt: 'Neon Drift',
    },
    color: '#ede9fe',
    year: '2024',
  },
  {
    id: '08',
    title: 'Floral Bloom',
    subtitle: 'Blooming arrangements and organic fluid simulations',
    category: 'EXPERIMENTAL 3D',
    tags: ['WEB', 'FLORAL', '3D'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=1200&q=80',
      alt: 'Floral',
    },
    color: '#fce7f3',
    year: '2024',
  },
]

export default function ParallaxProjectGrid({ projects = defaultProjects, className = '' }: ParallaxProjectGridProps) {
  const sectionRef = useRef<HTMLElement>(null)
  const leftColRef = useRef<HTMLDivElement>(null)
  const rightColRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)

  const { leftProjects, rightProjects } = useMemo(() => {
    const left: Project[] = []
    const right: Project[] = []
    projects.forEach((p, i) => {
      if (i % 2 === 0) left.push(p)
      else right.push(p)
    })
    return { leftProjects: left, rightProjects: right }
  }, [projects])

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Dual-column asynchronous parallax
      if (leftColRef.current && rightColRef.current) {
        // Left column standard speed y:0
        gsap.fromTo(
          leftColRef.current,
          { y: 0 },
          {
            y: 0,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.6,
            },
          }
        )

        // Right column trailing momentum yPercent -15 to -25
        gsap.fromTo(
          rightColRef.current,
          { yPercent: 0 },
          {
            yPercent: -18,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        )

        // Extra depth: right column items stagger slightly more
        const rightCards = rightColRef.current.querySelectorAll('.project-card')
        rightCards.forEach((card, i) => {
          gsap.fromTo(
            card,
            { y: 60 + i * 8, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                end: 'top 58%',
                scrub: 0.6,
              },
            }
          )
        })

        const leftCards = leftColRef.current.querySelectorAll('.project-card')
        leftCards.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 50, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 1,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 90%',
                end: 'top 60%',
                scrub: 0.5,
              },
            }
          )
        })
      }

      // Heading parallax
      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 0.7,
            },
          }
        )
      }
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={sectionRef}
      className={`relative z-10 bg-[#f7f7f9] px-6 md:px-8 lg:px-10 py-16 md:py-24 ${className}`}
    >
      <div className="max-w-[1600px] mx-auto">
        {/* Intro heading */}
        <div ref={headingRef} className="mb-16 md:mb-24 grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-end">
          <h2 className="font-black tracking-[-0.055em] leading-[0.85] text-[#0b0b0d] text-[11vw] md:text-[7.5vw] lg:text-[5.8vw]">
            Selected
            <br />
            Works
          </h2>
          <p className="text-[15px] md:text-[17px] leading-[1.6] tracking-[-0.01em] text-black/50 max-w-[420px] lg:pb-3">
            Dual-column asynchronous parallax grid. Left column standard speed, right column trailing momentum
            yPercent -18 scrubbed via ScrollTrigger. Lenis lerp 0.075 smooth inertia.
          </p>
        </div>

        {/* 2-column grid with independent parallax */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start">
          {/* Left column y:0 */}
          <div ref={leftColRef} className="flex flex-col gap-6 md:gap-8 lg:gap-10 will-change-transform">
            {leftProjects.map((project, i) => (
              <div key={project.id} className="project-card will-change-transform">
                <ProjectCard project={project} index={i * 2} />
              </div>
            ))}
          </div>

          {/* Right column yPercent -18 trailing */}
          <div ref={rightColRef} className="flex flex-col gap-6 md:gap-8 lg:gap-10 will-change-transform md:mt-16 lg:mt-24">
            {rightProjects.map((project, i) => (
              <div key={project.id} className="project-card will-change-transform">
                <ProjectCard project={project} index={i * 2 + 1} />
              </div>
            ))}
          </div>
        </div>

        {/* Interstitial Editorial Break mid-way */}
        <div className="mt-24 md:mt-32">
          <EditorialBreak />
        </div>

        {/* Second half of projects after editorial break for continuous feed */}
        <div className="mt-16 md:mt-24 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 lg:gap-10 items-start">
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10">
            {leftProjects.slice(0, 2).map((project, i) => (
              <div key={`second-left-${project.id}`} className="project-card">
                <ProjectCard project={{ ...project, id: `${project.id}-second` }} index={i} />
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-6 md:gap-8 lg:gap-10 md:mt-16">
            {rightProjects.slice(0, 2).map((project, i) => (
              <div key={`second-right-${project.id}`} className="project-card">
                <ProjectCard project={{ ...project, id: `${project.id}-second` }} index={i} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
