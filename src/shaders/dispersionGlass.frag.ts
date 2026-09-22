/**
 * LUSION CORE PILLAR 2 — True Physical Dispersion & Caustic Material
 * Custom extended MeshPhysicalMaterial mimicking multi-layer dispersion glass
 * roughness 0.03, metalness 0.05, transmission 0.99, ior 1.54, thickness 3.2
 * Spectral chromatic dispersion RGB split + Fresnel pow(1-dot(N,V),3)
 * Violet/cyan caustics at grazing angles
 */

export const dispersionGlassFrag = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
uniform vec2 uMousePos;
uniform float uMouseVelocity;
uniform vec2 uResolution;

uniform float uRoughness; // 0.03
uniform float uMetalness; // 0.05
uniform float uTransmission; // 0.99
uniform float uIor; // 1.54
uniform float uThickness; // 3.2
uniform float uChromaticDispersion; // 0.12
uniform vec3 uColorA; // violet #7a2bff
uniform vec3 uColorB; // cyan #00f0ff
uniform vec3 uColorC; // amber
uniform vec3 uLightPos1;
uniform vec3 uLightPos2;

varying vec3 vNormal;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec3 vEyeVector;
varying float vDistortion;
varying float vFresnel;
varying float vMouseInfluence;
varying vec2 vUv;
varying vec3 vTangent;
varying vec3 vBitangent;

// Random + grain
float random(vec2 st){
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}
float random3(vec3 c){
  return fract(sin(dot(c.xyz, vec3(12.9898,78.233, 53.539))) * 43758.5453);
}

// Thin-film iridescence with spectral interference
vec3 thinFilmIridescence(float cosTheta, float thickness, float time){
  // Multi-layer interference: phase = 2 * thickness * cosTheta * 2pi / wavelength
  // Approximate with RGB wavelengths 650nm, 530nm, 450nm
  float t = thickness * 2.2;
  float phaseR = cosTheta * t * 12.0 + time * 0.25;
  float phaseG = cosTheta * t * 14.6 + time * 0.33 + 1.1;
  float phaseB = cosTheta * t * 17.8 + time * 0.21 + 2.3;

  vec3 violet = vec3(0.48, 0.16, 1.0); // #7a2bff approx
  vec3 cyan = vec3(0.0, 0.94, 1.0);
  vec3 amber = vec3(1.0, 0.72, 0.18);
  vec3 magenta = vec3(1.0, 0.2, 0.8);

  float r = sin(phaseR) * 0.5 + 0.5;
  float g = sin(phaseG) * 0.5 + 0.5;
  float b = sin(phaseB) * 0.5 + 0.5;

  vec3 irid = vec3(r,g,b);
  // Remap to brand palette
  irid = mix(violet, cyan, g);
  irid = mix(irid, amber, r * 0.35);
  irid = mix(irid, magenta, b * 0.18 * cosTheta);

  // Fresnel boost at grazing
  float fresBoost = pow(1.0 - cosTheta, 2.0);
  irid += fresBoost * vec3(0.3,0.5,1.0) * 0.25;

  return irid;
}

// Caustic scattering — light focusing through curved glass
float causticPattern(vec3 pos, vec3 lightDir, vec3 normal, float time){
  // Simulate caustic via noise distorted by curvature
  float NdotL = max(dot(normal, lightDir), 0.0);
  vec3 refracted = refract(-lightDir, normal, 1.0/1.54);
  float focus = pow(NdotL, 3.0) * 1.5;
  // Animated noise for watery caustics
  float causticNoise = sin(pos.x * 8.0 + time*0.7) * cos(pos.y * 6.5 + time*0.5) * sin(pos.z * 9.0 + time*0.6);
  causticNoise = pow(abs(causticNoise), 1.8);
  return focus * causticNoise * 0.8;
}

// Spectral dispersion — split RGB during refraction
vec3 spectralDispersion(vec3 baseColor, vec3 normal, vec3 viewDir, float dispersion, float fresnel){
  // IOR varies per wavelength: R 1.51, G 1.54, B 1.57
  float iorR = 1.51;
  float iorG = 1.54;
  float iorB = 1.57;

  vec3 refractedR = refract(-viewDir, normal, 1.0/iorR);
  vec3 refractedG = refract(-viewDir, normal, 1.0/iorG);
  vec3 refractedB = refract(-viewDir, normal, 1.0/iorB);

  // Chromatic offset based on refraction divergence
  float divergenceRG = length(refractedR - refractedG);
  float divergenceGB = length(refractedG - refractedB);

  vec3 dispersed = baseColor;
  dispersed.r += divergenceRG * dispersion * fresnel * 2.5;
  dispersed.g += (divergenceRG + divergenceGB) * dispersion * fresnel * 0.5;
  dispersed.b -= divergenceGB * dispersion * fresnel * 2.2;

  // Add violet/cyan fringes at grazing angles per spec
  float fringe = fresnel * dispersion * 3.0;
  dispersed += vec3(0.35, 0.12, 0.85) * fringe * 0.6; // violet fringe
  dispersed += vec3(0.05, 0.85, 1.0) * fringe * 0.4;  // cyan fringe

  return dispersed;
}

