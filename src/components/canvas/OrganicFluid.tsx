/**
 * LUSION CORE — Organic Fluid Body
 * IcosahedronGeometry(2.4, 128) + custom ShaderMaterial
 * Hydrodynamic surface tension, raycast cursor, damped spring ripple
 * True physical dispersion material: roughness 0.03, metalness 0.05, transmission 0.99, ior 1.54, thickness 3.2
 * Production-grade with buffer cleanup
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshTransmissionMaterial } from '@react-three/drei'

import { fluidDisplacementVert } from '../../shaders/fluidDisplacement.vert'
import { dispersionGlassFrag } from '../../shaders/dispersionGlass.frag'

interface OrganicFluidProps {
  scrollProgress?: number
}

export default function OrganicFluid({ scrollProgress = 0 }: OrganicFluidProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const glassRef = useRef<THREE.Mesh>(null)
  const coreRef = useRef<THREE.Mesh>(null)
  const { camera, pointer } = useThree()

  // Raycast for mouse hydrodynamics — planar projection z=0 per spec
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const mouseWorld = useRef(new THREE.Vector2(0, 0))
  const smoothMouse = useRef(new THREE.Vector2(0, 0))
  const mouseVel = useRef(0)
  const lastPointer = useRef({ x: 0, y: 0 })
  const isPressingRef = useRef(0)

  // Uniforms — true physical dispersion
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uFrequency: { value: 1.5 },
      uSpeed: { value: 0.8 },
      uAmplitude: { value: 0.45 },
      uScrollProgress: { value: 0 },
      uMousePos: { value: new THREE.Vector2(0, 0) },
      uMouseVelocity: { value: 0 },
      uMousePressed: { value: 0 },
      uResolution: { value: new THREE.Vector2(1920, 1080) },
      uDamping: { value: 0.85 },
      uElasticity: { value: 0.35 },
      uRoughness: { value: 0.03 },
      uMetalness: { value: 0.05 },
      uTransmission: { value: 0.99 },
      uIor: { value: 1.54 },
      uThickness: { value: 3.2 },
      uChromaticDispersion: { value: 0.12 },
      uColorA: { value: new THREE.Color('#7a2bff') },
      uColorB: { value: new THREE.Color('#00f0ff') },
      uColorC: { value: new THREE.Color('#ffb347') },
      uLightPos1: { value: new THREE.Vector3(3.2, 2.8, 4.2) },
      uLightPos2: { value: new THREE.Vector3(-3.5, -1.2, -2.5) },
    }),
    []
  )

  // High-density subdivided manifold IcosahedronGeometry(2.4, 128) per spec
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.4, 128)
    // Compute tangents for proper normal mapping
    const pos = geo.attributes.position as THREE.BufferAttribute
    const uv = geo.attributes.uv as THREE.BufferAttribute
    // Generate tangents if missing
    if (!geo.attributes.tangent) {
      const tangents = new Float32Array(pos.count * 4)
      for (let i = 0; i < pos.count; i++) {
        tangents[i * 4] = 1
        tangents[i * 4 + 1] = 0
        tangents[i * 4 + 2] = 0
        tangents[i * 4 + 3] = 1
      }
      geo.setAttribute('tangent', new THREE.BufferAttribute(tangents, 4))
    }
    geo.computeVertexNormals()
    return geo
  }, [])

  // Custom ShaderMaterial mimicking multi-layer dispersion glass
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: fluidDisplacementVert,
      fragmentShader: dispersionGlassFrag,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.NormalBlending,
    })
  }, [uniforms])

  // Mouse events for pressing
  useEffect(() => {
    const onDown = () => (isPressingRef.current = 1)
    const onUp = () => (isPressingRef.current = 0)
    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchstart', onDown as any, { passive: true })
    window.addEventListener('touchend', onUp as any)
    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchstart', onDown as any)
      window.removeEventListener('touchend', onUp as any)
    }
  }, [])

  // Pointer dynamics subscription
  useEffect(() => {
    const onPointer = (e: CustomEvent) => {
      // Velocity from hook
      mouseVel.current = THREE.MathUtils.lerp(mouseVel.current, e.detail.speed * 1.2, 0.12)
    }
    window.addEventListener('lusion-pointer' as any, onPointer as any)
    return () => window.removeEventListener('lusion-pointer' as any, onPointer as any)
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // --- Mouse hydrodynamics: raycast cursor vectors in screen space → planar projection ---
    raycaster.setFromCamera(pointer, camera)
    const intersect = new THREE.Vector3()
    const hit = raycaster.ray.intersectPlane(plane, intersect)
    if (hit) {
      const target = new THREE.Vector2(intersect.x, intersect.y)
      smoothMouse.current.lerp(target, 0.09)
      mouseWorld.current.copy(smoothMouse.current)
    }

    // Velocity from pointer delta fallback
    const dx = pointer.x - lastPointer.current.x
    const dy = pointer.y - lastPointer.current.y
    const rawVel = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001)
    mouseVel.current = THREE.MathUtils.lerp(mouseVel.current, rawVel * 0.14, 0.1)
    mouseVel.current = Math.min(mouseVel.current, 4.5)
    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    // Update uniforms
    uniforms.uTime.value = time
    uniforms.uMousePos.value.copy(mouseWorld.current)
    uniforms.uMouseVelocity.value = mouseVel.current
    uniforms.uMousePressed.value = isPressingRef.current
    uniforms.uScrollProgress.value = scrollProgress
    uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)

    // --- Mesh transformations per scroll map ---
    if (meshRef.current) {
      const breathe = Math.sin(time * 0.9) * 0.038 * (1 - scrollProgress * 0.55)
      const baseScale = 1 + breathe

      const phase2 = THREE.MathUtils.smoothstep(scrollProgress, 0.25, 0.5)
      const phase2b = THREE.MathUtils.smoothstep(scrollProgress, 0.35, 0.55)
      const phase3 = THREE.MathUtils.smoothstep(scrollProgress, 0.5, 0.75)
      const phase4 = THREE.MathUtils.smoothstep(scrollProgress, 0.75, 1.0)

      // Viscous elongation Y-stretch + Z-orbit
      meshRef.current.scale.set(
        baseScale * (1 - phase2 * 0.18 + phase4 * 0.12),
        baseScale * (1 + phase2 * 0.95 - phase4 * 0.22),
        baseScale * (1 + phase2 * 0.12)
      )

      // Rotation with inertia + mouse influence
      meshRef.current.rotation.y = time * 0.11 + scrollProgress * Math.PI * 0.65 + smoothMouse.current.x * 0.18
      meshRef.current.rotation.x = Math.sin(time * 0.18) * 0.14 + scrollProgress * 0.42 + smoothMouse.current.y * 0.12
      meshRef.current.rotation.z = phase2b * 0.35 + Math.cos(time * 0.14) * 0.06 + phase3 * 0.15

      // Position — coalesce into glowing loop near footer per Phase 4
      const targetY = THREE.MathUtils.lerp(0, -3.2, phase4)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.055)
      meshRef.current.position.x = THREE.MathUtils.lerp(
        meshRef.current.position.x,
        Math.sin(time * 0.18) * 0.16 * (1 - phase4),
        0.04
      )

      // Twist is handled in vertex shader, extra scale for prism
      if (phase2b > 0) {
        meshRef.current.scale.z *= 1 + phase2b * 0.22
      }

      // Explode outward into droplets per Phase 3
      if (phase3 > 0) {
        const explodeScale = 1 + phase3 * 0.12
        meshRef.current.scale.multiplyScalar(explodeScale)
      }
    }

    // Glass shell follows main
    if (glassRef.current && meshRef.current) {
      glassRef.current.position.copy(meshRef.current.position)
      glassRef.current.rotation.copy(meshRef.current.rotation)
      glassRef.current.scale.copy(meshRef.current.scale).multiplyScalar(1.018)
    }
    if (coreRef.current && meshRef.current) {
      coreRef.current.position.copy(meshRef.current.position)
      coreRef.current.rotation.copy(meshRef.current.rotation)
      coreRef.current.scale.copy(meshRef.current.scale).multiplyScalar(0.58)
    }
  })

  // Cleanup — prevent WebGL memory leaks
  useEffect(() => {
    return () => {
      geometry.dispose()
      shaderMaterial.dispose()
    }
  }, [geometry, shaderMaterial])

  return (
    <group>
      {/* Core interactive fluid object with custom shaders */}
      <mesh ref={meshRef} geometry={geometry} frustumCulled={false}>
        <primitive object={shaderMaterial} attach="material" />
      </mesh>

      {/* True physical dispersion glass shell — extended MeshPhysicalMaterial */}
      <mesh ref={glassRef} geometry={geometry} frustumCulled={false}>
        <MeshTransmissionMaterial
          roughness={0.03}
          metalness={0.05}
          transmission={0.99}
          ior={1.54}
          thickness={3.2}
          chromaticAberration={0.12}
          distortion={0.14}
          temporalDistortion={0.12}
          color="#ffffff"
          attenuationColor="#ffffff"
          attenuationDistance={2.2}
          clearcoat={1}
          clearcoatRoughness={0.06}
          backside={false}
          backsideThickness={0.6}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* Inner core glow for caustics */}
      <mesh ref={coreRef} scale={[0.58, 0.58, 0.58]}>
        <icosahedronGeometry args={[2.4, 24]} />
        <meshBasicMaterial color="#7a2bff" transparent opacity={0.07} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}
