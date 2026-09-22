import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'

export default function InteractiveCursor() {
  const cursorRef = useRef()
  const ringRef = useRef()
  const dotRef = useRef()
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

    // Elastic magnetic follower with blend mode per spec
    // stiffness 150, damping 15 for magnetic text

    const onMouseMove = (e) => {
      mouse.current.x = e.clientX
      mouse.current.y = e.clientY
    }

    const onMouseDown = () => setIsClicking(true)
    const onMouseUp = () => setIsClicking(false)

    // Hover detection for typography or 3D clickable hotspots
    const onMouseOver = (e) => {
      const target = e.target
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('magnetic') ||
        window.getComputedStyle(target).cursor === 'pointer'
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

    // Smooth follow with spring physics
    let raf
    const animate = () => {
      // Spring: stiffness 150, damping 15 per spec
      const stiffness = 0.15
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

    // Magnetic text pull
    const magnetics = document.querySelectorAll('[data-magnetic]')
    const handleMagneticMove = (e) => {
      magnetics.forEach(el => {
        const rect = el.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2
        const distX = e.clientX - centerX
        const distY = e.clientY - centerY
        const dist = Math.sqrt(distX * distX + distY * distY)
        const maxDist = 120

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist
          gsap.to(el, {
            x: distX * force * 0.35,
            y: distY * force * 0.35,
            duration: 0.6,
            ease: 'power3.out',
          })
        } else {
          gsap.to(el, { x: 0, y: 0, duration: 0.8, ease: 'elastic.out(1, 0.4)' })
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
      cancelAnimationFrame(raf)
    }
  }, [])

  // Animate ring and dot based on states
  useEffect(() => {
    if (!ringRef.current || !dotRef.current) return

    if (isHovering) {
      gsap.to(ringRef.current, { scale: 1.8, opacity: 0.9, borderWidth: 1, duration: 0.5, ease: 'power3.out' })
      gsap.to(dotRef.current, { scale: 0.3, duration: 0.4, ease: 'power3.out' })
    } else {
      gsap.to(ringRef.current, { scale: 1, opacity: 0.5, borderWidth: 1.2, duration: 0.6, ease: 'power3.out' })
      gsap.to(dotRef.current, { scale: 1, duration: 0.5, ease: 'power3.out' })
    }

    if (isClicking) {
      gsap.to(ringRef.current, { scale: 0.8, duration: 0.2, ease: 'power2.out' })
      gsap.to(dotRef.current, { scale: 1.6, duration: 0.2, ease: 'power2.out' })
    }
  }, [isHovering, isClicking])

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference hidden md:flex items-center justify-center"
      style={{ willChange: 'transform' }}
    >
      {/* Liquid dot that expands into ring when hovering per spec */}
      <div
        ref={ringRef}
        className="absolute w-[36px] h-[36px] rounded-full border border-white/80 flex items-center justify-center"
        style={{ willChange: 'transform, opacity' }}
      >
        <div className="absolute inset-0 rounded-full border border-white/20 scale-[1.4] opacity-0 group-hover:opacity-100" />
      </div>
      <div
        ref={dotRef}
        className="w-[6px] h-[6px] rounded-full bg-white"
        style={{ willChange: 'transform' }}
      />
      
      {/* Inner glow */}
      <div className="absolute w-[120px] h-[120px] rounded-full bg-white/10 blur-[24px] opacity-0 data-[hover=true]:opacity-100 transition-opacity" data-hover={isHovering} />
    </div>
  )
}
