/**
 * A single, shared pointer tracker.
 *
 * Instead of every floating element attaching its own `pointermove`
 * listener, components subscribe here and receive the same normalised
 * coordinates (-1 … 1 from the viewport centre).
 */

const state = { x: 0, y: 0, nx: 0, ny: 0 }
const subscribers = new Set()
let bound = false

function onMove(event) {
  const w = window.innerWidth || 1
  const h = window.innerHeight || 1
  state.x = event.clientX
  state.y = event.clientY
  state.nx = (event.clientX / w) * 2 - 1
  state.ny = (event.clientY / h) * 2 - 1
  subscribers.forEach((fn) => fn(state))
}

export function subscribePointer(fn) {
  subscribers.add(fn)
  if (!bound) {
    window.addEventListener('pointermove', onMove, { passive: true })
    bound = true
  }
  return () => {
    subscribers.delete(fn)
    if (!subscribers.size && bound) {
      window.removeEventListener('pointermove', onMove)
      bound = false
    }
  }
}

export function getPointer() {
  return state
}
