'use client'

/**
 * LUSION — LusionHeroCanvas
 * 1:1 real Lusion.co hero ribbon — fullscreen #f7f7f9, centered curved card 14x6 PlaneGeometry(14,6,64,32)
 * Elastic cloth vertex shader + colorful animated gradient + high-gloss royal blue TubeGeometry spline #1d4ed8
 * No debug text, no LUSION LAB, clean production
 */

import { useRef, useMemo, useEffect, useState } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

const vert = /* glsl */ `
precision highp float;

uniform float uTime;
uniform vec2 uMouse;
uniform float uMouseVelocity;
uniform float uHover;
uniform float uScrollVelocity;

varying vec2 vUv;
varying vec3 vNormal;
varying float vWave;
varying float vHover;

void main(){
  vUv = uv;
  vHover = uHover;

  vec3 pos = position;

  // Continuous subtle waves
  float waveX = sin(pos.x * 0.52 + uTime * 1.1);
  float waveY = cos(pos.y * 0.68 + uTime * 0.9);
  float wave = waveX * waveY * 0.22;

  // Spec elastic cloth per requirement: pos.z += sin(pos.x*0.4+uTime*2.0)*uScrollVelocity*0.35
  float scrollZ = sin(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35;
  // pos.y += cos(pos.x*0.3)*uMouseDeform (here uMouseVelocity as deform)
  float mouseY = cos(pos.x * 0.3 + uTime * 0.5) * uMouseVelocity * 0.22;

  float mouseDist = length(pos.xy - uMouse);
  float mouseDeform = smoothstep(3.2, 0.0, mouseDist) * uMouseVelocity;
  float mouseTrail = mouseDeform * sin(uTime * 3.2 + pos.x * 0.6) * 0.38;

  float hoverBulge = smoothstep(4.5, 0.0, length(pos.xy)) * uHover * 0.32 * sin(uTime * 2.0 + pos.x * 0.5);

  pos.z += wave + scrollZ + mouseTrail + hoverBulge;
  pos.y += mouseY + mouseDeform * 0.26 * sin(pos.x * 0.7 + uTime * 1.8) + wave * 0.12 + hoverBulge * 0.2;

  // Subtle drag-like stretch on X when hovering
  pos.x += uHover * sin(pos.y * 0.8 + uTime * 1.2) * 0.06;

  vec3 tangent = normalize(vec3(1.0, 0.0, cos(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35 + uHover * 0.08));
  vec3 bitangent = normalize(vec3(0.0, 1.0, -sin(pos.x * 0.3) * uMouseVelocity * 0.22));
  vec3 n = normalize(cross(tangent, bitangent));
  vNormal = normalize(normalMatrix * n);
  vWave = wave + scrollZ + hoverBulge;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`

const frag = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uHover;
uniform float uScrollVelocity;

varying vec2 vUv;
varying vec3 vNormal;
varying float vWave;
varying float vHover;

float roundedBoxSDF(vec2 p, vec2 size, float r){
  vec2 q = abs(p) - size + r;
  return min(max(q.x,q.y),0.0) + length(max(q,0.0)) - r;
}

