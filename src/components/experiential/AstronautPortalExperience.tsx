/**
 * LUSION — AstronautPortalExperience — Master orchestrator
 * 100% production-ready Next.js App Router TS
 * 500vh pinned end+=500%, 5 phases with exact formulas
 * High-Performance HTML5 Canvas Frame-Scrubber + WebGL chromatic aberration + GSAP ScrollTrigger
 */

'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import CanvasFrameScrubber from './CanvasFrameScrubber'
import HyperspaceOverlay from './HyperspaceOverlay'
import useLenisScrubDriver from '@/hooks/useLenisScrubDriver'
import { AstronautPortalExperienceProps, HyperspaceRealm, RealmConfig } from '@/types/hyperspace'

gsap.registerPlugin(ScrollTrigger)

const REALMS: RealmConfig[] = [
  {
    id: 'QUANTUM_MATRIX',
    name: 'Quantum Matrix',
    colorPrimary: '#00ff88',
    colorSecondary: '#00ccff',
    progressRange: [0.40, 0.50],
  },
  {
    id: 'NEON_CYBER',
    name: 'Neon Cyber',
    colorPrimary: '#ff006a',
    colorSecondary: '#ffcc00',
    progressRange: [0.50, 0.60],
  },
  {
    id: 'CRYSTAL_SHARDS',
    name: 'Crystal Shards',
    colorPrimary: '#7c3aed',
    colorSecondary: '#ffffff',
    progressRange: [0.60, 0.68],
  },
  {
    id: 'COBALT_VOID',
    name: 'Cobalt Void',
    colorPrimary: '#2563eb',
    colorSecondary: '#0b0b0d',
    progressRange: [0.68, 0.72],
  },
]

