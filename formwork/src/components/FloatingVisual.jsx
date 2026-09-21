/**
 * A floating object with three transform layers so different systems never
 * fight over one transform:
 *   outer  [data-float]        — scroll-driven motion (GSAP)
 *   middle [data-depth]        — pointer parallax (rAF lerp)
 *   inner  [data-float-inner]  — entrance animation + static tilt
 */
export default function FloatingVisual({ name, depth = 0.03, absolute = true, className = '', innerClassName = '', style, children }) {
  return (
    <div data-float={name} className={`${absolute ? 'absolute' : 'relative'} will-change-transform ${className}`} style={style}>
      <div data-depth={depth} className="will-change-transform">
        <div data-float-inner className={innerClassName}>
          {children}
        </div>
      </div>
    </div>
  )
}
