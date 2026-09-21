import { useEffect } from 'react'
import { subscribePointer, pointer } from '../lib/pointer'

/**
 * Pointer parallax for every `[data-depth]` element inside `scopeRef`.
 * A single rAF loop lerps each element toward pointer.nx/ny * depth * range.
 * The loop starts on pointer movement and stops once everything has settled,
 * so there is no permanently running animation frame.
 */
export function useMouseParallax(scopeRef, { enabled = true, range = 90, ease = 0.08 } = {}) {
  useEffect(() => {
    if (!enabled) return
    const scope = scopeRef.current
    if (!scope) return

    const items = Array.from(scope.querySelectorAll('[data-depth]')).map((el) => ({
      el,
      depth: parseFloat(el.dataset.depth) || 0.03,
      x: 0,
      y: 0,
    }))
    if (!items.length) return

    let raf = 0
    let running = false

    const tick = () => {
      let settled = true
      const active = pointer.active ? 1 : 0
      for (const it of items) {
        const tx = pointer.nx * it.depth * range * active
        const ty = pointer.ny * it.depth * range * active
        it.x += (tx - it.x) * ease
        it.y += (ty - it.y) * ease
        if (Math.abs(tx - it.x) > 0.05 || Math.abs(ty - it.y) > 0.05) settled = false
        it.el.style.transform = `translate3d(${it.x.toFixed(2)}px, ${it.y.toFixed(2)}px, 0)`
      }
      if (settled) {
        running = false
        raf = 0
        return
      }
      raf = requestAnimationFrame(tick)
    }

    const wake = () => {
      if (running) return
      running = true
      raf = requestAnimationFrame(tick)
    }

    const unsub = subscribePointer(wake)
    return () => {
      unsub()
      if (raf) cancelAnimationFrame(raf)
      items.forEach((it) => (it.el.style.transform = ''))
    }
  }, [scopeRef, enabled, range, ease])
}
