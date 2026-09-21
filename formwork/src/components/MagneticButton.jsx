import { useEffect, useRef } from 'react'
import { magnetic } from '../animations/hoverAnimations'
import { useCaps } from '../context/scroll'

/**
 * Pill button/link with magnetic pull (fine pointers only) and a flip-text hover.
 * Renders an <a> when `href` is given, a <button> otherwise.
 */
export default function MagneticButton({
  href,
  onClick,
  children,
  variant = 'solid',
  className = '',
  strength = 0.3,
  icon = null,
  ...rest
}) {
  const ref = useRef(null)
  const labelRef = useRef(null)
  const caps = useCaps()

  useEffect(() => {
    if (!caps.cursor) return
    return magnetic(ref.current, { strength, label: labelRef.current })
  }, [caps.cursor, strength])

  const cls = `pill flip-parent ${variant === 'solid' ? 'pill-solid' : 'pill-ghost'} ${className}`
  const inner = (
    <span ref={labelRef} className="inline-flex items-center gap-3">
      <span className="flip-text">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
      {icon}
    </span>
  )

  if (href) {
    return (
      <a ref={ref} href={href} onClick={onClick} className={cls} {...rest}>
        {inner}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" onClick={onClick} className={cls} {...rest}>
      {inner}
    </button>
  )
}
