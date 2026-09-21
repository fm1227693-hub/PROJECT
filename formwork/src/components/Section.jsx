/**
 * Semantic section that declares its colour theme. The theme is applied to <html>
 * when the section owns the middle of the viewport (see initSectionThemes).
 */
export default function Section({ id, theme = 'paper', as: Tag = 'section', className = '', children, ref, ...rest }) {
  return (
    <Tag ref={ref} id={id} data-theme={theme} className={`relative ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
