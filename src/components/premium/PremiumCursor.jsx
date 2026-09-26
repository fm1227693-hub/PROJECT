import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { isCoarsePointer, prefersReducedMotion } from './studioEnv'

/**
 * PremiumCursor — a precise core with a spring-lagging outer ring.
 * Reads `data-cursor="LABEL"` anywhere in the tree for contextual states.
 * Desktop only; disabled for coarse pointers and reduced-motion users.
 */
export default function PremiumCursor() {
  const coreRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (isCoarsePointer() || prefersReducedMotion()) return

    const core = coreRef.current
    const ring = ringRef.current
    const label = labelRef.current
    if (!core || !ring) return

    document.body.classList.add('st-cursor-active')

    const coreX = gsap.quickTo(core, 'x', { duration: 0.1, ease: 'power3' })
    const coreY = gsap.quickTo(core, 'y', { duration: 0.1, ease: 'power3' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.62, ease: 'power3' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.62, ease: 'power3' })

    gsap.set([core, ring], { x: window.innerWidth / 2, y: window.innerHeight / 2 })

    let raf = 0
    let tx = window.innerWidth / 2
    let ty = window.innerHeight / 2
    let cx = tx
    let cy = ty

    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      coreX(tx)
      coreY(ty)
      if (!raf) raf = requestAnimationFrame(tick)
    }

    // The ring trails with real inertia rather than a plain tween.
    const tick = () => {
      cx += (tx - cx) * 0.14
      cy += (ty - cy) * 0.14
      ringX(cx)
      ringY(cy)
      if (Math.abs(tx - cx) > 0.1 || Math.abs(ty - cy) > 0.1) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
      }
    }

    const onOver = (e) => {
      const labelled = e.target.closest?.('[data-cursor]')
      const interactive = e.target.closest?.('a, button, [role="button"], input, textarea, select, .st-step, .st-index-row')
      document.body.classList.toggle('st-cursor-label', !!labelled)
      document.body.classList.toggle('st-cursor-hover', !!interactive && !labelled)
      if (labelled && label) label.textContent = labelled.dataset.cursor
    }

    const onDown = () => document.body.classList.add('st-cursor-down')
    const onUp = () => document.body.classList.remove('st-cursor-down')
    const onLeave = () => {
      gsap.to([core, ring], { opacity: 0, duration: 0.25, overwrite: true })
    }
    const onEnter = () => {
      gsap.to([core, ring], { opacity: 1, duration: 0.25, overwrite: true })
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    document.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      if (raf) cancelAnimationFrame(raf)
      document.body.classList.remove('st-cursor-active', 'st-cursor-label', 'st-cursor-hover', 'st-cursor-down')
    }
  }, [])

  return (
    <>
      <div ref={ringRef} className="st-cursor-ring" aria-hidden="true">
        <span ref={labelRef} />
      </div>
      <div ref={coreRef} className="st-cursor-core" aria-hidden="true" />
    </>
  )
}
