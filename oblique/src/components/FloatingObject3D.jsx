import { lazy, Suspense, useCallback, useEffect, useRef, useState } from 'react'
import { useSmoothScroll } from '../context/smoothScroll'

const BlobCanvas = lazy(() => import('./three/BlobCanvas.jsx'))

/**
 * Lazily mounts the WebGL object when it approaches the viewport.
 * Until then (and as a permanent fallback without WebGL) a soft CSS
 * sphere keeps the composition intact.
 */
export default function FloatingObject3D({ className = '' }) {
  const { env } = useSmoothScroll()
  const hostRef = useRef(null)
  const [near, setNear] = useState(() => !('IntersectionObserver' in window))
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const el = hostRef.current
    if (!el || !('IntersectionObserver' in window)) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true)
          io.disconnect()
        }
      },
      { rootMargin: '400px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onReady = useCallback(() => setReady(true), [])

  return (
    <div ref={hostRef} className={`relative aspect-square ${className}`} aria-hidden="true">
      {/* CSS fallback / placeholder */}
      <div
        className={`absolute inset-[12%] rounded-full transition-opacity duration-1000 ${ready ? 'opacity-0' : 'opacity-100'}`}
        style={{
          background:
            'radial-gradient(circle at 34% 28%, #f4f1ea 0%, #d8d3c8 38%, #9f988b 72%, #7a736a 100%)',
          boxShadow: 'inset -18px -22px 40px rgba(0,0,0,0.08)',
        }}
      />
      {/* Contact shadow */}
      <div
        className="absolute left-[18%] right-[18%] bottom-[2%] h-[10%] rounded-[50%] opacity-60"
        style={{ background: 'radial-gradient(ellipse at center, rgba(15,14,12,0.22), rgba(15,14,12,0) 70%)' }}
      />
      {near && (
        <Suspense fallback={null}>
          <BlobCanvas
            quality={env.touch ? 'low' : 'high'}
            reduced={env.reduced}
            pointer={env.pointerFX}
            onReady={onReady}
          />
        </Suspense>
      )}
    </div>
  )
}
