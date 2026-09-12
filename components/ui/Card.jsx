import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Surfaces. Prisma cards are quiet: hairline border, low shadow, restrained
 * radius. Elevation appears on hover, never at rest.
 */

const TONES = {
  default: "bg-surface border-line",
  soft: "bg-surface-2 border-line",
  raised: "bg-surface border-line shadow-md",
  brand: "bg-brand-soft border-brand-line",
  accent: "bg-accent-soft border-accent-line",
  ink: "bg-ink border-ink text-canvas",
};

export function Card({
  as: Component = "div",
  tone = "default",
  hover = false,
  className,
  children,
  ...props
}) {
  return (
    <Component
      className={cn(
        "rounded-lg border",
        TONES[tone] ?? TONES.default,
        hover &&
          "transition-[transform,box-shadow,border-color] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-md hover:border-line-2",
        tone === "ink" && "[&_h3]:text-canvas [&_p]:text-canvas/70",
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

export function CardLink({ href, className, children, ...props }) {
  return (
    <Link
      href={href}
      className={cn(
        "group block rounded-lg border border-line bg-surface p-5",
        "transition-[transform,box-shadow,border-color] duration-250 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
        className,
      )}
      {...props}
    >
      {children}
    </Link>
  );
}

export function CardHeader({ title, description, icon: Icon, action, className, tone = "default" }) {
  return (
    <div className={cn("flex items-start justify-between gap-4 border-b border-line px-5 py-4", className)}>
      <div className="flex min-w-0 items-start gap-3">
        {Icon ? (
          <span
            className={cn(
              "mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border",
              tone === "brand"
                ? "border-brand-line bg-brand-soft text-brand"
                : tone === "accent"
                  ? "border-accent-line bg-accent-soft text-accent"
                  : "border-line bg-surface-2 text-ink-soft",
            )}
          >
            <Icon className="size-4" aria-hidden="true" />
          </span>
        ) : null}
        <div className="min-w-0">
          <h3 className="truncate text-[15px] font-semibold tracking-[-0.015em] text-ink">{title}</h3>
          {description ? <p className="mt-1 text-[13px] leading-relaxed text-muted">{description}</p> : null}
        </div>
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

export function CardBody({ className, children, ...props }) {
  return (
    <div className={cn("px-5 py-4", className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn("flex items-center justify-between gap-3 border-t border-line px-5 py-3.5", className)} {...props}>
      {children}
    </div>
  );
}

/** Section header used across marketing and product pages. */
export function SectionHeading({
  eyebrow,
  title,
  body,
  align = "left",
  action,
  className,
  size = "lg",
  as: TitleTag = "h2",
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        align === "center" && "items-center text-center",
        action && "md:flex-row md:items-end md:justify-between md:gap-10",
        className,
      )}
    >
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow ? (
          <p className="eyebrow mb-3 flex items-center gap-2">
            <span className="inline-block h-px w-6 bg-brand/40" aria-hidden="true" />
            {eyebrow}
          </p>
        ) : null}
        <TitleTag
          className={cn(
            "font-display text-ink",
            size === "xl" && "text-[clamp(2rem,4.4vw,3.25rem)] leading-[1.06]",
            size === "lg" && "text-[clamp(1.6rem,3vw,2.35rem)] leading-[1.12]",
            size === "md" && "text-[clamp(1.3rem,2.2vw,1.75rem)] leading-[1.2]",
            size === "sm" && "text-lg leading-snug",
          )}
        >
          {title}
        </TitleTag>
        {body ? (
          <p
            className={cn(
              "mt-4 text-[15px] leading-relaxed text-ink-soft",
              size === "xl" && "md:text-[17px]",
              align === "center" && "mx-auto",
            )}
          >
            {body}
          </p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </div>
  );
}

/** Marketing section wrapper with consistent vertical rhythm. */
export function Section({ id, className, children, tone = "canvas", ...props }) {
  return (
    <section
      id={id}
      className={cn(
        "relative py-16 md:py-24",
        tone === "canvas" && "bg-canvas",
        tone === "surface" && "bg-surface border-y border-line",
        tone === "soft" && "bg-canvas-2",
        tone === "ink" && "bg-ink text-canvas",
        className,
      )}
      {...props}
    >
      {children}
    </section>
  );
}
