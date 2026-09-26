/* =====================================================================
   CORE / MATERIALS
   Procedural PBR texture maps + a shared material library, and the
   "liquid displacement" injector that turns any physical material into
   an animated, normal-correct fluid-metal surface.
   ===================================================================== */
import * as THREE from 'three';

/* ------------------------------------------------------------------ GLSL */
export const SIMPLEX_GLSL = /* glsl */`
vec3 lusMod289(vec3 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 lusMod289(vec4 x){ return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 lusPermute(vec4 x){ return lusMod289(((x * 34.0) + 1.0) * x); }
vec4 lusTaylorInvSqrt(vec4 r){ return 1.79284291400159 - 0.85373472095314 * r; }

float lusSnoise(vec3 v){
  const vec2 C = vec2(1.0 / 6.0, 1.0 / 3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = lusMod289(i);
  vec4 p = lusPermute(lusPermute(lusPermute(
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
  vec4 norm = lusTaylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m * m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}
`;

/* ------------------------------------------------------------------ textures */
function canvas2d(size) {
  const c = document.createElement('canvas');
  c.width = c.height = size;
  return { c, ctx: c.getContext('2d', { willReadFrequently: true }) };
}

function valueNoiseImageData(size, octaves, scale, seed = 1) {
  const { c, ctx } = canvas2d(size);
  const img = ctx.createImageData(size, size);
  const d = img.data;
  let s = seed;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const grid = [];
  for (let o = 0; o < octaves; o++) {
    const g = Math.max(2, Math.round(scale * Math.pow(2, o)));
    const vals = new Float32Array(g * g);
    for (let i = 0; i < vals.length; i++) vals[i] = rnd();
    grid.push({ g, vals });
  }
  const smooth = t => t * t * (3 - 2 * t);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let v = 0, amp = 0.5, total = 0;
      for (let o = 0; o < octaves; o++) {
        const { g, vals } = grid[o];
        const fx = (x / size) * g, fy = (y / size) * g;
        const x0 = Math.floor(fx) % g, y0 = Math.floor(fy) % g;
        const x1 = (x0 + 1) % g, y1 = (y0 + 1) % g;
        const tx = smooth(fx - Math.floor(fx)), ty = smooth(fy - Math.floor(fy));
        const a = vals[y0 * g + x0], b = vals[y0 * g + x1];
        const cc = vals[y1 * g + x0], dd = vals[y1 * g + x1];
        v += amp * ((a + (b - a) * tx) + ((cc + (dd - cc) * tx) - (a + (b - a) * tx)) * ty);
        total += amp; amp *= 0.5;
      }
      const i = (y * size + x) * 4;
      const n = Math.max(0, Math.min(255, (v / total) * 255));
      d[i] = d[i + 1] = d[i + 2] = n; d[i + 3] = 255;
    }
  }
  ctx.putImageData(img, 0, 0);
  return { c, ctx };
}

/** Greyscale micro-imperfection map → roughness variation on polished metal. */
export function makeImperfectionMap(size = 512, seed = 7) {
  const { c, ctx } = valueNoiseImageData(size, 5, 6, seed);
  /* add a few fingerprint-like smudges */
  ctx.globalCompositeOperation = 'multiply';
  for (let i = 0; i < 26; i++) {
    const x = Math.random() * size, y = Math.random() * size, r = 12 + Math.random() * 70;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    g.addColorStop(0, 'rgba(190,190,190,0.55)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  ctx.globalCompositeOperation = 'source-over';
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  t.anisotropy = 4;
  return t;
}

/** Brushed-metal streak map (anisotropic roughness feel). */
export function makeBrushedMap(size = 512) {
  const { c, ctx } = canvas2d(size);
  ctx.fillStyle = '#8c8c8c'; ctx.fillRect(0, 0, size, size);
  for (let i = 0; i < 2600; i++) {
    const y = Math.random() * size;
    const len = 20 + Math.random() * 180;
    const x = Math.random() * size;
    const v = 120 + Math.random() * 90;
    ctx.strokeStyle = `rgba(${v},${v},${v},${0.05 + Math.random() * 0.12})`;
    ctx.lineWidth = 0.6 + Math.random() * 1.1;
    ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x + len, y + (Math.random() - 0.5) * 1.5); ctx.stroke();
  }
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

/** Height → tangent-space normal map (very subtle surface bite). */
export function makeMicroNormalMap(size = 512, strength = 1.6, seed = 21) {
  const src = valueNoiseImageData(size, 4, 10, seed);
  const sctx = src.ctx;
  const h = sctx.getImageData(0, 0, size, size).data;
  const { c, ctx } = canvas2d(size);
  const out = ctx.createImageData(size, size);
  const o = out.data;
  const at = (x, y) => h[(((y + size) % size) * size + ((x + size) % size)) * 4] / 255;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x + 1, y) - at(x - 1, y)) * strength;
      const dy = (at(x, y + 1) - at(x, y - 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      o[i] = ((-dx / len) * 0.5 + 0.5) * 255;
      o[i + 1] = ((-dy / len) * 0.5 + 0.5) * 255;
      o[i + 2] = ((1 / len) * 0.5 + 0.5) * 255;
      o[i + 3] = 255;
    }
  }
  ctx.putImageData(out, 0, 0);
  const t = new THREE.CanvasTexture(c);
  t.wrapS = t.wrapT = THREE.RepeatWrapping;
  t.colorSpace = THREE.NoColorSpace;
  return t;
}

