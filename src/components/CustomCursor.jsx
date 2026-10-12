import React, { useEffect, useRef } from 'react';

/**
 * Performant Editorial Custom Cursor
 * - Zero React state updates on mousemove (uses direct DOM refs + rAF)
 * - Auto-disabled on touch devices, coarse pointers, and prefers-reduced-motion
 * - Native cursor is never forcibly hidden on touch devices
 */
export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const posRef = useRef({ x: -100, y: -100, targetX: -100, targetY: -100 });
  const rafIdRef = useRef(null);
  const isVisibleRef = useRef(false);

  useEffect(() => {
    // Check if cursor should be active: fine pointer & motion enabled
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!hasFinePointer || prefersReducedMotion) {
      return;
    }

    const onMouseMove = (e) => {
      posRef.current.targetX = e.clientX;
      posRef.current.targetY = e.clientY;
      if (!isVisibleRef.current) {
        isVisibleRef.current = true;
        if (dotRef.current) dotRef.current.style.opacity = '1';
        if (ringRef.current) ringRef.current.style.opacity = '1';
      }
    };

    const onMouseLeave = () => {
      isVisibleRef.current = false;
      if (dotRef.current) dotRef.current.style.opacity = '0';
      if (ringRef.current) ringRef.current.style.opacity = '0';
    };

    const render = () => {
      const pos = posRef.current;
      // Smooth interpolation for the outer ring
      pos.x += (pos.targetX - pos.x) * 0.25;
      pos.y += (pos.targetY - pos.y) * 0.25;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${pos.targetX - 3}px, ${pos.targetY - 3}px, 0)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${pos.x - 18}px, ${pos.y - 18}px, 0)`;
      }

      rafIdRef.current = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    document.addEventListener('mouseleave', onMouseLeave);
    rafIdRef.current = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[99999] overflow-hidden select-none" aria-hidden="true">
      {/* Outer Editorial Crimson Accent Ring */}
      <div
        ref={ringRef}
        className="w-[36px] h-[36px] rounded-full border border-red-500/50 dark:border-red-400/60 opacity-0 transition-opacity duration-300 will-change-transform"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        className="w-[6px] h-[6px] rounded-full bg-red-600 opacity-0 transition-opacity duration-150 will-change-transform shadow-[0_0_8px_rgba(225,29,72,0.8)]"
        style={{ transform: 'translate3d(-100px, -100px, 0)' }}
      />
    </div>
  );
}
