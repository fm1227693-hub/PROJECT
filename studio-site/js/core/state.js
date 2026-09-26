/* =====================================================================
   CORE / STATE
   One global visual state that every section writes into and the WebGL
   world reads from. Sections never touch the renderer directly — they
   set *targets*; the engine damps towards them each frame, which is what
   makes the whole page feel like a single continuous physical space.
   ===================================================================== */
import { clamp, damp, lerp, hexToRgb } from './utils.js';
import { SECTIONS, DEFAULT_PROFILE, DEVICE } from './config.js';

/* ------------------------------------------------------------------ event bus */
function createBus() {
  const map = new Map();
  return {
    on(evt, fn) { if (!map.has(evt)) map.set(evt, new Set()); map.get(evt).add(fn); return () => map.get(evt).delete(fn); },
    off(evt, fn) { if (map.has(evt)) map.get(evt).delete(fn); },
    emit(evt, payload) { if (map.has(evt)) map.get(evt).forEach(fn => { try { fn(payload); } catch (e) { console.warn('[bus]', evt, e); } }); }
  };
}
export const bus = createBus();

/* ------------------------------------------------------------------ damped fields */
const FIELDS = {
  intensity: 2.6,
  dark: 2.2,
  bloom: 3.0,
  grain: 4.0,
  ca: 5.0,
  distort: 4.0,
  fog: 2.2,
  exposure: 2.4,
  particleSpeed: 1.8,
  lightIntensity: 2.2,
  portal: 3.2,
  distortion: 2.8,
  objectRotation: 2.0,
  objectScale: 2.6,
  sweep: 3.0
};

const toRgb01 = hex => { const c = hexToRgb(hex); return [c[0] / 255, c[1] / 255, c[2] / 255]; };

export const state = {
  /* --- routing --- */
  route: '/',
  booted: false,

  /* --- scroll --- */
  scroll: 0,
  scrollProgress: 0,
  velocity: 0,          /* smoothed, signed, roughly -1..1 */
  absVelocity: 0,       /* smoothed magnitude 0..1 */
  rawVelocity: 0,
  direction: 1,
  isScrolling: false,
  scrollTimeout: 0,

  /* --- pointer --- */
  mouse: {
    x: window.innerWidth / 2, y: window.innerHeight / 2,
    nx: 0, ny: 0,               /* normalised -0.5..0.5 */
    sx: 0, sy: 0,               /* damped */
    vx: 0, vy: 0, speed: 0,
    down: false, dragging: false, inside: true
  },

  /* --- section --- */
  section: 'hero',
  prevSection: 'hero',
  sectionIndex: 0,
  sectionTotal: 10,
  sectionProgress: 0,

  /**
   * Page-owned bag. Scroll systems write plain numbers in here
   * (heroAct, reelOpen, serviceIndex, carouselAngle, formFocus …) and
   * the WebGL stages read them — pages never touch the renderer directly.
   */
  page: {},

  /* --- world (damped) --- */
  world: Object.keys(FIELDS).reduce((o, k) => (o[k] = DEFAULT_PROFILE[k] !== undefined ? DEFAULT_PROFILE[k] : 0, o), {}),
  target: Object.keys(FIELDS).reduce((o, k) => (o[k] = DEFAULT_PROFILE[k] !== undefined ? DEFAULT_PROFILE[k] : 0, o), {}),

  /* --- atmosphere colours (linear rgb 0..1) --- */
  colors: {
    skyA: toRgb01(DEFAULT_PROFILE.sky[0]),
    skyB: toRgb01(DEFAULT_PROFILE.sky[1]),
    accent: toRgb01(DEFAULT_PROFILE.sky[2]),
    tSkyA: toRgb01(DEFAULT_PROFILE.sky[0]),
    tSkyB: toRgb01(DEFAULT_PROFILE.sky[1]),
    tAccent: toRgb01(DEFAULT_PROFILE.sky[2])
  },

  /* --- camera shot --- */
  camera: {
    pos: DEFAULT_PROFILE.cam.pos.slice(),
    look: DEFAULT_PROFILE.cam.look.slice(),
    fov: DEFAULT_PROFILE.cam.fov,
    tPos: DEFAULT_PROFILE.cam.pos.slice(),
    tLook: DEFAULT_PROFILE.cam.look.slice(),
    tFov: DEFAULT_PROFILE.cam.fov,
    /* extra offsets applied per-frame by stages (parallax, scroll push, shake) */
    offX: 0, offY: 0, offZ: 0, rollX: 0, rollY: 0, rollZ: 0, shake: 0
  },

  /* --- quality --- */
  quality: DEVICE.tier,
  tierChanged: false
};

/* ------------------------------------------------------------------ profiles */
function writeTargets(p) {
  Object.keys(FIELDS).forEach(k => {
    if (p[k] !== undefined) state.target[k] = p[k];
  });
  if (p.sky) {
    state.colors.tSkyA = toRgb01(p.sky[0]);
    state.colors.tSkyB = toRgb01(p.sky[1]);
    state.colors.tAccent = toRgb01(p.sky[2]);
  }
  if (p.cam) {
    state.camera.tPos = p.cam.pos.slice();
    state.camera.tLook = p.cam.look.slice();
    state.camera.tFov = p.cam.fov;
  }
}

