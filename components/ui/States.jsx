import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Skeletons — premium placeholders, never generic spinners
 * ------------------------------------------------------------------ */

export function Skeleton({ className, rounded = "md", ...props }) {
  return (
    <div
      className={cn(
        "skeleton",
        rounded === "sm" && "rounded-[5px]",
        rounded === "md" && "rounded-md",
        rounded === "lg" && "rounded-lg",
        rounded === "full" && "rounded-full",
        className,
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

export function SkeletonText({ lines = 3, className }) {
  return (
    <div className={cn("space-y-2", className)} aria-hidden="true">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === lines - 1 ? "w-2/3" : "w-full")} rounded="sm" />
      ))}
    </div>
  );
}

export function SkeletonCard({ className, withChart = false }) {
  return (
    <div className={cn("rounded-lg border border-line bg-surface p-5", className)} aria-hidden="true">
      <div className="flex items-start justify-between gap-3">
        <Skeleton className="h-3 w-24" rounded="sm" />
        <Skeleton className="size-7 rounded-md" />
      </div>
      <Skeleton className="mt-4 h-8 w-20" />
      {withChart ? <Skeleton className="mt-5 h-24 w-full" /> : <SkeletonText lines={2} className="mt-4" />}
    </div>
  );
}

export function SkeletonChart({ height = 220, className }) {
  return (
    <div className={cn("rounded-lg border border-line bg-surface p-5", className)} aria-hidden="true">
      <Skeleton className="h-3 w-32" rounded="sm" />
      <div className="mt-5 flex items-end gap-2" style={{ height }}>
        {[42, 68, 55, 80, 63, 90, 74].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonRow({ columns = 5, className }) {
  return (
    <div className={cn("grid items-center gap-4 border-b border-line px-5 py-3.5", className)} aria-hidden="true">
      {Array.from({ length: columns }).map((_, i) => (
        <Skeleton key={i} className={cn("h-3", i === 0 ? "w-2/3" : "w-1/2")} rounded="sm" />
      ))}
    </div>
  );
}

export function SkeletonTable({ rows = 6, columns = 5, className }) {
  return (
    <div className={cn("overflow-hidden rounded-lg border border-line bg-surface", className)} aria-hidden="true">
      <div className="border-b border-line bg-surface-2 px-5 py-3">
        <Skeleton className="h-3 w-40" rounded="sm" />
      </div>
      {Array.from({ length: rows }).map((_, i) => (
        <SkeletonRow key={i} columns={columns} className={cn(i === rows - 1 && "border-b-0")} />
      ))}
    </div>
  );
}

/** Full-page loading state used while a dashboard resolves its data. */
export function LoadingState({ label = "Loading your results" }) {
  return (
    <div className="space-y-5" role="status" aria-live="polite">
      <span className="sr-only">{label}…</span>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <SkeletonChart className="lg:col-span-2" />
        <SkeletonCard withChart />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Empty states
 * ------------------------------------------------------------------ */

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action,
  secondaryAction,
  tone = "neutral",
  className,
  compact = false,
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-dashed border-line-2 bg-surface-2/60 text-center",
        compact ? "px-6 py-8" : "px-6 py-14 md:px-12 md:py-20",
        className,
      )}
    >
      <span
        className={cn(
          "grid place-items-center rounded-lg border",
          compact ? "size-10" : "size-12",
          tone === "brand"
            ? "border-brand-line bg-brand-soft text-brand"
            : tone === "accent"
              ? "border-accent-line bg-accent-soft text-accent"
              : "border-line bg-surface text-muted",
        )}
      >
        <Icon className={compact ? "size-4" : "size-5"} aria-hidden="true" />
      </span>

      <h3 className={cn("mt-4 font-display text-ink", compact ? "text-[15px]" : "text-xl")}>{title}</h3>
      {description ? (
        <p className={cn("mt-2 max-w-md leading-relaxed text-muted", compact ? "text-[13px]" : "text-[14px]")}>
          {description}
        </p>
      ) : null}

      {action || secondaryAction ? (
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {action ? (
            typeof action === "string" ? (
              <span className="text-sm text-muted">{action}</span>
            ) : (
              action
            )
          ) : null}
          {secondaryAction}
        </div>
      ) : null}
    </div>
  );
}

/** The canonical "no diagnostic yet" state. */
export function NoResultsState({ href = "/student/diagnostic/start", compact = false }) {
  return (
    <EmptyState
      compact={compact}
      icon={Inbox}
      tone="brand"
      title="No diagnostic results yet"
      description="Take your first diagnostic to discover your strengths and weaknesses. It runs to 30 questions and takes about 20–30 minutes."
      action={<Button href={href} size={compact ? "sm" : "md"}>Start Diagnostic</Button>}
      secondaryAction={
        <Button href="/sample-report" variant="ghost" size={compact ? "sm" : "md"}>
          See a sample report
        </Button>
      }
    />
  );
}

/* ------------------------------------------------------------------ *
 * Error states
 * ------------------------------------------------------------------ */

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load your diagnostic results. Your answers are safe — nothing was lost.",
  onRetry,
  href,
  retryLabel = "Try again",
  className,
}) {
  return (
    <div
      role="alert"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-risk/25 bg-risk-soft/50 px-6 py-14 text-center",
        className,
      )}
    >
      <span className="grid size-12 place-items-center rounded-lg border border-risk/25 bg-surface text-risk">
        <AlertTriangle className="size-5" aria-hidden="true" />
      </span>
      <h3 className="mt-4 font-display text-xl text-ink">{title}</h3>
      <p className="mt-2 max-w-md text-[14px] leading-relaxed text-ink-soft">{description}</p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        {onRetry ? (
          <Button onClick={onRetry} icon={RefreshCw} size="sm" variant="secondary">
            {retryLabel}
          </Button>
        ) : null}
        {href ? (
          <Button href={href} size="sm">
            Back to dashboard
          </Button>
        ) : null}
      </div>
    </div>
  );
}
