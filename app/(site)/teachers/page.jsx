import { AUDIENCES } from "@/lib/data/content";
import AudiencePage from "@/components/marketing/AudiencePage";
import { TeacherDashPreview } from "@/components/marketing/DashPreviews";

export const metadata = {
  title: "For Teachers",
  description: AUDIENCES.teachers.body,
  alternates: { canonical: "/teachers" },
};

/** Page 11 — For teachers. */
export default function TeachersPage() {
  return (
    <AudiencePage
      copy={{
        ...AUDIENCES.teachers,
        benefitsTitle: "What the Teacher plan gives you.",
        stepsTitle: "A term with Prisma.",
        stepNotes: [
          "Add students individually, or sync a roster from your school system.",
          "Assign the full diagnostic with a due date; results return to your analytics automatically.",
          "Plan the next lesson against the weakest-topic ranking rather than the syllabus order.",
          "Open a student when you need the detail — topic scores, bands, gaps and their generated plan.",
        ],
        ctaTitle: "See twenty-four different gaps in one class view.",
        ctaBody: "The class average tells you how the lesson landed. Prisma tells you who still needs it.",
      }}
      meta={[
        { label: "Students per class", value: "40" },
        { label: "Class analytics", value: "Live" },
        { label: "Custom assessments", value: "Unlimited" },
        { label: "Exports", value: "PDF · CSV" },
      ]}
      preview={<TeacherDashPreview />}
      faqCategory="teachers"
      related={[
        { title: "Teacher dashboard", href: "/teacher/dashboard", body: "Class averages, weak topics and recent diagnostics." },
        { title: "Student list", href: "/teacher/students", body: "Filter the roster by class, score, trend and diagnosis status." },
        { title: "Class analytics", href: "/teacher/classes", body: "Strongest and weakest topics across the cohort." },
        { title: "Assign a diagnostic", href: "/teacher/assign", body: "Set subjects, a due date and the students who receive it." },
        { title: "Question bank", href: "/teacher/question-bank", body: "Filter by subject, topic, difficulty, grade and item type." },
        { title: "For tutors", href: "/tutors", body: "The same analytics for one-to-one teaching." },
      ]}
    />
  );
}
