/**
 * CLEAN LUSION — Elastic Warp Fragment
 * Rounded horizontal showcase frame 16:7, dynamic media window, chromatic aberration on warped edges
 * No debug, clean production
 */

export const elasticWarpFrag = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
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

// Rounded rectangle SDF for showcase frame 16:7
float roundedBoxSDF(vec2 centerPos, vec2 size, float radius){
  vec2 q = abs(centerPos) - size + radius;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - radius;
}

vec3 chromaticAberration(sampler2D tex, vec2 uv, float intensity, float wave){
  float edge = abs(uv.x - 0.5) * 2.0;
  float aberration = intensity * (0.0018 + edge * 0.006 + abs(wave) * 0.003 + vMouseInfluence * 0.002);

  float r = texture2D(tex, uv + vec2(aberration, 0.0)).r;
  float g = texture2D(tex, uv).g;
  float b = texture2D(tex, uv - vec2(aberration, 0.0)).b;

  return vec3(r,g,b);
}

vec3 showreelTexture(vec2 uv, float time){
  // High-energy looping creative 3D renders simulation — colorful WebGL textures per spec
  // Clean, no debug text
  vec2 p = uv * 2.0 - 1.0;
  vec3 base = vec3(0.965, 0.965, 0.975); // #f6f6f8 light

  float t = time * 0.18;

  // Dynamic colorful renders — abstract motion
  float a1 = sin((uv.x + t) * 2.2) * cos((uv.y + t * 0.6) * 2.0);
  float a2 = sin(uv.x * 6.5 + time * 0.7) * cos(uv.y * 5.0 + time * 0.5);
  float a3 = cos(length(p) * 3.0 - time * 1.0);

  // Rich gradient showreel
  vec3 col1 = vec3(0.15, 0.15, 0.16) * (1.0 - smoothstep(0.0, 0.6, a1)) * 0.22;
  vec3 col2 = vec3(0.96, 0.96, 0.98) * smoothstep(0.3, 0.9, a2) * 0.12;
  vec3 col3 = vec3(0.22, 0.35, 0.95) * a3 * 0.06; // subtle blue hint for blue spline harmony

  vec3 color = base + col1 + col2 + col3;

  // Vignette for depth
  float vignette = 1.0 - dot(p,p) * 0.08;
  color *= vignette;

  // Subtle film grain for high-res feel
  float grain = fract(sin(dot(uv * time * 0.008, vec2(12.9898,78.233))) * 43758.5453) * 0.01 - 0.005;
  color += grain;

  return color;
}

void main(){
  vec2 uv = vUv;

  // Rounded horizontal showcase frame aspect ~16:7 per spec
  // SDF for rounded corners
  vec2 size = vec2(0.5, 0.5 * (7.0/16.0) * 2.0); // aspect 16:7
  // Actually use full UV 0..1 mapped to -1..1
  vec2 centered = (uv - 0.5) * 2.0;
  // Scale to aspect
  centered.x *= 1.0;
  centered.y *= (16.0/7.0) * 0.5;

  float radius = 0.18; // rounded corners
  float dist = roundedBoxSDF(centered, vec2(1.0, 0.5), radius);
  float alpha = 1.0 - smoothstep(0.0, 0.02, dist);

  // If outside rounded frame, discard or blend to background #f6f6f8
  if(alpha < 0.01) discard;

  vec3 texColor;
  if(uTextureEnabled > 0.5){
    texColor = chromaticAberration(uTexture, uv, 0.65 + vMouseInfluence * 0.9 + uScrollVelocity * 0.3 + vHover * 0.5, vWave + vHover * 0.2);
  } else {
    texColor = showreelTexture(uv, uTime);
  }

  // Studio soft lighting
  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPosition);
  float NdotV = max(dot(N, V), 0.0);
  float fresnel = pow(1.0 - NdotV, 2.0) * (0.1 + vHover * 0.15);

  // Wave shading + hover glow
  texColor += vWave * 0.22;
  texColor += vMouseInfluence * 0.12;
  texColor += vHover * 0.18 * vec3(0.22, 0.35, 0.95); // blue glow on hover
  texColor -= vFold * 0.05 * (1.0 - uv.y);

  // Hover brightens center
  float hoverCenter = 1.0 - length((uv - 0.5) * 2.0) * 0.5;
  hoverCenter = clamp(hoverCenter, 0.0, 1.0);
  texColor += vHover * hoverCenter * 0.12;

  vec3 color = texColor + fresnel * vec3(1.0);

  // Tone mapping clean
  color = color / (color + vec3(1.0));
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, alpha);
}
`;

export default elasticWarpFrag;
