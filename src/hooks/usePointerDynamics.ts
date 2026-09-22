/**
 * LUSION CORE — Pointer Dynamics
 * Computes coordinates, raw velocity vector, acceleration, spring interpolation
 * For hydrodynamic surface tension + particle stream repulsion
 * Production-grade with inertia decay and RAF throttling
 */

import { useEffect, useRef, useState, useCallback } from 'react'

export interface PointerDynamics {
  x: number // -1..1
  y: number // -1..1
  sx: number // 0..1 screen
  sy: number // 0..1 screen
  clientX: number
  clientY: number
  vx: number
  vy: number
  velocity: number // magnitude
  speed: number // clamped 0..5 for shader
  acceleration: number
  isMoving: boolean
  isPressing: boolean
  deltaX: number
  deltaY: number
}

const initialState: PointerDynamics = {
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
  acceleration: 0,
  isMoving: false,
  isPressing: false,
  deltaX: 0,
  deltaY: 0,
}

export default function usePointerDynamics() {
  const stateRef = useRef<PointerDynamics>(initialState)
  const [pointer, setPointer] = useState<PointerDynamics>(initialState)
  const lastRef = useRef({ x: 0, y: 0, vx: 0, vy: 0, time: performance.now() })
  const rafRef = useRef<number | null>(null)
  const lastMoveRef = useRef(performance.now())
  const pressingRef = useRef(false)

  const updateState = useCallback(() => {
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

      const ax = (vx - lastRef.current.vx) / dt
      const ay = (vy - lastRef.current.vy) / dt
      const acceleration = Math.sqrt(ax * ax + ay * ay)

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
        acceleration,
        isMoving: true,
        isPressing: pressingRef.current,
        deltaX: dx,
        deltaY: dy,
      }

      lastRef.current = { x, y, vx, vy, time: now }
      lastMoveRef.current = now

      updateState()
    }

    const onDown = () => {
      pressingRef.current = true
      stateRef.current.isPressing = true
      updateState()
      window.dispatchEvent(new CustomEvent('lusion-pointer-down', { detail: stateRef.current }))
    }

    const onUp = () => {
      pressingRef.current = false
      stateRef.current.isPressing = false
      updateState()
      window.dispatchEvent(new CustomEvent('lusion-pointer-up', { detail: stateRef.current }))
    }

    const onLeave = () => {
      stateRef.current.isMoving = false
      updateState()
    }

    // Inertia decay when stopped — damped harmonic spring back
    const inertiaInterval = setInterval(() => {
      const now = performance.now()
      const idle = now - lastMoveRef.current
      if (idle > 80) {
        // Spring interpolation values: lerp velocity to zero
        stateRef.current.vx *= 0.88
        stateRef.current.vy *= 0.88
        stateRef.current.velocity *= 0.88
        stateRef.current.speed *= 0.88
        stateRef.current.acceleration *= 0.9

        if (stateRef.current.velocity < 0.005) {
          stateRef.current.velocity = 0
          stateRef.current.speed = 0
          stateRef.current.vx = 0
          stateRef.current.vy = 0
          stateRef.current.isMoving = false
        }
        updateState()
      }
    }, 24)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('touchmove', onMove as any, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('touchstart', onDown as any, { passive: true })
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchend', onUp as any)
    window.addEventListener('mouseleave', onLeave)

    return () => {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('touchmove', onMove as any)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('touchstart', onDown as any)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchend', onUp as any)
      window.removeEventListener('mouseleave', onLeave)
      clearInterval(inertiaInterval)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [updateState])

  return pointer
}
