/* =====================================================================
   CORE / PERF
   Real frame measurement + an adaptive quality governor.

   The FPS badge is never a marketing number: it is measured from rAF deltas
   over a rolling window. If the machine cannot hold the budget, the world
   steps down (DPR → MSAA → bloom → particles → shadows) and can step back
   up once if headroom appears.
   ===================================================================== */
import { state, bus } from './state.js';
import { DEVICE } from './config.js';
import { byId, clamp } from './utils.js';
import { setTier, world } from './scene.js';

const WINDOW_MS = 520;

export const perf = {
  fps: 0,
  best: 0,
  frames: 0,
  acc: 0,
  samples: [],
  initialTier: DEVICE.tier,
  steppedDown: 0,
  steppedUp: false,
  els: {},
  lowCount: 0,
  highCount: 0,
  enabled: true,

  init() {
    this.els = {
      badge: byId('fpsBadge'),
      stat: byId('statFps'),
      lab: byId('labFps'),
      foot: byId('footTech')
    };
    bus.on('quality', tier => this.paint(tier));
    this.paint(state.quality);
  },

  paint(tier) {
    const names = ['minimal', 'balanced', 'full'];
    if (this.els.badge) {
      this.els.badge.textContent = (this.fps ? Math.round(this.fps) + ' FPS' : '–– FPS');
      this.els.badge.classList.toggle('warn', this.fps > 0 && this.fps < 45);
      this.els.badge.title = `Measured frame rate · quality: ${names[tier !== undefined ? tier : state.quality]}`;
    }
    if (this.els.foot) {
      this.els.foot.textContent = `Real-time · WebGL · quality ${names[tier !== undefined ? tier : state.quality]}`;
    }
  },

  /** called once per rendered frame with the frame delta in seconds */
  update(dt) {
    if (!this.enabled) return;
    this.frames++;
    this.acc += dt;
    if (this.acc * 1000 < WINDOW_MS) return;

    this.fps = this.frames / this.acc;
    this.frames = 0;
    this.acc = 0;
    this.samples.push(this.fps);
    if (this.samples.length > 12) this.samples.shift();
    this.best = Math.max(this.best, this.fps);

    if (this.els.badge) {
      this.els.badge.textContent = Math.round(this.fps) + ' FPS';
      this.els.badge.classList.toggle('warn', this.fps < 45);
    }
    if (this.els.stat) this.els.stat.textContent = Math.round(this.fps) + ' fps';
    if (this.els.lab) this.els.lab.textContent = Math.round(this.fps) + ' fps · ' + (world.renderMode === 'composer' ? 'post fx' : 'direct');

    this.govern();
  },

  govern() {
    if (DEVICE.reduced) return;
    const avg = this.samples.slice(-4).reduce((a, b) => a + b, 0) / Math.min(4, this.samples.length || 1);

    if (avg < 43 && this.samples.length >= 3) {
      this.lowCount++;
      this.highCount = 0;
      if (this.lowCount >= 2 && state.quality > 0) {
        this.lowCount = 0;
        this.steppedDown++;
        setTier(state.quality - 1);
        this.samples.length = 0;
        bus.emit('quality-drop', state.quality);
      }
    } else if (avg > 58) {
      this.highCount++;
      this.lowCount = 0;
      /* one careful step back up, only if we downgraded earlier */
      if (this.highCount >= 8 && !this.steppedUp && this.steppedDown > 0 && state.quality < this.initialTier) {
        this.steppedUp = true;
        this.highCount = 0;
        setTier(state.quality + 1);
        this.samples.length = 0;
      }
    } else {
      this.lowCount = 0;
      this.highCount = clamp(this.highCount - 1, 0, 99);
    }
  },

  reset() {
    this.samples.length = 0;
    this.lowCount = 0;
    this.highCount = 0;
  }
};
