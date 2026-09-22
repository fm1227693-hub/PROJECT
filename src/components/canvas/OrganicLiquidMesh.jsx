import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { MeshTransmissionMaterial } from '@react-three/drei'

// Import shaders as raw strings
import fluidVert from '../../shaders/fluidNoise.vert.glsl?raw'
import dispersionFrag from '../../shaders/dispersion.frag.glsl?raw'

export default function OrganicLiquidMesh({ scrollProgress = 0 }) {
  const meshRef = useRef()
  const materialRef = useRef()
  const { camera, pointer, viewport } = useThree()

  // Raycast plane for mouse hydrodynamic reaction (z=0 plane per spec)
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const mouseWorldPos = useRef(new THREE.Vector2(0, 0))
  const mouseVelocityRef = useRef(0)
  const lastPointer = useRef({ x: 0, y: 0 })
  const smoothMousePos = useRef(new THREE.Vector2(0, 0))
  const smoothVelocity = useRef(0)

  // Uniforms for custom shader material (fallback if transmission not enough)
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uMousePos: { value: new THREE.Vector2(0, 0) },
    uMouseVelocity: { value: 0 },
    uScrollProgress: { value: 0 },
    uMorphFactor: { value: 0 },
    uColorA: { value: new THREE.Color('#7928ca') },
    uColorB: { value: new THREE.Color('#00f0ff') },
    uColorC: { value: new THREE.Color('#ffb347') },
    uRoughness: { value: 0.04 },
    uMetalness: { value: 0.1 },
    uTransmission: { value: 0.98 },
    uIor: { value: 1.52 },
    uThickness: { value: 2.4 },
    uDispersion: { value: 0.08 },
  }), [])

  // High-density IcosahedronGeometry(2.2, 64) per spec
  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(2.2, 64)
    // Compute tangents for better shading
    geo.computeTangents?.()
    return geo
  }, [])

  // Custom ShaderMaterial that matches physical specs but with full GLSL noise
  const shaderMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: fluidVert,
      fragmentShader: dispersionFrag,
      uniforms,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  }, [uniforms])

  // Also create a transmission material for outer glass shell
  const transmissionMaterial = useMemo(() => {
    // This will be used as second layer for hyper-realistic glass
    return null // we use shaderMaterial as primary for 1:1 spec
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // --- Mouse hydrodynamic reaction: raycast cursor onto z=0 plane ---
    raycaster.setFromCamera(pointer, camera)
    const intersectPoint = new THREE.Vector3()
    const didIntersect = raycaster.ray.intersectPlane(plane, intersectPoint)
    
    if (didIntersect) {
      const target = new THREE.Vector2(intersectPoint.x, intersectPoint.y)
      // Smooth lerp for fluid feel
      smoothMousePos.current.lerp(target, 0.08)
      mouseWorldPos.current.copy(smoothMousePos.current)
    }

    // Velocity calculation
    const dx = pointer.x - lastPointer.current.x
    const dy = pointer.y - lastPointer.current.y
    const rawVel = Math.sqrt(dx*dx + dy*dy) / Math.max(delta, 0.001)
    smoothVelocity.current = THREE.MathUtils.lerp(smoothVelocity.current, rawVel * 0.15, 0.1)
    // Clamp
    smoothVelocity.current = Math.min(smoothVelocity.current, 3.5)
    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    // Update uniforms
    uniforms.uTime.value = time
    uniforms.uMousePos.value.copy(mouseWorldPos.current)
    uniforms.uMouseVelocity.value = smoothVelocity.current
    uniforms.uScrollProgress.value = scrollProgress
    uniforms.uMorphFactor.value = scrollProgress

    // --- Mesh transformations based on scroll phases ---
    if (meshRef.current) {
      // Phase 1 (0-25%): breathe in center
      const breathe = Math.sin(time * 0.8) * 0.04 * (1 - scrollProgress * 0.5)
      const baseScale = 1 + breathe

      // Phase 2 (25-50%): elongate and shear along scroll vector, morph into prism, camera glides 45deg
      const shearPhase = THREE.MathUtils.smoothstep(scrollProgress, 0.25, 0.5)
      const prismPhase = THREE.MathUtils.smoothstep(scrollProgress, 0.35, 0.55)
      const ringPhase = THREE.MathUtils.smoothstep(scrollProgress, 0.75, 1.0)

      // Scale and rotation
      meshRef.current.scale.set(
        baseScale * (1 - shearPhase * 0.15 + ringPhase * 0.1),
        baseScale * (1 + shearPhase * 0.65 - ringPhase * 0.2),
        baseScale * (1 - shearPhase * 0.1)
      )

      // Rotation with inertia
      meshRef.current.rotation.y = time * 0.12 + scrollProgress * Math.PI * 0.6 + smoothMousePos.current.x * 0.15
      meshRef.current.rotation.x = Math.sin(time * 0.2) * 0.15 + scrollProgress * 0.4 + smoothMousePos.current.y * 0.1
      meshRef.current.rotation.z = prismPhase * 0.3 + Math.cos(time * 0.15) * 0.05

      // Position: center, then anchor at bottom for Phase 4
      const targetY = THREE.MathUtils.lerp(0, -2.8, ringPhase)
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, targetY, 0.06)
      meshRef.current.position.x = THREE.MathUtils.lerp(meshRef.current.position.x, Math.sin(time * 0.2) * 0.15 * (1 - ringPhase), 0.04)

      // Prism morph - slight twist is handled in shader, but we add extra
      if (prismPhase > 0) {
        meshRef.current.scale.z *= 1 + prismPhase * 0.2
      }
    }

    // Camera glide around at 45deg during Phase 2
    if (scrollProgress >= 0.25 && scrollProgress <= 0.65) {
      const phaseT = THREE.MathUtils.mapLinear(scrollProgress, 0.25, 0.65, 0, 1)
      const angle = phaseT * Math.PI * 0.25 // 45deg = PI/4
      const radius = 8
      state.camera.position.x = Math.sin(angle) * radius * 0.6
      state.camera.position.z = Math.cos(angle) * radius
      state.camera.position.y = Math.sin(phaseT * Math.PI) * 0.8
      state.camera.lookAt(0, meshRef.current ? meshRef.current.position.y * 0.3 : 0, 0)
    } else if (scrollProgress < 0.25) {
      // Return to center smoothly
      state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, 0, 0.04)
      state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, 0, 0.04)
      state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, 8, 0.04)
      state.camera.lookAt(0, 0, 0)
    }
  })

  // Cleanup
  useEffect(() => {
    return () => {
      geometry.dispose()
      shaderMaterial.dispose()
    }
  }, [geometry, shaderMaterial])

  return (
    <group>
      {/* Primary organic liquid mesh with custom GLSL & dispersion */}
      <mesh ref={meshRef} geometry={geometry} frustumCulled={false}>
        <primitive object={shaderMaterial} attach="material" />
      </mesh>

      {/* Secondary glass shell with MeshTransmissionMaterial for hyper-realistic refractive dispersion */}
      <mesh geometry={geometry} scale={[1.015, 1.015, 1.015]} frustumCulled={false}>
        <MeshTransmissionMaterial
          ref={materialRef}
          roughness={0.04}
          metalness={0.1}
          transmission={0.98}
          ior={1.52}
          thickness={2.4}
          chromaticAberration={0.08}
          distortion={0.15}
          temporalDistortion={0.1}
          color="#ffffff"
          attenuationColor="#ffffff"
          attenuationDistance={2}
          clearcoat={1}
          clearcoatRoughness={0.08}
          backside={false}
          backsideThickness={0.5}
          transparent
          opacity={0.9}
        />
      </mesh>

      {/* Inner core glow */}
      <mesh scale={[0.6, 0.6, 0.6]}>
        <icosahedronGeometry args={[2.2, 16]} />
        <meshBasicMaterial color="#7928ca" transparent opacity={0.08} blending={THREE.AdditiveBlending} depthWrite={false} />
      </mesh>
    </group>
  )
}
