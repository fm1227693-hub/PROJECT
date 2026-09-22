/**
 * BLUE RIBBON 2D — 0 dan sekin cho'zilib boradi, cho'zilayotgani ko'rinib turadi
 * Boshidan taxlanmagan, scroll 0 da ko'rinmaydi, scroll qilganda sekin cho'ziladi
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

      velocityRef.current = delta * 0.12
      lastScroll.current = current
      isScrolling.current = true

      const baseY = -scrollProgress * 40
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
    let currentDraw = 0
    let currentDraw2 = 0
    let currentDrawH = 0

    const animate = () => {
      if (isScrolling.current) {
        currentY.current += (targetY.current - currentY.current) * 0.05
        currentX.current += (targetX.current - currentX.current) * 0.05
      } else {
        currentY.current += (-scrollProgress * 40 - currentY.current) * 0.012
        currentX.current += (0 - currentX.current) * 0.015
        velocityRef.current *= 0.94
      }

      if (containerRef.current) {
        containerRef.current.style.transform = `translate3d(${currentX.current}px, ${currentY.current}px, 0) rotate(${velocityRef.current * 0.015}deg)`
      }

      // JUDA SEKIN cho'zilish — ko'rinib turishi uchun
      // Oldin: 1.15 tez edi, endi 0.42 juda sekin, butun sahifa bo'ylab cho'ziladi
      // 0% scroll da 0%, 100% scroll da 42% cho'zilgan — sekin ko'rinadi
      // Yoki 0-100% scroll da 0-95% cho'zilish uchun 0.95 emas, 0.55 sekin
      const targetDraw = Math.min(Math.max(scrollProgress * 0.42, 0), 0.92)
      const targetDraw2 = Math.min(Math.max((scrollProgress - 0.12) * 0.36, 0), 0.78)
      const targetDrawH = Math.min(Math.max((scrollProgress - 0.18) * 0.32, 0), 0.65)

      // Lerp juda sekin — 0.025, cho'zilayotgani ko'rinib turadi
      currentDraw += (targetDraw - currentDraw) * 0.025
      currentDraw2 += (targetDraw2 - currentDraw2) * 0.022
      currentDrawH += (targetDrawH - currentDrawH) * 0.02

      if (pathRef.current && length > 0) {
        const offset = length * (1 - currentDraw)
        pathRef.current.style.strokeDashoffset = `${offset}`

        const baseWidth = 22
        const extra = Math.abs(velocityRef.current) * 0.18 + currentDraw * 0.8
        pathRef.current.setAttribute('stroke-width', `${baseWidth + extra}`)
        pathRef.current.style.opacity = `${0.12 + currentDraw * 0.88}`

        // Uchida glow nuqta — cho'zilayotgani ko'rinadi
        const glowIntensity = isScrolling.current ? 0.35 : 0.22
        pathRef.current.style.filter = `drop-shadow(0 0 ${8 + currentDraw * 6}px rgba(37,99,235,${glowIntensity})) drop-shadow(0 6px 12px rgba(37,99,235,0.22))`
      }

      if (path2Ref.current && length2 > 0) {
        const offset2 = length2 * (1 - currentDraw2)
        path2Ref.current.style.strokeDashoffset = `${offset2}`
        path2Ref.current.style.opacity = `${currentDraw2 * 0.42}`
      }

      if (highlightRef.current) {
        const hl = highlightRef.current.getTotalLength()
        highlightRef.current.style.strokeDashoffset = `${hl * (1 - currentDrawH)}`
        highlightRef.current.style.opacity = `${currentDrawH * 0.18}`
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
          <filter id="glowSlow" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="10" stdDeviation="14" floodColor="#2563eb" floodOpacity="0.32" />
            <feDropShadow dx="0" dy="3" stdDeviation="5" floodColor="#1d4ed8" floodOpacity="0.38" />
          </filter>
        </defs>

        {/* Main — sekin 0 dan cho'ziladi, ko'rinib turadi */}
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
          filter="url(#glowSlow)"
          opacity="0.12"
          style={{ strokeDasharray: '1000', strokeDashoffset: '1000' }}
        />

        {/* Secondary — yanada sekin, kechikib */}
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

        {/* Highlight — eng sekin */}
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
          strokeWidth="2.5"
          strokeLinecap="round"
          opacity="0"
          style={{ strokeDasharray: '500', strokeDashoffset: '500' }}
        />
      </svg>

      {/* Chapda progress + cho'zilish foizi */}
      <div className="absolute top-0 left-0 w-[3px] h-full bg-black/[0.05] hidden md:block">
        <div
          className="w-full bg-[#2563eb] ease-out"
          style={{
            height: `${scrollProgress * 100}%`,
            boxShadow: '0 0 14px rgba(37,99,235,0.6)',
            transition: 'height 0.15s ease-out',
          }}
        />
      </div>
      <div className="absolute bottom-8 left-6 md:left-10 hidden md:block bg-white/80 backdrop-blur-[12px] border border-black/10 rounded-full px-3 py-1.5 text-[10px] font-mono tracking-[0.12em] text-black/50">
        BLUE DRAW: {Math.round(scrollProgress * 42)}% • SEKIN CHO'ZILMOQDA
      </div>
    </div>
  )
}
