/**
 * CLEAN LUSION — Elastic Warp Vertex
 * PlaneGeometry(16, 7, 80, 40) rounded showcase frame
 * Subtle cloth/mesh wave physics, scroll + drag inertia
 * No debug, clean production
 */

export const elasticWarpVert = /* glsl */ `
precision highp float;

uniform float uTime;
uniform float uScrollVelocity;
uniform float uScrollProgress;
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

void main(){
  vUv = uv;

  vec3 pos = position;

  // Subtle elastic inertia per spec
  float scrollWave = sin(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35;
  float mouseWaveY = cos(pos.x * 0.3) * uMouseDeform;

  // Organic wave + hover boost
  float waveX = sin(pos.x * 0.45 + uTime * 1.2 + uHoverProgress * 1.2);
  float waveY = cos(pos.y * 0.65 + uTime * 0.85 + uHoverProgress * 0.8);
  float wave = waveX * waveY * (uWaveIntensity + uHoverProgress * 0.35) * 0.5;

  float mouseDist = length(pos.xy - uMouseTarget);
  float mouseDeform = smoothstep(3.5, 0.0, mouseDist) * (uMouseVelocity + uHoverProgress * 0.9);

  // Hover adds extra bulge in center
  float hoverDist = length(pos.xy);
  float hoverBulge = smoothstep(5.5, 0.0, hoverDist) * uHoverProgress * 0.45 * sin(uTime * 2.2 + pos.x * 0.6);

  // Combine — subtle cloth + hover
  pos.z += scrollWave + wave + mouseDeform * sin(uTime * 3.8 + pos.x * 0.5) * 0.38 + hoverBulge;
  pos.y += mouseWaveY + mouseDeform * 0.28 * sin(pos.x * 0.7 + uTime * 2.0) + wave * 0.12 + hoverBulge * 0.25;

  // Drag rubber stretch
  float dragInfluence = smoothstep(4.5, 0.0, mouseDist);
  pos.x += uDragOffset * dragInfluence * 0.42;
  pos.z += abs(uDragOffset) * dragInfluence * 0.22 * sin(pos.x * 0.45);

  // Hover stretch X
  pos.x += uHoverProgress * sin(pos.y * 0.8 + uTime * 1.5) * 0.08;
  pos.z += uHoverProgress * cos(pos.x * 0.5 + uTime) * 0.12;

  // Fold into curved arc on scroll — subtle
  float fold = uFoldProgress;
  vFold = fold;
  vHover = uHoverProgress;
  float arcX = pos.x;
  float arcCurve = sin(arcX * 0.14) * fold * 1.4;
  float arcZ = cos(arcX * 0.14) * fold * -0.9;
  pos.z += arcZ + arcCurve * 0.25;
  pos.y += arcCurve * 0.12;

  vec3 tangent = normalize(vec3(1.0, 0.0, cos(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35 * 0.35 + uHoverProgress * 0.1));
  vec3 bitangent = normalize(vec3(0.0, 1.0, -sin(pos.x * 0.3) * uMouseDeform * 0.25));
  vec3 computedNormal = normalize(cross(tangent, bitangent));

  vNormal = normalize(normalMatrix * computedNormal);
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vWave = wave + scrollWave + hoverBulge;
  vMouseInfluence = mouseDeform + uHoverProgress * 0.4;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export default elasticWarpVert;
