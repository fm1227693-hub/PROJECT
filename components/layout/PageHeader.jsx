import { cn } from "@/lib/utils";

/**
 * The header of every workspace page: one title, one sentence of context,
 * one primary action. Nothing else.
 */
export default function PageHeader({
  eyebrow,
  title,
  description,
  actions,
  meta,
  className,
  size = "lg",
  tone = "default",
}) {
  return (
    <header className={cn("mb-6 lg:mb-8", className)}>
      <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
        <div className="min-w-0 max-w-2xl">
          {eyebrow ? (
            <p className="eyebrow mb-2.5 flex items-center gap-2">
              <span className={cn("inline-block h-px w-6", tone === "accent" ? "bg-accent/50" : "bg-brand/40")} aria-hidden="true" />
              {eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              "font-display tracking-[-0.025em] text-ink",
              size === "xl" && "text-[clamp(1.75rem,3.4vw,2.5rem)] leading-[1.1]",
              size === "lg" && "text-[clamp(1.5rem,2.6vw,2rem)] leading-[1.15]",
              size === "md" && "text-[1.35rem] leading-snug",
            )}
          >
            {title}
          </h1>
          {description ? (
            <p className={cn("mt-2.5 leading-relaxed text-ink-soft", size === "xl" ? "text-[15px] md:text-base" : "text-[14px]")}>
              {description}
            </p>
          ) : null}
        </div>

        {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2.5">{actions}</div> : null}
      </div>

      {meta?.length ? (
        <dl className="mt-6 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-4">
          {meta.map((item) => (
            <div key={item.label} className="bg-surface px-4 py-3">
              <dt className="text-[10.5px] font-medium uppercase tracking-[0.09em] text-faint">{item.label}</dt>
              <dd className={cn("tnum mt-1 font-display text-[19px] leading-none text-ink", item.tone === "brand" && "text-brand", item.tone === "accent" && "text-accent", item.tone === "strong" && "text-strong", item.tone === "risk" && "text-risk")}>
                {item.value}
                {item.suffix ? <span className="ml-0.5 font-sans text-[11px] font-medium text-faint">{item.suffix}</span> : null}
              </dd>
              {item.hint ? <dd className="mt-1 text-[11px] text-muted">{item.hint}</dd> : null}
            </div>
          ))}
        </dl>
      ) : null}
    </header>
  );
}

/** Slim variant used on secondary screens. */
export function SubHeader({ title, description, action, className }) {
  return (
    <div className={cn("mb-4 flex flex-wrap items-end justify-between gap-3", className)}>
      <div className="min-w-0">
        <h2 className="font-display text-[19px] leading-snug tracking-[-0.02em] text-ink">{title}</h2>
        {description ? <p className="mt-1 text-[13px] text-muted">{description}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}
