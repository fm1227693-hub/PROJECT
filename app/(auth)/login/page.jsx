import { LoginForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Sign in", description: "Sign in to your Prisma diagnostic account.", alternates: { canonical: "/login" } };

export default function LoginPage() {
  return <LoginForm />;
}
