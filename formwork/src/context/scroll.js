import { createContext, useContext } from 'react'

/** { caps, smoother, scrollTo(target) } — provided by <SmoothScrollProvider>. */
export const ScrollContext = createContext(null)

export function useScroll() {
  const ctx = useContext(ScrollContext)
  if (!ctx) throw new Error('useScroll must be used inside <SmoothScrollProvider>')
  return ctx
}

export function useCaps() {
  return useScroll().caps
}
