import { PRIVACY_SECTIONS } from "@/lib/data/legal";
import LegalPage from "@/components/marketing/LegalPage";

export const metadata = {
  title: "Privacy Policy",
  description: "What Prisma collects, why, who can see it, and how to export or delete it.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy, in plain language."
      intro="Assessment data is unusually personal: it describes what a child does not yet know. We treat it that way. This policy explains exactly what we collect, who can see it, and how to take it with you or delete it."
      sections={PRIVACY_SECTIONS}
      meta={{
        type: "Privacy policy",
        stats: [
          { label: "Data sold", value: "Never" },
          { label: "Advertising", value: "None" },
          { label: "Export", value: "PDF · CSV" },
          { label: "Deletion", value: "Permanent" },
        ],
        other: { label: "terms of service", href: "/terms" },
      }}
    />
  );
}
