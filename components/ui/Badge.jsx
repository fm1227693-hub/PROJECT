import { cn } from "@/lib/utils";
import { TONE_CLASSES } from "@/lib/data/brand";

const SIZES = {
  xs: "h-5 px-1.5 text-[10px] gap-1 rounded-[4px]",
  sm: "h-6 px-2 text-[11px] gap-1.5 rounded-[5px]",
  md: "h-7 px-2.5 text-xs gap-1.5 rounded-md",
};

export function Badge({ tone = "neutral", size = "sm", icon: Icon, className, children, dot = false, ...props }) {
  const toneClasses = TONE_CLASSES[tone] ?? TONE_CLASSES.neutral;
  return (
    <span
      className={cn(
        "inline-flex items-center border font-medium tracking-[0.01em] whitespace-nowrap",
        toneClasses.chip,
        SIZES[size] ?? SIZES.sm,
        className,
      )}
      {...props}
    >
      {dot ? <span className={cn("size-1.5 rounded-full", toneClasses.dot)} aria-hidden="true" /> : null}
      {Icon ? <Icon className="size-3 shrink-0" aria-hidden="true" /> : null}
      {children}
    </span>
  );
}

/** Subject chip — the small coloured marker used next to any topic name. */
export function SubjectTag({ subject, className, size = "sm" }) {
  const isMath = subject === "math";
  return (
    <Badge tone={isMath ? "brand" : "accent"} size={size} className={className}>
      {isMath ? "Mathematics" : "English"}
    </Badge>
  );
}

export function MasteryBadge({ score, className, size = "sm" }) {
  const tone = score >= 80 ? "strong" : score >= 60 ? "developing" : "risk";
  const label = score >= 80 ? "Strong" : score >= 60 ? "Developing" : "Needs work";
  return (
    <Badge tone={tone} size={size} dot className={cn("tnum", className)}>
      {label}
    </Badge>
  );
}

export function DeltaTag({ value, className, suffix = "pts" }) {
  const positive = value > 0;
  const zero = value === 0;
  return (
    <span
      className={cn(
        "tnum inline-flex items-center gap-0.5 text-[11px] font-semibold",
        zero ? "text-faint" : positive ? "text-strong" : "text-risk",
        className,
      )}
      title={zero ? "No change" : `${positive ? "Increase" : "Decrease"} of ${Math.abs(value)} ${suffix}`}
    >
      <span aria-hidden="true">{zero ? "±" : positive ? "▲" : "▼"}</span>
      {zero ? "0" : Math.abs(value)}
      <span className="font-normal opacity-70">{suffix}</span>
    </span>
  );
}
