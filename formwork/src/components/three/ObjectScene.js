import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

/**
 * One chrome object, one canvas, no post-processing.
 *
 * - Desktop: renders continuously only while on screen (slow idle rotation + pointer lean).
 * - Touch / reduced motion: render-on-demand — a frame is drawn only when scroll
 *   progress or size changes, so the GPU sits idle between updates.
 */
export class ObjectScene {
  constructor(canvas, { dpr = 1, loop = true } = {}) {
    this.canvas = canvas
    this.loop = loop
    this.visible = false
    this.active = true
    this.raf = 0
    this.needsRender = true
    this.scroll = 0
    this.px = 0
    this.py = 0
    this.lean = { x: 0, y: 0 }
    this.start = performance.now()

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
      premultipliedAlpha: true,
    })
    renderer.setPixelRatio(dpr)
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.0
    renderer.outputColorSpace = THREE.SRGBColorSpace
    this.renderer = renderer

    this.scene = new THREE.Scene()
    this.camera = new THREE.PerspectiveCamera(28, 1, 0.1, 30)
    this.camera.position.set(0, 0, 7.4)

    // Neutral studio reflections; the material does the rest.
    const pmrem = new THREE.PMREMGenerator(renderer)
    this.env = pmrem.fromScene(new RoomEnvironment(), 0.04).texture
    pmrem.dispose()
    this.scene.environment = this.env

    // A wavy ring (p=1, q=3): reads as a single sculptural object, not a demo shape.
    this.geometry = new THREE.TorusKnotGeometry(1.15, 0.36, 220, 40, 1, 3)
    this.material = new THREE.MeshStandardMaterial({
      color: 0xf2f3fa,
      metalness: 1,
      roughness: 0.14,
      envMapIntensity: 1.15,
    })
    this.mesh = new THREE.Mesh(this.geometry, this.material)
    this.mesh.rotation.set(0.9, -0.3, 0.2)
    this.scene.add(this.mesh)

    // One cobalt accent light so the chrome picks up the brand colour in its highlights.
    this.light = new THREE.PointLight(0x1d2cf3, 26, 20, 1.6)
    this.light.position.set(-3.2, -2.4, 3)
    this.scene.add(this.light)
    this.key = new THREE.DirectionalLight(0xffffff, 1.2)
    this.key.position.set(3, 4, 5)
    this.scene.add(this.key)

    this.resize()
    this._tick = this._tick.bind(this)
    this._onVisibility = () => this._sync()
    document.addEventListener('visibilitychange', this._onVisibility)
  }

  resize() {
    const w = this.canvas.clientWidth || 1
    const h = this.canvas.clientHeight || 1
    this.renderer.setSize(w, h, false)
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    this.needsRender = true
    this._sync()
  }

  setProgress(p) {
    this.scroll = p
    this.needsRender = true
    this._sync()
  }

  setPointer(nx, ny) {
    this.px = nx
    this.py = ny
    this.needsRender = true
    this._sync()
  }

  setVisible(v) {
    this.visible = v
    this._sync()
  }

  /** Parent can park the loop while the object is faded out (e.g. late in the hero pin). */
  setActive(v) {
    if (this.active === v) return
    this.active = v
    this.needsRender = true
    this._sync()
  }

  _sync() {
    const shouldRun = this.visible && this.active && !document.hidden && (this.loop || this.needsRender)
    if (shouldRun && !this.raf) this.raf = requestAnimationFrame(this._tick)
  }

  _tick() {
    this.raf = 0
    const t = (performance.now() - this.start) / 1000
    // pointer lean eases in; scroll progress adds a slow tumble
    this.lean.x += (this.py * 0.28 - this.lean.x) * 0.06
    this.lean.y += (this.px * 0.38 - this.lean.y) * 0.06
    const m = this.mesh
    m.rotation.x = 0.9 + this.scroll * 1.4 + this.lean.x + Math.sin(t * 0.35) * 0.05
    m.rotation.y = -0.3 + t * 0.16 + this.scroll * 1.1 + this.lean.y
    m.rotation.z = 0.2 + Math.cos(t * 0.27) * 0.04
    m.position.y = Math.sin(t * 0.6) * 0.06

    this.renderer.render(this.scene, this.camera)
    this.needsRender = false

    if (this.visible && this.active && !document.hidden && this.loop) this.raf = requestAnimationFrame(this._tick)
  }

  dispose() {
    if (this.raf) cancelAnimationFrame(this.raf)
    document.removeEventListener('visibilitychange', this._onVisibility)
    this.geometry.dispose()
    this.material.dispose()
    this.env.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
  }
}
