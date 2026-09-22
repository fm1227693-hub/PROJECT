/**
 * LUSION — HyperspaceOverlay — ULTRA LIGHTWEIGHT
 * Removed heavy backdrop-blur 24px, feTurbulence grain, mix-blend-screen blur
 * GPU-friendly transforms only
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

  const gateStyle = useMemo(() => {
    if (progress >= 0.18) return { opacity: 0, pointerEvents: 'none' as const, transform: 'translateZ(0)' }
    const p = progress
    const opacity = 1 - Math.pow(p / 0.18, 2)
    const blur = (p / 0.18) * 8 // reduced from 16 to 8
    const scale = 1 + p * 0.4 // reduced from 0.8 to 0.4
    return {
      transform: `scale(${scale}) translateZ(0)`,
      opacity,
      filter: `blur(${blur}px)`,
      willChange: 'transform, opacity',
    }
  }, [progress])

  const flareLeft = useMemo(() => {
    if (progress < 0.72 || progress >= 0.85) return '0%'
    return `${((progress - 0.72) / 0.13) * 100}%`
  }, [progress])

  const dispersion = useMemo(() => {
    if (progress < 0.18) return 0
    if (progress <= 0.40) return Math.sin(((progress - 0.18) / 0.22) * Math.PI) * 0.012
    return 0
  }, [progress])

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Phase 1 — Gate card — lightweight, no backdrop-blur 24px */}
      <div className="absolute inset-0 flex items-center justify-center" style={{ perspective: '800px' }}>
        <div
          className="relative w-[min(84vw,1240px)] h-[min(68vh,720px)] rounded-[2rem] bg-white/90 border border-black/[0.06] shadow-[0_16px_40px_-12px_rgba(0,0,0,0.10)] overflow-hidden flex flex-col items-center justify-center will-change-transform"
          style={gateStyle as React.CSSProperties}
        >
          <div className="relative z-10 text-center px-6 md:px-12">
            <div className="inline-flex items-center gap-2 rounded-full bg-black/[0.04] border border-black/[0.06] px-3 py-1 mb-6">
              <div className="w-1.5 h-1.5 rounded-full bg-[#2563eb]" />
              <span className="text-[10px] font-mono tracking-[0.12em] text-black/60 uppercase">Portal • Scroll to Enter</span>
            </div>

            <h2 className="text-[clamp(28px,5.5vw,72px)] font-[900] tracking-[-0.03em] leading-[0.9] text-[#0b0b0d]">
              Enter the
              <br />
              <span className="text-[#2563eb]">Hyperspace</span>
            </h2>

            <p className="mt-4 text-[12px] md:text-[13px] font-mono leading-[1.5] text-black/50 max-w-[360px] mx-auto">
              Canvas frame-scrubber • 60 FPS • No lag • 2D lightweight
            </p>

            <div className="mt-6 flex items-center justify-center gap-2">
              <div className="w-px h-6 bg-black/10" />
              <span className="text-[10px] font-mono tracking-[0.10em] text-black/40 uppercase">Scroll ↓</span>
              <div className="w-px h-6 bg-black/10" />
            </div>
          </div>

          <div className="absolute bottom-4 left-4 right-4 h-px bg-black/[0.06] rounded-full overflow-hidden">
            <div className="h-full bg-[#2563eb] origin-left" style={{ transform: `scaleX(${progress / 0.18})` }} />
          </div>
        </div>
      </div>

      {/* Phase 2 — Dispersion — cheap linear gradient, no blur filter */}
      {(phase === 'portal' || phase === 'cruise') && dispersion > 0.001 && (
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: `linear-gradient(90deg, rgba(255,0,80,${dispersion}) 0%, transparent 50%, rgba(0,200,255,${dispersion}) 100%)`,
          }}
        />
      )}

      {/* Phase 4 — Flare — single element, no double glow */}
      {phase === 'deceleration' && (
        <div className="absolute top-1/2 -translate-y-1/2 w-[120px] h-[2px] bg-white shadow-[0_0_20px_4px_rgba(255,255,255,0.8)] pointer-events-none" style={{ left: flareLeft }} />
      )}

      {/* Velocity indicator — minimal */}
      <div className="absolute top-4 right-4 flex items-center gap-1.5 bg-black/60 rounded-full px-2.5 py-1 pointer-events-none">
        <div className="w-1 h-1 rounded-full bg-[#2563eb]" />
        <span className="text-[9px] font-mono tracking-[0.08em] text-white/70 uppercase">
          {phase} • {Math.round(progress * 100)}%
        </span>
      </div>
    </div>
  )
}
