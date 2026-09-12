import { Building2, KeyRound, Lock, ShieldCheck } from "lucide-react";

import { AUDIENCES } from "@/lib/data/content";
import AudiencePage from "@/components/marketing/AudiencePage";
import { SchoolDashPreview } from "@/components/marketing/DashPreviews";
import Reveal from "@/components/motion/Reveal";
import { MarketingSection } from "@/components/marketing/PageHero";
import { SectionHeading } from "@/components/ui/Card";

export const metadata = {
  title: "For Schools",
  description: AUDIENCES.schools.body,
  alternates: { canonical: "/schools" },
};

const GOVERNANCE = [
  { icon: Lock, title: "Role-based access", body: "Decide what a teacher may see about a student, and what a guardian may see at all." },
  { icon: KeyRound, title: "Single sign-on", body: "SAML and Google Workspace, with roster sync so accounts follow your MIS." },
  { icon: ShieldCheck, title: "Data ownership", body: "Assessment data stays with the school, exportable in full, never sold or used for advertising." },
  { icon: Building2, title: "Managed rollout", body: "Onboarding, staff training and a named success contact for the first two terms." },
];

/** Page 13 — For schools. */
export default function SchoolsPage() {
  return (
    <AudiencePage
      copy={{
        ...AUDIENCES.schools,
        benefitsTitle: "Organisation-level capability.",
        stepsTitle: "A school rollout.",
        stepNotes: [
          "One afternoon per year group produces the baseline every later comparison depends on.",
          "Organisation analytics turn that baseline into a short, evidence-based priority list.",
          "Departments plan against the same weakest-topic ranking instead of separate spreadsheets.",
          "The improvement rate between baseline and retest is the number leadership actually needs.",
        ],
        ctaTitle: "One shared picture of attainment.",
        ctaBody: "Per-student pricing from $6 per month, with annual billing removing two months.",
      }}
      meta={[
        { label: "Students", value: "Unlimited" },
        { label: "Teachers", value: "Unlimited" },
        { label: "From", value: "$6", suffix: " / student / mo" },
        { label: "Single sign-on", value: "SAML" },
      ]}
      preview={<SchoolDashPreview />}
      faqCategory="teachers"
      related={[
        { title: "School dashboard", href: "/school/dashboard", body: "Headline statistics for the whole organisation." },
        { title: "School analytics", href: "/school/analytics", body: "Mathematics vs English, strongest and weakest topics, improvement rate." },
        { title: "Students", href: "/school/students", body: "Every learner in the organisation with their current diagnosis." },
        { title: "Teachers", href: "/school/teachers", body: "Staff, their classes and diagnostic coverage." },
        { title: "Pricing", href: "/pricing", body: "School plan structure and volume pricing." },
        { title: "Contact", href: "/contact", body: "Request a quote for your enrolment." },
      ]}
      extra={
        <MarketingSection tone="canvas">
          <Reveal>
            <SectionHeading
              eyebrow="Governance"
              title="What an administrator controls."
              body="A school deployment is only as good as the trust it can hold. These are the controls, not the marketing version of them."
            />
          </Reveal>
          <Reveal variant="stagger" stagger={0.06} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {GOVERNANCE.map((item) => (
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
      }
    />
  );
}
