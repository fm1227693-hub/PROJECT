// Lusion Signature - Organic Fluid Mesh Vertex Noise
// Base: IcosahedronGeometry(2.2, 64) + Simplex Curl Noise
// Hydrodynamic mouse repulsion + scroll shear morph

uniform float uTime;
uniform vec2 uMousePos;
uniform float uMouseVelocity;
uniform float uScrollProgress;
uniform float uMorphFactor;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vEyeVector;
varying float vDistortion;
varying float vFresnel;
varying vec2 vUv;

// --- Simplex 3D Noise by Ashima Arts ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

float snoise(vec3 v) {
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
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  m = m * m;
  return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
}

// 4D Simplex noise for time evolution
vec4 mod289_4(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
float snoise(vec4 v) {
  const vec4 C = vec4(0.138196601125011, 0.276393202250021, 0.414589803375032, -0.447213595499958);
  vec4 i  = floor(v + dot(v, vec4(0.309016994374947451)));
  vec4 x0 = v - i + dot(i, C.xxxx);
  vec4 i0;
  vec3 isX = step(x0.yzw, x0.xxx);
  vec3 isYZ = step(x0.zww, x0.yyz);
  i0.x = isX.x + isX.y + isX.z;
  i0.yzw = 1.0 - isX;
  i0.y += isYZ.x + isYZ.y;
  i0.zw += 1.0 - isYZ.xxyy;
  i0.z += isYZ.z;
  i0.w += 1.0 - isYZ.z;
  vec4 i3 = clamp(i0, 0.0, 1.0);
  vec4 i2 = clamp(i0-1.0, 0.0, 1.0);
  vec4 i1 = clamp(i0-2.0, 0.0, 1.0);
  vec4 x1 = x0 - i1 + C.xxxx;
  vec4 x2 = x0 - i2 + C.yyyy;
  vec4 x3 = x0 - i3 + C.zzzz;
  vec4 x4 = x0 + C.wwww;
  i = mod289_4(i);
  float j0 = permute(permute(permute(permute(i.w) + i.z) + i.y) + i.x).x;
  vec4 j1 = permute(permute(permute(permute(
    i.w + vec4(i1.w, i2.w, i3.w, 1.0))
    + i.z + vec4(i1.z, i2.z, i3.z, 1.0))
    + i.y + vec4(i1.y, i2.y, i3.y, 1.0))
    + i.x + vec4(i1.x, i2.x, i3.x, 1.0));
  vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;
  vec4 p0 = mod289_4(j0 * ip.w + ip.z);
  vec4 p1 = mod289_4(j1.x * ip.w + ip.z);
  vec4 p2 = mod289_4(j1.y * ip.w + ip.z);
  vec4 p3 = mod289_4(j1.z * ip.w + ip.z);
  vec4 p4 = mod289_4(j1.w * ip.w + ip.z);
  vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
  p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
  norm = taylorInvSqrt(vec4(dot(p4,p4), dot(vec4(0.0),vec4(0.0)), dot(vec4(0.0),vec4(0.0)), dot(vec4(0.0),vec4(0.0))));
  p4 *= norm.x;
  vec4 m0 = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
  vec4 m1 = max(0.6 - dot(x4,x4), 0.0);
  m0 = m0 * m0; m1 = m1 * m1;
  return 49.0 * (dot(m0*m0, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3))) + m1*m1*dot(p4,x4));
}

// Curl Noise helper - returns divergence-free vector field
vec3 curlNoise(vec3 p) {
  const float e = 0.1;
  float n1 = snoise(vec3(p.x, p.y + e, p.z));
  float n2 = snoise(vec3(p.x, p.y - e, p.z));
  float n3 = snoise(vec3(p.x, p.y, p.z + e));
  float n4 = snoise(vec3(p.x, p.y, p.z - e));
  float n5 = snoise(vec3(p.x + e, p.y, p.z));
  float n6 = snoise(vec3(p.x - e, p.y, p.z));

  float x = n2 - n1 - (n4 - n3);
  float y = n4 - n3 - (n6 - n5);
  float z = n6 - n5 - (n2 - n1);

  // normalize curl
  return normalize(vec3(x,y,z) * 0.5 + 0.5) * 2.0 - 1.0;
}

