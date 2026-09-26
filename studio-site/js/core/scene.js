/* =====================================================================
   CORE / SCENE
   One renderer, one scene, one camera rig, one loop.

   The camera never snaps: sections write *targets* into the global state,
   stages may override them while they are dominant, and the rig damps
   towards the result — which is what makes the whole page read as a single
   continuous space instead of a stack of animated blocks.
   ===================================================================== */
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

import { state, bus } from './state.js';
import { DEVICE, QUALITY, ASSETS } from './config.js';
import { MaterialLib, applyLiquidDisplacement } from './materials.js';
import { buildEnvironment } from './env.js';
import { Atmosphere } from './stages/atmosphere.js';
import { StageManager } from './stages/index.js';
import { clamp, damp } from './utils.js';

/* ------------------------------------------------------------------ lens pass */
const LensShader = {
  uniforms: {
    tDiffuse: { value: null },
    uTime: { value: 0 },
    uRes: { value: new THREE.Vector2(1, 1) },
    uCA: { value: 0 },
    uDistort: { value: 0 },
    uVignette: { value: 0.42 },
    uGrain: { value: 0.05 },
    uSweep: { value: 0 },
    uBlur: { value: 0 },
    uPortal: { value: 0 },
    uDark: { value: 0 }
  },
  vertexShader: /* glsl */`
    varying vec2 vUv;
    void main() { vUv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }
  `,
  fragmentShader: /* glsl */`
    uniform sampler2D tDiffuse;
    uniform float uTime, uCA, uDistort, uVignette, uGrain, uSweep, uBlur, uPortal, uDark;
    uniform vec2 uRes;
    varying vec2 vUv;

    vec2 warp(vec2 uv) {
      vec2 c = uv - 0.5;
      /* portal suck-in */
      float d = length(c);
      uv -= c * uPortal * smoothstep(0.95, 0.05, d) * 0.16;
      /* barrel distortion */
      c = uv - 0.5;
      float r2 = dot(c, c);
      return uv + c * r2 * uDistort * 0.42;
    }

    float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }

    void main() {
      vec2 uv = warp(vUv);
      vec2 c = uv - 0.5;
      float d = length(c);
      vec2 dir = d > 0.0001 ? c / d : vec2(0.0);

      float ca = uCA * 0.0042 * (0.25 + d * 1.5);
      vec3 col;
      col.r = texture2D(tDiffuse, clamp(uv + dir * ca, 0.0, 1.0)).r;
      col.g = texture2D(tDiffuse, clamp(uv, 0.0, 1.0)).g;
      col.b = texture2D(tDiffuse, clamp(uv - dir * ca, 0.0, 1.0)).b;

      /* motion smear — only while the user is actually moving */
      if (uBlur > 0.002) {
        vec3 acc = col;
        float wsum = 1.0;
        for (int i = 1; i <= 4; i++) {
          float f = float(i) * 0.0055 * uBlur;
          float wgt = 1.0 - float(i) * 0.19;
          acc += texture2D(tDiffuse, clamp(uv - dir * f, 0.0, 1.0)).rgb * wgt;
          wsum += wgt;
        }
        col = acc / wsum;
      }

      /* light sweep */
      float sw = exp(-pow((c.x * 0.85 + c.y * 0.55 - uSweep) * 4.6, 2.0));
      col += sw * step(0.001, uSweep) * (0.1 + uDark * 0.22) * vec3(1.0, 0.97, 0.93);

      /* vignette */
      col *= 1.0 - uVignette * smoothstep(0.32, 0.98, d);

      /* film grain (adaptive — see state.world.grain) */
      float g = hash(vUv * uRes + fract(uTime) * 91.7) - 0.5;
      col += g * uGrain * (0.5 + uDark * 0.9);

      gl_FragColor = vec4(max(col, 0.0), 1.0);
    }
  `
};

/* ------------------------------------------------------------------ world */
export const world = {
  renderer: null,
  scene: null,
  camera: null,
  composer: null,
  materials: null,
  atmosphere: null,
  stages: null,
  quality: QUALITY[DEVICE.tier],
  tier: DEVICE.tier,
  env: null,
  time: 0,
  frames: 0,
  ready: false,
  paused: false,
  renderMode: 'direct',
  lights: {},
  _disposed: false
};

const _look = new THREE.Vector3();
const _fogColor = new THREE.Color();

