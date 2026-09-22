import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function LiquidCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const mouse = useRef({ x: 0, y: 0 })
  const pos = useRef({ x: 0, y: 0 })
  const vel = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const cursor = cursorRef.current
    const ring = ringRef.current
    const dot = dotRef.current
    if (!cursor || !ring || !dot) return

    const onMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }
    const onDown = () => setIsClicking(true)
    const onUp = () => setIsClicking(false)
    const onOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.closest('[data-cursor-hover]') ||
        window.getComputedStyle(target).cursor === 'pointer'
      ) {
        setIsHovering(true)
      } else {
        setIsHovering(false)
      }
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mouseover', onOver)

    let raf: number
    const animate = () => {
      const stiffness = 0.18
      const damping = 0.82
      const dx = mouse.current.x - pos.current.x
      const dy = mouse.current.y - pos.current.y
      vel.current.x += dx * stiffness
      vel.current.y += dy * stiffness
      vel.current.x *= damping
      vel.current.y *= damping
      pos.current.x += vel.current.x
      pos.current.y += vel.current.y
      gsap.set(cursor, { x: pos.current.x, y: pos.current.y, xPercent: -50, yPercent: -50 })
      raf = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mouseover', onOver)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    if (!ringRef.current || !dotRef.current) return
    if (isHovering) {
      gsap.to(ringRef.current, { scale: 1.8, opacity: 0.9, duration: 0.45, ease: 'power3.out' })
      gsap.to(dotRef.current, { scale: 0.35, duration: 0.35, ease: 'power3.out' })
    } else {
      gsap.to(ringRef.current, { scale: 1, opacity: 0.6, duration: 0.55, ease: 'power3.out' })
      gsap.to(dotRef.current, { scale: 1, duration: 0.45, ease: 'power3.out' })
    }
    if (isClicking) {
      gsap.to(ringRef.current, { scale: 0.85, duration: 0.15 })
      gsap.to(dotRef.current, { scale: 1.5, duration: 0.15 })
    }
  }, [isHovering, isClicking])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none hidden md:flex items-center justify-center mix-blend-difference"
      style={{ willChange: 'transform' }}
    >
      <div ref={ringRef} className="absolute w-[36px] h-[36px] rounded-full border border-white flex items-center justify-center" />
      <div ref={dotRef} className="w-[5px] h-[5px] rounded-full bg-white" />
    </div>
  )
}
