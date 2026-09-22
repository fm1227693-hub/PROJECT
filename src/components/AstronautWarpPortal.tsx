'use client'

import { useRef, useEffect, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface StarPoint {
  x: number
  y: number
  z: number
  baseRadius: number
  opacity: number
  angle: number
  speed: number
}

export default function AstronautWarpPortal() {
  const triggerRef = useRef<HTMLDivElement>(null)
  const stickyRef = useRef<HTMLDivElement>(null)
  const cardRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const typographyRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const offscreenCanvasRef = useRef<HTMLCanvasElement | null>(null)
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)
  const offCtxRef = useRef<CanvasRenderingContext2D | null>(null)
  const rafRef = useRef<number | null>(null)
  const seekRafRef = useRef<number | null>(null)
  const currentSeekTimeRef = useRef<number>(0)
  const targetSeekTimeRef = useRef<number>(0)
  const starsRef = useRef<StarPoint[]>([])
  const isVideoReadyRef = useRef<boolean>(false)
  const progressRef = useRef<number>(0)
  const velocityRef = useRef<number>(0)
  const dprRef = useRef<number>(1)
  const resizeTimeoutRef = useRef<number | null>(null)

  const lerp = useCallback((a: number, b: number, t: number): number => {
    return a + (b - a) * t
  }, [])

  const cubicBezierEased = useCallback((x1: number, y1: number, x2: number, y2: number, t: number): number => {
    const u = 1 - t
    const tt = t * t
    const uu = u * u
    const ttt = tt * t
    return 3 * uu * t * y1 + 3 * u * tt * y2 + ttt
  }, [])

  const getZoneColor = useCallback((p: number): { primary: string; secondary: string } => {
    if (p < 0.38) return { primary: '#00ff88', secondary: '#00ccff' }
    if (p < 0.58) return { primary: '#ff3b9a', secondary: '#8b5cf6' }
    return { primary: '#2563eb', secondary: '#1e3a8a' }
  }, [])

  const renderFallback = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, p: number): void => {
    const dpr = dprRef.current
    const w = width / dpr
    const h = height / dpr
    const cx = w / 2
    const cy = h / 2

    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.scale(dpr, dpr)

    const zone = getZoneColor(p)
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, Math.max(w, h) * 0.9)
    gradient.addColorStop(0, p < 0.2 ? '#0a0a0f' : `${zone.primary}18`)
    gradient.addColorStop(0.35, '#07070a')
    gradient.addColorStop(1, '#030305')
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, w, h)

    if (p >= 0.18) {
      const tunnelDepth = Math.min((p - 0.18) / 0.82, 1)
      const ringCount = p < 0.4 ? 8 : 12
      const baseRadius = 12 + tunnelDepth * 80

      for (let i = 0; i < ringCount; i++) {
        const depth = i / ringCount
        const perspective = Math.pow(depth, 1.8)
        const radius = baseRadius + perspective * w * 0.45
        const alpha = (1 - depth) * 0.14 * (0.5 + tunnelDepth * 0.5)

        ctx.beginPath()
        ctx.arc(cx, cy, radius, 0, Math.PI * 2)

        if (p < 0.38) {
          ctx.strokeStyle = `hsla(150, 85%, 60%, ${alpha})`
        } else if (p < 0.58) {
          ctx.strokeStyle = `hsla(${310 + depth * 30}, 90%, 65%, ${alpha})`
        } else {
          ctx.strokeStyle = `hsla(225, 85%, 62%, ${alpha})`
        }

        ctx.lineWidth = 1 + (1 - depth) * 1.5
        ctx.stroke()
      }
    }

    const stars = starsRef.current
    for (let i = 0; i < stars.length; i++) {
      const s = stars[i]
      const depthFactor = 1 + p * 2.5 + s.z * 0.5
      const x = cx + Math.cos(s.angle) * s.x * depthFactor
      const y = cy + Math.sin(s.angle) * s.y * depthFactor
      const size = s.baseRadius * (0.6 + p * 0.8) * (1 + s.z * 0.3)

      if (x < -20 || x > w + 20 || y < -20 || y > h + 20) continue

      ctx.beginPath()
      ctx.arc(x, y, size, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(255,255,255,${s.opacity * (0.4 + p * 0.6)})`
      ctx.fill()

      if (p > 0.3 && i % 7 === 0) {
        ctx.beginPath()
        ctx.arc(x, y, size * 2.2, 0, Math.PI * 2)
        const g = ctx.createRadialGradient(x, y, 0, x, y, size * 2.2)
        g.addColorStop(0, `${zone.primary}66`)
        g.addColorStop(1, 'transparent')
        ctx.fillStyle = g
        ctx.fill()
      }
    }

    if (p < 0.85) {
      const floatY = Math.sin(progressRef.current * 6.28 * 0.8) * 6
      const scale = p < 0.2 ? 1 : Math.max(0.35, 1 - (p - 0.2) * 0.9)
      const alpha = p < 0.2 ? 0.9 : Math.max(0.15, 0.9 - (p - 0.2) * 1.1)

      ctx.save()
      ctx.globalAlpha = alpha
      ctx.translate(cx, cy + floatY)
      ctx.scale(scale, scale)

      const helmetGradient = ctx.createRadialGradient(0, -18, 0, 0, -18, 22)
      helmetGradient.addColorStop(0, 'rgba(255,255,255,0.95)')
      helmetGradient.addColorStop(0.3, 'rgba(200,210,255,0.85)')
      helmetGradient.addColorStop(0.7, 'rgba(120,130,180,0.6)')
      helmetGradient.addColorStop(1, 'rgba(60,70,110,0.3)')

      ctx.fillStyle = helmetGradient
      ctx.beginPath()
      ctx.arc(0, -18, 20, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'rgba(255,255,255,0.25)'
      ctx.lineWidth = 1
      ctx.stroke()

      const visorGradient = ctx.createRadialGradient(4, -20, 0, 4, -20, 14)
      visorGradient.addColorStop(0, 'rgba(120,200,255,0.7)')
      visorGradient.addColorStop(0.5, 'rgba(60,120,200,0.4)')
      visorGradient.addColorStop(1, 'rgba(20,40,80,0.15)')
      ctx.fillStyle = visorGradient
      ctx.beginPath()
      ctx.arc(2, -18, 13, -0.2, Math.PI + 0.2)
      ctx.fill()

      ctx.fillStyle = 'rgba(230,235,255,0.9)'
      ctx.beginPath()
      ctx.roundRect(-14, 2, 28, 26, 8)
      ctx.fill()

      ctx.fillStyle = 'rgba(180,185,210,0.8)'
      ctx.beginPath()
      ctx.roundRect(-10, 30, 20, 18, 6)
      ctx.fill()

      ctx.fillStyle = 'rgba(255,255,255,0.7)'
      ctx.beginPath()
      ctx.roundRect(-18, 6, 6, 18, 3)
      ctx.roundRect(12, 6, 6, 18, 3)
      ctx.fill()

      if (p >= 0.75) {
        const reachT = (p - 0.75) / 0.1
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.beginPath()
        ctx.roundRect(-22 - reachT * 8, 10 + reachT * 2, 8, 20, 4)
        ctx.roundRect(14 + reachT * 8, 10 + reachT * 2, 8, 20, 4)
        ctx.fill()
      }

      ctx.restore()
    }

    if (p >= 0.4) {
      const v = Math.abs(velocityRef.current)
      const streakAlpha = 0.08 + Math.min(v * 0.0008, 0.12)
      ctx.save()
      ctx.globalAlpha = streakAlpha
      ctx.strokeStyle = zone.primary
      ctx.lineWidth = 0.8

      for (let i = 0; i < 18; i++) {
        const angle = (i / 18) * Math.PI * 2 + p * 3.5
        const r1 = 30
        const r2 = w * 0.55
        const x1 = cx + Math.cos(angle) * r1
        const y1 = cy + Math.sin(angle) * r1
        const x2 = cx + Math.cos(angle) * r2
        const y2 = cy + Math.sin(angle) * r2
        ctx.beginPath()
        ctx.moveTo(x1, y1)
        ctx.lineTo(x2, y2)
        ctx.stroke()
      }
      ctx.restore()
    }
  }, [getZoneColor])

  const renderFrame = useCallback((ctx: CanvasRenderingContext2D, video: HTMLVideoElement, width: number, height: number): void => {
    const vWidth = video.videoWidth || 1920
    const vHeight = video.videoHeight || 1080
    const vRatio = vWidth / vHeight
    const cRatio = width / height

    let sWidth = vWidth
    let sHeight = vHeight
    let sx = 0
    let sy = 0

    if (cRatio > vRatio) {
      sHeight = vWidth / cRatio
      sy = (vHeight - sHeight) / 2
    } else {
      sWidth = vHeight * cRatio
      sx = (vWidth - sWidth) / 2
    }

    ctx.clearRect(0, 0, width, height)
    ctx.drawImage(video, sx, sy, sWidth, sHeight, 0, 0, width, height)
  }, [])

  const handleScrollTick = useCallback((P: number, V: number): void => {
    progressRef.current = P
    velocityRef.current = V

    const card = cardRef.current
    const typo = typographyRef.current
    const canvas = canvasRef.current
    const offscreen = offscreenCanvasRef.current
    const offCtx = offCtxRef.current
    const ctx = ctxRef.current

    if (!card || !typo || !canvas) return

    if (P <= 0.2) {
      const t = P / 0.2
      const Z = -Math.pow(t, 2.2) * 800
      const S = 1 + t * 1.2
      const alpha = Math.max(1 - Math.pow(t, 1.6), 0)
      const B = t * 20

      typo.style.transform = `translate3d(0,0,${Z}px) scale(${S})`
      typo.style.opacity = `${alpha}`
      typo.style.filter = `blur(${B}px)`
      typo.style.pointerEvents = alpha < 0.02 ? 'none' : 'auto'

      const words = typo.querySelectorAll('.word-inner') as NodeListOf<HTMLElement>
      words.forEach((w, i) => {
        const stagger = i * 0.035
        const wt = Math.max(0, Math.min(1, (t - stagger) / (1 - stagger * 0.4)))
        w.style.transform = `translate3d(0,${wt * 120}%,0) rotateX(${wt * 18}deg)`
        w.style.opacity = `${1 - wt}`
      })

      card.style.width = 'min(86vw, 1260px)'
      card.style.height = 'min(70vh, 740px)'
      card.style.borderRadius = '2.5rem'
      card.style.border = '1px solid rgba(255,255,255,0.12)'
      card.style.boxShadow = '0 45px 120px -20px rgba(0,0,0,0.9)'

      if (offCtx && offscreen && ctx) {
        renderFallback(offCtx, offscreen.width, offscreen.height, P)
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height)
      }

      canvas.style.filter = 'none'
      canvas.style.transform = 'translate3d(0,0,0)'
    } else if (P <= 0.75) {
      typo.style.opacity = '0'
      typo.style.pointerEvents = 'none'
      typo.style.filter = 'blur(20px)'

      const t = (P - 0.2) / 0.55
      targetSeekTimeRef.current = t * (videoRef.current?.duration || 12)

      const blur = Math.min(Math.abs(V) * 0.003, 10)
      const shakeX = Math.sin(t * 40) * 4 * Math.min(Math.abs(V) * 0.001, 1)
      const shakeY = Math.cos(t * 35) * 4 * Math.min(Math.abs(V) * 0.001, 1)

      canvas.style.filter = `blur(${blur}px)`
      canvas.style.transform = `translate3d(${shakeX}px,${shakeY}px,0)`

      card.style.width = 'min(86vw, 1260px)'
      card.style.height = 'min(70vh, 740px)'
      card.style.borderRadius = '2.5rem'
      card.style.border = '1px solid rgba(255,255,255,0.12)'
    } else if (P <= 0.85) {
      const t = (P - 0.75) / 0.1
      const decay = 1 - t
      const blur = Math.min(Math.abs(V) * 0.003, 10) * decay

      canvas.style.filter = `blur(${blur}px)`
      canvas.style.transform = 'translate3d(0,0,0)'

      const t2 = 0.75 + t * 0.1
      const tNorm = (t2 - 0.2) / 0.55
      targetSeekTimeRef.current = tNorm * (videoRef.current?.duration || 12)

      card.style.width = 'min(86vw, 1260px)'
      card.style.height = 'min(70vh, 740px)'
      card.style.borderRadius = '2.5rem'
    } else {
      const t = (P - 0.85) / 0.15
      const eased = cubicBezierEased(0.65, 0, 0.35, 1, t)
      const W = lerp(86, 100, eased)
      const H = lerp(70, 100, eased)
      const R = lerp(40, 0, t)
      const borderOpacity = Math.max(1 - t * 2, 0)

      card.style.width = `${W}vw`
      card.style.height = `${H}vh`
      card.style.borderRadius = `${R}px`
      card.style.border = `${borderOpacity}px solid rgba(255,255,255,${0.12 * borderOpacity})`
      card.style.boxShadow = t > 0.92 ? 'none' : '0 45px 120px -20px rgba(0,0,0,0.9)'

      typo.style.opacity = '0'
      typo.style.pointerEvents = 'none'

      canvas.style.filter = 'none'
      canvas.style.transform = 'translate3d(0,0,0)'

      const rect = card.getBoundingClientRect()
      const dpr = dprRef.current
      if (offscreen) {
        offscreen.width = rect.width * dpr
        offscreen.height = rect.height * dpr
      }
      if (canvas) {
        canvas.width = rect.width * dpr
        canvas.height = rect.height * dpr
      }
    }

    if (P > 0.2 && isVideoReadyRef.current && videoRef.current && ctxRef.current && offscreenCanvasRef.current && offCtxRef.current) {
      const video = videoRef.current
      const offscreen = offscreenCanvasRef.current
      const offCtx = offCtxRef.current
      const mainCtx = ctxRef.current
      const mainCanvas = canvasRef.current

      if (video.readyState >= 2 && mainCanvas) {
        renderFrame(offCtx, video, offscreen.width, offscreen.height)
        mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
        mainCtx.drawImage(offscreen, 0, 0, mainCanvas.width, mainCanvas.height)
      } else {
        renderFallback(offCtx, offscreen.width, offscreen.height, P)
        if (mainCanvas) {
          mainCtx.clearRect(0, 0, mainCanvas.width, mainCanvas.height)
          mainCtx.drawImage(offscreen, 0, 0, mainCanvas.width, mainCanvas.height)
        }
      }
    }
  }, [cubicBezierEased, lerp, renderFallback, renderFrame])

  useEffect(() => {
    const canvas = canvasRef.current
    const card = cardRef.current
    if (!canvas || !card) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    dprRef.current = dpr

    const rect = card.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    const offscreen = document.createElement('canvas')
    offscreen.width = rect.width * dpr
    offscreen.height = rect.height * dpr
    offscreenCanvasRef.current = offscreen

    const ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D
    const offCtx = offscreen.getContext('2d', { alpha: false }) as CanvasRenderingContext2D
    ctxRef.current = ctx
    offCtxRef.current = offCtx

    const stars: StarPoint[] = []
    for (let i = 0; i < 380; i++) {
      const angle = Math.random() * Math.PI * 2
      const radius = Math.random() * 420 + 20
      stars.push({
        x: Math.cos(angle) * radius * (0.5 + Math.random() * 0.8),
        y: Math.sin(angle) * radius * (0.5 + Math.random() * 0.8),
        z: Math.random(),
        baseRadius: Math.random() * 1.6 + 0.3,
        opacity: Math.random() * 0.7 + 0.2,
        angle,
        speed: Math.random() * 0.8 + 0.2,
      })
    }
    starsRef.current = stars

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.muted = true
    video.playsInline = true
    video.loop = true
    video.preload = 'auto'
    videoRef.current = video

    const primarySrc = 'https://assets.mixkit.co/videos/preview/mixkit-flying-through-a-star-field-in-space-41535-large.mp4'
    const fallbackSrc = 'https://assets.mixkit.co/videos/preview/mixkit-stars-in-space-1610-large.mp4'

    video.src = primarySrc

    const onCanPlay = (): void => {
      isVideoReadyRef.current = true
      video.play().catch(() => {})
    }

    const onError = (): void => {
      if (video.src !== fallbackSrc) {
        video.src = fallbackSrc
        video.load()
      } else {
        isVideoReadyRef.current = false
      }
    }

    video.addEventListener('canplay', onCanPlay)
    video.addEventListener('error', onError)
    video.load()

    const updateScrub = (): void => {
      currentSeekTimeRef.current += (targetSeekTimeRef.current - currentSeekTimeRef.current) * 0.12
      if (videoRef.current && Math.abs(videoRef.current.currentTime - currentSeekTimeRef.current) > 0.02) {
        if (videoRef.current.readyState >= 2) {
          videoRef.current.currentTime = currentSeekTimeRef.current
        }
      }
      seekRafRef.current = requestAnimationFrame(updateScrub)
    }
    seekRafRef.current = requestAnimationFrame(updateScrub)

    const renderLoop = (): void => {
      const p = progressRef.current
      if (offCtxRef.current && offscreenCanvasRef.current && ctxRef.current && canvasRef.current) {
        if (!isVideoReadyRef.current || p <= 0.2) {
          renderFallback(offCtxRef.current, offscreenCanvasRef.current.width, offscreenCanvasRef.current.height, p)
          ctxRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height)
          ctxRef.current.drawImage(offscreenCanvasRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height)
        }
      }
      rafRef.current = requestAnimationFrame(renderLoop)
    }
    rafRef.current = requestAnimationFrame(renderLoop)

    const handleResize = (): void => {
      if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current)
      resizeTimeoutRef.current = window.setTimeout(() => {
        const cardEl = cardRef.current
        const canvasEl = canvasRef.current
        const offEl = offscreenCanvasRef.current
        if (!cardEl || !canvasEl || !offEl) return
        const r = cardEl.getBoundingClientRect()
        const d = Math.min(window.devicePixelRatio || 1, 2)
        dprRef.current = d
        canvasEl.width = r.width * d
        canvasEl.height = r.height * d
        offEl.width = r.width * d
        offEl.height = r.height * d
      }, 150) as unknown as number
    }

    window.addEventListener('resize', handleResize, { passive: true })

    const trigger = triggerRef.current
    const sticky = stickyRef.current

    if (trigger && sticky) {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: trigger,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          pin: sticky,
          anticipatePin: 1,
          onUpdate: (self) => {
            handleScrollTick(self.progress, self.getVelocity())
          },
        },
      })

      return () => {
        tl.kill()
        ScrollTrigger.getAll().forEach((t) => {
          if (t.vars.trigger === trigger) t.kill()
        })
        window.removeEventListener('resize', handleResize)
        if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current)
        if (rafRef.current) cancelAnimationFrame(rafRef.current)
        if (seekRafRef.current) cancelAnimationFrame(seekRafRef.current)
        video.removeEventListener('canplay', onCanPlay)
        video.removeEventListener('error', onError)
        video.pause()
        video.src = ''
        videoRef.current = null
        ctxRef.current = null
        offCtxRef.current = null
      }
    }

    return () => {
      window.removeEventListener('resize', handleResize)
      if (resizeTimeoutRef.current) window.clearTimeout(resizeTimeoutRef.current)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      if (seekRafRef.current) cancelAnimationFrame(seekRafRef.current)
      video.removeEventListener('canplay', onCanPlay)
      video.removeEventListener('error', onError)
      video.pause()
      video.src = ''
    }
  }, [handleScrollTick, renderFallback])

  return (
    <div ref={triggerRef} className="relative w-full h-[500vh] bg-[#030305] overflow-visible">
      <div ref={stickyRef} className="sticky top-0 w-full h-screen flex items-center justify-center overflow-hidden bg-[#030305]">
        <div
          ref={cardRef}
          className="relative flex items-center justify-center overflow-hidden will-change-[width,height,border-radius,transform]"
          style={{
            width: 'min(86vw, 1260px)',
            height: 'min(70vh, 740px)',
            borderRadius: '2.5rem',
            border: '1px solid rgba(255,255,255,0.12)',
            boxShadow: '0 45px 120px -20px rgba(0,0,0,0.9)',
            transformOrigin: 'center center',
            background: '#07070a',
          }}
        >
          <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover will-change-transform" style={{ width: '100%', height: '100%' }} />

          <div
            ref={typographyRef}
            className="relative z-10 flex flex-col items-center justify-center text-center pointer-events-none select-none will-change-transform"
            style={{ perspective: '1000px', transformStyle: 'preserve-3d' }}
          >
            <div className="overflow-hidden leading-[0.95] tracking-[-0.035em] text-white font-black uppercase" style={{ fontSize: 'clamp(2.5rem, 6vw, 6.2rem)', lineHeight: 0.95 }}>
              <div className="flex flex-wrap justify-center gap-x-[0.22em] overflow-hidden">
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">STEP</span></span>
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">INTO</span></span>
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">A</span></span>
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">NEW</span></span>
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">WORLD</span></span>
              </div>
            </div>

            <div className="overflow-hidden leading-[0.95] tracking-[-0.035em] text-white font-black uppercase mt-[0.08em]" style={{ fontSize: 'clamp(2.5rem, 6vw, 6.2rem)', lineHeight: 0.95 }}>
              <div className="flex flex-wrap justify-center gap-x-[0.22em] overflow-hidden">
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">AND</span></span>
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">LET</span></span>
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">YOUR</span></span>
              </div>
            </div>

            <div className="overflow-hidden leading-[0.95] tracking-[-0.035em] text-white font-black uppercase mt-[0.08em]" style={{ fontSize: 'clamp(2.5rem, 6vw, 6.2rem)', lineHeight: 0.95 }}>
              <div className="flex flex-wrap justify-center gap-x-[0.22em] overflow-hidden">
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">IMAGINATION</span></span>
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">RUN</span></span>
                <span className="inline-block overflow-hidden"><span className="word-inner inline-block will-change-transform">WILD</span></span>
              </div>
            </div>
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-b from-black/10 via-transparent to-black/30" />
          <div className="absolute inset-0 pointer-events-none opacity-[0.04] mix-blend-overlay" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
        </div>
      </div>
    </div>
  )
}
