/**
 * LUSION HOMEPAGE — Elastic Warp Vertex Shader
 * Handles scroll inertia and mouse hydrodynamic drag
 * Exact formulas per spec:
 * pos.z += sin(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35;
 * pos.y += cos(pos.x * 0.3) * uMouseDeform;
 * Plus full production extras: wave, fold, drag rubber
 */

export const elasticWarpVert = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollVelocity; // scroll inertia 0..3
uniform float uScrollProgress; // 0..1
uniform vec2 uMouseTarget; // world XY
uniform float uMouseDeform; // smoothstep(3.5,0,dist)*velocity
uniform float uMouseVelocity;
uniform float uDragOffset;
uniform float uFoldProgress; // 0 flat, 1 curved arc
uniform float uWaveIntensity;
uniform vec2 uResolution;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWave;
varying float vMouseInfluence;
varying float vFold;
varying float vScrollVel;

// Simplex noise 2D for organic
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

  // --- Core elastic warp per spec ---
  // pos.z += sin(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35;
  // pos.y += cos(pos.x * 0.3) * uMouseDeform;
  float scrollWave = sin(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35;
  float mouseWaveY = cos(pos.x * 0.3) * uMouseDeform;

  // Extended wave for cloth realism
  float waveX = sin(pos.x * 0.52 + uTime * 1.45);
  float waveY = cos(pos.y * 0.78 + uTime * 0.92);
  float wave = waveX * waveY * uWaveIntensity * 0.6;
  float microWave = snoise(vec2(pos.x * 0.35 + uTime * 0.3, pos.y * 0.4 + uTime * 0.2)) * 0.14 * uWaveIntensity;

  // Mouse proximity
  float mouseDist = length(pos.xy - uMouseTarget);
  float mouseDeform = smoothstep(3.8, 0.0, mouseDist) * uMouseVelocity;

  // Combine per spec + extras
  pos.z += scrollWave + wave + microWave + mouseDeform * sin(uTime * 4.2 + pos.x * 0.6) * 0.45;
  pos.y += mouseWaveY + mouseDeform * 0.32 * sin(pos.x * 0.8 + uTime * 2.2) + wave * 0.18;

  // Drag rubber — stretch like soft rubber/cloth
  float dragInfluence = smoothstep(4.8, 0.0, mouseDist);
  pos.x += uDragOffset * dragInfluence * 0.48;
  pos.z += abs(uDragOffset) * dragInfluence * 0.28 * sin(pos.x * 0.5);

  // Fold/unfold into curved arc on scroll
  float fold = uFoldProgress;
  vFold = fold;
  float arcX = pos.x;
  float arcCurve = sin(arcX * 0.17) * fold * 1.9;
  float arcZ = cos(arcX * 0.17) * fold * -1.25;
  pos.z += arcZ + arcCurve * 0.32;
  pos.y += arcCurve * 0.16;

  // Scroll stretch viscous
  float scrollStretch = uScrollProgress * 0.55;
  pos.y *= 1.0 + scrollStretch * 0.12 * sin(pos.x * 0.22 + uTime * 0.28);

  // Normal recalculation
  vec3 tangent = normalize(vec3(1.0, 0.0, cos(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35 * 0.4));
  vec3 bitangent = normalize(vec3(0.0, 1.0, -sin(pos.x * 0.3) * uMouseDeform * 0.3));
  vec3 computedNormal = normalize(cross(tangent, bitangent));

  vNormal = normalize(normalMatrix * computedNormal);
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vWave = wave + scrollWave;
  vMouseInfluence = mouseDeform + uMouseDeform;
  vScrollVel = uScrollVelocity;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export const elasticWarpFrag = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollProgress;
uniform float uMouseVelocity;
uniform vec2 uMouseTarget;
uniform vec2 uResolution;
uniform sampler2D uTexture;
uniform float uTextureEnabled;
uniform float uFoldProgress;
uniform float uScrollVelocity;

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWave;
varying float vMouseInfluence;
varying float vFold;
varying float vScrollVel;

vec3 chromaticAberration(sampler2D tex, vec2 uv, float intensity, float wave){
  float edge = abs(uv.x - 0.5) * 2.0;
  float aberration = intensity * (0.0025 + edge * 0.009 + abs(wave) * 0.005 + vScrollVel * 0.002);

  float r = texture2D(tex, uv + vec2(aberration, 0.0)).r;
  float g = texture2D(tex, uv).g;
  float b = texture2D(tex, uv - vec2(aberration, 0.0)).b;

  vec3 color = vec3(r,g,b);
  float fringe = smoothstep(0.25, 0.85, abs(wave) + vMouseInfluence * 0.6);
  color.r += fringe * 0.035 * edge;
  color.b += fringe * 0.055 * edge;
  return color;
}

vec3 showreelTexture(vec2 uv, float time){
  vec2 p = uv * 2.0 - 1.0;
  vec3 base = vec3(0.973, 0.973, 0.976); // #f7f7f9

  float t = time * 0.12;
  float pat1 = sin((uv.x + t) * 2.8) * cos((uv.y + t * 0.65) * 2.2) * 0.5 + 0.5;
  float pat2 = sin(uv.x * 7.0 + time * 0.9) * 0.5 + 0.5;
  float pat3 = cos(length(p) * 3.5 - time * 1.1) * 0.5 + 0.5;

  vec3 reel1 = vec3(0.07, 0.07, 0.08) * (1.0 - smoothstep(0.0, 0.55, pat1));
  vec3 reel2 = vec3(0.96, 0.96, 0.97) * smoothstep(0.45, 0.92, pat2) * 0.14;
  vec3 reel3 = vec3(0.18, 0.18, 0.2) * pat3 * 0.07;

  vec3 color = base + reel1 * 0.28 + reel2 + reel3;

  // Video scanline
  float scan = sin(uv.y * 900.0 + time * 6.0) * 0.012 + 1.0;
  color *= scan;

  // Vignette
  float vignette = 1.0 - dot(p,p) * 0.1;
  color *= vignette;

  return color;
}

void main(){
  vec2 uv = vUv;

  vec3 texColor;
  if(uTextureEnabled > 0.5){
    texColor = chromaticAberration(uTexture, uv, 0.85 + vMouseInfluence * 1.3 + vScrollVel * 0.4, vWave);
  } else {
    texColor = showreelTexture(uv, uTime);
  }

  vec3 N = normalize(vNormal);
  vec3 V = normalize(cameraPosition - vWorldPosition);
  vec3 L = normalize(vec3(0.55, 0.85, 0.6));

  float NdotL = max(dot(N, L), 0.0);
  float NdotV = max(dot(N, V), 0.0);

  float diffuse = NdotL * 0.55 + 0.45;
  float fresnel = pow(1.0 - NdotV, 2.3) * 0.16;

  float waveShade = vWave * 0.32;
  texColor += waveShade;

  float mouseGlow = vMouseInfluence * 0.22;
  texColor += mouseGlow * 0.14;

  float foldShadow = vFold * 0.07 * (1.0 - uv.y);
  texColor -= foldShadow;

  // Scroll velocity highlight
  texColor += vScrollVel * 0.04 * vec3(1.0);

  vec3 color = texColor * diffuse + fresnel;

  float grain = fract(sin(dot(uv * uTime * 0.009, vec2(12.9898,78.233))) * 43758.5453) * 0.012 - 0.006;
  color += grain;

  color = color / (color + vec3(1.0));
  color = pow(color, vec3(0.4545));

  gl_FragColor = vec4(color, 1.0);
}
`;

export default {
  vertex: elasticWarpVert,
  fragment: elasticWarpFrag,
};
