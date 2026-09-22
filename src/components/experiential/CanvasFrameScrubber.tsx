/**
 * LUSION — CanvasFrameScrubber — High-frequency canvas video/sequence player
 * Off-screen video decoded to canvas via requestVideoFrameCallback, ImageBitmap, DPR, drawImageCover
 * 120 FPS kinetic scrubbing, no keyframe lag
 */

'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { FrameScrubberProps, DrawImageCoverResult } from '@/types/hyperspace'
import { PostProcessShader, calculateDispersion, applyChromaticAberration2D } from './PostProcessShader'

function drawImageCover(
  ctx: CanvasRenderingContext2D,
  img: CanvasImageSource,
  destWidth: number,
  destHeight: number
): DrawImageCoverResult {
  const video = img as HTMLVideoElement
  const imgWidth = video.videoWidth || (img as HTMLImageElement).width || destWidth
  const imgHeight = video.videoHeight || (img as HTMLImageElement).height || destHeight

  const imgRatio = imgWidth / imgHeight
  const canvasRatio = destWidth / destHeight

  let sWidth = imgWidth
  let sHeight = imgHeight
  let sx = 0
  let sy = 0

  if (canvasRatio > imgRatio) {
    sHeight = sWidth / canvasRatio
    sy = (imgHeight - sHeight) / 2
  } else {
    sWidth = sHeight * canvasRatio
    sx = (imgWidth - sWidth) / 2
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, destWidth, destHeight)

  return {
    sx,
    sy,
    sWidth,
    sHeight,
    dx: 0,
    dy: 0,
    dWidth: destWidth,
    dHeight: destHeight,
  }
}

