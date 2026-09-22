/**
 * BLUE RIBBON 2D — Yengil, lag qilmaydi, qotib qolmaydi
 * 3D o'rniga 2D SVG, faqat scroll paytida tartibli harakatlanadi
 * Butun sayt bo'ylab hamma yerda ko'rinadi
 */

import { useEffect, useRef } from 'react'

interface BlueRibbon2DProps {
  scrollProgress?: number
}

export default function BlueRibbon2D({ scrollProgress = 0 }: BlueRibbon2DProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const velocityRef = useRef(0)
  const lastScroll = useRef(0)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const targetX = useRef(0)
  const currentX = useRef(0)
  const isScrolling = useRef(false)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const vel = e.detail.velocity || 0
      const delta = current - lastScroll.current

      velocityRef.current = delta * 0.18
      lastScroll.current = current
      isScrolling.current = true

      // Pastga qilinsa pastga, tepaga qilinsa tepaga — tartibli
      const baseY = -scrollProgress * 180
      const kick = velocityRef.current * 3.5
      targetY.current = baseY + kick
      targetX.current = vel * 0.12

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        isScrolling.current = false
        velocityRef.current *= 0.85
      }, 120) as any
    }

    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => {
      window.removeEventListener('lusion-scroll' as any, onScroll as any)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [scrollProgress])

  useEffect(() => {
    let raf = 0
    const animate = () => {
      if (isScrolling.current) {
        currentY.current += (targetY.current - currentY.current) * 0.08
        currentX.current += (targetX.current - currentX.current) * 0.08
      } else {
        currentY.current += (-scrollProgress * 180 - currentY.current) * 0.02
        currentX.current += (0 - currentX.current) * 0.03
        velocityRef.current *= 0.88
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0) rotate(${velocityRef.current * 0.04}deg)`
      }

      if (pathRef.current) {
        // Scroll paytida qalinlashadi
        const baseWidth = 22
        const extra = Math.abs(velocityRef.current) * 0.5
        pathRef.current.setAttribute('stroke-width', `${baseWidth + extra}`)
      }

      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 w-full h-full pointer-events-none will-change-transform"
      style={{ transform: 'translate3d(0,0,0)' }}
    >
      <svg
        width="100%"
        height="200%"
        viewBox="0 0 1440 2800"
        preserveAspectRatio="none"
        className="absolute inset-0 w-full h-[200%] -top-[20%]"
        style={{ overflow: 'visible' }}
      >
        <defs>
          {/* Glossy royal blue gradient */}
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#2563eb" floodOpacity="0.25" />
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1d4ed8" floodOpacity="0.3" />
          </filter>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="1.2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Main thick blue ribbon — butun sayt bo'ylab, 12 points winding */}
        <path
          ref={pathRef}
          d="
            M -100,100
            C 200,280  500,120  700,320
              900,520  1100,280  1350,450
              1200,700  900,650  700,900
              500,1150  800,1300  1100,1450
              1300,1700  1000,1850  750,2100
              500,2350  200,2200  -50,2500
              100,2750  400,2600  700,2800
          "
          fill="none"
          stroke="url(#blueGrad)"
          strokeWidth="22"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
          style={{ filter: 'url(#glow)' }}
          opacity="0.95"
        />

        {/* Secondary thinner ribbon for depth */}
        <path
          d="
            M -80,180
            C 250,350  550,200  750,380
              950,560  1050,350  1280,520
              1150,760  880,710  680,960
              480,1210  760,1360  1050,1510
              1240,1750  960,1900  710,2150
              460,2400  180,2260  -30,2560
          "
          fill="none"
          stroke="#3b82f6"
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.45"
        />

        {/* Subtle highlight line */}
        <path
          d="
            M -100,105
            C 200,285  500,125  700,325
              900,525  1100,285  1350,455
          "
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.18"
        />
      </svg>
    </div>
  )
}
