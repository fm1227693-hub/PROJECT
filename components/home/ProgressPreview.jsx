"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { SAMPLE_TIMELINE } from "@/lib/data/sampleResult";
import { buildResult } from "@/lib/engine/scoring";
import { compareSnapshots } from "@/lib/engine/diagnose";
import { TrendChart } from "@/components/charts";
import { ChartCard } from "@/components/charts";
import { DeltaTag } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

/** Six attempts, one line per subject — the progress story of the demo learner. */
export default function ProgressPreview() {
  const series = useMemo(
    () =>
      SAMPLE_TIMELINE.map((snapshot) => {
        const result = buildResult(snapshot.topics);
        return {
          label: formatDate(snapshot.date, { day: undefined, month: "short" }),
          math: result.math.score,
          english: result.english.score,
          overall: result.overall,
        };
      }),
    [],
  );

  const deltas = useMemo(() => {
    const first = SAMPLE_TIMELINE[0].topics;
    const last = SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1].topics;
    return compareSnapshots(first, last)
      .sort((a, b) => b.delta - a.delta)
      .slice(0, 5);
  }, []);

  const first = series[0];
  const last = series[series.length - 1];

  return (
    <div className="grid gap-5 lg:grid-cols-[1.55fr_1fr]">
      <ChartCard
        title="Progress across six diagnostics"
        description="Same skill definitions on every attempt, so the comparison is real."
        action={
          <Button href="/student/progress" variant="ghost" size="sm" iconRight={ArrowRight}>
            Full progress
          </Button>
        }
      >
        <TrendChart data={series} height={268} />
        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-line px-2 pt-3">
          {[
            { label: "Mathematics", before: first.math, after: last.math },
            { label: "English", before: first.english, after: last.english },
          ].map((item) => (
            <p key={item.label} className="flex items-center gap-2 text-[12.5px] text-muted">
              <span className="font-medium text-ink">{item.label}</span>
              <span className="tnum">
                {item.before}% → {item.after}%
              </span>
              <DeltaTag value={item.after - item.before} />
            </p>
          ))}
        </div>
      </ChartCard>

      <div className="flex flex-col rounded-lg border border-line bg-surface p-5 shadow-hairline">
        <p className="eyebrow">Biggest movements</p>
        <p className="mt-2 text-[13px] leading-relaxed text-muted">
          March baseline compared with the September diagnostic, skill by skill.
        </p>

        <ul className="mt-4 flex-1 space-y-2.5">
          {deltas.map((row) => (
            <li key={row.id} className="flex items-center gap-3 rounded-md border border-line bg-surface-2 px-3 py-2.5">
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  row.subject === "math" ? "bg-brand" : "bg-accent",
                )}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13px] font-medium text-ink">{row.name}</span>
                <span className="tnum block text-[11.5px] text-muted">
                  {row.before}% → {row.after}%
                </span>
              </span>
              <DeltaTag value={row.delta} className="shrink-0" />
            </li>
          ))}
        </ul>

        <div className="mt-4 border-t border-line pt-4">
          <p className="text-[12.5px] leading-relaxed text-ink-soft">
            Quadratic Equations is still the largest remaining gap — which is exactly why the generated
            plan starts there.
          </p>
          <Link href="/student/recommended-plan" className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand hover:underline">
            See the current plan
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}
