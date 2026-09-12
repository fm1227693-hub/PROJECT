import { AUDIENCES } from "@/lib/data/content";
import AudiencePage from "@/components/marketing/AudiencePage";
import { StudentDashPreview } from "@/components/marketing/DashPreviews";

export const metadata = {
  title: "For Students",
  description: AUDIENCES.students.body,
  alternates: { canonical: "/students" },
};

/** Page 10 — For students. */
export default function StudentsPage() {
  return (
    <AudiencePage
      copy={{
        ...AUDIENCES.students,
        benefitsTitle: "Six things change the first time you use it.",
        stepsTitle: "Your first four weeks with Prisma.",
        stepNotes: [
          "Thirty questions, twenty to thirty minutes, no timer unless you want one.",
          "The report ranks your gaps by how many points each one costs — not by how they feel.",
          "The plan is generated from that ranking. Week one always starts with your highest-impact gap.",
          "Same skill definitions, so the comparison is real rather than an easier paper.",
        ],
        ctaTitle: "Stop revising everything.",
        ctaBody: "Twenty minutes tells you what to do with the next twenty hours.",
      }}
      meta={[
        { label: "Skills measured", value: "25" },
        { label: "Diagnostic time", value: "20–30", suffix: " min" },
        { label: "Free diagnostics", value: "1", suffix: " / month" },
        { label: "Topics in the plan", value: "Up to 6" },
      ]}
      preview={<StudentDashPreview />}
      faqCategory="diagnostics"
      related={[
        { title: "Mathematics diagnostic", href: "/math-diagnostic", body: "Twelve measured skills across arithmetic, algebra and geometry." },
        { title: "English diagnostic", href: "/english-diagnostic", body: "Grammar, vocabulary, reading and listening — reported separately." },
        { title: "Personalized learning", href: "/personalized-learning", body: "Exactly how a diagnosis becomes a weekly plan." },
        { title: "Sample report", href: "/sample-report", body: "A real report from our demo learner, fully explained." },
        { title: "Progress tracking", href: "/student/progress", body: "Compare every attempt on the same skill definitions." },
        { title: "Pricing", href: "/pricing", body: "Free, Student, Pro, Teacher and School plans." },
      ]}
    />
  );
}
