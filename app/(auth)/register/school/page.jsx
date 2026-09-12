import { RegisterForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Create school account", alternates: { canonical: "/register/school" } };

export default function RegisterSchoolPage() {
  return <RegisterForm role="school" />;
}
