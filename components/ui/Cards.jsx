import Link from "next/link";
import { cn } from "@/lib/utils";
import { TONE_CLASSES, bandFor } from "@/lib/data/brand";
import { Badge, DeltaTag } from "@/components/ui/Badge";
import ProgressBar, { AnimatedNumber } from "@/components/ui/ProgressBar";
import { ArrowUpRight } from "lucide-react";

/** Headline metric tile — large figure, small label, optional delta. */
export function StatCard({
  label,
  value,
  suffix = "",
  prefix = "",
  delta,
  deltaLabel,
  icon: Icon,
  tone = "neutral",
  hint,
  href,
  animate = true,
  className,
  decimals = 0,
  footer,
}) {
  const toneClasses = TONE_CLASSES[tone] ?? TONE_CLASSES.neutral;
  const inner = (
    <>
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px] font-medium uppercase tracking-[0.09em] text-muted">{label}</p>
        {Icon ? (
          <span className={cn("grid size-7 shrink-0 place-items-center rounded-md border", toneClasses.chip)}>
            <Icon className="size-3.5" aria-hidden="true" />
          </span>
        ) : null}
      </div>

      <div className="mt-3 flex items-end gap-2">
        <span className="tnum font-display text-[34px] leading-none tracking-[-0.03em] text-ink">
          {animate ? (
            <AnimatedNumber value={Number(value) || 0} decimals={decimals} prefix={prefix} suffix={suffix} />
          ) : (
            <>
              {prefix}
              {value}
              {suffix}
            </>
          )}
        </span>
        {typeof delta === "number" && delta !== 0 ? (
          <span className="mb-1 flex items-center gap-1">
            <DeltaTag value={delta} />
            {deltaLabel ? <span className="text-[11px] text-faint">{deltaLabel}</span> : null}
          </span>
        ) : null}
      </div>

      {hint ? <p className="mt-2 text-[12.5px] leading-relaxed text-muted">{hint}</p> : null}
      {footer ? <div className="mt-3 border-t border-line pt-3">{footer}</div> : null}
    </>
  );

  const classes = cn(
    "block rounded-lg border border-line bg-surface p-5 shadow-hairline",
    href &&
      "transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md",
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {inner}
      </Link>
    );
  }
  return <div className={classes}>{inner}</div>;
}

/** One measured skill: name, band, score bar, and the reason it matters. */
export function SkillCard({
  name,
  score,
  subject,
  domain,
  impact,
  attempts,
  href,
  tone,
  className,
  showBar = true,
  compact = false,
  delta,
}) {
  const band = bandFor(score);
  const toneClasses = TONE_CLASSES[tone ?? band.tone];
  const subjectTone = subject === "english" ? "accent" : "brand";

  const content = (
    <>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[14px] font-semibold tracking-[-0.01em] text-ink">{name}</p>
          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            {domain ? <span className="text-[11px] text-faint">{domain}</span> : null}
            {domain && subject ? <span className="text-line-3" aria-hidden="true">·</span> : null}
            {subject ? <Badge tone={subjectTone} size="xs">{subject === "math" ? "Math" : "English"}</Badge> : null}
          </div>
        </div>
        <div className="shrink-0 text-right">
          <span className={cn("tnum block font-display text-[22px] leading-none", toneClasses.text)}>
            {Math.round(score)}
            <span className="text-[11px] font-sans text-faint">%</span>
          </span>
          {typeof delta === "number" && delta !== 0 ? <DeltaTag value={delta} className="mt-1 justify-end" /> : null}
        </div>
      </div>

      {showBar ? <ProgressBar value={score} tone={tone ?? band.tone} size="sm" className="mt-3" /> : null}

      {!compact ? (
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-line pt-2.5 text-[11.5px] text-muted">
          <span className={cn("inline-flex items-center gap-1 font-medium", toneClasses.text)}>
            <span className={cn("size-1.5 rounded-full", toneClasses.dot)} aria-hidden="true" />
            {band.label}
          </span>
          {typeof impact === "number" && impact > 0 ? (
            <span className="tnum">Worth ~{impact} pts</span>
          ) : null}
          {typeof attempts === "number" ? <span className="tnum ml-auto">{attempts} items answered</span> : null}
        </div>
      ) : null}
    </>
  );

  const classes = cn(
    "rounded-lg border border-line bg-surface p-4",
    href && "transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md",
    className,
  );

  if (href) return <Link href={href} className={classes}>{content}</Link>;
  return <div className={classes}>{content}</div>;
}

