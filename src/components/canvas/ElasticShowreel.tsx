/**
 * LUSION HOMEPAGE — ElasticShowreel
 * Subdivided curved plane mesh, dynamic texture cycling, vertex warp shaders, looping blue spline
 * Full-width horizontal curved plane/mesh organic viewport, continuous showreel media textures
 * Elastic mesh warping Z/Y via GLSL sine-wave influenced by scroll velocity and cursor drag
 * Blue organic 3D ribbon — dynamic spline/tube curling behind and through showreel ribbon
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { elasticWarpVert, elasticWarpFrag } from '../../shaders/elasticWarp.vert'

interface ElasticShowreelProps {
  scrollProgress?: number
  onHoverChange?: (hovering: boolean) => void
}

function BlueRibbon({ scrollProgress = 0 }: { scrollProgress?: number }) {
  const tubeRef = useRef<THREE.Mesh>(null)
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null)

  // Dynamic spline/tube curling gracefully behind and through showreel ribbon per spec
  const { curve, tubeGeo } = useMemo(() => {
    const points: THREE.Vector3[] = []
    // Create organic curling spline behind ribbon
    for (let i = 0; i < 64; i++) {
      const t = i / 63
      const x = (t - 0.5) * 22
      const y = Math.sin(t * Math.PI * 2.5) * 1.2 + Math.cos(t * Math.PI * 1.1) * 0.6
      const z = Math.cos(t * Math.PI * 1.8) * 1.5 - 0.8 + Math.sin(t * Math.PI * 3.2) * 0.4
      points.push(new THREE.Vector3(x, y, z))
    }
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.5)
    const tubeGeo = new THREE.TubeGeometry(curve, 128, 0.08, 12, false)
    return { curve, tubeGeo }
  }, [])

  curveRef.current = curve

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (!tubeRef.current || !curveRef.current) return

    // Animate blue ribbon points — curling gracefully
    const points = curveRef.current.points
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      const baseX = (t - 0.5) * 22
      const baseY = Math.sin(t * Math.PI * 2.5 + time * 0.4) * 1.2 + Math.cos(t * Math.PI * 1.1 + time * 0.2) * 0.6
      const baseZ = Math.cos(t * Math.PI * 1.8 + time * 0.3) * 1.5 - 0.8 + Math.sin(t * Math.PI * 3.2 + time * 0.5) * 0.4

      // Scroll influence — ribbon reacts to scroll
      const scrollInfluence = scrollProgress * 0.8
      points[i].x = baseX + Math.sin(time * 0.2 + t * 2) * 0.15 * scrollInfluence
      points[i].y = baseY + Math.cos(time * 0.3 + t) * 0.2 * (1 + scrollInfluence)
      points[i].z = baseZ + Math.sin(time * 0.25 + t * 1.5) * 0.15
    }

    // Update tube geometry
    const newTube = new THREE.TubeGeometry(curveRef.current, 128, 0.08 + Math.sin(time * 0.8) * 0.02, 12, false)
    tubeRef.current.geometry.dispose()
    tubeRef.current.geometry = newTube

    // Rotation
    tubeRef.current.rotation.y = time * 0.05 + scrollProgress * 0.3
    tubeRef.current.position.y = Math.sin(time * 0.2) * 0.1 - scrollProgress * 0.3
  })

  useEffect(() => {
    return () => {
      tubeGeo.dispose()
    }
  }, [tubeGeo])

  return (
    <mesh ref={tubeRef} geometry={tubeGeo} position={[0, 0, -0.6]}>
      <meshStandardMaterial
        color="#3b82ff"
        emissive="#1e40ff"
        emissiveIntensity={0.35}
        roughness={0.25}
        metalness={0.15}
        transparent
        opacity={0.85}
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

  // Subdivided curved plane mesh per spec — PlaneGeometry(16, 6, 64, 32) but larger for showreel viewport
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(16, 6.5, 64, 32)
    return geo
  }, [])

  // Dynamic texture cycling — showreel media textures inside mesh per spec
  const canvasTexture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1280
    canvas.height = 720
    const ctx = canvas.getContext('2d')!

    ctx.fillStyle = '#f7f7f9'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    const draw = (time: number) => {
      // Off-white canvas #f7f7f9 per spec after preloader
      ctx.fillStyle = '#f7f7f9'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Dynamic showreel media cycling
      const cycle = Math.floor((time * 0.0003) % 4) // 4 textures cycle
      const t = time * 0.0004

      // Base gradient
      const grad = ctx.createLinearGradient(0, 0, canvas.width, 0)
      if (cycle === 0) {
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(0.5, '#f0f0f3')
        grad.addColorStop(1, '#ffffff')
      } else if (cycle === 1) {
        grad.addColorStop(0, '#f7f7f9')
        grad.addColorStop(0.5, '#e8e6f0')
        grad.addColorStop(1, '#f7f7f9')
      } else if (cycle === 2) {
        grad.addColorStop(0, '#f7f7f9')
        grad.addColorStop(0.5, '#d6eef5')
        grad.addColorStop(1, '#f7f7f9')
      } else {
        grad.addColorStop(0, '#f7f7f9')
        grad.addColorStop(0.5, '#f5e6d3')
        grad.addColorStop(1, '#f7f7f9')
      }
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Showreel content simulation
      ctx.fillStyle = '#0b0b0d'
      ctx.globalAlpha = 0.04 + Math.sin(time * 0.001) * 0.02
      for (let i = 0; i < 12; i++) {
        const x = (Math.sin(t * 0.5 + i) * 0.5 + 0.5) * canvas.width
        const y = (Math.cos(t * 0.3 + i * 1.2) * 0.5 + 0.5) * canvas.height
        const r = 30 + Math.sin(t + i) * 15
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1

      // Center text per cycle
      ctx.fillStyle = '#0b0b0d'
      ctx.font = 'bold 64px Geist, Inter, sans-serif'
      ctx.textAlign = 'center'
      const titles = ['SHOWREEL 2024', 'BOLD IDEAS', 'CRAFTED REALITY', 'LUSION LAB']
      ctx.fillText(titles[cycle], canvas.width / 2, canvas.height / 2)

      ctx.font = '14px Geist Mono, monospace'
      ctx.fillStyle = 'rgba(11,11,13,0.35)'
      ctx.fillText(`REEL 00${cycle + 1} — ${['MOTION', '3D', 'INTERACTIVE', 'EXPERIMENTAL'][cycle]}`, canvas.width / 2, canvas.height / 2 + 50)
    }

    draw(0)

    const texture = new THREE.CanvasTexture(canvas)
    texture.wrapS = THREE.ClampToEdgeWrapping
    texture.wrapT = THREE.ClampToEdgeWrapping
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.colorSpace = THREE.SRGBColorSpace

    ;(texture as any).canvas = canvas
    ;(texture as any).draw = draw

    return texture
  }, [])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: elasticWarpVert,
      fragmentShader: elasticWarpFrag,
      uniforms: {
        uTime: { value: 0 },
        uScrollVelocity: { value: 0 },
        uScrollProgress: { value: 0 },
        uMouseTarget: { value: new THREE.Vector2(0, 0) },
        uMouseDeform: { value: 0 },
        uMouseVelocity: { value: 0 },
        uDragOffset: { value: 0 },
        uFoldProgress: { value: 0 },
        uWaveIntensity: { value: 0.32 },
        uResolution: { value: new THREE.Vector2(1920, 1080) },
        uTexture: { value: canvasTexture },
        uTextureEnabled: { value: 1 },
      },
      side: THREE.DoubleSide,
    })
  }, [canvasTexture])

  // Drag handling — elastic rubber/cloth
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

  // Hover for cursor
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

  // Scroll velocity calculation
  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const delta = current - lastScroll.current
      scrollVelocity.current = THREE.MathUtils.lerp(scrollVelocity.current, Math.abs(delta) * 0.08, 0.15)
      lastScroll.current = current
    }
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => window.removeEventListener('lusion-scroll' as any, onScroll as any)
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Raycast for mouse target
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
    const deform = THREE.MathUtils.smoothstep(3.8, 0, dist) * mouseVelocity.current
    mouseDeform.current = THREE.MathUtils.lerp(mouseDeform.current, deform, 0.12)

    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    // Update uniforms per spec
    material.uniforms.uTime.value = time
    material.uniforms.uMouseTarget.value.copy(mouseTarget.current)
    material.uniforms.uMouseDeform.value = mouseDeform.current
    material.uniforms.uMouseVelocity.value = mouseVelocity.current
    material.uniforms.uScrollVelocity.value = scrollVelocity.current
    material.uniforms.uScrollProgress.value = scrollProgress
    material.uniforms.uDragOffset.value = dragOffset.current
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)

    const idleWave = 0.28 + Math.sin(time * 0.55) * 0.07
    material.uniforms.uWaveIntensity.value = THREE.MathUtils.lerp(
      material.uniforms.uWaveIntensity.value,
      idleWave + scrollProgress * 0.32 + mouseVelocity.current * 0.07,
      0.06
    )

    const foldProgress = THREE.MathUtils.smoothstep(scrollProgress, 0.12, 0.6)
    material.uniforms.uFoldProgress.value = THREE.MathUtils.lerp(material.uniforms.uFoldProgress.value, foldProgress, 0.05)

    // Animate canvas texture cycling
    if ((canvasTexture as any).draw) {
      ;(canvasTexture as any).draw(performance.now())
      canvasTexture.needsUpdate = true
    }

    // Decay scroll velocity
    scrollVelocity.current *= 0.92

    if (meshRef.current) {
      meshRef.current.position.y = THREE.MathUtils.lerp(meshRef.current.position.y, -foldProgress * 0.75 + Math.sin(time * 0.28) * 0.04, 0.04)
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, foldProgress * -0.22, 0.04)
      meshRef.current.rotation.y = THREE.MathUtils.lerp(
        meshRef.current.rotation.y,
        smoothMouse.current.x * 0.035 + dragOffset.current * 0.018,
        0.05
      )
    }
  })

  useEffect(() => {
    return () => {
      geometry.dispose()
      material.dispose()
      canvasTexture.dispose()
    }
  }, [geometry, material, canvasTexture])

  return (
    <group>
      <ambientLight intensity={0.9} color="#ffffff" />
      <directionalLight position={[5, 5, 5]} intensity={1.1} color="#ffffff" />
      <directionalLight position={[-3, 2, 3]} intensity={0.5} color="#f0f0f5" />
      <pointLight position={[0, 3, 4]} intensity={0.7} color="#ffffff" distance={14} />

      {/* Blue organic ribbon behind */}
      <BlueRibbon scrollProgress={scrollProgress} />

      {/* Elastic showreel ribbon per spec */}
      <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
        <primitive object={material} attach="material" />
      </mesh>

      {/* Shadow */}
      <mesh position={[0, -0.12, -0.06]}>
        <planeGeometry args={[16.8, 7, 1, 1]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.035} />
      </mesh>
    </group>
  )
}
