import { cn } from "@/lib/utils";
import Reveal from "@/components/motion/Reveal";
import { MathPlot, EnglishLines, RingField } from "@/components/decor/Backgrounds";
import { Section } from "@/components/ui/Card";
import Button from "@/components/ui/Button";
import { ArrowRight } from "lucide-react";

/**
 * Standard marketing page header — one eyebrow, one editorial headline, one
 * paragraph, one primary action. Consistent across all public pages.
 */
export function PageHero({
  eyebrow,
  title,
  body,
  actions,
  meta,
  visual,
  align = "left",
  tone = "canvas",
  className,
  size = "lg",
  decor = "none",
  children,
}) {
  return (
    <section className={cn("relative overflow-hidden border-b border-line", tone === "surface" ? "bg-surface" : "bg-canvas", className)}>
      <div className="prism-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div
        className="grid-paper pointer-events-none absolute inset-0 opacity-55 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden="true"
      />
      {decor === "math" ? <MathPlot className="mask-fade-b opacity-70" /> : null}
      {decor === "english" ? <EnglishLines className="mask-fade-b opacity-70" /> : null}
      {decor === "rings" ? <RingField className="opacity-80" /> : null}

      <div className="container-page relative">
        <div className={cn("grid gap-12 py-14 md:py-20", visual && "items-center lg:grid-cols-[1.05fr_0.95fr] lg:gap-16")}>
          <Reveal className={cn(align === "center" && "mx-auto text-center", !visual && "max-w-3xl", align === "center" && !visual && "max-w-3xl")}>
            {eyebrow ? (
              <p className={cn("eyebrow flex items-center gap-2", align === "center" && "justify-center")}>
                <span className="inline-block h-px w-6 bg-brand/40" aria-hidden="true" />
                {eyebrow}
              </p>
            ) : null}

            <h1
              className={cn(
                "mt-4 font-display tracking-[-0.03em] text-ink",
                size === "xl" && "text-[clamp(2.1rem,4.8vw,3.4rem)] leading-[1.06]",
                size === "lg" && "text-[clamp(1.85rem,4vw,2.85rem)] leading-[1.09]",
                size === "md" && "text-[clamp(1.55rem,3vw,2.15rem)] leading-[1.14]",
              )}
            >
              {title}
            </h1>

            {body ? (
              <p
                className={cn(
                  "mt-5 leading-relaxed text-ink-soft",
                  size === "xl" ? "text-[16.5px] md:text-[17.5px]" : "text-[15.5px]",
                  align === "center" && "mx-auto",
                  !visual && "max-w-2xl",
                )}
              >
                {body}
              </p>
            ) : null}

            {actions?.length ? (
              <div className={cn("mt-8 flex flex-wrap gap-3", align === "center" && "justify-center")}>
                {actions.map((action, index) => (
                  <Button
                    key={action.label}
                    href={action.href}
                    onClick={action.onClick}
                    variant={index === 0 ? (action.variant ?? "primary") : (action.variant ?? "secondary")}
                    size="lg"
                    iconRight={index === 0 ? ArrowRight : action.iconRight}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>
            ) : null}

            {meta?.length ? (
              <dl
                className={cn(
                  "mt-10 grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2",
                  meta.length >= 3 && "lg:grid-cols-3",
                  meta.length >= 4 && "lg:grid-cols-4",
                  align === "center" && "mx-auto max-w-2xl",
                )}
              >
                {meta.map((item) => (
                  <div key={item.label} className="bg-surface/85 px-4 py-3.5">
                    <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{item.label}</dt>
                    <dd className="tnum mt-1 font-display text-[20px] leading-none text-ink">
                      {item.value}
                      {item.suffix ? <span className="ml-0.5 font-sans text-[11px] text-faint">{item.suffix}</span> : null}
                    </dd>
                    {item.hint ? <dd className="mt-1 text-[11px] text-muted">{item.hint}</dd> : null}
                  </div>
                ))}
              </dl>
            ) : null}

            {children}
          </Reveal>

          {visual ? <Reveal variant="scale" delay={0.08}>{visual}</Reveal> : null}
        </div>
      </div>
    </section>
  );
}

/** Closing call-to-action band reused on every marketing page. */
export function CtaBand({
  title = "Find out where you stand.",
  body = "Twenty minutes now tells you what to do with the next twenty hours.",
  primary = { label: "Take a Diagnostic", href: "/student/diagnostic/start" },
  secondary = { label: "See a sample report", href: "/sample-report" },
  note,
  className,
}) {
  return (
    <section className={cn("relative overflow-hidden border-t border-line bg-surface", className)}>
      <div className="prism-wash pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-narrow relative py-16 text-center md:py-20">
        <Reveal>
          <h2 className="font-display text-[clamp(1.75rem,3.6vw,2.6rem)] leading-[1.08] tracking-[-0.03em] text-ink">
            {title}
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] leading-relaxed text-ink-soft">{body}</p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href={primary.href} size="lg" iconRight={ArrowRight}>
              {primary.label}
            </Button>
            {secondary ? (
              <Button href={secondary.href} size="lg" variant="secondary">
                {secondary.label}
              </Button>
            ) : null}
          </div>
          {note ? <p className="mt-5 text-[12.5px] text-muted">{note}</p> : null}
        </Reveal>
      </div>
    </section>
  );
}

/** Numbered process list used by how-it-works and audience pages. */
export function ProcessSteps({ steps = [], tone = "brand", className }) {
  return (
    <ol className={cn("relative space-y-0", className)}>
      <span className="absolute left-[19px] top-4 bottom-4 w-px bg-line" aria-hidden="true" />
      {steps.map((step, index) => (
        <li key={step.title ?? index} className="relative flex gap-5 py-4">
          <span
            className={cn(
              "relative z-10 grid size-10 shrink-0 place-items-center rounded-full border bg-surface font-mono text-[12px] font-semibold",
              tone === "accent" ? "border-accent-line text-accent" : "border-brand-line text-brand",
            )}
          >
            {String(index + 1).padStart(2, "0")}
          </span>
          <div className="min-w-0 pt-1">
            <p className="text-[15px] font-semibold tracking-[-0.01em] text-ink">{step.title}</p>
            {step.body ? <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{step.body}</p> : null}
          </div>
        </li>
      ))}
    </ol>
  );
}

/** Two-column benefit list — used by every audience page. */
export function BenefitGrid({ items = [], columns = 3, tone = "brand" }) {
  return (
    <div
      className={cn(
        "grid gap-5",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-2 lg:grid-cols-3",
        columns === 4 && "sm:grid-cols-2 lg:grid-cols-4",
      )}
    >
      {items.map((item) => (
        <article
          key={item.title}
          className="rounded-lg border border-line bg-surface p-5 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md"
        >
          <span
            className={cn(
              "mb-3.5 block h-px w-8 rounded-full",
              tone === "accent" ? "bg-accent/50" : "bg-brand/50",
            )}
            aria-hidden="true"
          />
          <h3 className="text-[15px] font-semibold tracking-[-0.012em] text-ink">{item.title}</h3>
          <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.body}</p>
        </article>
      ))}
    </div>
  );
}

/** Simple alternating section wrapper for marketing pages. */
export function MarketingSection({ id, tone = "canvas", children, className }) {
  return (
    <Section id={id} tone={tone} className={className}>
      <div className="container-page">{children}</div>
    </Section>
  );
}
