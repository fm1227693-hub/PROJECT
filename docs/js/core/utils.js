/* =====================================================================
   CORE / UTILS
   Tiny, allocation-free helpers shared by every module.
   ===================================================================== */

export const clamp = (v, a = 0, b = 1) => (v < a ? a : v > b ? b : v);
export const lerp = (a, b, t) => a + (b - a) * t;
export const inv = (a, b, v) => (b - a === 0 ? 0 : clamp((v - a) / (b - a), 0, 1));
export const mapRange = (v, a, b, c, d) => c + (d - c) * inv(a, b, v);
export const smoothstep = (e0, e1, x) => { const t = inv(e0, e1, x); return t * t * (3 - 2 * t); };
export const rand = (a = 0, b = 1) => a + Math.random() * (b - a);
export const randInt = (a, b) => Math.floor(rand(a, b + 1));
export const pick = arr => arr[Math.floor(Math.random() * arr.length)];
export const TAU = Math.PI * 2;

/* frame-rate independent exponential damping */
export const damp = (cur, target, lambda, dt) => cur + (target - cur) * (1 - Math.exp(-lambda * dt));
export const dampAngle = (cur, target, lambda, dt) => {
  let d = (target - cur) % Math.PI * 2;
  if (d > Math.PI) d -= Math.PI * 2;
  if (d < -Math.PI) d += Math.PI * 2;
  return cur + d * (1 - Math.exp(-lambda * dt));
};

/**
 * Keyframed 1-D track: piecewise(0.35, [[0,0],[0.2,1],[0.6,-1],[1,0]])
 * Interpolates with smoothstep so scroll-driven motion never looks linear.
 */
export function piecewise(t, keys) {
  if (!keys || !keys.length) return 0;
  if (t <= keys[0][0]) return keys[0][1];
  const last = keys[keys.length - 1];
  if (t >= last[0]) return last[1];
  for (let i = 0; i < keys.length - 1; i++) {
    const a = keys[i], b = keys[i + 1];
    if (t >= a[0] && t <= b[0]) {
      const k = b[0] - a[0] === 0 ? 0 : (t - a[0]) / (b[0] - a[0]);
      return lerp(a[1], b[1], smoothstep(0, 1, k));
    }
  }
  return last[1];
}

export const easeOutExpo = t => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));
export const easeInOutCubic = t => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutBack = (t, s = 1.70158) => 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);

/* ------------------------------------------------------------------ DOM */
export const qs = (sel, root = document) => root.querySelector(sel);
export const qsa = (sel, root = document) => Array.prototype.slice.call(root.querySelectorAll(sel));
export const byId = id => document.getElementById(id);

export function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  Object.keys(attrs).forEach(k => {
    if (k === 'class') node.className = attrs[k];
    else if (k === 'html') node.innerHTML = attrs[k];
    else if (k === 'text') node.textContent = attrs[k];
    else if (k === 'style' && typeof attrs[k] === 'object') Object.assign(node.style, attrs[k]);
    else if (k.startsWith('on') && typeof attrs[k] === 'function') node.addEventListener(k.slice(2), attrs[k]);
    else if (attrs[k] !== null && attrs[k] !== undefined) node.setAttribute(k, attrs[k]);
  });
  children.forEach(c => c && node.appendChild(c));
  return node;
}

/* ------------------------------------------------------------------ colour */
export function hexToRgb(hex) {
  const h = String(hex).replace('#', '');
  const n = parseInt(h.length === 3 ? h.split('').map(c => c + c).join('') : h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
export function rgbToHex(r, g, b) {
  const c = v => Math.round(clamp(v, 0, 255)).toString(16).padStart(2, '0');
  return `#${c(r)}${c(g)}${c(b)}`;
}
export function hslToHex(h, s, l) {
  s /= 100; l /= 100;
  const k = n => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = n => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
  return rgbToHex(f(0) * 255, f(8) * 255, f(4) * 255);
}
export function mixHex(a, b, t) {
  const A = hexToRgb(a), B = hexToRgb(b);
  return rgbToHex(lerp(A[0], B[0], t), lerp(A[1], B[1], t), lerp(A[2], B[2], t));
}

/* ------------------------------------------------------------------ events */
/**
 * Listener registry bound to an AbortController so a page can be torn down
 * without hunting for stray handlers (no leaks on route change).
 */
export function createBinder() {
  const ctrl = new AbortController();
  const sig = { signal: ctrl.signal };
  const timers = [];
  const rafs = [];
  return {
    signal: ctrl.signal,
    on(target, type, fn, opts) { target.addEventListener(type, fn, Object.assign({}, sig, opts)); return fn; },
    off(target, type, fn, opts) { target.removeEventListener(type, fn, opts); },
    every(ms, fn) { const id = setInterval(fn, ms); timers.push(id); return id; },
    after(ms, fn) { const id = setTimeout(fn, ms); timers.push(id); return id; },
    tick(fn) { const wrap = () => { fn(); const id = requestAnimationFrame(wrap); rafs.push(id); }; wrap(); },
    destroy() {
      ctrl.abort();
      timers.forEach(clearInterval); timers.length = 0;
      rafs.forEach(cancelAnimationFrame); rafs.length = 0;
    }
  };
}

export function debounce(fn, ms = 200) {
  let t; return function (...a) { clearTimeout(t); t = setTimeout(() => fn.apply(this, a), ms); };
}
export function throttleRaf(fn) {
  let queued = false;
  return function (...a) {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => { queued = false; fn.apply(this, a); });
  };
}

/* ------------------------------------------------------------------ geometry math */
export function simplexSeed(seed) {
  /* deterministic pseudo random for reproducible generative art */
  let s = seed >>> 0;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* ------------------------------------------------------------------ three.js disposal */
export function disposeObject3D(root) {
  if (!root) return;
  root.traverse(obj => {
    if (obj.geometry) obj.geometry.dispose();
    const mats = Array.isArray(obj.material) ? obj.material : obj.material ? [obj.material] : [];
    mats.forEach(m => {
      Object.keys(m).forEach(k => {
        const v = m[k];
        if (v && v.isTexture) v.dispose();
      });
      if (m.uniforms) {
        Object.keys(m.uniforms).forEach(k => {
          const v = m.uniforms[k] && m.uniforms[k].value;
          if (v && v.isTexture) v.dispose();
        });
      }
      m.dispose();
    });
  });
  if (root.parent) root.parent.remove(root);
}

export function removeFromParent(obj) { if (obj && obj.parent) obj.parent.remove(obj); }

/* ------------------------------------------------------------------ misc */
export const pad2 = n => String(Math.floor(n)).padStart(2, '0');
export const pad3 = n => String(Math.floor(n)).padStart(3, '0');

export function supportsWebGL2() {
  try { const c = document.createElement('canvas'); return !!c.getContext('webgl2'); } catch (e) { return false; }
}
