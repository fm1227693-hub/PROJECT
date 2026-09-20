import { useEffect, useState } from 'react'

function format(timeZone) {
  try {
    return new Intl.DateTimeFormat('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
      timeZone,
    }).format(new Date())
  } catch {
    return '--:--'
  }
}

/**
 * Live local time for a city. Updates once a minute — not every second —
 * because nothing needs to move that often.
 */
export default function Clock({ city, timeZone, className = '' }) {
  const [time, setTime] = useState(() => format(timeZone))

  useEffect(() => {
    const tick = () => setTime(format(timeZone))
    // Align the first update with the next minute boundary.
    const msToMinute = 60000 - (Date.now() % 60000)
    let interval
    const timeout = setTimeout(() => {
      tick()
      interval = setInterval(tick, 60000)
    }, msToMinute)
    return () => {
      clearTimeout(timeout)
      if (interval) clearInterval(interval)
    }
  }, [timeZone])

  return (
    <span className={`inline-flex items-baseline gap-2 ${className}`}>
      <span>{city}</span>
      <time dateTime={time} className="tabular-nums text-[var(--c-fg)]">
        {time}
      </time>
    </span>
  )
}
