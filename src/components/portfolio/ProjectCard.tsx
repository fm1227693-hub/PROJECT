/**
 * LUSION — ProjectCard
 * Rounded 2rem, 16:10 aspect, looping MP4 / high-res WebGL texture
 * Hover: scale 1.0->1.06 spring, 3D tilt +/-6deg mouse tracking, arrow → translate
 * Lazy loading via IntersectionObserver, 60/120 FPS, no layout thrashing
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Project, ProjectCardProps } from '@/types/project'

export default function ProjectCard({ project, index, onHoverChange }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const arrowRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  // IntersectionObserver lazy loading
  useEffect(() => {
    const el = cardRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            // Autoplay video when in view
            if (videoRef.current && project.media.type === 'video') {
              videoRef.current.play().catch(() => {})
            }
          } else {
            if (videoRef.current) {
              videoRef.current.pause()
            }
          }
        })
      },
      { rootMargin: '200px 0px', threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [project.media.type])

  const handleMouseMove = (e: React.MouseEvent) => {
    const card = cardRef.current
    const media = mediaRef.current
    if (!card || !media) return

    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const cx = rect.width / 2
    const cy = rect.height / 2

    // 3D tilt +/-6deg
    const rotateY = ((x - cx) / cx) * 6
    const rotateX = ((cy - y) / cy) * 6

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1200,
      transformOrigin: 'center center',
      duration: 0.7,
      ease: 'power3.out',
      overwrite: 'auto',
    })

    gsap.to(media, {
      scale: 1.06,
      x: (x - cx) * 0.04,
      y: (y - cy) * 0.04,
      duration: 0.7,
      ease: 'power2.out',
      overwrite: 'auto',
    })

    if (arrowRef.current) {
      gsap.to(arrowRef.current, {
        x: 6,
        duration: 0.4,
        ease: 'power3.out',
      })
    }
  }

  const handleMouseEnter = () => {
    setIsHovering(true)
    onHoverChange?.(true, index)
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { x: 6, duration: 0.4, ease: 'back.out(1.7)' })
    }
  }

  const handleMouseLeave = () => {
    setIsHovering(false)
    onHoverChange?.(false, index)
    const card = cardRef.current
    const media = mediaRef.current
    if (card) {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        duration: 1.1,
        ease: 'elastic.out(1, 0.42)',
        overwrite: 'auto',
      })
    }
    if (media) {
      gsap.to(media, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        overwrite: 'auto',
      })
    }
    if (arrowRef.current) {
      gsap.to(arrowRef.current, { x: 0, duration: 0.5, ease: 'power3.out' })
    }
  }

  return (
    <div
      ref={cardRef}
      className="group relative will-change-transform cursor-pointer"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Card container rounded 2rem */}
      <div className="relative rounded-[2rem] overflow-hidden bg-white border border-black/[0.06] shadow-[0_8px_32px_rgba(0,0,0,0.06)] group-hover:shadow-[0_16px_48px_rgba(0,0,0,0.12)] transition-shadow duration-500">
        {/* Media 16:10 */}
        <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f5f7]">
          <div
            ref={mediaRef}
            className="absolute inset-0 will-change-transform"
            style={{ transformOrigin: 'center center' }}
          >
            {project.media.type === 'video' && isInView ? (
              <video
                ref={videoRef}
                className="absolute inset-0 w-full h-full object-cover"
                loop
                muted
                playsInline
                preload="metadata"
                poster={project.media.poster}
              >
                <source src={project.media.src} type="video/mp4" />
              </video>
            ) : (
              <div
                className="absolute inset-0 w-full h-full"
                style={{
                  backgroundColor: project.color,
                  backgroundImage: `url(${project.media.src})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            )}

            {/* Hover gradient */}
            <div
              className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent transition-opacity duration-500"
              style={{ opacity: isHovering ? 1 : 0 }}
            />

            {/* Liquid glass highlight on hover */}
            <div
              className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
              style={{
                opacity: isHovering ? 1 : 0,
                background: `radial-gradient(500px circle at 50% 50%, rgba(255,255,255,0.18), transparent 70%)`,
              }}
            />
          </div>

          {/* Top left category pill */}
          <div className="absolute top-4 left-4 z-10">
            <div className="bg-white/85 backdrop-blur-[12px] border border-black/10 rounded-full px-3 py-1.5 text-[10px] font-mono tracking-[0.12em] text-black/60">
              {project.category}
            </div>
          </div>

          {/* Bottom right play indicator for video */}
          {project.media.type === 'video' && (
            <div className="absolute bottom-4 right-4 z-10 w-8 h-8 rounded-full bg-white/90 backdrop-blur-[8px] border border-black/10 flex items-center justify-center text-[10px] text-black/60 group-hover:bg-black group-hover:text-white transition-all duration-300">
              ▶
            </div>
          )}
        </div>

        {/* Metadata below card */}
        <div className="p-6 md:p-7 bg-white">
          {/* Micro-meta monospace uppercase */}
          <div className="flex items-center gap-2 mb-3 overflow-hidden">
            <div className="text-[11px] font-mono tracking-[0.14em] text-black/35 uppercase whitespace-nowrap">
              {project.tags.join(' • ')}
            </div>
            {project.year && (
              <>
                <span className="w-[3px] h-[3px] rounded-full bg-black/20" />
                <span className="text-[11px] font-mono tracking-[0.12em] text-black/30">{project.year}</span>
              </>
            )}
          </div>

          {/* Title bold grotesque + arrow */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-[20px] md:text-[22px] font-bold tracking-[-0.02em] leading-[1.1] text-[#0b0b0d] group-hover:tracking-[-0.01em] transition-all duration-300">
                {project.title}
              </h3>
              {project.subtitle && (
                <p className="mt-1.5 text-[13.5px] leading-[1.45] tracking-[-0.01em] text-black/45 max-w-[90%]">
                  {project.subtitle}
                </p>
              )}
            </div>

            <div
              ref={arrowRef}
              className="w-10 h-10 rounded-full border border-black/10 bg-white flex items-center justify-center text-black/40 group-hover:bg-[#0b0b0d] group-hover:text-white group-hover:border-[#0b0b0d] group-hover:scale-[1.05] transition-all duration-300 will-change-transform shrink-0 mt-1"
            >
              <span className="text-[16px]">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Hover glow */}
      <div
        className="absolute -inset-3 rounded-[2.2rem] bg-[#2563eb]/0 group-hover:bg-[#2563eb]/[0.04] blur-[20px] -z-10 transition-all duration-700 pointer-events-none"
        style={{ opacity: isHovering ? 1 : 0 }}
      />
    </div>
  )
}
