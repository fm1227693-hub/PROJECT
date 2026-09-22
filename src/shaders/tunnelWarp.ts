/**
 * LUSION — Tunnel Warp Shaders — Production-grade GLSL
 * Chromatic iridescent rim-light, simplex noise, zone color palettes, fresnel rim
 */

export const tunnelWarpVert = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollVelocity;
uniform float uWarpIntensity;
uniform float uProgress;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vProgress;

// Simplex 3D Noise — Ashima
vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
float snoise(vec3 v){
  const vec2 C = vec2(1.0/6.0, 1.0/3.0);
  const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
  vec3 i  = floor(v + dot(v, C.yyy));
  vec3 x0 = v - i + dot(i, C.xxx);
  vec3 g = step(x0.yzx, x0.xyz);
  vec3 l = 1.0 - g;
  vec3 i1 = min(g.xyz, l.zxy);
  vec3 i2 = max(g.xyz, l.zxy);
  vec3 x1 = x0 - i1 + 1.0 * C.xxx;
  vec3 x2 = x0 - i2 + 2.0 * C.xxx;
  vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
  i = mod(i, 289.0);
  vec4 p = permute(permute(permute(
             i.z + vec4(0.0, i1.z, i2.z, 1.0))
           + i.y + vec4(0.0, i1.y, i2.y, 1.0))
           + i.x + vec4(0.0, i1.x, i2.x, 1.0));
  float n_ = 0.142857142857;
  vec3  ns = n_ * D.wyz - D.xzx;
  vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
  vec4 x_ = floor(j * ns.z);
  vec4 y_ = floor(j - 7.0 * x_);
  vec4 x = x_ *ns.x + ns.yyyy;
  vec4 y = y_ *ns.x + ns.yyyy;
  vec4 h = 1.0 - abs(x) - abs(y);
  vec4 b0 = vec4(x.xy, y.xy);
  vec4 b1 = vec4(x.zw, y.zw);
  vec4 s0 = floor(b0)*2.0 + 1.0;
  vec4 s1 = floor(b1)*2.0 + 1.0;
  vec4 sh = -step(h, vec4(0.0));
  vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
  vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
  vec3 p0 = vec3(a0.xy, h.x);
  vec3 p1 = vec3(a0.zw, h.y);
  vec3 p2 = vec3(a1.xy, h.z);
  vec3 p3 = vec3(a1.zw, h.w);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

void main(){
  vUv = uv;
  vProgress = uProgress;

  vec3 pos = position;

  // High-frequency turbulent noise along tunnel wall
  float noise = snoise(vec3(pos.xy * 0.4, pos.z * 0.08 + uTime * 2.0));
  float warp = noise * uWarpIntensity * (1.0 + uScrollVelocity * 3.0 + uProgress * 1.2);

  // Additional low-frequency undulation for organic fractures
  float lowNoise = snoise(vec3(pos.xy * 0.12, pos.z * 0.02 + uTime * 0.6));
  warp += lowNoise * uWarpIntensity * 0.35;

  pos += normal * warp;

  // Tunnel collapse/expand based on progress for portal condensation
  float portalCollapse = smoothstep(0.7, 0.85, uProgress);
  pos.xy *= 1.0 - portalCollapse * 0.65 * (1.0 - abs(pos.z) / 160.0);

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  vViewPosition = -mvPosition.xyz;
  vNormal = normalMatrix * normal;

  gl_Position = projectionMatrix * mvPosition;
}
`

export const tunnelWarpFrag = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;
uniform float uScrollVelocity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewPosition;
varying float vProgress;

void main(){
  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);
  float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0);

  // Zone Color Palettes per spec
  // Quantum Matrix Grid: volumetric particle fields
  vec3 matrixColor = mix(vec3(0.0, 0.95, 0.6), vec3(0.0, 0.1, 0.05), vUv.y);
  matrixColor += sin(vUv.x * 40.0 + uTime * 6.0) * 0.04;

  // Neon Cybernetic Corridor: emerald-green and electric-cyan
  vec3 neonColor = mix(vec3(0.0, 0.95, 0.55), vec3(0.0, 0.85, 1.0), sin(vUv.x * 12.0 + uTime * 2.5)*0.5+0.5);
  neonColor = mix(neonColor, vec3(0.0, 1.0, 0.7), vUv.y * 0.5);

  // Crystalline Lattice / Organic Fractures: magenta and ruby-red caustic
  vec3 crystalColor = mix(vec3(1.0, 0.1, 0.6), vec3(0.4, 0.0, 0.9), sin(vUv.x * 20.0 + uTime * 4.0)*0.5+0.5);
  crystalColor += vec3(0.9, 0.1, 0.2) * pow(sin(vUv.y * 30.0 + uTime * 3.0), 8.0) * 0.6;

  // Surreal Cobalt Architectural Gallery: matte royal-blue arches
  vec3 cobaltColor = vec3(0.08, 0.25, 0.92);
  cobaltColor += vec3(0.1, 0.3, 1.0) * sin(vUv.x * 8.0 + uTime) * 0.08;

  // Color blending based on progress
  vec3 finalColor = matrixColor;
  if(uProgress > 0.0 && uProgress <= 0.32){
    float t = smoothstep(0.0, 0.32, uProgress);
    finalColor = mix(matrixColor, neonColor, t);
  } else if(uProgress > 0.32 && uProgress <= 0.62){
    float t = smoothstep(0.32, 0.62, uProgress);
    finalColor = mix(neonColor, crystalColor, t);
  } else if(uProgress > 0.62){
    float t = smoothstep(0.62, 1.0, uProgress);
    finalColor = mix(crystalColor, cobaltColor, t);
  }

  // Velocity streaks
  finalColor += uScrollVelocity * 0.8 * vec3(0.2, 0.6, 1.0) * sin(vUv.y * 50.0 + uTime * 10.0);

  // Specular streaks and fresnel rim
  finalColor += fresnel * 1.5;
  finalColor += pow(max(dot(reflect(-viewDir, normal), vec3(0.0, 1.0, 0.0)), 0.0), 16.0) * 0.8;

  // Chromatic aberration pulse on high velocity
  float chromaPulse = uScrollVelocity * 0.5 * sin(uTime * 12.0);
  finalColor.r += chromaPulse * 0.12;
  finalColor.b -= chromaPulse * 0.08;

  // Vignette for tunnel depth
  float vignette = 1.0 - length(vUv - 0.5) * 0.6;
  finalColor *= vignette;

  gl_FragColor = vec4(finalColor, 1.0);
}
`

export const astronautVert = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vProgress;

void main(){
  vProgress = uProgress;
  vec3 pos = position;

  // Subtle suit fabric wave
  float wave = sin(pos.x * 2.0 + uTime * 1.5) * 0.008 + cos(pos.y * 2.2 + uTime) * 0.006;
  pos += normal * wave * (1.0 - uProgress * 0.5);

  vec4 mv = modelViewMatrix * vec4(pos, 1.0);
  vViewPos = -mv.xyz;
  vNormal = normalMatrix * normal;
  gl_Position = projectionMatrix * mv;
}
`

export const astronautFrag = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;

varying vec3 vNormal;
varying vec3 vViewPos;
varying float vProgress;

void main(){
  vec3 N = normalize(vNormal);
  vec3 V = normalize(vViewPos);
  float fresnel = pow(1.0 - max(dot(N,V),0.0), 3.0);

  // White ballistic nylon
  vec3 base = vec3(0.96, 0.96, 0.97);
  base += sin(vViewPos.x * 2.0 + uTime) * 0.02;

  // Iridescent rim
  vec3 irid = vec3(0.4, 0.6, 1.0) * fresnel * 0.6 + vec3(1.0, 0.6, 0.9) * fresnel * 0.3;

  // Visor golden reflection
  float visor = smoothstep(0.3, 0.7, N.y) * (1.0 - vProgress * 0.5);
  vec3 visorCol = mix(base, vec3(1.0, 0.85, 0.3), visor * 0.35);

  vec3 col = visorCol + irid + fresnel * 0.25;

  gl_FragColor = vec4(col, 1.0);
}
`

export const portalFrag = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uProgress;
uniform vec2 uResolution;

varying vec2 vUv;

float noise(vec2 p){
  return fract(sin(dot(p, vec2(12.9898,78.233))) * 43758.5453);
}

void main(){
  vec2 uv = vUv;
  float t = uTime * 0.6;

  // Organic noise border dissolve
  float borderX = min(uv.x, 1.0 - uv.x);
  float borderY = min(uv.y, 1.0 - uv.y);
  float border = min(borderX, borderY);

  float n = noise(uv * 8.0 + t * 0.3) * 0.5 + noise(uv * 16.0 - t * 0.5) * 0.25;
  float dissolve = smoothstep(0.0, 0.15 + n * 0.12, border + (1.0 - uProgress) * 0.2);

  vec3 col = vec3(0.97, 0.97, 0.98);
  col += sin(uv.x * 10.0 + t) * 0.02;

  // Blue archway when condensing
  float arch = smoothstep(0.7, 0.85, uProgress);
  col = mix(col, vec3(0.15, 0.35, 0.95), arch * (1.0 - border * 8.0) * 0.12);

  gl_FragColor = vec4(col, dissolve);
}
`
