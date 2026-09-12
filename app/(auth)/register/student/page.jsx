import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Create student account", alternates: { canonical: "/register/student" } };

export default function RegisterStudentPage() {
  return <RegisterForm role="student" />;
}
