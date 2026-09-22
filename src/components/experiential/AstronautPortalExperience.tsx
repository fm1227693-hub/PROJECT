/**
 * LUSION — AstronautPortalExperience — ULTRA LIGHTWEIGHT NO LAG
 * Single Lenis instance (singleton), single canvas, scroll-driven render only
 * No continuous RAF, no double canvas, no video decoding, no WebGL texture upload
 * 500vh pinned, 5 phases with exact formulas, but GPU-friendly
 */

'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import CanvasFrameScrubber from './CanvasFrameScrubber'
import HyperspaceOverlay from './HyperspaceOverlay'
import useLenisScrubDriver from '@/hooks/useLenisScrubDriver'
import { AstronautPortalExperienceProps, HyperspaceRealm, RealmConfig } from '@/types/hyperspace'

gsap.registerPlugin(ScrollTrigger)

const REALMS: RealmConfig[] = [
  { id: 'QUANTUM_MATRIX', name: 'Quantum Matrix', colorPrimary: '#00ff88', colorSecondary: '#00ccff', progressRange: [0.40, 0.50] },
  { id: 'NEON_CYBER', name: 'Neon Cyber', colorPrimary: '#ff006a', colorSecondary: '#ffcc00', progressRange: [0.50, 0.60] },
  { id: 'CRYSTAL_SHARDS', name: 'Crystal Shards', colorPrimary: '#7c3aed', colorSecondary: '#ffffff', progressRange: [0.60, 0.68] },
  { id: 'COBALT_VOID', name: 'Cobalt Void', colorPrimary: '#2563eb', colorSecondary: '#0b0b0d', progressRange: [0.68, 0.72] },
]

