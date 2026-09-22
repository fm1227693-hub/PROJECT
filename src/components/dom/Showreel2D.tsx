/**
 * SHOWREEL 2D — Yengil, lag yo'q, qotib qolmaydi
 * 3D o'rniga 2D div, rounded 16:7, docking + hover animatsiyalar
 */

import { useEffect, useRef, useState } from 'react'

interface Showreel2DProps {
  scrollProgress?: number
  onHoverChange?: (hovering: boolean) => void
}

export default function Showreel2D({ scrollProgress = 0, onHoverChange }: Showreel2DProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isHovering, setIsHovering] = useState(false)
  const velocityRef = useRef(0)
  const lastScroll = useRef(0)

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const delta = current - lastScroll.current
      velocityRef.current = delta
      lastScroll.current = current
    }
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => window.removeEventListener('lusion-scroll' as any, onScroll as any)
  }, [])

  const dockProgress = Math.min(Math.max((scrollProgress - 0.12) / 0.5, 0), 1)

  // Docking: centered 1.0 -> lower-left 0.55x, -5deg tilt
  const scale = 1 - dockProgress * 0.45
  const x = -dockProgress * 520 // lower-left
  const y = -dockProgress * 180
  const rotate = -dockProgress * 5
  const velocityTilt = velocityRef.current * 0.04

  return (
    <div
      ref={containerRef}
      className="fixed z-[1] w-full h-[92vh] top-0 left-0 pointer-events-none flex items-center justify-center"
      style={{ perspective: '2000px' }}
    >
      <div
        className="relative pointer-events-auto will-change-transform cursor-pointer"
        style={{
          width: 'min(82vw, 960px)',
          aspectRatio: '16 / 7',
          transform: `translate3d(${x}px, ${y}px, 0) scale(${scale}) rotate(${rotate + velocityTilt}deg) rotateX(${dockProgress * -2}deg) rotateY(${dockProgress * 2}deg)`,
          transformOrigin: 'center center',
          transition: isHovering ? 'transform 0.15s ease-out' : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
        onMouseEnter={() => {
          setIsHovering(true)
          onHoverChange?.(true)
        }}
        onMouseLeave={() => {
          setIsHovering(false)
          onHoverChange?.(false)
        }}
      >
        {/* Rounded showcase frame */}
        <div
          className="relative w-full h-full rounded-[18px] md:rounded-[24px] overflow-hidden bg-[#f6f6f8] border border-black/[0.06] shadow-[0_24px_64px_rgba(0,0,0,0.12)] will-change-transform"
          style={{
            transform: `scale(${isHovering ? 1.02 : 1})`,
            transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease',
            boxShadow: isHovering
              ? '0 32px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(37,99,235,0.12)'
              : '0 24px 64px rgba(0,0,0,0.12)',
          }}
        >
          {/* Vibrant media — high-energy looping */}
          <div className="absolute inset-0">
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, #ffffff 0%, #eef2ff 40%, #dbeafe 100%)`,
              }}
            />
            {/* Animated blobs — 2D CSS, no canvas */}
            <div className="absolute inset-0 overflow-hidden">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full will-change-transform"
                  style={{
                    width: `${80 + i * 20}px`,
                    height: `${80 + i * 20}px`,
                    left: `${15 + i * 14}%`,
                    top: `${20 + (i % 3) * 22}%`,
                    background: i % 2 === 0 ? '#2563eb' : '#0b0b0d',
                    opacity: 0.06 + (isHovering ? 0.06 : 0),
                    transform: `translate3d(${Math.sin(Date.now() * 0.0005 + i) * (10 + i * 2)}px, ${Math.cos(Date.now() * 0.0004 + i) * (8 + i)}px, 0) scale(${isHovering ? 1.2 : 1})`,
                    transition: 'transform 0.6s ease-out, opacity 0.4s ease',
                    filter: 'blur(0.5px)',
                  }}
                />
              ))}
            </div>

            {/* Liquid glass overlay */}
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500"
              style={{
                opacity: isHovering ? 0.12 : 0,
                background: `radial-gradient(600px circle at 50% 50%, rgba(37,99,235,0.18), transparent 70%)`,
              }}
            />

            {/* Grain */}
            <div
              className="absolute inset-0 opacity-[0.03] mix-blend-multiply"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              }}
            />
          </div>

          {/* Hover blue glow border */}
          <div
            className="absolute inset-0 rounded-[18px] md:rounded-[24px] pointer-events-none transition-opacity duration-500"
            style={{
              opacity: isHovering ? 1 : 0,
              boxShadow: 'inset 0 0 0 1.5px rgba(37,99,235,0.35), inset 0 0 24px rgba(37,99,235,0.12)',
            }}
          />

          {/* Subtle inner highlight */}
          <div className="absolute inset-[1px] rounded-[17px] md:rounded-[23px] pointer-events-none border border-white/40" />
        </div>

        {/* Soft shadow */}
        <div
          className="absolute -bottom-6 left-1/2 -translate-x-1/2 w-[92%] h-[24px] bg-black/10 blur-[16px] rounded-full pointer-events-none transition-all duration-500"
          style={{
            opacity: isHovering ? 0.18 : 0.08,
            transform: `translateX(-50%) scaleX(${isHovering ? 0.92 : 1})`,
          }}
        />
      </div>
    </div>
  )
}
