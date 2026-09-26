/* =====================================================================
   COMPONENTS / GENERATIVE
   Canvas-2D painter library + a manager that only animates what is on
   screen, at a capped pixel ratio, and tears everything down per route.

   Every painter is a different algorithm — no two tiles in the Lab look
   alike, and each one responds to the pointer in its own way.
   ===================================================================== */
import { DEVICE } from '../core/config.js';
import { hexToRgb, clamp } from '../core/utils.js';

/* ------------------------------------------------------------------ noise */
const GRAD = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
function noise2(x, y) {
  const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
  const xf = x - Math.floor(x), yf = y - Math.floor(y);
  const u = xf * xf * (3 - 2 * xf), v = yf * yf * (3 - 2 * yf);
  const aa = GRAD[(X * 7 + Y * 13) & 7], ab = GRAD[(X * 7 + (Y + 1) * 13) & 7];
  const ba = GRAD[((X + 1) * 7 + Y * 13) & 7], bb = GRAD[((X + 1) * 7 + (Y + 1) * 13) & 7];
  const d = (g, fx, fy) => g[0] * fx + g[1] * fy;
  const x1 = d(aa, xf, yf) + (d(ba, xf - 1, yf) - d(aa, xf, yf)) * u;
  const x2 = d(ab, xf, yf - 1) + (d(bb, xf - 1, yf - 1) - d(ab, xf, yf - 1)) * u;
  return x1 + (x2 - x1) * v;
}
const fbm2 = (x, y) => noise2(x, y) * 0.55 + noise2(x * 2.1, y * 2.1) * 0.28 + noise2(x * 4.3, y * 4.3) * 0.14;

const rgba = (hex, a) => { const c = hexToRgb(hex); return `rgba(${c[0]},${c[1]},${c[2]},${a})`; };
const rgb = hex => { const c = hexToRgb(hex); return `rgb(${c[0]},${c[1]},${c[2]})`; };

function seeded(seed) {
  let s = seed >>> 0 || 1;
  return () => { s = (s * 1664525 + 1013904223) >>> 0; return s / 4294967296; };
}

