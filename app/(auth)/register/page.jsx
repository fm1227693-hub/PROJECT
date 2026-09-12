import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Create account", description: "Create a free Prisma account — student, teacher or school.", alternates: { canonical: "/register" } };

export default function RegisterPage() {
  return <RegisterForm role="student" />;
}
