'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { markBooted } from '@/lib/boot';
import { isReducedMotion } from '@/lib/motion';

/**
 * Preloader — a 1.5 second curtain, not a queue.
 *
 * The wordmark rises letter by letter while a real counter drives the hairline
 * underneath; the moment the curtain starts lifting it marks the boot latch, so
 * the hero timeline plays *with* the wipe instead of after it. Nothing waits on
 * network: the sequence is fixed-length with a failsafe, and reduced motion
 * removes the loader entirely on the first frame.
 */
function lockScroll(locked) {
  const cls = 'is-locked';
  document.documentElement.classList.toggle(cls, locked);
  document.body.classList.toggle(cls, locked);
  const lenis = window.nebulaLenis;
  if (lenis) {
    if (locked) lenis.stop();
    else lenis.start();
  }
}

export default function Preloader() {
  const rootRef = useRef(null);
  const [mounted, setMounted] = useState(false);
  const [done, setDone] = useState(false);

  // First paint renders the curtain on server and client alike (no hydration
  // mismatch); only after mount do we decide whether to animate or discard it.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted || done) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    lockScroll(true);

    if (isReducedMotion()) {
      markBooted();
      lockScroll(false);
      const id = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(id);
    }

    let ctx;
    const finish = () => {
      lockScroll(false);
      setDone(true);
    };

    ctx = gsap.context(() => {
      const letters = root.querySelectorAll('[data-preload-letter]');
      const bar = root.querySelector('[data-preload-bar]');
      const countEl = root.querySelector('[data-preload-count]');
      const sub = root.querySelector('[data-preload-sub]');
      const ghost = root.querySelector('[data-preload-ghost]');
      const count = { v: 0 };

      const tl = gsap.timeline({ onComplete: finish });

      tl.to(
        letters,
        { yPercent: 0, opacity: 1, duration: 0.72, ease: 'expo.out', stagger: 0.05 },
        0.04
      )
        .to(
          count,
          {
            v: 100,
            duration: 0.74,
            ease: 'power2.inOut',
            snap: 'v',
            onUpdate: () => {
              if (countEl) countEl.textContent = String(Math.round(count.v)).padStart(3, '0');
            },
          },
          0.04
        )
        .to(bar, { scaleX: 1, duration: 0.78, ease: 'power2.inOut' }, 0.04)
        .fromTo(ghost, { opacity: 0, scale: 1.06 }, { opacity: 1, scale: 1, duration: 1.4, ease: 'power2.out' }, 0)
        .to(sub, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, 0.42)
        // Exit: letters leave upward through their masks, then the curtain lifts.
        .to(letters, { yPercent: -115, duration: 0.45, ease: 'power3.in', stagger: 0.022 }, 0.9)
        .to(sub, { opacity: 0, duration: 0.25, ease: 'none' }, 0.9)
        .call(markBooted, null, 0.98)
        .to(root, { yPercent: -100, duration: 0.78, ease: 'expo.inOut' }, 0.98)
        .to(bar, { opacity: 0, duration: 0.3 }, 0.98);
    }, root);

    // The curtain can never be allowed to trap the page.
    const failsafe = setTimeout(finish, 3200);

    return () => {
      clearTimeout(failsafe);
      ctx.revert();
      lockScroll(false);
      markBooted();
    };
  }, [mounted, done]);

  if (done) return null;

  return (
    <div ref={rootRef} className="preload">
      <span className="preload__ghost" data-preload-ghost aria-hidden="true">
        N
      </span>
      <div className="relative flex flex-col items-center gap-4 px-6">
        <p className="preload__mark">
          {'NEBULA'.split('').map((ch, i) => (
            <span key={`${ch}-${i}`} className="preload__letter">
              <span data-preload-letter style={{ opacity: 0 }}>
                {ch}
              </span>
            </span>
          ))}
        </p>
        <p
          className="eyebrow flex items-center gap-3 opacity-0"
          data-preload-sub
          style={{ transform: 'translateY(6px)' }}
        >
          <span className="inline-block h-px w-6 bg-ember/70" aria-hidden="true" />
          AI CREATIVE STUDIO — BERLIN
          <span className="inline-block h-px w-6 bg-ember/70" aria-hidden="true" />
        </p>
      </div>

      <div className="preload__foot">
        <p className="eyebrow eyebrow--dim max-w-[22ch]">
          ENTERING THE STUDIO
        </p>
        <p className="preload__count" aria-hidden="true">
          <span data-preload-count>000</span>
          <span className="text-ember">%</span>
        </p>
      </div>

      <div className="preload__bar" aria-hidden="true">
        <span data-preload-bar />
      </div>
      <span className="sr-only">Loading the NEBULA studio experience</span>
    </div>
  );
}
