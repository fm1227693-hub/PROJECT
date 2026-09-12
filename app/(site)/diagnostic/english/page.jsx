import { ENGLISH_DIAGNOSTIC_PAGE } from "@/lib/data/content";
import DiagnosticPage from "@/components/marketing/DiagnosticPage";

export const metadata = {
  title: "English Diagnostic",
  description: ENGLISH_DIAGNOSTIC_PAGE.body,
  alternates: { canonical: "/diagnostic/english" },
};

/** Page 05 — English diagnostic explainer. */
export default function EnglishDiagnosticPage() {
  return <DiagnosticPage subject="english" copy={ENGLISH_DIAGNOSTIC_PAGE} faqCategory="english" />;
}
