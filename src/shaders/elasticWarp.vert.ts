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

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying float vWave;
varying float vMouseInfluence;
varying float vFold;

void main(){
  vUv = uv;

  vec3 pos = position;

  // Subtle elastic inertia per spec
  float scrollWave = sin(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35;
  float mouseWaveY = cos(pos.x * 0.3) * uMouseDeform;

  // Organic wave
  float waveX = sin(pos.x * 0.45 + uTime * 1.2);
  float waveY = cos(pos.y * 0.65 + uTime * 0.85);
  float wave = waveX * waveY * uWaveIntensity * 0.5;

  float mouseDist = length(pos.xy - uMouseTarget);
  float mouseDeform = smoothstep(3.5, 0.0, mouseDist) * uMouseVelocity;

  // Combine — subtle cloth
  pos.z += scrollWave + wave + mouseDeform * sin(uTime * 3.8 + pos.x * 0.5) * 0.38;
  pos.y += mouseWaveY + mouseDeform * 0.28 * sin(pos.x * 0.7 + uTime * 2.0) + wave * 0.12;

  // Drag rubber stretch
  float dragInfluence = smoothstep(4.5, 0.0, mouseDist);
  pos.x += uDragOffset * dragInfluence * 0.42;
  pos.z += abs(uDragOffset) * dragInfluence * 0.22 * sin(pos.x * 0.45);

  // Fold into curved arc on scroll — subtle
  float fold = uFoldProgress;
  vFold = fold;
  float arcX = pos.x;
  float arcCurve = sin(arcX * 0.14) * fold * 1.4;
  float arcZ = cos(arcX * 0.14) * fold * -0.9;
  pos.z += arcZ + arcCurve * 0.25;
  pos.y += arcCurve * 0.12;

  vec3 tangent = normalize(vec3(1.0, 0.0, cos(pos.x * 0.4 + uTime * 2.0) * uScrollVelocity * 0.35 * 0.35));
  vec3 bitangent = normalize(vec3(0.0, 1.0, -sin(pos.x * 0.3) * uMouseDeform * 0.25));
  vec3 computedNormal = normalize(cross(tangent, bitangent));

  vNormal = normalize(normalMatrix * computedNormal);
  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;
  vWave = wave + scrollWave;
  vMouseInfluence = mouseDeform;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

export default elasticWarpVert;
