import { HelpCircle, ShieldCheck, Undo2, Users } from "lucide-react";

import { FAQS } from "@/lib/data/faq";
import Reveal from "@/components/motion/Reveal";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion";
import { ComparisonTable, PricingPlans } from "@/components/marketing/PricingPlans";

export const metadata = {
  title: "Pricing",
  description:
    "Free, Student, Pro, Teacher and School plans. Unlimited diagnostics, adaptive learning paths and class or organisation analytics.",
  alternates: { canonical: "/pricing" },
};

const GUARANTEES = [
  { icon: ShieldCheck, title: "No card for the free plan", body: "One full Mathematics and English diagnostic per month, with the complete topic-level report." },
  { icon: Undo2, title: "Cancel any time", body: "Upgrades are prorated immediately. Downgrades and cancellations take effect at the end of the billing period." },
  { icon: Users, title: "School pricing scales down", body: "Per-student pricing from $6 per month, with annual billing removing two months." },
  { icon: HelpCircle, title: "Your data is exportable", body: "Every result, plan and report can be downloaded as PDF — and as CSV on Teacher and School plans." },
];

/** Page 14 — Pricing. */
export default function PricingPage() {
  const faqs = FAQS.filter((item) => item.category === "subscriptions" || item.category === "accounts");

  return (
    <>
      <PageHero
        eyebrow="Pricing"
        title="Pay for interpretation, not for questions."
        body="Every plan includes the full diagnostic and the complete topic-level report. What changes between plans is how often you can measure, how deeply you can plan, and how many learners you can see."
        align="center"
        actions={[
          { label: "Start free", href: "/register" },
          { label: "See a sample report", href: "/sample-report", variant: "secondary" },
        ]}
      />

      <MarketingSection tone="canvas">
        <Reveal>
          <PricingPlans />
        </Reveal>
      </MarketingSection>

      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading
            eyebrow="Compare everything"
            title="The full matrix."
            body="Grouped by what you are actually buying: assessment, learning, insight and administration."
          />
        </Reveal>
        <Reveal delay={0.06} className="mt-10">
          <ComparisonTable />
        </Reveal>
      </MarketingSection>

      <MarketingSection tone="canvas">
        <Reveal variant="stagger" stagger={0.06} className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {GUARANTEES.map((item) => (
            <div key={item.title} className="rounded-lg border border-line bg-surface p-5">
              <span className="grid size-9 place-items-center rounded-md border border-line bg-surface-2 text-brand">
                <item.icon className="size-[17px]" aria-hidden="true" />
              </span>
              <h3 className="mt-3.5 text-[14.5px] font-semibold tracking-[-0.012em] text-ink">{item.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{item.body}</p>
            </div>
          ))}
        </Reveal>
      </MarketingSection>

      <MarketingSection tone="surface">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <Reveal>
            <SectionHeading eyebrow="Billing questions" title="Subscriptions and accounts." size="md" />
          </Reveal>
          <Reveal delay={0.06}>
            <Accordion items={faqs.map((item) => ({ ...item, content: item.answer }))} />
          </Reveal>
        </div>
      </MarketingSection>

      <CtaBand
        title="Start with the free diagnostic."
        body="You will see the complete report — every skill, every gap, every impact figure — before you decide anything."
        primary={{ label: "Create a free account", href: "/register" }}
        secondary={{ label: "Talk to us about a school", href: "/contact" }}
        note="No card required · cancel any time · data is exportable"
      />
    </>
  );
}