void main(){
  vec2 uv = vUv;
  vec2 centered = (uv - 0.5) * 2.0;
  centered.x *= 1.0;
  centered.y *= (14.0/6.0) * 0.5;

  float dist = roundedBoxSDF(centered, vec2(1.0, 0.42), 0.16);
  float alpha = 1.0 - smoothstep(0.0, 0.018, dist);
  if(alpha < 0.01) discard;

  // Colorful animated shader gradient — high-energy
  vec2 p = uv * 2.0 - 1.0;
  float t = uTime * 0.22;

  float a1 = sin((uv.x + t) * 2.3) * cos((uv.y + t * 0.65) * 2.1);
  float a2 = sin(uv.x * 6.5 + uTime * 0.7) * cos(uv.y * 5.0 + uTime * 0.55);
  float a3 = cos(length(p) * 3.0 - uTime * 1.0);

  vec3 base = vec3(0.97, 0.97, 0.978);
  vec3 c1 = vec3(0.14,0.14,0.15) * (1.0 - smoothstep(0.0,0.65,a1)) * 0.22;
  vec3 c2 = vec3(0.97,0.97,0.985) * smoothstep(0.28,0.92,a2) * 0.13;
  vec3 c3 = vec3(0.22,0.36,0.96) * a3 * 0.07;
  vec3 c4 = vec3(0.98,0.72,0.18) * (sin(uv.x*2.0+uv.y*3.0+t*1.4)*0.5+0.5) * 0.035;

  vec3 col = base + c1 + c2 + c3 + c4;

  float bloom = sin(uv.x*4.2 + t*1.2) * cos(uv.y*3.6 + t) * 0.5 + 0.5;
  bloom = pow(bloom,2.3) * 0.06;
  col += vec3(0.9,0.32,0.62) * bloom * 0.14;

  float vign = 1.0 - dot(p,p) * 0.08;
  col *= vign;

  col += vWave * 0.22;
  col += vHover * 0.18 * vec3(0.22,0.36,0.97);

  float hoverCenter = 1.0 - length((uv-0.5)*2.0)*0.5;
  hoverCenter = clamp(hoverCenter,0.0,1.0);
  col += vHover * hoverCenter * 0.12;

  vec3 N = normalize(vNormal);
  float fres = pow(1.0 - max(dot(N, vec3(0.0,0.0,1.0)),0.0), 2.2) * (0.12 + vHover*0.14);
  col += fres;

  col = col / (col + vec3(1.0));
  col = pow(col, vec3(0.4545));

  gl_FragColor = vec4(col, alpha);
}
`

function ShowreelCard({ onHoverChange }: { onHoverChange?: (h: boolean) => void }) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { pointer, camera } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouseTarget = useRef(new THREE.Vector2(0, 0))
  const smoothMouse = useRef(new THREE.Vector2(0, 0))
  const mouseVel = useRef(0)
  const lastPointer = useRef({ x: 0, y: 0 })
  const hoverProg = useRef(0)
  const isHovering = useRef(false)
  const scrollVel = useRef(0)
  const lastScroll = useRef(0)

  const geometry = useMemo(() => new THREE.PlaneGeometry(14, 6, 64, 32), [])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: vert,
      fragmentShader: frag,
      uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseVelocity: { value: 0 },
        uHover: { value: 0 },
        uScrollVelocity: { value: 0 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [])

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const cur = e.detail.scroll || 0
      const delta = cur - lastScroll.current
      scrollVel.current = THREE.MathUtils.lerp(scrollVel.current, delta * 0.14, 0.2)
      lastScroll.current = cur
    }
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => window.removeEventListener('lusion-scroll' as any, onScroll as any)
  }, [])

  useEffect(() => {
    const onMove = () => {
      raycaster.current.setFromCamera(pointer, camera)
      if (!meshRef.current) return
      const hit = raycaster.current.intersectObject(meshRef.current)
      const hovering = hit.length > 0
      if (hovering !== isHovering.current) {
        isHovering.current = hovering
        onHoverChange?.(hovering)
      }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [pointer, camera, onHoverChange])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    raycaster.current.setFromCamera(pointer, camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const ip = new THREE.Vector3()
    const h = raycaster.current.ray.intersectPlane(plane, ip)
    if (h) {
      const tgt = new THREE.Vector2(ip.x, ip.y)
      smoothMouse.current.lerp(tgt, 0.14)
      mouseTarget.current.copy(smoothMouse.current)
    }

    const dx = pointer.x - lastPointer.current.x
    const dy = pointer.y - lastPointer.current.y
    const raw = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001)
    mouseVel.current = THREE.MathUtils.lerp(mouseVel.current, raw * 0.2, 0.14)
    mouseVel.current = Math.min(mouseVel.current, 4)

    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    const th = isHovering.current ? 1 : 0
    hoverProg.current = THREE.MathUtils.lerp(hoverProg.current, th, 0.08)

    material.uniforms.uTime.value = time
    material.uniforms.uMouse.value.copy(mouseTarget.current)
    material.uniforms.uMouseVelocity.value = mouseVel.current + hoverProg.current * 0.6
    material.uniforms.uHover.value = hoverProg.current
    material.uniforms.uScrollVelocity.value = scrollVel.current

    scrollVel.current *= 0.92

    if (meshRef.current) {
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        smoothMouse.current.x * 0.02 + hoverProg.current * 0.01,
        0.05
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        -smoothMouse.current.y * 0.015,
        0.05
      )
      meshRef.current.scale.setScalar(THREE.MathUtils.lerp(meshRef.current.scale.x, 1 + hoverProg.current * 0.02, 0.08))
    }
  })

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
    }
  }, [geometry, material])

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <primitive object={material} attach="material" />
    </mesh>
  )
}

function BlueSpline() {
  const tubeRef = useRef<THREE.Mesh>(null)
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null)
  const mouse = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })

  const { curve, geo } = useMemo(() => {
    const pts: THREE.Vector3[] = []
    const controls = [
      { x: -12, y: 3.2, z: -2.2 },
      { x: -7, y: 1.8, z: 1.6 },
      { x: -2.5, y: 0.6, z: -1.4 },
      { x: 1.2, y: -0.2, z: 2.0 },
      { x: 5.5, y: -0.8, z: -0.6 },
      { x: 9.2, y: -1.2, z: 1.2 },
      { x: 12.5, y: 0.8, z: -1.0 },
    ]
    controls.forEach((c) => pts.push(new THREE.Vector3(c.x, c.y, c.z)))
    const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.6)
    const geo = new THREE.TubeGeometry(curve, 180, 0.28, 16, false)
    return { curve, geo }
  }, [])

  curveRef.current = curve

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (!tubeRef.current || !curveRef.current) return

    smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, mouse.current.x, 0.05)
    smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, mouse.current.y, 0.05)

    const points = curveRef.current.points
    const base = [
      { x: -12, y: 3.2, z: -2.2 },
      { x: -7, y: 1.8, z: 1.6 },
      { x: -2.5, y: 0.6, z: -1.4 },
      { x: 1.2, y: -0.2, z: 2.0 },
      { x: 5.5, y: -0.8, z: -0.6 },
      { x: 9.2, y: -1.2, z: 1.2 },
      { x: 12.5, y: 0.8, z: -1.0 },
    ]

    for (let i = 0; i < points.length; i++) {
      const tt = i / (points.length - 1)
      const o = base[i]
      const mx = smoothMouse.current.x * Math.sin(tt * Math.PI * 1.4 + t * 0.5) * 0.9
      const my = smoothMouse.current.y * Math.cos(tt * Math.PI * 1.1 + t * 0.4) * 0.6
      const mz = (smoothMouse.current.x + smoothMouse.current.y) * 0.2 * Math.sin(tt * Math.PI * 2 + t * 0.3)

      points[i].x = o.x + mx + Math.sin(t * 0.32 + tt * 2.0) * 0.15
      points[i].y = o.y + my + Math.cos(t * 0.26 + tt * 1.7) * 0.18
      points[i].z = o.z + mz + Math.sin(t * 0.38 + tt * 2.2) * 0.22
    }

    const newGeo = new THREE.TubeGeometry(curveRef.current, 180, 0.28 + Math.sin(t * 0.6) * 0.02, 16, false)
    tubeRef.current.geometry.dispose()
    tubeRef.current.geometry = newGeo

    tubeRef.current.rotation.y = t * 0.02 + smoothMouse.current.x * 0.08
    tubeRef.current.rotation.x = smoothMouse.current.y * 0.04
  })

  useEffect(() => {
    return () => {
      geo.dispose()
    }
  }, [geo])

  return (
    <mesh ref={tubeRef} geometry={geo} position={[0, 0, -1.4]}>
      <meshPhysicalMaterial
        color="#1d4ed8"
        emissive="#1e3a8a"
        emissiveIntensity={0.18}
        roughness={0.15}
        metalness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.12}
        transmission={0.04}
        ior={1.45}
        sheen={0.4}
        sheenColor="#3b82f6"
      />
    </mesh>
  )
}

export default function LusionHeroCanvas() {
  const [isHovering, setIsHovering] = useState(false)

  return (
    <div className="relative w-full h-[100vh] bg-[#f7f7f9] overflow-hidden">
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        dpr={[1, 2]}
        camera={{ fov: 34, position: [0, 0, 8], near: 0.1, far: 100 }}
        style={{ background: '#f7f7f9', width: '100%', height: '100%' }}
        onCreated={({ gl }) => gl.setClearColor('#f7f7f9', 1)}
      >
        <ambientLight intensity={1.0} color="#ffffff" />
        <directionalLight position={[6, 7, 6]} intensity={1.15} color="#ffffff" />
        <directionalLight position={[-4, -2, 4]} intensity={0.5} color="#dbeafe" />
        <pointLight position={[0, 3, 4]} intensity={0.7} color="#ffffff" distance={14} />
        <pointLight position={[-3, -1, 2]} intensity={0.35} color="#1d4ed8" distance={10} />

        <BlueSpline />
        <ShowreelCard onHoverChange={setIsHovering} />
      </Canvas>

      {/* PLAY REEL overlay — centered on card */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div
          className="flex items-center gap-5 md:gap-9 will-change-transform"
          style={{
            transform: `scale(${isHovering ? 1.02 : 1})`,
            transition: 'transform 0.6s cubic-bezier(0.16,1,0.3,1)',
          }}
        >
          <span className="font-black tracking-[-0.04em] leading-none text-white text-[13vw] md:text-[9vw] lg:text-[7.2vw] drop-shadow-[0_2px_20px_rgba(0,0,0,0.18)] select-none">
            PLAY
          </span>

          <button
            className="pointer-events-auto group relative w-[62px] h-[62px] md:w-[82px] md:h-[82px] rounded-full bg-white text-black flex items-center justify-center text-[20px] md:text-[24px] shadow-[0_14px_36px_rgba(0,0,0,0.22)] transition-all duration-500 cursor-pointer"
            style={{
              transform: `scale(${isHovering ? 1.1 : 1})`,
            }}
          >
            <span className="translate-x-[1.5px]">▶</span>
            <span className="absolute inset-0 rounded-full border border-white/30 scale-100 group-hover:scale-[1.18] transition-transform duration-700" />
            <span className="absolute inset-0 rounded-full bg-white/0 group-hover:bg-white/10 transition-colors duration-500" />
          </button>

          <span className="font-black tracking-[-0.04em] leading-none text-white text-[13vw] md:text-[9vw] lg:text-[7.2vw] drop-shadow-[0_2px_20px_rgba(0,0,0,0.18)] select-none">
            REEL
          </span>
        </div>
      </div>

      {/* Subtle vignette for depth */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_62%,rgba(0,0,0,0.04)_100%)]" />
    </div>
  )
}