/* ------------------------------------------------------------------ painters */
export const painters = {

  /* --- ink advection with feedback --- */
  fluid(ctx, w, h, t, pal, m, st) {
    if (!st.init) { ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h); st.init = true; st.px = w / 2; st.py = h / 2; st.k = 0; }
    ctx.fillStyle = rgba(pal[2], 0.05); ctx.fillRect(0, 0, w, h);
    const tx = m ? m.x * w : w * (0.5 + 0.36 * Math.sin(t * 0.9));
    const ty = m ? m.y * h : h * (0.5 + 0.36 * Math.cos(t * 0.7));
    const vx = tx - st.px, vy = ty - st.py;
    st.px += vx * 0.32; st.py += vy * 0.32; st.k += 0.03;
    const speed = Math.min(1, Math.hypot(vx, vy) / 40);
    const r = w * (0.05 + speed * 0.09);
    const c = hexToRgb(pal[Math.floor(st.k) % 2]);
    const g = ctx.createRadialGradient(st.px, st.py, 0, st.px, st.py, Math.max(1, r));
    g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.92)`);
    g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(st.px, st.py, r, 0, 6.283); ctx.fill();
    ctx.globalAlpha = 0.55; ctx.drawImage(ctx.canvas, 0, 0, w, h, -vx * 0.14, -vy * 0.14, w, h); ctx.globalAlpha = 1;
  },

  /* --- threshold metaball field --- */
  meta(ctx, w, h, t, pal, m, st) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    const cell = Math.max(5, Math.round(w / 96));
    if (!st.balls) st.balls = [0, 1, 2, 3, 4, 5].map(i => ({ i }));
    const balls = st.balls.map(b => ({
      x: w * (0.5 + 0.34 * Math.sin(t * 0.7 + b.i * 1.3)),
      y: h * (0.5 + 0.34 * Math.cos(t * 0.5 + b.i * 0.9)),
      r: w * 0.085
    }));
    if (m) balls.push({ x: m.x * w, y: m.y * h, r: w * 0.11 });
    const c = hexToRgb(pal[0]), c2 = hexToRgb(pal[1]);
    for (let y = 0; y < h; y += cell) {
      for (let x = 0; x < w; x += cell) {
        let s = 0;
        for (const b of balls) { const dx = x - b.x, dy = y - b.y; s += (b.r * b.r) / (dx * dx + dy * dy + 1); }
        if (s > 0.85) {
          const a = Math.min(1, (s - 0.85) * 1.8);
          const mix = clamp((s - 0.85) * 0.5, 0, 1);
          ctx.fillStyle = `rgba(${Math.round(c[0] + (c2[0] - c[0]) * mix)},${Math.round(c[1] + (c2[1] - c[1]) * mix)},${Math.round(c[2] + (c2[2] - c[2]) * mix)},${a})`;
          ctx.fillRect(x, y, cell + 0.6, cell + 0.6);
        }
      }
    }
  },

  /* --- curl-noise particle trails --- */
  flow(ctx, w, h, t, pal, m, st) {
    const n = DEVICE.touch ? 220 : 460;
    if (!st.p) {
      const rnd = seeded(7);
      st.p = Array.from({ length: n }, () => ({ x: rnd() * w, y: rnd() * h, l: 0 }));
      ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = rgba(pal[2], 0.075); ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = 1.15;
    for (const p of st.p) {
      const a = fbm2(p.x * 0.0022, p.y * 0.0022 + t * 0.05) * 7.5;
      let vx = Math.cos(a) * 2.1, vy = Math.sin(a) * 2.1;
      if (m) {
        const dx = p.x - m.x * w, dy = p.y - m.y * h, d = Math.hypot(dx, dy) + 1;
        if (d < 130) { vx += dx / d * 5.5; vy += dy / d * 5.5; }
      }
      ctx.strokeStyle = rgba(pal[p.l++ % 2 === 0 ? 1 : 0], 0.55);
      ctx.beginPath(); ctx.moveTo(p.x, p.y);
      p.x += vx; p.y += vy;
      ctx.lineTo(p.x, p.y); ctx.stroke();
      if (p.x < -5 || p.x > w + 5 || p.y < -5 || p.y > h + 5) { p.x = Math.random() * w; p.y = Math.random() * h; }
    }
  },

  /* --- sine interference lines --- */
  wave(ctx, w, h, t, pal, m) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    const rows = DEVICE.touch ? 16 : 26;
    ctx.lineWidth = Math.max(1, w / 620);
    for (let r = 0; r < rows; r++) {
      const y0 = (r / (rows - 1)) * h;
      ctx.strokeStyle = rgba(r % 2 ? pal[1] : pal[0], 0.3 + 0.5 * (r / rows));
      ctx.beginPath();
      for (let x = 0; x <= w; x += 6) {
        const mx = m ? Math.exp(-Math.pow((x / w - m.x) * 3.2, 2) - Math.pow((y0 / h - m.y) * 3.2, 2)) * 46 : 0;
        const y = y0 + Math.sin(x * 0.012 + t * 1.35 + r * 0.42) * 15 + Math.cos(x * 0.004 - t * 0.8 + r) * 11 - mx;
        x === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  /* --- verlet spring lattice --- */
  cloth(ctx, w, h, t, pal, m, st) {
    const N = DEVICE.touch ? 14 : 20;
    if (!st.pts) {
      st.pts = [];
      for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) st.pts.push({ x: (x + 0.5) / N * w, y: (y + 0.5) / N * h, ox: 0, oy: 0 });
      st.N = N;
    }
    const NN = st.N;
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = rgba(pal[1], 0.42); ctx.lineWidth = 1;
    for (let i = 0; i < st.pts.length; i++) {
      const p = st.pts[i];
      const gx = (i % NN + 0.5) / NN * w, gy = (Math.floor(i / NN) + 0.5) / NN * h;
      let tx = gx + Math.sin(t + gy * 0.02) * 7, ty = gy + Math.cos(t * 0.8 + gx * 0.02) * 7;
      if (m) {
        const dx = gx - m.x * w, dy = gy - m.y * h, d = Math.hypot(dx, dy) + 1;
        const f = Math.max(0, 1 - d / (w * 0.32));
        tx += dx / d * f * 46; ty += dy / d * f * 46;
      }
      p.ox = (p.ox + (tx - p.x) * 0.09) * 0.86; p.oy = (p.oy + (ty - p.y) * 0.09) * 0.86;
      p.x += p.ox; p.y += p.oy;
    }
    ctx.beginPath();
    for (let y = 0; y < NN; y++) for (let x = 0; x < NN; x++) {
      const p = st.pts[y * NN + x];
      if (x < NN - 1) { const q = st.pts[y * NN + x + 1]; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
      if (y < NN - 1) { const q = st.pts[(y + 1) * NN + x]; ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); }
    }
    ctx.stroke();
    ctx.fillStyle = rgb(pal[0]);
    for (const p of st.pts) { ctx.beginPath(); ctx.arc(p.x, p.y, 1.5, 0, 6.283); ctx.fill(); }
  },

  /* --- domain-warped plasma --- */
  plasma(ctx, w, h, t, pal, m, st) {
    const rw = DEVICE.touch ? 72 : 104, rh = Math.max(24, Math.round(rw * h / Math.max(1, w)));
    if (!st.img) {
      st.off = document.createElement('canvas'); st.off.width = rw; st.off.height = rh;
      st.octx = st.off.getContext('2d'); st.img = st.octx.createImageData(rw, rh);
      st.rw = rw; st.rh = rh;
    }
    const d = st.img.data;
    const A = hexToRgb(pal[0]), B = hexToRgb(pal[1]), C = hexToRgb(pal[2]);
    const mx = m ? m.x * 6 : 3, my = m ? m.y * 6 : 3;
    for (let y = 0; y < rh; y++) {
      for (let x = 0; x < rw; x++) {
        const u = x / rw * 6, v = y / rh * 6;
        const q = Math.sin(u + t) + Math.cos(v - t * 0.7);
        const r = Math.sin(u * 0.7 + q + t * 0.4) * Math.cos(v * 0.8 - q);
        const dist = Math.hypot(u - mx, v - my);
        const k = (r + Math.sin(dist * 2 - t * 2) * 0.35) * 0.5 + 0.5;
        const i = (y * rw + x) * 4;
        const c = k < 0.5 ? [C, A, k * 2] : [A, B, (k - 0.5) * 2];
        d[i] = c[0][0] + (c[1][0] - c[0][0]) * c[2];
        d[i + 1] = c[0][1] + (c[1][1] - c[0][1]) * c[2];
        d[i + 2] = c[0][2] + (c[1][2] - c[0][2]) * c[2];
        d[i + 3] = 255;
      }
    }
    st.octx.putImageData(st.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(st.off, 0, 0, w, h);
  },

  /* --- additive light blobs (used by hover previews) --- */
  blobs(ctx, w, h, t, pal, m) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 5; i++) {
      const x = w * (0.5 + 0.38 * Math.sin(t * 0.5 + i * 1.7)) + (m ? (m.x - 0.5) * w * 0.16 : 0);
      const y = h * (0.5 + 0.34 * Math.cos(t * 0.4 + i * 2.1)) + (m ? (m.y - 0.5) * h * 0.16 : 0);
      const r = Math.min(w, h) * (0.28 + 0.12 * Math.sin(t + i));
      const g = ctx.createRadialGradient(x, y, 0, x, y, Math.max(1, r));
      const c = hexToRgb(pal[i % 2]);
      g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.85)`);
      g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
      ctx.fillStyle = g; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill();
    }
    ctx.globalCompositeOperation = 'source-over';
  },

  /* --- kinetic typography --- */
  type(ctx, w, h, t, pal, m) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    const words = ['MOTION', 'RHYTHM', 'TYPE', 'BEAT', 'FLOW'];
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    for (let i = 0; i < words.length; i++) {
      const p = (t * 0.28 + i / words.length) % 1;
      const y = h * (0.12 + p * 0.82);
      const s = 0.5 + Math.sin(p * Math.PI) * 1.1;
      const size = Math.max(10, w * 0.13 * s);
      ctx.font = `600 ${size}px "Inter Tight", sans-serif`;
      ctx.fillStyle = rgba(i % 2 ? pal[1] : pal[0], Math.sin(p * Math.PI) * 0.9);
      const x = w * 0.5 + Math.sin(p * 6 + i) * w * 0.12 + (m ? (m.x - 0.5) * 26 : 0);
      ctx.save(); ctx.translate(x, y); ctx.rotate((p - 0.5) * 0.16); ctx.fillText(words[i], 0, 0); ctx.restore();
    }
  },

  /* --- glass interface: stacked refractive plates --- */
  glass(ctx, w, h, t, pal, m) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, pal[2]); g.addColorStop(1, '#05070a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 6; i >= 0; i--) {
      const p = i / 6;
      const bw = w * (0.32 + p * 0.5), bh = h * (0.2 + p * 0.42);
      const x = w * 0.5 - bw / 2 + Math.sin(t * 0.5 + i) * w * 0.05 + (m ? (m.x - 0.5) * 22 * p : 0);
      const y = h * 0.5 - bh / 2 + Math.cos(t * 0.4 + i) * h * 0.05 + (m ? (m.y - 0.5) * 18 * p : 0);
      const rg = ctx.createLinearGradient(x, y, x + bw, y + bh);
      rg.addColorStop(0, rgba(pal[1], 0.16 + p * 0.1));
      rg.addColorStop(0.5, rgba(pal[0], 0.06));
      rg.addColorStop(1, rgba(pal[1], 0.2 + p * 0.12));
      ctx.fillStyle = rg;
      roundRect(ctx, x, y, bw, bh, 14 + p * 12); ctx.fill();
      ctx.strokeStyle = rgba(pal[1], 0.22 + p * 0.16); ctx.lineWidth = 1;
      roundRect(ctx, x, y, bw, bh, 14 + p * 12); ctx.stroke();
    }
  },

  /* --- perspective terrain --- */
  terrain(ctx, w, h, t, pal, m) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    const cols = 34, rows = 20;
    ctx.lineWidth = 1;
    for (let r = rows; r >= 0; r--) {
      const p = r / rows;
      const yBase = h * 0.35 + p * h * 0.75;
      ctx.strokeStyle = rgba(pal[r % 2 ? 1 : 0], 0.16 + p * 0.5);
      ctx.beginPath();
      for (let c = 0; c <= cols; c++) {
        const x = (c / cols) * w;
        const n = fbm2(c * 0.22 + (m ? (m.x - 0.5) * 1.4 : 0), r * 0.3 - t * 0.35);
        const y = yBase - n * h * 0.2 * (1 - p * 0.55);
        c === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  },

  /* --- ocean bands --- */
  ocean(ctx, w, h, t, pal, m) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, pal[2]); g.addColorStop(0.55, rgba(pal[0], 0.35)); g.addColorStop(1, pal[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 12; i++) {
      const p = i / 12;
      const y = h * (0.45 + p * 0.55);
      ctx.beginPath();
      for (let x = 0; x <= w; x += 5) {
        const yy = y + Math.sin(x * 0.02 + t * (1 + p) + i) * (4 + p * 16) + Math.sin(x * 0.006 - t * 0.7) * 8;
        x === 0 ? ctx.moveTo(x, yy) : ctx.lineTo(x, yy);
      }
      ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
      ctx.fillStyle = rgba(pal[1], 0.05 + p * 0.07);
      ctx.fill();
      ctx.strokeStyle = rgba('#ffffff', 0.05 + p * 0.1); ctx.lineWidth = 1; ctx.stroke();
    }
    if (m) {
      const rg = ctx.createRadialGradient(m.x * w, m.y * h, 0, m.x * w, m.y * h, w * 0.3);
      rg.addColorStop(0, rgba('#ffffff', 0.2)); rg.addColorStop(1, rgba('#ffffff', 0));
      ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);
    }
  },

  /* --- signal field --- */
  signal(ctx, w, h, t, pal, m) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    const bars = 56;
    for (let i = 0; i < bars; i++) {
      const x = (i / bars) * w;
      const bw = w / bars * 0.55;
      const n = Math.abs(fbm2(i * 0.16, t * 0.55));
      const boost = m ? Math.exp(-Math.pow((i / bars - m.x) * 4.5, 2)) * 0.6 : 0;
      const bh = h * (0.06 + n * 0.7 + boost);
      const g = ctx.createLinearGradient(0, h / 2 - bh / 2, 0, h / 2 + bh / 2);
      g.addColorStop(0, rgba(pal[0], 0.95)); g.addColorStop(0.5, rgba(pal[1], 0.8)); g.addColorStop(1, rgba(pal[0], 0.95));
      ctx.fillStyle = g;
      ctx.fillRect(x, h / 2 - bh / 2, bw, bh);
    }
    ctx.strokeStyle = rgba('#ffffff', 0.12); ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(0, h / 2); ctx.lineTo(w, h / 2); ctx.stroke();
  },

  /* --- boids swarm with cursor repulsion --- */
  swarm(ctx, w, h, t, pal, m, st) {
    const N = DEVICE.touch ? 42 : 90;
    if (!st.b) {
      const rnd = seeded(31);
      st.b = Array.from({ length: N }, () => ({ x: rnd() * w, y: rnd() * h, a: rnd() * 6.28, s: 0.8 + rnd() * 1.2 }));
      ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    }
    ctx.fillStyle = rgba(pal[2], 0.16); ctx.fillRect(0, 0, w, h);
    for (const b of st.b) {
      let turn = fbm2(b.x * 0.004, b.y * 0.004 + t * 0.1) * 0.5;
      if (m) {
        const dx = b.x - m.x * w, dy = b.y - m.y * h, d = Math.hypot(dx, dy) + 1;
        if (d < 120) turn += (Math.atan2(dy, dx) - b.a) * 0.35;
      }
      b.a += turn * 0.14;
      b.x += Math.cos(b.a) * b.s * 1.9; b.y += Math.sin(b.a) * b.s * 1.9;
      if (b.x < 0) b.x += w; if (b.x > w) b.x -= w;
      if (b.y < 0) b.y += h; if (b.y > h) b.y -= h;
      ctx.strokeStyle = rgba(pal[0], 0.75); ctx.lineWidth = 1.4;
      ctx.beginPath(); ctx.moveTo(b.x, b.y);
      ctx.lineTo(b.x - Math.cos(b.a) * 7, b.y - Math.sin(b.a) * 7); ctx.stroke();
      ctx.fillStyle = rgba(pal[1], 0.5);
      ctx.beginPath(); ctx.arc(b.x, b.y, 1.6, 0, 6.283); ctx.fill();
    }
  },

  /* --- Gray–Scott reaction diffusion --- */
  reaction(ctx, w, h, t, pal, m, st) {
    const S = st.S || (st.S = DEVICE.touch ? 72 : 110);
    if (!st.a) {
      st.a = new Float32Array(S * S * 2); st.b = new Float32Array(S * S * 2);
      for (let i = 0; i < S * S; i++) { st.a[i * 2] = 1; st.a[i * 2 + 1] = 0; st.b[i * 2] = 0; st.b[i * 2 + 1] = 0; }
      const rnd = seeded(5);
      for (let k = 0; k < 14; k++) {
        const cx = Math.floor(rnd() * S), cy = Math.floor(rnd() * S);
        for (let y = -3; y <= 3; y++) for (let x = -3; x <= 3; x++) {
          const i = (((cy + y + S) % S) * S + ((cx + x + S) % S)) * 2;
          st.a[i] = 0.5; st.a[i + 1] = 0.25;
        }
      }
      st.off = document.createElement('canvas'); st.off.width = st.off.height = S;
      st.octx = st.off.getContext('2d'); st.img = st.octx.createImageData(S, S);
    }
    const A = st.a, B = st.b;
    const feed = 0.0367 + Math.sin(t * 0.16) * 0.0026, kill = 0.0649;
    const steps = DEVICE.touch ? 4 : 9;
    for (let s = 0; s < steps; s++) {
      for (let y = 1; y < S - 1; y++) {
        for (let x = 1; x < S - 1; x++) {
          const i = (y * S + x) * 2;
          const a = A[i], b = A[i + 1];
          const la = A[i - 2] + A[i + 2] + A[i - S * 2] + A[i + S * 2] - 4 * a;
          const lb = A[i - 2 + 1] + A[i + 2 + 1] + A[i - S * 2 + 1] + A[i + S * 2 + 1] - 4 * b;
          const abb = a * b * b;
          B[i] = a + (1.0 * la - abb + feed * (1 - a));
          B[i + 1] = b + (0.5 * lb + abb - (kill + feed) * b);
          B[i] = clamp(B[i], 0, 1); B[i + 1] = clamp(B[i + 1], 0, 1);
        }
      }
      A.set(B);
    }
    if (m) {
      const cx = Math.floor(m.x * S), cy = Math.floor(m.y * S);
      for (let y = -2; y <= 2; y++) for (let x = -2; x <= 2; x++) {
        const i = (((cy + y + S) % S) * S + ((cx + x + S) % S)) * 2;
        A[i + 1] = 0.4;
      }
    }
    const d = st.img.data;
    const C0 = hexToRgb(pal[2]), C1 = hexToRgb(pal[0]), C2 = hexToRgb(pal[1]);
    for (let i = 0; i < S * S; i++) {
      const v = clamp(A[i * 2 + 1] * 3.1, 0, 1);
      const c = v < 0.5 ? [C0, C1, v * 2] : [C1, C2, (v - 0.5) * 2];
      d[i * 4] = c[0][0] + (c[1][0] - c[0][0]) * c[2];
      d[i * 4 + 1] = c[0][1] + (c[1][1] - c[0][1]) * c[2];
      d[i * 4 + 2] = c[0][2] + (c[1][2] - c[0][2]) * c[2];
      d[i * 4 + 3] = 255;
    }
    st.octx.putImageData(st.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(st.off, 0, 0, w, h);
  },

  /* --- voronoi cells --- */
  voronoi(ctx, w, h, t, pal, m, st) {
    const S = st.S || (st.S = DEVICE.touch ? 84 : 128);
    const N = 22;
    if (!st.seeds) {
      const rnd = seeded(11);
      st.seeds = Array.from({ length: N }, (_, i) => ({ i, px: rnd(), py: rnd(), sx: 0.2 + rnd() * 0.5, sy: 0.2 + rnd() * 0.5 }));
      st.off = document.createElement('canvas'); st.off.width = st.off.height = S;
      st.octx = st.off.getContext('2d'); st.img = st.octx.createImageData(S, S);
    }
    const pts = st.seeds.map(s => ({
      x: (s.px + Math.sin(t * s.sx + s.i) * 0.16) * S,
      y: (s.py + Math.cos(t * s.sy + s.i * 1.7) * 0.16) * S
    }));
    if (m) pts.push({ x: m.x * S, y: m.y * S });
    const d = st.img.data;
    const A = hexToRgb(pal[0]), B = hexToRgb(pal[1]), C = hexToRgb(pal[2]);
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        let d1 = 1e9, d2 = 1e9, id = 0;
        for (let k = 0; k < pts.length; k++) {
          const dd = (pts[k].x - x) * (pts[k].x - x) + (pts[k].y - y) * (pts[k].y - y);
          if (dd < d1) { d2 = d1; d1 = dd; id = k; } else if (dd < d2) d2 = dd;
        }
        const edge = clamp((Math.sqrt(d2) - Math.sqrt(d1)) / 7, 0, 1);
        const i = (y * S + x) * 4;
        const base = id % 2 ? A : B;
        d[i] = C[0] + (base[0] - C[0]) * edge;
        d[i + 1] = C[1] + (base[1] - C[1]) * edge;
        d[i + 2] = C[2] + (base[2] - C[2]) * edge;
        d[i + 3] = 255;
      }
    }
    st.octx.putImageData(st.img, 0, 0);
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(st.off, 0, 0, w, h);
  },

  /* --- moiré interference --- */
  moire(ctx, w, h, t, pal, m) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    ctx.globalCompositeOperation = 'lighter';
    for (let k = 0; k < 2; k++) {
      ctx.save();
      ctx.translate(w / 2 + (m ? (m.x - 0.5) * 40 * (k ? -1 : 1) : 0), h / 2 + (m ? (m.y - 0.5) * 40 * (k ? -1 : 1) : 0));
      ctx.rotate(t * (k ? -0.11 : 0.09) + k * 0.6);
      ctx.strokeStyle = rgba(k ? pal[1] : pal[0], 0.5);
      ctx.lineWidth = 1.6;
      const R = Math.hypot(w, h);
      for (let r = 6; r < R; r += 9) { ctx.beginPath(); ctx.arc(0, 0, r, 0, 6.283); ctx.stroke(); }
      ctx.restore();
    }
    ctx.globalCompositeOperation = 'source-over';
  },

  /* --- space colonisation growth --- */
  growth(ctx, w, h, t, pal, m, st) {
    if (!st.nodes) {
      ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
      st.nodes = [{ x: w / 2, y: h * 0.92, a: -Math.PI / 2, life: 0 }];
      st.t = 0;
      const rnd = seeded(77);
      st.attractors = Array.from({ length: DEVICE.touch ? 40 : 90 }, () => ({ x: rnd() * w, y: rnd() * h * 0.85, hit: false }));
    }
    st.t += 1;
    ctx.strokeStyle = rgba(pal[0], 0.85); ctx.lineWidth = 1.2;
    const next = [];
    for (const n of st.nodes) {
      if (n.life > 260) continue;
      let best = null, bd = 1e9;
      for (const a of st.attractors) {
        if (a.hit) continue;
        const d = Math.hypot(a.x - n.x, a.y - n.y);
        if (d < bd) { bd = d; best = a; }
      }
      if (!best || bd < 5) { if (best) best.hit = true; continue; }
      const want = Math.atan2(best.y - n.y, best.x - n.x);
      let da = ((want - n.a + Math.PI * 3) % (Math.PI * 2)) - Math.PI;
      n.a += clamp(da, -0.22, 0.22);
      if (m) {
        const dm = Math.hypot(m.x * w - n.x, m.y * h - n.y);
        if (dm < 90) n.a += Math.sin(t * 3 + n.life) * 0.12;
      }
      const nx = n.x + Math.cos(n.a) * 2.4, ny = n.y + Math.sin(n.a) * 2.4;
      ctx.beginPath(); ctx.moveTo(n.x, n.y); ctx.lineTo(nx, ny); ctx.stroke();
      n.x = nx; n.y = ny; n.life++;
      next.push(n);
      if (n.life % 26 === 0 && st.nodes.length < 420) next.push({ x: n.x, y: n.y, a: n.a + (Math.random() - 0.5) * 1.5, life: 0 });
    }
    st.nodes = next.length ? next : [{ x: w / 2, y: h * 0.92, a: -Math.PI / 2, life: 0 }];
    if (st.t % 900 === 0) {
      ctx.fillStyle = rgba(pal[2], 0.5); ctx.fillRect(0, 0, w, h);
      st.attractors.forEach(a => { a.hit = false; });
    }
  },

  /* --- scanline glitch --- */
  glitch(ctx, w, h, t, pal, m, st) {
    if (!st.base) {
      st.base = document.createElement('canvas'); st.base.width = w; st.base.height = h;
      const bctx = st.base.getContext('2d');
      const g = bctx.createLinearGradient(0, 0, w, h);
      g.addColorStop(0, pal[2]); g.addColorStop(0.5, rgba(pal[0], 0.5)); g.addColorStop(1, pal[1]);
      bctx.fillStyle = g; bctx.fillRect(0, 0, w, h);
      bctx.strokeStyle = rgba('#ffffff', 0.14);
      for (let i = 0; i < 40; i++) { bctx.beginPath(); bctx.moveTo(0, i * h / 40); bctx.lineTo(w, i * h / 40); bctx.stroke(); }
      st.w = w; st.h = h;
    }
    if (st.w !== w || st.h !== h) { st.base = null; return; }
    ctx.drawImage(st.base, 0, 0);
    const slices = 9;
    for (let i = 0; i < slices; i++) {
      const y = Math.random() * h;
      const sh = 3 + Math.random() * (h * 0.09);
      const dx = (Math.random() - 0.5) * w * (0.06 + (m ? Math.abs(m.x - 0.5) * 0.18 : 0));
      ctx.drawImage(st.base, 0, y, w, sh, dx, y, w, sh);
      if (Math.random() < 0.3) {
        ctx.fillStyle = rgba(Math.random() < 0.5 ? pal[0] : pal[1], 0.22);
        ctx.fillRect(dx, y, w, sh);
      }
    }
    ctx.fillStyle = rgba('#ffffff', 0.05 + Math.abs(Math.sin(t * 7)) * 0.05);
    for (let y = 0; y < h; y += 3) ctx.fillRect(0, y, w, 1);
  },

  /* --- shaded sculpture study (2D impression of the hero object) --- */
  sculpt(ctx, w, h, t, pal, m) {
    const g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, '#0d0d11'); g.addColorStop(1, pal[2]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const cx = w * 0.5 + (m ? (m.x - 0.5) * 24 : 0);
    const cy = h * 0.56;
    for (let i = 26; i >= 0; i--) {
      const p = i / 26;
      const rr = Math.min(w, h) * (0.06 + p * 0.34);
      const yy = cy - p * h * 0.34 + Math.sin(t * 0.5 + p * 4) * 4;
      const shade = 0.06 + (1 - p) * 0.5;
      ctx.beginPath();
      ctx.ellipse(cx + Math.sin(p * 5 + t * 0.4) * 6, yy, rr * (0.55 + Math.sin(p * 3.2) * 0.2), rr * 0.34, 0, 0, 6.283);
      const lg = ctx.createLinearGradient(cx - rr, yy - rr * 0.4, cx + rr, yy + rr * 0.4);
      lg.addColorStop(0, rgba(pal[1], shade * 0.9));
      lg.addColorStop(0.45, rgba('#ffffff', shade * 0.5));
      lg.addColorStop(1, rgba(pal[0], shade * 0.6));
      ctx.fillStyle = lg; ctx.fill();
    }
  },

  /* --- isometric digital architecture --- */
  arch(ctx, w, h, t, pal, m, st) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    const N = 9;
    const cw = w / N * 0.86, ch = h / N * 0.5;
    const ox = w * 0.5 + (m ? (m.x - 0.5) * 26 : 0), oy = h * 0.52 + (m ? (m.y - 0.5) * 16 : 0);
    for (let y = 0; y < N; y++) {
      for (let x = 0; x < N; x++) {
        const iso_x = ox + (x - y) * cw * 0.62;
        const iso_y = oy + (x + y) * ch * 0.62;
        const hgt = (fbm2(x * 0.4 + t * 0.18, y * 0.4 - t * 0.12) + 0.6) * h * 0.13;
        const a = clamp(0.25 + (x + y) / (N * 2), 0, 1);
        ctx.fillStyle = rgba(pal[0], a * 0.85);
        ctx.beginPath();
        ctx.moveTo(iso_x, iso_y - hgt);
        ctx.lineTo(iso_x + cw * 0.62, iso_y + ch * 0.62 - hgt);
        ctx.lineTo(iso_x, iso_y + ch * 1.24 - hgt);
        ctx.lineTo(iso_x - cw * 0.62, iso_y + ch * 0.62 - hgt);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = rgba(pal[1], a * 0.32);
        ctx.beginPath();
        ctx.moveTo(iso_x - cw * 0.62, iso_y + ch * 0.62 - hgt);
        ctx.lineTo(iso_x, iso_y + ch * 1.24 - hgt);
        ctx.lineTo(iso_x, iso_y + ch * 1.24);
        ctx.lineTo(iso_x - cw * 0.62, iso_y + ch * 0.62);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = rgba('#000000', 0.32);
        ctx.beginPath();
        ctx.moveTo(iso_x + cw * 0.62, iso_y + ch * 0.62 - hgt);
        ctx.lineTo(iso_x, iso_y + ch * 1.24 - hgt);
        ctx.lineTo(iso_x, iso_y + ch * 1.24);
        ctx.lineTo(iso_x + cw * 0.62, iso_y + ch * 0.62);
        ctx.closePath(); ctx.fill();
      }
    }
  },

  /* --- glowing wireframe icosphere (2D projection) --- */
  wire(ctx, w, h, t, pal, m, st) {
    ctx.fillStyle = pal[2]; ctx.fillRect(0, 0, w, h);
    if (!st.verts) {
      const verts = [], edges = [];
      const phi = (1 + Math.sqrt(5)) / 2;
      const base = [[-1, phi, 0], [1, phi, 0], [-1, -phi, 0], [1, -phi, 0], [0, -1, phi], [0, 1, phi], [0, -1, -phi], [0, 1, -phi], [phi, 0, -1], [phi, 0, 1], [-phi, 0, -1], [-phi, 0, 1]];
      base.forEach(v => { const l = Math.hypot(v[0], v[1], v[2]); verts.push([v[0] / l, v[1] / l, v[2] / l]); });
      for (let i = 0; i < verts.length; i++) for (let j = i + 1; j < verts.length; j++) {
        const d = Math.hypot(verts[i][0] - verts[j][0], verts[i][1] - verts[j][1], verts[i][2] - verts[j][2]);
        if (d < 1.1) edges.push([i, j]);
      }
      /* subdivide once for a denser cage */
      const added = [];
      edges.forEach(([a, b]) => {
        const v = [(verts[a][0] + verts[b][0]) / 2, (verts[a][1] + verts[b][1]) / 2, (verts[a][2] + verts[b][2]) / 2];
        const l = Math.hypot(v[0], v[1], v[2]);
        added.push([v[0] / l, v[1] / l, v[2] / l]);
      });
      st.verts = verts.concat(added);
      const E = [];
      for (let i = 0; i < st.verts.length; i++) for (let j = i + 1; j < st.verts.length; j++) {
        const d = Math.hypot(st.verts[i][0] - st.verts[j][0], st.verts[i][1] - st.verts[j][1], st.verts[i][2] - st.verts[j][2]);
        if (d < 0.78) E.push([i, j]);
      }
      st.edges = E;
    }
    const R = Math.min(w, h) * 0.34;
    const cx = w / 2 + (m ? (m.x - 0.5) * 24 : 0), cy = h / 2 + (m ? (m.y - 0.5) * 20 : 0);
    const ax = t * 0.32, ay = t * 0.45;
    const proj = st.verts.map(v => {
      let [x, y, z] = v;
      let c = Math.cos(ay), s = Math.sin(ay);
      let x1 = x * c - z * s, z1 = x * s + z * c;
      c = Math.cos(ax); s = Math.sin(ax);
      let y1 = y * c - z1 * s, z2 = y * s + z1 * c;
      const k = 2.4 / (2.4 + z2);
      return [cx + x1 * R * k, cy + y1 * R * k, z2, k];
    });
    ctx.lineWidth = 1;
    for (const [a, b] of st.edges) {
      const A = proj[a], B = proj[b];
      const depth = clamp((A[2] + B[2]) * 0.5 + 1, 0, 2) / 2;
      ctx.strokeStyle = rgba(depth > 0.55 ? pal[1] : pal[0], 0.14 + depth * 0.5);
      ctx.beginPath(); ctx.moveTo(A[0], A[1]); ctx.lineTo(B[0], B[1]); ctx.stroke();
    }
    for (const p of proj) {
      ctx.fillStyle = rgba('#ffffff', clamp(p[3] - 0.6, 0, 1) * 0.6);
      ctx.beginPath(); ctx.arc(p[0], p[1], 1.1 * p[3], 0, 6.283); ctx.fill();
    }
  },

  /* --- abstract portrait renders (three variants, no stock faces) --- */
  'portrait-a': portraitFactory(0),
  'portrait-b': portraitFactory(1),
  'portrait-c': portraitFactory(2)
};


