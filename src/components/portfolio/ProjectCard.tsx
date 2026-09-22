/**
 * LUSION — ProjectCard — Clean Featured Work style (2nd image)
 * Rounded 2rem, aspect ~4:3, no top pill, tags below image, title bold
 * Hover: scale 1.0->1.06, no messy overlay, clean light #f7f7f9
 */

'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Project, ProjectCardProps } from '@/types/project'

export default function ProjectCard({ project, index, onHoverChange }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const mediaRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            if (videoRef.current && project.media.type === 'video') {
              videoRef.current.play().catch(() => {})
            }
          } else {
            videoRef.current?.pause()
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
    const rotateY = ((x - cx) / cx) * 4
    const rotateX = ((cy - y) / cy) * 4

    gsap.to(card, {
      rotateX,
      rotateY,
      transformPerspective: 1200,
      duration: 0.6,
      ease: 'power3.out',
      overwrite: 'auto',
    })
    gsap.to(media, {
      scale: 1.06,
      x: (x - cx) * 0.03,
      y: (y - cy) * 0.03,
      duration: 0.6,
      ease: 'power2.out',
      overwrite: 'auto',
    })
  }

  const handleEnter = () => {
    setIsHovering(true)
    onHoverChange?.(true, index)
  }
  const handleLeave = () => {
    setIsHovering(false)
    onHoverChange?.(false, index)
    const card = cardRef.current
    const media = mediaRef.current
    if (card) gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: 'elastic.out(1,0.42)', overwrite: 'auto' })
    if (media) gsap.to(media, { scale: 1, x: 0, y: 0, duration: 0.7, ease: 'power3.out', overwrite: 'auto' })
  }

  return (
    <div
      ref={cardRef}
      className="group relative will-change-transform cursor-pointer"
      style={{ transformStyle: 'preserve-3d' }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {/* Image card — clean, no top pill, rounded 2rem like Lusion Featured Work */}
      <div className="relative rounded-[1.6rem] overflow-hidden bg-[#f5f5f7] border border-black/[0.06] shadow-[0_4px_24px_rgba(0,0,0,0.04)] group-hover:shadow-[0_12px_40px_rgba(0,0,0,0.10)] transition-all duration-500">
        <div className="relative aspect-[4/3] overflow-hidden">
          <div ref={mediaRef} className="absolute inset-0 will-change-transform">
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
            <div
              className="absolute inset-0 bg-black/0 group-hover:bg-black/[0.04] transition-colors duration-500"
            />
          </div>
        </div>
      </div>

      {/* Below image — tags + title like 2nd screenshot */}
      <div className="mt-4 px-1">
        <div className="text-[11px] font-mono tracking-[0.12em] text-black/40 uppercase leading-[1.4]">
          {project.tags.join(' • ')} {project.year ? `• ${project.year}` : ''}
        </div>
        <h3 className="mt-2 text-[20px] md:text-[22px] font-bold tracking-[-0.02em] leading-[1.15] text-[#0b0b0d] group-hover:tracking-[-0.01em] transition-all duration-300">
          {project.title}
        </h3>
        {project.subtitle && (
          <p className="mt-1 text-[13.5px] leading-[1.5] text-black/45 line-clamp-2">
            {project.subtitle}
          </p>
        )}
      </div>
    </div>
  )
}
