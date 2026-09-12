import { Mail, MessageSquare } from "lucide-react";

import { BRAND } from "@/lib/data/brand";
import Reveal from "@/components/motion/Reveal";
import { PageHero, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import FaqBrowser from "@/components/marketing/FaqBrowser";

export const metadata = {
  title: "FAQ",
  description:
    "Answers about diagnostics, Mathematics, English, teachers and schools, subscriptions, accounts and data.",
  alternates: { canonical: "/faq" },
};

/** Page 15 — FAQ. */
export default function FaqPage() {
  return (
    <>
      <PageHero
        eyebrow="Help centre"
        title="Questions, answered properly."
        body="Twenty answers across six categories. If yours is not here, the contact form reaches the people who built the product — not a ticket queue."
        align="center"
      />

      <MarketingSection tone="canvas">
        <Reveal>
          <FaqBrowser />
        </Reveal>
      </MarketingSection>

      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading eyebrow="Still stuck?" title="Two ways to reach a person." size="md" align="center" />
        </Reveal>
        <Reveal variant="stagger" stagger={0.07} className="mx-auto mt-8 grid max-w-3xl gap-5 sm:grid-cols-2">
          <a
            href={`mailto:${BRAND.support}`}
            className="group rounded-lg border border-line bg-canvas p-6 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md"
          >
            <span className="grid size-10 place-items-center rounded-lg border border-brand-line bg-brand-soft text-brand">
              <Mail className="size-[18px]" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.012em] text-ink">Email support</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              {BRAND.support} — replies within one working day, including questions about a specific report.
            </p>
          </a>

          <a
            href="/contact"
            className="group rounded-lg border border-line bg-canvas p-6 transition-[transform,box-shadow,border-color] duration-250 hover:-translate-y-0.5 hover:border-line-2 hover:shadow-md"
          >
            <span className="grid size-10 place-items-center rounded-lg border border-accent-line bg-accent-soft text-accent">
              <MessageSquare className="size-[18px]" aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-[15px] font-semibold tracking-[-0.012em] text-ink">School and volume enquiries</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-muted">
              Tell us your enrolment and year groups and we will return a quote and a rollout outline.
            </p>
          </a>
        </Reveal>
      </MarketingSection>
    </>
  );
}