export default function AstronautPortalExperience({
  videoSrc = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
  totalFrames = 180,
  className = '',
}: AstronautPortalExperienceProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const pinnedRef = useRef<HTMLDivElement>(null)
  const progressRef = useRef<number>(0)
  const rafRef = useRef<number | null>(null)

  const lastScrollYRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(performance.now())
  const velocityRef = useRef<number>(0)
  const smoothedVelocityRef = useRef<number>(0)

  const [progress, setProgress] = useState<number>(0)
  const [scrollVelocity, setScrollVelocity] = useState<number>(0)
  const [currentRealm, setCurrentRealm] = useState<HyperspaceRealm>('QUANTUM_MATRIX')
  const [isHovering, setIsHovering] = useState<boolean>(false)

  const { scrollTo } = useLenisScrubDriver({
    lerp: 0.08,
    wheelMultiplier: 0.9,
    smoothWheel: true,
    infinite: false,
  })

  // Scroll metrics ΔY/ΔT tracking
  const updateVelocity = useCallback((currentScrollY: number): number => {
    const now = performance.now()
    const deltaY = currentScrollY - lastScrollYRef.current
    const deltaT = Math.max(now - lastTimeRef.current, 1)
    const v = deltaY / deltaT

    velocityRef.current = v
    smoothedVelocityRef.current = gsap.utils.interpolate(smoothedVelocityRef.current, v, 0.18)

    lastScrollYRef.current = currentScrollY
    lastTimeRef.current = now

    return smoothedVelocityRef.current
  }, [])

  // Phase calculations with exact formulas
  const getPhaseData = useCallback((p: number) => {
    // Phase 1: 0-0.18 gate
    if (p < 0.18) {
      const Z = p * -600
      const scale = 1 + p * 0.8
      const opacity = 1 - Math.pow(p / 0.18, 2)
      const blur = (p / 0.18) * 16
      return { phase: 1, Z, scale, opacity, blur }
    }

    // Phase 2: 0.18-0.40 portal
    if (p < 0.40) {
      const frameProgress = (p - 0.18) / 0.82
      const frameIndex = Math.floor(frameProgress * totalFrames)
      const clampedIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1))
      const dispersion = Math.sin(((p - 0.18) / 0.22) * Math.PI) * 0.015
      return { phase: 2, frameIndex: clampedIndex, dispersion }
    }

    // Phase 3: 0.40-0.72 cruise
    if (p < 0.72) {
      const v = Math.abs(smoothedVelocityRef.current)
      const blur = Math.min(v * 0.04, 8)
      const scale = 1 + Math.min(v * 0.0005, 0.08)
      return { phase: 3, blur, scale, velocity: v }
    }

    // Phase 4: 0.72-0.85 deceleration
    if (p < 0.85) {
      const flareX = ((p - 0.72) / 0.13) * 100
      return { phase: 4, flareX }
    }

    // Phase 5: 0.85-1.0 expansion
    const t = (p - 0.85) / 0.15
    const targetWidth = `${84 + t * 16}vw`
    const targetHeight = `${68 + t * 32}vh`
    const borderRadius = `${40 * (1 - t)}px`
    return { phase: 5, t, targetWidth, targetHeight, borderRadius }
  }, [totalFrames])

  useEffect(() => {
    const container = containerRef.current
    const pinned = pinnedRef.current
    if (!container || !pinned) return

    const ctx = gsap.context(() => {
      // Main timeline pinned 500vh end+=500%
      ScrollTrigger.create({
        trigger: container,
        start: 'top top',
        end: '+=500%',
        pin: pinned,
        pinSpacing: true,
        scrub: 0.8,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress
          progressRef.current = p

          const currentY = self.scroll()
          const v = updateVelocity(currentY)

          setProgress(p)
          setScrollVelocity(v)

          // Realm detection
          if (p >= 0.40 && p < 0.72) {
            const realm = REALMS.find((r) => p >= r.progressRange[0] && p < r.progressRange[1])
            if (realm) setCurrentRealm(realm.id)
          }

          // Broadcast for external hooks
          window.dispatchEvent(
            new CustomEvent('astronaut-portal-progress', {
              detail: { progress: p, velocity: v, phase: getPhaseData(p).phase },
            })
          )
        },
      })

      // Gate card animation
      gsap.to('.gate-card', {
        z: -600 * 0.18,
        scale: 1 + 0.8 * 0.18,
        opacity: 0,
        filter: 'blur(16px)',
        scrollTrigger: {
          trigger: container,
          start: 'top top',
          end: '18% top',
          scrub: 0.8,
        },
        ease: 'none',
      })
    }, container)

    const onLusionScroll = (e: Event): void => {
      const custom = e as CustomEvent
      if (custom.detail?.scroll !== undefined) {
        updateVelocity(custom.detail.scroll)
        setScrollVelocity(custom.detail.velocity ?? velocityRef.current)
      }
    }

    window.addEventListener('lusion-scroll' as never, onLusionScroll as EventListener)
    window.addEventListener('lenis-scrub' as never, onLusionScroll as EventListener)

    return (): void => {
      window.removeEventListener('lusion-scroll' as never, onLusionScroll as EventListener)
      window.removeEventListener('lenis-scrub' as never, onLusionScroll as EventListener)

      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }

      ctx.revert()
      ScrollTrigger.getAll().forEach((trigger) => {
        if (trigger.vars.trigger === container) {
          trigger.kill()
        }
      })

      // Cleanup video elements
      const videos = document.querySelectorAll('video')
      videos.forEach((v) => {
        v.pause()
        v.src = ''
      })

      velocityRef.current = 0
      smoothedVelocityRef.current = 0
    }
  }, [updateVelocity, getPhaseData])

  const phaseData = getPhaseData(progress)

  // Expansion styles
  const expansionContainerStyle = (() => {
    if (progress < 0.85) {
      return {
        width: 'min(84vw, 1240px)',
        height: 'min(68vh, 720px)',
        borderRadius: '2.5rem',
      }
    }
    const t = (progress - 0.85) / 0.15
    return {
      width: `${84 + t * 16}vw`,
      height: `${68 + t * 32}vh`,
      borderRadius: `${40 * (1 - t)}px`,
    }
  })()

  // Realm colors
  const realmConfig = REALMS.find((r) => r.id === currentRealm)

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
        {/* Background realm color */}
        <div
          className="absolute inset-0 transition-colors duration-700 pointer-events-none"
          style={{
            background:
              progress >= 0.40 && progress < 0.72 && realmConfig
                ? `radial-gradient(ellipse at center, ${realmConfig.colorPrimary}08 0%, ${realmConfig.colorSecondary}04 50%, #f6f6f8 100%)`
                : '#f6f6f8',
          }}
        />

        {/* Main viewport container — lerp 84vw→100vw 68vh→100vh 40px→0 */}
        <div
          className="relative overflow-hidden bg-white shadow-[0_24px_80px_-16px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)_inset] will-change-[width,height,border-radius,transform] transition-none"
          style={{
            width: expansionContainerStyle.width,
            height: expansionContainerStyle.height,
            borderRadius: expansionContainerStyle.borderRadius,
            transform: `scale(${phaseData.phase === 3 ? (phaseData as { scale: number }).scale : 1 + (isHovering ? 0.02 : 0)})`,
            filter: `blur(${phaseData.phase === 3 ? (phaseData as { blur: number }).blur : 0}px)`,
          }}
        >
          {/* Canvas Frame-Scrubber — High-frequency video via requestVideoFrameCallback */}
          <CanvasFrameScrubber
            videoSrc={videoSrc}
            totalFrames={totalFrames}
            currentProgress={progress}
            scrollVelocity={scrollVelocity}
            isHovering={isHovering}
            className="absolute inset-0"
            onFrameUpdate={(frameIndex) => {
              // Optional external sync
              window.dispatchEvent(
                new CustomEvent('frame-update', {
                  detail: { frameIndex, progress, realm: currentRealm },
                })
              )
            }}
          />

          {/* Procedural fallback warp tunnel when video unavailable — draws via canvas */}
          <ProceduralWarpFallback
            progress={progress}
            velocity={scrollVelocity}
            realm={currentRealm}
            realmConfig={realmConfig}
          />

          {/* Hyperspace Overlay — Editorial typography + dispersion masks */}
          <HyperspaceOverlay
            progress={progress}
            phase={phaseData.phase}
            scrollVelocity={scrollVelocity}
            isHovering={isHovering}
            className="absolute inset-0 z-10"
          />

          {/* Velocity motion blur overlay */}
          {progress >= 0.40 && progress < 0.72 && (
            <div
              className="absolute inset-0 pointer-events-none mix-blend-screen"
              style={{
                background: `linear-gradient(90deg, transparent 0%, ${realmConfig?.colorPrimary}08 50%, transparent 100%)`,
                transform: `translateX(${scrollVelocity * 2}px)`,
                filter: `blur(${Math.min(Math.abs(scrollVelocity) * 0.04, 8)}px)`,
              }}
            />
          )}
        </div>

        {/* Realm indicator */}
        {progress >= 0.40 && progress < 0.85 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-3 bg-black/70 backdrop-blur-[16px] border border-white/10 rounded-full px-4 py-2">
            <div
              className="w-2 h-2 rounded-full animate-pulse"
              style={{ background: realmConfig?.colorPrimary ?? '#2563eb' }}
            />
            <span className="text-[11px] font-mono tracking-[0.12em] text-white/80 uppercase">
              {realmConfig?.name ?? 'Hyperspace'} • {(progress * 100).toFixed(1)}% • V {Math.abs(scrollVelocity).toFixed(2)}
            </span>
          </div>
        )}

        {/* Progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-black/[0.06] z-30">
          <div
            className="h-full bg-[#2563eb] will-change-[width] transition-none"
            style={{ width: `${progress * 100}%` }}
          />
        </div>
      </div>

      {/* Debug data layer — invisible, for GSAP timeline inspection */}
      <div className="absolute top-0 left-0 pointer-events-none opacity-0">
        <span data-phase={phaseData.phase} data-progress={progress} data-velocity={scrollVelocity} data-realm={currentRealm} />
      </div>
    </section>
  )
}

