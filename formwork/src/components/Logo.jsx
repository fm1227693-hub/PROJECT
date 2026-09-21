/** Compact wordmark: a mark built from the letter F with a single cobalt point. */
export default function Logo({ className = '', withWord = true }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="22" height="22" viewBox="0 0 64 64" aria-hidden="true" className="shrink-0">
        <rect width="64" height="64" rx="14" fill="currentColor" />
        <path d="M18 46V18h28v6H25v6h17v6H25v10z" fill="var(--bg)" />
        <circle cx="46" cy="44" r="4" fill="var(--color-cobalt)" />
      </svg>
      {withWord && <span className="text-[0.95rem] font-medium tracking-[-0.02em]">Formwork</span>}
    </span>
  )
}
