'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { cursorStore, bindCursorDelegation } from '@/lib/cursor';
import { subscribePointer } from '@/lib/pointer';
import { useMotionTier } from '@/lib/motion';

/**
 * What each cursor variant looks like. Size is a discrete CSS transition on the
 * ring (hover only, never per frame); the trailing motion and press feedback
 * are GSAP quickTo tweens on transform.
 */
const VARIANT = {
  default: { wide: false, filled: false, dot: 1, hideDot: false },
  expand: { wide: false, filled: false, dot: 2.1, hideDot: false },
  view: { wide: true, filled: false, dot: 0.4, hideDot: true },
  open: { wide: true, filled: false, dot: 0.4, hideDot: true },
  drag: { wide: true, filled: false, dot: 0.4, hideDot: true },
  solid: { wide: true, filled: true, dot: 0.4, hideDot: true },
};

/**
 * CustomCursor — desktop only, one loop for the whole site.
 *
 * A precise dot on the pointer and a ring that trails it. Movement runs through
 * the shared pointer bus with four quickTo tweens — no React state, no extra
 * mousemove system, no layout reads. Hovering a button nudges the dot; hovering
 * a project or a mail line swaps the ring into a labelled lens (VIEW, OPEN,
 * WRITE, DRAG). Disabled on touch and under reduced motion.
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const labelRef = useRef(null);
  const { motion, pointer } = useMotionTier();

  const enabled = motion === 'full' && pointer === 'fine';

  useEffect(() => {
    if (!enabled) return undefined;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return undefined;

    const dx = gsap.quickTo(dot, 'x', { duration: 0.08, ease: 'power2.out' });
    const dy = gsap.quickTo(dot, 'y', { duration: 0.08, ease: 'power2.out' });
    const rx = gsap.quickTo(ring, 'x', { duration: 0.5, ease: 'power3.out' });
    const ry = gsap.quickTo(ring, 'y', { duration: 0.5, ease: 'power3.out' });
    const ds = gsap.quickTo(dot, 'scale', { duration: 0.3, ease: 'power2.out' });
    const rs = gsap.quickTo(ring, 'scale', { duration: 0.35, ease: 'power3.out' });

    let visible = false;
    const show = () => {
      if (visible) return;
      visible = true;
      ring.classList.add('is-live');
      dot.classList.add('is-live');
    };
    const hide = () => {
      if (!visible) return;
      visible = false;
      ring.classList.remove('is-live');
      dot.classList.remove('is-live');
    };

    let primed = false;
    const offPointer = subscribePointer((p, e) => {
      if (!p.inside) {
        hide();
        return;
      }
      if (!primed) {
        // First movement: park both layers on the pointer instantly, otherwise
        // the ring visibly flies in from a stale origin.
        primed = true;
        if (!e) return;
        gsap.set([dot, ring], { x: e.clientX, y: e.clientY });
      }
      show();
      dx(p.x);
      dy(p.y);
      rx(p.x);
      ry(p.y);
    });

    let variant = 'default';
    const applyVariant = (next, label, pressed) => {
      const cfg = VARIANT[next] || VARIANT.default;
      if (next !== variant) {
        variant = next;
        ring.classList.toggle('is-wide', cfg.wide);
        ring.classList.toggle('is-filled', cfg.filled);
        dot.classList.toggle('is-hidden-dot', cfg.hideDot);
      }
      if (labelRef.current) labelRef.current.textContent = label || '';
      ring.classList.toggle('has-label', Boolean(label));
      ring.classList.toggle('is-down', pressed);
      dot.classList.toggle('is-down', pressed);
      ds(pressed ? cfg.dot * 0.7 : cfg.dot);
      rs(pressed ? 0.86 : 1);
    };

    const offStore = cursorStore.subscribe(applyVariant);
    const offDelegation = bindCursorDelegation();
    const onLeave = () => hide();
    document.documentElement.addEventListener('pointerleave', onLeave);

    return () => {
      offPointer();
      offStore();
      offDelegation();
      document.documentElement.removeEventListener('pointerleave', onLeave);
      [dx, dy, rx, ry, ds, rs].forEach((t) => t.tween?.kill());
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true">
        {/* The box carries the discrete state; the parent only ever moves. */}
        <span className="cursor-ring__box" />
        <span ref={labelRef} className="cursor-ring__label" />
      </div>
    </>
  );
}
