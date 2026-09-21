import { useSyncExternalStore } from 'react'

function format(tz) {
  try {
    return new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: tz }).format(new Date())
  } catch {
    return '--:--'
  }
}

// One shared minute ticker for every clock on the page.
const listeners = new Set()
let timer = null
function subscribe(cb) {
  listeners.add(cb)
  if (!timer) {
    const tick = () => {
      listeners.forEach((fn) => fn())
      timer = setTimeout(tick, 60000 - (Date.now() % 60000) + 20)
    }
    timer = setTimeout(tick, 60000 - (Date.now() % 60000) + 20)
  }
  return () => {
    listeners.delete(cb)
    if (!listeners.size && timer) {
      clearTimeout(timer)
      timer = null
    }
  }
}

/** Local time for a timezone, refreshed on the minute. */
export default function Clock({ tz, className = '' }) {
  const time = useSyncExternalStore(subscribe, () => format(tz), () => '--:--')
  return (
    <time className={`tabular-nums ${className}`} dateTime={time}>
      {time}
    </time>
  )
}
