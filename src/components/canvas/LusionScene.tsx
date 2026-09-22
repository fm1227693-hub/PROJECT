/**
 * LUSION — LusionScene
 * Production-ready Canvas scene: docking elastic showreel + continuous 3D royal-blue spline tube + liquid glass refraction
 * Scroll-driven docking: centered 1.0 -> lower-left 0.55x, -5deg tilt, cloth/jelly inertia
 * Blue tube: CatmullRomCurve3 8 points, TubeGeometry, #2563eb/#1d4ed8, roughness 0.15, metalness 0.2, specular rim
 */

import { useRef, useMemo, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { liquidWarpVert, liquidWarpFrag } from '../../shaders/liquidWarp'

interface LusionSceneProps {
  scrollProgress?: number
  scrollVelocity?: number
  onHoverChange?: (hovering: boolean) => void
}

function BlueSplineTube({ scrollProgress = 0, scrollVelocity = 0 }: { scrollProgress?: number; scrollVelocity?: number }) {
  const tubeRef = useRef<THREE.Mesh>(null)
  const curveRef = useRef<THREE.CatmullRomCurve3 | null>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const smoothMouse = useRef({ x: 0, y: 0 })
  const velocityRef = useRef(0)
  const lastScroll = useRef(0)
  const targetPos = useRef({ x: 0, y: 0 })
  const currentPos = useRef({ x: 0, y: 0 })

  // 12 control points — butun sayt bo'ylab hamma yerda ko'rinadi, 48 height vertical span
  const { curve, tubeGeo } = useMemo(() => {
    const points: THREE.Vector3[] = []
    // Hero centered, dips behind showreel, loops over viewport edge, descends through whole site to footer
    const controls = [
      { x: -14, y: 18, z: -2.5 },
      { x: -9, y: 12, z: 1.8 },
      { x: -12, y: 6.5, z: -2.0 },
      { x: -6.5, y: 3.2, z: 1.5 },
      { x: -1.2, y: 1.0, z: -1.2 }, // behind showreel card
      { x: 3.5, y: -0.5, z: 2.2 }, // in front
      { x: 7.8, y: -1.8, z: -0.8 },
      { x: 10.5, y: -4.5, z: 1.0 }, // over viewport edge
      { x: 4.2, y: -10, z: -1.5 }, // descending toward project section
      { x: -3.5, y: -18, z: 0.5 },
      { x: -8, y: -26, z: -1.2 },
      { x: 2, y: -34, z: 1.0 }, // footer area
    ]
    controls.forEach((c) => points.push(new THREE.Vector3(c.x, c.y, c.z)))
    const curve = new THREE.CatmullRomCurve3(points, false, 'catmullrom', 0.6)
    const tubeGeo = new THREE.TubeGeometry(curve, 320, 0.34, 20, false)
    return { curve, tubeGeo }
  }, [])

  curveRef.current = curve

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / window.innerWidth) * 2 - 1
      const ny = -(e.clientY / window.innerHeight) * 2 + 1
      mouseRef.current.x = nx
      mouseRef.current.y = ny
    }
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const delta = current - lastScroll.current
      velocityRef.current = delta * 0.18
      lastScroll.current = current
      // Scroll down -> pastga, up -> tepaga, butun sayt bo'ylab
      targetPos.current.y = -scrollProgress * 18 + delta * 1.2
      targetPos.current.x = delta * 0.18
    }
    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('lusion-scroll' as any, onScroll as any)
    }
  }, [scrollProgress])

  useFrame((state) => {
    const time = state.clock.elapsedTime
    if (!tubeRef.current || !curveRef.current) return

    smoothMouse.current.x = THREE.MathUtils.lerp(smoothMouse.current.x, mouseRef.current.x, 0.06)
    smoothMouse.current.y = THREE.MathUtils.lerp(smoothMouse.current.y, mouseRef.current.y, 0.06)
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetPos.current.x, 0.07)
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetPos.current.y, 0.07)

    const points = curveRef.current.points
    for (let i = 0; i < points.length; i++) {
      const t = i / (points.length - 1)
      const orig = [
        { x: -14, y: 18, z: -2.5 },
        { x: -9, y: 12, z: 1.8 },
        { x: -12, y: 6.5, z: -2.0 },
        { x: -6.5, y: 3.2, z: 1.5 },
        { x: -1.2, y: 1.0, z: -1.2 },
        { x: 3.5, y: -0.5, z: 2.2 },
        { x: 7.8, y: -1.8, z: -0.8 },
        { x: 10.5, y: -4.5, z: 1.0 },
        { x: 4.2, y: -10, z: -1.5 },
        { x: -3.5, y: -18, z: 0.5 },
        { x: -8, y: -26, z: -1.2 },
        { x: 2, y: -34, z: 1.0 },
      ]
      const o = orig[i] || orig[0]

      // Cursor undulation — underwater cord
      const mouseInfluenceX = smoothMouse.current.x * Math.sin(t * Math.PI * 1.5 + time * 0.6) * 1.2
      const mouseInfluenceY = smoothMouse.current.y * Math.cos(t * Math.PI * 1.2 + time * 0.5) * 0.9
      const mouseInfluenceZ = (smoothMouse.current.x + smoothMouse.current.y) * 0.3 * Math.sin(t * Math.PI * 2 + time * 0.4)

      // Scroll velocity adds winding
      const velOffset = velocityRef.current * Math.sin(t * Math.PI) * 0.8

      points[i].x = o.x + mouseInfluenceX + velOffset * 0.3 + Math.sin(time * 0.35 + t * 2.2) * 0.18
      points[i].y = o.y + mouseInfluenceY + currentPos.current.y * (1 - t * 0.3) + velOffset + Math.cos(time * 0.28 + t * 1.8) * 0.22
      points[i].z = o.z + mouseInfluenceZ + Math.sin(time * 0.42 + t * 2.5) * 0.25 + velocityRef.current * 0.15 * Math.sin(t * Math.PI * 2)
    }

    const radius = 0.34 + Math.abs(velocityRef.current) * 0.08 + Math.abs(smoothMouse.current.x) * 0.05
    const newTube = new THREE.TubeGeometry(curveRef.current, 320, radius, 20, false)
    tubeRef.current.geometry.dispose()
    tubeRef.current.geometry = newTube

    tubeRef.current.position.y = currentPos.current.y * 0.3
    tubeRef.current.position.x = currentPos.current.x * 0.4
    tubeRef.current.rotation.y = scrollProgress * 0.22 + smoothMouse.current.x * 0.12 + time * 0.02
    tubeRef.current.rotation.x = smoothMouse.current.y * 0.06

    velocityRef.current *= 0.92
  })

  useEffect(() => {
    return () => {
      tubeGeo.dispose()
    }
  }, [tubeGeo])

  return (
    <mesh ref={tubeRef} geometry={tubeGeo} position={[0, 0, -1.2]}>
      <meshPhysicalMaterial
        color="#2563eb"
        emissive="#1d4ed8"
        emissiveIntensity={0.22}
        roughness={0.15}
        metalness={0.2}
        clearcoat={1}
        clearcoatRoughness={0.12}
        transmission={0.06}
        ior={1.45}
        sheen={0.5}
        sheenColor="#3b82f6"
        sheenRoughness={0.3}
      />
    </mesh>
  )
}

