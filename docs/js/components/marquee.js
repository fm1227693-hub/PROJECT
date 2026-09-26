/* =====================================================================
   COMPONENTS / MARQUEE
   Two marquees (home strip + about partners). Speed, direction and skew
   are driven by measured scroll velocity — they accelerate with you,
   reverse when you scroll up, and settle back to a drift when you stop.
   ===================================================================== */
import { gsap } from '../core/vendor.js';
import { state } from '../core/state.js';
import { DEVICE } from '../core/config.js';

export function createMarquee(el, opts = {}) {
  if (!el) return null;
  const items = opts.items || [];
  const html = items.map((t, i) =>
    `<span class="item${i % 3 === 2 ? ' outline' : ''}">${t}<i></i></span>`).join('');
  el.innerHTML = html + html;

  const sets = el.querySelectorAll('.item');
  const half = sets.length / 2;
  let x = 0;
  let active = true;
  let width = 0;

  function measure() {
    if (!sets.length) return;
    width = 0;
    for (let i = 0; i < half; i++) width += sets[i].getBoundingClientRect().width;
  }
  measure();

  const tick = dt => {
    if (!active || !width) return;
    const dir = state.direction >= 0 ? 1 : -1;
    const boost = 1 + Math.abs(state.velocity) * 3.4 * (dir > 0 ? 1 : 1.6);
    const base = opts.speed || (DEVICE.touch ? 34 : 52);
    x -= base * boost * dt * (dir > 0 ? 1 : -0.55);
    if (x < -width) x += width;
    if (x > 0) x -= width;
    el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    const skew = Math.max(-4, Math.min(4, state.velocity * 3.2));
    el.style.setProperty('--skew', skew.toFixed(2) + 'deg');
    el.style.filter = Math.abs(state.velocity) > 0.45 ? `blur(${(Math.abs(state.velocity) * 1.1).toFixed(2)}px)` : '';
  };

  const ro = new ResizeObserver(() => measure());
  ro.observe(el.parentElement || el);

  return {
    el,
    start() { active = true; },
    stop() { active = false; },
    ticker: tick,
    measure,
    destroy() { ro.disconnect(); el.innerHTML = ''; }
  };
}

/* brand marquee for the about page: simpler, no skew, hover pauses */
export function createBrandMarquee(el, brands) {
  if (!el) return null;
  el.innerHTML = brands.map(b => `<span>${b}</span>`).join('');
  el.innerHTML += el.innerHTML;
  const kids = el.children;
  const half = kids.length / 2;
  let x = 0, width = 0, paused = false;

  function measure() {
    width = 0;
    for (let i = 0; i < half; i++) width += kids[i].getBoundingClientRect().width;
  }
  measure();
  el.addEventListener('mouseenter', () => { paused = true; });
  el.addEventListener('mouseleave', () => { paused = false; });

  const tick = dt => {
    if (!width || paused) return;
    x -= (26 + Math.abs(state.velocity) * 120) * dt;
    if (x < -width) x += width;
    el.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
  };

  const ro = new ResizeObserver(measure);
  ro.observe(el.parentElement || el);
  return { ticker: tick, measure, destroy() { ro.disconnect(); } };
}

export { gsap };
