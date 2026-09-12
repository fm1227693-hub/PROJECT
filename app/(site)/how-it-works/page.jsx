import { Check, Minus } from "lucide-react";

import { HOW_IT_WORKS } from "@/lib/data/content";
import { FAQS } from "@/lib/data/faq";
import Reveal from "@/components/motion/Reveal";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion";
import StoryJourney from "@/components/marketing/StoryJourney";

export const metadata = {
  title: "How it works",
  description:
    "Test, diagnose, learn, improve. The four-step Prisma method — and why the second step is the one that matters.",
  alternates: { canonical: "/how-it-works" },
};

const COMPARISON = [
  { label: "Reports one overall percentage", standard: true, prisma: true },
  { label: "Breaks the score into measured skills", standard: false, prisma: true },
  { label: "Ranks gaps by how many points they cost", standard: false, prisma: true },
  { label: "Explains the result in plain language", standard: false, prisma: true },
  { label: "Generates a sequenced plan from the gaps", standard: false, prisma: true },
  { label: "Compares retests on identical skill definitions", standard: false, prisma: true },
  { label: "Shows the same picture to student, teacher and school", standard: false, prisma: true },
];

/** Page 03 — How it works. Scroll-told four-step journey. */
export default function HowItWorksPage() {
  const relatedFaqs = FAQS.filter((item) => item.category === "diagnostics").slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={HOW_IT_WORKS.eyebrow}
        title={HOW_IT_WORKS.title}
        body={HOW_IT_WORKS.body}
        actions={[
          { label: "Take a Diagnostic", href: "/student/diagnostic/start" },
          { label: "See a sample report", href: "/sample-report", variant: "secondary" },
        ]}
        meta={HOW_IT_WORKS.steps.map((step) => ({ label: `${step.n} · ${step.title}`, value: step.time }))}
      />

      <MarketingSection tone="canvas">
        <StoryJourney steps={HOW_IT_WORKS.steps} />
      </MarketingSection>

      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="The difference"
            title="A test tells you where you finished. A diagnostic tells you where to go."
            body="Most assessment products stop after step one. Everything below the first row is what Prisma adds."
            align="center"
          />
        </Reveal>

        <Reveal variant="scale" className="mx-auto mt-10 max-w-3xl">
          <div className="overflow-hidden rounded-xl border border-line bg-surface">
            <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-line bg-surface-2 px-5 py-3">
              <p className="eyebrow">Capability</p>
              <p className="w-24 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-faint">Standard test</p>
              <p className="w-24 text-center text-[11px] font-semibold uppercase tracking-[0.08em] text-brand">Prisma</p>
            </div>
            <ul>
              {COMPARISON.map((row, index) => (
                <li
                  key={row.label}
                  className={`grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3.5 ${
                    index === COMPARISON.length - 1 ? "" : "border-b border-line"
                  }`}
                >
                  <span className="text-[13.5px] leading-snug text-ink">{row.label}</span>
                  <span className="grid w-24 place-items-center">
                    {row.standard ? (
                      <Check className="size-4 text-muted" aria-label="Included" />
                    ) : (
                      <Minus className="size-4 text-line-3" aria-label="Not included" />
                    )}
                  </span>
                  <span className="grid w-24 place-items-center">
                    {row.prisma ? (
                      <Check className="size-4 text-strong" aria-label="Included" />
                    ) : (
                      <Minus className="size-4 text-line-3" aria-label="Not included" />
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </MarketingSection>

      <MarketingSection tone="canvas">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="Questions" title="The things people ask before starting." size="md" />
          </Reveal>
          <Reveal delay={0.06}>
            <Accordion items={relatedFaqs.map((item) => ({ ...item, content: item.answer }))} tone="display" />
          </Reveal>
        </div>
      </MarketingSection>

      <CtaBand
        title="Twenty minutes to a plan."
        body="Start with the free diagnostic. No card, no commitment — just an honest picture of where you are."
        primary={{ label: "Take a Diagnostic", href: "/student/diagnostic/start" }}
        secondary={{ label: "Explore personalized learning", href: "/personalized-learning" }}
      />
    </>
  );
}
