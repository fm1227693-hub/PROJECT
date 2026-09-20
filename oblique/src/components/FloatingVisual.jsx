import { useRef } from 'react'
import { useMouseParallax } from '../hooks/useMouseParallax'

/**
 * A positioned, floating element with four transform layers:
 *  1. outer  → scroll-driven motion (owned by the section's scrub timeline)
 *  2. second → pointer parallax (owned by useMouseParallax)
 *  3. third  → entrance animation (owned by the intro timeline)
 *  4. inner  → static rotation / hover effects
 * Separating layers means GSAP tweens never fight over the same transform.
 */
export default function FloatingVisual({
  children,
  className = '',
  style,
  depth = 1,
  rotate = 0,
  speed = 1,
  drift = 0,
  spin = 0,
  parallax = 18,
  dataAttr = 'data-hero-float',
  innerClassName = '',
  ...rest
}) {
  const parallaxRef = useRef(null)
  useMouseParallax(parallaxRef, { strength: parallax * depth, rotate: 0 })

  const outerProps = {
    [dataAttr]: speed,
    'data-hero-drift': drift,
    'data-hero-spin': spin,
  }

  return (
    <div
      className={`pointer-events-none absolute will-transform ${className}`}
      style={style}
      {...outerProps}
      {...rest}
    >
      <div ref={parallaxRef} className="will-transform">
        <div data-hero-float-intro className="will-transform">
          <div
            className={`pointer-events-auto ${innerClassName}`}
            style={{ transform: rotate ? `rotate(${rotate}deg)` : undefined }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
