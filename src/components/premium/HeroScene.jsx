import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js'
import { deviceTier, prefersReducedMotion } from './studioEnv'

/* ---------------------------------------------------------------------------
   GLSL — simplex noise + fbm, injected into a PBR material so the sculpture
   keeps physically based shading while the surface morphs.
   ------------------------------------------------------------------------ */
const NOISE_GLSL = `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}

float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + C.yyy;
  vec3 x3 = x0 - D.yyy;
  i = mod289(i);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3 ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ * ns.x + ns.yyyy;
  vec4 y = y_ * ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0) * 2.0 + 1.0;
  vec4 s1 = floor(b1) * 2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

float fbm(vec3 p){
  float v = 0.0;
  float a = 0.5;
  for(int i = 0; i < 4; i++){
    v += a * snoise(p);
    p *= 2.03;
    a *= 0.5;
  }
  return v;
}
`

function makeDustTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  const tex = new THREE.CanvasTexture(c)
  tex.colorSpace = THREE.SRGBColorSpace
  return tex
}

/**
 * HeroScene — a liquid-chrome sculpture lit by a real image-based environment.
 * Movement is physically driven (pointer inertia, pointer velocity, scroll
 * kinematics) rather than an endless demo spin.
 */
export default function HeroScene({ className = '' }) {
  const mountRef = useRef(null)

  useEffect(() => {
    const mount = mountRef.current
    if (!mount) return

    const tier = deviceTier()
    const reduced = prefersReducedMotion()

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({
        antialias: tier >= 3,
        alpha: false,
        powerPreference: 'high-performance',
      })
    } catch {
      mount.style.display = 'none'
      return undefined
    }

    const dprCap = tier >= 3 ? 1.75 : tier === 2 ? 1.4 : 1.25
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, dprCap))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120)
    camera.position.set(0, 0, 7.6)

    /* --- image based lighting --- */
    const pmrem = new THREE.PMREMGenerator(renderer)
    const roomEnv = new RoomEnvironment()
    const envRT = pmrem.fromScene(roomEnv, 0.035)
    scene.environment = envRT.texture
    roomEnv.dispose?.()
    pmrem.dispose()

    /* --- theme aware palette --- */
    const readToken = (name, fallback) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback
    const isDark = () => document.documentElement.classList.contains('dark')

    const bgColor = new THREE.Color(readToken('--bg', '#08090B'))
    const accentColor = new THREE.Color(readToken('--accent', '#FF5A38'))
    const dustColor = new THREE.Color(readToken('--text-3', '#6C6F75'))
    renderer.setClearColor(bgColor, 1)

    /* --- sculpture group --- */
    const group = new THREE.Group()
    scene.add(group)

    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.25 },
      uFreq: { value: 0.92 },
      uPointer: { value: new THREE.Vector2(0, 0) },
    }

    const chrome = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.15,
      envMapIntensity: 1.55,
      clearcoat: 0.5,
      clearcoatRoughness: 0.22,
      flatShading: true,
    })
    chrome.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = uniforms.uTime
      shader.uniforms.uAmp = uniforms.uAmp
      shader.uniforms.uFreq = uniforms.uFreq
      shader.uniforms.uPointer = uniforms.uPointer
      shader.vertexShader = shader.vertexShader
        .replace(
          '#include <common>',
          `#include <common>
           uniform float uTime;
           uniform float uAmp;
           uniform float uFreq;
           uniform vec2 uPointer;
           ${NOISE_GLSL}`
        )
        .replace(
          '#include <begin_vertex>',
          `#include <begin_vertex>
           float n1 = fbm(position * uFreq + vec3(uTime * 0.10, uTime * 0.07, uTime * 0.05));
           float n2 = snoise(position * (uFreq * 2.15) + vec3(0.0, 0.0, uTime * 0.16));
           float lobe = sin(position.y * 1.7 + uTime * 0.24) * 0.30;
           float lean = (position.y * uPointer.y + position.x * uPointer.x) * 0.05;
           transformed += normal * ((n1 + n2 * 0.34 + lobe + lean) * uAmp);`
        )
    }
    chrome.customProgramCacheKey = () => 'optimum-hero-chrome-v1'

    const detail = tier >= 3 ? 40 : tier === 2 ? 26 : 14
    const sculpture = new THREE.Mesh(new THREE.IcosahedronGeometry(1.42, detail), chrome)
    sculpture.scale.set(1, 1.1, 0.94)
    group.add(sculpture)

    /* --- precision instrument ring --- */
    const ringMat = new THREE.MeshPhysicalMaterial({
      color: 0xffffff,
      metalness: 1,
      roughness: 0.22,
      envMapIntensity: 1.4,
    })
    const ring = new THREE.Mesh(new THREE.TorusGeometry(2.2, 0.017, 6, 256), ringMat)
    ring.rotation.set(Math.PI * 0.44, 0.2, 0.12)
    group.add(ring)

    /* --- dust field for spatial depth --- */
    const dustCount = tier >= 3 ? 720 : tier === 2 ? 420 : 220
    const dustGeo = new THREE.BufferGeometry()
    const dpos = new Float32Array(dustCount * 3)
    for (let i = 0; i < dustCount; i++) {
      const r = 3.2 + Math.random() * 7
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      dpos[i * 3] = r * Math.sin(ph) * Math.cos(th)
      dpos[i * 3 + 1] = r * Math.cos(ph) * 0.7
      dpos[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
    }
    dustGeo.setAttribute('position', new THREE.BufferAttribute(dpos, 3))
    const dustMat = new THREE.PointsMaterial({
      size: 0.05,
      map: makeDustTexture(),
      color: dustColor,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      sizeAttenuation: true,
    })
    const dust = new THREE.Points(dustGeo, dustMat)
    scene.add(dust)

    /* --- lighting: one key, one accent rim, soft fill --- */
    const key = new THREE.DirectionalLight(0xffffff, 2.4)
    key.position.set(3.2, 4.2, 4.6)
    scene.add(key)
    const rim = new THREE.PointLight(accentColor.getHex(), 14, 16, 2)
    rim.position.set(-3.4, -1.6, 2.2)
    scene.add(rim)
    scene.add(new THREE.AmbientLight(0xffffff, 0.22))

    /* --- subtle bloom, desktop only (official three post pattern) --- */
    let composer = null
    if (tier >= 3 && !reduced) {
      try {
        composer = new EffectComposer(renderer)
        composer.addPass(new RenderPass(scene, camera))
        composer.addPass(new UnrealBloomPass(new THREE.Vector2(1, 1), 0.4, 0.72, 0.84))
        composer.addPass(new OutputPass())
      } catch {
        composer = null
      }
    }

    /* --- responsive framing --- */
    const isNarrow = () => window.innerWidth < 1024
    const applyLayout = () => {
      const w = mount.clientWidth || 1
      const h = mount.clientHeight || 1
      const aspect = w / h
      const narrow = isNarrow()
      camera.aspect = aspect
      camera.position.z = narrow
        ? 8.6 + Math.max(0, 1 / aspect - 1) * 3.2
        : 7.6 + Math.max(0, 1 / aspect - 1) * 4.0
      camera.updateProjectionMatrix()
      group.position.x = narrow ? 0 : 1.62
      group.position.y = narrow ? -0.15 : 0.5
      group.scale.setScalar(narrow ? 0.62 : 1)
      renderer.setSize(w, h, false)
      composer?.setSize(w, h)
    }
    applyLayout()

    /* --- interaction state --- */
    const pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 }
    const rot = { x: 0, y: 0 }
    let velocity = 0
    let ampBoost = 0
    let lastScroll = window.scrollY

    const onPointerMove = (e) => {
      pointer.tx = e.clientX / window.innerWidth
      pointer.ty = e.clientY / window.innerHeight
    }
    const onTouchMove = (e) => {
      if (!e.touches?.[0]) return
      pointer.tx = e.touches[0].clientX / window.innerWidth
      pointer.ty = e.touches[0].clientY / window.innerHeight
    }
    const onScroll = () => {
      const y = window.scrollY
      velocity = Math.min(1, Math.abs(y - lastScroll) / 42)
      lastScroll = y
    }
    window.addEventListener('mousemove', onPointerMove, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })

    /* --- theme reactions --- */
    const applyTheme = () => {
      bgColor.set(readToken('--bg', '#08090B'))
      accentColor.set(readToken('--accent', '#FF5A38'))
      dustColor.set(readToken('--text-3', '#6C6F75'))
      renderer.setClearColor(bgColor, 1)
      dustMat.color.copy(dustColor)
      dustMat.blending = isDark() ? THREE.AdditiveBlending : THREE.NormalBlending
      dustMat.opacity = isDark() ? 0.55 : 0.38
      dustMat.needsUpdate = true
      rim.color.copy(accentColor)
      key.intensity = isDark() ? 2.4 : 1.7
    }
    applyTheme()

    const themeObserver = new MutationObserver(applyTheme)
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })

    /* --- render loop, gated by visibility --- */
    const clock = new THREE.Clock()
    let frame = 0
    let onScreen = true
    let running = true

    const renderFrame = () => {
      const dt = Math.min(clock.getDelta(), 0.05)
      const time = clock.getElapsedTime()
      uniforms.uTime.value = time

      pointer.x += (pointer.tx - pointer.x) * 0.055
      pointer.y += (pointer.ty - pointer.y) * 0.055
      uniforms.uPointer.value.set(pointer.x - 0.5, 0.5 - pointer.y)

      rot.x += ((0.5 - pointer.y) * 0.42 - rot.x) * 0.045
      rot.y += ((pointer.x - 0.5) * 0.55 - rot.y) * 0.045

      const scrollN = Math.min(1.6, window.scrollY / Math.max(1, window.innerHeight))
      ampBoost += (velocity * 0.34 - ampBoost) * 0.06
      velocity *= 0.9

      group.rotation.x = rot.x - scrollN * 0.34
      group.rotation.y = rot.y + scrollN * 0.42
      group.rotation.z = Math.sin(time * 0.16) * 0.06 + scrollN * 0.1
      group.position.y =
        (isNarrow() ? -0.15 : 0.5) + Math.sin(time * 0.42) * 0.09 - scrollN * 0.85
      group.position.x = (isNarrow() ? 0 : 1.62) - scrollN * 0.5

      ring.rotation.z += dt * 0.055
      ring.rotation.x = Math.PI * 0.44 + Math.sin(time * 0.24) * 0.07

      dust.rotation.y = time * 0.016
      dust.rotation.x = Math.sin(time * 0.1) * 0.05
      dust.position.y = -scrollN * 0.6

      uniforms.uAmp.value = 0.24 + ampBoost + Math.sin(time * 0.3) * 0.03

      camera.position.x = (pointer.x - 0.5) * 0.5
      camera.position.y = (0.5 - pointer.y) * -0.35
      camera.lookAt(group.position.x * 0.35, group.position.y * 0.2, 0)

      if (composer) composer.render()
      else renderer.render(scene, camera)
    }

    const loop = () => {
      if (!running) return
      frame = requestAnimationFrame(loop)
      if (!onScreen) return
      renderFrame()
    }

    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0].isIntersecting
        if (onScreen && !running) {
          running = true
          clock.getDelta()
          loop()
        }
      },
      { threshold: 0.01 }
    )
    io.observe(mount)

    const onVisibility = () => {
      if (document.hidden) {
        running = false
        cancelAnimationFrame(frame)
      } else if (onScreen) {
        running = true
        clock.getDelta()
        loop()
      }
    }
    document.addEventListener('visibilitychange', onVisibility)

    const onResize = () => applyLayout()
    window.addEventListener('resize', onResize)

    if (reduced) {
      running = false
      renderFrame()
    } else {
      loop()
    }

    return () => {
      running = false
      cancelAnimationFrame(frame)
      io.disconnect()
      themeObserver.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('mousemove', onPointerMove)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('scroll', onScroll)
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]
          mats.forEach((m) => {
            if (m.map) m.map.dispose()
            m.dispose()
          })
        }
      })
      envRT.dispose()
      composer?.dispose?.()
      renderer.dispose()
      if (renderer.domElement.parentNode === mount) mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className={`st-hero-canvas ${className}`} aria-hidden="true" />
}
