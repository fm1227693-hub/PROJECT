import { ForgotPasswordForm } from "@/components/auth/AuthForms";

export const metadata = { title: "Forgot password", alternates: { canonical: "/forgot-password" } };

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
