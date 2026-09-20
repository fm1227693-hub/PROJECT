import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap'
import { useSmoothScroll } from '../context/smoothScroll'

const LABELS = { view: 'View', drag: 'Drag', open: 'Open', play: 'Play' }

/**
 * Desktop-only cursor: a small dot that sticks to the pointer and a ring
 * that lags behind. Interactive elements change its state through
 * `data-cursor` attributes ("view", "drag", "open") or by being links.
 *
 * Touch devices and reduced-motion users never see it.
 */
export default function CustomCursor() {
  const { env } = useSmoothScroll()
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    if (!env.pointerFX) return undefined

    const dot = dotRef.current
    const ring = ringRef.current
    const label = labelRef.current
    const html = document.documentElement
    html.classList.add('has-cursor')

    gsap.set([dot, ring], { xPercent: -50, yPercent: -50, autoAlpha: 0 })

    const dotX = gsap.quickTo(dot, 'x', { duration: 0.12, ease: 'power3.out' })
    const dotY = gsap.quickTo(dot, 'y', { duration: 0.12, ease: 'power3.out' })
    const ringX = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' })
    const ringY = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' })

    let visible = false
    let mode = 'default'

    const setMode = (next) => {
      if (next === mode) return
      mode = next
      const text = LABELS[next]
      if (text) {
        label.textContent = text
        ring.classList.add('is-label')
        gsap.to(ring, { scale: 2.2, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
        gsap.to(label, { autoAlpha: 1, duration: 0.3, delay: 0.1, overwrite: 'auto' })
        gsap.to(dot, { scale: 0, duration: 0.3, overwrite: 'auto' })
      } else if (next === 'link') {
        ring.classList.remove('is-label')
        gsap.to(label, { autoAlpha: 0, duration: 0.15, overwrite: 'auto' })
        gsap.to(ring, { scale: 1.5, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
        gsap.to(dot, { scale: 0.5, duration: 0.4, overwrite: 'auto' })
      } else if (next === 'hide') {
        gsap.to([ring, dot], { scale: 0, duration: 0.3, overwrite: 'auto' })
      } else {
        ring.classList.remove('is-label')
        gsap.to(label, { autoAlpha: 0, duration: 0.15, overwrite: 'auto' })
        gsap.to(ring, { scale: 1, duration: 0.6, ease: 'expo.out', overwrite: 'auto' })
        gsap.to(dot, { scale: 1, duration: 0.4, overwrite: 'auto' })
      }
    }

    const onMove = (e) => {
      dotX(e.clientX)
      dotY(e.clientY)
      ringX(e.clientX)
      ringY(e.clientY)
      if (!visible) {
        visible = true
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY })
        gsap.to([dot, ring], { autoAlpha: 1, duration: 0.4, overwrite: 'auto' })
      }
    }

    const resolve = (target) => {
      const el = target?.closest?.('[data-cursor], a, button, [role="button"]')
      if (!el) return 'default'
      return el.dataset.cursor || 'link'
    }

    const onOver = (e) => setMode(resolve(e.target))
    const onOut = (e) => {
      if (!e.relatedTarget) return
      setMode(resolve(e.relatedTarget))
    }
    const onLeave = () => {
      visible = false
      gsap.to([dot, ring], { autoAlpha: 0, duration: 0.3, overwrite: 'auto' })
    }
    const onDown = () => gsap.to(ring, { scale: mode === 'default' ? 0.8 : 1.9, duration: 0.3, overwrite: 'auto' })
    const onUp = () => setModeForce()
    const setModeForce = () => {
      const current = mode
      mode = null
      setMode(current)
    }

    window.addEventListener('pointermove', onMove, { passive: true })
    document.addEventListener('pointerover', onOver, { passive: true })
    document.addEventListener('pointerout', onOut, { passive: true })
    document.addEventListener('pointerdown', onDown, { passive: true })
    document.addEventListener('pointerup', onUp, { passive: true })
    document.documentElement.addEventListener('mouseleave', onLeave)

    return () => {
      html.classList.remove('has-cursor')
      window.removeEventListener('pointermove', onMove)
      document.removeEventListener('pointerover', onOver)
      document.removeEventListener('pointerout', onOut)
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', onUp)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      gsap.killTweensOf([dot, ring, label])
    }
  }, [env.pointerFX])

  if (!env.pointerFX) return null

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[80] overflow-hidden">
      <div
        ref={ringRef}
        className="cursor-ring absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-full border border-white will-transform"
        style={{ mixBlendMode: 'difference' }}
      >
        <span
          ref={labelRef}
          className="font-mono text-[5px] font-medium uppercase tracking-[0.14em] opacity-0"
        >
          View
        </span>
      </div>
      <div
        ref={dotRef}
        className="absolute left-0 top-0 h-2 w-2 rounded-full bg-white will-transform"
        style={{ mixBlendMode: 'difference' }}
      />
    </div>
  )
}
