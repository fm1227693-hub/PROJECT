import { Building2, Compass, GraduationCap, Layers, Target, Telescope, TriangleAlert } from "lucide-react";

import { ABOUT, TRUST } from "@/lib/data/content";
import { BRAND, BRAND_STORY } from "@/lib/data/brand";
import Reveal from "@/components/motion/Reveal";
import { PageHero, CtaBand, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";

export const metadata = {
  title: "About",
  description: ABOUT.intro,
  alternates: { canonical: "/about" },
};

const SECTION_ICONS = {
  mission: Target,
  problem: TriangleAlert,
  solution: Layers,
  philosophy: Compass,
  approach: GraduationCap,
  vision: Telescope,
};

/** Page 02 — About. Mission, problem, solution, philosophy, approach, vision. */
export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow={ABOUT.eyebrow}
        title={ABOUT.title}
        body={ABOUT.intro}
        meta={[
          { label: "Founded", value: String(BRAND.founded) },
          { label: "Subjects", value: "2", hint: "Mathematics · English" },
          { label: "Skills measured", value: "25" },
          { label: "Audiences", value: "4", hint: "Students · tutors · teachers · schools" },
        ]}
      />

      <MarketingSection tone="surface">
        <Reveal>
          <div className="grid gap-px overflow-hidden rounded-xl border border-line bg-line lg:grid-cols-3">
            {[
              { label: BRAND_STORY.problem, body: BRAND_STORY.insight },
              { label: "The reframing", body: BRAND_STORY.promise },
              { label: "The name", body: "A prism takes one beam and returns the spectrum that was always inside it. That is exactly what a Prisma report does to a score." },
            ].map((block) => (
              <div key={block.label} className="bg-surface p-6 lg:p-7">
                <p className="eyebrow">{block.label}</p>
                <p className="mt-3 text-[14.5px] leading-relaxed text-ink-soft">{block.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </MarketingSection>

      <MarketingSection tone="canvas">
        <Reveal>
          <SectionHeading eyebrow="What we believe" title="Six positions, argued in full." body="These are not values on a wall — each one is a constraint that shows up in the product." />
        </Reveal>

        <div className="mt-12 space-y-px overflow-hidden rounded-xl border border-line bg-line">
          {ABOUT.sections.map((section, index) => {
            const Icon = SECTION_ICONS[section.id] ?? Layers;
            return (
              <Reveal key={section.id} delay={index * 0.04}>
                <article className="grid gap-5 bg-surface p-6 md:grid-cols-[220px_1fr] md:gap-10 md:p-8">
                  <div className="flex items-start gap-3 md:block">
                    <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-canvas text-brand">
                      <Icon className="size-[18px]" aria-hidden="true" />
                    </span>
                    <div className="md:mt-4">
                      <p className="font-mono text-[10.5px] uppercase tracking-[0.14em] text-faint">
                        {String(index + 1).padStart(2, "0")}
                      </p>
                      <h2 className="mt-1 font-display text-[21px] leading-snug tracking-[-0.02em] text-ink">
                        {section.title}
                      </h2>
                    </div>
                  </div>
                  <p className="text-[15px] leading-[1.75] text-ink-soft">{section.body}</p>
                </article>
              </Reveal>
            );
          })}
        </div>
      </MarketingSection>

      <MarketingSection tone="surface">
        <Reveal>
          <SectionHeading eyebrow="Operating principles" title="Four rules that shape every decision." align="center" />
        </Reveal>
        <Reveal variant="stagger" stagger={0.07} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ABOUT.principles.map((principle) => (
            <div key={principle.title} className="rounded-lg border border-line bg-canvas p-5">
              <Building2 className="size-[18px] text-brand" aria-hidden="true" />
              <h3 className="mt-3 text-[14.5px] font-semibold tracking-[-0.012em] text-ink">{principle.title}</h3>
              <p className="mt-1.5 text-[13px] leading-relaxed text-muted">{principle.body}</p>
            </div>
          ))}
        </Reveal>

        <Reveal delay={0.1} className="mt-10">
          <div className="grid gap-px overflow-hidden rounded-lg border border-line bg-line sm:grid-cols-2">
            {TRUST.refusals.map((item) => (
              <div key={item.title} className="bg-surface px-5 py-4">
                <p className="text-[13.5px] font-semibold text-ink">{item.title}</p>
                <p className="mt-1 text-[13px] leading-relaxed text-muted">{item.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </MarketingSection>

      <CtaBand
        title="See the method in practice."
        body="The clearest way to understand Prisma is to read one of its reports."
        primary={{ label: "View a sample report", href: "/sample-report" }}
        secondary={{ label: "Read the method", href: "/how-it-works" }}
      />
    </>
  );
}