/* ------------------------------------------------------------------ displacement */
/**
 * Inject animated simplex displacement (with recomputed normals) into any
 * MeshStandard/PhysicalMaterial. Uniforms are shared so a whole assembly can
 * deform in sync.
 */
export function applyLiquidDisplacement(material, uniforms) {
  material.onBeforeCompile = shader => {
    Object.keys(uniforms).forEach(k => { shader.uniforms[k] = uniforms[k]; });
    const decl = Object.keys(uniforms).map(k => {
      const v = uniforms[k].value;
      if (typeof v === 'number') return `uniform float ${k};`;
      if (v && v.isVector2) return `uniform vec2 ${k};`;
      if (v && v.isVector3) return `uniform vec3 ${k};`;
      if (v && v.isColor) return `uniform vec3 ${k};`;
      return `uniform float ${k};`;
    }).join('\n');

    shader.vertexShader = `
      ${decl}
      varying float vLusDisp;
      ${SIMPLEX_GLSL}
      float lusField(vec3 p){
        vec3 q = p * uFreq;
        float n = lusSnoise(q + vec3(0.0, uTime * uFlow, 0.0));
        n += 0.5 * lusSnoise(q * 2.13 - vec3(uTime * uFlow * 0.62, 0.0, uTime * uFlow * 0.41));
        n += 0.22 * lusSnoise(q * 4.7 + vec3(uTime * uFlow * 0.3));
        float md = length(p.xy - uPointer.xy);
        n += smoothstep(uPointerR, 0.0, md) * 0.55 * uPointer.z;
        return n * uDisp;
      }
    ` + shader.vertexShader;

    shader.vertexShader = shader.vertexShader
      .replace('#include <beginnormal_vertex>', `
        float lusD = lusField(position);
        vLusDisp = lusD;
        vec3 lusP = position + normal * lusD;
        float lusE = 0.055;
        vec3 lusT = normalize(abs(normal.y) < 0.99 ? cross(normal, vec3(0.0, 1.0, 0.0)) : cross(normal, vec3(1.0, 0.0, 0.0)));
        vec3 lusB = cross(normal, lusT);
        vec3 lusP1 = position + lusT * lusE;
        vec3 lusP2 = position + lusB * lusE;
        lusP1 += normal * lusField(lusP1);
        lusP2 += normal * lusField(lusP2);
        vec3 objectNormal = normalize(cross(lusP1 - lusP, lusP2 - lusP));
        if (dot(objectNormal, normal) < 0.0) objectNormal = -objectNormal;
        #ifdef USE_TANGENT
          vec3 objectTangent = vec3( tangent.xyz );
        #endif
      `)
      .replace('#include <begin_vertex>', `vec3 transformed = lusP;`);

    shader.fragmentShader = `
      varying float vLusDisp;
    ` + shader.fragmentShader;

    shader.fragmentShader = shader.fragmentShader
      .replace('#include <roughnessmap_fragment>', `
        #include <roughnessmap_fragment>
        roughnessFactor = clamp(roughnessFactor * (1.0 + vLusDisp * 0.55), 0.015, 1.0);
      `);

    material.userData.shader = shader;
  };
  material.customProgramCacheKey = () => 'lus-liquid-displacement';
  return material;
}

export function liquidUniforms(opts = {}) {
  return {
    uTime: { value: 0 },
    uDisp: { value: opts.disp !== undefined ? opts.disp : 0.14 },
    uFreq: { value: opts.freq !== undefined ? opts.freq : 1.1 },
    uFlow: { value: opts.flow !== undefined ? opts.flow : 0.22 },
    uPointer: { value: new THREE.Vector3(99, 99, 0) },
    uPointerR: { value: opts.pointerR !== undefined ? opts.pointerR : 1.6 }
  };
}

