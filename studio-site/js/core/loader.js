/* =====================================================================
   CORE / LOADER
   An honest preloader: the number on screen is the weighted completion of
   real work (fonts, IBL, textures, geometry, DOM art, first frame). It
   never counts to 100 while something is still loading — the only thing we
   add is a short hold so the reveal has rhythm.
   ===================================================================== */
import { gsap } from './vendor.js';
import { byId, clamp } from './utils.js';

export function createLoader(opts = {}) {
  const countEl = opts.countEl || byId('plCount');
  const barEl = opts.barEl || byId('plBar');
  const logEl = opts.logEl || byId('plLog');
  const stageEl = opts.stageEl || byId('plStage');
  const rootEl = opts.rootEl || byId('preloader');

  const tasks = [];
  let total = 0;
  let done = 0;
  let shown = 0;
  let finished = false;
  const started = performance.now();

  function paint(v) {
    shown = v;
    if (countEl) countEl.textContent = String(Math.round(v));
    if (barEl) barEl.style.width = v.toFixed(2) + '%';
  }

  function logLine(name, status) {
    if (!logEl) return;
    let li = logEl.querySelector(`[data-task="${name}"]`);
    if (!li) {
      li = document.createElement('li');
      li.dataset.task = name;
      li.innerHTML = `<i></i><span>${name}</span>`;
      logEl.appendChild(li);
      requestAnimationFrame(() => li.classList.add('on'));
    }
    if (status === 'done') {
      li.classList.add('done');
      li.querySelector('span').textContent = name + ' ✓';
    } else if (status === 'skip') {
      li.classList.add('done');
      li.querySelector('span').textContent = name + ' · skipped';
    }
    /* keep only the last 4 lines visible */
    const all = Array.prototype.slice.call(logEl.children);
    all.forEach((n, i) => { n.style.opacity = i >= all.length - 4 ? '' : '0.25'; });
  }

  return {
    /** Register a unit of real work. `weight` is its share of 100%. */
    task(name, weight, fn) {
      total += weight;
      tasks.push({ name, weight, fn });
      return this;
    },

    stage(text) { if (stageEl) stageEl.textContent = text; return this; },

    async run(minDuration = 900) {
      paint(0);
      for (let i = 0; i < tasks.length; i++) {
        const t = tasks[i];
        this.stage(t.name);
        logLine(t.name, 'loading');
        let ok = true;
        try {
          await t.fn(p => paint(clamp((done + t.weight * clamp(p, 0, 1)) / Math.max(1, total) * 100, 0, 100)));
        } catch (err) {
          ok = false;
          console.warn('[loader] task failed:', t.name, err);
        }
        done += t.weight;
        paint(clamp(done / Math.max(1, total) * 100, 0, 100));
        logLine(t.name, ok ? 'done' : 'skip');
      }
      finished = true;
      paint(100);
      const elapsed = performance.now() - started;
      if (elapsed < minDuration) await new Promise(r => setTimeout(r, minDuration - elapsed));
      return true;
    },

    /** Outro: lift the curtain, then hand over to the intro choreography. */
    async reveal(onComplete) {
      if (!rootEl) { onComplete && onComplete(); return; }
      this.stage('ready');
      const tl = gsap.timeline({ onComplete: () => onComplete && onComplete() });
      tl.to('#preloader .pl-mid, #preloader .pl-top, #preloader .pl-bottom', {
        y: -26, opacity: 0, duration: 0.55, stagger: 0.05, ease: 'power3.in'
      })
        .to(rootEl, { yPercent: -101, duration: 1.05, ease: 'expo.inOut' }, '-=0.25')
        .add(() => {
          if (rootEl.parentNode) rootEl.parentNode.removeChild(rootEl);
        });
      return tl;
    },

    get progress() { return shown; },
    get isFinished() { return finished; }
  };
}
