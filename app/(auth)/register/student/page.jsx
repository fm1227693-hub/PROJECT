import { StudentRegisterForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Create student account", description: "Two minutes now, a personalized learning path for every week after.", alternates: { canonical: "/register/student" } };

export default function RegisterStudentPage() {
  return <StudentRegisterForm />;
}
