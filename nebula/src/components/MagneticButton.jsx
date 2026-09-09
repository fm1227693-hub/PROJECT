'use client';

import { useEffect, useRef } from 'react';
import { magnetize } from '@/lib/magnetize';
import { useMotionTier } from '@/lib/motion';

/**
 * MagneticButton — the house CTA.
 *
 * Layered background that sweeps up through the border on hover, an arrow in a
 * ring that moves on its own, and pointer attraction on the shell while the
 * label trails behind it at a slower rate. Movement is capped at ~11px, applied
 * with GSAP quickTo on transforms — no React state, no layout properties, and
 * it never runs on touch or reduced motion.
 */
export default function MagneticButton({
  children,
  href,
  onClick,
  variant = 'solid',
  className = '',
  strength = 1,
  cursor = 'expand',
  cursorLabel,
  arrow = true,
  type,
  ariaLabel,
  ...rest
}) {
  const shellRef = useRef(null);
  const innerRef = useRef(null);
  const { motion, pointer } = useMotionTier();

  const enabled = motion === 'full' && pointer === 'fine';

  useEffect(() => {
    if (!enabled || !shellRef.current) return undefined;
    return magnetize(shellRef.current, innerRef.current, { strength });
  }, [enabled, strength]);

  const classes = `btn ${variant === 'solid' ? 'btn--solid' : 'btn--ghost'} ${className}`.trim();

  const inner = (
    <>
      <span className="btn__bg" aria-hidden="true" />
      <span ref={innerRef} className="btn__label">
        {children}
        {arrow ? (
          <span className="btn__arrow" aria-hidden="true">
            ↗
          </span>
        ) : null}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        ref={shellRef}
        href={href}
        className={classes}
        data-cursor={cursor}
        data-cursor-label={cursorLabel || undefined}
        aria-label={ariaLabel}
        onClick={onClick}
        {...rest}
      >
        {inner}
      </a>
    );
  }

  return (
    <button
      ref={shellRef}
      type={type || 'button'}
      className={classes}
      data-cursor={cursor}
      data-cursor-label={cursorLabel || undefined}
      aria-label={ariaLabel}
      onClick={onClick}
      {...rest}
    >
      {inner}
    </button>
  );
}