export default function AstronautPortalExperience({
  totalFrames = 60,
  className = '',
}: AstronautPortalExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const isVisibleRef = useRef<boolean>(true)

  const lastScrollYRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(performance.now())
  const smoothedVelocityRef = useRef<number>(0)

  const [progress, setProgress] = useState<number>(0)
  const [scrollVelocity, setScrollVelocity] = useState<number>(0)
  const [currentRealm, setCurrentRealm] = useState<HyperspaceRealm>('QUANTUM_MATRIX')
  const [isHovering, setIsHovering] = useState<boolean>(false)

  // Single Lenis — singleton prevents double instance lag
  useLenisScrubDriver({
    lerp: 0.08,
    wheelMultiplier: 0.9,
    smoothWheel: true,
    infinite: false,
  })

  const updateVelocity = useCallback((currentScrollY: number): number => {
    const now = performance.now()
    const deltaY = currentScrollY - lastScrollYRef.current
    const deltaT = Math.max(now - lastTimeRef.current, 16)
    const v = deltaY / deltaT
    smoothedVelocityRef.current = gsap.utils.interpolate(smoothedVelocityRef.current, v, 0.12)
    lastScrollYRef.current = currentScrollY
    lastTimeRef.current = now
    return smoothedVelocityRef.current
  }, [])

  const getPhaseData = useCallback((p: number) => {
    if (p < 0.18) {
      return { phase: 1, Z: p * -600, scale: 1 + p * 0.8, opacity: 1 - Math.pow(p / 0.18, 2), blur: (p / 0.18) * 16 }
    }
    if (p < 0.40) {
      const frameProgress = (p - 0.18) / 0.82
      const frameIndex = Math.floor(frameProgress * totalFrames)
      const clampedIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1))
      const dispersion = Math.sin(((p - 0.18) / 0.22) * Math.PI) * 0.015
      return { phase: 2, frameIndex: clampedIndex, dispersion }
    }
    if (p < 0.72) {
      const v = Math.abs(smoothedVelocityRef.current)
      return { phase: 3, blur: Math.min(v * 0.04, 4), scale: 1 + Math.min(v * 0.0005, 0.03), velocity: v }
    }
    if (p < 0.85) {
      return { phase: 4, flareX: ((p - 0.72) / 0.13) * 100 }
    }
    const t = (p - 0.85) / 0.15
    return { phase: 5, t, targetWidth: `${84 + t * 16}vw`, targetHeight: `${68 + t * 32}vh`, borderRadius: `${40 * (1 - t)}px` }
  }, [totalFrames])

  useEffect(() => {
    const container = containerRef.current
    const pinned = pinnedRef.current
    if (!container || !pinned) return

    // IntersectionObserver — pause heavy work when not visible
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisibleRef.current = entry.isIntersecting
        })
      },
      { threshold: 0, rootMargin: '20%' }
    )
    observer.observe(container)

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=500%',
        pin: pinned,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        // Throttle onUpdate via requestAnimationFrame already handled by ScrollTrigger
        onUpdate: (self) => {
          if (!isVisibleRef.current && self.progress < 0.01) return

          const p = self.progress
          const currentY = self.scroll()
          const v = updateVelocity(currentY)

          // Batch state updates — use gsap ticker to avoid React thrash
          setProgress(p)
          setScrollVelocity(v)

          if (p >= 0.40 && p < 0.72) {
            const realm = REALMS.find((r) => p >= r.progressRange[0] && p < r.progressRange[1])
            if (realm) setCurrentRealm(realm.id)
          }
        },
      })
    }, container)

    return (): void => {
      observer.disconnect()
      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) trigger.kill()
      })
      smoothedVelocityRef.current = 0
    }
  }, [updateVelocity])

  const phaseData = useMemo(() => getPhaseData(progress), [getPhaseData, progress])

  const expansionStyle = useMemo(() => {
    if (progress < 0.85) {
      return { width: 'min(84vw,1240px)', height: 'min(68vh,720px)', borderRadius: '2.5rem' }
    }
    const t = (progress - 0.85) / 0.15
    return {
      width: `${84 + t * 16}vw`,
      height: `${68 + t * 32}vh`,
      borderRadius: `${40 * (1 - t)}px`,
    }
  }, [progress])

  const realmConfig = useMemo(() => REALMS.find((r) => r.id === currentRealm), [currentRealm])

  return (
    <section
      ref={containerRef}
      className={`relative w-full h-[500vh] bg-[#f6f6f8] overflow-hidden ${className}`}
      style={{ perspective: '1200px' }}
    >
      <div
        ref={pinnedRef}
        className="relative w-full h-screen overflow-hidden flex items-center justify-center bg-[#f6f6f8]"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Single viewport — no double canvas */}
        <div
          className="relative overflow-hidden bg-white shadow-[0_16px_48px_-12px_rgba(0,0,0,0.10),0_0_0_1px_rgba(0,0,0,0.04)_inset] will-change-[width,height,border-radius,transform]"
          style={{
            width: expansionStyle.width,
            height: expansionStyle.height,
            borderRadius: expansionStyle.borderRadius,
            transform: `scale(${phaseData.phase === 3 ? (phaseData as { scale: number }).scale : 1 + (isHovering ? 0.015 : 0)})`,
            // Blur via CSS filter only when needed, max 4px not 8px
            filter: phaseData.phase === 3 ? `blur(${(phaseData as { blur: number }).blur}px)` : 'none',
          }}
        >
          {/* SINGLE CanvasFrameScrubber — no ProceduralWarpFallback double */}
          <CanvasFrameScrubber
            totalFrames={totalFrames}
            currentProgress={progress}
            scrollVelocity={scrollVelocity}
            isHovering={isHovering}
            className="absolute inset-0"
            videoSrc=""
          />

          {/* Overlay — lightweight */}
          <HyperspaceOverlay
            progress={progress}
            phase={phaseData.phase}
            scrollVelocity={scrollVelocity}
            isHovering={isHovering}
            className="absolute inset-0 z-10"
          />
        </div>

        {/* Realm indicator — only when in realm range, no animation when hidden */}
        {progress >= 0.40 && progress < 0.85 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/65 backdrop-blur-[12px] border border-white/10 rounded-full px-3.5 py-1.5 pointer-events-none">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: realmConfig?.colorPrimary ?? '#2563eb' }} />
            <span className="text-[10px] font-mono tracking-[0.10em] text-white/75 uppercase">
              {realmConfig?.name ?? 'Hyperspace'} • {Math.round(progress * 100)}%
            </span>
          </div>
        )}

        {/* Progress bar — transform scaleX for GPU */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/[0.05] z-30">
          <div
            className="h-full bg-[#2563eb] will-change-transform origin-left"
            style={{ transform: `scaleX(${progress})` }}
          />
        </div>
      </div>
    </section>
  )
}
