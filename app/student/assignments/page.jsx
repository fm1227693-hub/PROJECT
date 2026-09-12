import StudentAssignments from "@/components/student/AssignmentsView";

export const metadata = { title: "My assignments", description: "Everything your teacher has set, with deadlines and one clear action each." };

export default function StudentAssignmentsPage() {
  return <StudentAssignments />;
}