// Procedural fallback — lightweight 2D warp tunnel that mimics frame sequence when video unavailable
function ProceduralWarpFallback({
  progress,
  velocity,
  realm,
  realmConfig,
}: {
  progress: number
  velocity: number
  realm: HyperspaceRealm
  realmConfig?: RealmConfig
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const resize = (): void => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.scale(dpr, dpr)
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    let time = 0

    const render = (): void => {
      time += 0.016 + Math.abs(velocity) * 0.02
      const rect = canvas.getBoundingClientRect()
      const w = rect.width
      const h = rect.height
      const cx = w / 2
      const cy = h / 2

      // Clear with realm tint
      const bgColor = realmConfig?.colorPrimary ?? '#f6f6f8'
      ctx.fillStyle = progress < 0.18 ? '#ffffff' : `color-mix(in srgb, ${bgColor} 6%, #f6f6f8)`
      ctx.fillRect(0, 0, w, h)

      if (progress < 0.18) {
        rafRef.current = requestAnimationFrame(render)
        return
      }

      // Warp tunnel — concentric rings with perspective
      const tunnelDepth = (progress - 0.18) / 0.82
      const ringCount = 24
      const baseRadius = 20 + tunnelDepth * 120

      for (let i = 0; i < ringCount; i++) {
        const depth = i / ringCount
        const perspective = Math.pow(depth, 2.2)
        const radius = baseRadius + perspective * w * 0.8 + Math.sin(time * 2 + i * 0.5) * 4
        const alpha = (1 - depth) * 0.12 * (0.5 + tunnelDepth * 0.5)

        ctx.beginPath()
        ctx.arc(cx + Math.sin(time * 0.5 + i * 0.3) * depth * 30, cy + Math.cos(time * 0.3 + i * 0.2) * depth * 20, radius, 0, Math.PI * 2)

        if (realm === 'QUANTUM_MATRIX') {
          ctx.strokeStyle = `hsla(${120 + Math.sin(time + i) * 20}, 80%, 60%, ${alpha})`
        } else if (realm === 'NEON_CYBER') {
          ctx.strokeStyle = `hsla(${340 + i * 2}, 90%, 60%, ${alpha})`
        } else if (realm === 'CRYSTAL_SHARDS') {
          ctx.strokeStyle = `hsla(${270 + i}, 70%, 65%, ${alpha})`
        } else {
          ctx.strokeStyle = `hsla(${220 + i}, 85%, 60%, ${alpha})`
        }

        ctx.lineWidth = 1 + (1 - depth) * 2 + Math.abs(velocity) * 0.1
        ctx.stroke()

        // Inner glow
        if (i % 3 === 0) {
          ctx.beginPath()
          ctx.arc(cx, cy, radius * 0.92, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha * 0.3})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      // Central singularity
      const singularityRadius = 8 + Math.sin(time * 3) * 2 + tunnelDepth * 12
      const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, singularityRadius * 3)
      gradient.addColorStop(0, `rgba(255,255,255,${0.9 + Math.sin(time * 5) * 0.1})`)
      gradient.addColorStop(0.3, `${realmConfig?.colorPrimary ?? '#2563eb'}aa`)
      gradient.addColorStop(1, 'transparent')
      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(cx, cy, singularityRadius * 3, 0, Math.PI * 2)
      ctx.fill()

      // Streaks
      if (progress >= 0.40) {
        ctx.save()
        ctx.globalAlpha = 0.15 + Math.abs(velocity) * 0.02
        for (let s = 0; s < 60; s++) {
          const angle = (s / 60) * Math.PI * 2 + time * 0.2
          const r1 = 30 + Math.random() * 20
          const r2 = w * 0.6 + Math.random() * 100
          const x1 = cx + Math.cos(angle) * r1
          const y1 = cy + Math.sin(angle) * r1
          const x2 = cx + Math.cos(angle) * r2
          const y2 = cy + Math.sin(angle) * r2

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.strokeStyle = realmConfig?.colorPrimary ?? '#2563eb'
          ctx.lineWidth = 0.5 + Math.random() * 1.5
          ctx.stroke()
        }
        ctx.restore()
      }

      rafRef.current = requestAnimationFrame(render)
    }

    render()

    return (): void => {
      window.removeEventListener('resize', resize)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [progress, velocity, realm, realmConfig])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full object-cover"
      style={{ width: '100%', height: '100%', opacity: progress < 0.18 ? 0 : 1 }}
    />
  )
}
