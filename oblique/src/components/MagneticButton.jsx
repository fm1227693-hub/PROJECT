import { useEffect, useRef } from 'react'
import { magnetic } from '../animations/hoverAnimations'
import { useSmoothScroll } from '../context/smoothScroll'

const variants = {
  solid:
    'bg-[var(--c-fg)] text-[var(--c-bg)] hover:bg-signal hover:text-ink',
  outline:
    'border border-current/25 hover:border-current text-[var(--c-fg)]',
  ghost: 'text-[var(--c-fg)]',
}

/**
 * Pill button with magnetic attraction on pointer devices.
 * Renders an <a> when `href` is present, otherwise a <button>.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  size = 'md',
  className = '',
  strength = 0.3,
  cursor = 'link',
  ...rest
}) {
  const ref = useRef(null)
  const innerRef = useRef(null)
  const { env } = useSmoothScroll()

  useEffect(() => {
    if (!env.pointerFX) return undefined
    return magnetic(ref.current, innerRef.current, { strength })
  }, [env.pointerFX, strength])

  const sizes = {
    sm: 'h-10 px-5 text-[13px]',
    md: 'h-12 px-6 text-[14px]',
    lg: 'h-14 px-8 text-[15px]',
  }

  const cls = [
    'group relative inline-flex items-center justify-center gap-2 rounded-full select-none',
    'font-medium tracking-[-0.01em] whitespace-nowrap will-transform',
    'transition-[background-color,color,border-color] duration-500 [transition-timing-function:var(--ease-out-expo)]',
    variants[variant],
    sizes[size],
    className,
  ].join(' ')

  const content = (
    <span ref={innerRef} className="inline-flex items-center gap-2 will-transform">
      {children}
    </span>
  )

  if (href) {
    return (
      <a ref={ref} href={href} className={cls} onClick={onClick} data-cursor={cursor} {...rest}>
        {content}
      </a>
    )
  }
  return (
    <button ref={ref} type="button" className={cls} onClick={onClick} data-cursor={cursor} {...rest}>
      {content}
    </button>
  )
}
