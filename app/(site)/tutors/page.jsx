import { AUDIENCES } from "@/lib/data/content";
import AudiencePage from "@/components/marketing/AudiencePage";
import { TutorDashPreview } from "@/components/marketing/DashPreviews";

export const metadata = {
  title: "For Tutors",
  description: AUDIENCES.tutors.body,
  alternates: { canonical: "/tutors" },
};

/** Page 12 — For tutors. */
export default function TutorsPage() {
  return (
    <AudiencePage
      copy={{
        ...AUDIENCES.tutors,
        benefitsTitle: "Built for one-to-one teaching.",
        stepsTitle: "A typical tutoring cycle.",
        stepNotes: [
          "It gives you an independent measure before you have taught a single minute.",
          "Impact ranking tells you which gap returns the most for the hours you are paid for.",
          "Practice sets keep the student working between sessions on the right topic.",
          "A printable before-and-after report is the clearest possible evidence of value.",
        ],
        ctaTitle: "Walk into every session already knowing where to start.",
        ctaBody: "The Teacher plan covers up to forty students — enough for a full private practice.",
      }}
      meta={[
        { label: "Student roster", value: "40" },
        { label: "Pre-session prep", value: "5", suffix: " min" },
        { label: "Practice sets", value: "Per topic" },
        { label: "Parent reports", value: "Printable" },
      ]}
      preview={<TutorDashPreview />}
      faqCategory="teachers"
      related={[
        { title: "Student detail", href: "/teacher/students/stu_0001", body: "The full analytic view of one learner." },
        { title: "Learning plans", href: "/teacher/students", body: "Review and adjust the plan generated for each student." },
        { title: "Assessment results", href: "/teacher/analytics", body: "Every submission from an assigned diagnostic." },
        { title: "Create assessment", href: "/teacher/classes", body: "Build a paper from the question bank in minutes." },
        { title: "For teachers", href: "/teachers", body: "Classroom-sized analytics and assignment workflows." },
        { title: "Pricing", href: "/pricing", body: "One plan covers tutoring and classroom use." },
      ]}
    />
  );
}
