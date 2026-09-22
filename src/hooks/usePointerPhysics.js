import { useEffect, useRef, useState } from 'react'

export default function usePointerPhysics() {
  const mouseRef = useRef({ x: 0, y: 0, px: 0, py: 0, vx: 0, vy: 0, speed: 0, accel: 0 })
  const [pointer, setPointer] = useState({ x: 0, y: 0, vx: 0, vy: 0, speed: 0, isMoving: false })
  const lastMoveRef = useRef(0)
  const rafRef = useRef(null)

  useEffect(() => {
    let lastX = 0, lastY = 0, lastVX = 0, lastVY = 0
    let lastTime = performance.now()

    const onMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      // also keep screen space 0-1
      const sx = e.clientX / window.innerWidth
      const sy = e.clientY / window.innerHeight

      const now = performance.now()
      const dt = Math.max((now - lastTime) / 1000, 0.001)
      
      const vx = (x - lastX) / dt
      const vy = (y - lastY) / dt
      const speed = Math.sqrt(vx*vx + vy*vy)
      
      const ax = (vx - lastVX) / dt
      const ay = (vy - lastVY) / dt
      const accel = Math.sqrt(ax*ax + ay*ay)

      mouseRef.current = {
        x, y, sx, sy,
        px: lastX, py: lastY,
        vx, vy,
        speed,
        accel,
        clientX: e.clientX,
        clientY: e.clientY,
      }

      lastX = x
      lastY = y
      lastVX = vx
      lastVY = vy
      lastTime = now
      lastMoveRef.current = now

      // Throttle state update via rAF
      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(() => {
          rafRef.current = null
          const m = mouseRef.current
          setPointer({
            x: m.x,
            y: m.y,
            sx: m.sx,
            sy: m.sy,
            vx: m.vx,
            vy: m.vy,
            speed: Math.min(m.speed * 0.1, 5),
            accel: m.accel,
            clientX: m.clientX,
            clientY: m.clientY,
            isMoving: true,
          })
        })
      }

      window.dispatchEvent(new CustomEvent('lusion-pointer', { detail: mouseRef.current }))
    }

    const onLeave = () => {
      setPointer(p => ({ ...p, isMoving: false }))
    }

    // Inertia decay when stopped
    const inertiaLoop = setInterval(() => {
      const now = performance.now()
      if (now - lastMoveRef.current > 100) {
        mouseRef.current.vx *= 0.92
        mouseRef.current.vy *= 0.92
        mouseRef.current.speed *= 0.92
        if (mouseRef.current.speed < 0.01) {
          setPointer(p => ({ ...p, speed: 0, vx: 0, vy: 0, isMoving: false }))
        }
      }
    }, 32)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', (e) => {
      if (e.touches[0]) onMove({ clientX: e.touches[0].clientX, clientY: e.touches[0].clientY })
    }, { passive: true })
    window.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove)
      window.removeEventListener('mouseleave', onLeave)
      clearInterval(inertiaLoop)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [])

  return pointer
}
