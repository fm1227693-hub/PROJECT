'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { registerGsap, drawSeams, EASE } from '@/lib/animations';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';

registerGsap();

/**
 * Seam — the joint between two acts.
 *
 * Every section opens with the same device: a hairline that draws itself
 * across the page, an index, and a label. It is also the switch that hands the
 * global atmosphere the next tone, so leaving one section and entering the next
 * feels like one continuous move rather than a cut.
 */
export default function Seam({ index, label, note, tone, children }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const ctx = gsap.context(() => {
      if (!isReducedMotion()) {
        drawSeams(el, { start: 'top 96%', end: 'top 62%' });
        // The ink field rises out of the joint and dissolves the tail of the
        // section before it — the only transition device the page uses, and it
        // costs one composited layer.
        gsap.fromTo(
          '[data-seam-curtain]',
          { scaleY: 0.12, yPercent: 26, opacity: 0.35 },
          {
            scaleY: 1,
            yPercent: 0,
            opacity: 1,
            ease: EASE.linear,
            transformOrigin: '50% 100%',
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'top 14%', scrub: 0.8 },
          }
        );
      }
      if (tone) {
        const set = () => {
          document.documentElement.dataset.tone = tone;
        };
        ScrollTrigger.create({
          trigger: el,
          start: 'top 78%',
          end: 'bottom 78%',
          onEnter: set,
          onEnterBack: set,
        });
      }
    }, el);

    return () => ctx.revert();
  }, [tone]);

  return (
    <div ref={ref} className="seam" style={{ transform: 'translateZ(0)' }}>
      <span className="seam__curtain" data-seam-curtain aria-hidden="true" />
      <span className="seam__line" data-seam-line aria-hidden="true" />
      <span className="seam__index">{index}</span>
      <span className="eyebrow">{label}</span>
      {note ? <span className="eyebrow eyebrow--dim ml-auto hidden sm:block">{note}</span> : null}
      {children}
    </div>
  );
}

/** A hairline that draws on scroll without any labels — used mid-section. */
