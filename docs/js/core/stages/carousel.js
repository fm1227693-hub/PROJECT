/* =====================================================================
   STAGES / CAROUSEL
   Object theatre: nine machined monoliths on a ring, lit by a tracking
   spot. Scroll scrubs the ring, dragging adds angular momentum, releasing
   lets it coast to a stop. The camera orbits with it — the active object
   always comes forward, the rest fall back into the dark.
   ===================================================================== */
import * as THREE from 'three';
import { state, bus } from '../state.js';
import { damp, clamp, TAU, hexToRgb } from '../utils.js';
import { createFrameGeometry, createRingGeometry } from '../geometry.js';
import { WORKS } from '../../data/content.js';

const COUNT = 9;
const RADIUS = 4.35;
const STEP = TAU / COUNT;

function artTexture(work, i) {
  const w = 256, h = 352;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  const [r1, g1, b1] = hexToRgb(work.pal[0]);
  const [r2, g2, b2] = hexToRgb(work.pal[1]);
  const [r3, g3, b3] = hexToRgb(work.pal[2]);
  let s = i * 7919 + 13;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };

  const bg = ctx.createLinearGradient(0, 0, w * 0.4, h);
  bg.addColorStop(0, `rgb(${r3},${g3},${b3})`);
  bg.addColorStop(1, `rgb(${Math.round(r3 * 0.35)},${Math.round(g3 * 0.35)},${Math.round(b3 * 0.35)})`);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = 'lighter';
  for (let k = 0; k < 5; k++) {
    const x = rnd() * w, y = rnd() * h, rad = 60 + rnd() * 190;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const use = k % 2 ? [r2, g2, b2] : [r1, g1, b1];
    g.addColorStop(0, `rgba(${use[0]},${use[1]},${use[2]},${0.42 + rnd() * 0.4})`);
    g.addColorStop(1, `rgba(${use[0]},${use[1]},${use[2]},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, TAU); ctx.fill();
  }
  /* structural lines so each panel reads as a different object */
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = `rgba(255,255,255,${0.06 + rnd() * 0.08})`;
  ctx.lineWidth = 1 + rnd() * 2;
  const mode = i % 3;
  for (let k = 0; k < (mode === 0 ? 26 : mode === 1 ? 12 : 40); k++) {
    ctx.beginPath();
    if (mode === 0) { const y = (k / 26) * h; ctx.moveTo(0, y); ctx.lineTo(w, y + (rnd() - 0.5) * 30); }
    else if (mode === 1) { const x = (k / 12) * w; ctx.moveTo(x, 0); ctx.lineTo(x + (rnd() - 0.5) * 40, h); }
    else { const x = rnd() * w, y = rnd() * h; ctx.arc(x, y, 8 + rnd() * 60, 0, TAU); }
    ctx.stroke();
  }
  /* index stamp */
  ctx.fillStyle = 'rgba(255,255,255,0.72)';
  ctx.font = '500 15px "JetBrains Mono", monospace';
  ctx.fillText(String(i + 1).padStart(2, '0'), 16, h - 18);
  ctx.fillStyle = 'rgba(255,255,255,0.42)';
  ctx.font = '500 11px "JetBrains Mono", monospace';
  ctx.fillText(work.c.toUpperCase(), 16, h - 36);

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export class CarouselStage {
  constructor(world) {
    this.world = world;
    this.q = world.quality;
    this.group = new THREE.Group();
    this.group.name = 'carousel';
    this.presence = 0;
    this.targetPresence = 0;
    this.angle = 0;
    this.dragAngle = 0;
    this.angularVel = 0;
    this.activeIndex = 0;
    this.textures = [];
    this.ownGeos = [];
    this.ownMats = [];

    this.frameMat = world.materials.chrome({ color: 0xb6bbc3, roughness: 0.22, clearcoat: 0.35, env: 1.25 });
    this.frameGeo = createFrameGeometry(1.42, 1.98, 0.055, 0.06);
    this.screenGeo = new THREE.PlaneGeometry(1.32, 1.88);
    this.ownGeos.push(this.frameGeo, this.screenGeo);

    this.items = [];
    for (let i = 0; i < COUNT; i++) {
      const work = WORKS[i % WORKS.length];
      const tex = artTexture(work, i);
      this.textures.push(tex);
      const g = new THREE.Group();
      const frame = new THREE.Mesh(this.frameGeo, this.frameMat);
      const screenMat = new THREE.MeshBasicMaterial({ map: tex, toneMapped: true, fog: true });
      this.ownMats.push(screenMat);
      const screen = new THREE.Mesh(this.screenGeo, screenMat);
      screen.position.z = 0.038;
      g.add(frame, screen);
      g.userData = { screenMat, work, base: i * STEP };
      this.items.push(g);
      this.group.add(g);
    }

    /* floor + light ring */
    this.floorGeo = new THREE.CircleGeometry(9.5, 72);
    this.floorGeo.rotateX(-Math.PI / 2);
    this.floorMat = world.materials.matte({ color: 0x08080a, roughness: 0.32, metalness: 0.85, env: 0.9 });
    this.floor = new THREE.Mesh(this.floorGeo, this.floorMat);
    this.floor.position.y = -1.62;
    this.ownGeos.push(this.floorGeo);
    this.group.add(this.floor);

    this.ringGeo = createRingGeometry(RADIUS + 0.55, 0.012, 5, 220);
    this.ringMat = new THREE.MeshBasicMaterial({ color: 0xff6a3d, transparent: true, opacity: 0.5, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false, fog: false });
    this.ownMats.push(this.ringMat);
    this.ring = new THREE.Mesh(this.ringGeo, this.ringMat);
    this.ring.rotation.x = Math.PI / 2;
    this.ring.position.y = -1.6;
    this.ownGeos.push(this.ringGeo);
    this.group.add(this.ring);

    /* tracking spot */
    this.spot = new THREE.SpotLight(0xfff2e6, 0, 26, Math.PI / 7.5, 0.75, 2);
    this.spot.position.set(0, 6.2, 6.4);
    this.spotTarget = new THREE.Object3D();
    this.group.add(this.spotTarget);
    this.spot.target = this.spotTarget;
    this.rimLight = new THREE.PointLight(0x5a6cff, 0, 20, 2);
    this.rimLight.position.set(-5, 1.5, -4);
    this.group.add(this.rimLight);

    this.group.position.y = -0.1;
    world.scene.add(this.group);

    this._drag = { on: false, x: 0, last: 0, t: 0 };
    this._bindEl = null;
    this._abort = null;
  }

  static weights = { carousel: 1, services: 0.08, marquee: 0.1 };

  setPresence(v) { this.targetPresence = v; }

  /** pointer interaction lives on a DOM overlay above the canvas */
  bind(el) {
    if (!el || this._bindEl === el) return;
    this.unbind();
    this._bindEl = el;
    this._abort = new AbortController();
    const sig = { signal: this._abort.signal };

    const down = e => {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      this._drag.on = true;
      this._drag.x = e.clientX;
      this._drag.last = e.clientX;
      this._drag.t = performance.now();
      this.angularVel = 0;
      el.classList.add('dragging');
      document.body.classList.add('cursor-drag');
      if (el.setPointerCapture) { try { el.setPointerCapture(e.pointerId); } catch (err) { /* noop */ } }
    };
    const move = e => {
      if (!this._drag.on) return;
      const now = performance.now();
      const dx = e.clientX - this._drag.last;
      const dt = Math.max(8, now - this._drag.t) / 1000;
      this.angularVel = damp(this.angularVel, -dx * 0.0055 / dt, 12, dt);
      this.dragAngle -= dx * 0.0055;
      this._drag.last = e.clientX;
      this._drag.t = now;
    };
    const up = () => {
      if (!this._drag.on) return;
      this._drag.on = false;
      el.classList.remove('dragging');
      document.body.classList.remove('cursor-drag');
      this.angularVel = clamp(this.angularVel, -7, 7);
    };

    el.addEventListener('pointerdown', down, sig);
    window.addEventListener('pointermove', move, sig);
    window.addEventListener('pointerup', up, sig);
    window.addEventListener('pointercancel', up, sig);
  }

  unbind() {
    if (this._abort) this._abort.abort();
    this._abort = null;
    this._bindEl = null;
    this._drag.on = false;
    document.body.classList.remove('cursor-drag');
  }

  update(dt, ctx) {
    this.presence = damp(this.presence, this.targetPresence, 3, dt);
    const p = this.presence;
    this.group.visible = p > 0.004;
    if (!this.group.visible) return;

    const t = this.world.time;
    const w = state.world;

    /* scroll scrubs the ring, drag adds momentum on top of it */
    const scrollAngle = (ctx.carouselScroll || 0) * TAU * 1.35;
    if (!this._drag.on) {
      this.dragAngle += this.angularVel * dt;
      this.angularVel *= Math.exp(-1.9 * dt);
      if (Math.abs(this.angularVel) < 0.0005) this.angularVel = 0;
    }
    /* idle drift so it is never dead still */
    const idle = Math.sin(t * 0.13) * 0.05;
    this.angle = damp(this.angle, scrollAngle + this.dragAngle + idle, 6, dt);

    this.group.rotation.y = this.angle;
    this.group.position.y = damp(this.group.position.y, -0.1 + state.mouse.sy * 0.35, 2.4, dt);
    this.group.position.x = damp(this.group.position.x, state.mouse.sx * 0.55, 2.4, dt);

    /* which monolith is facing the camera */
    let idx = Math.round((-this.angle + state.mouse.sx * 0.06) / STEP) % COUNT;
    if (idx < 0) idx += COUNT;
    if (idx !== this.activeIndex) {
      this.activeIndex = idx;
      state.page.carouselIndex = idx;
      bus.emit('carousel', idx);
    }

    for (let i = 0; i < COUNT; i++) {
      const g = this.items[i];
      const a = g.userData.base;
      /* keep panels facing outward from the ring */
      g.rotation.y = a;
      const local = Math.cos(a + this.angle);
      const facing = clamp((local + 1) / 2, 0, 1); /* 1 when facing camera */
      const isActive = i === idx;
      const fwd = isActive ? 0.62 : 0;
      g.position.set(Math.sin(a) * (RADIUS + fwd), isActive ? 0.12 : -0.06, Math.cos(a) * (RADIUS + fwd));
      const s = (isActive ? 1.06 : 0.9 + facing * 0.06) * (0.5 + p * 0.6);
      g.scale.setScalar(clamp(s, 0.001, 2));
      const lum = (isActive ? 1.15 : 0.24 + facing * 0.4) * (0.55 + w.intensity * 0.5) * (0.4 + p * 0.7);
      g.userData.screenMat.color.setRGB(clamp(lum, 0, 2.4), clamp(lum * 0.99, 0, 2.4), clamp(lum * 0.96, 0, 2.4));
    }

    /* spot follows the active monolith */
    const act = this.items[idx];
    act.getWorldPosition(this.spotTarget.position);
    this.group.worldToLocal(this.spotTarget.position);
    this.spot.intensity = damp(this.spot.intensity, (140 + w.intensity * 220) * p, 4, dt);
    this.spot.color.setRGB(1, 0.95 - state.colors.accent[1] * 0.1, 0.9);
    this.rimLight.intensity = damp(this.rimLight.intensity, (30 + state.absVelocity * 90) * p, 3, dt);

    this.ringMat.opacity = (0.22 + w.intensity * 0.4 + state.absVelocity * 0.3) * p;
    this.ring.rotation.z = t * 0.06 + this.angle * 0.4;
    this.floorMat.envMapIntensity = 0.6 + w.intensity * 0.7;

    /* camera orbits with the ring — restrained, never dizzying */
    if (ctx.controlCamera && p > 0.6) {
      const orbit = this.angle * 0.22 + state.mouse.sx * 0.35;
      const dist = 8.7 - w.intensity * 0.5 + state.absVelocity * 0.4;
      state.camera.tPos[0] = Math.sin(orbit) * dist;
      state.camera.tPos[1] = 0.5 + state.mouse.sy * 0.5;
      state.camera.tPos[2] = Math.cos(orbit) * dist;
      state.camera.tLook[0] = 0; state.camera.tLook[1] = -0.1; state.camera.tLook[2] = 0;
      state.camera.tFov = 40 + Math.abs(this.angularVel) * 0.9;
    }
  }

  dispose() {
    this.unbind();
    this.ownGeos.forEach(g => g && g.dispose());
    this.ownMats.forEach(m => m && m.dispose());
    this.textures.forEach(t => t.dispose());
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}
