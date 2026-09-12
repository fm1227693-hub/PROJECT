import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { FAQS } from "@/lib/data/faq";
import Reveal from "@/components/motion/Reveal";
import { PageHero, CtaBand, MarketingSection, ProcessSteps, BenefitGrid } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion";

/**
 * Shared template for the four audience pages
 * (/students, /teachers, /tutors, /schools).
 */
export default function AudiencePage({ copy, tone = "brand", preview, meta, faqCategory, related = [], extra }) {
  const faqs = FAQS.filter((item) => item.category === faqCategory).slice(0, 4);

  return (
    <>
      <PageHero
        eyebrow={copy.eyebrow}
        title={copy.title}
        body={copy.body}
        actions={[copy.cta, { label: "See a sample report", href: "/sample-report", variant: "secondary" }]}
        meta={meta}
      />

      <MarketingSection tone="surface">
        <div className="grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="What you get" title={copy.benefitsTitle ?? "Everything included, nothing decorative."} size="md" />
            <div className="mt-7 space-y-5">
              {copy.benefits.map((benefit, index) => (
                <div key={benefit.title} className="flex gap-4">
                  <span className="tnum mt-0.5 grid size-7 shrink-0 place-items-center rounded-md border border-line bg-canvas font-mono text-[11px] text-muted">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold tracking-[-0.012em] text-ink">{benefit.title}</p>
                    <p className="mt-1 text-[13.5px] leading-relaxed text-muted">{benefit.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </Reveal>

          <Reveal variant="scale" delay={0.08} className="lg:sticky lg:top-28 lg:self-start">
            {preview}
          </Reveal>
        </div>
      </MarketingSection>

      <MarketingSection tone="canvas">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="In practice" title={copy.stepsTitle ?? "How a typical cycle runs."} size="md" />
            <p className="mt-4 text-[14.5px] leading-relaxed text-ink-soft">
              {copy.stepsIntro ??
                "Prisma is built around a loop: measure, interpret, act, measure again. The loop is short on purpose — four to six weeks — so the interpretation never goes stale."}
            </p>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="rounded-lg border border-line bg-surface p-6">
              <ProcessSteps steps={copy.steps.map((step, index) => ({ title: step, body: copy.stepNotes?.[index] }))} tone={tone} />
            </div>
          </Reveal>
        </div>
      </MarketingSection>

      {extra}

      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading eyebrow="Related" title="Where to go next." size="md" />
        </Reveal>
        <Reveal variant="stagger" stagger={0.06} className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {related.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="group flex items-start justify-between gap-4 rounded-lg border border-line bg-canvas p-5 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md"
            >
              <span className="min-w-0">
                <span className="block text-[14.5px] font-semibold tracking-[-0.012em] text-ink">{item.title}</span>
                <span className="mt-1.5 block text-[13px] leading-relaxed text-muted">{item.body}</span>
              </span>
              <ArrowRight className="mt-0.5 size-4 shrink-0 text-line-3 transition-[transform,color] duration-250 group-hover:translate-x-0.5 group-hover:text-brand" aria-hidden="true" />
            </Link>
          ))}
        </Reveal>

        {faqs.length ? (
          <div className="mt-12 grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
            <Reveal>
              <SectionHeading eyebrow="Questions" title="Before you start." size="md" />
            </Reveal>
            <Reveal delay={0.06}>
              <Accordion items={faqs.map((item) => ({ ...item, content: item.answer }))} />
            </Reveal>
          </div>
        ) : null}
      </MarketingSection>

      <CtaBand title={copy.ctaTitle ?? copy.title} body={copy.ctaBody ?? copy.body} primary={copy.cta} secondary={{ label: "Compare plans", href: "/pricing" }} />
    </>
  );
}

/** Reusable benefit strip for audience pages. */
export function AudienceBenefits({ items, columns = 3, tone = "brand" }) {
  return (
    <MarketingSection tone="canvas">
      <Reveal variant="stagger" stagger={0.06}>
        <BenefitGrid items={items} columns={columns} tone={tone} />
      </Reveal>
    </MarketingSection>
  );
}
