/* =====================================================================
   COMPONENTS / COUNTERS
   Physical odometer digits: each numeral is a strip of 0–9 that spins one
   full revolution and settles on the target, staggered left → right with a
   slight overshoot so the numbers feel like machinery, not a tween on text.
   ===================================================================== */
import { gsap, ScrollTrigger } from '../core/vendor.js';
import { DEVICE } from '../core/config.js';

export function bindCounters(root, sys) {
  const els = root.querySelectorAll('[data-count]');
  els.forEach((host, hi) => {
    const target = parseInt(host.dataset.count, 10) || 0;
    const digits = String(target).split('');
    host.innerHTML = '';
    host.classList.add('odo');
    const strips = [];

    digits.forEach(d => {
      const dig = document.createElement('span');
      dig.className = 'dig';
      const strip = document.createElement('span');
      let inner = '';
      for (let r = 0; r < 2; r++) for (let n = 0; n < 10; n++) inner += `<i>${n}</i>`;
      strip.innerHTML = inner;
      dig.appendChild(strip);
      host.appendChild(dig);
      strips.push({ strip, d: parseInt(d, 10) });
    });

    /* start position: one full revolution past the target digit */
    strips.forEach(s => gsap.set(s.strip, { yPercent: -(10 + s.d) * 5 }));

    const st = ScrollTrigger.create({
      trigger: host,
      start: 'top 90%',
      once: true,
      onEnter: () => {
        strips.forEach((s, i) => {
          gsap.to(s.strip, {
            yPercent: -s.d * 5,
            duration: DEVICE.touch ? 1.1 : 1.9,
            delay: i * 0.09,
            ease: 'expo.out',
            overwrite: true
          });
        });
        /* tiny physical jolt on the whole number */
        gsap.fromTo(host, { y: 8 }, { y: 0, duration: 0.9, delay: 0.05 * hi, ease: 'elastic.out(1, 0.6)' });
      }
    });
    sys.add(st);
  });
  return els.length;
}
