import { useEffect, useRef } from 'react'
import { useCaps } from '../context/scroll'
import { pointer, subscribePointer } from '../lib/pointer'

/**
 * Desktop-only cursor: a precise dot and a lagging ring.
 * States come from the element under the pointer:
 *   a, button                      → ring tightens (link)
 *   [data-cursor="view|drag|..."]  → ring fills and shows the label
 * Mounted only for fine pointers without reduced motion; never on touch.
 * The rAF loop stops when the ring has caught up, so nothing runs while idle.
 */
export default function CustomCursor() {
  const caps = useCaps()
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!caps.cursor) return
    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    const html = document.documentElement
    html.classList.add('has-cursor')

    let rx = pointer.x
    let ry = pointer.y
    let scale = 1
    let targetScale = 1
    let raf = 0
    let running = false
    let shown = false

    const tick = () => {
      rx += (pointer.x - rx) * 0.16
      ry += (pointer.y - ry) * 0.16
      scale += (targetScale - scale) * 0.14
      ring.style.transform = `translate3d(${rx.toFixed(2)}px, ${ry.toFixed(2)}px, 0) scale(${scale.toFixed(3)})`
      const settled = Math.abs(pointer.x - rx) < 0.1 && Math.abs(pointer.y - ry) < 0.1 && Math.abs(targetScale - scale) < 0.002
      if (settled) {
        running = false
        raf = 0
        return
      }
      raf = requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!running) {
        running = true
        raf = requestAnimationFrame(tick)
      }
    }

    const onPointer = (p) => {
      if (!shown && p.moved) {
        shown = true
        dot.removeAttribute('data-state')
        ring.removeAttribute('data-state')
        rx = p.x
        ry = p.y
      }
      dot.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`
      if (!p.active) {
        dot.dataset.state = 'hidden'
        ring.dataset.state = 'hidden'
      } else if (dot.dataset.state === 'hidden') {
        dot.removeAttribute('data-state')
        ring.removeAttribute('data-state')
      }
      wake()
    }

    const setState = (state, text) => {
      if (state === 'label') {
        label.textContent = text
        ring.dataset.state = 'label'
        targetScale = 2.1
        dot.style.opacity = '0'
      } else if (state === 'link') {
        ring.dataset.state = 'link'
        targetScale = 1.4
        dot.style.opacity = '1'
      } else {
        ring.removeAttribute('data-state')
        targetScale = 1
        dot.style.opacity = '1'
      }
      wake()
    }

    const onOver = (e) => {
      const t = e.target
      if (!(t instanceof Element)) return
      const labelled = t.closest('[data-cursor]')
      if (labelled) return setState('label', labelled.dataset.cursor)
      if (t.closest('a, button, [role="button"]')) return setState('link')
      setState('default')
    }

    const unsub = subscribePointer(onPointer)
    document.addEventListener('pointerover', onOver, { passive: true })
    window.addEventListener('blur', () => setState('default'))

    return () => {
      unsub()
      document.removeEventListener('pointerover', onOver)
      if (raf) cancelAnimationFrame(raf)
      html.classList.remove('has-cursor')
    }
  }, [caps.cursor])

  if (!caps.cursor) return null

  return (
    <>
      <div ref={dotRef} className="cursor-dot" data-state="hidden" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" data-state="hidden" aria-hidden="true">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </>
  )
}
