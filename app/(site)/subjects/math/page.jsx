import { MATH_DIAGNOSTIC_PAGE } from "@/lib/data/content";
import SubjectMap from "@/components/marketing/SubjectMap";

export const metadata = {
  title: "Mathematics Topics",
  description: "The full Prisma Mathematics skill map: twelve measured skills across three domains.",
  alternates: { canonical: "/subjects/math" },
};

/** Page 06 — Mathematics topic map. */
export default function MathSubjectsPage() {
  return <SubjectMap subject="math" copy={MATH_DIAGNOSTIC_PAGE} />;
}
