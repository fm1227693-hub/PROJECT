import { createContext, useContext } from 'react'

export const SmoothScrollContext = createContext({
  ready: false,
  env: { reduced: false, touch: false, fine: true, pointerFX: true, smooth: true },
  scrollTo: () => {},
  pause: () => {},
  getSmoother: () => null,
})

export function useSmoothScroll() {
  return useContext(SmoothScrollContext)
}
