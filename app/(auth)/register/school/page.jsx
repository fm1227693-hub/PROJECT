import { SchoolRegisterForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Register your school", description: "Organisation-wide analytics and rollout reporting for schools and centres.", alternates: { canonical: "/register/school" } };

export default function RegisterSchoolPage() {
  return <SchoolRegisterForm />;
}
