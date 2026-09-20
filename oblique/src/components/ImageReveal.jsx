import { useRef } from 'react'
import { useGSAP } from '../lib/gsap'
import { parallaxY, revealImage } from '../animations/scrollAnimations'
import { useSmoothScroll } from '../context/smoothScroll'

/**
 * An image that is revealed by un-cropping and that drifts slightly while
 * scrolling. The parallax travel is reduced on touch devices.
 */
export default function ImageReveal({
  src,
  srcSet,
  sizes,
  alt = '',
  ratio = '4 / 5',
  className = '',
  imgClassName = '',
  parallax = 60,
  reveal = true,
  loading = 'lazy',
  radius = 'rounded-[4px]',
  ...rest
}) {
  const wrapRef = useRef(null)
  const imgRef = useRef(null)
  const { env } = useSmoothScroll()

  useGSAP(
    () => {
      if (env.reduced) return
      if (reveal) revealImage(wrapRef.current, imgRef.current)
      if (parallax) parallaxY(imgRef.current, env.touch ? parallax * 0.4 : parallax, { trigger: wrapRef.current })
    },
    { scope: wrapRef, dependencies: [env.reduced, env.touch, parallax, reveal] },
  )

  return (
    <div
      ref={wrapRef}
      className={`relative overflow-hidden ${radius} ${className}`}
      style={{ aspectRatio: ratio }}
      {...rest}
    >
      <img
        ref={imgRef}
        src={src}
        srcSet={srcSet}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        className={`absolute inset-0 h-full w-full object-cover will-transform ${imgClassName}`}
        style={parallax ? { height: '116%', top: '-8%' } : undefined}
      />
    </div>
  )
}
