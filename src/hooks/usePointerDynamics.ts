import { useEffect, useRef, useState, useCallback } from 'react'

export interface PointerDynamics {
  x: number
  y: number
  sx: number
  sy: number
  clientX: number
  clientY: number
  vx: number
  vy: number
  velocity: number
  speed: number
  isMoving: boolean
  isPressing: boolean
}

const initial: PointerDynamics = {
  x: 0,
  y: 0,
  sx: 0.5,
  sy: 0.5,
  clientX: 0,
  clientY: 0,
  vx: 0,
  vy: 0,
  velocity: 0,
  speed: 0,
  isMoving: false,
  isPressing: false,
}

export default function usePointerDynamics() {
  const stateRef = useRef<PointerDynamics>(initial)
  const [pointer, setPointer] = useState<PointerDynamics>(initial)
  const lastRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, time: performance.now() })
  const rafRef = useRef<number | null>(null)
  const lastMoveRef = useRef(performance.now())
  const pressingRef = useRef(false)

  const update = useCallback(() => {
    if (rafRef.current) return
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null
      setPointer({ ...stateRef.current })
      window.dispatchEvent(new CustomEvent('lusion-pointer', { detail: stateRef.current }))
    })
  }, [])

  useEffect(() => {
    const onMove = (e: MouseEvent | TouchEvent) => {
      let clientX: number, clientY: number
      if ('touches' in e) {
        if (!e.touches[0]) return
        clientX = e.touches[0].clientX
        clientY = e.touches[0].clientY
      } else {
        clientX = (e as MouseEvent).clientX
        clientY = (e as MouseEvent).clientY
      }

      const now = performance.now()
      const dt = Math.max((now - lastRef.current.time) / 1000, 0.001)
      const x = (clientX / window.innerWidth) * 2 - 1
      const y = -(clientY / window.innerHeight) * 2 + 1
      const sx = clientX / window.innerWidth
      const sy = clientY / window.innerHeight
      const dx = x - lastRef.current.x
      const dy = y - lastRef.current.y
      const vx = dx / dt
      const vy = dy / dt
      const velocity = Math.sqrt(vx * vx + vy * vy)

      stateRef.current = {
        x,
        y,
        sx,
        sy,
        clientX,
        clientY,
        vx,
        vy,
        velocity,
        speed: Math.min(velocity * 0.08, 5),
        isMoving: true,
        isPressing: pressingRef.current,
      }

      lastRef.current = { x, y, vx, vy, time: now }
      lastMoveRef.current = now
      update()
    }

    const onDown = () => {
      pressingRef.current = true
      stateRef.current.isPressing = true
      update()
    }
    const onUp = () => {
      pressingRef.current = false
      stateRef.current.isPressing = false
      update()
    }

    const inertia = setInterval(() => {
      const now = performance.now()
      if (now - lastMoveRef.current > 80) {
        stateRef.current.vx *= 0.88
        stateRef.current.vy *= 0.88
        stateRef.current.velocity *= 0.88
        stateRef.current.speed *= 0.88
        if (stateRef.current.velocity < 0.005) {
          stateRef.current.isMoving = false
          stateRef.current.velocity = 0
          stateRef.current.speed = 0
        }
        update()
      }
    }, 24)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onMove as any, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('touchstart', onDown as any, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp as any)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove as any)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('touchstart', onDown as any)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp as any)
      clearInterval(inertia)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [update])

  return pointer
}