/* ------------------------------------------------------------------ init */
export async function initWorld(canvas, log) {
  if (!DEVICE.webgl) throw new Error('webgl-unavailable');
  const q = world.quality;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: q.msaa === 0,
    alpha: false,
    stencil: false,
    depth: true,
    powerPreference: 'high-performance',
    preserveDrawingBuffer: false
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, q.dpr));
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  renderer.setClearColor(0x000000, 1);
  renderer.shadowMap.enabled = !!q.shadows;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  if ('transmissionResolutionScale' in renderer) renderer.transmissionResolutionScale = q.tier >= 2 ? 0.75 : 0.5;
  world.renderer = renderer;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0xefede8, 0.012);
  world.scene = scene;

  const camera = new THREE.PerspectiveCamera(34, window.innerWidth / Math.max(1, window.innerHeight), 0.1, 400);
  camera.position.set(0.9, 0.15, 7.4);
  world.camera = camera;

  /* ---- image based lighting ---- */
  log && log('ibl', 'building');
  world.env = await buildEnvironment(renderer, msg => log && log('ibl', msg));
  scene.environment = world.env.texture;
  scene.environmentIntensity = 1.0;
  if (scene.environmentRotation) scene.environmentRotation.y = 0.35;

  /* ---- shared materials ---- */
  world.materials = new MaterialLib(world.env.texture, q);

  /* ---- global light rig (stages add their own accents) ---- */
  const key = new THREE.DirectionalLight(0xffffff, 1.35);
  key.position.set(4.5, 7, 5.5);
  const fill = new THREE.DirectionalLight(0xc9d8ff, 0.42);
  fill.position.set(-6, 1.5, -3.5);
  const bounce = new THREE.DirectionalLight(0xffd9c0, 0.24);
  bounce.position.set(0, -5, 2);
  scene.add(key, fill, bounce);
  world.lights = { key, fill, bounce };

  /* ---- atmosphere + stages ---- */
  log && log('world', 'atmosphere');
  world.atmosphere = new Atmosphere(world);
  world.stages = new StageManager(world);

  /* ---- post processing ---- */
  buildComposer(q);

  /* ---- optional real model ---- */
  await attachOptionalModel(log);

  world.ready = true;
  applyQuality(q, false);
  return world;
}

function buildComposer(q) {
  const renderer = world.renderer;
  if (!q.postFx) { world.composer = null; world.renderMode = 'direct'; return; }
  const w = window.innerWidth, h = window.innerHeight;
  const pr = renderer.getPixelRatio();
  const rt = new THREE.WebGLRenderTarget(Math.floor(w * pr), Math.floor(h * pr), {
    type: THREE.HalfFloatType,
    samples: q.msaa || 0,
    depthBuffer: true,
    stencilBuffer: false
  });
  const composer = new EffectComposer(renderer, rt);
  composer.setPixelRatio(pr);
  composer.setSize(w, h);

  const renderPass = new RenderPass(world.scene, world.camera);
  composer.addPass(renderPass);

  const bloom = new UnrealBloomPass(new THREE.Vector2(w, h), 0.2, 0.62, 3.1);
  composer.addPass(bloom);

  const lens = new ShaderPass(LensShader);
  lens.uniforms.uRes.value.set(w * pr, h * pr);
  composer.addPass(lens);

  const output = new OutputPass();
  composer.addPass(output);

  world.composer = composer;
  world.bloom = bloom;
  world.lens = lens;
  world.renderMode = 'composer';
}

async function attachOptionalModel(log) {
  /* If a real GLB is dropped into assets/3d/hero.glb it replaces the
     procedural figure. Failure is expected and silent. */
  try {
    const gltf = await new GLTFLoader().loadAsync(ASSETS.heroModel);
    const sculpture = world.stages.get('sculpture');
    if (sculpture && gltf && gltf.scene) {
      sculpture.attachModel(gltf.scene);
      log && log('model', 'hero.glb');
    }
  } catch (e) { /* procedural sculpture stays */ }
}

