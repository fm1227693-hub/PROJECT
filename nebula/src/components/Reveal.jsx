'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { registerGsap, EASE, typeReveal, mediaReveal } from '@/lib/animations';
import { isReducedMotion } from '@/lib/motion';

registerGsap();

/**
 * Reveal — the house entrance, in four dialects:
 *
 *  'up'    block (or its [data-reveal-item] children) rises + fades
 *  'lines' [data-reveal-line] children rise through their masks
 *  'clip'  [data-reveal-media] frames are uncovered, then settle 1.08 → 1
 *  'scale' quiet scale-in for large typographic blocks
 *
 * Every variant plays once. There is no per-frame work after the reveal, which
 * is why a page full of them still scrolls at 60fps.
 */
export default function Reveal({
  as: Tag = 'div',
  children,
  from = 'up',
  delay = 0,
  stagger = 0.08,
  duration = 0.9,
  distance,
  start = 'top 85%',
  className = '',
  ...rest
}) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || isReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const d = typeof distance === 'number' ? distance : 40;

      if (from === 'lines') {
        typeReveal(el.querySelectorAll('[data-reveal-line]'), {
          trigger: el,
          start,
          stagger,
          duration,
          ease: EASE.cinematic,
          delay,
        });
        return;
      }

      if (from === 'clip') {
        const media = el.querySelector('[data-reveal-media]');
        const tl = mediaReveal(el.querySelector('[data-reveal-frame]') || null, media, {
          trigger: el,
          start,
        });
        const meta = el.querySelectorAll('[data-reveal-meta]');
        if (meta.length && tl) {
          tl.fromTo(
            meta,
            { y: 20, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.7,
              ease: EASE.soft,
              stagger: 0.07,
              delay: 0.5,
              clearProps: 'transform',
            },
            0.5
          );
        }
        return;
      }

      if (from === 'scale') {
        gsap.fromTo(
          el,
          { scale: 0.945, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration,
            ease: EASE.soft,
            delay,
            scrollTrigger: { trigger: el, start, once: true },
          }
        );
        return;
      }

      const kids = el.querySelectorAll('[data-reveal-item]');
      gsap.fromTo(
        kids.length ? kids : [el],
        { y: d, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          ease: EASE.out,
          delay,
          stagger: kids.length ? stagger : 0,
          // Hand the transform back to CSS once the entrance is done, so hover
          // states on the same children still work.
          clearProps: kids.length ? 'transform' : '',
          scrollTrigger: { trigger: el, start, once: true },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, [from, delay, stagger, duration, distance, start]);

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  );
}
