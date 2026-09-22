/**
 * LUSION CANVAS ORCHESTRATOR
 * R3F, lights, postprocessing, tone mapping, responsive resizing
 * Production-grade with proper cleanup
 */

import { Suspense, useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Preload, PerspectiveCamera, Environment, Lightformer } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette, ChromaticAberration } from '@react-three/postprocessing'
import { BlendFunction, ToneMappingMode } from 'postprocessing'
import * as THREE from 'three'

import OrganicFluid from './OrganicFluid'
import ParticleStream from './ParticleStream'

interface LusionCanvasProps {
  scrollProgress?: number
}

function LightingRig({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const keyLightRef = useRef<THREE.PointLight>(null)
  const rimLightRef = useRef<THREE.PointLight>(null)
  const fillLightRef = useRef<THREE.PointLight>(null)

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (keyLightRef.current) {
      keyLightRef.current.position.x = Math.sin(t * 0.28) * 0.6 + 3.2
      keyLightRef.current.position.y = Math.cos(t * 0.22) * 0.4 + 2.8
      keyLightRef.current.intensity = 2.4 + Math.sin(t * 0.6) * 0.25 + scrollProgress * 0.6
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 2.0 + Math.cos(t * 0.45) * 0.35
      rimLightRef.current.position.z = -2.5 + Math.sin(t * 0.3) * 0.5
    }
    if (fillLightRef.current) {
      fillLightRef.current.intensity = 1.3 + Math.sin(t * 0.5) * 0.2
    }
  })

  return (
    <>
      {/* Multi-point studio lighting */}
      <pointLight ref={keyLightRef} position={[3.2, 2.8, 4.2]} intensity={2.4} color="#ffffff" distance={14} decay={2} />
      <pointLight ref={rimLightRef} position={[-3.5, -1.2, -2.5]} intensity={2.0} color="#7a2bff" distance={12} decay={2} />
      <pointLight ref={fillLightRef} position={[0, 3.2, -3.2]} intensity={1.3} color="#00f0ff" distance={11} decay={2} />
      <spotLight position={[0, 6, 5]} angle={0.32} penumbra={0.85} intensity={3.2} color="#ffffff" castShadow={false} />
      <spotLight position={[-4.5, -2.5, 3.2]} angle={0.48} penumbra={1} intensity={1.6} color="#ff8a00" />
      <ambientLight intensity={0.22} color="#ffffff" />

      {/* HDR reflection for true physical dispersion */}
      <Environment resolution={512} background={false} blur={0.35}>
        <group rotation={[0, 0, 0]}>
          <Lightformer form="rect" intensity={4} color="#ffffff" position={[6, 5, 5]} scale={[10, 4, 1]} />
          <Lightformer form="rect" intensity={2.5} color="#7a2bff" position={[-6, 2, -2]} scale={[8, 5, 1]} rotation={[0, Math.PI / 2, 0]} />
          <Lightformer form="rect" intensity={2} color="#00f0ff" position={[0, -5, 4]} scale={[12, 3, 1]} rotation={[Math.PI / 2, 0, 0]} />
          <Lightformer form="circle" intensity={3} color="#ffffff" position={[0, 9, -6]} scale={[5, 5, 1]} />
          <Lightformer form="ring" intensity={1.5} color="#ff8a00" position={[3, -3, -3]} scale={[4, 4, 1]} />
        </group>
      </Environment>

      {/* Ground absorption */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4.2, 0]}>
        <planeGeometry args={[28, 28]} />
        <meshBasicMaterial color="#050508" transparent opacity={0.92} />
      </mesh>
    </>
  )
}

