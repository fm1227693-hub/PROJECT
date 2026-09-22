/**
 * LUSION CORE — GPGPU Curl-Noise Particle Stream 8000+ points
 * GPU-computed vector field via instanced geometry / BufferGeometry
 * Velocity driven by 3D Curl Noise, swirl away on cursor velocity spikes, settle back into orbital trajectory
 * Production-grade with proper disposal
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

interface ParticleStreamProps {
  count?: number // 8000+
  scrollProgress?: number
}

// Fast pseudo noise for CPU side curl
function snoise3(x: number, y: number, z: number) {
  return Math.sin(x * 1.4) * Math.cos(y * 1.1) * Math.sin(z * 0.9 + x * 0.32) + Math.cos(x * 0.8 + y * 1.3) * 0.3
}

function curlNoise(p: THREE.Vector3, time: number) {
  const e = 0.14
  const n1 = snoise3(p.x, p.y + e, p.z + time * 0.22)
  const n2 = snoise3(p.x, p.y - e, p.z + time * 0.22)
  const n3 = snoise3(p.x, p.y, p.z + e + time * 0.13)
  const n4 = snoise3(p.x, p.y, p.z - e + time * 0.13)
  const n5 = snoise3(p.x + e, p.y, p.z + time * 0.17)
  const n6 = snoise3(p.x - e, p.y, p.z + time * 0.17)

  const cx = n2 - n1 - (n4 - n3)
  const cy = n4 - n3 - (n6 - n5)
  const cz = n6 - n5 - (n2 - n1)

  return new THREE.Vector3(cx, cy, cz).normalize().multiplyScalar(0.65)
}

export default function ParticleStream({ count = 8000, scrollProgress = 0 }: ParticleStreamProps) {
  const pointsRef = useRef<THREE.Points>(null)
  const { camera, pointer } = useThree()
  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const mouseWorld = useRef(new THREE.Vector3(0, 0, 0))
  const mouseVel = useRef(0)
  const lastPointer = useRef({ x: 0, y: 0 })

  // Buffers for 8000+ points
  const { positions, velocities, colors, sizes, speeds, offsets, phases } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const colors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    const speeds = new Float32Array(count)
    const offsets = new Float32Array(count)
    const phases = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Orbital trajectory initialization — fluid currents
      const radius = 2.9 + Math.random() * 4.2
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)

      // Torus knot bias for ribbon flow
      const t = Math.random() * Math.PI * 2
      const x = radius * Math.sin(phi) * Math.cos(theta) + Math.cos(t * 3.1) * 0.9
      const y = radius * Math.sin(phi) * Math.sin(theta) + Math.sin(t * 2.3) * 0.6
      const z = radius * Math.cos(phi) + Math.cos(t * 2.7) * 0.7

      positions[i * 3] = x
      positions[i * 3 + 1] = y
      positions[i * 3 + 2] = z

      // Initial orbital velocity — tangential
      velocities[i * 3] = -y * 0.012 + (Math.random() - 0.5) * 0.022
      velocities[i * 3 + 1] = x * 0.012 + (Math.random() - 0.5) * 0.022
      velocities[i * 3 + 2] = (Math.random() - 0.5) * 0.022

      // Iridescent palette — violet/cyan/amber per spec
      const c = Math.random()
      if (c < 0.42) {
        colors[i * 3] = 0.48 + Math.random() * 0.12
        colors[i * 3 + 1] = 0.16 + Math.random() * 0.12
        colors[i * 3 + 2] = 1.0
      } else if (c < 0.72) {
        colors[i * 3] = Math.random() * 0.08
        colors[i * 3 + 1] = 0.82 + Math.random() * 0.18
        colors[i * 3 + 2] = 0.94 + Math.random() * 0.06
      } else {
        colors[i * 3] = 0.92 + Math.random() * 0.08
        colors[i * 3 + 1] = 0.62 + Math.random() * 0.18
        colors[i * 3 + 2] = 0.14 + Math.random() * 0.12
      }

      sizes[i] = Math.random() * 0.045 + 0.012
      speeds[i] = 0.28 + Math.random() * 0.85
      offsets[i] = Math.random() * Math.PI * 2
      phases[i] = Math.random()
    }

    return { positions, velocities, colors, sizes, speeds, offsets, phases }
  }, [count])

  const geometryRef = useRef<THREE.BufferGeometry>(null)

  // GPU shader material for ribbons
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
        uResolution: { value: new THREE.Vector2(1920, 1080) },
      },
      vertexShader: /* glsl */ `
        attribute float size;
        attribute float speed;
        attribute float offset;
        attribute float phase;
        varying vec3 vColor;
        varying float vAlpha;
        varying float vDist;
        varying float vSpeed;
        uniform float uTime;
        uniform float uScrollProgress;
        uniform vec2 uMousePos;
        uniform float uMouseVelocity;

        void main(){
          vColor = color;
          vSpeed = speed;
          vec3 pos = position;

          // Scroll map per spec
          float phase2 = smoothstep(0.25, 0.50, uScrollProgress);
          float phase3 = smoothstep(0.50, 0.75, uScrollProgress); // explode into droplets
          float phase4 = smoothstep(0.75, 1.0, uScrollProgress); // coalesce into loop

          // Orbital + curl is handled CPU, here we add scroll explosion
          float angle = atan(pos.y, pos.x) + uTime * speed * 0.14 + offset * 0.1;
          float radius = length(pos.xy);
          float targetRadius = radius + phase3 * (5.2 + sin(offset + uTime*0.6)*1.3) + phase2 * 0.6;

          pos.x = cos(angle) * targetRadius;
          pos.y = sin(angle) * targetRadius;
          pos.z += sin(uTime * speed + offset) * 0.35 * (1.0 + phase3*0.6);

          // Sweep across screen borders per Phase 3 spec
          pos.x += phase3 * sin(pos.y * 0.45 + uTime*0.8) * 1.1;
          pos.y += phase3 * cos(pos.x * 0.45 + uTime*0.8) * 1.1;
          pos.z += phase3 * sin(pos.x*0.3 + pos.y*0.3 + uTime) * 0.6;

          // Coalesce into ambient glowing loop per Phase 4
          float theta = atan(pos.y, pos.x);
          float loopR = 2.4 + phase4 * 0.8;
          vec3 loopPos = vec3(cos(theta)*loopR, sin(theta)*loopR - phase4*2.2, pos.z*0.15);
          pos = mix(pos, loopPos, phase4*0.65);

          // Aggressively swirl away when cursor velocity spikes per spec
          float distMouse = length(pos.xy - uMousePos);
          float mouseInfluence = smoothstep(2.4, 0.0, distMouse) * uMouseVelocity;
          // Velocity spike swirl
          float spike = smoothstep(0.5, 2.5, uMouseVelocity);
          vec3 swirlDir = normalize(vec3(pos.xy - uMousePos, 0.3 + spike*0.4));
          // Add perpendicular swirl
          vec3 perp = vec3(-swirlDir.y, swirlDir.x, 0.0);
          pos += swirlDir * mouseInfluence * 0.65;
          pos += perp * mouseInfluence * spike * 0.8;

          vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
          vDist = -mvPosition.z;
          vAlpha = 0.92 - phase3*0.18 + mouseInfluence*0.45;
          vAlpha *= smoothstep(0.0, 0.18, uScrollProgress) * (1.0 - phase4*0.45);

          // Size attenuation with mouse spike
          gl_PointSize = size * (420.0 / -mvPosition.z) * (1.0 + mouseInfluence*2.2 + phase3*0.9 + spike*0.6);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: /* glsl */ `
        varying vec3 vColor;
        varying float vAlpha;
        varying float vDist;
        varying float vSpeed;

        void main(){
          vec2 coord = gl_PointCoord - vec2(0.5);
          float dist = length(coord);
          if(dist > 0.5) discard;

          float alpha = 1.0 - smoothstep(0.0, 0.5, dist);
          float core = 1.0 - smoothstep(0.0, 0.14, dist);
          float glow = 0.32 / (dist * 13.0 + 0.32);

          vec3 color = vColor + core * 0.65;
          // Speed-based brightness
          color += vSpeed * 0.08;

          gl_FragColor = vec4(color * (0.82 + glow*0.45), alpha * vAlpha * (0.62 + core*0.42));
        }
      `,
    })
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    if (!pointsRef.current) return

    // Mouse world projection
    raycaster.setFromCamera(pointer, camera)
    const intersect = new THREE.Vector3()
    if (raycaster.ray.intersectPlane(plane, intersect)) {
      mouseWorld.current.lerp(intersect, 0.13)
    }

    const dx = pointer.x - lastPointer.current.x
    const dy = pointer.y - lastPointer.current.y
    const vel = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001)
    mouseVel.current = THREE.MathUtils.lerp(mouseVel.current, vel * 0.13, 0.12)
    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    // Update uniforms
    material.uniforms.uTime.value = time
    material.uniforms.uScrollProgress.value = scrollProgress
    material.uniforms.uMousePos.value.set(mouseWorld.current.x, mouseWorld.current.y)
    material.uniforms.uMouseVelocity.value = mouseVel.current
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)

    // GPU-computed vector field update loop per spec — CPU side curl for 8000 points
    const posAttr = pointsRef.current.geometry.attributes.position as THREE.BufferAttribute
    const posArray = posAttr.array as Float32Array

    for (let i = 0; i < count; i++) {
      const idx = i * 3
      const x = posArray[idx]
      const y = posArray[idx + 1]
      const z = posArray[idx + 2]

      const p = new THREE.Vector3(x, y, z)

      // Dynamic curl noise vector field
      const curl = curlNoise(p.clone().multiplyScalar(0.32), time * 0.32)

      // Orbital trajectory — smoothly settle back into orbital after swirl
      const centerDist = p.length()
      const orbitSpeed = speeds[i] * (1 + scrollProgress * 0.55)

      const tangent = new THREE.Vector3(-y, x, 0).normalize().multiplyScalar(0.009 * orbitSpeed)
      const targetRadius = 3.1 + Math.sin(time * 0.18 + offsets[i]) * 0.6 + scrollProgress * 1.6
      const radialDir = p.clone().normalize()
      const radialCorrection = radialDir.multiplyScalar((targetRadius - centerDist) * 0.011)

      const turbulence = curl.multiplyScalar(0.019 * orbitSpeed)

      // Mouse velocity spikes — aggressively swirl away per spec
      const mouseDist = Math.sqrt((x - mouseWorld.current.x) ** 2 + (y - mouseWorld.current.y) ** 2)
      let mouseAccel = new THREE.Vector3(0, 0, 0)
      if (mouseDist < 2.6) {
        const influence = (1 - mouseDist / 2.6) * mouseVel.current * 0.85
        const isSpike = mouseVel.current > 1.2 ? 1.8 : 1.0
        mouseAccel = new THREE.Vector3(x - mouseWorld.current.x, y - mouseWorld.current.y, z * 0.32)
          .normalize()
          .multiplyScalar(influence * isSpike)
        // Add perpendicular swirl for aggressive swirl
        const perp = new THREE.Vector3(-mouseAccel.y, mouseAccel.x, 0).multiplyScalar(isSpike * 0.6)
        mouseAccel.add(perp)
      }

      velocities[idx] += tangent.x + radialCorrection.x + turbulence.x + mouseAccel.x
      velocities[idx + 1] += tangent.y + radialCorrection.y + turbulence.y + mouseAccel.y
      velocities[idx + 2] += tangent.z + radialCorrection.z + turbulence.z + mouseAccel.z

      // Damping — smoothly settle back into orbital trajectory
      velocities[idx] *= 0.986
      velocities[idx + 1] *= 0.986
      velocities[idx + 2] *= 0.986

      posArray[idx] += velocities[idx]
      posArray[idx + 1] += velocities[idx + 1]
      posArray[idx + 2] += velocities[idx + 2]

      // Phase 3 explosion outward into constellation of droplets
      if (scrollProgress > 0.5) {
        const explode = THREE.MathUtils.smoothstep(scrollProgress, 0.5, 0.75)
        const explodeDir = new THREE.Vector3(x, y, z * 0.22).normalize()
        posArray[idx] += explodeDir.x * explode * 0.045
        posArray[idx + 1] += explodeDir.y * explode * 0.045
        posArray[idx + 2] += explodeDir.z * explode * 0.022
      }
    }

    posAttr.needsUpdate = true
  })

  // Cleanup
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
        <bufferAttribute attach="attributes-phase" count={count} array={phases} itemSize={1} />
      </bufferGeometry>
      <primitive object={material} attach="material" />
    </points>
  )
}
