import {useEffect, useRef} from 'react'

/**
 * CustomCursor — minimal dot + trailing ring cursor.
 *
 * - Activates ONLY on: desktop (≥1024px) + fine pointer + motion allowed
 * - rAF loop with lerp; zero React re-renders after mount
 * - Ring expands over interactive elements (a, button, [role=button], inputs)
 * - mix-blend-difference ring keeps it visible on any background
 * - Completely inert (renders nothing) on mobile / tablet / reduced-motion
 */
export default function CustomCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)

  useEffect(() => {
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches
    const wide = window.matchMedia('(min-width: 1024px)').matches
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (!fine || !wide || reduced) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return undefined

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let rx = x
    let ry = y
    let scale = 1
    let targetScale = 1
    let visible = false
    let raf = 0

    document.documentElement.classList.add('has-cursor')

    const onMove = (e) => {
      x = e.clientX
      y = e.clientY
      if (!visible) {
        visible = true
        dot.style.opacity = '1'
        ring.style.opacity = '1'
      }
    }

    const onOver = (e) => {
      const t = e.target
      targetScale = t.closest && t.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor]')
        ? 1.7
        : 1
    }

    const onDown = () => { targetScale = 0.75 }
    const onUp = () => { targetScale = 1 }
    const onLeave = () => {
      visible = false
      dot.style.opacity = '0'
      ring.style.opacity = '0'
    }
    const onEnter = () => {
      visible = true
      dot.style.opacity = '1'
      ring.style.opacity = '1'
    }

    const loop = () => {
      rx += (x - rx) * 0.18
      ry += (y - ry) * 0.18
      scale += (targetScale - scale) * 0.2
      dot.style.transform = `translate3d(${x}px, ${y}px, 0)`
      ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) scale(${scale.toFixed(3)})`
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

    window.addEventListener('mousemove', onMove, { passive: true })
    window.addEventListener('mouseover', onOver, { passive: true })
    window.addEventListener('mousedown', onDown, { passive: true })
    window.addEventListener('mouseup', onUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.documentElement.addEventListener('mouseenter', onEnter)

    return () => {
      cancelAnimationFrame(raf)
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseover', onOver)
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.documentElement.removeEventListener('mouseenter', onEnter)
    }
  }, [])

  return (
    <div aria-hidden="true">
      <div ref={ringRef} className="cursor-ring" />
      <div ref={dotRef} className="cursor-dot" />
    </div>
  )
}
