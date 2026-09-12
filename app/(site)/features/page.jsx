import {
  BarChart3, BookOpen, CalendarClock, ClipboardCheck, Download, Flag, Gauge,
  Layers, LineChart, ListChecks, Radar, Route, School, ScanLine, Share2,
  ShieldCheck, Sigma, Target, Timer, Trophy, Users,
} from "lucide-react";

import Reveal from "@/components/motion/Reveal";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { MathPlot, EnglishLines } from "@/components/decor/Backgrounds";

export const metadata = {
  title: "Features",
  description:
    "Everything Prisma does: adaptive diagnostics, topic-level scoring, impact ranking, generated learning paths, progress tracking and class analytics.",
  alternates: { canonical: "/features" },
};

const GROUPS = [
  {
    id: "assess",
    title: "Assessment",
    tone: "brand",
    decor: "math",
    blurb: "A diagnostic is only as good as its items and its attribution. Ours are tagged, weighted and explainable.",
    features: [
      { icon: ScanLine, name: "Adaptive diagnostics", body: "30 questions per subject, balanced across foundation, core and advanced difficulty so a weak learner and a strong one both get measured.", href: "/student/diagnostic/start", cta: "Start one" },
      { icon: Timer, name: "Timed or untimed", body: "Teachers can enforce a timer for exam conditions; self-study learners can take the same paper untimed.", href: "/student/diagnostic", cta: "See options" },
      { icon: ListChecks, name: "Question palette & flags", body: "Jump between questions, flag ones to revisit, and review every answer before submitting.", href: "/student/diagnostic/review", cta: "Try review" },
      { icon: BookOpen, name: "Reading & listening stimuli", body: "Real passages and transcript-based listening items — not single-sentence grammar ticks.", href: "/english-diagnostic", cta: "See English" },
      { icon: Flag, name: "Honest measurement", body: "Every mark is attributed to exactly one topic with a published weight, so scores cannot drift between attempts.", href: "/how-it-works", cta: "How scoring works" },
      { icon: ClipboardCheck, name: "Custom assessments", body: "Teachers build papers from the bank by topic, difficulty, grade and item type.", href: "/teacher/classes", cta: "Teacher view" },
    ],
  },
  {
    id: "insight",
    title: "Insight",
    tone: "accent",
    decor: "english",
    blurb: "The report is the product. It explains, ranks and refuses to hide behind a single number.",
    features: [
      { icon: Layers, name: "Topic-level decomposition", body: "25 skills across 7 domains, each with mastery %, band, weight and attempt history.", href: "/student/skills", cta: "Open skills" },
      { icon: Target, name: "Impact ranking", body: "Gaps ordered by weight × distance from target — the arithmetic is printed next to every recommendation.", href: "/student/diagnostic/analysis", cta: "See analysis" },
      { icon: Sigma, name: "Narrative diagnosis", body: "A plain-English paragraph states what the numbers mean, generated from the same data as the charts.", href: "/sample-report", cta: "Read one" },
      { icon: Radar, name: "Subject radar & spectra", body: "Domain radar, topic spectra and band distributions — all lazy-rendered, all hoverable.", href: "/student/progress", cta: "See charts" },
      { icon: BarChart3, name: "Cohort analytics", body: "Class and school views rank weakest topics across learners, not just per student.", href: "/teacher/analytics", cta: "Teacher analytics" },
      { icon: School, name: "Organisation analytics", body: "Year-group performance, participation and improvement rate for leadership.", href: "/school/analytics", cta: "School analytics" },
    ],
  },
  {
    id: "plan",
    title: "Planning & practice",
    tone: "brand",
    decor: "math",
    blurb: "A diagnosis without a plan is a verdict. Prisma always answers “so what do I do on Monday?”",
    features: [
      { icon: Route, name: "Generated learning paths", body: "Five checkable rules turn the impact ranking into a sequenced, week-by-week path.", href: "/personalized-learning", cta: "See the engine" },
      { icon: CalendarClock, name: "Study-budget presets", body: "Light, balanced or intensive — the same content packed into the week you actually have.", href: "/student/learning-path", cta: "Open my path" },
      { icon: Gauge, name: "Per-topic practice sets", body: "Six-question sets generated per topic, with instant explanations after every answer.", href: "/student/practice", cta: "Practice now" },
      { icon: LineChart, name: "Mini-tests per unit", body: "Each path week ends with a check that decides whether the topic moves on or repeats.", href: "/student/learning-path", cta: "See a week" },
      { icon: Trophy, name: "Sophisticated gamification", body: "Streaks, XP and achievements that reward consistency — no confetti, no cartoon mascots.", href: "/student/achievements", cta: "Achievements" },
      { icon: Download, name: "Exportable everything", body: "Reports as PDF, results as CSV. Your data leaves with you if you go.", href: "/sample-report", cta: "Sample report" },
    ],
  },
  {
    id: "track",
    title: "Progress & trust",
    tone: "accent",
    decor: "english",
    blurb: "Improvement is only real if the ruler never changes. Ours does not.",
    features: [
      { icon: LineChart, name: "Attempt timeline", body: "Every diagnostic plotted on identical skill definitions, March to September and beyond.", href: "/progress", cta: "See it" },
      { icon: Users, name: "Teacher & guardian views", body: "Read-only seats see reports and progress without touching the learner's account.", href: "/teachers", cta: "For educators" },
      { icon: ShieldCheck, name: "Privacy by role", body: "Learner sees everything; teacher sees their class; school sees aggregates unless enabled.", href: "/privacy", cta: "Privacy policy" },
      { icon: Share2, name: "Certificates", body: "Issued per completed diagnostic with score and date, verifiable by ID.", href: "/student/certificates", cta: "Certificates" },
    ],
  },
];

