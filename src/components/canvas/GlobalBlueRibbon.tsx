/**
 * GLOBAL BLUE RIBBON — Butun sayt bo'ylab ko'k lenta
 * Tartibli: faqat scroll paytidagina harakatlanadi, idle da to'xtaydi
 * Thick smooth continuous 3D organic extruded spline/tube #2563eb glossy
 * Pastga qilinsa pastga, tepaga qilinsa tepaga — no gray overlay
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

interface GlobalBlueRibbonProps {
  scrollProgress?: number
}

export default function GlobalBlueRibbon({ scrollProgress = 0 }: GlobalBlueRibbonProps) {
  const tubeRef = useRef<THREE.Mesh>(null)
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null)

  const scrollVelocitySigned = useRef(0)
  const lastScroll = useRef(0)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const targetX = useRef(0)
  const currentX = useRef(0)
  const isScrolling = useRef(false)
  const scrollTimeout = useRef<number | null>(null)

  // Single ribbon — faqat hero qismida, qolgan joylarda ko'rinmasin
  const { curve, tubeGeo } = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < 120; i++) {
      const t = i / 119
      const x = Math.sin(t * Math.PI * 3.2) * 7.5 + Math.cos(t * Math.PI * 1.6) * 3.5 + (t - 0.5) * 5
      const y = (t - 0.5) * 12 // hero only - smaller vertical span
      const z = Math.cos(t * Math.PI * 2) * 3.2 + Math.sin(t * Math.PI * 3.5) * 1 - 2.8
      points.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.6)
    const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.28, 16, false)
    return { curve, tubeGeo }
  }, [])

  curveRef.current = curve

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const velocity = e.detail.velocity || 0
      const delta = current - lastScroll.current

      scrollVelocitySigned.current = delta * 0.18
      lastScroll.current = current
      isScrolling.current = true

      const baseY = -scrollProgress * 2.5 // hero only - subtle
      const velocityKick = scrollVelocitySigned.current * 2.2
      targetY.current = baseY + velocityKick
      targetX.current = velocity * 0.012

      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current)
      scrollTimeout.current = window.setTimeout(() => {
        isScrolling.current = false
        scrollVelocitySigned.current = 0
      }, 120) as any
    }

    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => {
      window.removeEventListener('lusion-scroll' as any, onScroll as any)
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current)
    }
  }, [scrollProgress])

  useFrame(() => {
    if (!tubeRef.current || !curveRef.current) return

    if (isScrolling.current) {
      currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, 0.08)
      currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, 0.08)
    } else {
      currentY.current = THREE.MathUtils.lerp(currentY.current, -scrollProgress * 2.5, 0.02)
      currentX.current = THREE.MathUtils.lerp(currentX.current, 0, 0.03)
      scrollVelocitySigned.current *= 0.88
    }

    const points = curveRef.current.points
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      const baseX = Math.sin(t * Math.PI * 3.2) * 7.5 + Math.cos(t * Math.PI * 1.6) * 3.5 + (t - 0.5) * 5
      const baseY = (t - 0.5) * 12
      const baseZ = Math.cos(t * Math.PI * 2) * 3.2 + Math.sin(t * Math.PI * 3.5) * 1 - 2.8

      const velocityOffsetY = scrollVelocitySigned.current * Math.sin(t * Math.PI * 1.1) * 1.4
      const velocityOffsetX = scrollVelocitySigned.current * 0.35 * Math.cos(t * Math.PI * 0.9)

      points[i].x = baseX + velocityOffsetX
      points[i].y = baseY + velocityOffsetY
      points[i].z = baseZ + scrollVelocitySigned.current * 0.16 * Math.sin(t * Math.PI * 2)
    }

    const radius = 0.28 + Math.abs(scrollVelocitySigned.current) * 0.07
    const newTube = new THREE.TubeGeometry(curveRef.current, 200, radius, 16, false)
    tubeRef.current.geometry.dispose()
    tubeRef.current.geometry = newTube

    tubeRef.current.position.y = currentY.current
    tubeRef.current.position.x = currentX.current
    tubeRef.current.rotation.y = scrollProgress * 0.18 + currentX.current * 0.22
    tubeRef.current.rotation.z = scrollVelocitySigned.current * 0.035
  })

  useEffect(() => {
    return () => {
      tubeGeo.dispose()
    }
  }, [tubeGeo])

  return (
    <group>
      <mesh ref={tubeRef} geometry={tubeGeo} position={[0, 0, -3]}>
        <meshPhysicalMaterial
          color="#2563eb"
          emissive="#1e40af"
          emissiveIntensity={0.2}
          roughness={0.18}
          metalness={0.15}
          clearcoat={1}
          clearcoatRoughness={0.14}
          transmission={0.05}
          ior={1.4}
        />
      </mesh>
    </group>
  )
}
