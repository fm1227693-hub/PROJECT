import {
  Clock,
  Color,
  Mesh,
  PerspectiveCamera,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  Vector3,
  WebGLRenderer,
} from 'three'

// Ashima / Stefan Gustavson 3D simplex noise (public domain)
const NOISE = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

const VERTEX = /* glsl */ `
uniform float uTime;
uniform float uAmp;
uniform float uFreq;
varying vec3 vNormal;
varying vec3 vViewPos;
${NOISE}
vec3 displace(vec3 p) {
  vec3 dir = normalize(p);
  float n1 = snoise(p * uFreq + vec3(0.0, uTime * 0.22, uTime * 0.16));
  float n2 = snoise(p * uFreq * 2.4 - vec3(uTime * 0.1, 0.0, uTime * 0.07));
  return p + dir * (n1 * uAmp + n2 * uAmp * 0.12);
}
void main() {
  vec3 p = displace(position);
  vec3 helper = abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
  vec3 t = normalize(cross(normal, helper));
  vec3 b = normalize(cross(normal, t));
  float eps = 0.018;
  vec3 pt = displace(position + t * eps);
  vec3 pb = displace(position + b * eps);
  vec3 n = normalize(cross(pt - p, pb - p));
  if (dot(n, normal) < 0.0) n = -n;
  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  vNormal = normalize(normalMatrix * n);
  vViewPos = mv.xyz;
  gl_Position = projectionMatrix * mv;
}
`

const FRAGMENT = /* glsl */ `
precision highp float;
uniform vec3 uColorA;
uniform vec3 uColorB;
uniform vec3 uColorC;
uniform vec3 uLight;
varying vec3 vNormal;
varying vec3 vViewPos;
void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vViewPos);
  vec3 L = normalize(uLight);
  float ndl = dot(N, L);
  float wrap = 0.55;
  float diff = clamp((ndl + wrap) / (1.0 + wrap), 0.0, 1.0);
  diff = smoothstep(0.0, 1.0, diff);
  vec3 col = mix(uColorB, uColorA, diff);
  vec3 H = normalize(L + V);
  float spec = pow(max(dot(N, H), 0.0), 22.0) * 0.1;
  col += spec;
  float fres = pow(1.0 - max(dot(N, V), 0.0), 3.2);
  col = mix(col, uColorC, fres * 0.2);
  float bounce = clamp(-N.y, 0.0, 1.0);
  col += bounce * vec3(0.32, 0.2, 0.14) * 0.35;
  float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453) / 255.0;
  gl_FragColor = vec4(col + dither, 1.0);
}
`

/**
 * A single soft, matte "pebble" whose surface breathes slowly.
 * Rendering only runs while the canvas is on screen.
 */
export default class BlobScene {
  constructor(container, { quality = 'high', reduced = false, onReady } = {}) {
    this.container = container
    this.reduced = reduced
    this.running = false
    this.visible = false
    this.pointer = { x: 0, y: 0 }
    this.targetRot = { x: 0, y: 0 }
    this.clock = new Clock()

    const high = quality === 'high'
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'low-power',
    })
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, high ? 1.6 : 1.25))
    this.renderer.setClearColor(0x000000, 0)
    this.renderer.domElement.setAttribute('aria-hidden', 'true')
    container.appendChild(this.renderer.domElement)

    this.scene = new Scene()
    this.camera = new PerspectiveCamera(28, 1, 0.1, 20)
    this.camera.position.set(0, 0, 5.4)

    const geometry = new SphereGeometry(1, high ? 168 : 96, high ? 120 : 72)
    this.material = new ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      uniforms: {
        uTime: { value: 0 },
        uAmp: { value: 0.2 },
        uFreq: { value: 0.72 },
        uColorA: { value: new Color('#f2efe8') },
        uColorB: { value: new Color('#8f887c') },
        uColorC: { value: new Color('#ff4a1c') },
        uLight: { value: new Vector3(-0.55, 0.85, 0.7) },
      },
    })
    this.mesh = new Mesh(geometry, this.material)
    this.mesh.rotation.set(0.3, -0.4, 0.1)
    this.scene.add(this.mesh)

    this.resize()
    this.resizeObserver = new ResizeObserver(() => this.resize())
    this.resizeObserver.observe(container)

    this.intersection = new IntersectionObserver(
      ([entry]) => {
        this.visible = entry.isIntersecting
        if (this.visible) this.start()
        else this.stop()
      },
      { rootMargin: '10% 0px' },
    )
    this.intersection.observe(container)

    this.onVisibility = () => {
      if (document.hidden) this.stop()
      else if (this.visible) this.start()
    }
    document.addEventListener('visibilitychange', this.onVisibility)

    // Draw one frame immediately so the placeholder can be removed.
    this.render(0)
    onReady?.()
  }

  setPointer(nx, ny) {
    this.pointer.x = nx
    this.pointer.y = ny
  }

  resize() {
    const { clientWidth: w, clientHeight: h } = this.container
    if (!w || !h) return
    this.renderer.setSize(w, h, false)
    this.renderer.domElement.style.width = '100%'
    this.renderer.domElement.style.height = '100%'
    this.camera.aspect = w / h
    this.camera.updateProjectionMatrix()
    if (!this.running) this.render(0)
  }

  render(dt) {
    if (!this.reduced) {
      this.material.uniforms.uTime.value += dt
      this.mesh.rotation.y += dt * 0.12
      // Ease towards the pointer-driven target (very small range).
      this.targetRot.x = this.pointer.y * 0.18
      this.targetRot.y = this.pointer.x * 0.28
      this.mesh.rotation.x += (0.3 + this.targetRot.x - this.mesh.rotation.x) * 0.04
      this.mesh.rotation.z += (0.1 + this.targetRot.y * 0.4 - this.mesh.rotation.z) * 0.04
    }
    this.renderer.render(this.scene, this.camera)
  }

  loop = () => {
    if (!this.running) return
    const dt = Math.min(this.clock.getDelta(), 0.05)
    this.render(dt)
    this.raf = requestAnimationFrame(this.loop)
  }

  start() {
    if (this.running || this.reduced) return
    this.running = true
    this.clock.getDelta()
    this.raf = requestAnimationFrame(this.loop)
  }

  stop() {
    this.running = false
    if (this.raf) cancelAnimationFrame(this.raf)
    this.raf = null
  }

  destroy() {
    this.stop()
    this.resizeObserver?.disconnect()
    this.intersection?.disconnect()
    document.removeEventListener('visibilitychange', this.onVisibility)
    this.mesh.geometry.dispose()
    this.material.dispose()
    this.renderer.dispose()
    this.renderer.forceContextLoss()
    this.renderer.domElement.remove()
  }
}
