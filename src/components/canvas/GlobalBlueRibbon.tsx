/**
 * GLOBAL BLUE RIBBON — Butun sayt bo'ylab ko'k lenta
 * Tartibli: faqat scroll paytidagina harakatlanadi, idle da to'xtaydi
 * Thick smooth continuous 3D organic extruded spline/tube #2563eb glossy
 * Pastga qilinsa pastga, tepaga qilinsa tepaga
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
  const scrollVelocityAbs = useRef(0)
  const lastScroll = useRef(0)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const targetX = useRef(0)
  const currentX = useRef(0)
  const isScrolling = useRef(false)
  const scrollTimeout = useRef<number | null>(null)

  // Main ribbon — butun sayt bo'ylab, vertikal uzun, tartibli
  const { curve, tubeGeo } = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < 120; i++) {
      const t = i / 119
      const x = Math.sin(t * Math.PI * 3.2) * 7.5 + Math.cos(t * Math.PI * 1.6) * 3.5 + (t - 0.5) * 5
      const y = (t - 0.5) * 48
      const z = Math.cos(t * Math.PI * 2) * 3.2 + Math.sin(t * Math.PI * 3.5) * 1 - 2.8
      points.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.6)
    const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.28, 16, false)
    return { curve, tubeGeo }
  }, [])

  const { curve: curve2, tubeGeo: tubeGeo2 } = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < 90; i++) {
      const t = i / 89
      const x = Math.cos(t * Math.PI * 2.5) * 6.5 + Math.sin(t * Math.PI * 1.3) * 2.8
      const y = (t - 0.5) * 52
      const z = Math.sin(t * Math.PI * 2.2) * 2.5 - 3.5
      points.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.55)
    const tubeGeo = new THREE.TubeGeometry(curve, 180, 0.13, 12, false)
    return { curve, tubeGeo }
  }, [])

  curveRef.current = curve
  curveRef2.current = curve2

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const velocity = e.detail.velocity || 0
      const delta = current - lastScroll.current

      // Faqat scroll paytidagina harakat — signed velocity
      scrollVelocitySigned.current = delta * 0.18
      scrollVelocityAbs.current = Math.abs(velocity) * 0.12
      lastScroll.current = current
      isScrolling.current = true

      // Pastga qilinsa pastga, tepaga qilinsa tepaga — tartibli
      const baseY = -scrollProgress * 16
      const velocityKick = scrollVelocitySigned.current * 3.5
      targetY.current = baseY + velocityKick
      targetX.current = velocity * 0.018

      // Scroll to'xtaganda to'xtatish uchun timeout
      if (scrollTimeout.current) window.clearTimeout(scrollTimeout.current)
      scrollTimeout.current = window.setTimeout(() => {
        isScrolling.current = false
        scrollVelocitySigned.current = 0
        scrollVelocityAbs.current = 0
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

    // Faqat scroll paytidagina harakat — tartibli, idle da to'xtaydi
    if (isScrolling.current) {
      currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, 0.08)
      currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, 0.08)
    } else {
      // Idle da sekin joyiga qaytadi, lekin harakatlanmaydi
      currentY.current = THREE.MathUtils.lerp(currentY.current, -scrollProgress * 16, 0.02)
      currentX.current = THREE.MathUtils.lerp(currentX.current, 0, 0.03)
      scrollVelocitySigned.current *= 0.88
      scrollVelocityAbs.current *= 0.88
    }

    // Curve points — faqat scroll bilan winding, time bilan emas (tartibli)
    const points = curveRef.current.points
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      const baseX = Math.sin(t * Math.PI * 3.2) * 7.5 + Math.cos(t * Math.PI * 1.6) * 3.5 + (t - 0.5) * 5
      const baseY = (t - 0.5) * 48
      const baseZ = Math.cos(t * Math.PI * 2) * 3.2 + Math.sin(t * Math.PI * 3.5) * 1 - 2.8

      // Faqat scroll velocity bilan harakat — tartibli
      const velocityOffsetY = scrollVelocitySigned.current * Math.sin(t * Math.PI * 1.1) * 1.4
      const velocityOffsetX = scrollVelocitySigned.current * 0.35 * Math.cos(t * Math.PI * 0.9)

      points[i].x = baseX + velocityOffsetX
      points[i].y = baseY + velocityOffsetY
      points[i].z = baseZ + scrollVelocitySigned.current * 0.16 * Math.sin(t * Math.PI * 2)
    }

    // Tube radius — scroll paytidagina qalinlashadi
    const radius = 0.28 + Math.abs(scrollVelocitySigned.current) * 0.07
    const newTube = new THREE.TubeGeometry(curveRef.current, 200, radius, 16, false)
    tubeRef.current.geometry.dispose()
    tubeRef.current.geometry = newTube

    tubeRef.current.position.y = currentY.current
    tubeRef.current.position.x = currentX.current
    tubeRef.current.rotation.y = scrollProgress * 0.18 + currentX.current * 0.22
    tubeRef.current.rotation.z = scrollVelocitySigned.current * 0.035

    if (tubeRef2.current && curveRef2.current) {
      const points2 = curveRef2.current.points
      for (let i = 0; i < points2.length; i++) {
        const t = i / (points2.length - 1)
        const baseX = Math.cos(t * Math.PI * 2.5) * 6.5 + Math.sin(t * Math.PI * 1.3) * 2.8
        const baseY = (t - 0.5) * 52
        const baseZ = Math.sin(t * Math.PI * 2.2) * 2.5 - 3.5
        points2[i].x = baseX + scrollVelocitySigned.current * 0.18 * Math.cos(t * Math.PI)
        points2[i].y = baseY + scrollVelocitySigned.current * Math.sin(t * Math.PI) * 0.7
        points2[i].z = baseZ
      }
      const newTube2 = new THREE.TubeGeometry(curveRef2.current, 180, 0.13 + Math.abs(scrollVelocitySigned.current) * 0.04, 12, false)
      tubeRef2.current.geometry.dispose()
      tubeRef2.current.geometry = newTube2
      tubeRef2.current.position.y = currentY.current * 0.85
      tubeRef2.current.position.x = currentX.current * 0.6
      tubeRef2.current.rotation.y = scrollProgress * 0.12
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

      <mesh ref={tubeRef2} geometry={tubeGeo2} position={[0, 0, -4.5]}>
        <meshPhysicalMaterial
          color="#3b82f6"
          emissive="#1d4ed8"
          emissiveIntensity={0.1}
          roughness={0.26}
          metalness={0.1}
          clearcoat={0.6}
          clearcoatRoughness={0.2}
          transparent
          opacity={0.6}
        />
      </mesh>
    </group>
  )
}
