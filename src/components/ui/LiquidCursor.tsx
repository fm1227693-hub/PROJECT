/**
 * LUSION UI — LiquidCursor
 * Canvas/SVG trailing fluid cursor with mix-blend-mode: difference and click feedback
 * Elastic magnetic follower, stiffness 150 damping 15 per spec
 */

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const vel = useRef({ x: 0, y: 0 })
  const trail = useRef<{ x: number; y: number; vx: number; vy: number }[]>([])

  useEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    const canvas = canvasRef.current
    if (!cursor || !ring || !dot || !canvas) return

    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    // Init trail
    trail.current = Array.from({ length: 12 }, () => ({ x: 0, y: 0, vx: 0, vy: 0 }))

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize, { passive: true })

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('magnetic') ||
        window.getComputedStyle(target).cursor === 'pointer' ||
        target.hasAttribute('data-magnetic')
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('mouseover', onMouseOver)

    // Smooth follow with spring physics — stiffness 150 damping 15
    let raf: number
    const animate = () => {
      const stiffness = 0.16
      const damping = 0.8

      const dx = mouse.current.x - pos.current.x
      const dy = mouse.current.y - pos.current.y

      vel.current.x += dx * stiffness
      vel.current.y += dy * stiffness

      vel.current.x *= damping
      vel.current.y *= damping

      pos.current.x += vel.current.x
      pos.current.y += vel.current.y

      // Update trail with fluid lag
      for (let i = trail.current.length - 1; i > 0; i--) {
        trail.current[i].x += (trail.current[i - 1].x - trail.current[i].x) * 0.25
        trail.current[i].y += (trail.current[i - 1].y - trail.current[i].y) * 0.25
      }
      trail.current[0].x = pos.current.x
      trail.current[0].y = pos.current.y

      gsap.set(cursor, { x: pos.current.x, y: pos.current.y, xPercent: -50, yPercent: -50 })

      // Draw trailing fluid canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'

      // Fluid trail with gradient
      for (let i = 0; i < trail.current.length - 1; i++) {
        const p1 = trail.current[i]
        const p2 = trail.current[i + 1]
        const alpha = (1 - i / trail.current.length) * 0.18 * (isHovering ? 1.5 : 1)
        const width = (1 - i / trail.current.length) * (isHovering ? 18 : 8) + (isClicking ? 4 : 0)

        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.strokeStyle = `rgba(255,255,255,${alpha})`
        ctx.lineWidth = width
        ctx.stroke()
      }

      raf = requestAnimationFrame(animate)
    }
    animate()

    // Magnetic pull for [data-magnetic]
    const magnetics = document.querySelectorAll('[data-magnetic]')
    const handleMagneticMove = (e: MouseEvent) => {
      magnetics.forEach((el) => {
        const m = el as HTMLElement
        const rect = m.getBoundingClientRect()
        const cx = rect.left + rect.width / 2
        const cy = rect.top + rect.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const dist = Math.sqrt(dx * dx + dy * dy)
        const maxDist = 130

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist
          gsap.to(m, {
            x: dx * force * 0.36,
            y: dy * force * 0.36,
            duration: 0.65,
            ease: 'power3.out',
          })
        } else {
          gsap.to(m, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1,0.42)' })
        }
      })
    }
    window.addEventListener('mousemove', handleMagneticMove)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('mouseover', onMouseOver)
      window.removeEventListener('mousemove', handleMagneticMove)
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [isHovering, isClicking])

  useEffect(() => {
    if (!ringRef.current || !dotRef.current) return

    if (isHovering) {
      gsap.to(ringRef.current, {
        scale: 1.9,
        opacity: 0.92,
        borderWidth: 1,
        duration: 0.55,
        ease: 'power3.out',
      })
      gsap.to(dotRef.current, { scale: 0.28, duration: 0.42, ease: 'power3.out' })
    } else {
      gsap.to(ringRef.current, {
        scale: 1,
        opacity: 0.52,
        borderWidth: 1.2,
        duration: 0.65,
        ease: 'power3.out',
      })
      gsap.to(dotRef.current, { scale: 1, duration: 0.55, ease: 'power3.out' })
    }

    if (isClicking) {
      gsap.to(ringRef.current, { scale: 0.82, duration: 0.18, ease: 'power2.out' })
      gsap.to(dotRef.current, { scale: 1.7, duration: 0.18, ease: 'power2.out' })
    }
  }, [isHovering, isClicking])

  return (
    <>
      {/* Trailing fluid canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full z-[9998] pointer-events-none hidden md:block"
        style={{ mixBlendMode: 'difference' }}
      />
      {/* Liquid dot that expands into ring on hover */}
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:flex items-center justify-center"
        style={{ willChange: 'transform' }}
      >
        <div
          ref={ringRef}
          className="absolute w-[38px] h-[38px] rounded-full border border-white/85 flex items-center justify-center"
          style={{ willChange: 'transform, opacity' }}
        />
        <div ref={dotRef} className="w-[6px] h-[6px] rounded-full bg-white" style={{ willChange: 'transform' }} />
        <div
          className="absolute w-[130px] h-[130px] rounded-full bg-white/10 blur-[26px] opacity-0 data-[hover=true]:opacity-100 transition-opacity"
          data-hover={isHovering}
        />
      </div>
    </>
  )
}
