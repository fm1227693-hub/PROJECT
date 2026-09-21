import { useSyncExternalStore } from 'react'

const subscribers = new Map()

function getSubscribe(query) {
  if (!subscribers.has(query)) {
    subscribers.set(query, (cb) => {
      const mql = window.matchMedia(query)
      mql.addEventListener('change', cb)
      return () => mql.removeEventListener('change', cb)
    })
  }
  return subscribers.get(query)
}

/** Reactive media query, backed by useSyncExternalStore (no effect-driven setState). */
export function useMediaQuery(query) {
  return useSyncExternalStore(
    getSubscribe(query),
    () => window.matchMedia(query).matches,
    () => false,
  )
}