void main(){
  vec3 N = normalize(vWorldNormal);
  vec3 V = normalize(-vEyeVector);
  vec3 L1 = normalize(uLightPos1 - vWorldPosition);
  vec3 L2 = normalize(uLightPos2 - vWorldPosition);
  vec3 H1 = normalize(L1 + V);
  vec3 H2 = normalize(L2 + V);

  float NdotV = max(dot(N, V), 0.0);
  float NdotL1 = max(dot(N, L1), 0.0);
  float NdotL2 = max(dot(N, L2), 0.0);
  float NdotH1 = max(dot(N, H1), 0.0);
  float NdotH2 = max(dot(N, H2), 0.0);

  // Fresnel equation pow(1-dot(N,V),3) per spec
  float fresnel = pow(1.0 - NdotV, 3.0);
  float fresnelSoft = pow(1.0 - NdotV, 1.5);
  float fresnelSharp = pow(1.0 - NdotV, 5.0);

  // Thickness with distortion
  float thickness = uThickness * (1.0 + vDistortion * 0.35 + vMouseInfluence * 0.15);
  float thicknessAbsorption = exp(-thickness * 0.18);

  // Base glass color — almost clear with subtle tint
  vec3 baseColor = vec3(0.98, 0.99, 1.0);
  baseColor += vDistortion * 0.06;
  baseColor *= thicknessAbsorption;

  // Iridescence
  vec3 iridescence = thinFilmIridescence(NdotV, thickness, uTime);
  vec3 color = mix(baseColor, iridescence, fresnel * 0.88);

  // --- True physical dispersion ---
  float dispersion = uChromaticDispersion; // 0.12
  color = spectralDispersion(color, N, V, dispersion, fresnel);

  // --- Caustic scattering ---
  float caustic1 = causticPattern(vWorldPosition, L1, N, uTime);
  float caustic2 = causticPattern(vWorldPosition * 1.3 + vec3(2.1), L2, N, uTime * 1.2) * 0.7;

  vec3 causticColor1 = vec3(0.95, 0.98, 1.0) * caustic1 * 0.9;
  vec3 causticColor2 = vec3(0.48, 0.16, 1.0) * caustic2 * 0.5;
  vec3 causticColor3 = vec3(0.0, 0.94, 1.0) * caustic2 * 0.35;

  vec3 caustics = causticColor1 + causticColor2 + causticColor3;

  // Core caustics luminance for bloom threshold 0.85
  float luminance = dot(caustics, vec3(0.299, 0.587, 0.114));
  float bloomBoost = smoothstep(0.85, 1.2, luminance) * 1.4;

  // --- Physical shading ---
  float roughness = uRoughness; // 0.03
  float metalness = uMetalness; // 0.05
  float shininess = (1.0 - roughness) * 256.0 + 8.0;

  float spec1 = pow(NdotH1, shininess) * (1.0 + metalness);
  float spec2 = pow(NdotH2, shininess * 0.7) * 0.6;

  vec3 specular = vec3(1.0, 0.99, 0.97) * spec1 * 1.8 + vec3(0.6, 0.8, 1.0) * spec2 * 0.8;

  // Transmission 0.99 — almost total transparency
  float transmission = uTransmission;
  vec3 transmitted = baseColor * thicknessAbsorption * transmission;
  transmitted += caustics * transmission * 0.5;

  // Mix transmission
  color = mix(color, transmitted, 0.32);

  // Add caustics & specular
  color += caustics * 0.75;
  color += specular;
  color += bloomBoost * vec3(1.0, 0.95, 0.9) * 0.6;

  // Edge glow liquid
  color += fresnel * vec3(0.45, 0.65, 1.0) * 0.28;
  color += fresnelSharp * vec3(0.8, 0.4, 1.0) * 0.15;

  // Mouse influence glow
  float mouseGlow = vMouseInfluence * 0.6;
  color += mouseGlow * vec3(0.15, 0.85, 1.0);
  color += mouseGlow * fresnel * vec3(0.6, 0.3, 1.0) * 0.4;

  // Scroll-based intensity
  float scrollGlow = uScrollProgress * 0.18;
  color += scrollGlow * iridescence * 0.35;
  color += smoothstep(0.75, 1.0, uScrollProgress) * vec3(0.48,0.16,1.0) * 0.25;

  // Roughness variation for liquid gloss
  float microRough = random(vUv * uTime * 0.02) * roughness * 0.5;
  color -= microRough * 0.1;

  // --- Micro cinematic film grain 0.04 to eliminate banding ---
  float grain = random(vUv * uTime * 0.08) * 0.04 - 0.02;
  float grainLuma = random(vUv * 1.7 + uTime*0.03) * 0.015;
  color += grain + grainLuma;

  // Vignette soft
  vec2 uvScreen = gl_FragCoord.xy / uResolution;
  float vignette = 1.0 - dot(uvScreen - 0.5, uvScreen - 0.5) * 0.35;
  color *= vignette;

  // Tone mapping — ACES approx + gamma
  color = color / (color + vec3(1.0));
  color = pow(color, vec3(0.4545));

  // Alpha — transmission 0.99 => high transparency but Fresnel holds edge
  float alpha = 0.86 + fresnel * 0.14;
  alpha *= (0.88 + transmission * 0.12);
  alpha = mix(alpha, 0.96, smoothstep(0.75, 1.0, uScrollProgress));
  alpha = clamp(alpha, 0.0, 1.0);

  // Premultiplied alpha for additive blending safety
  gl_FragColor = vec4(color * alpha, alpha);
}
`;

export default dispersionGlassFrag;
