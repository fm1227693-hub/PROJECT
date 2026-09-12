"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, LineChart, Route, ScanLine, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { diagnose } from "@/lib/engine/diagnose";
import { SpectrumRow } from "@/components/domain/Primitives";
import { Badge } from "@/components/ui/Badge";
import Button from "@/components/ui/Button";
import { Segmented } from "@/components/ui/Field";

const STAGES = [
  { id: "scores", label: "1 · Scores" },
  { id: "analysis", label: "2 · Analysis" },
  { id: "path", label: "3 · Path" },
];

/**
 * The product in three clicks — the exact loop Prisma sells:
 * score → interpretation → plan. Real data from the store, real engine output.
 */
export default function InteractivePreview() {
  const { topicScores, derived } = useApp();
  const [stage, setStage] = useState("scores");

  const diagnosis = useMemo(() => diagnose(topicScores), [topicScores]);
  const math = derived.breakdown.math;
  const english = derived.breakdown.english;
  const weeks = derived.plan.weeks.slice(0, 3);

  return (
    <div className="overflow-hidden rounded-xl border border-line bg-surface shadow-xl">
      {/* stage switcher */}
      <div className="flex items-center justify-between gap-3 border-b border-line bg-surface-2 px-4 py-3">
        <p className="flex items-center gap-2 text-[12.5px] font-semibold text-ink">
          <ScanLine className="size-4 text-brand" aria-hidden="true" />
          Live product preview
        </p>
        <Segmented options={STAGES} value={stage} onChange={setStage} size="sm" ariaLabel="Preview stage" />
      </div>

      {/* ---------------------------------------------------------- scores */}
      {stage === "scores" ? (
        <div className="p-5">
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: "Mathematics", value: math.score, tone: "brand", domains: math.domains },
              { label: "English", value: english.score, tone: "accent", domains: english.domains },
            ].map((subject) => (
              <div key={subject.label} className="rounded-lg border border-line bg-canvas p-4">
                <p className="eyebrow">{subject.label}</p>
                <p className={cn("tnum mt-2 font-display text-[44px] leading-none tracking-[-0.035em]", subject.tone === "brand" ? "text-brand" : "text-accent")}>
                  {subject.value}
                  <span className="ml-1 font-sans text-[14px] text-faint">%</span>
                </p>
                <ul className="mt-3.5 space-y-1.5">
                  {subject.domains.map((domain) => (
                    <li key={domain.id} className="flex items-baseline justify-between gap-2 text-[11.5px]">
                      <span className="truncate text-muted">{domain.name}</span>
                      <span className="tnum shrink-0 font-medium text-ink-soft">{domain.score}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-[12.5px] text-muted">A score is not information. Open the interpretation.</p>
            <Button size="sm" onClick={() => setStage("analysis")}>
              View analysis
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* -------------------------------------------------------- analysis */}
      {stage === "analysis" ? (
        <div className="p-5">
          <p className="rounded-md border border-brand-line bg-brand-soft/70 px-3.5 py-2.5 text-[13px] leading-relaxed text-ink">
            {diagnosis.headline}
          </p>
          <div className="mt-4 grid gap-5 sm:grid-cols-2">
            <div>
              <p className="eyebrow mb-2.5 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-strong" aria-hidden="true" />
                Strengths
              </p>
              <ul className="space-y-1.5">
                {diagnosis.math.strengths.slice(0, 2).concat(diagnosis.english.strengths.slice(0, 1)).map((item) => (
                  <li key={item.id}>
                    <SpectrumRow name={item.name} score={item.score} tone="strong" size="sm" showBand={false} />
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="eyebrow mb-2.5 flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-risk" aria-hidden="true" />
                Focus areas
              </p>
              <ul className="space-y-1.5">
                {diagnosis.topGaps.slice(0, 3).map((item) => (
                  <li key={item.id}>
                    <SpectrumRow name={item.name} score={item.score} tone="risk" size="sm" showBand={false} />
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="text-[12.5px] text-muted">
              Gaps ranked by impact: <span className="tnum font-semibold text-ink">+{diagnosis.topGaps[0]?.impact ?? 0} pts</span> from {diagnosis.topGaps[0]?.name}.
            </p>
            <Button size="sm" onClick={() => setStage("path")}>
              Build my learning path
              <Route className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* ------------------------------------------------------------ path */}
      {stage === "path" ? (
        <div className="p-5">
          <ol className="space-y-2.5">
            {weeks.map((week) => (
              <li key={week.index} className="rounded-lg border border-line bg-canvas p-4">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[13px] font-semibold text-ink">
                    <span className="tnum mr-2 font-mono text-[10.5px] text-faint">W{String(week.index).padStart(2, "0")}</span>
                    {week.topicName}
                  </p>
                  <span className="tnum shrink-0 text-[11px] text-muted">{week.minutes} min</span>
                </div>
                <p className="mt-1.5 flex flex-wrap gap-x-1.5 gap-y-1 text-[11.5px] text-muted">
                  {week.units.map((unit, i) => (
                    <span key={unit.key} className="flex items-center gap-1.5">
                      <span className={cn(unit.type === "assessment" ? "font-medium text-developing" : unit.type === "practice" ? "font-medium text-accent" : "text-ink-soft")}>
                        {unit.title}
                      </span>
                      {i < week.units.length - 1 ? <span className="text-line-3" aria-hidden="true">→</span> : null}
                    </span>
                  ))}
                </p>
              </li>
            ))}
          </ol>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
            <p className="flex items-center gap-1.5 text-[12.5px] text-muted">
              <Sparkles className="size-3.5 text-developing" aria-hidden="true" />
              Generated from the ranking above — never a fixed syllabus.
            </p>
            <Button href="/student/learning-path" size="sm">
              Open the full path
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
        </div>
      ) : null}

      {/* footer actions — always visible, always real */}
      <div className="flex flex-wrap items-center gap-2.5 border-t border-line bg-surface-2 px-5 py-3.5">
        <Button href="/student/diagnostic/start" size="sm" variant="secondary">
          Take the full diagnostic
        </Button>
        <Button href="/sample-report" size="sm" variant="ghost">
          <LineChart className="size-3.5" aria-hidden="true" />
          Read a full report
        </Button>
        <Link href="/personalized-learning" className="ml-auto inline-flex items-center gap-1 text-[12px] font-medium text-brand hover:underline">
          How the engine decides
          <ArrowRight className="size-3" aria-hidden="true" />
        </Link>
      </div>
    </div>
  );
}
