/**
 * BLUE RIBBON 2D — ULTRA LIGHTWEIGHT NO LAG
 * No continuous RAF, scroll-driven only, GPU transforms
 */

import { useEffect, useRef, useState, useMemo } from 'react'

interface BlueRibbon2DProps {
  scrollProgress?: number
}

export default function BlueRibbon2D({ scrollProgress = 0 }: BlueRibbon2DProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [length, setLength] = useState<number>(1000)

  useEffect(() => {
    if (pathRef.current) {
      const l = pathRef.current.getTotalLength()
      setLength(l)
    }
  }, [])

  const style = useMemo(() => {
    const p = scrollProgress
    // 0-100% draw
    const draw = Math.min(0.08 + p * 0.92, 1)
    const offset = length * (1 - draw)
    const opacity = 0.5 + draw * 0.5
    const y = -p * 24
    const scale = 1 + p * 0.02

    return {
      dashOffset: offset,
      opacity,
      transform: `translate3d(0, ${y}px, 0) scale(${scale})`,
    }
  }, [scrollProgress, length])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 w-full h-[92vh] pointer-events-none will-change-transform"
      style={{ transform: style.transform }}
    >
      <svg width="100%" height="100%" viewBox="0 0 1440 900" preserveAspectRatio="none" className="absolute inset-0 w-full h-full" style={{ overflow: 'visible' }}>
        <defs>
          <linearGradient id="blueGradLight" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>

        <path
          ref={pathRef}
          d="M -100,100 C 200,280 500,120 700,320 900,520 1100,280 1350,450 1200,700 900,650 700,900"
          fill="none"
          stroke="url(#blueGradLight)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={style.opacity}
          style={{
            strokeDasharray: length,
            strokeDashoffset: style.dashOffset,
            willChange: 'stroke-dashoffset',
          }}
        />
      </svg>

      <div className="absolute top-0 left-0 w-[3px] h-full bg-black/[0.04] hidden md:block">
        <div className="w-full bg-[#2563eb] origin-top will-change-transform" style={{ transform: `scaleY(${Math.min(scrollProgress * 1.5, 1)})`, height: '100%' }} />
      </div>
    </div>
  )
}
