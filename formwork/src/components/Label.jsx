/** Small uppercase metadata label. */
export default function Label({ children, className = '', as: Tag = 'span', muted = true, ...rest }) {
  return (
    <Tag className={`label ${muted ? 'text-muted' : ''} ${className}`} {...rest}>
      {children}
    </Tag>
  )
}
