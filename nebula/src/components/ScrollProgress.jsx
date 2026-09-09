'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap } from '@/lib/animations';

registerGsap();

const SECTIONS = [
  { id: 'hero', label: 'NEBULA' },
  { id: 'capabilities', label: 'CAPABILITIES' },
  { id: 'work', label: 'WORK' },
  { id: 'engine', label: 'ENGINE' },
  { id: 'contact', label: 'CONTACT' },
];

/** How far the thumb travels, as a share of its own height. */
const TRAVEL = 212.5;

/**
 * ScrollProgress — two threads, not two widgets.
 *
 * A 1px hairline across the top reads the whole document, and a right-edge rail
 * (xl screens only, hidden under reduced motion) carries a thumb, a tabular
 * percentage and five ticks. Both are driven by one ScrollTrigger that writes transforms and
 * textContent directly — no React state per scroll frame. The active tick is
 * pure CSS, keyed off the same `data-tone` the section seams already maintain.
 */
export default function ScrollProgress() {
  const barRef = useRef(null);
  const thumbRef = useRef(null);
  const pctRef = useRef(null);

  useEffect(() => {
    // Scroll-linked, instant writes only — no easing, no tween — so this stays
    // on in every motion tier: it mirrors the reader's own movement.
    const bar = barRef.current;
    const thumb = thumbRef.current;
    const pct = pctRef.current;
    if (!bar) return undefined;

    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const p = self.progress;
        gsap.set(bar, { scaleX: p });
        if (thumb) gsap.set(thumb, { yPercent: p * TRAVEL });
        if (pct) pct.textContent = `${String(Math.round(p * 100)).padStart(2, '0')}%`;
      },
    });

    return () => {
      st.kill();
      gsap.set([bar, thumb].filter(Boolean), { clearProps: 'transform' });
    };
  }, []);

  return (
    <>
      <div className="prog" aria-hidden="true">
        <div ref={barRef} className="prog__bar" />
      </div>

      <div className="rail-index" aria-hidden="true">
        <span className="rail-index__pct" ref={pctRef}>
          00%
        </span>
        <span className="rail-index__track">
          <span className="rail-index__thumb" ref={thumbRef} />
        </span>
        <span className="rail-index__ticks">
          {SECTIONS.map((s) => (
            <span key={s.id} className="rail-index__tick" data-for={s.id} title={s.label} />
          ))}
        </span>
      </div>
    </>
  );
}
