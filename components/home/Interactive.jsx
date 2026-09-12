import Link from "next/link";
import { ArrowRight, MousePointerClick } from "lucide-react";

import { FAQS } from "@/lib/data/faq";
import Reveal from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion";
import DemoQuiz from "@/components/home/DemoQuiz";
import InteractivePreview from "@/components/home/InteractivePreview";
import { MathPlot, EnglishLines } from "@/components/decor/Backgrounds";

/**
 * “Try it before you sign up” — the demo quiz and the three-stage product
 * preview, side by side. Both are fully interactive.
 */
export function InteractiveDemoSection() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-surface py-16 md:py-24">
      <div className="field-warm pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-page relative">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              eyebrow="Try it now — no account"
              title="Four questions. Then the whole loop."
              body="Answer a real mini diagnostic on the left. On the right, the exact three screens every Prisma learner sees after a full diagnostic: score, interpretation, plan."
            />
            <p className="flex items-center gap-2 rounded-full border border-line bg-canvas px-3.5 py-1.5 text-[12px] font-medium text-ink-soft">
              <MousePointerClick className="size-3.5 text-brand" aria-hidden="true" />
              Everything here is clickable
            </p>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <Reveal variant="scale">
            <DemoQuiz />
          </Reveal>
          <Reveal variant="scale" delay={0.08}>
            <InteractivePreview />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/** Homepage FAQ — six real answers, then the full help centre. */
export function HomeFaq() {
  const items = FAQS.slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-canvas py-16 md:py-24">
      <EnglishLines className="opacity-40" />
      <div className="container-page relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Questions"
            title="Asked before every signup."
            body="The six things people want to know before they spend twenty minutes on a diagnostic."
            size="md"
          />
          <Link
            href="/faq"
            className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-4 py-2.5 text-[13px] font-medium text-ink transition-[transform,border-color] duration-200 hover:-translate-y-px hover:border-line-3"
          >
            Open the full help centre
            <ArrowRight className="size-3.5 text-brand" aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal delay={0.06}>
          <Accordion items={items.map((item) => ({ ...item, content: item.answer }))} />
        </Reveal>
      </div>
    </section>
  );
}

/** Subject identity bands used between major sections. */
export function SubjectBand({ subject = "math" }) {
  return (
    <div className="relative h-24 overflow-hidden border-y border-line bg-surface" aria-hidden="true">
      {subject === "math" ? <MathPlot opacity={0.35} /> : <EnglishLines opacity={0.4} />}
    </div>
  );
}
