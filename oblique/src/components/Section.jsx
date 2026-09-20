import { forwardRef } from 'react'

/**
 * Semantic section wrapper. Carries the colour theme that the page
 * transitions to when the section reaches the middle of the viewport.
 */
const Section = forwardRef(function Section(
  { id, theme = 'light', className = '', children, label, ...rest },
  ref,
) {
  return (
    <section
      ref={ref}
      id={id}
      data-theme={theme}
      aria-label={label}
      className={`relative ${className}`}
      {...rest}
    >
      {children}
    </section>
  )
})

export default Section

/**
 * Small editorial header used by several sections: number, title, meta.
 */
export function SectionLabel({
  index,
  title,
  meta,
  className = '',
  muted = 'text-[var(--c-muted)]',
  strong = 'text-[var(--c-fg)]',
}) {
  return (
    <div className={`flex items-baseline justify-between gap-6 ${className}`}>
      <p className={`label flex items-baseline gap-3 ${muted}`}>
        {index && <span className={strong}>{index}</span>}
        <span>{title}</span>
      </p>
      {meta && <p className={`label hidden sm:block ${muted}`}>{meta}</p>}
    </div>
  )
}
