import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Create teacher account", alternates: { canonical: "/register/teacher" } };

export default function RegisterTeacherPage() {
  return <RegisterForm role="teacher" />;
}
