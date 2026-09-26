import { useRef, useEffect } from 'react'
import gsap from 'gsap'
import { isCoarsePointer } from './studioEnv'

/**
 * MagneticButton — the element leans toward the pointer with spring physics
 * and settles back on exit. On touch devices it degrades to a press scale.
 *
 * Renders as <a> when `to`/`href` is provided, otherwise <button>.
 */
export default function MagneticButton({
  children,
  to,
  href,
  onClick,
  type = 'button',
  variant = 'fill',
  sweep = true,
  className = '',
  strength = 0.32,
  cursor,
  ...rest
}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el || isCoarsePointer()) return

    const xTo = gsap.quickTo(el, 'x', { duration: 0.7, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.7, ease: 'power3' })

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - r.left - r.width / 2) * strength)
      yTo((e.clientY - r.top - r.height / 2) * strength)
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: 'elastic.out(1, 0.35)' })
    }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  const classes = [
    'st-btn',
    variant === 'fill' ? 'st-btn-fill' : 'st-btn-line',
    sweep ? 'st-btn-sweep' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  const shared = {
    ref,
    className: classes,
    'data-cursor': cursor,
    ...rest,
  }

  if (to || href) {
    return (
      <a {...shared} href={to || href} onClick={onClick}>
        {children}
      </a>
    )
  }

  return (
    <button {...shared} type={type} onClick={onClick}>
      {children}
    </button>
  )
}

export function ArrowIcon() {
  return (
    <span className="st-btn-arrow" aria-hidden="true">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M13 6l6 6-6 6" />
      </svg>
    </span>
  )
}
