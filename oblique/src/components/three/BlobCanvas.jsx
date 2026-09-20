import { useEffect, useRef } from 'react'
import BlobScene from './BlobScene'
import { subscribePointer } from '../../lib/pointer'

/**
 * Thin React wrapper around the vanilla three.js scene.
 * This module is lazy-loaded so three.js never lands in the main bundle.
 */
export default function BlobCanvas({ quality = 'high', reduced = false, pointer = true, onReady }) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    let scene
    try {
      scene = new BlobScene(el, { quality, reduced, onReady })
    } catch (err) {
      // WebGL unavailable — the CSS placeholder stays in place.
      console.warn('[Oblique] 3D object disabled:', err?.message)
      return undefined
    }
    const unsubscribe = pointer ? subscribePointer(({ nx, ny }) => scene.setPointer(nx, ny)) : null
    return () => {
      unsubscribe?.()
      scene.destroy()
    }
  }, [quality, reduced, pointer, onReady])

  return <div ref={ref} className="absolute inset-0" />
}
