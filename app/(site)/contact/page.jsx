import { Clock, Mail, MapPin, PhoneCall } from "lucide-react";

import { BRAND } from "@/lib/data/brand";
import Reveal from "@/components/motion/Reveal";
import { PageHero, MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";
import ContactForm from "@/components/marketing/ContactForm";

export const metadata = {
  title: "Contact",
  description: "Request a school demo, ask about a report, or talk to the people who built Prisma.",
  alternates: { canonical: "/contact" },
};

const CHANNELS = [
  { icon: Mail, label: "Email", value: BRAND.support, href: `mailto:${BRAND.support}`, note: "Replies within one working day" },
  { icon: PhoneCall, label: "School demos", value: "Book a 30-minute walkthrough", href: "#demo-form", note: "Live, with your own year-group data" },
  { icon: MapPin, label: "Based in", value: "Tashkent · serving globally", note: "Remote-first team" },
  { icon: Clock, label: "Support hours", value: "Mon–Fri, 09:00–19:00 UTC+5", note: "Exam seasons: weekends included" },
];

/** Contact & demo request. */
export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Talk to the people who built it."
        body="School rollouts, report questions, billing, partnerships — one form, routed to a person rather than a queue. School enquiries include a quote and a rollout outline in the reply."
        actions={[{ label: "Request a school demo", href: "#demo-form" }]}
      />

      <MarketingSection tone="canvas">
        <div id="demo-form" className="grid scroll-mt-28 gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:gap-14">
          <Reveal>
            <SectionHeading eyebrow="Send a message" title="What can we help with?" size="md" />
            <div className="mt-6">
              <ContactForm />
            </div>
          </Reveal>

          <Reveal delay={0.08} className="space-y-4">
            {CHANNELS.map((channel) => {
              const inner = (
                <>
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg border border-line bg-surface-2 text-brand">
                    <channel.icon className="size-[18px]" aria-hidden="true" />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[11px] font-semibold uppercase tracking-[0.1em] text-faint">{channel.label}</span>
                    <span className="mt-1 block text-[13.5px] font-semibold leading-snug text-ink">{channel.value}</span>
                    <span className="mt-0.5 block text-[12px] text-muted">{channel.note}</span>
                  </span>
                </>
              );
              return channel.href ? (
                <a key={channel.label} href={channel.href} className="card-lift flex items-start gap-4 rounded-lg border border-line bg-surface p-5">
                  {inner}
                </a>
              ) : (
                <div key={channel.label} className="flex items-start gap-4 rounded-lg border border-line bg-surface p-5">
                  {inner}
                </div>
              );
            })}

            <div className="rounded-lg border border-brand-line bg-brand-soft/60 p-5">
              <p className="text-[13px] font-semibold text-ink">Just exploring?</p>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-ink-soft">
                The fastest way to understand Prisma is to read a real report end to end — it takes about three minutes.
              </p>
              <a href="/sample-report" className="mt-3 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand hover:underline">
                Read the sample report →
              </a>
            </div>
          </Reveal>
        </div>
      </MarketingSection>
    </>
  );
}
