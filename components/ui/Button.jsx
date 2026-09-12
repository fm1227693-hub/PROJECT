import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * The one button. Renders a <button>, an <a> or a Next <Link> depending on
 * props, so navigation and actions share identical styling and motion.
 */

const VARIANTS = {
  primary:
    "bg-ink text-canvas shadow-xs hover:bg-ink-2 hover:shadow-sm border border-ink",
  brand:
    "bg-brand text-white shadow-xs hover:bg-brand-2 hover:shadow-sm border border-brand",
  secondary:
    "bg-surface text-ink border border-line hover:border-line-3 hover:bg-surface-2 shadow-hairline",
  subtle: "bg-surface-3 text-ink border border-transparent hover:bg-line/60",
  ghost: "bg-transparent text-ink-soft border border-transparent hover:bg-surface-3 hover:text-ink",
  outline: "bg-transparent text-ink border border-line-2 hover:bg-surface hover:border-ink/40",
  link: "bg-transparent text-brand border border-transparent hover:text-brand-2 px-0 underline-offset-4 hover:underline",
  danger: "bg-risk text-white border border-risk hover:brightness-95 shadow-xs",
};

const SIZES = {
  xs: "h-7 px-2.5 text-[12px] gap-1.5 rounded-[5px]",
  sm: "h-9 px-3.5 text-[13px] gap-1.5 rounded-md",
  md: "h-10 px-4 text-sm gap-2 rounded-md",
  lg: "h-12 px-6 text-[15px] gap-2.5 rounded-lg",
};

const BASE =
  "inline-flex items-center justify-center font-medium tracking-[-0.01em] whitespace-nowrap select-none " +
  "transition-[transform,background-color,border-color,box-shadow,color] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] " +
  "hover:-translate-y-px active:translate-y-0 active:scale-[0.99] " +
  "disabled:pointer-events-none disabled:opacity-45 " +
  "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

export default function Button({
  as,
  href,
  variant = "primary",
  size = "md",
  className,
  children,
  icon: Icon,
  iconRight: IconRight,
  full = false,
  external = false,
  ...props
}) {
  const classes = cn(BASE, VARIANTS[variant] ?? VARIANTS.primary, SIZES[size] ?? SIZES.md, full && "w-full", className);

  const content = (
    <>
      {Icon ? <Icon className={cn(size === "lg" ? "size-[18px]" : "size-4", "shrink-0")} aria-hidden="true" /> : null}
      {children}
      {IconRight ? (
        <IconRight className={cn(size === "lg" ? "size-[18px]" : "size-4", "shrink-0")} aria-hidden="true" />
      ) : null}
    </>
  );

  const Component = as ?? (href ? (external ? "a" : Link) : "button");
  const linkProps = href ? (external ? { target: "_blank", rel: "noreferrer noopener" } : {}) : {};

  return (
    <Component href={href} className={classes} {...linkProps} {...props}>
      {content}
    </Component>
  );
}

/** Compact icon-only button (sidebar collapse, table row actions, dismiss). */
export function IconButton({ href, label, icon: Icon, className, variant = "ghost", size = "md", ...props }) {
  const classes = cn(
    "inline-flex items-center justify-center rounded-md border border-transparent text-ink-soft",
    "transition-[transform,background-color,color] duration-200 hover:bg-surface-3 hover:text-ink",
    "active:scale-95 disabled:opacity-40 disabled:pointer-events-none",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
    size === "sm" ? "size-8" : size === "lg" ? "size-11" : "size-9",
    variant === "outline" && "border-line bg-surface",
    className,
  );
  const iconEl = <Icon className={size === "sm" ? "size-4" : "size-[18px]"} aria-hidden="true" />;
  const aria = { "aria-label": label, title: label };

  if (href) {
    return (
      <Link href={href} className={classes} {...aria} {...props}>
        {iconEl}
      </Link>
    );
  }
  return (
    <button type="button" className={classes} {...aria} {...props}>
      {iconEl}
    </button>
  );
}

/** Group of buttons with consistent spacing (CTA rows). */
export function ButtonGroup({ children, className, align = "left", stack = false }) {
  return (
    <div
      className={cn(
        "flex gap-3",
        align === "center" && "justify-center",
        align === "right" && "justify-end",
        align === "between" && "justify-between",
        stack && "flex-col sm:flex-row",
        className,
      )}
    >
      {children}
    </div>
  );
}
