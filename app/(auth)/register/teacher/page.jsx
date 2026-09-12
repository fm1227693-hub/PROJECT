import { TeacherRegisterForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Apply for a teacher account", description: "Teacher workspaces are reviewed by our administration team before activation.", alternates: { canonical: "/register/teacher" } };

export default function RegisterTeacherPage() {
  return <TeacherRegisterForm />;
}
