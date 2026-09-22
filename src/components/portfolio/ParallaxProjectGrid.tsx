/**
 * LUSION — ParallaxProjectGrid — Clean Featured Work (2nd image)
 * 2-column, no messy blue spline overlapping, clean light #f7f7f9
 * Left y:0, right yPercent -18 trailing, Lenis lerp 0.075
 */

'use client'

import { useEffect, useRef, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import ProjectCard from './ProjectCard'
import { Project, ParallaxProjectGridProps } from '@/types/project'

gsap.registerPlugin(ScrollTrigger)

const defaultProjects: Project[] = [
  {
    id: '01',
    title: 'Oryza AI',
    subtitle: 'Autonomous software engineer workspace',
    category: 'CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION',
    tags: ['CONCEPT', 'WEB', 'DESIGN', 'DEVELOPMENT', '3D', 'ANIMATION'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
      alt: 'Oryza AI',
    },
    color: '#eef2ff',
    year: '2024',
  },
  {
    id: '02',
    title: 'Atlas Motion',
    subtitle: 'Immersive cloud visualization platform',
    category: 'CONCEPT • WEB • DESIGN • DEVELOPMENT • 3D • ANIMATION',
    tags: ['CONCEPT', 'WEB', 'DESIGN', 'DEVELOPMENT', '3D', 'ANIMATION'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=1200&q=80',
      alt: 'Atlas Motion',
    },
    color: '#dbeafe',
    year: '2024',
  },
  {
    id: '03',
    title: 'Neon Drift',
    subtitle: 'Cybernetic visuals and colorful particle hills',
    category: 'WEB • DESIGN • DEVELOPMENT • 3D',
    tags: ['WEB', 'DESIGN', 'DEVELOPMENT', '3D'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200&q=80',
      alt: 'Neon Drift',
    },
    color: '#ede9fe',
    year: '2024',
  },
  {
    id: '04',
    title: 'Of The Oak',
    subtitle: 'Ethereal ancient tree data visualization',
    category: 'WEB • DC7RA',
    tags: ['WEB', 'DC7RA'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200&q=80',
      alt: 'Of The Oak',
    },
    color: '#dcfce7',
    year: '2024',
  },
  {
    id: '05',
    title: 'Devin AI',
    subtitle: 'Autonomous software engineer laptop experience',
    category: 'WEB • DESIGN • DEVELOPMENT • 3D',
    tags: ['WEB', 'DESIGN', 'DEVELOPMENT', '3D'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200&q=80',
      alt: 'Devin AI',
    },
    color: '#eef2ff',
    year: '2024',
  },
  {
    id: '06',
    title: 'Spaaace - NFT Marketplace',
    subtitle: 'Cosmic collectibles universe',
    category: 'WEB • DESIGN • 3D • MOTION',
    tags: ['WEB', 'DESIGN', '3D', 'MOTION'],
    media: {
      type: 'image',
      src: 'https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=1200&q=80',
      alt: 'Spaaace',
    },
    color: '#fef3c7',
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
      if (leftColRef.current && rightColRef.current) {
        gsap.fromTo(
          rightColRef.current,
          { yPercent: 0 },
          {
            yPercent: -14,
            ease: 'none',
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top bottom',
              end: 'bottom top',
              scrub: 0.9,
            },
          }
        )

        const allCards = sectionRef.current?.querySelectorAll('.project-card')
        allCards?.forEach((card) => {
          gsap.fromTo(
            card,
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.9,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 92%',
                end: 'top 62%',
                scrub: 0.5,
              },
            }
          )
        })
      }

      if (headingRef.current) {
        gsap.fromTo(
          headingRef.current,
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: headingRef.current,
              start: 'top 85%',
              end: 'top 55%',
              scrub: 0.6,
            },
          }
        )
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} className={`relative z-10 bg-[#f7f7f9] px-6 md:px-8 lg:px-10 py-16 md:py-24 ${className}`}>
      <div className="max-w-[1600px] mx-auto">
        {/* Featured Work heading — exact 2nd image */}
        <div ref={headingRef} className="mb-12 md:mb-20 flex flex-col lg:flex-row justify-between gap-6 lg:gap-12 items-start">
          <h2 className="font-black tracking-[-0.06em] leading-[0.85] text-[#0b0b0d] text-[12vw] md:text-[9vw] lg:text-[6.5vw]">
            Featured Work
          </h2>
          <div className="lg:max-w-[320px] lg:text-right lg:pt-3">
            <p className="text-[11px] md:text-[12px] font-mono leading-[1.6] tracking-[0.02em] text-black/50 uppercase">
              A selection of immersive digital experiences created for ambitious brands and forward thinking teams.
            </p>
          </div>
        </div>

        {/* Clean 2-col grid — no messy blue spline overlapping */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10 lg:gap-12 items-start">
          <div ref={leftColRef} className="flex flex-col gap-10 md:gap-14 will-change-transform">
            {leftProjects.map((project, i) => (
              <div key={project.id} className="project-card will-change-transform">
                <ProjectCard project={project} index={i * 2} />
              </div>
            ))}
          </div>

          <div ref={rightColRef} className="flex flex-col gap-10 md:gap-14 will-change-transform md:mt-20">
            {rightProjects.map((project, i) => (
              <div key={project.id} className="project-card will-change-transform">
                <ProjectCard project={project} index={i * 2 + 1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