export default function LusionScene({ scrollProgress = 0, scrollVelocity = 0, onHoverChange }: LusionSceneProps) {
  const meshRef = useRef<THREE.Mesh>(null)
  const groupRef = useRef<THREE.Group>(null)
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
  const isHoveringRef = useRef(false)
  const hoverProgress = useRef(0)
  const dockProgress = useRef(0)
  const targetDock = useRef(0)
  const currentScale = useRef(1)
  const targetScale = useRef(1)
  const currentPos = useRef({ x: 0, y: 0, z: 0 })
  const targetPos = useRef({ x: 0, y: 0, z: 0 })
  const currentRot = useRef({ x: 0, y: 0, z: 0 })
  const targetRot = useRef({ x: 0, y: 0, z: 0 })
  const scrollVel = useRef(0)
  const lastScroll = useRef(0)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<number | null>(null)

  const geometry = useMemo(() => {
    return new THREE.PlaneGeometry(16, 7, 80, 40)
  }, [])

  const videoTexture = useMemo(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 1536
    canvas.height = 672
    const ctx = canvas.getContext('2d')!

    const draw = (time: number, hover = 0, dock = 0) => {
      ctx.fillStyle = '#f7f7f9'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const t = time * 0.00022
      const cycle = Math.floor((time * 0.0002 + hover * 0.7 + dock * 0.4) % 6)

      // Vibrant high-energy media per spec
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      if (cycle === 0) {
        grad.addColorStop(0, '#ffffff')
        grad.addColorStop(0.4, '#eef2ff')
        grad.addColorStop(1, '#dbeafe')
      } else if (cycle === 1) {
        grad.addColorStop(0, '#fff7ed')
        grad.addColorStop(0.5, '#fed7aa')
        grad.addColorStop(1, '#fdba74')
      } else if (cycle === 2) {
        grad.addColorStop(0, '#f0fdf4')
        grad.addColorStop(0.5, '#bbf7d0')
        grad.addColorStop(1, '#86efac')
      } else if (cycle === 3) {
        grad.addColorStop(0, '#fdf4ff')
        grad.addColorStop(0.5, '#f5d0fe')
        grad.addColorStop(1, '#f0abfc')
      } else if (cycle === 4) {
        grad.addColorStop(0, '#fef2f2')
        grad.addColorStop(0.5, '#fecaca')
        grad.addColorStop(1, '#fca5a5')
      } else {
        grad.addColorStop(0, '#f7f7f9')
        grad.addColorStop(0.5, '#e0e7ff')
        grad.addColorStop(1, '#c7d2fe')
      }
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Colorful 3D rollercoasters, blooming floral, cybernetic visuals simulation
      const boost = 1 + hover * 1.6 + dock * 0.3
      ctx.globalAlpha = 0.08 + hover * 0.14 + dock * 0.04
      for (let i = 0; i < 12; i++) {
        const x = (Math.sin(t * (0.55 + i * 0.04) + i) * 0.5 + 0.5) * canvas.width
        const y = (Math.cos(t * (0.38 + i * 0.03) + i * 1.13) * 0.5 + 0.5) * canvas.height
        const r = (45 + Math.sin(t * 0.8 + i * 0.7) * 28) * boost
        if (i % 3 === 0) ctx.fillStyle = '#2563eb'
        else if (i % 3 === 1) ctx.fillStyle = '#0b0b0d'
        else ctx.fillStyle = '#f59e0b'
        ctx.beginPath()
        ctx.arc(x, y, r, 0, Math.PI * 2)
        ctx.fill()

        // Floral bloom petals
        if (i % 4 === 0) {
          ctx.fillStyle = `hsla(${280 + i * 12}, 85%, 65%, 0.12)`
          for (let p = 0; p < 5; p++) {
            const ang = (p / 5) * Math.PI * 2 + t + i
            const px = x + Math.cos(ang) * r * 0.7
            const py = y + Math.sin(ang) * r * 0.7
            ctx.beginPath()
            ctx.ellipse(px, py, r * 0.4, r * 0.15, ang, 0, Math.PI * 2)
            ctx.fill()
          }
        }
      }
      ctx.globalAlpha = 1

      // Cybernetic grid lines
      ctx.strokeStyle = `rgba(37,99,235,${0.04 + hover * 0.06})`
      ctx.lineWidth = 1
      for (let x = 0; x < canvas.width; x += 80) {
        ctx.beginPath()
        ctx.moveTo(x + Math.sin(t + x * 0.01) * 20, 0)
        ctx.lineTo(x + Math.cos(t + x * 0.01) * 20, canvas.height)
        ctx.stroke()
      }

      // Liquid glass overlay hint
      if (hover > 0.01 || dock > 0.01) {
        const lg = ctx.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width * 0.8)
        lg.addColorStop(0, `rgba(37,99,235,${0.07 * (hover + dock * 0.5)})`)
        lg.addColorStop(0.5, `rgba(255,255,255,${0.04 * hover})`)
        lg.addColorStop(1, 'rgba(37,99,235,0)')
        ctx.fillStyle = lg
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.fillStyle = 'rgba(0,0,0,0.02)'
      for (let y = 0; y < canvas.height; y += 3) {
        ctx.fillRect(0, y, canvas.width, 1)
      }
    }

    draw(0, 0, 0)
    const tex = new THREE.CanvasTexture(canvas)
    tex.wrapS = THREE.ClampToEdgeWrapping
    tex.wrapT = THREE.ClampToEdgeWrapping
    tex.minFilter = THREE.LinearFilter
    tex.magFilter = THREE.LinearFilter
    tex.colorSpace = THREE.SRGBColorSpace
    ;(tex as any).canvas = canvas
    ;(tex as any).draw = draw
    return tex
  }, [])

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      vertexShader: liquidWarpVert,
      fragmentShader: liquidWarpFrag,
      uniforms: {
        uTime: { value: 0 },
        uScrollVelocity: { value: 0 },
        uScrollProgress: { value: 0 },
        uDockProgress: { value: 0 },
        uMouseTarget: { value: new THREE.Vector2(0, 0) },
        uMouseDeform: { value: 0 },
        uMouseVelocity: { value: 0 },
        uDragOffset: { value: 0 },
        uFoldProgress: { value: 0 },
        uWaveIntensity: { value: 0.26 },
        uHoverProgress: { value: 0 },
        uResolution: { value: new THREE.Vector2(1920, 1080) },
        uTexture: { value: videoTexture },
        uTextureEnabled: { value: videoTexture ? 1 : 0 },
        uRoundedRadius: { value: 0.18 },
      },
      transparent: true,
      side: THREE.DoubleSide,
    })
  }, [videoTexture])

  // Drag
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
        const damping = Math.exp(-elapsed * 10)
        dragOffset.current = startOffset * damping * Math.cos(elapsed * 16)
        if (Math.abs(dragOffset.current) > 0.001) requestAnimationFrame(animateBack)
        else dragOffset.current = 0
      }
      animateBack()
    }
    const onMove = (e: MouseEvent) => {
      if (isDragging.current) {
        const delta = (e.clientX - dragStart.current) * 0.018
        dragOffset.current = THREE.MathUtils.lerp(dragOffset.current, delta, 0.14)
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

  // Hover detection
  useEffect(() => {
    const onPointerMove = () => {
      raycaster.current.setFromCamera(pointer, camera)
      if (!meshRef.current) return
      const intersects = raycaster.current.intersectObject(meshRef.current)
      const hovering = intersects.length > 0
      if (hovering !== isHoveringRef.current) {
        isHoveringRef.current = hovering
        onHoverChange?.(hovering)
        document.body.style.cursor = hovering ? 'pointer' : ''
      }
    }
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    return () => window.removeEventListener('mousemove', onPointerMove)
  }, [camera, pointer, onHoverChange])

  // Scroll
  useEffect(() => {
    const onScroll = (e: CustomEvent) => {
      const current = e.detail.scroll || 0
      const vel = e.detail.velocity || 0
      const delta = current - lastScroll.current
      scrollVel.current = THREE.MathUtils.lerp(scrollVel.current, Math.abs(delta) * 0.14 + Math.abs(vel) * 0.04, 0.22)
      lastScroll.current = current
      isScrollingRef.current = true
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current)
      scrollTimeoutRef.current = window.setTimeout(() => {
        isScrollingRef.current = false
        scrollVel.current = THREE.MathUtils.lerp(scrollVel.current, 0, 0.25)
      }, 140) as any
    }
    window.addEventListener('lusion-scroll' as any, onScroll as any)
    return () => {
      window.removeEventListener('lusion-scroll' as any, onScroll as any)
      if (scrollTimeoutRef.current) window.clearTimeout(scrollTimeoutRef.current)
    }
  }, [])

  useFrame((state, delta) => {
    const time = state.clock.elapsedTime

    // Mouse tracking
    raycaster.current.setFromCamera(pointer, camera)
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0)
    const intersectPoint = new THREE.Vector3()
    const hit = raycaster.current.ray.intersectPlane(plane, intersectPoint)
    if (hit) {
      const target = new THREE.Vector2(intersectPoint.x, intersectPoint.y)
      smoothMouse.current.lerp(target, 0.15)
      mouseTarget.current.copy(smoothMouse.current)
    }

    const dx = pointer.x - lastPointer.current.x
    const dy = pointer.y - lastPointer.current.y
    const rawVel = Math.sqrt(dx * dx + dy * dy) / Math.max(delta, 0.001)
    mouseVelocity.current = THREE.MathUtils.lerp(mouseVelocity.current, rawVel * 0.2, 0.16)
    mouseVelocity.current = Math.min(mouseVelocity.current, 5)

    const dist = mouseTarget.current.length()
    const deform = THREE.MathUtils.smoothstep(3.6, 0, dist) * mouseVelocity.current
    mouseDeform.current = THREE.MathUtils.lerp(mouseDeform.current, deform, 0.13)

    lastPointer.current.x = pointer.x
    lastPointer.current.y = pointer.y

    // Docking progress: 0 = hero centered, 1 = lower-left docked
    // As scroll into Brought to Life section (0.12 -> 0.65)
    const dockTarget = THREE.MathUtils.clamp(THREE.MathUtils.smoothstep(scrollProgress, 0.12, 0.62), 0, 1)
    targetDock.current = dockTarget
    dockProgress.current = THREE.MathUtils.lerp(dockProgress.current, targetDock.current, 0.06)

    // Scale: 1.0 -> 0.55x
    targetScale.current = THREE.MathUtils.lerp(1.0, 0.55, dockProgress.current)
    currentScale.current = THREE.MathUtils.lerp(currentScale.current, targetScale.current, 0.07)

    // Position: centered (0,0,0) -> lower-left (-5.8, -2.4, 0.8)
    targetPos.current.x = THREE.MathUtils.lerp(0, -5.8, dockProgress.current)
    targetPos.current.y = THREE.MathUtils.lerp(0, -2.4, dockProgress.current)
    targetPos.current.z = THREE.MathUtils.lerp(0, 0.8, dockProgress.current)
    currentPos.current.x = THREE.MathUtils.lerp(currentPos.current.x, targetPos.current.x, 0.06)
    currentPos.current.y = THREE.MathUtils.lerp(currentPos.current.y, targetPos.current.y, 0.06)
    currentPos.current.z = THREE.MathUtils.lerp(currentPos.current.z, targetPos.current.z, 0.06)

    // Rotation: 0 -> -5 deg tilt with inertia
    targetRot.current.z = THREE.MathUtils.lerp(0, -5 * (Math.PI / 180), dockProgress.current)
    targetRot.current.x = THREE.MathUtils.lerp(0, -2 * (Math.PI / 180), dockProgress.current)
    targetRot.current.y = THREE.MathUtils.lerp(0, 3 * (Math.PI / 180), dockProgress.current)
    currentRot.current.x = THREE.MathUtils.lerp(currentRot.current.x, targetRot.current.x, 0.05)
    currentRot.current.y = THREE.MathUtils.lerp(currentRot.current.y, targetRot.current.y + smoothMouse.current.x * 0.03 * (1 - dockProgress.current * 0.5), 0.05)
    currentRot.current.z = THREE.MathUtils.lerp(currentRot.current.z, targetRot.current.z, 0.05)

    // Hover
    const targetHover = isHoveringRef.current ? 1 : 0
    hoverProgress.current = THREE.MathUtils.lerp(hoverProgress.current, targetHover, 0.09)

    // Material uniforms — bind Lenis velocity directly
    material.uniforms.uTime.value = time
    material.uniforms.uMouseTarget.value.copy(mouseTarget.current)
    material.uniforms.uMouseDeform.value = mouseDeform.current
    material.uniforms.uMouseVelocity.value = mouseVelocity.current + hoverProgress.current * 0.9
    material.uniforms.uScrollVelocity.value = scrollVel.current + scrollVelocity * 0.5
    material.uniforms.uScrollProgress.value = scrollProgress
    material.uniforms.uDockProgress.value = dockProgress.current
    material.uniforms.uDragOffset.value = dragOffset.current
    material.uniforms.uHoverProgress.value = hoverProgress.current
    material.uniforms.uResolution.value.set(window.innerWidth, window.innerHeight)

    const baseWave = 0.22
    const scrollWave = isScrollingRef.current ? scrollVel.current * 0.75 : 0
    const hoverWave = hoverProgress.current * 0.6
    const dockWave = dockProgress.current * 0.18
    const targetWave = baseWave + scrollWave + hoverWave + dockWave + mouseVelocity.current * 0.06 + Math.abs(dragOffset.current) * 0.025
    material.uniforms.uWaveIntensity.value = THREE.MathUtils.lerp(material.uniforms.uWaveIntensity.value, targetWave, 0.08)

    const foldProgress = THREE.MathUtils.smoothstep(scrollProgress, 0.1, 0.55) * (1 - dockProgress.current * 0.3)
    material.uniforms.uFoldProgress.value = THREE.MathUtils.lerp(material.uniforms.uFoldProgress.value, foldProgress, 0.06)

    if (videoTexture && (videoTexture as any).draw) {
      if (isScrollingRef.current || mouseVelocity.current > 0.01 || hoverProgress.current > 0.01 || dockProgress.current > 0.01) {
        ;(videoTexture as any).draw(performance.now(), hoverProgress.current, dockProgress.current)
        videoTexture.needsUpdate = true
      }
    }

    if (!isScrollingRef.current) {
      scrollVel.current *= 0.91
      if (Math.abs(scrollVel.current) < 0.001) scrollVel.current = 0
    }

    if (groupRef.current) {
      groupRef.current.position.x = currentPos.current.x
      groupRef.current.position.y = currentPos.current.y
      groupRef.current.position.z = currentPos.current.z
      groupRef.current.rotation.x = currentRot.current.x
      groupRef.current.rotation.y = currentRot.current.y
      groupRef.current.rotation.z = currentRot.current.z
      groupRef.current.scale.setScalar(currentScale.current)

      // Inertia-based cloth/jelly: corners bend backward with trailing spring on high velocity
      const vel = scrollVel.current
      const bendX = vel * 0.12 * Math.sin(time * 1.2)
      const bendY = vel * 0.08
      if (meshRef.current) {
        meshRef.current.position.z = THREE.MathUtils.lerp(meshRef.current.position.z, -bendY, 0.08)
        meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, bendX * 0.1, 0.08)
      }
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
      <ambientLight intensity={1.0} color="#ffffff" />
      <directionalLight position={[6, 8, 7]} intensity={1.2} color="#ffffff" />
      <directionalLight position={[-4, -1, 4]} intensity={0.55} color="#dbeafe" />
      <pointLight position={[0, 4, 5]} intensity={0.7 + hoverProgress.current * 0.4} color="#ffffff" distance={16} />
      <pointLight position={[-5, -2, 3]} intensity={0.35} color="#2563eb" distance={12} />

      {/* Continuous 3D blue spline tube winding through space */}
      <BlueSplineTube scrollProgress={scrollProgress} scrollVelocity={scrollVelocity || scrollVel.current} />

      {/* Docking elastic showreel group */}
      <group ref={groupRef}>
        <mesh ref={meshRef} geometry={geometry} position={[0, 0, 0]}>
          <primitive object={material} attach="material" />
        </mesh>

        {/* Liquid glass refraction highlight */}
        <mesh position={[0, -0.08, -0.04]} scale={[1.02, 1.02, 1]}>
          <planeGeometry args={[16.4, 7.0, 1, 1]} />
          <meshPhysicalMaterial
            color="#ffffff"
            transparent
            opacity={0.04 + hoverProgress.current * 0.06}
            roughness={0.05}
            metalness={0.1}
            transmission={0.9}
            thickness={0.2}
            ior={1.4}
            clearcoat={1}
            clearcoatRoughness={0.08}
          />
        </mesh>

        {/* Soft shadow */}
        <mesh position={[0, -0.18, -0.12]}>
          <planeGeometry args={[17.2, 7.6, 1, 1]} />
          <meshBasicMaterial color="#000000" transparent opacity={0.03 + dockProgress.current * 0.02} />
        </mesh>
      </group>
    </group>
  )
}
