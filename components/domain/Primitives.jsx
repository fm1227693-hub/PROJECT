import { cn } from "@/lib/utils";
import { TONE_CLASSES, bandFor } from "@/lib/data/brand";
import ProgressBar from "@/components/ui/ProgressBar";
import { InfoTip } from "@/components/ui/Tooltip";

/**
 * The signature Prisma row: one measured skill, its band, and its bar.
 * Used on the landing page, in reports, dashboards and analysis screens.
 */
export function SpectrumRow({
  name,
  score,
  domain,
  impact,
  tone,
  showBand = true,
  showBar = true,
  size = "md",
  className,
  href,
  delay = 0,
  meta,
}) {
  const band = bandFor(score);
  const resolved = tone ?? band.tone;
  const toneClasses = TONE_CLASSES[resolved];
  const Tag = href ? "a" : "div";

  return (
    <Tag
      {...(href ? { href } : {})}
      className={cn(
        "group flex items-center gap-4",
        size === "sm" ? "py-2" : "py-2.5",
        href && "transition-opacity hover:opacity-80",
        className,
      )}
    >
      <span className={cn("size-1.5 shrink-0 rounded-full", toneClasses.dot)} aria-hidden="true" />

      <span className="min-w-0 flex-1">
        <span className={cn("flex items-baseline gap-2", size === "sm" ? "text-[12.5px]" : "text-[13.5px]")}>
          <span className="truncate font-medium text-ink">{name}</span>
          {domain ? <span className="hidden shrink-0 text-[11px] text-faint sm:inline">{domain}</span> : null}
          {meta ? <span className="ml-auto hidden shrink-0 text-[11px] text-faint lg:inline">{meta}</span> : null}
        </span>
        {showBar ? (
          <ProgressBar value={score} tone={resolved} size={size === "sm" ? "xs" : "sm"} className="mt-1.5" delay={delay} />
        ) : null}
      </span>

      <span className="flex shrink-0 items-center gap-3">
        {showBand ? (
          <span className={cn("hidden text-[11px] font-medium sm:inline", toneClasses.text)}>{band.label}</span>
        ) : null}
        <span className={cn("tnum font-display leading-none text-ink", size === "sm" ? "text-[15px]" : "text-[17px]")}>
          {Math.round(score)}
          <span className="ml-px font-sans text-[10px] text-faint">%</span>
        </span>
      </span>
    </Tag>
  );
}

/**
 * The plain-language diagnosis. This is the sentence the whole product exists
 * to produce, so it gets its own treated surface.
 */
export function DiagnosisCallout({
  text,
  label = "Your diagnosis",
  tone = "brand",
  icon: Icon,
  className,
  tip,
  children,
}) {
  const toneClasses = TONE_CLASSES[tone] ?? TONE_CLASSES.brand;
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-lg border bg-surface p-5 shadow-hairline sm:p-6",
        tone === "brand" ? "border-brand-line" : tone === "accent" ? "border-accent-line" : "border-line",
        className,
      )}
    >
      <span className={cn("absolute inset-y-0 left-0 w-[3px]", toneClasses.bar)} aria-hidden="true" />

      <div className="flex items-start justify-between gap-4 pl-2">
        <p className="eyebrow flex items-center gap-1.5">
          {Icon ? <Icon className={cn("size-3.5", toneClasses.text)} aria-hidden="true" /> : null}
          {label}
          {tip ? <InfoTip content={tip} /> : null}
        </p>
      </div>

      <p className="mt-3 pl-2 font-display text-[19px] leading-[1.45] tracking-[-0.015em] text-ink sm:text-[21px]">
        {text}
      </p>

      {children ? <div className="mt-4 pl-2">{children}</div> : null}
    </div>
  );
}

/** Numbered step marker used across how-it-works and learning path screens. */
export function StepNumber({ n, tone = "brand", className, size = "md" }) {
  const toneClasses = TONE_CLASSES[tone] ?? TONE_CLASSES.brand;
  return (
    <span
      className={cn(
        "grid shrink-0 place-items-center rounded-md border font-mono font-semibold",
        size === "sm" ? "size-7 text-[11px]" : size === "lg" ? "size-12 text-[15px]" : "size-9 text-[12px]",
        toneClasses.chip,
        className,
      )}
      aria-hidden="true"
    >
      {n}
    </span>
  );
}

/** "Strengths / Needs attention" pair used on dashboards and reports. */
export function StrengthGapPanel({ strengths = [], gaps = [], className, strongLabel = "Strongest skills", gapLabel = "Needs attention", emptyText = "Complete a diagnostic to populate this panel." }) {
  return (
    <div className={cn("grid gap-px overflow-hidden rounded-lg border border-line bg-line md:grid-cols-2", className)}>
      <div className="bg-surface p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-strong" aria-hidden="true" />
          <p className="eyebrow">{strongLabel}</p>
        </div>
        {strengths.length ? (
          <ul className="divide-y divide-line">
            {strengths.map((item, i) => (
              <li key={item.id ?? item.name}>
                <SpectrumRow name={item.name} score={item.score} tone="strong" size="sm" showBand={false} delay={i * 60} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-[13px] text-muted">{emptyText}</p>
        )}
      </div>

      <div className="bg-surface p-5">
        <div className="mb-3 flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-risk" aria-hidden="true" />
          <p className="eyebrow">{gapLabel}</p>
        </div>
        {gaps.length ? (
          <ul className="divide-y divide-line">
            {gaps.map((item, i) => (
              <li key={item.id ?? item.name}>
                <SpectrumRow
                  name={item.name}
                  score={item.score}
                  tone="risk"
                  size="sm"
                  showBand={false}
                  delay={i * 60}
                  meta={item.impact ? `worth ~${item.impact} pts` : undefined}
                />
              </li>
            ))}
          </ul>
        ) : (
          <p className="py-4 text-[13px] text-muted">No skills below the threshold. Nothing needs repair.</p>
        )}
      </div>
    </div>
  );
}
