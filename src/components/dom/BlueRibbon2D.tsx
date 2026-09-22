/**
 * BLUE RIBBON 2D — Ko'rinadigan, 0 dan sekin cho'zilib boradi
 * Boshidan 8% ko'rinadi, keyin scroll bilan 0-95% gacha sekin cho'ziladi
 * Yengil, lag yo'q, butun sayt bo'ylab
 */

import { useEffect, useRef, useState } from 'react'

interface BlueRibbon2DProps {
  scrollProgress?: number
}

export default function BlueRibbon2D({ scrollProgress = 0 }: BlueRibbon2DProps) {
  const pathRef = useRef<SVGPathElement>(null)
  const path2Ref = useRef<SVGPathElement>(null)
  const highlightRef = useRef<SVGPathElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const velocityRef = useRef(0)
  const lastScroll = useRef(0)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const targetX = useRef(0)
  const currentX = useRef(0)
  const isScrolling = useRef(false)
  const timeoutRef = useRef<number | null>(null)
  const [length, setLength] = useState(0)
  const [length2, setLength2] = useState(0)

  useEffect(() => {
    if (pathRef.current) {
      const l = pathRef.current.getTotalLength()
      setLength(l)
      pathRef.current.style.strokeDasharray = `${l}`
      pathRef.current.style.strokeDashoffset = `${l * 0.92}` // boshidan 8% ko'rinadi
    }
    if (path2Ref.current) {
      const l2 = path2Ref.current.getTotalLength()
      setLength2(l2)
      path2Ref.current.style.strokeDasharray = `${l2}`
      path2Ref.current.style.strokeDashoffset = `${l2}`
    }
    if (highlightRef.current) {
      const lh = highlightRef.current.getTotalLength()
      highlightRef.current.style.strokeDasharray = `${lh}`
      highlightRef.current.style.strokeDashoffset = `${lh}`
    }
  }, [])

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const vel = e.detail.velocity || 0
      const delta = current - lastScroll.current

      velocityRef.current = delta * 0.12
      lastScroll.current = current
      isScrolling.current = true

      const baseY = -scrollProgress * 30
      const kick = velocityRef.current * 1.8
      targetY.current = baseY + kick
      targetX.current = vel * 0.06

      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
      timeoutRef.current = window.setTimeout(() => {
        isScrolling.current = false
        velocityRef.current *= 0.88
      }, 150) as any
    }

    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => {
      window.removeEventListener('lusion-scroll' as any, onScroll as any)
      if (timeoutRef.current) window.clearTimeout(timeoutRef.current)
    }
  }, [scrollProgress])

  useEffect(() => {
    let raf = 0
    let currentDraw = 0.08
    let currentDraw2 = 0
    let currentDrawH = 0

    const animate = () => {
      if (isScrolling.current) {
        currentY.current += (targetY.current - currentY.current) * 0.22
        currentX.current += (targetX.current - currentX.current) * 0.22
      } else {
        currentY.current += (-scrollProgress * 30 - currentY.current) * 0.08
        currentX.current += (0 - currentX.current) * 0.08
        velocityRef.current *= 0.86
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0) rotate(${velocityRef.current * 0.02}deg)`
      }

      // Yana tezlashtirildi — deyarli sinxron
      const targetDraw = Math.min(0.08 + scrollProgress * 0.96, 0.99)
      const targetDraw2 = Math.min(Math.max((scrollProgress - 0.04) * 0.88, 0), 0.92)
      const targetDrawH = Math.min(Math.max((scrollProgress - 0.06) * 0.78, 0), 0.82)

      currentDraw += (targetDraw - currentDraw) * 0.22
      currentDraw2 += (targetDraw2 - currentDraw2) * 0.2
      currentDrawH += (targetDrawH - currentDrawH) * 0.18

      if (pathRef.current && length > 0) {
        const offset = length * (1 - currentDraw)
        pathRef.current.style.strokeDashoffset = `${offset}`

        const baseWidth = 26
        const extra = Math.abs(velocityRef.current) * 0.18 + currentDraw * 1.2
        pathRef.current.setAttribute('stroke-width', `${baseWidth + extra}`)
        pathRef.current.style.opacity = `${0.45 + currentDraw * 0.55}`

        const glowIntensity = isScrolling.current ? 0.48 : 0.34
        pathRef.current.style.filter = `drop-shadow(0 0 ${12 + currentDraw * 8}px rgba(37,99,235,${glowIntensity})) drop-shadow(0 10px 20px rgba(37,99,235,0.34))`
      }

      if (path2Ref.current && length2 > 0) {
        const offset2 = length2 * (1 - currentDraw2)
        path2Ref.current.style.strokeDashoffset = `${offset2}`
        path2Ref.current.style.opacity = `${0.2 + currentDraw2 * 0.4}`
      }

      if (highlightRef.current) {
        const hl = highlightRef.current.getTotalLength()
        highlightRef.current.style.strokeDashoffset = `${hl * (1 - currentDrawH)}`
        highlightRef.current.style.opacity = `${currentDrawH * 0.24}`
      }

      raf = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(raf)
  }, [scrollProgress, length, length2])

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
          <linearGradient id="blueGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1d4ed8" />
            <stop offset="50%" stopColor="#2563eb" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
          <filter id="glowVisible" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#2563eb" floodOpacity="0.38" />
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1d4ed8" floodOpacity="0.45" />
          </filter>
        </defs>

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
          strokeWidth="26"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glowVisible)"
          opacity="0.45"
          style={{ strokeDasharray: '1000', strokeDashoffset: '920' }}
        />

        <path
          ref={path2Ref}
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
          strokeWidth="12"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0.2"
          style={{ strokeDasharray: '1000', strokeDashoffset: '1000' }}
        />

        <path
          ref={highlightRef}
          d="
            M -100,105
            C 200,285  500,125  700,325
              900,525  1100,285  1350,455
              1200,705  900,655  700,905
              500,1160  800,1310  1100,1460
          "
          fill="none"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          opacity="0"
          style={{ strokeDasharray: '500', strokeDashoffset: '500' }}
        />
      </svg>

      <div className="absolute top-0 left-0 w-[4px] h-full bg-black/[0.06] hidden md:block">
        <div
          className="w-full bg-[#2563eb]"
          style={{
            height: `${scrollProgress * 100}%`,
            boxShadow: '0 0 16px rgba(37,99,235,0.7)',
            transition: 'height 0.12s ease-out',
          }}
        />
      </div>
      <div className="absolute bottom-8 left-6 md:left-10 bg-white/90 backdrop-blur-[12px] border border-black/10 rounded-full px-4 py-2 text-[11px] font-mono tracking-[0.12em] text-black/60 shadow-[0_4px_16px_rgba(0,0,0,0.08)]">
        BLUE: {Math.round((0.08 + scrollProgress * 0.88) * 100)}% • KO'RINIB TURIBDI • SEKIN CHO'ZILADI
      </div>
    </div>
  )
}
