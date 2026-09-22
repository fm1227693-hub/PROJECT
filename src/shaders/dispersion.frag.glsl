// Lusion Signature - Optical Chromatic Dispersion & Physical Sheen
// Material: roughness 0.04, metalness 0.1, transmission 0.98, ior 1.52, thickness 2.4, dispersion 0.08
// Iridescent thin-film: violet #7928ca, cyan #00f0ff, amber

precision highp float;

uniform float uTime;
uniform vec2 uMousePos;
uniform float uMouseVelocity;
uniform float uScrollProgress;
uniform vec3 uColorA; // violet #7928ca
uniform vec3 uColorB; // cyan #00f0ff
uniform vec3 uColorC; // amber
uniform float uRoughness;
uniform float uMetalness;
uniform float uTransmission;
uniform float uIor;
uniform float uThickness;
uniform float uDispersion;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vEyeVector;
varying float vDistortion;
varying float vFresnel;
varying vec2 vUv;

// Random for film grain
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

// Thin-film iridescence
vec3 thinFilmIridescence(float cosTheta, float thickness) {
  // Multi-angle specular shifting
  float phase = cosTheta * thickness * 8.0 + uTime * 0.3;
  vec3 violet = vec3(0.4745, 0.157, 0.792); // #7928ca
  vec3 cyan = vec3(0.0, 0.941, 1.0);        // #00f0ff
  vec3 amber = vec3(1.0, 0.72, 0.18);
  
  // Interference pattern
  float t1 = sin(phase) * 0.5 + 0.5;
  float t2 = sin(phase * 1.3 + 1.5) * 0.5 + 0.5;
  float t3 = sin(phase * 0.7 + 2.8) * 0.5 + 0.5;
  
  vec3 irid = mix(violet, cyan, t1);
  irid = mix(irid, amber, t2 * 0.4);
  irid = mix(irid, vec3(1.0), t3 * 0.15);
  
  return irid;
}

void main() {
  vec3 N = normalize(vNormal);
  vec3 V = normalize(-vEyeVector); // view direction
  vec3 L = normalize(vec3(0.8, 1.2, 0.6)); // key light
  vec3 H = normalize(L + V);
  
  float NdotV = max(dot(N, V), 0.0);
  float NdotL = max(dot(N, L), 0.0);
  float NdotH = max(dot(N, H), 0.0);
  
  // --- Fresnel for edge glow ---
  float fresnel = pow(1.0 - NdotV, 3.0);
  float fresnelSoft = pow(1.0 - NdotV, 1.5);
  
  // --- Iridescent thin-film interference ---
  float filmThickness = uThickness * (1.0 + vDistortion * 0.3);
  vec3 iridescence = thinFilmIridescence(NdotV, filmThickness);
  
  // --- Base glass color with transmission ---
  vec3 baseColor = vec3(0.97, 0.98, 1.0);
  // Tint based on distortion
  baseColor += vDistortion * 0.08;
  
  // Mix base with iridescence based on fresnel
  vec3 color = mix(baseColor, iridescence, fresnel * 0.85);
  
  // --- Chromatic Aberration / Dispersion 0.08 ---
  // Rainbow refraction fringes at edge grazing angles per spec
  float dispersion = uDispersion * fresnel;
  // Simulate spectral split: R refracts less, B more
  vec3 dispersionOffset = vec3(dispersion * 0.6, 0.0, -dispersion * 0.6);
  color.r += dispersionOffset.r * (1.0 + vDistortion);
  color.b += dispersionOffset.b * (1.0 + vDistortion);
  // Extra cyan/violet fringing
  color += vec3(0.04, 0.02, 0.08) * fresnel * sin(vUv.y * 20.0 + uTime) * 0.1;
  
  // --- Physical Sheen ---
  // Roughness 0.04 => liquid gloss finish, very sharp specular
  float roughness = uRoughness; // 0.04
  float shininess = (1.0 - roughness) * 128.0 + 16.0;
  float specularPower = pow(NdotH, shininess);
  float specular = specularPower * (1.0 + uMetalness * 0.5);
  
  // Multi-point studio lighting caustics
  vec3 lightColor1 = vec3(0.9, 0.95, 1.0);
  vec3 lightColor2 = vec3(0.474, 0.157, 0.792) * 0.6;
  vec3 lightColor3 = vec3(0.0, 0.941, 1.0) * 0.5;
  
  float caustic1 = pow(NdotL, 2.0) * 0.8;
  float caustic2 = pow(max(dot(N, normalize(vec3(-0.5, 0.8, 0.3))), 0.0), 3.0) * 0.4;
  float caustic3 = pow(max(dot(N, normalize(vec3(0.3, -0.6, 0.8))), 0.0), 4.0) * 0.3;
  
  vec3 caustics = lightColor1 * caustic1 + lightColor2 * caustic2 + lightColor3 * caustic3;
  
  // Core caustics luminance for bloom threshold 0.85
  float coreLuminance = dot(caustics, vec3(0.299, 0.587, 0.114));
  float bloomBoost = smoothstep(0.85, 1.0, coreLuminance) * 1.2;
  
  // --- Transmission 0.98 ---
  float transmission = uTransmission; // 0.98
  // Simulate thickness absorption
  float thicknessFactor = exp(-filmThickness * 0.15);
  vec3 transmitted = baseColor * thicknessFactor * transmission;
  
  // Final composition
  color = mix(color, transmitted, 0.3);
  color += caustics * 0.6;
  color += specular * vec3(1.0, 0.98, 0.95) * 1.5;
  color += bloomBoost;
  
  // Edge glow for liquid
  color += fresnel * vec3(0.4, 0.6, 1.0) * 0.25;
  
  // Mouse interaction glow
  float mouseDist = length(vWorldPosition.xy - uMousePos);
  float mouseGlow = smoothstep(2.8, 0.0, mouseDist) * uMouseVelocity * 0.5;
  color += mouseGlow * vec3(0.2, 0.8, 1.0);
  
  // Scroll-based intensity shift
  float scrollGlow = uScrollProgress * 0.15;
  color += scrollGlow * iridescence * 0.3;
  
  // --- Micro cinematic film grain alpha 0.04 ---
  float grain = random(vUv * uTime * 0.05) * 0.04 - 0.02;
  color += grain;
  
  // Tone mapping - ACES approx
  color = color / (color + vec3(1.0));
  color = pow(color, vec3(0.4545)); // gamma
  
  // Alpha based on transmission + fresnel
  float alpha = 0.82 + fresnel * 0.18;
  alpha *= (0.9 + transmission * 0.1);
  // Fade during ring phase
  alpha = mix(alpha, 0.95, smoothstep(0.75, 1.0, uScrollProgress));
  
  gl_FragColor = vec4(color, alpha);
}
