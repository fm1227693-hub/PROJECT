import { ENGLISH_DIAGNOSTIC_PAGE } from "@/lib/data/content";
import SubjectMap from "@/components/marketing/SubjectMap";

export const metadata = {
  title: "English Topics",
  description: "The full Prisma English skill map: thirteen measured skills across four domains.",
  alternates: { canonical: "/english" },
};

/** Page 07 — English topic map. */
export default function EnglishSubjectsPage() {
  return <SubjectMap subject="english" copy={ENGLISH_DIAGNOSTIC_PAGE} />;
}
