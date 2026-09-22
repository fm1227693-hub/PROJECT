/**
 * BLUE RIBBON 2D — 0 dan cho'zilib boradi, scroll paytida
 * Boshidan taxlanmagan, scroll 0 da ko'rinmaydi, scroll qilganda cho'ziladi
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

  // Path length for dash animation
  useEffect(() => {
    if (pathRef.current) {
      const l = pathRef.current.getTotalLength()
      setLength(l)
      pathRef.current.style.strokeDasharray = `${l}`
      pathRef.current.style.strokeDashoffset = `${l}`
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

      velocityRef.current = delta * 0.18
      lastScroll.current = current
      isScrolling.current = true

      const baseY = -scrollProgress * 80 // subtle parallax, not full hide
      const kick = velocityRef.current * 2.2
      targetY.current = baseY + kick
      targetX.current = vel * 0.08

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
        currentY.current += (-scrollProgress * 80 - currentY.current) * 0.02
        currentX.current += (0 - currentX.current) * 0.03
        velocityRef.current *= 0.88
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0) rotate(${velocityRef.current * 0.03}deg)`
      }

      // 0 dan cho'zilib borish — scrollProgress bo'yicha dashoffset
      // scroll 0 da 0% ko'rinadi, scroll 1 da 100% cho'ziladi
      if (pathRef.current && length > 0) {
        const drawProgress = Math.min(Math.max(scrollProgress * 1.15, 0), 1) // 0->1 bo'yicha cho'ziladi
        const offset = length * (1 - drawProgress)
        pathRef.current.style.strokeDashoffset = `${offset}`

        // Qalinlashish scroll paytida
        const baseWidth = 22
        const extra = Math.abs(velocityRef.current) * 0.4 + drawProgress * 2
        pathRef.current.setAttribute('stroke-width', `${baseWidth + extra}`)
        pathRef.current.style.opacity = `${0.2 + drawProgress * 0.8}`
      }

      if (path2Ref.current && length2 > 0) {
        const drawProgress2 = Math.min(Math.max((scrollProgress - 0.05) * 1.1, 0), 1) // biroz kechikib
        const offset2 = length2 * (1 - drawProgress2)
        path2Ref.current.style.strokeDashoffset = `${offset2}`
        path2Ref.current.style.opacity = `${drawProgress2 * 0.5}`
      }

      if (highlightRef.current) {
        const hl = highlightRef.current.getTotalLength()
        const drawH = Math.min(Math.max(scrollProgress * 1.3, 0), 1)
        highlightRef.current.style.strokeDashoffset = `${hl * (1 - drawH)}`
        highlightRef.current.style.opacity = `${drawH * 0.22}`
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
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#2563eb" floodOpacity="0.28" />
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#1d4ed8" floodOpacity="0.35" />
          </filter>
        </defs>

        {/* Main — 0 dan cho'ziladi */}
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
          opacity="0.2"
          style={{ strokeDasharray: '1000', strokeDashoffset: '1000' }}
        />

        {/* Secondary — kechikib cho'ziladi */}
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
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity="0"
          style={{ strokeDasharray: '1000', strokeDashoffset: '1000' }}
        />

        {/* Highlight — eng kechikib */}
        <path
          ref={highlightRef}
          d="
            M -100,105
            C 200,285  500,125  700,325
              900,525  1100,285  1350,455
              1200,705  900,655  700,905
          "
          fill="none"
          stroke="white"
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0"
          style={{ strokeDasharray: '500', strokeDashoffset: '500' }}
        />
      </svg>

      {/* Scroll progress indicator — ko'k chiziq qancha cho'zilganini ko'rsatadi */}
      <div className="absolute top-0 left-0 w-[3px] h-full bg-black/[0.04] hidden md:block">
        <div
          className="w-full bg-[#2563eb] transition-all duration-100 ease-out"
          style={{ height: `${scrollProgress * 100}%`, boxShadow: '0 0 12px rgba(37,99,235,0.5)' }}
        />
      </div>
    </div>
  )
}
