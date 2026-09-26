import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from './studioEnv'

/**
 * Marquee — slow editorial ticker whose speed is modulated by scroll velocity.
 * Uses transform-only movement on a single rAF loop.
 */
export default function Marquee({ items = [], className = '' }) {
  const trackRef = useRef(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return undefined

    if (prefersReducedMotion()) return undefined

    let x = 0
    let vel = 0
    let lastY = window.scrollY
    let raf = 0
    let visible = true

    const onScroll = () => {
      const y = window.scrollY
      vel = (y - lastY) * 0.9
      lastY = y
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const half = () => track.scrollWidth / 2

    const tick = () => {
      raf = requestAnimationFrame(tick)
      if (!visible) return
      x -= 0.85 + Math.abs(vel) * 0.22
      const h = half()
      if (h > 0) {
        if (x <= -h) x += h
        if (x > 0) x -= h
      }
      track.style.transform = `translate3d(${x}px, 0, 0)`
      vel *= 0.9
    }
    raf = requestAnimationFrame(tick)

    const io = new IntersectionObserver((entries) => {
      visible = entries[0].isIntersecting
    })
    io.observe(track)

    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const doubled = [...items, ...items]

  return (
    <div className={`st-marquee ${className}`}>
      <div className="st-marquee-track" ref={trackRef}>
        {doubled.map((item, i) => (
          <span className={`st-marquee-item ${i % 2 ? 'is-outline' : ''}`} key={i}>
            {item}
            <i />
          </span>
        ))}
      </div>
    </div>
  )
}