/** Apply a section profile (optionally blended between two profiles). */
export function applyProfile(a, b, t) {
  if (b === undefined || t === undefined || t <= 0) { writeTargets(a); return; }
  const blended = {};
  Object.keys(FIELDS).forEach(k => {
    const av = a[k] !== undefined ? a[k] : 0;
    const bv = b[k] !== undefined ? b[k] : av;
    blended[k] = lerp(av, bv, clamp(t));
  });
  if (a.sky && b.sky) {
    blended.sky = a.sky.map((hex, i) => mixHexStr(hex, b.sky[i], clamp(t)));
  } else if (a.sky) blended.sky = a.sky;
  if (a.cam && b.cam) {
    blended.cam = {
      pos: a.cam.pos.map((v, i) => lerp(v, b.cam.pos[i], clamp(t))),
      look: a.cam.look.map((v, i) => lerp(v, b.cam.look[i], clamp(t))),
      fov: lerp(a.cam.fov, b.cam.fov, clamp(t))
    };
  } else if (a.cam) blended.cam = a.cam;
  writeTargets(blended);
}

function mixHexStr(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  const c = v => Math.round(lerp(v[0], v[1], t)).toString(16).padStart(2, '0');
  return `#${c([A[0], B[0]])}${c([A[1], B[1]])}${c([A[2], B[2]])}`;
}

export function profileFor(name) { return SECTIONS[name] || DEFAULT_PROFILE; }

/** Called by the scroll system whenever the active section changes. */
export function setSection(name, index, total) {
  if (state.section !== name) {
    state.prevSection = state.section;
    state.section = name;
    bus.emit('section', { name, prev: state.prevSection, index });
  }
  state.sectionIndex = index;
  state.sectionTotal = total || state.sectionTotal;
  applyProfile(profileFor(name));
}

/** Blend two sections during a hand-off so the world morphs, not cuts. */
export function blendSections(fromName, toName, t) {
  applyProfile(profileFor(fromName), profileFor(toName), clamp(t));
}

/* ------------------------------------------------------------------ per frame */
export function setPointer(x, y) {
  const m = state.mouse;
  m.vx = x - m.x; m.vy = y - m.y;
  m.x = x; m.y = y;
  m.nx = x / window.innerWidth - 0.5;
  m.ny = 0.5 - y / window.innerHeight;
  m.speed = Math.min(1, Math.hypot(m.vx, m.vy) / 42);
}

export function updateState(dt) {
  const w = state.world, t = state.target;
  for (const k in FIELDS) w[k] = damp(w[k], t[k], FIELDS[k], dt);

  const c = state.colors, cl = 1 - Math.exp(-2.4 * dt);
  for (let i = 0; i < 3; i++) {
    c.skyA[i] += (c.tSkyA[i] - c.skyA[i]) * cl;
    c.skyB[i] += (c.tSkyB[i] - c.skyB[i]) * cl;
    c.accent[i] += (c.tAccent[i] - c.accent[i]) * cl;
  }

  const cam = state.camera, camL = 1 - Math.exp(-2.0 * dt);
  for (let i = 0; i < 3; i++) {
    cam.pos[i] += (cam.tPos[i] - cam.pos[i]) * camL;
    cam.look[i] += (cam.tLook[i] - cam.look[i]) * camL;
  }
  cam.fov += (cam.tFov - cam.fov) * camL;

  /* pointer smoothing */
  const m = state.mouse;
  m.sx = damp(m.sx, m.nx, 6, dt);
  m.sy = damp(m.sy, m.ny, 6, dt);
  m.vx *= Math.exp(-9 * dt);
  m.vy *= Math.exp(-9 * dt);
  m.speed = damp(m.speed, 0, 6, dt);

  /* velocity decay — everything settles when the user stops */
  state.velocity = damp(state.velocity, clamp(state.rawVelocity / 2600, -1, 1), 6, dt);
  state.absVelocity = damp(state.absVelocity, Math.min(1, Math.abs(state.rawVelocity) / 2600), 5, dt);
  state.rawVelocity *= Math.exp(-4.5 * dt);

  /* grain rises with motion, settles when still */
  state.world.grain = damp(state.world.grain, state.target.grain + state.absVelocity * 0.06, 4, dt);
}

export function resetWorldForRoute(route, firstSection) {
  state.route = route;
  state.page = {};
  state.rawVelocity = 0;
  state.velocity = 0;
  state.absVelocity = 0;
  state.sectionProgress = 0;
  const p = profileFor(firstSection || 'hero');
  /* snap the world to the new page's atmosphere — no cross-page smearing */
  writeTargets(p);
  Object.keys(FIELDS).forEach(k => { state.world[k] = state.target[k]; });
  const c = state.colors;
  c.skyA = toRgb01(p.sky[0]); c.tSkyA = c.skyA.slice();
  c.skyB = toRgb01(p.sky[1]); c.tSkyB = c.skyB.slice();
  c.accent = toRgb01(p.sky[2]); c.tAccent = c.accent.slice();
  state.camera.pos = p.cam.pos.slice(); state.camera.tPos = p.cam.pos.slice();
  state.camera.look = p.cam.look.slice(); state.camera.tLook = p.cam.look.slice();
  state.camera.fov = p.cam.fov; state.camera.tFov = p.cam.fov;
  state.camera.offX = state.camera.offY = state.camera.offZ = 0;
  state.camera.rollX = state.camera.rollY = 0;
  state.section = firstSection || 'hero';
}

export function setQuality(tier) {
  if (state.quality === tier) return;
  state.quality = clamp(tier, 0, 2);
  state.tierChanged = true;
  bus.emit('quality', state.quality);
}
