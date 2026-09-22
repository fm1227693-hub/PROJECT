/**
 * LUSION — HyperspaceOverlay — Editorial typography + dispersion masks + light leaks
 * Glass morphism, chromatic typography, radial masks
 */

'use client'

import { useMemo } from 'react'
import { HyperspaceOverlayProps } from '@/types/hyperspace'

export default function HyperspaceOverlay({
  progress,
  scrollVelocity,
  isHovering = false,
  className = '',
}: HyperspaceOverlayProps) {
  const phase = useMemo(() => {
    if (progress < 0.18) return 'gate'
    if (progress < 0.40) return 'portal'
    if (progress < 0.72) return 'cruise'
    if (progress < 0.85) return 'deceleration'
    return 'expansion'
  }, [progress])

  // Phase 1 typography transforms
  const gateStyle = useMemo(() => {
    if (progress >= 0.18) return { opacity: 0, pointerEvents: 'none' as const }

    const p = progress
    const zDepth = p * -600
    const scale = 1 + p * 0.8
    const opacity = 1 - Math.pow(p / 0.18, 2)
    const blur = (p / 0.18) * 16

    return {
      transform: `translate3d(0,0,${zDepth}px) scale(${scale})`,
      opacity,
      filter: `blur(${blur}px)`,
      willChange: 'transform, opacity, filter',
    }
  }, [progress])

  // Phase 4 flare
  const flareStyle = useMemo(() => {
    if (progress < 0.72 || progress >= 0.85) return { opacity: 0 }

    const flareX = ((progress - 0.72) / 0.13) * 100
    const vel = Math.abs(scrollVelocity)

    return {
      left: `${flareX}%`,
      opacity: 0.6 + vel * 0.1,
      filter: `blur(${Math.min(vel * 0.5, 4)}px)`,
    }
  }, [progress, scrollVelocity])

  // Dispersion
  const dispersion = useMemo(() => {
    if (progress < 0.18) return 0
    if (progress <= 0.40) {
      return Math.sin(((progress - 0.18) / 0.22) * Math.PI) * 0.015
    }
    return 0
  }, [progress])

  // Expansion viewport lerp
  const expansionStyle = useMemo(() => {
    if (progress < 0.85) return {}
    const t = (progress - 0.85) / 0.15
    const width = `${84 + t * 16}vw`
    const height = `${68 + t * 32}vh`
    const radius = `${40 * (1 - t)}px`

    return {
      width,
      height,
      borderRadius: radius,
      transition: 'none',
    }
  }, [progress])

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Phase 1 — Gate card editorial */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '1200px' }}>
        <div
          className="relative w-[min(84vw,1240px)] h-[min(68vh,720px)] rounded-[2.5rem] bg-white/80 backdrop-blur-[24px] border border-black/[0.06] shadow-[0_24px_80px_-16px_rgba(0,0,0,0.12),0_0_0_1px_rgba(0,0,0,0.04)_inset] overflow-hidden flex flex-col items-center justify-center"
          style={gateStyle as React.CSSProperties}
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#2563eb]/[0.06] via-transparent to-[#7c3aed]/[0.04] pointer-events-none" />
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_rgba(37,99,235,0.08)_0%,_transparent_60%)] pointer-events-none" />

          <div className="relative z-10 text-center px-8 md:px-16">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] border border-black/[0.06] px-3.5 py-1.5 mb-8">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb] animate-pulse" />
              <span className="text-[10px] font-mono tracking-[0.14em] text-black/60 uppercase">Experiential Portal • Scroll to Enter</span>
            </div>

            <h2 className="text-[clamp(32px,6vw,84px)] font-[900] tracking-[-0.04em] leading-[0.85] text-[#0b0b0d]">
              Enter the
              <br />
              <span className="bg-gradient-to-r from-[#2563eb] via-[#7c3aed] to-[#2563eb] bg-clip-text text-transparent">Hyperspace</span>
            </h2>

            <p className="mt-6 text-[13px] md:text-[15px] font-mono tracking-[0.02em] leading-[1.6] text-black/50 max-w-[420px] mx-auto">
              A high-performance canvas frame-scrubber coupled with WebGL chromatic aberration post-processing. Photorealistic 120 FPS kinetic scrubbing.
            </p>

            <div className="mt-10 flex items-center justify-center gap-3">
              <div className="w-px h-8 bg-black/10" />
              <div className="text-[10px] font-mono tracking-[0.12em] text-black/40 uppercase">Scroll ↓</div>
              <div className="w-px h-8 bg-black/10" />
            </div>
          </div>

          {/* Bottom progress indicator */}
          <div className="absolute bottom-6 left-6 right-6 h-px bg-black/[0.06] overflow-hidden rounded-full">
            <div
              className="h-full bg-[#2563eb] transition-none"
              style={{ width: `${(progress / 0.18) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Phase 2-3 — Dispersion overlay */}
      {(phase === 'portal' || phase === 'cruise') && (
        <>
          <div
            className="absolute inset-0 mix-blend-screen pointer-events-none"
            style={{
              background: `linear-gradient(90deg, rgba(255,0,80,${dispersion * 2}) 0%, transparent 50%, rgba(0,200,255,${dispersion * 2}) 100%)`,
              filter: `blur(${dispersion * 40}px)`,
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: `radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,${progress * 0.15}) 100%)`,
            }}
          />
        </>
      )}

      {/* Phase 4 — Horizontal flare */}
      {phase === 'deceleration' && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[180px] h-[2px] bg-gradient-to-r from-transparent via-white to-transparent shadow-[0_0_40px_8px_rgba(255,255,255,0.8),0_0_80px_16px_rgba(37,99,235,0.4)]"
            style={flareStyle as React.CSSProperties}
          />
          <div
            className="absolute top-1/2 -translate-y-1/2 w-[120px] h-[120px] rounded-full bg-[radial-gradient(circle,_rgba(255,255,255,0.9)_0%,_rgba(37,99,235,0.4)_40%,_transparent_70%)] blur-[1px]"
            style={{ left: flareStyle.left, opacity: flareStyle.opacity } as React.CSSProperties}
          />
        </div>
      )}

      {/* Phase 5 — Expansion viewport frame */}
      {phase === 'expansion' && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="relative bg-white/10 backdrop-blur-[2px] border border-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.1)_inset]"
            style={expansionStyle as React.CSSProperties}
          >
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="absolute top-4 left-4 text-[10px] font-mono tracking-[0.14em] text-white/60 uppercase">
              Realm Expanded • {Math.round(((progress - 0.85) / 0.15) * 100)}%
            </div>
          </div>
        </div>
      )}

      {/* Velocity motion indicator */}
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/60 backdrop-blur-[12px] border border-white/10 rounded-full px-3 py-1.5 pointer-events-none">
        <div className="w-1 h-1 rounded-full bg-[#2563eb] animate-pulse" />
        <span className="text-[10px] font-mono tracking-[0.08em] text-white/70 uppercase">
          {phase} • V {Math.abs(scrollVelocity).toFixed(2)}
        </span>
      </div>

      {/* Hover chromatic hint */}
      {isHovering && phase !== 'gate' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-[12px] border border-white/10 rounded-full px-4 py-2 pointer-events-none">
          <span className="text-[11px] font-mono tracking-[0.08em] text-white/80">◉ Chromatic boost active</span>
        </div>
      )}

      {/* Film grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
