/**
 * CLEAN LUSION — ElasticShowreel
 * Hero showreel only — no internal blue ribbon (global ribbon handles whole site)
 * PlaneGeometry(16,7,80,40), vertex warp, dynamic canvas texture
 * Scroll-only orderly: no time-based idle sin movement, only scroll/drag/mouse
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { elasticWarpVert } from '../../shaders/elasticWarp.vert'
import { elasticWarpFrag as frag } from '../../shaders/elasticWarp.frag'

interface ElasticShowreelProps {
  scrollProgress?: number
  onHoverChange?: (hovering: boolean) => void
}

export default function ElasticShowreel({ scrollProgress = 0, onHoverChange }: ElasticShowreelProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const { camera, pointer } = useThree()
  const raycaster = useRef(new THREE.Raycaster())
  const mouseTarget = useRef(new THREE.Vector2(0, 0))
  const smoothMouse = useRef(new THREE.Vector2(0, 0))
  const mouseVelocity = useRef(0)
  const mouseDeform = useRef(0)
  const lastPointer = useRef({ x: 0, y: 0 })
  const dragOffset = useRef(0)
  const isDragging = useRef(false)
  const dragStart = useRef(0)
  const scrollVelocity = useRef(0)
  const lastScroll = useRef(0)
  const isHoveringRef = useRef(false)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<number | null>(null)

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(16, 7, 80, 40)
  }, [])

  const videoTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 1280
    canvas.height = 720
    const ctx = canvas.getContext('2d')!

    const draw = (time: number) => {
      ctx.fillStyle = '#f6f6f8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      const t = time * 0.0002
      const cycle = Math.floor((time * 0.00018) % 5)
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      if (cycle === 0) {
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(0.5, '#eef2ff')
        grad.addColorStop(1, '#dbeafe')
      } else if (cycle === 1) {
        grad.addColorStop(0, '#f6f6f8')
        grad.addColorStop(0.5, '#fef3c7')
        grad.addColorStop(1, '#fde68a')
      } else if (cycle === 2) {
        grad.addColorStop(0, '#f6f6f8')
        grad.addColorStop(0.5, '#d1fae5')
        grad.addColorStop(1, '#a7f3d0')
      } else if (cycle === 3) {
        grad.addColorStop(0, '#f6f6f8')
        grad.addColorStop(0.5, '#ede9fe')
        grad.addColorStop(1, '#ddd6fe')
      } else {
        grad.addColorStop(0, '#f6f6f8')
        grad.addColorStop(0.5, '#ffe4e6')
        grad.addColorStop(1, '#fecdd3')
      }
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.globalAlpha = 0.07
      for (let i = 0; i < 8; i++) {
        const x = (Math.sin(t * 0.5 + i) * 0.5 + 0.5) * canvas.width
        const y = (Math.cos(t * 0.35 + i * 1.1) * 0.5 + 0.5) * canvas.height
        const r = 40 + Math.sin(t + i * 0.6) * 20
        ctx.fillStyle = i % 2 === 0 ? '#2563eb' : '#0b0b0d'
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = 'rgba(0,0,0,0.018)'
      for (let y = 0; y < canvas.height; y += 4) ctx.fillRect(0, y, canvas.width, 1)
    }
    draw(0)
    const canvasTex = new THREE.CanvasTexture(canvas)
    canvasTex.wrapS = THREE.ClampToEdgeWrapping
    canvasTex.wrapT = THREE.ClampToEdgeWrapping
    canvasTex.minFilter = THREE.LinearFilter
    canvasTex.magFilter = THREE.LinearFilter
    canvasTex.colorSpace = THREE.SRGBColorSpace
    ;(canvasTex as any).canvas = canvas
    ;(canvasTex as any).draw = draw
    return canvasTex
  }, [])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: elasticWarpVert,
      fragmentShader: frag,
      uniforms: {
        uTime: { value: 0 },
        uScrollVelocity: { value: 0 },
        uScrollProgress: { value: 0 },
        uMouseTarget: { value: new THREE.Vector2(0, 0) },
        uMouseDeform: { value: 0 },
        uMouseVelocity: { value: 0 },
        uDragOffset: { value: 0 },
        uFoldProgress: { value: 0 },
        uWaveIntensity: { value: 0.18 },
        uResolution: { value: new THREE.Vector2(1920, 1080) },
        uTexture: { value: videoTexture },
        uTextureEnabled: { value: videoTexture ? 1 : 0 },
        uRoundedRadius: { value: 0.18 },
      },
      side: THREE.DoubleSide,
    })
  }, [videoTexture])

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      isDragging.current = true
      dragStart.current = e.clientX
      document.body.style.cursor = 'grabbing'
    }
    const onUp = () => {
      isDragging.current = false
      document.body.style.cursor = ''
      const startOffset = dragOffset.current
      const startTime = performance.now()
      const animateBack = () => {
        const elapsed = (performance.now() - startTime) / 1000
        const damping = Math.exp(-elapsed * 9)
        dragOffset.current = startOffset * damping * Math.cos(elapsed * 14)
        if (Math.abs(dragOffset.current) > 0.001) requestAnimationFrame(animateBack)
        else dragOffset.current = 0
      }
      animateBack()
    }
    const onMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const delta = (e.clientX - dragStart.current) * 0.016
        dragOffset.current = THREE.MathUtils.lerp(dragOffset.current, delta, 0.13)
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

  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const delta = current - lastScroll.current
      scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, Math.abs(delta) * 0.12, 0.2)
      lastScroll.current = current
      isScrollingRef.current = true
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false
        scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, 0, 0.2)
      }, 120)
    }
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => {
      window.removeEventListener('lusion-scroll' as any, onScroll as any)
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime
    raycaster.current.setFromCamera(pointer, camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersectPoint = new THREE.Vector3()
    const hit = raycaster.current.ray.intersectPlane(plane, intersectPoint)
    if (hit) {
      const target = new THREE.Vector2(intersectPoint.x, intersectPoint.y)
      smoothMouse.current.lerp(target, 0.14)
      mouseTarget.current.copy(smoothMouse.current)
    }

    const dx = pointer.x - lastPointer.current.x
    const dy = pointer.y - lastPointer.current.y
    const rawVel = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001)
    mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, rawVel * 0.18, 0.15)
    mouseVelocity.current = Math.min(mouseVelocity.current, 4)

    const dist = mouseTarget.current.length()
    const deform = THREE.MathUtils.smoothstep(3.2, 0, dist) * mouseVelocity.current
    mouseDeform.current = THREE.MathUtils.lerp(mouseDeform.current, deform, 0.12)

    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    material.uniforms.uTime.value = time
    material.uniforms.uMouseTarget.value.copy(mouseTarget.current)
    material.uniforms.uMouseDeform.value = mouseDeform.current
    material.uniforms.uMouseVelocity.value = mouseVelocity.current
    material.uniforms.uScrollVelocity.value = scrollVelocity.current
    material.uniforms.uScrollProgress.value = scrollProgress
    material.uniforms.uDragOffset.value = dragOffset.current
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)

    // Scroll-only wave: no idle sin, only scroll + mouse + drag
    const baseWave = 0.12
    const scrollWave = isScrollingRef.current ? scrollVelocity.current * 0.6 : 0
    const targetWave = baseWave + scrollWave + mouseVelocity.current * 0.05 + Math.abs(dragOffset.current) * 0.02
    material.uniforms.uWaveIntensity.value = THREE.MathUtils.lerp(material.uniforms.uWaveIntensity.value, targetWave, 0.07)

    const foldProgress = THREE.MathUtils.smoothstep(scrollProgress, 0.12, 0.58)
    material.uniforms.uFoldProgress.value = THREE.MathUtils.lerp(material.uniforms.uFoldProgress.value, foldProgress, 0.05)

    if (videoTexture && (videoTexture as any).draw) {
      // Only update texture when scrolling or mouse moving for performance + orderly feel
      if (isScrollingRef.current || mouseVelocity.current > 0.01) {
        ;(videoTexture as any).draw(performance.now())
        videoTexture.needsUpdate = true
      }
    }

    if (!isScrollingRef.current) {
      scrollVelocity.current *= 0.9
      if (Math.abs(scrollVelocity.current) < 0.001) scrollVelocity.current = 0
    }

    if (meshRef.current) {
      // No time-based sine — only fold progress + drag
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -foldProgress * 0.65, 0.045)
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, foldProgress * -0.18, 0.045)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        smoothMouse.current.x * 0.025 + dragOffset.current * 0.014,
        0.05
      )
    }
  })

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
      if (videoTexture) videoTexture.dispose()
    }
  }, [geometry, material, videoTexture])

  return (
    <group>
      <ambientLight intensity={0.95} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={1} color="#ffffff" />
      <directionalLight position={[-3, 2, 3]} intensity={0.45} color="#f6f6f8" />
      <pointLight position={[0, 3, 4]} intensity={0.6} color="#ffffff" distance={14} />

      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
        <primitive object={material} attach="material" />
      </mesh>

      <mesh position={[0, -0.1, -0.06]}>
        <planeGeometry args={[16.6, 7.1, 1, 1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.025} />
      </mesh>
    </group>
  )
}
