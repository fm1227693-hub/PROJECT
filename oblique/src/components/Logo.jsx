/**
 * The Oblique mark: a square with a slanted cut-out. Currentcolor based so
 * it inverts with the section theme.
 */
export function LogoMark({ size = 26, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      className={className}
      focusable="false"
    >
      <rect width="32" height="32" rx="7" fill="currentColor" />
      <path d="M12 8h11l-3 16H9z" fill="var(--c-bg)" />
    </svg>
  )
}

export default function Logo({ compact = false }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark size={compact ? 22 : 26} />
      <span
        className="text-[15px] font-medium tracking-[-0.02em] leading-none"
        style={{ fontVariationSettings: '"wght" 520' }}
      >
        Oblique
      </span>
    </span>
  )
}
