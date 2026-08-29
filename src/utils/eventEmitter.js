/**
 * eventEmitter.js
 * Yengil pub/sub event bus — komponentlar o'rtasida
 * React state/prop orqali bog'lanmasdan xabar yuborish uchun.
 *
 * Foydalanish:
 *   // Yuboruvchi:
 *   import { eventBus } from '../utils/eventEmitter'
 *   eventBus.emit('toggle-nav', true)
 *
 *   // Qabul qiluvchi (React hook):
 *   import { useEventEmitter } from '../utils/eventEmitter'
 *   useEventEmitter('toggle-nav', (payload) => { ... })
 */

import { useEffect } from 'react';

/* ── Minimal event bus ──────────────────────────────────────────── */
const listeners = {};

export const eventBus = {
  on(event, fn) {
    if (!listeners[event]) listeners[event] = [];
    listeners[event].push(fn);
  },
  off(event, fn) {
    if (!listeners[event]) return;
    listeners[event] = listeners[event].filter(f => f !== fn);
  },
  emit(event, payload) {
    if (!listeners[event]) return;
    listeners[event].forEach(fn => fn(payload));
  },
};

/* ── React hook wrapper ─────────────────────────────────────────── */
export function useEventEmitter(event, handler) {
  useEffect(() => {
    eventBus.on(event, handler);
    return () => eventBus.off(event, handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event]);
}
