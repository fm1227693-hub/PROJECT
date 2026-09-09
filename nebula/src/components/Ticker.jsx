'use client';

import { useEffect, useRef } from 'react';
import { SEAM_TICKER } from '@/data/site';

/**
 * Ticker — the connective tissue between sections. One CSS transform
 * animation on one element (two identical halves so the −50% loop is
 * seamless), paused on hover and switched off entirely the moment it leaves
 * the viewport: an infinite animation should never cost frames nobody can see.
 * No JavaScript per frame, no RAF, no layout work.
 */
export default function Ticker({ items = SEAM_TICKER, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        el.classList.toggle('is-paused', !entry.isIntersecting);
      },
      { rootMargin: '120px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={`ticker ${className}`.trim()} aria-hidden="true">
      <div className="ticker__track">
        {[0, 1].map((half) => (
          <div key={half} className="flex shrink-0">
            {items.map((label) => (
              <span className="ticker__item" key={`${half}-${label}`}>
                {label}
                <span className="ticker__dot" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
