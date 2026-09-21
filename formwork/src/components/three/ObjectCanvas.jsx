import { useEffect, useImperativeHandle, useRef, useState } from 'react'
import { useCaps } from '../../context/scroll'
import { hasUsableWebGL } from '../../lib/device'
import { subscribePointer } from '../../lib/pointer'

/**
 * Lazy wrapper for the WebGL object. three.js is code-split and only imported
 * once the browser is idle; until then (and if WebGL is unavailable) a CSS disc
 * stands in. Exposes `setProgress(p)` to the parent for scroll-driven rotation.
 */
export default function ObjectCanvas({ className = '', ref }) {
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)
  const caps = useCaps()
  const [ready, setReady] = useState(false)

  useImperativeHandle(ref, () => ({
    setProgress(p) {
      sceneRef.current?.setProgress(p)
    },
    setActive(v) {
      sceneRef.current?.setActive(v)
    },
  }))

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    let cancelled = false
    let scene = null
    let io = null
    let ro = null
    let unsubPointer = null

    const idle = window.requestIdleCallback ? (cb) => window.requestIdleCallback(cb, { timeout: 1200 }) : (cb) => setTimeout(cb, 250)
    const cancelIdle = window.cancelIdleCallback ? (id) => window.cancelIdleCallback(id) : (id) => clearTimeout(id)

    const id = idle(async () => {
      try {
        if (!hasUsableWebGL()) return
        const { ObjectScene } = await import('./ObjectScene.js')
        if (cancelled) return
        scene = new ObjectScene(canvas, { dpr: caps.dpr, loop: !caps.touch && !caps.reduced })
        sceneRef.current = scene
        setReady(true)

        io = new IntersectionObserver(([entry]) => scene.setVisible(entry.isIntersecting), { rootMargin: '10% 0px' })
        io.observe(canvas)
        ro = new ResizeObserver(() => scene.resize())
        ro.observe(canvas)
        if (caps.cursor) unsubPointer = subscribePointer((p) => scene.setPointer(p.nx, p.ny))
      } catch (err) {
        // WebGL unavailable — the CSS fallback stays.
        console.warn('[formwork] 3D object skipped:', err?.message)
      }
    })

    return () => {
      cancelled = true
      cancelIdle(id)
      io?.disconnect()
      ro?.disconnect()
      unsubPointer?.()
      scene?.dispose()
      sceneRef.current = null
    }
  }, [caps.dpr, caps.touch, caps.reduced, caps.cursor])

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <div className={`orb-fallback absolute inset-[14%] ${ready ? 'opacity-0' : 'opacity-100'}`} />
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
    </div>
  )
}
