/**
 * LUSION HOMEPAGE — Elastic Showreel Ribbon Shader
 * Exact real-world Lusion.co: light theme, interactive elastic plane
 * PlaneGeometry(16, 6, 64, 32) with wave + mouse drag distortion
 */

export const ribbonVertexShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uWaveIntensity;
uniform vec2 uMouseTarget;
uniform float uMouseVelocity;
uniform float uScrollProgress;
uniform float uDragOffset;
uniform float uFoldProgress;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWave;
varying float vMouseInfluence;
varying float vFold;

// Simplex 2D for organic wave
vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0,0.0) : vec2(0.0,1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m; m = m*m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main(){
  vUv = uv;

  vec3 pos = position;

  // Base wave per spec
  // float wave = sin(pos.x * 0.5 + uTime * 1.5) * cos(pos.y * 0.8 + uTime) * uWaveIntensity;
  float waveX = sin(pos.x * 0.52 + uTime * 1.45);
  float waveY = cos(pos.y * 0.78 + uTime * 0.92);
  float wave = waveX * waveY * uWaveIntensity;
  // Add secondary micro wave for cloth realism
  float microWave = snoise(vec2(pos.x * 0.35 + uTime * 0.3, pos.y * 0.4 + uTime * 0.2)) * 0.12 * uWaveIntensity;
  wave += microWave;

  // Mouse proximity deformation per spec
  // float mouseDist = length(pos.xy - uMouseTarget);
  // float mouseDeform = smoothstep(3.5, 0.0, mouseDist) * uMouseVelocity;
  float mouseDist = length(pos.xy - uMouseTarget);
  float mouseDeform = smoothstep(3.8, 0.0, mouseDist) * uMouseVelocity;

  // Elastic rubber/cloth stretch — Z and Y axes
  // pos.z += wave + (mouseDeform * sin(uTime * 4.0));
  float elasticZ = wave + (mouseDeform * sin(uTime * 4.2 + pos.x * 0.6) * 0.85);
  float elasticY = mouseDeform * 0.35 * sin(pos.x * 0.8 + uTime * 2.5) + wave * 0.15;

  pos.z += elasticZ;
  pos.y += elasticY;

  // Drag offset — when user drags, ribbon stretches like soft rubber
  float dragInfluence = smoothstep(4.5, 0.0, mouseDist);
  pos.x += uDragOffset * dragInfluence * 0.45;
  pos.z += abs(uDragOffset) * dragInfluence * 0.25 * sin(pos.x * 0.5);

  // Fold/unfold into curved arc as user scrolls down per spec — Lenis + GSAP
  // uFoldProgress 0 = flat, 1 = curved arc
  float fold = uFoldProgress;
  vFold = fold;
  float arcX = pos.x;
  // Curve plane into arc along X
  float arcCurve = sin(arcX * 0.18) * fold * 1.8;
  float arcZ = cos(arcX * 0.18) * fold * -1.2;
  pos.z += arcZ + arcCurve * 0.3;
  pos.y += arcCurve * 0.15;

  // Scroll Y-stretch — viscous fold
  float scrollStretch = uScrollProgress * 0.6;
  pos.y *= 1.0 + scrollStretch * 0.15 * sin(pos.x * 0.2 + uTime * 0.3);
  pos.z *= 1.0 + scrollStretch * 0.1;

  // Normal recalculation for lighting
  vec3 tangent = normalize(vec3(1.0, 0.0, cos(pos.x * 0.5 + uTime * 1.5) * 0.5 * uWaveIntensity));
  vec3 bitangent = normalize(vec3(0.0, 1.0, sin(pos.y * 0.8 + uTime) * 0.4 * uWaveIntensity));
  vec3 computedNormal = normalize(cross(tangent, bitangent));

  vNormal = normalize(normalMatrix * computedNormal);
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vWave = wave;
  vMouseInfluence = mouseDeform;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const ribbonFragmentShader = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
uniform float uMouseVelocity;
uniform vec2 uMouseTarget;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform float uTextureEnabled;
uniform float uFoldProgress;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWave;
varying float vMouseInfluence;
varying float vFold;

// Chromatic aberration on warped edges per spec
vec3 chromaticAberration(sampler2D tex, vec2 uv, float intensity, float wave){
  float edge = abs(uv.x - 0.5) * 2.0; // 0 center, 1 edge
  float aberration = intensity * (0.002 + edge * 0.008 + abs(wave) * 0.004);

  float r = texture2D(tex, uv + vec2(aberration, 0.0)).r;
  float g = texture2D(tex, uv).g;
  float b = texture2D(tex, uv - vec2(aberration, 0.0)).b;

  // Add subtle color fringing on warped edges
  vec3 color = vec3(r,g,b);

  // Violet/cyan fringe at high deformation
  float fringe = smoothstep(0.3, 0.8, abs(wave) + vMouseInfluence * 0.5);
  color.r += fringe * 0.04 * edge;
  color.b += fringe * 0.06 * edge;
  color.g -= fringe * 0.02 * edge;

  return color;
}

// Dynamic showreel texture — canvas feed simulation
vec3 showreelTexture(vec2 uv, float time){
  // Simulate video texture with moving gradient + noise
  vec2 p = uv * 2.0 - 1.0;

  // Base studio light gray
  vec3 base = vec3(0.97, 0.97, 0.98);

  // Animated gradient representing showreel
  float t = time * 0.15;
  float pattern1 = sin((uv.x + t) * 3.0) * cos((uv.y + t * 0.7) * 2.5) * 0.5 + 0.5;
  float pattern2 = sin(uv.x * 8.0 + time) * 0.5 + 0.5;
  float pattern3 = cos(length(p) * 4.0 - time * 1.2) * 0.5 + 0.5;

  // Showreel content — abstract moving shapes
  vec3 reel1 = vec3(0.08, 0.08, 0.09) * (1.0 - smoothstep(0.0, 0.6, pattern1));
  vec3 reel2 = vec3(0.95, 0.95, 0.96) * smoothstep(0.4, 0.9, pattern2) * 0.15;
  vec3 reel3 = vec3(0.2, 0.2, 0.22) * pattern3 * 0.08;

  vec3 color = base + reel1 * 0.25 + reel2 + reel3;

  // Vignette for depth
  float vignette = 1.0 - dot(p, p) * 0.12;
  color *= vignette;

  // Scanline for video feel
  float scanline = sin(uv.y * 800.0 + time * 5.0) * 0.015 + 1.0;
  color *= scanline;

  return color;
}

void main(){
  vec2 uv = vUv;

  // Dynamic texture
  vec3 texColor;
  if(uTextureEnabled > 0.5){
    // Use provided texture with chromatic aberration
    texColor = chromaticAberration(uTexture, uv, 0.8 + vMouseInfluence * 1.2, vWave);
  } else {
    // Fallback showreel procedural
    texColor = showreelTexture(uv, uTime);
  }

  // Lighting — studio soft
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPosition);
  vec3 L = normalize(vec3(0.6, 0.8, 0.5));

  float NdotL = max(dot(N, L), 0.0);
  float NdotV = max(dot(N, V), 0.0);

  // Soft diffuse
  float diffuse = NdotL * 0.6 + 0.4;
  // Fresnel for edge highlight on warped cloth
  float fresnel = pow(1.0 - NdotV, 2.2) * 0.18;

  // Wave-based shading — darken valleys, brighten peaks
  float waveShade = vWave * 0.35;
  texColor += waveShade;

  // Mouse proximity highlight — elastic interaction glow
  float mouseGlow = vMouseInfluence * 0.25;
  texColor += mouseGlow * vec3(1.0, 1.0, 1.0) * 0.15;

  // Fold shading — curved arc gets subtle shadow
  float foldShadow = vFold * 0.08 * (1.0 - uv.y);
  texColor -= foldShadow;

  // Final composition — light theme #f9f9fb to #ffffff per spec
  vec3 color = texColor * diffuse + fresnel * vec3(1.0);

  // Subtle grain to eliminate banding on light gray
  float grain = fract(sin(dot(uv * uTime * 0.01, vec2(12.9898,78.233))) * 43758.5453) * 0.015 - 0.0075;
  color += grain;

  // Tone mapping
  color = color / (color + vec3(1.0));
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex: ribbonVertexShader,
  fragment: ribbonFragmentShader,
};
