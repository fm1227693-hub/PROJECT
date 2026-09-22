/**
 * LUSION — CanvasFrameScrubber — ULTRA LIGHTWEIGHT 2D
 * No video decoding, no WebGL texture upload per frame, no getImageData
 * Single canvas, renders ONLY on progress/velocity change (scroll-driven)
 * DPR retina Math.min(devicePixelRatio,2) drawImageCover logic preserved
 * 120 FPS feel via GSAP scrub, but no continuous RAF when idle
 */

'use client'

import { useEffect, useRef, useCallback } from 'react'
import { FrameScrubberProps } from '@/types/hyperspace'

export default function CanvasFrameScrubber({
  totalFrames = 60,
  currentProgress,
  scrollVelocity,
  isHovering = false,
  className = '',
  onFrameUpdate,
}: FrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const dprRef = useRef<number>(1)
  const lastFrameRef = useRef<number>(-1)
  const precomputedAnglesRef = useRef<number[]>([])

  // Precompute streak angles once — no Math.random in render loop
  useEffect(() => {
    const angles: number[] = []
    for (let i = 0; i < 20; i++) {
      angles.push((i / 20) * Math.PI * 2)
    }
    precomputedAnglesRef.current = angles
  }, [])

  const resizeCanvas = useCallback((): void => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    dprRef.current = dpr

    // Only resize if size changed significantly to avoid layout thrash
    const targetW = Math.floor(rect.width * dpr)
    const targetH = Math.floor(rect.height * dpr)
    if (canvas.width !== targetW || canvas.height !== targetH) {
      canvas.width = targetW
      canvas.height = targetH
    }
  }, [])

  // Scroll-driven render — NO continuous RAF
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: false })
    if (!ctx) return

    const p = currentProgress
    const vel = Math.abs(scrollVelocity)

    // Frame index with exact formula: clamp floor((P-0.18)/0.82*Total)
    let frameIndex = 0
    if (p >= 0.18) {
      frameIndex = Math.floor(((p - 0.18) / 0.82) * totalFrames)
      frameIndex = Math.max(0, Math.min(frameIndex, totalFrames - 1))
    }

    // Skip if same frame and low velocity (prevent redundant draws)
    if (frameIndex === lastFrameRef.current && vel < 0.01 && !isHovering) {
      return
    }
    lastFrameRef.current = frameIndex
    onFrameUpdate?.(frameIndex)

    const rect = canvas.getBoundingClientRect()
    const w = rect.width
    const h = rect.height
    const dpr = dprRef.current
    const cx = (w * dpr) / 2
    const cy = (h * dpr) / 2

    // Reset transform and clear
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Phase 1 gate — clean white, no heavy drawing
    if (p < 0.18) {
      // Subtle gradient only
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * dpr * 0.6)
      g.addColorStop(0, 'rgba(37,99,235,0.04)')
      g.addColorStop(1, 'rgba(246,246,248,0)')
      ctx.fillStyle = g
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      return
    }

    ctx.save()
    ctx.scale(dpr, dpr)

    // Lightweight tunnel — 10 rings only (was 24), no inner glow loop
    const tunnelDepth = (p - 0.18) / 0.82
    const ringCount = 10
    const baseRadius = 18 + tunnelDepth * 90
    const timeOffset = frameIndex * 0.12

    for (let i = 0; i < ringCount; i++) {
      const depth = i / ringCount
      const perspective = depth * depth * 0.9
      const radius = baseRadius + perspective * w * 0.55

      // Very cheap position wobble — sin only, no cos double
      const ox = Math.sin(timeOffset + i * 0.4) * depth * 12
      const oy = Math.cos(timeOffset + i * 0.3) * depth * 8

      ctx.beginPath()
      ctx.arc(w / 2 + ox, h / 2 + oy, radius, 0, Math.PI * 2)

      // Realm colors via hue — cheap hsla
      const hue = 220 + depth * 40 + (p * 30)
      const alpha = (1 - depth) * 0.10 * (0.6 + tunnelDepth * 0.4)
      ctx.strokeStyle = `hsla(${hue}, 80%, 60%, ${alpha})`
      ctx.lineWidth = 1 + (1 - depth) * 1.2
      ctx.stroke()
    }

    // Central singularity — single radial gradient
    const singR = 6 + tunnelDepth * 10
    const grad = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, singR * 2.5)
    grad.addColorStop(0, 'rgba(255,255,255,0.95)')
    grad.addColorStop(0.35, 'rgba(37,99,235,0.55)')
    grad.addColorStop(1, 'transparent')
    ctx.fillStyle = grad
    ctx.beginPath()
    ctx.arc(w / 2, h / 2, singR * 2.5, 0, Math.PI * 2)
    ctx.fill()

    // Streaks — 20 precomputed angles, no Math.random in loop
    if (p >= 0.40) {
      ctx.globalAlpha = 0.12 + Math.min(vel * 0.015, 0.10)
      const angles = precomputedAnglesRef.current
      for (let s = 0; s < angles.length; s++) {
        const angle = angles[s] + timeOffset * 0.15
        const r1 = 24
        const r2 = w * 0.55
        const x1 = w / 2 + Math.cos(angle) * r1
        const y1 = h / 2 + Math.sin(angle) * r1
        const x2 = w / 2 + Math.cos(angle) * r2
        const y2 = h / 2 + Math.sin(angle) * r2

        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.strokeStyle = '#2563eb'
        ctx.lineWidth = 0.6
        ctx.stroke()
      }
      ctx.globalAlpha = 1
    }

    ctx.restore()
  }, [currentProgress, scrollVelocity, isHovering, totalFrames, onFrameUpdate])

  useEffect(() => {
    resizeCanvas()
    const onResize = (): void => {
      resizeCanvas()
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [resizeCanvas])

  return (
    <div className={`relative w-full h-full overflow-hidden bg-white ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  )
}