void main() {
  vUv = uv;
  vec3 basePos = position;

  // --- Core organic noise deformation ---
  // snoise(vec4(position * 1.5, uTime * 0.8)) * 0.45 per spec
  float timeFreq = uTime * 0.8;
  float noiseFreq = 1.5;
  float noiseAmp = 0.45;
  
  float n1 = snoise(vec4(basePos * noiseFreq, timeFreq));
  float n2 = snoise(vec4(basePos * noiseFreq * 1.3 + 10.0, timeFreq * 1.1));
  float n3 = snoise(vec4(basePos * noiseFreq * 0.7 - 5.0, timeFreq * 0.9));
  
  // Layered fractal noise for organic jelly
  float fractalNoise = n1 * 0.6 + n2 * 0.3 + n3 * 0.15;
  vDistortion = fractalNoise;

  // --- Hydrodynamic mouse reaction ---
  // Raycast hit point onto z=0 plane is passed as uMousePos
  // Calculate world position
  vec4 worldPosTemp = modelMatrix * vec4(basePos, 1.0);
  vWorldPosition = worldPosTemp.xyz;
  
  float dist = length(vWorldPosition.xy - uMousePos);
  // exponential falloff repulsion pulse per spec: smoothstep(2.5, 0.0, dist) * uMouseVelocity
  float impulse = smoothstep(2.5, 0.0, dist) * uMouseVelocity;
  // add directional push
  vec3 mouseDir = normalize(vec3(vWorldPosition.xy - uMousePos, 0.5));
  
  // --- Scroll progression morphing ---
  // Phase 2 (0.25-0.5): elongate and shear along scroll vector
  float shearPhase = smoothstep(0.25, 0.5, uScrollProgress);
  float prismPhase = smoothstep(0.35, 0.55, uScrollProgress);
  float ringPhase = smoothstep(0.75, 1.0, uScrollProgress);
  
  // Breathing in center (Phase 1)
  float breathe = sin(uTime * 0.8) * 0.03 * (1.0 - uScrollProgress);
  
  // Elongation along Y for scroll
  vec3 elongatedPos = basePos;
  elongatedPos.y *= 1.0 + shearPhase * 0.85;
  elongatedPos.x *= 1.0 - shearPhase * 0.15;
  
  // Shear along scroll vector
  elongatedPos.x += shearPhase * sin(elongatedPos.y * 0.6 + uTime * 0.5) * 0.35;
  elongatedPos.z += shearPhase * cos(elongatedPos.y * 0.4 + uTime * 0.3) * 0.25;
  
  // Morph into prism (floating glass)
  vec3 prismPos = elongatedPos;
  // Twist for prism effect
  float angle = prismPhase * elongatedPos.y * 0.3;
  float s = sin(angle);
  float c = cos(angle);
  prismPos.x = elongatedPos.x * c - elongatedPos.z * s;
  prismPos.z = elongatedPos.x * s + elongatedPos.z * c;
  
  // Phase 4: condense into glowing ring at bottom
  float theta = atan(elongatedPos.y, elongatedPos.x);
  float ringRadius = 2.0 + sin(theta * 6.0 + uTime) * 0.15;
  vec3 ringPos = vec3(cos(theta) * ringRadius, sin(theta) * ringRadius, elongatedPos.z * 0.08);
  // anchor at bottom
  ringPos.y -= ringPhase * 3.5;
  ringPos = mix(prismPos, ringPos, ringPhase * 0.7);
  
  // Final morphed base position
  vec3 morphedPos = mix(basePos, elongatedPos, shearPhase);
  morphedPos = mix(morphedPos, prismPos, prismPhase * 0.5);
  morphedPos = mix(morphedPos, ringPos, ringPhase);
  
  // Apply noise displacement along normal + mouse impulse
  vec3 displacedNormal = normalize(normal + curlNoise(basePos * 0.8 + uTime * 0.2) * 0.15);
  vNormal = normalize(normalMatrix * displacedNormal);
  
  float totalDisplacement = fractalNoise * noiseAmp + breathe + impulse * 0.6;
  // Add extra mouse push along normal
  totalDisplacement += impulse * dot(mouseDir, normal) * 0.3;
  
  vec3 newPosition = morphedPos + displacedNormal * totalDisplacement;
  
  // World and eye vectors for fragment shader
  vec4 worldPosition = modelMatrix * vec4(newPosition, 1.0);
  vWorldPosition = worldPosition.xyz;
  vec4 mvPosition = viewMatrix * worldPosition;
  vEyeVector = normalize(worldPosition.xyz - cameraPosition);
  vFresnel = pow(1.0 - abs(dot(vNormal, normalize(-vEyeVector))), 3.0);
  
  gl_Position = projectionMatrix * mvPosition;
}
