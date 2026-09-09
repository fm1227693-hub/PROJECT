'use client';

import { useEffect, useState } from 'react';

/**
 * Motion tiers resolved from the bootstrap script (see app/layout.js) so the
 * value is identical on the server and the first client render — that keeps
 * hydration clean while still letting components opt out of heavy work.
 *
 * motion:  'reduced' | 'full'
 * pointer: 'fine' | 'coarse'
 */
export function useMotionTier() {
  const [tier, setTier] = useState({ motion: 'full', pointer: 'coarse' });

  useEffect(() => {
    const root = document.documentElement;
    setTier({
      motion: root.dataset.motion === 'reduced' ? 'reduced' : 'full',
      pointer: root.dataset.pointer === 'fine' ? 'fine' : 'coarse',
    });
  }, []);

  return tier;
}

/* Non-React readers, for use inside effects. */
export function isReducedMotion() {
  if (typeof window === 'undefined') return false;
  return document.documentElement.dataset.motion === 'reduced';
}

export function isFinePointer() {
  if (typeof window === 'undefined') return false;
  return document.documentElement.dataset.pointer === 'fine';
}

/** Desktop tier = fine pointer + >=1024px. Pinning/cursor/magnetics live here. */
export function isDesktop() {
  if (typeof window === 'undefined') return false;
  return isFinePointer() && window.innerWidth >= 1024;
}
