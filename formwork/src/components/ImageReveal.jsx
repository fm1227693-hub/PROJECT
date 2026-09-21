import { useRef } from 'react'
import { useGsap } from '../hooks/useGsap'
import { useCaps } from '../context/scroll'
import { imageReveal, parallax } from '../animations/scrollAnimations'

/**
 * Image inside a clipping frame. On enter the frame un-clips while the image
 * settles from a gentle zoom; optionally drifts with scroll afterwards.
 */
export default function ImageReveal({ src, alt, width, height, className = '', imgClassName = '', drift = 0, sizes, loading = 'lazy', priority = false, style }) {
  const frame = useRef(null)
  const img = useRef(null)
  const caps = useCaps()

  useGsap(() => {
    imageReveal(frame.current, img.current, { reduced: caps.reduced })
    if (drift) parallax(frame.current, drift, { scale: caps.parallax })
  }, frame, [caps.reduced, caps.parallax, drift])

  return (
    <div ref={frame} className={`relative overflow-hidden will-change-transform ${className}`} style={style}>
      <img
        ref={img}
        src={src}
        alt={alt}
        width={width}
        height={height}
        sizes={sizes}
        loading={priority ? 'eager' : loading}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        className={`h-full w-full object-cover will-change-transform ${imgClassName}`}
      />
    </div>
  )
}