/** Page 04 — Features. The whole product, grouped and linked. */
export default function FeaturesPage() {
  return (
    <>
      <PageHero
        eyebrow="Features"
        title="Twenty-two things Prisma does properly."
        body="Grouped by what they are for: measuring, interpreting, planning and proving improvement. Every card links to the place where you can actually use the feature."
        align="center"
        actions={[
          { label: "Take a Diagnostic", href: "/student/diagnostic/start" },
          { label: "See a sample report", href: "/sample-report", variant: "secondary" },
        ]}
        meta={[
          { label: "Skills measured", value: "25" },
          { label: "Question bank", value: "60+", suffix: " items" },
          { label: "Plan rules", value: "5", suffix: " checkable" },
          { label: "Roles", value: "4" },
        ]}
      />

      {GROUPS.map((group, groupIndex) => (
        <MarketingSection key={group.id} tone={groupIndex % 2 ? "surface" : "canvas"}>
          <div className="relative">
            {group.decor === "math" ? <MathPlot className="opacity-60 mask-fade-b" /> : <EnglishLines className="opacity-50 mask-fade-b" />}
            <div className="relative">
              <Reveal>
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <SectionHeading eyebrow={group.title} title={group.blurb} size="md" />
                  <Badge tone={group.tone} size="sm">{group.features.length} features</Badge>
                </div>
              </Reveal>

              <Reveal variant="stagger" stagger={0.05} className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.features.map((feature) => (
                  <article key={feature.name} className="card-lift rule-top relative flex flex-col overflow-hidden rounded-lg border border-line bg-surface p-5">
                    <span className={`grid size-9 place-items-center rounded-md border ${group.tone === "brand" ? "border-brand-line bg-brand-soft text-brand" : "border-accent-line bg-accent-soft text-accent"}`}>
                      <feature.icon className="size-[17px]" aria-hidden="true" />
                    </span>
                    <h3 className="mt-3.5 text-[14.5px] font-semibold tracking-[-0.012em] text-ink">{feature.name}</h3>
                    <p className="mt-1.5 flex-1 text-[12.5px] leading-relaxed text-muted">{feature.body}</p>
                    <a href={feature.href} className="mt-3.5 inline-flex items-center gap-1 text-[12px] font-medium text-brand hover:underline">
                      {feature.cta} →
                    </a>
                  </article>
                ))}
              </Reveal>
            </div>
          </div>
        </MarketingSection>
      ))}

      <CtaBand
        title="The fastest way to judge a feature is to use it."
        body="No account needed for the demo quiz; a free account for the full diagnostic, the report and the generated plan."
        primary={{ label: "Start free", href: "/register" }}
        secondary={{ label: "Compare plans", href: "/pricing" }}
      />
    </>
  );
}
