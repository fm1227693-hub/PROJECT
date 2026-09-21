import { useRef } from 'react'
import { useGsap } from '../hooks/useGsap'
import { useCaps } from '../context/scroll'
import { revealLines, highlightWords } from '../animations/scrollAnimations'

/**
 * Text with a scroll-linked reveal.
 *   mode="lines"  — masked line reveal on enter
 *   mode="words"  — word-by-word emphasis scrubbed to scroll
 */
export default function EditorialText({ as: Tag = 'p', mode = 'lines', className = '', children, start, end, delay = 0, stagger, ...rest }) {
  const ref = useRef(null)
  const caps = useCaps()

  useGsap(() => {
    const el = ref.current
    if (mode === 'words') highlightWords(el, { start, end, reduced: caps.reduced })
    else revealLines(el, { start, delay, stagger, reduced: caps.reduced })
  }, ref, [mode, caps.reduced])

  return (
    <Tag ref={ref} className={className} {...rest}>
      {children}
    </Tag>
  )
}