export default function CanvasFrameScrubber({
  videoSrc,
  totalFrames,
  currentProgress,
  scrollVelocity,
  isHovering = false,
  className = '',
  onFrameUpdate,
}: FrameScrubberProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const postProcessCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const shaderRef = useRef<PostProcessShader | null>(null)
  const rafRef = useRef<number | null>(null)
  const currentFrameRef = useRef<number>(0)
  const targetFrameRef = useRef<number>(0)
  const smoothedFrameRef = useRef<number>(0)

  const [isReady, setIsReady] = useState<boolean>(false)
  const [currentFrame, setCurrentFrame] = useState<number>(0)

  const initVideo = useCallback((): HTMLVideoElement => {
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.preload = 'auto'
    video.loop = false
    video.src = videoSrc
    videoRef.current = video
    return video
  }, [videoSrc])

  const resizeCanvas = useCallback((): void => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const dpr = Math.min(window.devicePixelRatio || 1, 2)

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const ctx = canvas.getContext('2d')
    if (ctx) {
      ctx.scale(dpr, dpr)
    }

    if (!offscreenCanvasRef.current) {
      offscreenCanvasRef.current = document.createElement('canvas')
    }
    offscreenCanvasRef.current.width = rect.width * dpr
    offscreenCanvasRef.current.height = rect.height * dpr

    if (!postProcessCanvasRef.current) {
      postProcessCanvasRef.current = document.createElement('canvas')
    }
    postProcessCanvasRef.current.width = rect.width * dpr
    postProcessCanvasRef.current.height = rect.height * dpr

    if (postProcessCanvasRef.current && !shaderRef.current) {
      try {
        shaderRef.current = new PostProcessShader({
          canvas: postProcessCanvasRef.current,
          width: rect.width * dpr,
          height: rect.height * dpr,
        })
      } catch {
        shaderRef.current = null
      }
    }
  }, [])

  useEffect(() => {
    const video = initVideo()
    resizeCanvas()

    const onCanPlay = (): void => {
      setIsReady(true)
    }

    const onLoadedMetadata = (): void => {
      setIsReady(true)
    }

    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('loadedmetadata', onLoadedMetadata)

    const onResize = (): void => {
      resizeCanvas()
    }
    window.addEventListener('resize', onResize, { passive: true })

    return (): void => {
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('loadedmetadata', onLoadedMetadata)
      window.removeEventListener('resize', onResize)
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
      if (shaderRef.current) {
        shaderRef.current.destroy()
        shaderRef.current = null
      }
      video.pause()
      video.src = ''
    }
  }, [initVideo, resizeCanvas])

  // Frame scrubbing with lerp smoothing 0.08
  useEffect(() => {
    let p = currentProgress
    if (p < 0.18) {
      targetFrameRef.current = 0
    } else {
      const frameIndex = Math.floor(((p - 0.18) / 0.82) * totalFrames)
      targetFrameRef.current = Math.max(0, Math.min(frameIndex, totalFrames - 1))
    }

    const animate = (): void => {
      // Inertial progress smoothing lerp 0.08
      smoothedFrameRef.current += (targetFrameRef.current - smoothedFrameRef.current) * 0.08
      const frameToRender = Math.floor(smoothedFrameRef.current)

      if (frameToRender !== currentFrameRef.current) {
        currentFrameRef.current = frameToRender
        setCurrentFrame(frameToRender)
        onFrameUpdate?.(frameToRender)

        const video = videoRef.current
        const canvas = canvasRef.current
        const offscreen = offscreenCanvasRef.current

        if (video && canvas && offscreen && video.readyState >= 2) {
          const duration = video.duration || 10
          const time = (frameToRender / totalFrames) * duration

          if (Math.abs(video.currentTime - time) > 0.05) {
            video.currentTime = time
          }

          const rect = canvas.getBoundingClientRect()
          const ctx = canvas.getContext('2d')
          const offCtx = offscreen.getContext('2d')

          if (ctx && offCtx) {
            const dpr = Math.min(window.devicePixelRatio || 1, 2)
            const w = rect.width
            const h = rect.height

            // Clear
            ctx.clearRect(0, 0, w, h)
            offCtx.clearRect(0, 0, offscreen.width, offscreen.height)
            offCtx.save()
            offCtx.scale(dpr, dpr)

            // Draw cover
            drawImageCover(offCtx, video, w, h)
            offCtx.restore()

            // Post-process chromatic aberration
            const dispersion = calculateDispersion(p)
            const vel = Math.abs(scrollVelocity)

            if (shaderRef.current && postProcessCanvasRef.current) {
              // WebGL path
              const postCanvas = postProcessCanvasRef.current
              const postCtx = postCanvas.getContext('2d')
              if (postCtx) {
                postCtx.clearRect(0, 0, postCanvas.width, postCanvas.height)
                postCtx.drawImage(offscreen, 0, 0)
              }

              shaderRef.current.render(offscreen, {
                time: performance.now() * 0.001,
                progress: p,
                velocity: vel,
                dispersion,
              })

              ctx.drawImage(postProcessCanvasRef.current, 0, 0, w, h)
            } else {
              // 2D fallback with chromatic aberration
              ctx.drawImage(offscreen, 0, 0, w, h)

              if (dispersion > 0.001 || vel > 0.1) {
                applyChromaticAberration2D(ctx, Math.floor(w), Math.floor(h), dispersion, vel)
              }

              // Motion blur filter
              const blur = Math.min(vel * 0.04, 8.0)
              if (blur > 0.1) {
                canvas.style.filter = `blur(${blur}px)`
              } else {
                canvas.style.filter = 'none'
              }

              // Inertial breath scale
              const breath = 1.0 + Math.min(vel * 0.0005, 0.08) + (isHovering ? 0.02 : 0)
              canvas.style.transform = `scale(${breath})`
            }
          }
        }
      }

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return (): void => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current)
        rafRef.current = null
      }
    }
  }, [currentProgress, totalFrames, scrollVelocity, isHovering, onFrameUpdate])

  return (
    <div className={`relative w-full h-full overflow-hidden bg-[#f7f7f9] ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover will-change-transform"
        style={{ width: '100%', height: '100%' }}
      />
      {!isReady && (
        <div className="absolute inset-0 flex items-center justify-center bg-[#f7f7f9]">
          <div className="w-8 h-8 border-2 border-black/10 border-t-[#2563eb] rounded-full animate-spin" />
        </div>
      )}
      <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-[8px] text-white rounded-full px-2.5 py-1 text-[10px] font-mono tracking-[0.08em]">
        FRAME {currentFrame}/{totalFrames} • {Math.round(currentProgress * 100)}%
      </div>
    </div>
  )
}
