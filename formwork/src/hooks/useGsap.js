import { useLayoutEffect } from 'react'
import { gsap } from '../lib/gsap'

/**
 * Runs GSAP code inside a gsap.context scoped to `scopeRef`, and reverts everything
 * (tweens, ScrollTriggers, SplitText instances created inside) on unmount.
 *
 *   useGsap((ctx, scopeEl) => { ... }, scopeRef, [deps])
 */
export function useGsap(setup, scopeRef, deps = []) {
  useLayoutEffect(() => {
    const el = scopeRef?.current
    const ctx = gsap.context((self) => setup(self, el), el || undefined)
    return () => ctx.revert()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)
}
