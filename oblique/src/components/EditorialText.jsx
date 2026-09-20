import { useRef } from 'react'
import { useGSAP } from '../lib/gsap'
import { revealLines, scrubWords } from '../animations/scrollAnimations'
import { useSmoothScroll } from '../context/smoothScroll'

/**
 * Typography that animates as it enters the viewport.
 *  - mode="lines": masked line reveal (default)
 *  - mode="words": scroll-scrubbed word brightening (long statements)
 */
export default function EditorialText({
  as: Tag = 'p',
  mode = 'lines',
  children,
  className = '',
  delay = 0,
  stagger,
  start,
  ...rest
}) {
  const ref = useRef(null)
  const { env } = useSmoothScroll()

  useGSAP(
    () => {
      if (env.reduced) return
      if (mode === 'words') {
        scrubWords(ref.current, start ? { start } : undefined)
      } else {
        revealLines(ref.current, { delay, stagger, start })
      }
    },
    { scope: ref, dependencies: [mode, env.reduced] },
  )

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
