/**
 * LUSION HOMEPAGE — HeroRibbon
 * Full-width horizontal interactive 3D curved plane/ribbon
 * PlaneGeometry(16, 6, 64, 32) + elastic mesh distortion
 * Dynamic canvas texture + chromatic aberration + studio lighting
 * Lenis lerp 0.08 synced with GSAP ScrollTrigger to fold/unfold into curved arc
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { useTexture } from '@react-three/drei'
import { ribbonVertexShader, ribbonFragmentShader } from '../../shaders/ribbonShader'

interface HeroRibbonProps {
  scrollProgress?: number
  onHoverChange?: (hovering: boolean) => void
}

export default function HeroRibbon({ scrollProgress = 0, onHoverChange }: HeroRibbonProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, pointer, viewport, gl } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouseTarget = useRef(new THREE.Vector2(0, 0))
  const smoothMouse = useRef(new THREE.Vector2(0, 0))
  const mouseVelocity = useRef(0)
  const lastPointer = useRef({ x: 0, y: 0 })
  const dragOffset = useRef(0)
  const isDragging = useRef(false)
  const dragStart = useRef(0)
  const isHoveringRef = useRef(false)

  // Geometry per spec: PlaneGeometry(16, 6, 64, 32) positioned horizontally
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 6, 64, 32)
    // Centered horizontally, slightly curved by default
    return geo
  }, [])

  // Dynamic canvas texture for showreel — create procedural canvas
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024
    canvas.height = 512
    const ctx = canvas.getContext('2d')!

    // Initial draw — light studio
    ctx.fillStyle = '#f9f9fb'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Simulate showreel frames
    const draw = (time: number) => {
      ctx.fillStyle = '#f9f9fb'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
      grad.addColorStop(0, '#ffffff')
      grad.addColorStop(0.5, '#f5f5f7')
      grad.addColorStop(1, '#ffffff')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Abstract showreel shapes
      ctx.fillStyle = '#0b0b0d'
      ctx.globalAlpha = 0.06
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(time * 0.0005 + i) * 0.5 + 0.5) * canvas.width
        const y = (Math.cos(time * 0.0003 + i * 1.3) * 0.5 + 0.5) * canvas.height
        const r = 40 + Math.sin(time * 0.001 + i) * 20
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Text placeholder for showreel
      ctx.fillStyle = '#0b0b0d'
      ctx.font = 'bold 48px Geist, Inter, sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('SHOWREEL 2024 — 2025', canvas.width / 2, canvas.height / 2)

      ctx.font = '12px Geist Mono, monospace'
      ctx.fillStyle = 'rgba(11,11,13,0.4)'
      ctx.fillText('LUSION • BOLD IDEAS, BROUGHT TO LIFE', canvas.width / 2, canvas.height / 2 + 40)
    }

    draw(0)

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.colorSpace = THREE.SRGBColorSpace

    // Store canvas for animation
    ;(texture as any).canvas = canvas
    ;(texture as any).ctx = ctx
    ;(texture as any).draw = draw

    return texture
  }, [])

  // Shader material with uniforms per spec
  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: ribbonVertexShader,
      fragmentShader: ribbonFragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uWaveIntensity: { value: 0.35 },
        uMouseTarget: { value: new THREE.Vector2(0, 0) },
        uMouseVelocity: { value: 0 },
        uScrollProgress: { value: 0 },
        uDragOffset: { value: 0 },
        uFoldProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(1920, 1080) },
        uTexture: { value: canvasTexture },
        uTextureEnabled: { value: 1 },
      },
      side: THREE.DoubleSide,
      transparent: false,
    })
  }, [canvasTexture])

  // Mouse drag handling for elastic rubber/cloth
  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      isDragging.current = true
      dragStart.current = e.clientX
      document.body.style.cursor = 'grabbing'
    }
    const onUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      // Spring back
      const startOffset = dragOffset.current
      const startTime = performance.now()
      const animateBack = () => {
        const elapsed = (performance.now() - startTime) / 1000
        const damping = Math.exp(-elapsed * 8)
        dragOffset.current = startOffset * damping * Math.cos(elapsed * 12)
        if (Math.abs(dragOffset.current) > 0.001) {
          requestAnimationFrame(animateBack)
        } else {
          dragOffset.current = 0
        }
      }
      animateBack()
    }
    const onMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const delta = (e.clientX - dragStart.current) * 0.015
        dragOffset.current = THREE.MathUtils.lerp(dragOffset.current, delta, 0.12)
      }
    }

    window.addEventListener('mousedown', onDown)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('mousemove', onMove)

    return () => {
      window.removeEventListener('mousedown', onDown)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  // Hover detection for cursor morph
  useEffect(() => {
    const onPointerMove = () => {
      raycaster.current.setFromCamera(pointer, camera)
      if (!meshRef.current) return
      const intersects = raycaster.current.intersectObject(meshRef.current)
      const hovering = intersects.length > 0
      if (hovering !== isHoveringRef.current) {
        isHoveringRef.current = hovering
        onHoverChange?.(hovering)
        document.body.style.cursor = hovering ? 'grab' : ''
      }
    }
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    return () => window.removeEventListener('mousemove', onPointerMove)
  }, [camera, pointer, onHoverChange])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Raycast for mouse target per spec — calculate planar projection
    raycaster.current.setFromCamera(pointer, camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersectPoint = new THREE.Vector3()
    const hit = raycaster.current.ray.intersectPlane(plane, intersectPoint)

    if (hit) {
      const target = new THREE.Vector2(intersectPoint.x, intersectPoint.y)
      smoothMouse.current.lerp(target, 0.12)
      mouseTarget.current.copy(smoothMouse.current)
    }

    // Mouse velocity
    const dx = pointer.x - lastPointer.current.x
    const dy = pointer.y - lastPointer.current.y
    const rawVel = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001)
    mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, rawVel * 0.18, 0.14)
    mouseVelocity.current = Math.min(mouseVelocity.current, 4.5)
    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    // Update uniforms per spec
    material.uniforms.uTime.value = time
    material.uniforms.uMouseTarget.value.copy(mouseTarget.current)
    material.uniforms.uMouseVelocity.value = mouseVelocity.current
    material.uniforms.uScrollProgress.value = scrollProgress
    material.uniforms.uDragOffset.value = dragOffset.current
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)

    // Wave intensity — subtle idle + scroll boost
    const idleWave = 0.25 + Math.sin(time * 0.6) * 0.08
    const scrollWave = scrollProgress * 0.35
    material.uniforms.uWaveIntensity.value = THREE.MathUtils.lerp(
      material.uniforms.uWaveIntensity.value,
      idleWave + scrollWave + mouseVelocity.current * 0.08,
      0.06
    )

    // Fold/unfold into curved arc as user scrolls down per spec
    const foldProgress = THREE.MathUtils.smoothstep(scrollProgress, 0.15, 0.65)
    material.uniforms.uFoldProgress.value = THREE.MathUtils.lerp(
      material.uniforms.uFoldProgress.value,
      foldProgress,
      0.05
    )

    // Animate canvas texture for dynamic showreel
    if ((canvasTexture as any).draw) {
      ;(canvasTexture as any).draw(performance.now())
      canvasTexture.needsUpdate = true
    }

    // Mesh subtle rotation and position based on scroll — fold/unfold
    if (meshRef.current) {
      // Base position — center
      meshRef.current.position.y = THREE.MathUtils.lerp(
        meshRef.current.position.y,
        -foldProgress * 0.8 + Math.sin(time * 0.3) * 0.05,
        0.04
      )
      meshRef.current.rotation.x = THREE.MathUtils.lerp(
        meshRef.current.rotation.x,
        foldProgress * -0.25,
        0.04
      )
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        smoothMouse.current.x * 0.04 + dragOffset.current * 0.02,
        0.05
      )
    }
  })

  // Cleanup
  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
      canvasTexture.dispose()
    }
  }, [geometry, material, canvasTexture])

  return (
    <group>
      {/* Studio lighting for ribbon */}
      <ambientLight intensity={0.8} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-3, 2, 3]} intensity={0.6} color="#f0f0f5" />
      <pointLight position={[0, 3, 4]} intensity={0.8} color="#ffffff" distance={12} />

      {/* Elastic ribbon plane per spec */}
      <mesh ref={meshRef} geometry={geometry} rotation={[0, 0, 0]} position={[0, 0, 0]}>
        <primitive object={material} attach="material" />
      </mesh>

      {/* Shadow plane underneath for depth */}
      <mesh position={[0, -0.1, -0.05]} rotation={[0, 0, 0]}>
        <planeGeometry args={[16.5, 6.5, 1, 1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.04} />
      </mesh>
    </group>
  )
}
