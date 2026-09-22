import { Suspense, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { Preload, PerspectiveCamera } from '@react-three/drei'
import { EffectComposer, Bloom, DepthOfField, Noise, Vignette } from '@react-three/postprocessing'
import { BlendFunction } from 'postprocessing'
import OrganicLiquidMesh from './OrganicLiquidMesh'
import FluidRibbons from './FluidRibbons'
import LightingCaustics from './LightingCaustics'

export default function LusionCanvas({ scrollProgress = 0 }) {
  const cameraRef = useRef()

  return (
    <div className="fixed inset-0 z-0 w-full h-[100vh] pointer-events-none">
      {/* Canvas with R3F per spec */}
      <Canvas
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          stencil: false,
          depth: true,
        }}
        dpr={[1, 2]}
        camera={{ fov: 35, position: [0, 0, 8], near: 0.1, far: 100 }}
        style={{ background: 'transparent', pointerEvents: 'auto' }}
        onCreated={({ gl }) => {
          gl.toneMappingExposure = 1.2
          gl.setClearColor('#050508', 1)
        }}
      >
        <PerspectiveCamera ref={cameraRef} makeDefault fov={35} position={[0, 0, 8]} />
        
        <Suspense fallback={null}>
          <LightingCaustics scrollProgress={scrollProgress} />
          <OrganicLiquidMesh scrollProgress={scrollProgress} />
          <FluidRibbons count={6000} scrollProgress={scrollProgress} />
        </Suspense>

        {/* Post-Processing Pipeline per spec */}
        <EffectComposer enableNormalPass={false} multisampling={0}>
          {/* Depth-of-Field bokeh with shallow focus on organic body */}
          <DepthOfField
            focusDistance={0.008}
            focalLength={0.02}
            bokehScale={3.2}
            height={480}
            blur={true}
          />
          {/* High-luminance selective Bloom for core caustics */}
          <Bloom
            intensity={1.2}
            luminanceThreshold={0.85}
            luminanceSmoothing={0.3}
            mipmapBlur
            radius={0.6}
          />
          {/* Micro cinematic film grain alpha 0.04 to eliminate 8-bit banding */}
          <Noise
            premultiply
            blendFunction={BlendFunction.SOFT_LIGHT}
            opacity={0.04}
          />
          <Vignette eskil={false} offset={0.1} darkness={0.35} blendFunction={BlendFunction.NORMAL} />
        </EffectComposer>

        <Preload all />
      </Canvas>

      {/* Grain overlay fallback */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03] mix-blend-soft-light" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
      }} />

      {/* Depth gradient */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[#050508]/20 via-transparent to-[#050508]/80" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#050508]/30 via-transparent to-[#050508]/30" />
    </div>
  )
}
