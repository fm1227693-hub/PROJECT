import { MATH_DIAGNOSTIC_PAGE } from "@/lib/data/content";
import DiagnosticPage from "@/components/marketing/DiagnosticPage";

export const metadata = {
  title: "Mathematics Diagnostic",
  description: MATH_DIAGNOSTIC_PAGE.body,
  alternates: { canonical: "/diagnostic/math" },
};

/** Page 04 — Math diagnostic explainer. */
export default function MathDiagnosticPage() {
  return <DiagnosticPage subject="math" copy={MATH_DIAGNOSTIC_PAGE} faqCategory="mathematics" />;
}
