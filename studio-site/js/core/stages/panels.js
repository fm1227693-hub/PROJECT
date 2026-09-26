/* =====================================================================
   STAGES / PANELS
   Floating project frames drifting in depth behind the work list. Each
   panel is a machined chrome frame around a procedurally-generated screen;
   the panel that matches the hovered project comes forward and lights up
   while the others recede — the list and the 3D world are one object.
   ===================================================================== */
import * as THREE from 'three';
import { state } from '../state.js';
import { damp, clamp, hexToRgb } from '../utils.js';
import { createFrameGeometry } from '../geometry.js';
import { WORKS } from '../../data/content.js';

const PANEL_COUNT = 9;

function screenTexture(pal, seed) {
  const w = 320, h = 240;
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const ctx = c.getContext('2d');
  let s = seed * 9301 + 49297;
  const rnd = () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
  const [r1, g1, b1] = hexToRgb(pal[0]);
  const [r2, g2, b2] = hexToRgb(pal[1]);
  const [r3, g3, b3] = hexToRgb(pal[2]);

  const bg = ctx.createLinearGradient(0, 0, w, h);
  bg.addColorStop(0, `rgb(${r3},${g3},${b3})`);
  bg.addColorStop(1, `rgb(${Math.round(r3 * 0.4)},${Math.round(g3 * 0.4)},${Math.round(b3 * 0.4)})`);
  ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);

  ctx.globalCompositeOperation = 'lighter';
  for (let i = 0; i < 6; i++) {
    const x = rnd() * w, y = rnd() * h, rad = 40 + rnd() * 150;
    const g = ctx.createRadialGradient(x, y, 0, x, y, rad);
    const use = i % 2 ? [r2, g2, b2] : [r1, g1, b1];
    g.addColorStop(0, `rgba(${use[0]},${use[1]},${use[2]},${0.5 + rnd() * 0.35})`);
    g.addColorStop(1, `rgba(${use[0]},${use[1]},${use[2]},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, rad, 0, Math.PI * 2); ctx.fill();
  }
  /* scan structure */
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'rgba(255,255,255,0.09)';
  ctx.lineWidth = 1;
  for (let y = 0; y < h; y += 4) { ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(w, y + 0.5); ctx.stroke(); }
  ctx.strokeStyle = 'rgba(255,255,255,0.16)';
  ctx.beginPath(); ctx.moveTo(0, h * (0.3 + rnd() * 0.4)); ctx.lineTo(w, h * (0.3 + rnd() * 0.4)); ctx.stroke();

  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export class PanelsStage {
  constructor(world) {
    this.world = world;
    this.q = world.quality;
    this.group = new THREE.Group();
    this.group.name = 'panels';
    this.presence = 0;
    this.targetPresence = 0;
    this.active = -1;

    this.frameMat = world.materials.chrome({ color: 0xb9bec6, roughness: 0.24, clearcoat: 0.3, env: 1.2 });
    this.backMat = world.materials.matte({ color: 0x0b0b0e, roughness: 0.6, metalness: 0.4, env: 0.5 });

    this.frameGeo = createFrameGeometry(1.62, 1.06, 0.055, 0.05);
    this.screenGeo = new THREE.PlaneGeometry(1.52, 0.96);
    this.backGeo = new THREE.PlaneGeometry(1.56, 1.0);

    this.panels = [];
    this.textures = [];
    for (let i = 0; i < PANEL_COUNT; i++) {
      const work = WORKS[i % WORKS.length];
      const tex = screenTexture(work.pal, i + 3);
      this.textures.push(tex);

      const g = new THREE.Group();
      const frame = new THREE.Mesh(this.frameGeo, this.frameMat);
      const screen = new THREE.Mesh(this.screenGeo, new THREE.MeshBasicMaterial({ map: tex, toneMapped: true, fog: true }));
      screen.position.z = 0.03;
      const back = new THREE.Mesh(this.backGeo, this.backMat);
      back.position.z = -0.035;
      back.rotation.y = Math.PI;
      g.add(frame, screen, back);

      const angle = (i / PANEL_COUNT) * Math.PI * 2;
      g.userData = {
        base: new THREE.Vector3(Math.cos(angle) * 4.4, Math.sin(angle * 1.7) * 1.9, -2.4 - Math.abs(Math.sin(angle)) * 4.5),
        phase: rnd01(i) * Math.PI * 2,
        speed: 0.12 + rnd01(i + 40) * 0.2,
        tilt: (rnd01(i + 9) - 0.5) * 0.5,
        screen,
        scale: 0.7 + rnd01(i + 17) * 0.55
      };
      g.position.copy(g.userData.base);
      g.rotation.y = g.userData.tilt;
      this.panels.push(g);
      this.group.add(g);
    }

    this.group.position.set(0.4, 0, 0);
    world.scene.add(this.group);
  }

  static weights = { works: 1, 'work-hero': 0.8, 'work-grid': 1, 'work-cta': 0.6, manifesto: 0.16, stats: 0.2, brands: 0.3 };

  setPresence(v) { this.targetPresence = v; }

  update(dt, ctx) {
    this.presence = damp(this.presence, this.targetPresence, 2.8, dt);
    const p = this.presence;
    this.group.visible = p > 0.004;
    if (!this.group.visible) return;

    const t = this.world.time;
    const w = state.world;
    const m = state.mouse;
    const target = ctx.workIndex !== undefined ? ctx.workIndex : -1;
    this.active = target;

    this.group.rotation.y = damp(this.group.rotation.y, m.sx * 0.22 + (ctx.pageProgress || 0) * 0.5, 2, dt);
    this.group.rotation.x = damp(this.group.rotation.x, -m.sy * 0.12, 2, dt);
    this.group.position.y = damp(this.group.position.y, m.sy * 0.4 + Math.sin(t * 0.2) * 0.1, 2, dt);
    this.group.position.x = damp(this.group.position.x, 0.4 + m.sx * 0.6 - (ctx.pageProgress || 0) * 1.6, 2, dt);

    const drift = 0.5 + w.particleSpeed * 0.6 + state.absVelocity * 2.2;
    for (let i = 0; i < this.panels.length; i++) {
      const g = this.panels[i];
      const u = g.userData;
      const isActive = target >= 0 && (i % 6) === (target % 6);
      const fwd = isActive ? 2.6 : 0;
      const dim = isActive ? 1 : (target >= 0 ? 0.45 : 0.72);

      const tx = u.base.x + Math.sin(t * u.speed + u.phase) * 0.35;
      const ty = u.base.y + Math.cos(t * u.speed * 0.8 + u.phase) * 0.3;
      const tz = u.base.z + fwd + Math.sin(t * u.speed * 0.5 + u.phase) * 0.25;

      g.position.x = damp(g.position.x, tx, 3, dt);
      g.position.y = damp(g.position.y, ty, 3, dt);
      g.position.z = damp(g.position.z, tz, 3.4, dt);
      g.rotation.y = damp(g.rotation.y, u.tilt + Math.sin(t * 0.22 + u.phase) * 0.14 + m.sx * 0.18, 2.5, dt);
      g.rotation.x = damp(g.rotation.x, Math.cos(t * 0.18 + u.phase) * 0.07 - m.sy * 0.1, 2.5, dt);
      g.rotation.z = Math.sin(t * 0.14 + u.phase) * 0.04 + state.velocity * 0.05;

      const s = u.scale * (isActive ? 1.22 : 1) * (0.4 + p * 0.75) * (1 + w.intensity * 0.1);
      g.scale.setScalar(clamp(s, 0.001, 3));

      const lum = dim * (0.55 + w.intensity * 0.6 + state.absVelocity * 0.3) * (0.4 + p * 0.7);
      u.screen.material.color.setRGB(clamp(lum, 0, 2.2), clamp(lum * 0.99, 0, 2.2), clamp(lum * 0.97, 0, 2.2));
    }
  }

  dispose() {
    this.frameGeo.dispose(); this.screenGeo.dispose(); this.backGeo.dispose();
    this.panels.forEach(g => g.userData.screen.material.dispose());
    this.textures.forEach(t => t.dispose());
    if (this.group.parent) this.group.parent.remove(this.group);
  }
}

function rnd01(i) {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
}