function CameraRig({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const { camera } = useThree()
  const targetPos = useRef(new THREE.Vector3(0, 0, 8))
  const currentLookAt = useRef(new THREE.Vector3(0, 0, 0))

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime
    const scroll = scrollProgress

    // Viscous scroll choreography & camera dynamics per spec
    if (scroll >= 0.25 && scroll <= 0.65) {
      // [25%-50%] Viscous elongation Y-stretch + Z-orbit, 45deg glide
      const phaseT = THREE.MathUtils.mapLinear(scroll, 0.25, 0.65, 0, 1)
      const angle = phaseT * (Math.PI * 0.25) // 45deg = PI/4
      const radius = 8
      targetPos.current.x = Math.sin(angle) * radius * 0.65 + Math.sin(t * 0.1) * 0.15
      targetPos.current.z = Math.cos(angle) * radius + Math.cos(t * 0.08) * 0.1
      targetPos.current.y = Math.sin(phaseT * Math.PI) * 0.9 + Math.sin(t * 0.12) * 0.12
      currentLookAt.current.y = THREE.MathUtils.lerp(currentLookAt.current.y, Math.sin(phaseT * Math.PI) * 0.3, 0.04)
    } else if (scroll < 0.25) {
      // [0%-25%] Resting breathing state
      targetPos.current.x = Math.sin(t * 0.08) * 0.25
      targetPos.current.y = Math.cos(t * 0.06) * 0.18
      targetPos.current.z = 8 + Math.sin(t * 0.05) * 0.15
      currentLookAt.current.set(0, 0, 0)
    } else if (scroll >= 0.65 && scroll < 0.75) {
      // [50%-75%] Prism explodes — camera pulls back slightly
      const phaseT = THREE.MathUtils.mapLinear(scroll, 0.65, 0.75, 0, 1)
      targetPos.current.z = THREE.MathUtils.lerp(8, 9.5, phaseT)
      targetPos.current.x = Math.sin(phaseT * Math.PI * 0.5) * 0.8
      currentLookAt.current.y = THREE.MathUtils.lerp(currentLookAt.current.y, -0.2, 0.03)
    } else {
      // [75%-100%] Coalesce into glowing loop anchoring near footer
      const phaseT = THREE.MathUtils.mapLinear(scroll, 0.75, 1.0, 0, 1)
      targetPos.current.x = THREE.MathUtils.lerp(targetPos.current.x, 0.2, 0.04)
      targetPos.current.y = THREE.MathUtils.lerp(targetPos.current.y, -1.2 * phaseT, 0.04)
      targetPos.current.z = THREE.MathUtils.lerp(targetPos.current.z, 7.2, 0.04)
      currentLookAt.current.y = THREE.MathUtils.lerp(currentLookAt.current.y, -1.8 * phaseT, 0.04)
    }

    // Smooth lerp with viscous damping
    camera.position.lerp(targetPos.current, 0.035)
    // Look at with inertia
    ;(camera as THREE.PerspectiveCamera).lookAt(currentLookAt.current)
  })

  return null
}

function ResponsiveHandler() {
  const { gl, camera } = useThree()

  useEffect(() => {
    const onResize = () => {
      const width = window.innerWidth
      const height = window.innerHeight
      gl.setSize(width, height)
      ;(camera as THREE.PerspectiveCamera).aspect = width / height
      ;(camera as THREE.PerspectiveCamera).updateProjectionMatrix()
    }
    window.addEventListener('resize', onResize, { passive: true })
    return () => window.removeEventListener('resize', onResize)
  }, [gl, camera])

  return null
}

export default function LusionCanvas({ scrollProgress = 0 }: LusionCanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null)

  // Tone mapping and output
  const glProps = useMemo(
    () => ({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance' as const,
      stencil: false,
      depth: true,
      preserveDrawingBuffer: false,
    }),
    []
  )

  return (
    <div ref={canvasRef} className="fixed inset-0 z-0 w-full h-[100vh] pointer-events-none">
      <Canvas
        gl={glProps}
        dpr={[1, 2]}
        camera={{ fov: 34, position: [0, 0, 8], near: 0.1, far: 100 }}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
        onCreated={({ gl, scene }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping
          gl.toneMappingExposure = 1.25
          gl.outputColorSpace = THREE.SRGBColorSpace
          gl.setClearColor('#050508', 1)
          scene.fog = new THREE.FogExp2('#050508', 0.018)
        }}
      >
        <PerspectiveCamera makeDefault fov={34} position={[0, 0, 8]} near={0.1} far={100} />
        <ResponsiveHandler />
        <CameraRig scrollProgress={scrollProgress} />

        <Suspense fallback={null}>
          <LightingRig scrollProgress={scrollProgress} />
          <OrganicFluid scrollProgress={scrollProgress} />
          <ParticleStream count={8000} scrollProgress={scrollProgress} />
        </Suspense>

        {/* Postprocessing Pipeline per spec */}
        <EffectComposer enableNormalPass={false} multisampling={0}>
          {/* Depth-of-Field bokeh with shallow focus on organic body */}
          <DepthOfField focusDistance={0.008} focalLength={0.018} bokehScale={3.5} height={480} />
          {/* High-luminance selective Bloom for core caustics */}
          <Bloom intensity={1.25} luminanceThreshold={0.85} luminanceSmoothing={0.28} mipmapBlur radius={0.62} />
          {/* Micro cinematic film grain alpha 0.04 */}
          <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.04} />
          <Vignette eskil={false} offset={0.12} darkness={0.38} blendFunction={BlendFunction.NORMAL} />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0006, 0.0006)}
            radialModulation={false}
            modulationOffset={0.12}
          />
        </EffectComposer>

        <Preload all />
      </Canvas>

      {/* Grain fallback + depth gradients */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-soft-light"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050508]/20 via-transparent to-[#050508]/85" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050508]/30 via-transparent to-[#050508]/30" />
    </div>
  )
}
