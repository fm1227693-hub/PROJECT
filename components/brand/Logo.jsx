import { cn } from "@/lib/utils";

/**
 * The Prisma mark: a single beam enters, a spectrum leaves.
 * Drawn as one small SVG — no image requests, no font dependency.
 */
export function PrismMark({ className, tone = "ink" }) {
  const ink = tone === "light" ? "#FBFAF7" : "#10182B";
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7 shrink-0", className)} aria-hidden="true" focusable="false">
      <path d="M16 4.2 28.4 26H3.6L16 4.2Z" fill="none" stroke={ink} strokeWidth="2" strokeLinejoin="round" />
      <path d="M1.6 15.6 12.4 15.6" stroke={ink} strokeWidth="2" strokeLinecap="round" />
      <path d="M19.4 13.4 30.2 10.6" stroke="#2B4FE0" strokeWidth="2" strokeLinecap="round" />
      <path d="M19.4 16.4 30.2 16.4" stroke="#5B4BD8" strokeWidth="2" strokeLinecap="round" />
      <path d="M19.4 19.4 30.2 22.2" stroke="#7A5CD6" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export default function Logo({
  className,
  tone = "ink",
  showWordmark = true,
  suffix,
  compact = false,
  ...props
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)} {...props}>
      <PrismMark tone={tone} className={compact ? "size-6" : "size-7"} />
      {showWordmark ? (
        <span className="flex flex-col leading-none">
          <span
            className={cn(
              "font-display text-[19px] font-semibold tracking-[-0.03em]",
              tone === "light" ? "text-canvas" : "text-ink",
            )}
          >
            Prisma
          </span>
          {!compact && suffix ? (
            <span
              className={cn(
                "mt-[3px] font-mono text-[9px] uppercase tracking-[0.16em]",
                tone === "light" ? "text-canvas/55" : "text-muted",
              )}
            >
              {suffix}
            </span>
          ) : null}
        </span>
      ) : null}
    </span>
  );
}
