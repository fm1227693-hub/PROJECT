import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// Curl noise implementation for JS side (GPGPU-like)
function snoise3(x, y, z) {
  // Fast pseudo simplex
  return Math.sin(x * 1.5) * Math.cos(y * 1.2) * Math.sin(z * 0.8 + x * 0.3)
}

function curlNoise(p, time) {
  const e = 0.15
  // Finite differences to get curl of noise field
  const n1 = snoise3(p.x, p.y + e, p.z + time * 0.2)
  const n2 = snoise3(p.x, p.y - e, p.z + time * 0.2)
  const n3 = snoise3(p.x, p.y, p.z + e + time * 0.1)
  const n4 = snoise3(p.x, p.y, p.z - e + time * 0.1)
  const n5 = snoise3(p.x + e, p.y, p.z + time * 0.15)
  const n6 = snoise3(p.x - e, p.y, p.z + time * 0.15)

  const x = n2 - n1 - (n4 - n3)
  const y = n4 - n3 - (n6 - n5)
  const z = n6 - n5 - (n2 - n1)

  return new THREE.Vector3(x, y, z).normalize().multiplyScalar(0.6)
}

export default function FluidRibbons({ count = 6000, scrollProgress = 0 }) {
  const pointsRef = useRef()
  const { camera, pointer } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))
  const mouseVel = useRef(0)
  const lastPointer = useRef({ x: 0, y: 0 })

  // Buffers
  const { positions, velocities, colors, sizes, speeds, offsets } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Orbital vortex initialization - particles orbiting central fluid
      const radius = 2.8 + Math.random() * 3.5
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      
      // Torus knot biased distribution for ribbon flow
      const t = Math.random() * Math.PI * 2
      const r = 2.5 + Math.sin(t * 2) * 0.5
      
      const x = radius * Math.sin(phi) * Math.cos(theta) + Math.cos(t * 3) * 0.8
      const y = radius * Math.sin(phi) * Math.sin(theta) + Math.sin(t * 2) * 0.5
      const z = radius * Math.cos(phi) + Math.cos(t * 2) * 0.6

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Orbital velocity (tangential)
      velocities[i * 3] = -y * 0.01 + (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 1] = x * 0.01 + (Math.random() - 0.5) * 0.02
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.02

      // Iridescent colors - violet, cyan, amber
      const colorChoice = Math.random()
      if (colorChoice < 0.4) {
        colors[i * 3] = 0.474 + Math.random() * 0.1 // violet R
        colors[i * 3 + 1] = 0.157 + Math.random() * 0.1
        colors[i * 3 + 2] = 0.792 + Math.random() * 0.1
      } else if (colorChoice < 0.7) {
        colors[i * 3] = Math.random() * 0.1
        colors[i * 3 + 1] = 0.8 + Math.random() * 0.2
        colors[i * 3 + 2] = 0.9 + Math.random() * 0.1
      } else {
        colors[i * 3] = 0.9 + Math.random() * 0.1
        colors[i * 3 + 1] = 0.6 + Math.random() * 0.2
        colors[i * 3 + 2] = 0.15 + Math.random() * 0.1
      }

      sizes[i] = Math.random() * 0.04 + 0.01
      speeds[i] = 0.3 + Math.random() * 0.8
      offsets[i] = Math.random() * Math.PI * 2
    }

    return { positions, velocities, colors, sizes, speeds, offsets }
  }, [count])

  const geometryRef = useRef()

  // Shader material for ribbons
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      vertexColors: true,
      uniforms: {
        uTime: { value: 0 },
        uScrollProgress: { value: 0 },
        uMousePos: { value: new THREE.Vector2(0, 0) },
        uMouseVelocity: { value: 0 },
      },
      vertexShader: `
        attribute float size;
        attribute float speed;
        attribute float offset;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vDist;
        uniform float uTime;
        uniform float uScrollProgress;
        uniform vec2 uMousePos;
        uniform float uMouseVelocity;

        void main() {
          vColor = color;
          vec3 pos = position;

          // Orbital vortex + curl turbulence is handled on CPU, here we add scroll explosion
          float explodePhase = smoothstep(0.5, 0.75, uScrollProgress);
          // Particles explode outwards, swirling around viewport borders per Phase 3 spec
          float angle = atan(pos.y, pos.x) + uTime * speed * 0.15;
          float radius = length(pos.xy);
          float targetRadius = radius + explodePhase * (4.5 + sin(offset + uTime) * 1.0);
          
          pos.x = cos(angle) * targetRadius;
          pos.y = sin(angle) * targetRadius;
          pos.z += sin(uTime * speed + offset) * 0.3 * (1.0 + explodePhase);

          // Border swirl
          pos.x += explodePhase * sin(pos.y * 0.5 + uTime) * 0.8;
          pos.y += explodePhase * cos(pos.x * 0.5 + uTime) * 0.8;

          // Mouse cut-through acceleration
          float distMouse = length(pos.xy - uMousePos);
          float mouseInfluence = smoothstep(2.0, 0.0, distMouse) * uMouseVelocity;
          pos += normalize(vec3(pos.xy - uMousePos, 0.2)) * mouseInfluence * 0.5;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vDist = -mvPosition.z;
          vAlpha = 0.9 - explodePhase * 0.2 + mouseInfluence * 0.4;
          vAlpha *= smoothstep(0.0, 0.2, uScrollProgress) * (1.0 - smoothstep(0.85, 1.0, uScrollProgress) * 0.5);

          gl_PointSize = size * (380.0 / -mvPosition.z) * (1.0 + mouseInfluence * 2.0 + explodePhase * 0.8);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vDist;

        void main() {
          // Circular point with soft falloff + ribbon streak
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if (dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          // Inner core bright
          float core = 1.0 - smoothstep(0.0, 0.15, dist);
          
          vec3 color = vColor + core * 0.6;
          // Add subtle glow
          float glow = 0.3 / (dist * 12.0 + 0.3);
          
          gl_FragColor = vec4(color * (0.8 + glow * 0.4), alpha * vAlpha * (0.6 + core * 0.4));
        }
      `,
    })
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    if (!pointsRef.current) return

    // Mouse world pos update
    raycaster.setFromCamera(pointer, camera)
    const intersect = new THREE.Vector3()
    if (raycaster.ray.intersectPlane(plane, intersect)) {
      mouseWorld.current.lerp(intersect, 0.12)
    }

    const dx = pointer.x - lastPointer.current.x
    const dy = pointer.y - lastPointer.current.y
    const vel = Math.sqrt(dx*dx + dy*dy) / Math.max(delta, 0.001)
    mouseVel.current = THREE.MathUtils.lerp(mouseVel.current, vel * 0.12, 0.1)
    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    // Update material uniforms
    material.uniforms.uTime.value = time
    material.uniforms.uScrollProgress.value = scrollProgress
    material.uniforms.uMousePos.value.set(mouseWorld.current.x, mouseWorld.current.y)
    material.uniforms.uMouseVelocity.value = mouseVel.current

    // CPU update for 6000 points - curl noise orbital dynamics
    const posAttr = pointsRef.current.geometry.attributes.position
    const posArray = posAttr.array

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const x = posArray[idx]
      const y = posArray[idx + 1]
      const z = posArray[idx + 2]

      const p = new THREE.Vector3(x, y, z)

      // Curl noise vector field per spec - fluid turbulence
      const curl = curlNoise(p.clone().multiplyScalar(0.35), time * 0.3)
      
      // Orbital vortex - keep particles orbiting central organic fluid
      const centerDist = p.length()
      const orbitSpeed = speeds[i] * (1 + scrollProgress * 0.5)
      
      // Tangential orbital force
      const tangent = new THREE.Vector3(-y, x, 0).normalize().multiplyScalar(0.008 * orbitSpeed)
      
      // Centripetal + centrifugal balance to keep orbit
      const targetRadius = 3.0 + Math.sin(time * 0.2 + offsets[i]) * 0.5 + scrollProgress * 1.5
      const radialDir = p.clone().normalize()
      const radialCorrection = radialDir.multiplyScalar((targetRadius - centerDist) * 0.01)

      // Curl turbulence
      const turbulence = curl.multiplyScalar(0.018 * orbitSpeed)

      // Mouse cut-through acceleration per spec
      const mouseDist = Math.sqrt((x - mouseWorld.current.x) ** 2 + (y - mouseWorld.current.y) ** 2)
      let mouseAccel = new THREE.Vector3(0, 0, 0)
      if (mouseDist < 2.2) {
        const influence = (1 - mouseDist / 2.2) * mouseVel.current * 0.8
        mouseAccel = new THREE.Vector3(x - mouseWorld.current.x, y - mouseWorld.current.y, z * 0.3).normalize().multiplyScalar(influence)
        // Smooth decelerate back into vortex is handled by damping
      }

      // Combine velocities
      velocities[idx] += tangent.x + radialCorrection.x + turbulence.x + mouseAccel.x
      velocities[idx + 1] += tangent.y + radialCorrection.y + turbulence.y + mouseAccel.y
      velocities[idx + 2] += tangent.z + radialCorrection.z + turbulence.z + mouseAccel.z

      // Damping for smooth deceleration back into vortex
      velocities[idx] *= 0.985
      velocities[idx + 1] *= 0.985
      velocities[idx + 2] *= 0.985

      // Update positions
      posArray[idx] += velocities[idx]
      posArray[idx + 1] += velocities[idx + 1]
      posArray[idx + 2] += velocities[idx + 2]

      // Phase 3 explosion outward
      if (scrollProgress > 0.5) {
        const explode = THREE.MathUtils.smoothstep(scrollProgress, 0.5, 0.75)
        const explodeDir = new THREE.Vector3(x, y, z * 0.2).normalize()
        posArray[idx] += explodeDir.x * explode * 0.04
        posArray[idx + 1] += explodeDir.y * explode * 0.04
        posArray[idx + 2] += explodeDir.z * explode * 0.02
      }
    }

    posAttr.needsUpdate = true
  })

  useEffect(() => {
    return () => {
      if (geometryRef.current) geometryRef.current.dispose()
      material.dispose()
    }
  }, [material])

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geometryRef}>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
        <bufferAttribute attach="attributes-size" count={count} array={sizes} itemSize={1} />
        <bufferAttribute attach="attributes-speed" count={count} array={speeds} itemSize={1} />
        <bufferAttribute attach="attributes-offset" count={count} array={offsets} itemSize={1} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  )
}