/* ------------------------------------------------------------------ quality */
export function applyQuality(q, force) {
  world.quality = q;
  const renderer = world.renderer;
  if (!renderer) return;
  const pr = Math.min(window.devicePixelRatio || 1, q.dpr);
  renderer.setPixelRatio(pr);
  renderer.setSize(window.innerWidth, window.innerHeight, false);
  renderer.shadowMap.enabled = !!q.shadows;
  renderer.shadowMap.needsUpdate = true;

  const needsComposer = !!q.postFx;
  const hasComposer = !!world.composer;
  if (needsComposer !== hasComposer || force) {
    if (world.composer) {
      if (world.bloom) world.bloom.dispose();
      world.composer.dispose();
      world.composer = null;
      world.bloom = null;
      world.lens = null;
    }
    buildComposer(q);
  }
  if (world.composer) {
    world.composer.setPixelRatio(pr);
    world.composer.setSize(window.innerWidth, window.innerHeight);
    world.lens.uniforms.uRes.value.set(window.innerWidth * pr, window.innerHeight * pr);
  }
  if (world.atmosphere) {
    world.atmosphere.dust.material.uniforms.uPixelRatio.value = pr;
    world.atmosphere.resize(window.innerWidth, window.innerHeight);
  }
}

export function setTier(tier) {
  tier = clamp(Math.round(tier), 0, 2);
  if (tier === world.tier) return;
  world.tier = tier;
  state.quality = tier;
  applyQuality(QUALITY[tier], false);
  bus.emit('quality', tier);
}

/* ------------------------------------------------------------------ resize */
export function resizeWorld() {
  const renderer = world.renderer;
  if (!renderer) return;
  const w = window.innerWidth, h = Math.max(1, window.innerHeight);
  DEVICE.width = w; DEVICE.height = h;
  renderer.setSize(w, h, false);
  world.camera.aspect = w / h;
  world.camera.updateProjectionMatrix();
  if (world.composer) {
    world.composer.setSize(w, h);
    const pr = renderer.getPixelRatio();
    world.lens.uniforms.uRes.value.set(w * pr, h * pr);
    if (world.bloom) world.bloom.setSize(w * pr, h * pr);
  }
  if (world.atmosphere) world.atmosphere.resize(w, h);
}

/* ------------------------------------------------------------------ frame */
export function renderFrame(dt) {
  if (!world.ready || world.paused || world._disposed) return;
  dt = clamp(dt, 0.0005, 0.06);
  world.time += dt;
  world.frames++;

  const q = world.quality;
  const w = state.world;
  const cam = state.camera;
  const m = state.mouse;

  /* --- context handed to every stage --- */
  const pg = state.page;
  const ctx = {
    dt,
    time: world.time,
    camera: world.camera,
    quality: q,
    heroAct: pg.heroAct || 0,
    reelOpen: pg.reelOpen || 0,
    line: pg.line || 0,
    workIndex: pg.workIndex !== undefined ? pg.workIndex : -1,
    serviceIndex: pg.serviceIndex || 0,
    carouselScroll: pg.carouselScroll || 0,
    focus: pg.focus || 0,
    pageProgress: pg.pageProgress || 0,
    converge: pg.converge || 0,
    spread: pg.spread || (state.route === '/lab' ? 13 : 11),
    labMode: state.route === '/lab' ? 1 : 0,
    dustOpacity: pg.dustOpacity,
    controlCamera: false
  };

  /* --- atmosphere first (it owns the trail FBO) --- */
  world.atmosphere.renderTrail(world.renderer);
  world.atmosphere.update(dt, ctx);

  /* --- stages --- */
  world.stages.update(dt, ctx);

  /* --- camera rig --- */
  const parallax = (0.25 + w.intensity * 0.5) * (DEVICE.touch ? 0.25 : 1);
  const px = m.sx * parallax + cam.offX;
  const py = m.sy * parallax * 0.6 + cam.offY;
  const push = state.absVelocity * 0.55;
  world.camera.position.set(
    cam.pos[0] + px,
    cam.pos[1] + py + Math.sin(world.time * 0.31) * 0.035,
    cam.pos[2] + cam.offZ - push
  );
  _look.set(
    cam.look[0] + m.sx * parallax * 0.45,
    cam.look[1] + m.sy * parallax * 0.3,
    cam.look[2]
  );
  world.camera.lookAt(_look);
  world.camera.rotation.z += cam.rollZ + state.velocity * 0.022 + Math.sin(world.time * 0.19) * 0.004;
  if (Math.abs(world.camera.fov - cam.fov) > 0.005) {
    world.camera.fov = cam.fov;
    world.camera.updateProjectionMatrix();
  }

  /* --- lights + fog follow the section --- */
  const li = 0.7 + w.lightIntensity * 0.55 + w.intensity * 0.5;
  world.lights.key.intensity = damp(world.lights.key.intensity, 1.5 * li, 3, dt);
  world.lights.fill.intensity = damp(world.lights.fill.intensity, 0.5 * (0.6 + w.dark * 0.9), 3, dt);
  world.lights.bounce.intensity = damp(world.lights.bounce.intensity, 0.26 * (0.5 + w.intensity), 3, dt);
  world.lights.key.color.setRGB(1, 0.985 - state.colors.accent[1] * 0.06, 0.97);

  _fogColor.setRGB(
    clamp(state.colors.skyA[0] * (2.62 - w.dark * 2.3), 0, 1),
    clamp(state.colors.skyA[1] * (2.62 - w.dark * 2.3), 0, 1),
    clamp(state.colors.skyA[2] * (2.62 - w.dark * 2.3), 0, 1)
  );
  world.scene.fog.color.copy(_fogColor);
  world.scene.fog.density = clamp(w.fog, 0, 0.14);
  world.scene.environmentIntensity = 0.55 + w.intensity * 0.5 + (1 - w.dark) * 0.45;
  world.renderer.toneMappingExposure = clamp(w.exposure, 0.4, 1.8);

  /* --- post --- */
  if (world.composer) {
    const bloomOn = q.bloom;
    world.bloom.enabled = bloomOn;
    if (bloomOn) {
      world.bloom.strength = damp(world.bloom.strength, w.bloom * 0.95, 4, dt);
      world.bloom.radius = 0.58;
      world.bloom.threshold = damp(world.bloom.threshold, 3.15 - w.dark * 2.35, 3, dt);
    }
    const lu = world.lens.uniforms;
    lu.uTime.value = world.time;
    lu.uCA.value = damp(lu.uCA.value, w.ca * (0.6 + state.absVelocity * 1.5), 6, dt);
    lu.uDistort.value = damp(lu.uDistort.value, w.distort * (0.5 + state.absVelocity), 5, dt);
    lu.uVignette.value = damp(lu.uVignette.value, 0.3 + w.dark * 0.42 + state.absVelocity * 0.1, 4, dt);
    lu.uGrain.value = damp(lu.uGrain.value, w.grain * 0.55, 5, dt);
    lu.uBlur.value = damp(lu.uBlur.value, clamp(state.absVelocity * 1.5 - 0.12, 0, 1) * (0.4 + w.dark * 0.6), 6, dt);
    lu.uPortal.value = damp(lu.uPortal.value, w.portal, 4, dt);
    lu.uSweep.value = w.sweep;
    lu.uDark.value = w.dark;
    world.composer.render(dt);
  } else {
    world.renderer.render(world.scene, world.camera);
  }

  /* grain overlay in the DOM mirrors the shader grain */
  document.documentElement.style.setProperty('--grain', (0.028 + w.grain * 0.55).toFixed(4));
  document.documentElement.style.setProperty('--vel', state.absVelocity.toFixed(3));
}