/** Topic tile for the subject maps (/subjects/*, /student/math, /student/english). */
export function TopicCard({ topic, score, href, className, index }) {
  const hasScore = typeof score === "number";
  const band = hasScore ? bandFor(score) : null;
  const toneClasses = hasScore ? TONE_CLASSES[band.tone] : TONE_CLASSES.neutral;
  const subjectTone = topic.subject === "english" ? "accent" : "brand";

  return (
    <Link
      href={href}
      className={cn(
        "group relative flex flex-col rounded-lg border border-line bg-surface p-5",
        "transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <Badge tone={subjectTone} size="xs">{topic.level}</Badge>
        {hasScore ? (
          <span className={cn("tnum font-display text-[20px] leading-none", toneClasses.text)}>
            {Math.round(score)}<span className="text-[11px] font-sans text-faint">%</span>
          </span>
        ) : (
          <span className="text-[11px] text-faint">{topic.gradeBand}</span>
        )}
      </div>

      <h3 className="mt-3 text-[16px] font-semibold tracking-[-0.015em] text-ink">{topic.name}</h3>
      <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{topic.summary}</p>

      <ul className="mt-3.5 flex flex-wrap gap-1.5">
        {topic.skills.slice(0, 3).map((skill) => (
          <li key={skill} className="rounded-[4px] border border-line bg-surface-2 px-1.5 py-0.5 text-[11px] text-ink-soft">
            {skill}
          </li>
        ))}
        {topic.skills.length > 3 ? (
          <li className="px-1 py-0.5 text-[11px] text-faint">+{topic.skills.length - 3}</li>
        ) : null}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 pt-4">
        {hasScore ? (
          <span className={cn("inline-flex items-center gap-1.5 text-[11.5px] font-medium", toneClasses.text)}>
            <span className={cn("size-1.5 rounded-full", toneClasses.dot)} aria-hidden="true" />
            {band.label}
          </span>
        ) : (
          <span className="text-[11.5px] text-faint">{topic.units.length} learning units</span>
        )}
        <span className="inline-flex items-center gap-1 text-[12px] font-medium text-brand opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Open
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </span>
      </div>

      {typeof index === "number" ? (
        <span className="pointer-events-none absolute right-4 top-4 font-mono text-[10px] text-line-3" aria-hidden="true">
          {String(index + 1).padStart(2, "0")}
        </span>
      ) : null}
    </Link>
  );
}

/** Assessment option card used on /student/diagnostic/start. */
export function DiagnosticCard({
  title,
  subject,
  description,
  questionCount,
  minutes,
  topics,
  cta,
  href,
  onClick,
  featured = false,
  icon: Icon,
}) {
  const tone = subject === "english" ? "accent" : subject === "math" ? "brand" : "neutral";
  const toneClasses = TONE_CLASSES[tone];

  const Component = href ? Link : "div";

  return (
    <Component
      href={href}
      onClick={onClick}
      className={cn(
        "group flex flex-col rounded-lg border bg-surface p-6",
        featured ? "border-brand-line shadow-md" : "border-line shadow-hairline",
        "transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:shadow-md",
      )}
    >
      <div className="flex items-center gap-3">
        {Icon ? (
          <span className={cn("grid size-9 place-items-center rounded-md border", toneClasses.chip)}>
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <div>
          <h3 className="text-[16px] font-semibold tracking-[-0.015em] text-ink">{title}</h3>
          <p className="text-[12px] text-muted">{subject === "both" ? "Mathematics + English" : subject === "math" ? "Mathematics" : "English"}</p>
        </div>
      </div>

      <p className="mt-4 text-[13.5px] leading-relaxed text-ink-soft">{description}</p>

      <dl className="mt-5 grid grid-cols-3 gap-3 border-y border-line py-3.5">
        <div>
          <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">Questions</dt>
          <dd className="tnum mt-0.5 font-display text-[18px] text-ink">{questionCount}</dd>
        </div>
        <div>
          <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">Est. time</dt>
          <dd className="tnum mt-0.5 font-display text-[18px] text-ink">{minutes}<span className="text-[11px] font-sans text-faint"> min</span></dd>
        </div>
        <div>
          <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">Skills</dt>
          <dd className="tnum mt-0.5 font-display text-[18px] text-ink">{topics}</dd>
        </div>
      </dl>

      <span className="mt-4 inline-flex items-center gap-1.5 text-[13px] font-medium text-brand">
        {cta}
        <ArrowUpRight className="size-4 transition-transform duration-250 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" />
      </span>
    </Component>
  );
}
