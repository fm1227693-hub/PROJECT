"use client";

import dynamic from "next/dynamic";
import { cn } from "@/lib/utils";
import { Skeleton } from "@/components/ui/States";

/**
 * Lazy chart surface. Recharts is only fetched when a chart actually renders,
 * and every chart ships with a size-matched skeleton so nothing shifts.
 */

function ChartSkeleton({ height = 240, className }) {
  return (
    <div className={cn("w-full", className)} style={{ height }} aria-hidden="true">
      <div className="flex h-full items-end gap-2 px-1 pb-4">
        {[38, 62, 48, 76, 58, 84, 66].map((h, i) => (
          <Skeleton key={i} className="flex-1 rounded-t-[3px]" style={{ height: `${h}%` }} />
        ))}
      </div>
    </div>
  );
}

const lazy = (name, height) =>
  dynamic(() => import("./PrismaCharts").then((mod) => mod[name]), {
    ssr: false,
    loading: () => <ChartSkeleton height={height} />,
  });

export const TrendChart = lazy("TrendChart", 260);
export const TopicBars = lazy("TopicBars", 240);
export const CohortBars = lazy("CohortBars", 240);
export const SkillRadar = lazy("SkillRadar", 300);
export const WeeklyBars = lazy("WeeklyBars", 92);
export const Sparkline = lazy("Sparkline", 28);
export const TermComparison = lazy("TermComparison", 260);

/** Card chrome for any chart: title, meta, optional action, then the chart. */
export function ChartCard({ title, description, action, children, className, bodyClassName, footer, icon: Icon }) {
  return (
    <section className={cn("flex flex-col overflow-hidden rounded-lg border border-line bg-surface shadow-hairline", className)}>
      <header className="flex flex-wrap items-start justify-between gap-3 border-b border-line px-5 py-4">
        <div className="flex min-w-0 items-start gap-3">
          {Icon ? (
            <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-md border border-line bg-surface-2 text-ink-soft">
              <Icon className="size-4" aria-hidden="true" />
            </span>
          ) : null}
          <div className="min-w-0">
            <h3 className="text-[15px] font-semibold tracking-[-0.015em] text-ink">{title}</h3>
            {description ? <p className="mt-0.5 text-[12.5px] leading-relaxed text-muted">{description}</p> : null}
          </div>
        </div>
        {action ? <div className="shrink-0">{action}</div> : null}
      </header>
      <div className={cn("px-3 py-4 sm:px-4", bodyClassName)}>{children}</div>
      {footer ? <div className="border-t border-line px-5 py-3">{footer}</div> : null}
    </section>
  );
}