/* ------------------------------------------------------------------ library */
export class MaterialLib {
  constructor(envMap, quality) {
    this.envMap = envMap;
    this.quality = quality;
    this.list = [];
    this.textures = [];
    /* Stages are rebuilt on every route change; caching by recipe keeps the
       library from growing (no material leaks, no shader recompiles). */
    this.cache = new Map();

    this.imperfection = makeImperfectionMap(quality.tier >= 2 ? 512 : 256);
    this.micro = makeMicroNormalMap(quality.tier >= 2 ? 512 : 256, 1.1);
    this.brushed = makeBrushedMap(quality.tier >= 2 ? 512 : 256);
    this.textures.push(this.imperfection, this.micro, this.brushed);
  }

  _reg(m) { this.list.push(m); return m; }

  _cached(kind, opts, factory) {
    const key = kind + JSON.stringify(opts || {});
    if (this.cache.has(key)) return this.cache.get(key);
    const m = factory();
    this.cache.set(key, m);
    return m;
  }

  chrome(opts = {}) {
    return this._cached('chrome', opts, () => this._reg(new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(opts.color || 0xdfe2e6),
      metalness: 1.0,
      roughness: opts.roughness !== undefined ? opts.roughness : 0.13,
      roughnessMap: this.imperfection,
      normalMap: this.micro,
      normalScale: new THREE.Vector2(0.16, 0.16),
      envMap: this.envMap,
      envMapIntensity: opts.env !== undefined ? opts.env : 1.35,
      clearcoat: opts.clearcoat !== undefined ? opts.clearcoat : 0.35,
      clearcoatRoughness: 0.22,
      anisotropy: opts.anisotropy !== undefined ? opts.anisotropy : 0.0
    })));
  }

  brushedSteel(opts = {}) {
    return this._cached('brushed', opts, () => this._reg(new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(opts.color || 0xb9bcc2),
      metalness: 1,
      roughness: 0.34,
      roughnessMap: this.brushed,
      envMap: this.envMap,
      envMapIntensity: 1.1,
      anisotropy: 0.6,
      anisotropyRotation: Math.PI / 2
    })));
  }

  glass(opts = {}) {
    return this._cached('glass', Object.assign({}, opts, { t: !!this.quality.transmission }), () => {
    const m = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(opts.color || 0xffffff),
      metalness: 0,
      roughness: opts.roughness !== undefined ? opts.roughness : 0.06,
      transmission: this.quality.transmission ? 1 : 0,
      opacity: this.quality.transmission ? 1 : 0.42,
      transparent: !this.quality.transmission,
      thickness: opts.thickness !== undefined ? opts.thickness : 1.1,
      ior: opts.ior !== undefined ? opts.ior : 1.52,
      dispersion: opts.dispersion !== undefined ? opts.dispersion : 0.6,
      iridescence: opts.iridescence !== undefined ? opts.iridescence : 0.42,
      iridescenceIOR: 1.28,
      iridescenceThicknessRange: [120, 520],
      attenuationColor: new THREE.Color(opts.attenuation || 0xffb59a),
      attenuationDistance: opts.attenuationDistance || 3.4,
      envMap: this.envMap,
      envMapIntensity: 1.5,
      specularIntensity: 1,
      clearcoat: 1,
      clearcoatRoughness: 0.06,
      side: opts.side || THREE.FrontSide
    });
    return this._reg(m);
    });
  }

  matte(opts = {}) {
    return this._cached('matte', opts, () => this._reg(new THREE.MeshStandardMaterial({
      color: new THREE.Color(opts.color || 0x14141a),
      roughness: opts.roughness !== undefined ? opts.roughness : 0.72,
      metalness: opts.metalness !== undefined ? opts.metalness : 0.08,
      envMap: this.envMap,
      envMapIntensity: opts.env !== undefined ? opts.env : 0.6
    })));
  }

  paper(opts = {}) {
    return this._cached('paper', opts, () => this._reg(new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(opts.color || 0xefede8),
      roughness: 0.66,
      metalness: 0,
      sheen: 0.5,
      sheenRoughness: 0.7,
      sheenColor: new THREE.Color(0xffffff),
      envMap: this.envMap,
      envMapIntensity: 0.75
    })));
  }

  glow(color = 0xff4d1f, intensity = 2.4, opts = {}) {
    return this._cached('glow', { color, intensity, opts }, () => this._reg(new THREE.MeshBasicMaterial({
      color: new THREE.Color(color).multiplyScalar(intensity),
      transparent: true,
      opacity: opts.opacity !== undefined ? opts.opacity : 1,
      blending: opts.additive === false ? THREE.NormalBlending : THREE.AdditiveBlending,
      depthWrite: false,
      side: opts.side || THREE.FrontSide,
      toneMapped: opts.toneMapped !== undefined ? opts.toneMapped : true
    })));
  }

  dispose() {
    this.list.forEach(m => m.dispose());
    this.list.length = 0;
    this.cache.clear();
    this.textures.forEach(t => t.dispose());
    this.textures.length = 0;
  }
}