/* ------------------------------------------------------------------ lifecycle */
/**
 * Pre-compile shaders and render a few real frames before the curtain lifts,
 * so the first visible frame is not paying for program linking.
 */
export async function warmUp(frames = 3, progress) {
  if (!world.ready) return;
  try {
    if (world.renderer.compile) world.renderer.compile(world.scene, world.camera);
  } catch (e) { /* older/odd drivers — the frames below still warm things up */ }
  for (let i = 0; i < frames; i++) {
    try { renderFrame(1 / 60); } catch (err) { console.warn('[warmUp]', err); break; }
    if (progress) progress((i + 1) / frames);
    await new Promise(r => requestAnimationFrame(r));
  }
}

export function pauseWorld(on) { world.paused = on; }

export function setRouteStages(route) {
  if (!world.stages) return;
  world.stages.setRoute(route);
}

export function disposeWorld() {
  if (world._disposed) return;
  world._disposed = true;
  world.ready = false;
  try {
    if (world.stages) world.stages.disposeAll();
    if (world.atmosphere) world.atmosphere.dispose();
    if (world.materials) world.materials.dispose();
    if (world.composer) {
      if (world.bloom) world.bloom.dispose();
      world.composer.dispose();
    }
    if (world.env && world.env.dispose) world.env.dispose();
    world.scene.traverse(o => {
      if (o.geometry) o.geometry.dispose();
    });
    Object.values(world.lights).forEach(l => l.dispose && l.dispose());
    world.renderer.dispose();
    world.renderer.forceContextLoss && world.renderer.forceContextLoss();
  } catch (e) {
    console.warn('[world] dispose', e);
  }
}

window.addEventListener('beforeunload', disposeWorld, { once: true });
