import { TERMS_SECTIONS } from "@/lib/data/legal";
import LegalPage from "@/components/marketing/LegalPage";

export const metadata = {
  title: "Terms of Service",
  description: "The agreement behind the Prisma diagnostic center: accounts, assessment integrity, subscriptions and liability.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms of service."
      intro="Short, readable, and honest about what a diagnostic can and cannot promise. The sections that matter most are assessment integrity and subscriptions — they protect the validity of every score in the system."
      sections={TERMS_SECTIONS}
      meta={{
        type: "Terms of service",
        stats: [
          { label: "Sections", value: "10" },
          { label: "Version", value: "2.4" },
          { label: "Updated", value: "1 Sep 2026" },
          { label: "Governing law", value: "England & Wales" },
        ],
        other: { label: "privacy policy", href: "/privacy" },
      }}
    />
  );
}
