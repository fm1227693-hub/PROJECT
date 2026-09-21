// One shared pointer listener for every pointer-driven effect (cursor, parallax, magnetic).
// Consumers read the latest values inside their own rAF loops — no per-component listeners.

export const pointer = {
  x: typeof window !== 'undefined' ? window.innerWidth / 2 : 0,
  y: typeof window !== 'undefined' ? window.innerHeight / 2 : 0,
  /** -1..1 normalised from viewport centre */
  nx: 0,
  ny: 0,
  active: false,
  moved: false,
}

let listeners = 0
let subscribers = new Set()

function onMove(e) {
  pointer.x = e.clientX
  pointer.y = e.clientY
  pointer.nx = (e.clientX / window.innerWidth) * 2 - 1
  pointer.ny = (e.clientY / window.innerHeight) * 2 - 1
  pointer.active = true
  pointer.moved = true
  subscribers.forEach((fn) => fn(pointer))
}
function onLeave() {
  pointer.active = false
  subscribers.forEach((fn) => fn(pointer))
}
function onEnter() {
  pointer.active = true
}

/** Subscribe to pointer updates. Returns an unsubscribe function. */
export function subscribePointer(fn) {
  if (listeners === 0) {
    window.addEventListener('pointermove', onMove, { passive: true })
    document.documentElement.addEventListener('pointerleave', onLeave)
    document.documentElement.addEventListener('pointerenter', onEnter)
  }
  listeners++
  subscribers.add(fn)
  return () => {
    subscribers.delete(fn)
    listeners--
    if (listeners === 0) {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('pointerleave', onLeave)
      document.documentElement.removeEventListener('pointerenter', onEnter)
    }
  }
}