/* --- cinematic "footage": anamorphic lights, film-stock drift, grain --- */
painters.film = function film(ctx, w, h, t, pal, m, st) {
  if (!st.grain) {
    const gc = document.createElement('canvas');
    gc.width = gc.height = 128;
    const g = gc.getContext('2d');
    const img = g.createImageData(128, 128);
    for (let i = 0; i < img.data.length; i += 4) {
      const v = 110 + Math.random() * 90;
      img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
      img.data[i + 3] = 255;
    }
    g.putImageData(img, 0, 0);
    st.grain = gc;
  }

  /* base plate — slow camera drift */
  const pan = Math.sin(t * 0.13) * w * 0.06, tilt = Math.cos(t * 0.11) * h * 0.05;
  const bg = ctx.createLinearGradient(0, 0, w * 0.4 + pan, h);
  bg.addColorStop(0, '#05050a');
  bg.addColorStop(0.5, pal[2] || '#0b0b0c');
  bg.addColorStop(1, '#020204');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  /* key lights */
  ctx.globalCompositeOperation = 'lighter';
  const lights = [
    { p: pal[0], sx: 0.34, sy: 0.4, r: 0.62, sp: 0.21, ph: 0 },
    { p: pal[1], sx: 0.7, sy: 0.58, r: 0.5, sp: 0.17, ph: 2.1 },
    { p: '#ffffff', sx: 0.52, sy: 0.3, r: 0.3, sp: 0.29, ph: 4.2 }
  ];
  for (const L of lights) {
    const x = w * (L.sx + Math.sin(t * L.sp + L.ph) * 0.2) + pan * 0.6 + (m ? (m.x - 0.5) * w * 0.1 : 0);
    const y = h * (L.sy + Math.cos(t * L.sp * 0.8 + L.ph) * 0.16) + tilt * 0.6;
    const r = Math.max(w, h) * L.r;
    const g = ctx.createRadialGradient(x, y, 0, x, y, r);
    const c = hexToRgb(L.p);
    g.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0.5)`);
    g.addColorStop(0.35, `rgba(${c[0]},${c[1]},${c[2]},0.16)`);
    g.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);

    /* anamorphic streak */
    const sg = ctx.createLinearGradient(x - r * 1.5, y, x + r * 1.5, y);
    sg.addColorStop(0, `rgba(${c[0]},${c[1]},${c[2]},0)`);
    sg.addColorStop(0.5, `rgba(${c[0]},${c[1]},${c[2]},0.2)`);
    sg.addColorStop(1, `rgba(${c[0]},${c[1]},${c[2]},0)`);
    ctx.fillStyle = sg;
    ctx.fillRect(0, y - h * 0.012, w, h * 0.024);
  }

  /* drifting light bands (volumetric sweep) */
  for (let i = 0; i < 3; i++) {
    const y = ((t * (12 + i * 7) + i * h * 0.4) % (h * 1.4)) - h * 0.2;
    const g = ctx.createLinearGradient(0, y - h * 0.1, 0, y + h * 0.1);
    g.addColorStop(0, 'rgba(255,255,255,0)');
    g.addColorStop(0.5, 'rgba(255,255,255,0.045)');
    g.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = g;
    ctx.fillRect(0, y - h * 0.1, w, h * 0.2);
  }
  ctx.globalCompositeOperation = 'source-over';

  /* film grain */
  ctx.globalAlpha = 0.075;
  ctx.globalCompositeOperation = 'overlay';
  const ox = (Math.random() * 128) | 0, oy = (Math.random() * 128) | 0;
  for (let y = -oy; y < h; y += 128) for (let x = -ox; x < w; x += 128) ctx.drawImage(st.grain, x, y);
  ctx.globalAlpha = 1;
  ctx.globalCompositeOperation = 'source-over';

  /* vignette */
  const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.72);
  vg.addColorStop(0, 'rgba(0,0,0,0)');
  vg.addColorStop(1, 'rgba(0,0,0,0.72)');
  ctx.fillStyle = vg;
  ctx.fillRect(0, 0, w, h);
};

function portraitFactory(variant) {
  return function portrait(ctx, w, h, t, pal, m) {
    const g = ctx.createLinearGradient(0, 0, w * 0.4, h);
    g.addColorStop(0, pal[2]);
    g.addColorStop(0.6, rgba(pal[0], 0.35));
    g.addColorStop(1, '#07070a');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);

    const cx = w * (0.5 + (m ? (m.x - 0.5) * 0.05 : 0));
    const cy = h * 0.42;
    const headW = w * 0.26, headH = h * 0.2;

    /* shoulders */
    ctx.beginPath();
    ctx.moveTo(cx - w * 0.5, h);
    ctx.quadraticCurveTo(cx - w * 0.3, cy + headH * 1.9, cx, cy + headH * 1.55);
    ctx.quadraticCurveTo(cx + w * 0.3, cy + headH * 1.9, cx + w * 0.5, h);
    ctx.closePath();
    const sg = ctx.createLinearGradient(cx - headW, cy, cx + headW * 1.6, h);
    sg.addColorStop(0, rgba(pal[1], 0.42));
    sg.addColorStop(0.5, rgba('#ffffff', 0.1));
    sg.addColorStop(1, rgba(pal[0], 0.28));
    ctx.fillStyle = sg; ctx.fill();

    /* head */
    ctx.beginPath();
    ctx.ellipse(cx, cy, headW * (variant === 1 ? 0.86 : 1), headH * (variant === 2 ? 1.12 : 1), variant * 0.06, 0, 6.283);
    const hg = ctx.createLinearGradient(cx - headW, cy - headH, cx + headW, cy + headH);
    hg.addColorStop(0, rgba('#ffffff', 0.5));
    hg.addColorStop(0.35, rgba(pal[1], 0.42));
    hg.addColorStop(0.75, rgba(pal[0], 0.4));
    hg.addColorStop(1, rgba('#000000', 0.6));
    ctx.fillStyle = hg; ctx.fill();

    /* rim light that follows the cursor */
    const lx = cx + (m ? (m.x - 0.5) * w * 0.7 : Math.sin(t * 0.4) * w * 0.2);
    const ly = cy + (m ? (m.y - 0.5) * h * 0.5 : Math.cos(t * 0.3) * h * 0.1);
    const rg = ctx.createRadialGradient(lx, ly, 0, lx, ly, Math.max(w, h) * 0.55);
    rg.addColorStop(0, rgba('#ffffff', 0.3));
    rg.addColorStop(0.4, rgba(pal[0], 0.1));
    rg.addColorStop(1, rgba('#000000', 0));
    ctx.fillStyle = rg; ctx.fillRect(0, 0, w, h);

    /* grade + grain */
    ctx.fillStyle = rgba(pal[0], 0.08); ctx.fillRect(0, 0, w, h);
    for (let i = 0; i < 900; i++) {
      ctx.fillStyle = rgba('#ffffff', Math.random() * 0.05);
      ctx.fillRect(Math.random() * w, Math.random() * h, 1, 1);
    }
    if (variant === 1) {
      ctx.strokeStyle = rgba('#ffffff', 0.07); ctx.lineWidth = 1;
      for (let y = 0; y < h; y += 4) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }
    }
    if (variant === 2) {
      ctx.globalCompositeOperation = 'lighter';
      for (let i = 0; i < 3; i++) {
        const rg2 = ctx.createRadialGradient(w * (0.2 + i * 0.3), h * 0.8, 0, w * (0.2 + i * 0.3), h * 0.8, w * 0.4);
        rg2.addColorStop(0, rgba(pal[1], 0.16)); rg2.addColorStop(1, rgba(pal[1], 0));
        ctx.fillStyle = rg2; ctx.fillRect(0, 0, w, h);
      }
      ctx.globalCompositeOperation = 'source-over';
    }
  };
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/* ------------------------------------------------------------------ manager */
const HEAVY = { reaction: 26, voronoi: 28, plasma: 34, growth: 40, arch: 34, terrain: 40, portrait: 30 };

export const anim = {
  items: [],
  io: null,
  running: true,
  last: 0,

  init() {
    if (this.io || !('IntersectionObserver' in window)) return;
    this.io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        const item = this.items.find(i => i.canvas === e.target);
        if (item) item.inView = e.isIntersecting && e.intersectionRatio > 0.01;
      });
    }, { rootMargin: '120px 0px', threshold: [0, 0.02, 0.5] });
  },

  add(canvas, kind, pal, opts = {}) {
    if (!canvas || !painters[kind]) return null;
    this.init();
    const ctx = canvas.getContext('2d', { alpha: false, desynchronized: true });
    const host = opts.host || canvas.parentElement || canvas;
    const item = {
      canvas, ctx, kind, pal: pal || ['#ff4d1f', '#4f46e5', '#0b0b0c'],
      st: {}, mouse: null, t0: Math.random() * 120,
      active: opts.active !== false,
      force: !!opts.force,
      inView: false,
      group: opts.group || null,
      fps: opts.fps || HEAVY[kind] || (kind.indexOf('portrait') === 0 ? HEAVY.portrait : 60),
      acc: 0,
      interactive: opts.interactive !== false && !DEVICE.touch,
      host
    };
    if (item.interactive) {
      item.onMove = e => {
        const r = host.getBoundingClientRect();
        item.mouse = { x: (e.clientX - r.left) / Math.max(1, r.width), y: (e.clientY - r.top) / Math.max(1, r.height) };
        host.style.setProperty('--mx', item.mouse.x.toFixed(3));
        host.style.setProperty('--my', item.mouse.y.toFixed(3));
      };
      item.onLeave = () => { item.mouse = null; };
      host.addEventListener('mousemove', item.onMove, { passive: true });
      host.addEventListener('mouseleave', item.onLeave);
    }
    if (this.io) this.io.observe(canvas);
    this.items.push(item);
    return item;
  },

  fit(item) {
    const c = item.canvas;
    const r = c.getBoundingClientRect();
    if (!r.width || !r.height) return false;
    const dpr = Math.min(window.devicePixelRatio || 1, item.fps > 45 ? 1.45 : 1.1);
    const w = Math.max(2, Math.round(r.width * dpr));
    const h = Math.max(2, Math.round(r.height * dpr));
    if (c.width !== w || c.height !== h) {
      c.width = w; c.height = h;
      item.st = {}; /* state is size-dependent — reset it */
    }
    return true;
  },

  tick(t, dt) {
    if (!this.running) return;
    for (let i = 0; i < this.items.length; i++) {
      const item = this.items[i];
      if (!item.active) continue;
      if (!item.force && !item.inView) continue;
      item.acc += dt;
      const step = 1 / Math.max(1, item.fps);
      if (item.acc < step) continue;
      item.acc = 0;
      if (!this.fit(item)) continue;
      const fn = painters[item.kind];
      try {
        fn(item.ctx, item.canvas.width, item.canvas.height, t + item.t0, item.pal, item.mouse, item.st);
      } catch (err) {
        console.warn('[anim]', item.kind, err);
        item.active = false;
      }
    }
  },

  has(kind) { return !!painters[kind]; },

  setGroup(group, active) {
    this.items.forEach(i => { if (i.group === group) i.active = active; });
  },

  destroyGroup(group) {
    this.items.filter(i => i.group === group).forEach(i => this.destroy(i));
  },

  destroy(item) {
    if (!item) return;
    if (this.io) this.io.unobserve(item.canvas);
    if (item.onMove) {
      item.host.removeEventListener('mousemove', item.onMove);
      item.host.removeEventListener('mouseleave', item.onLeave);
    }
    const c = item.canvas;
    if (c && c.width) { c.width = 1; c.height = 1; }
    item.st = null;
    this.items = this.items.filter(i => i !== item);
  },

  destroyAll() {
    this.items.slice().forEach(i => this.destroy(i));
    this.items.length = 0;
  }
};
