/* =====================================================================
   CORE / GEOMETRY
   Procedural geometry builders. Everything the world is made of is
   generated in code — no downloads, no licensing questions, and every
   form is tuned for the studio lighting in env.js.
   ===================================================================== */
import * as THREE from 'three';

/* ------------------------------------------------------------------ sculpture */
/**
 * Abstract figurative monolith: a liquid-metal silhouette that reads as a
 * torso/bust without ever becoming a character. Profile is smoothed with a
 * Catmull-Rom curve, then lathed and optionally twisted.
 */
const FIGURE_PROFILE = [
  [0.001, 0.00], [0.30, 0.02], [0.44, 0.08], [0.50, 0.22], [0.47, 0.46],
  [0.40, 0.66], [0.34, 0.86], [0.36, 1.06], [0.46, 1.28], [0.56, 1.50],
  [0.60, 1.70], [0.55, 1.86], [0.42, 1.98], [0.26, 2.06], [0.21, 2.16],
  [0.23, 2.30], [0.30, 2.46], [0.32, 2.66], [0.28, 2.86], [0.18, 3.02],
  [0.08, 3.14], [0.001, 3.22]
];

const VESSEL_PROFILE = [
  [0.001, 0.00], [0.22, 0.03], [0.34, 0.14], [0.42, 0.42], [0.46, 0.86],
  [0.44, 1.30], [0.36, 1.74], [0.26, 2.14], [0.20, 2.52], [0.22, 2.86],
  [0.30, 3.14], [0.34, 3.40], [0.28, 3.66], [0.16, 3.88], [0.06, 4.04],
  [0.001, 4.12]
];

function smoothProfile(profile, samples, tension = 0.5) {
  const pts = profile.map(p => new THREE.Vector3(p[0], p[1], 0));
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', tension);
  const out = [];
  for (let i = 0; i <= samples; i++) {
    const p = curve.getPoint(i / samples);
    out.push(new THREE.Vector2(Math.max(0.0005, p.x), p.y));
  }
  return out;
}

export function createFigureGeometry(opts = {}) {
  const detail = opts.detail !== undefined ? opts.detail : 1;
  const profile = opts.vessel ? VESSEL_PROFILE : FIGURE_PROFILE;
  const radial = Math.round((opts.radial || 112) * (0.55 + detail * 0.45));
  const points = smoothProfile(profile, Math.round(96 * (0.6 + detail * 0.4)));
  const geo = new THREE.LatheGeometry(points, Math.max(24, radial));
  geo.rotateX(0);
  const twist = opts.twist !== undefined ? opts.twist : 0.42;
  applyTwist(geo, twist);
  const h = opts.height || 4.4;
  const box = new THREE.Box3().setFromBufferAttribute(geo.attributes.position);
  const cur = box.max.y - box.min.y || 1;
  geo.scale(h / cur, h / cur, h / cur);
  geo.center();
  geo.translate(0, (h / 2) * 0.06, 0);
  geo.computeVertexNormals();
  geo.computeBoundingSphere();
  return geo;
}

/** Rotate vertices around Y proportionally to height — a subtle spiral. */
export function applyTwist(geo, amount) {
  const pos = geo.attributes.position;
  const box = new THREE.Box3().setFromBufferAttribute(pos);
  const h = box.max.y - box.min.y || 1;
  const v = new THREE.Vector3();
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const t = (v.y - box.min.y) / h;
    const a = t * amount;
    const c = Math.cos(a), s = Math.sin(a);
    pos.setXY(i, v.x * c - v.z * s, v.x * s + v.z * c);
  }
  pos.needsUpdate = true;
  geo.computeVertexNormals();
  return geo;
}

/* ------------------------------------------------------------------ ribbon */
export function createRibbonGeometry(opts = {}) {
  const turns = opts.turns || 2.4;
  const radius = opts.radius || 2.5;
  const height = opts.height || 5.2;
  const pts = [];
  const steps = opts.steps || 120;
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const a = t * Math.PI * 2 * turns;
    const r = radius * (0.55 + 0.45 * Math.sin(t * Math.PI)) * (1 - t * 0.18);
    pts.push(new THREE.Vector3(
      Math.cos(a) * r,
      (t - 0.5) * height + Math.sin(t * Math.PI * 3) * 0.28,
      Math.sin(a) * r * 0.72
    ));
  }
  const curve = new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.4);
  const geo = new THREE.TubeGeometry(curve, opts.tubular || 420, opts.tube || 0.055, opts.radial || 10, false);
  geo.userData.curve = curve;
  return geo;
}

