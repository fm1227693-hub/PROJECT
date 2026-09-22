import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { Environment, Lightformer } from '@react-three/drei'
import * as THREE from 'three'

export default function LightingCaustics({ scrollProgress = 0 }) {
  const keyLightRef = useRef()
  const rimLightRef = useRef()
  const fillLightRef = useRef()

  useFrame((state) => {
    const t = state.clock.elapsedTime
    if (keyLightRef.current) {
      // Subtle animated studio lighting
      keyLightRef.current.position.x = Math.sin(t * 0.3) * 0.5 + 3
      keyLightRef.current.position.y = Math.cos(t * 0.2) * 0.3 + 2.5
      keyLightRef.current.intensity = 2.2 + Math.sin(t * 0.5) * 0.2 + scrollProgress * 0.5
    }
    if (rimLightRef.current) {
      rimLightRef.current.intensity = 1.8 + Math.cos(t * 0.4) * 0.3
    }
  })

  return (
    <>
      {/* Multi-point studio lighting */}
      <pointLight ref={keyLightRef} position={[3, 2.5, 4]} intensity={2.2} color="#ffffff" distance={12} decay={2} />
      <pointLight ref={rimLightRef} position={[-3, -1, -2]} intensity={1.8} color="#7928ca" distance={10} decay={2} />
      <pointLight ref={fillLightRef} position={[0, 3, -3]} intensity={1.2} color="#00f0ff" distance={10} decay={2} />
      <spotLight position={[0, 5, 5]} angle={0.35} penumbra={0.8} intensity={3} color="#fff" castShadow={false} />
      <spotLight position={[-4, -2, 3]} angle={0.5} penumbra={1} intensity={1.5} color="#ff8a00" />
      <ambientLight intensity={0.25} color="#ffffff" />

      {/* HDR reflection for glass */}
      <Environment resolution={256} background={false} blur={0.4}>
        <group rotation={[0, 0, 0]}>
          <Lightformer form="rect" intensity={3} color="#ffffff" position={[5, 5, 5]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={2} color="#7928ca" position={[-5, 2, -2]} scale={[6, 4, 1]} rotation={[0, Math.PI/2, 0]} />
          <Lightformer form="rect" intensity={1.5} color="#00f0ff" position={[0, -4, 3]} scale={[10, 2, 1]} rotation={[Math.PI/2, 0, 0]} />
          <Lightformer form="circle" intensity={2.5} color="#fff" position={[0, 8, -5]} scale={[4, 4, 1]} />
        </group>
      </Environment>

      {/* Caustics projection - subtle ground */}
      <mesh rotation={[-Math.PI/2, 0, 0]} position={[0, -3.5, 0]} receiveShadow={false}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#050508" transparent opacity={0.9} />
      </mesh>
    </>
  )
}
