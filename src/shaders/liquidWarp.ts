/**
 * LUSION — Liquid Warp Shaders
 * Production-ready vertex deformation + high-refraction liquid glass
 * Scroll-driven docking, cloth/jelly inertia, organic fluid normal map
 */

export const liquidWarpVert = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollVelocity;
uniform float uScrollProgress;
uniform float uDockProgress;
uniform vec2 uMouseTarget;
uniform float uMouseDeform;
uniform float uMouseVelocity;
uniform float uDragOffset;
uniform float uFoldProgress;
uniform float uWaveIntensity;
uniform float uHoverProgress;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWave;
varying float vMouseInfluence;
varying float vFold;
varying float vHover;
varying float vDock;
varying vec2 vScreenUv;

// Lusion spec: pos.z += sin(pos.x*0.4+uTime*2.0)*uScrollVelocity*0.35 and pos.y += cos(pos.x*0.3)*uMouseDeform
void main(){
  vUv = uv;
  vDock = uDockProgress;
  vHover = uHoverProgress;

  vec3 pos = position;

  // --- Scroll velocity inertia (spec formula) ---
  float scrollWave = sin(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35;
  float mouseWaveY = cos(pos.x * 0.3 + uTime * 0.6) * uMouseDeform;

  // --- Organic cloth / jelly wave ---
  float waveX = sin(pos.x * 0.52 + uTime * 1.25 + uHoverProgress * 1.1);
  float waveY = cos(pos.y * 0.68 + uTime * 0.9 + uDockProgress * 0.7);
  float wave = waveX * waveY * (uWaveIntensity + uHoverProgress * 0.38 + uDockProgress * 0.15) * 0.55;

  // --- Mouse distance deform with trailing spring ---
  float mouseDist = length(pos.xy - uMouseTarget);
  float mouseDeform = smoothstep(3.8, 0.0, mouseDist) * (uMouseVelocity + uHoverProgress * 1.0 + uDockProgress * 0.2);
  float mouseTrail = sin(uTime * 3.5 + pos.x * 0.55 + pos.y * 0.3) * mouseDeform * 0.42;

  // --- Corners bend backward on high velocity (jelly) ---
  float cornerX = abs(pos.x) / 8.0;
  float cornerY = abs(pos.y) / 3.5;
  float cornerFactor = cornerX * cornerY;
  float velocityBend = uScrollVelocity * cornerFactor * 1.8;
  float bendZ = -velocityBend * (1.0 + uDockProgress * 0.6);
  float bendY = velocityBend * 0.35 * sin(pos.x * 0.3);

  // --- Hover bulge ---
  float hoverDist = length(pos.xy);
  float hoverBulge = smoothstep(5.8, 0.0, hoverDist) * uHoverProgress * 0.52 * sin(uTime * 2.4 + pos.x * 0.65);

  // --- Docking transform: shrink 0.55x, shift to lower-left, tilt -5 deg ---
  // Docking is handled mostly in JS scale/position/rotation, but add subtle vertex warp for organic feel
  float dockWarpX = uDockProgress * sin(pos.y * 0.5 + uTime * 0.8) * 0.12;
  float dockWarpY = uDockProgress * cos(pos.x * 0.4 + uTime * 0.7) * 0.08;

  // --- Combine ---
  pos.z += scrollWave + wave + mouseTrail + bendZ + hoverBulge + dockWarpX * 0.5;
  pos.y += mouseWaveY + mouseDeform * 0.32 * sin(pos.x * 0.72 + uTime * 2.1) + wave * 0.14 + bendY + hoverBulge * 0.28 + dockWarpY;
  pos.x += uDragOffset * smoothstep(4.8, 0.0, mouseDist) * 0.45;
  pos.x += uHoverProgress * sin(pos.y * 0.85 + uTime * 1.6) * 0.09;
  pos.z += uHoverProgress * cos(pos.x * 0.52 + uTime) * 0.13;
  pos.z += abs(uDragOffset) * smoothstep(4.8, 0.0, mouseDist) * 0.24 * sin(pos.x * 0.48);

  // Fold arc on scroll
  float fold = uFoldProgress;
  vFold = fold;
  float arcX = pos.x;
  float arcCurve = sin(arcX * 0.15) * fold * 1.5;
  float arcZ = cos(arcX * 0.15) * fold * -1.0;
  pos.z += arcZ + arcCurve * 0.28;
  pos.y += arcCurve * 0.14;

  // Normals for liquid refraction
  vec3 tangent = normalize(vec3(1.0, 0.0, cos(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35 + uHoverProgress * 0.12 + uDockProgress * 0.08));
  vec3 bitangent = normalize(vec3(0.0, 1.0, -sin(pos.x * 0.3) * uMouseDeform * 0.28 + uHoverProgress * 0.08));
  vec3 computedNormal = normalize(cross(tangent, bitangent));

  vNormal = normalize(normalMatrix * computedNormal);
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vWave = wave + scrollWave + bendZ * 0.5 + hoverBulge;
  vMouseInfluence = mouseDeform + uHoverProgress * 0.45 + uDockProgress * 0.15;

  // Screen UV for refraction
  vec4 proj = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  vScreenUv = (proj.xy / proj.w) * 0.5 + 0.5;

  gl_Position = proj;
}
`;

export const liquidWarpFrag = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
uniform float uDockProgress;
uniform float uMouseVelocity;
uniform sampler2D uTexture;
uniform float uTextureEnabled;
uniform float uFoldProgress;
uniform float uScrollVelocity;
uniform float uRoundedRadius;
uniform float uHoverProgress;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWave;
varying float vMouseInfluence;
varying float vFold;
varying float vHover;
varying float vDock;
varying vec2 vScreenUv;

// Rounded box SDF 16:7
float roundedBoxSDF(vec2 centerPos, vec2 size, float radius){
  vec2 q = abs(centerPos) - size + radius;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

// Liquid glass normal map — organic fluid ripples
vec3 liquidNormal(vec2 uv, float time, float hover, float dock){
  vec2 p = uv * 3.5;
  float t = time * 0.45;

  float n1 = sin(p.x * 1.2 + t * 0.9 + hover * 1.2) * cos(p.y * 0.9 + t * 0.7);
  float n2 = cos(p.x * 0.8 + p.y * 1.1 + t * 0.6) * sin(p.y * 1.3 + t * 0.5 + dock * 0.8);
  float n3 = sin(length(p) * 1.1 - t * 1.2) * 0.6;

  float nx = n1 * 0.5 + n2 * 0.35 + n3 * 0.15;
  float ny = cos(p.x * 1.1 + t) * 0.4 + sin(p.y * 1.2 + t * 0.8) * 0.4;

  vec3 n = normalize(vec3(nx * (0.35 + hover * 0.25), ny * (0.35 + hover * 0.25), 1.0));
  return n;
}

vec3 chromaticAberration(sampler2D tex, vec2 uv, float intensity, float wave, float hover, float dock){
  float edge = abs(uv.x - 0.5) * 2.0;
  float aberration = intensity * (0.0016 + edge * 0.007 + abs(wave) * 0.0035 + vMouseInfluence * 0.0022 + hover * 0.003 + dock * 0.0015);

  float r = texture2D(tex, uv + vec2(aberration, 0.0)).r;
  float g = texture2D(tex, uv + vec2(aberration * 0.35, 0.0)).g;
  float b = texture2D(tex, uv - vec2(aberration, 0.0)).b;

  return vec3(r,g,b);
}

vec3 vibrantShowreel(vec2 uv, float time, float hover, float dock){
  vec2 p = uv * 2.0 - 1.0;
  vec3 base = vec3(0.965, 0.965, 0.975);

  float t = time * 0.22 + hover * 0.6 + dock * 0.3;

  // High-energy media: colorful 3D rollercoasters, blooming floral, cybernetic
  float a1 = sin((uv.x + t) * 2.4) * cos((uv.y + t * 0.65) * 2.1);
  float a2 = sin(uv.x * 6.8 + time * 0.75 + hover * 1.2) * cos(uv.y * 5.2 + time * 0.55);
  float a3 = cos(length(p) * 3.2 - time * 1.1 - hover * 0.8);
  float a4 = sin(uv.x * 2.0 + uv.y * 3.0 + t * 1.5) * 0.5 + 0.5;

  vec3 col1 = vec3(0.14, 0.14, 0.15) * (1.0 - smoothstep(0.0, 0.65, a1)) * (0.24 + hover * 0.08);
  vec3 col2 = vec3(0.97, 0.97, 0.985) * smoothstep(0.28, 0.92, a2) * 0.14;
  vec3 col3 = vec3(0.22, 0.36, 0.96) * a3 * (0.07 + hover * 0.04);
  vec3 col4 = vec3(0.98, 0.75, 0.22) * a4 * 0.04 * (1.0 + hover * 0.5);

  vec3 color = base + col1 + col2 + col3 + col4;

  // Blooming floral / rollercoaster blobs
  float bloom = sin(uv.x * 4.0 + t * 1.2) * cos(uv.y * 3.5 + t) * 0.5 + 0.5;
  bloom = pow(bloom, 2.2) * (0.06 + hover * 0.08);
  color += vec3(0.9, 0.3, 0.6) * bloom * 0.15;
  color += vec3(0.2, 0.85, 0.55) * (1.0 - bloom) * 0.06 * sin(t + uv.x * 2.0);

  float vignette = 1.0 - dot(p,p) * (0.09 + hover * 0.04);
  color *= vignette;

  float grain = fract(sin(dot(uv * time * 0.009, vec2(12.9898,78.233))) * 43758.5453) * 0.012 - 0.006;
  color += grain;

  return color;
}

void main(){
  vec2 uv = vUv;

  // Rounded 16:7 frame SDF
  vec2 centered = (uv - 0.5) * 2.0;
  centered.x *= 1.0;
  centered.y *= (16.0/7.0) * 0.5;

  float radius = uRoundedRadius;
  float dist = roundedBoxSDF(centered, vec2(1.0, 0.5), radius);
  float alpha = 1.0 - smoothstep(0.0, 0.018, dist);
  if(alpha < 0.01) discard;

  // Liquid glass normal
  vec3 fluidNormal = liquidNormal(uv, uTime, vHover, vDock);
  vec3 N = normalize(vNormal + fluidNormal * (0.28 + vHover * 0.22 + vDock * 0.1));
  vec3 V = normalize(cameraPosition - vWorldPosition);
  float NdotV = max(dot(N, V), 0.0);

  // High-refraction fresnel — liquid glass
  float fresnel = pow(1.0 - NdotV, 2.8) * (0.18 + vHover * 0.22 + vDock * 0.08);
  float refractionStrength = 0.035 + vHover * 0.025 + vWave * 0.015;

  // Refraction UV distortion
  vec2 refractedUv = uv + fluidNormal.xy * refractionStrength + vWave * 0.008;

  vec3 texColor;
  if(uTextureEnabled > 0.5){
    texColor = chromaticAberration(uTexture, refractedUv, 0.72 + vMouseInfluence * 1.0 + uScrollVelocity * 0.35 + vHover * 0.55, vWave + vHover * 0.22, vHover, vDock);
  } else {
    texColor = vibrantShowreel(refractedUv, uTime, vHover, vDock);
  }

  // Liquid overlay — viscous film
  float film = sin(uv.x * 8.0 + uTime * 1.1 + vHover * 1.5) * cos(uv.y * 6.0 + uTime * 0.9) * 0.5 + 0.5;
  film = pow(film, 3.0) * (0.04 + vHover * 0.06);
  texColor += vec3(0.3, 0.5, 1.0) * film * 0.35;
  texColor += fluidNormal.z * 0.04;

  // Wave shading
  texColor += vWave * 0.26;
  texColor += vMouseInfluence * 0.14;
  texColor += vHover * 0.22 * vec3(0.22, 0.36, 0.97);
  texColor -= vFold * 0.06 * (1.0 - uv.y);
  texColor += vDock * 0.08 * vec3(0.1, 0.15, 0.25) * (1.0 - uv.y);

  // Hover center brighten
  float hoverCenter = 1.0 - length((uv - 0.5) * 2.0) * 0.55;
  hoverCenter = clamp(hoverCenter, 0.0, 1.0);
  texColor += vHover * hoverCenter * 0.14;
  texColor += vDock * hoverCenter * 0.06;

  // Specular rim — sharp highlights for glossy royal blue harmony
  float specular = pow(NdotV, 18.0) * (0.12 + vHover * 0.18);
  texColor += specular * vec3(1.0);

  vec3 color = texColor + fresnel * vec3(1.0, 1.0, 1.05) * 0.9;

  // Dock darkens slightly for depth when small
  color *= 1.0 - vDock * 0.06 * (1.0 - hoverCenter);

  // Tone mapping
  color = color / (color + vec3(1.0));
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, alpha);
}
`;

export default {
  vertex: liquidWarpVert,
  fragment: liquidWarpFrag,
};
