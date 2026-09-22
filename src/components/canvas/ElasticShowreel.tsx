/**
 * CLEAN LUSION — ElasticShowreel
 * Subdivided curved plane mesh, dynamic texture cycling, vertex warp shaders, looping blue spline
 * Rounded horizontal showcase frame 16:7, high-energy looping videos / high-res 3D renders
 * Blue organic 3D ribbon: thick smooth continuous extruded spline/tube #2563eb glossy royal-blue
 * No debug typography, clean #f6f6f8 background
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { elasticWarpVert, elasticWarpFrag } from '../../shaders/elasticWarp.vert'
import { elasticWarpFrag as frag } from '../../shaders/elasticWarp.frag'

interface ElasticShowreelProps {
  scrollProgress?: number
  onHoverChange?: (hovering: boolean) => void
}

function BlueOrganicRibbon({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const tubeRef = useRef<THREE.Mesh>(null)
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null)

  // Scroll-linked movement: pastga qilinsa pastga, tepaga qilinsa tepaga
  const scrollVelocitySigned = useRef(0)
  const scrollDirection = useRef(1)
  const lastScroll = useRef(0)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const targetX = useRef(0)
  const currentX = useRef(0)

  const { curve, tubeGeo } = useMemo(() => {
    const points: THREE.Vector3[] = []
    for (let i = 0; i < 80; i++) {
      const t = i / 79
      const x = (t - 0.5) * 26
      const y = Math.sin(t * Math.PI * 2.2) * 1.6 + Math.cos(t * Math.PI * 1.3) * 0.9 + Math.sin(t * Math.PI * 0.7) * 0.4
      const z = Math.cos(t * Math.PI * 1.6) * 2.2 - 1.2 + Math.sin(t * Math.PI * 2.8) * 0.6 + Math.cos(t * Math.PI * 0.9) * 0.3
      points.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.55)
    const tubeGeo = new THREE.TubeGeometry(curve, 160, 0.24, 16, false)
    return { curve, tubeGeo }
  }, [])

  curveRef.current = curve

  // Listen to scroll for direction-aware movement
  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const velocity = e.detail.velocity || 0
      const direction = e.detail.direction || 1
      const delta = current - lastScroll.current

      // Signed velocity: + = pastga (down), - = tepaga (up)
      scrollVelocitySigned.current = THREE.MathUtils.lerp(scrollVelocitySigned.current, delta * 0.12, 0.18)
      scrollDirection.current = direction
      lastScroll.current = current

      // Target Y: scroll down → move down (more negative), scroll up → move up (more positive)
      // Base on scrollProgress + velocity kick
      const baseY = -scrollProgress * 2.2
      const velocityKick = scrollVelocitySigned.current * 2.8 // pastga + = pastga, tepaga - = tepaga
      targetY.current = baseY + velocityKick

      // Also subtle X shift based on velocity for organic feel
      targetX.current = velocity * 0.015 * direction
    }

    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => window.removeEventListener('lusion-scroll' as any, onScroll as any)
  }, [scrollProgress])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (!tubeRef.current || !curveRef.current) return

    // Smooth lerp for scroll-linked movement — viscous
    currentY.current = THREE.MathUtils.lerp(currentY.current, targetY.current, 0.045)
    currentX.current = THREE.MathUtils.lerp(currentX.current, targetX.current, 0.05)

    // Decay signed velocity
    scrollVelocitySigned.current *= 0.92
    if (Math.abs(scrollVelocitySigned.current) < 0.001) scrollVelocitySigned.current = 0
    // Return target to base when idle
    if (Math.abs(scrollVelocitySigned.current) < 0.01) {
      targetY.current = THREE.MathUtils.lerp(targetY.current, -scrollProgress * 2.2, 0.03)
      targetX.current = THREE.MathUtils.lerp(targetX.current, 0, 0.04)
    }

    const points = curveRef.current.points
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      const baseX = (t - 0.5) * 26
      const baseY = Math.sin(t * Math.PI * 2.2 + time * 0.35) * 1.6 + Math.cos(t * Math.PI * 1.3 + time * 0.18) * 0.9
      const baseZ = Math.cos(t * Math.PI * 1.6 + time * 0.28) * 2.2 - 1.2 + Math.sin(t * Math.PI * 2.8 + time * 0.42) * 0.6

      const scrollInfluence = scrollProgress * 0.9
      // Add scroll velocity to curve winding — pastga/tepage yurishi
      const velocityOffsetY = scrollVelocitySigned.current * Math.sin(t * Math.PI) * 1.2
      const velocityOffsetX = scrollVelocitySigned.current * 0.3 * Math.cos(t * Math.PI * 0.8)

      points[i].x = baseX + Math.sin(time * 0.18 + t * 1.8) * 0.2 * scrollInfluence + velocityOffsetX
      points[i].y = baseY + Math.cos(time * 0.25 + t) * 0.25 * (1 + scrollInfluence * 0.5) + velocityOffsetY
      points[i].z = baseZ + Math.sin(time * 0.22 + t * 1.4) * 0.18 + scrollVelocitySigned.current * 0.15 * Math.sin(t * Math.PI * 2)
    }

    const newTube = new THREE.TubeGeometry(curveRef.current, 160, 0.24 + Math.sin(time * 0.7) * 0.03 + Math.abs(scrollVelocitySigned.current) * 0.04, 16, false)
    tubeRef.current.geometry.dispose()
    tubeRef.current.geometry = newTube

    // Main mesh movement — pastga qilinsa pastga, tepaga qilinsa tepaga
    tubeRef.current.rotation.y = time * 0.04 + scrollProgress * 0.25 + currentX.current * 0.3
    tubeRef.current.position.y = Math.sin(time * 0.18) * 0.12 + currentY.current
    tubeRef.current.position.x = currentX.current * 0.8
    tubeRef.current.position.z = -0.9 + Math.sin(time * 0.15) * 0.08 + scrollVelocitySigned.current * 0.1
  })

  useEffect(() => {
    return () => {
      tubeGeo.dispose()
    }
  }, [tubeGeo])

  return (
    <mesh ref={tubeRef} geometry={tubeGeo} position={[0, 0, -0.9]}>
      <meshPhysicalMaterial
        color="#2563eb"
        emissive="#1e40af"
        emissiveIntensity={0.18}
        roughness={0.2}
        metalness={0.14}
        clearcoat={0.9}
        clearcoatRoughness={0.16}
        transmission={0.08}
        ior={1.4}
        transparent={false}
      />
    </mesh>
  )
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

  // Subdivided curved plane mesh per spec — PlaneGeometry(16, 7, 80, 40) for rounded showcase frame aspect ~16:7
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 7, 80, 40)
    return geo
  }, [])

  // High-energy looping videos / high-res creative 3D renders — working CDN links + dynamic colorful WebGL textures
  const videoTexture = useMemo(() => {
    // Try video texture, fallback to canvas
    if (typeof document === 'undefined') return null

    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.playsInline = true
    video.autoplay = true
    // Working CDN — Big Buck Bunny sample (CORS enabled)
    video.src = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

    // Also create canvas fallback with high-energy colorful renders
    const canvas = document.createElement('canvas')
    canvas.width = 1280
    canvas.height = 720
    const ctx = canvas.getContext('2d')!

    const draw = (time: number) => {
      // Pristine light background #f6f6f8 per spec
      ctx.fillStyle = '#f6f6f8'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // High-energy colorful WebGL textures simulation
      const t = time * 0.00035
      const cycle = Math.floor((time * 0.00025) % 5)

      // Dynamic gradient
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

      // Abstract high-res 3D renders
      ctx.globalAlpha = 0.08
      for (let i = 0; i < 10; i++) {
        const x = (Math.sin(t * 0.6 + i) * 0.5 + 0.5) * canvas.width
        const y = (Math.cos(t * 0.4 + i * 1.1) * 0.5 + 0.5) * canvas.height
        const r = 50 + Math.sin(t + i * 0.7) * 25
        ctx.fillStyle = i % 2 === 0 ? '#2563eb' : '#0b0b0d'
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Subtle scanline for video feel
      ctx.fillStyle = 'rgba(0,0,0,0.02)'
      for (let y = 0; y < canvas.height; y += 4) {
        ctx.fillRect(0, y, canvas.width, 1)
      }
    }

    draw(0)

    const canvasTex = new THREE.CanvasTexture(canvas)
    canvasTex.wrapS = THREE.ClampToEdgeWrapping
    canvasTex.wrapT = THREE.ClampToEdgeWrapping
    canvasTex.minFilter = THREE.LinearFilter
    canvasTex.magFilter = THREE.LinearFilter
    canvasTex.colorSpace = THREE.SRGBColorSpace

    ;(canvasTex as any).canvas = canvas
    ;(canvasTex as any).ctx = ctx
    ;(canvasTex as any).draw = draw

    // Try video texture
    const videoTex = new THREE.VideoTexture(video)
    videoTex.wrapS = THREE.ClampToEdgeWrapping
    videoTex.wrapT = THREE.ClampToEdgeWrapping
    videoTex.minFilter = THREE.LinearFilter
    videoTex.magFilter = THREE.LinearFilter
    videoTex.colorSpace = THREE.SRGBColorSpace

    video.addEventListener('canplay', () => {
      video.play().catch(() => {})
    })

    // Return video texture if possible, otherwise canvas
    // We'll use canvas as primary to avoid CORS issues, but video as fallback attempt
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
        uWaveIntensity: { value: 0.28 },
        uResolution: { value: new THREE.Vector2(1920, 1080) },
        uTexture: { value: videoTexture },
        uTextureEnabled: { value: videoTexture ? 1 : 0 },
        uRoundedRadius: { value: 0.18 },
      },
      side: THREE.DoubleSide,
    })
  }, [videoTexture])

  // Drag handling
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
      scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, Math.abs(delta) * 0.09, 0.15)
      lastScroll.current = current
    }
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => window.removeEventListener('lusion-scroll' as any, onScroll as any)
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
    mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, rawVel * 0.2, 0.15)
    mouseVelocity.current = Math.min(mouseVelocity.current, 5)

    const dist = mouseTarget.current.length()
    const deform = THREE.MathUtils.smoothstep(3.5, 0, dist) * mouseVelocity.current
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

    const idleWave = 0.22 + Math.sin(time * 0.5) * 0.06
    material.uniforms.uWaveIntensity.value = THREE.MathUtils.lerp(
      material.uniforms.uWaveIntensity.value,
      idleWave + scrollProgress * 0.28 + mouseVelocity.current * 0.06,
      0.06
    )

    const foldProgress = THREE.MathUtils.smoothstep(scrollProgress, 0.12, 0.58)
    material.uniforms.uFoldProgress.value = THREE.MathUtils.lerp(material.uniforms.uFoldProgress.value, foldProgress, 0.05)

    if (videoTexture && (videoTexture as any).draw) {
      ;(videoTexture as any).draw(performance.now())
      videoTexture.needsUpdate = true
    }

    scrollVelocity.current *= 0.92

    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -foldProgress * 0.7 + Math.sin(time * 0.25) * 0.03, 0.04)
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, foldProgress * -0.2, 0.04)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        smoothMouse.current.x * 0.03 + dragOffset.current * 0.016,
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

      {/* Blue organic 3D ribbon behind per spec */}
      <BlueOrganicRibbon scrollProgress={scrollProgress} />

      {/* Elastic showreel ribbon — rounded horizontal showcase frame */}
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
        <primitive object={material} attach="material" />
      </mesh>

      {/* Subtle shadow for depth */}
      <mesh position={[0, -0.12, -0.08]}>
        <planeGeometry args={[16.8, 7.2, 1, 1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.03} />
      </mesh>
    </group>
  )
}
