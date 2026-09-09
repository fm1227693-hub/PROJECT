import gsap from 'gsap';
import { subscribePointer } from '@/lib/pointer';

/**
 * Magnetic pointer attraction for CTAs.
 *
 * The shell is pulled toward the cursor while the label trails at a slower
 * rate — two sheets of glass sliding against each other, which reads as depth
 * without a single pixel of layout change.
 *
 * Cost control: geometry is measured once per engagement and refreshed at most
 * every ~110ms (never per frame), so a write-then-read layout thrash is
 * impossible. Movement is capped, driven by four `quickTo` tweens fed by the
 * shared pointer bus, and callers disable it for touch and reduced motion.
 */
export function magnetize(shell, inner, { strength = 1, max = 11, innerMax = 6 } = {}) {
  if (!shell) return () => {};

  const shellMax = max * strength;
  const labelMax = innerMax * strength;

  const getX = gsap.getProperty(shell, 'x');
  const getY = gsap.getProperty(shell, 'y');
  const xTo = gsap.quickTo(shell, 'x', { duration: 0.55, ease: 'power3.out' });
  const yTo = gsap.quickTo(shell, 'y', { duration: 0.55, ease: 'power3.out' });
  const lxTo = inner ? gsap.quickTo(inner, 'x', { duration: 0.75, ease: 'power3.out' }) : null;
  const lyTo = inner ? gsap.quickTo(inner, 'y', { duration: 0.75, ease: 'power3.out' }) : null;

  let rect = null;
  let measuredAt = 0;
  let engaged = false;

  const measure = (force = false) => {
    const now = performance.now();
    if (!force && rect && now - measuredAt < 110) return rect;
    measuredAt = now;
    const box = shell.getBoundingClientRect();
    // Subtract our own offset, otherwise a mid-drag refresh would drift the
    // cached centre along with the button and quietly weaken the pull.
    rect = {
      left: box.left - (Number(getX()) || 0),
      top: box.top - (Number(getY()) || 0),
      width: box.width,
      height: box.height,
    };
    return rect;
  };

  const reset = () => {
    if (!engaged) return;
    engaged = false;
    delete shell.dataset.magnet;
    xTo(0);
    yTo(0);
    lxTo?.(0);
    lyTo?.(0);
  };

  const onPointer = (p) => {
    if (!p.inside) {
      reset();
      return;
    }
    const r = measure();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const dx = p.x - cx;
    const dy = p.y - cy;

    // Engagement radius: a soft field around the button, not the whole page.
    const radiusX = r.width / 2 + 68;
    const radiusY = r.height / 2 + 52;
    if (Math.abs(dx) > radiusX || Math.abs(dy) > radiusY) {
      reset();
      return;
    }
    if (!engaged) {
      engaged = true;
      measure(true);
      shell.dataset.magnet = 'on';
      return;
    }

    // Falloff is normalised so corners pull less than the centre.
    const fx = 1 - Math.min(1, Math.abs(dx) / radiusX);
    const fy = 1 - Math.min(1, Math.abs(dy) / radiusY);
    const pull = 0.35 + 0.65 * fx * fy;

    xTo(clamp(dx * 0.3 * pull, shellMax));
    yTo(clamp(dy * 0.42 * pull, shellMax));
    lxTo?.(clamp(dx * 0.14 * pull, labelMax));
    lyTo?.(clamp(dy * 0.2 * pull, labelMax));
  };

  // A scroll changes the distance between the button and the viewport, so the
  // cache is dropped — the next move re-measures, once.
  const invalidate = () => {
    rect = null;
  };
  const onLeaveDoc = () => reset();

  window.addEventListener('scroll', invalidate, { passive: true });
  window.addEventListener('resize', invalidate);
  document.documentElement.addEventListener('pointerleave', onLeaveDoc);
  const offPointer = subscribePointer(onPointer);

  return () => {
    offPointer();
    window.removeEventListener('scroll', invalidate);
    window.removeEventListener('resize', invalidate);
    document.documentElement.removeEventListener('pointerleave', onLeaveDoc);
    xTo.tween?.kill();
    yTo.tween?.kill();
    lxTo?.tween?.kill();
    lyTo?.tween?.kill();
    delete shell.dataset.magnet;
    gsap.set([shell, inner].filter(Boolean), { clearProps: 'transform' });
  };
}

function clamp(v, limit) {
  return Math.max(-limit, Math.min(limit, v));
}
