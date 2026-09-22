/**
 * GLOBAL BLUE RIBBON — Butun sayt bo'ylab ko'k lenta
 * Faqat 1 ta qismda emas, balki butun sayt da bolsin per user request
 * Thick smooth continuous 3D organic extruded spline/tube #2563eb glossy
 * Scroll bilan pastga/tepaga yuradi, butun sayt bo'ylab ko'rinadi
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GlobalBlueRibbonProps {
  scrollProgress?: number
}

export default function GlobalBlueRibbon({ scrollProgress = 0 }: GlobalBlueRibbonProps) {
  const tubeRef = useRef<THREE.Mesh>(null)
  const tubeRef2 = useRef<THREE.Mesh>(null)
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null)
  const curveRef2 = useRef<THREE.CatmullRomCurve3 | null>(null)

  const scrollVelocitySigned = useRef(0)
  const lastScroll = useRef(0)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const targetX = useRef(0)
  const currentX = useRef(0)

  // Main ribbon — butun sayt bo'ylab, vertikal uzun
  const { curve, tubeGeo } = useMemo(() => {
    const points: THREE.Vector3[] = []
    // 120 points spanning vertically across entire site (from -15 to +25)
    for (let i = 0; i < 120; i++) {
      const t = i / 119
      // X winds smoothly
      const x = Math.sin(t * Math.PI * 3.5) * 8 + Math.cos(t * Math.PI * 1.8) * 4 + (t - 0.5) * 6
      // Y spans entire site height
      const y = (t - 0.5) * 45 // -22.5 to +22.5 covers whole site
      // Z dips in and out behind content
      const z = Math.cos(t * Math.PI * 2.2) * 3.5 + Math.sin(t * Math.PI * 3.8) * 1.2 - 2.5
      points.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.6)
    const tubeGeo = new THREE.TubeGeometry(curve, 240, 0.28, 16, false)
    return { curve, tubeGeo }
  }, [])

  // Second ribbon — secondary layer for depth, thinner
  const { curve: curve2, tubeGeo: tubeGeo2 } = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < 100; i++) {
      const t = i / 99
      const x = Math.cos(t * Math.PI * 2.8) * 7 + Math.sin(t * Math.PI * 1.5) * 3 + (t - 0.5) * 5
      const y = (t - 0.5) * 50
      const z = Math.sin(t * Math.PI * 2.5) * 2.8 + Math.cos(t * Math.PI * 1.2) * 1.5 - 3.2
      points.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.55)
    const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.14, 12, false)
    return { curve, tubeGeo }
  }, [])

  curveRef.current = curve
  curveRef2.current = curve2

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const velocity = e.detail.velocity || 0
      const direction = e.detail.direction || 1
      const delta = current - lastScroll.current

      scrollVelocitySigned.current = THREE.MathUtils.lerp(scrollVelocitySigned.current, delta * 0.14, 0.2)
      lastScroll.current = current

      // Butun sayt bo'ylab harakat — pastga/tepaga
      // Scroll progress 0..1 maps to -22 to +22, plus velocity kick
      const baseY = -scrollProgress * 18
      const velocityKick = scrollVelocitySigned.current * 3.2
      targetY.current = baseY + velocityKick
      targetX.current = velocity * 0.02 * direction
    }

    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => window.removeEventListener('lusion-scroll' as any, onScroll as any)
  }, [scrollProgress])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (!tubeRef.current || !curveRef.current) return

    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, 0.05)
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, 0.06)

    scrollVelocitySigned.current *= 0.91
    if (Math.abs(scrollVelocitySigned.current) < 0.001) scrollVelocitySigned.current = 0
    if (Math.abs(scrollVelocitySigned.current) < 0.01) {
      targetY.current = THREE.MathUtils.lerp(targetY.current, -scrollProgress * 18, 0.04)
      targetX.current = THREE.MathUtils.lerp(targetX.current, 0, 0.05)
    }

    // Animate main ribbon points — butun sayt bo'ylab winding
    const points = curveRef.current.points
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      const baseX = Math.sin(t * Math.PI * 3.5 + time * 0.25) * 8 + Math.cos(t * Math.PI * 1.8 + time * 0.15) * 4 + (t - 0.5) * 6
      const baseY = (t - 0.5) * 45
      const baseZ = Math.cos(t * Math.PI * 2.2 + time * 0.22) * 3.5 + Math.sin(t * Math.PI * 3.8 + time * 0.32) * 1.2 - 2.5

      const velocityOffsetY = scrollVelocitySigned.current * Math.sin(t * Math.PI * 1.2) * 1.5
      const velocityOffsetX = scrollVelocitySigned.current * 0.4 * Math.cos(t * Math.PI)

      points[i].x = baseX + velocityOffsetX + Math.sin(time * 0.15 + t * 1.5) * 0.3
      points[i].y = baseY + velocityOffsetY
      points[i].z = baseZ + Math.sin(time * 0.2 + t * 1.2) * 0.2 + scrollVelocitySigned.current * 0.18 * Math.sin(t * Math.PI * 2.2)
    }

    const newTube = new THREE.TubeGeometry(
      curveRef.current,
      240,
      0.28 + Math.sin(time * 0.6) * 0.04 + Math.abs(scrollVelocitySigned.current) * 0.06,
      16,
      false
    )
    tubeRef.current.geometry.dispose()
    tubeRef.current.geometry = newTube

    // Butun sayt bo'ylab ko'rinishi uchun position — pastga/tepaga yurishi
    tubeRef.current.position.y = currentY.current + Math.sin(time * 0.12) * 0.15
    tubeRef.current.position.x = currentX.current
    tubeRef.current.rotation.y = time * 0.03 + scrollProgress * 0.2 + currentX.current * 0.25
    tubeRef.current.rotation.z = scrollVelocitySigned.current * 0.04

    // Second ribbon
    if (tubeRef2.current && curveRef2.current) {
      const points2 = curveRef2.current.points
      for (let i = 0; i < points2.length; i++) {
        const t = i / (points2.length - 1)
        const baseX = Math.cos(t * Math.PI * 2.8 + time * 0.2) * 7 + Math.sin(t * Math.PI * 1.5 + time * 0.12) * 3 + (t - 0.5) * 5
        const baseY = (t - 0.5) * 50
        const baseZ = Math.sin(t * Math.PI * 2.5 + time * 0.18) * 2.8 + Math.cos(t * Math.PI * 1.2 + time * 0.1) * 1.5 - 3.2
        points2[i].x = baseX + scrollVelocitySigned.current * 0.2 * Math.cos(t * Math.PI)
        points2[i].y = baseY + scrollVelocitySigned.current * Math.sin(t * Math.PI) * 0.8
        points2[i].z = baseZ
      }
      const newTube2 = new THREE.TubeGeometry(curveRef2.current, 200, 0.14 + Math.abs(scrollVelocitySigned.current) * 0.03, 12, false)
      tubeRef2.current.geometry.dispose()
      tubeRef2.current.geometry = newTube2
      tubeRef2.current.position.y = currentY.current * 0.8 + Math.cos(time * 0.15) * 0.1
      tubeRef2.current.position.x = currentX.current * 0.6
      tubeRef2.current.rotation.y = time * 0.02 + scrollProgress * 0.15
    }
  })

  useEffect(() => {
    return () => {
      tubeGeo.dispose()
      tubeGeo2.dispose()
    }
  }, [tubeGeo, tubeGeo2])

  return (
    <group>
      {/* Main thick glossy royal-blue tube #2563eb — butun sayt bo'ylab */}
      <mesh ref={tubeRef} geometry={tubeGeo} position={[0, 0, -3]}>
        <meshPhysicalMaterial
          color="#2563eb"
          emissive="#1e40af"
          emissiveIntensity={0.22}
          roughness={0.18}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.14}
          transmission={0.06}
          ior={1.4}
          transparent={false}
        />
      </mesh>

      {/* Secondary thinner ribbon for depth */}
      <mesh ref={tubeRef2} geometry={tubeGeo2} position={[0, 0, -4.5]}>
        <meshPhysicalMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.12}
          roughness={0.28}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.22}
          transparent
          opacity={0.65}
        />
      </mesh>
    </group>
  )
}
