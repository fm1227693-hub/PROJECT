import { ArrowRight, BookOpenCheck, Eye, Route, Sigma } from "lucide-react";

import { SAMPLE_PROFILE, SAMPLE_TIMELINE } from "@/lib/data/sampleResult";
import { buildResult } from "@/lib/engine/scoring";
import { diagnose } from "@/lib/engine/diagnose";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import Reveal from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import DiagnosticReport, { ReportActions } from "@/components/report/DiagnosticReport";

export const metadata = {
  title: "Sample Diagnostic Report",
  description:
    "A complete Prisma diagnostic report: Mathematics 68%, English 74%, with every skill scored, ranked by impact, and turned into a learning plan.",
  alternates: { canonical: "/sample-report" },
};

const latest = SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 1];
const previous = SAMPLE_TIMELINE[SAMPLE_TIMELINE.length - 2];
const result = buildResult(latest.topics);
const diagnosis = diagnose(latest.topics);

const READING_GUIDE = [
  {
    icon: Sigma,
    title: "Read the diagnosis line first",
    body: "It is the whole report in one sentence. Everything below it is evidence for that sentence.",
  },
  {
    icon: Eye,
    title: "Then read the impact ranking",
    body: "Gaps are ordered by how many points each one costs — not alphabetically, and not by how far below 100% they sit.",
  },
  {
    icon: BookOpenCheck,
    title: "Check the weights",
    body: "A 12%-weight topic that is 40 points below target matters more than a 5%-weight topic that is 20 points below.",
  },
  {
    icon: Route,
    title: "Finally, look at the plan",
    body: "It is generated from the ranking above. If you disagree with the plan, you are disagreeing with the ranking — and the arithmetic is visible.",
  },
];

/** Page 08 — Sample report. A real, fully explained diagnostic. */
export default function SampleReportPage() {
  return (
    <>
      <PageHero
        eyebrow="Sample report"
        title="This is what a Prisma report actually looks like."
        body="A real diagnostic from our demo learner — Amina, Grade 10 — taken on 6 September 2026. Every number here is derived from her topic scores, so the report cannot contradict itself."
        actions={[
          { label: "Take a Diagnostic", href: "/student/diagnostic/start" },
          { label: "How scoring works", href: "/how-it-works", variant: "secondary" },
        ]}
        meta={[
          { label: "Mathematics", value: String(result.math.score), suffix: "%" },
          { label: "English", value: String(result.english.score), suffix: "%" },
          { label: "Largest gap", value: diagnosis.topGaps[0]?.name ?? "—" },
          { label: "Attempts recorded", value: String(SAMPLE_TIMELINE.length) },
        ]}
      />

      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="How to read it"
            title="Four moves, in order."
            body="A report is only useful if you know which line to read first."
            align="center"
          />
        </Reveal>
        <Reveal variant="stagger" stagger={0.07} className="mx-auto mt-10 grid max-w-4xl gap-5 sm:grid-cols-2">
          {READING_GUIDE.map((item, index) => (
            <div key={item.title} className="flex gap-4 rounded-lg border border-line bg-canvas p-5">
              <span className="grid size-9 shrink-0 place-items-center rounded-md border border-brand-line bg-brand-soft text-brand">
                <item.icon className="size-[17px]" aria-hidden="true" />
              </span>
              <div>
                <p className="font-mono text-[10.5px] uppercase tracking-[0.13em] text-faint">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-1 text-[14.5px] font-semibold tracking-[-0.012em] text-ink">{item.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.body}</p>
              </div>
            </div>
          ))}
        </Reveal>
      </MarketingSection>

      <MarketingSection tone="canvas">
        <Reveal>
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h2 className="font-display text-[clamp(1.5rem,2.8vw,2.1rem)] leading-none tracking-[-0.028em] text-ink">
                The report
              </h2>
              <Badge tone="strong" size="sm" dot>
                Demo data
              </Badge>
            </div>
            <ReportActions />
          </div>
        </Reveal>

        <Reveal>
          <DiagnosticReport
            student={SAMPLE_PROFILE}
            date={latest.date}
            kind={latest.kind}
            durationMinutes={latest.durationMinutes}
            answered={30}
            topicScores={latest.topics}
            previousScores={previous.topics}
            planWeeks={3}
          />
        </Reveal>
      </MarketingSection>

      <CtaBand
        title="Now get your own."
        body="The free diagnostic produces exactly this report from your answers — the same skill definitions, the same impact ranking, the same generated plan."
        primary={{ label: "Take a Diagnostic", href: "/student/diagnostic/start" }}
        secondary={{ label: "See how the plan is built", href: "/personalized-learning" }}
        note={
          <>
            Want the educator view?{" "}
            <a href="/teacher/students/stu_0001" className="font-medium text-brand hover:underline">
              Open this learner in the teacher dashboard
              <ArrowRight className="ml-1 inline size-3" aria-hidden="true" />
            </a>
          </>
        }
      />
    </>
  );
}