export function curveFromPoints(points, tension = 0.5) {
  return new THREE.CatmullRomCurve3(points.map(p => new THREE.Vector3(p[0], p[1], p[2])), false, 'catmullrom', tension);
}

/* ------------------------------------------------------------------ panels */
export function roundedRectShape(w, h, r) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  r = Math.min(r, w / 2, h / 2);
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return s;
}

export function createPanelGeometry(w = 1.6, h = 1.0, r = 0.05, depth = 0.035) {
  const shape = roundedRectShape(w, h, r);
  const geo = new THREE.ExtrudeGeometry(shape, {
    depth, bevelEnabled: true, bevelThickness: 0.008, bevelSize: 0.008, bevelSegments: 2, curveSegments: 8
  });
  geo.center();
  return geo;
}

export function createFrameGeometry(w = 1.6, h = 1.0, thickness = 0.05, depth = 0.06) {
  const outer = roundedRectShape(w, h, 0.06);
  const inner = roundedRectShape(w - thickness * 2, h - thickness * 2, 0.03);
  outer.holes.push(new THREE.Path(inner.getPoints(24)));
  const geo = new THREE.ExtrudeGeometry(outer, { depth, bevelEnabled: false, curveSegments: 8 });
  geo.center();
  return geo;
}

/* ------------------------------------------------------------------ misc */
export function createShardGeometry() {
  const g = new THREE.OctahedronGeometry(0.16, 0);
  g.scale(1, 1.7, 0.7);
  return g;
}

export function createPlinthGeometry(r = 1.15, h = 0.22) {
  const g = new THREE.CylinderGeometry(r, r * 1.06, h, 72, 1, false);
  return g;
}

export function createGroundGeometry(size = 60) {
  const g = new THREE.PlaneGeometry(size, size, 1, 1);
  g.rotateX(-Math.PI / 2);
  return g;
}

export function createRingGeometry(radius = 2.6, tube = 0.028, radial = 8, tubular = 220) {
  return new THREE.TorusGeometry(radius, tube, radial, tubular);
}

/** Icosphere with a sane segment budget per quality tier. */
export function createBlobGeometry(radius = 1, detail = 48) {
  return new THREE.IcosahedronGeometry(radius, Math.max(8, Math.min(96, detail)));
}

/** Architecture: a lattice of thin boxes (used by the services stage). */
export function createLatticeGeometry(count = 60, spread = 3) {
  const geos = [];
  const base = new THREE.BoxGeometry(1, 1, 1);
  let seed = 1337;
  const rnd = () => { seed = (seed * 1664525 + 1013904223) >>> 0; return seed / 4294967296; };
  for (let i = 0; i < count; i++) {
    const g = base.clone();
    const w = 0.02 + rnd() * 0.06;
    const h = 0.2 + rnd() * spread * 0.7;
    const d = 0.02 + rnd() * 0.06;
    g.scale(w, h, d);
    g.translate((rnd() - 0.5) * spread, (rnd() - 0.5) * spread * 0.7, (rnd() - 0.5) * spread);
    geos.push(g);
  }
  base.dispose();
  return mergeGeos(geos);
}

function mergeGeos(geos) {
  /* minimal merge — positions + normals + uvs, non-indexed */
  let total = 0;
  const prepared = geos.map(g => {
    const ng = g.index ? g.toNonIndexed() : g;
    total += ng.attributes.position.count;
    return ng;
  });
  const pos = new Float32Array(total * 3);
  const nor = new Float32Array(total * 3);
  let o = 0;
  prepared.forEach(g => {
    pos.set(g.attributes.position.array, o * 3);
    if (g.attributes.normal) nor.set(g.attributes.normal.array, o * 3);
    o += g.attributes.position.count;
    g.dispose();
  });
  geos.forEach(g => g.dispose());
  const out = new THREE.BufferGeometry();
  out.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  out.setAttribute('normal', new THREE.BufferAttribute(nor, 3));
  out.computeBoundingSphere();
  return out;
}
