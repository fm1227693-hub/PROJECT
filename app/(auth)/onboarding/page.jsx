import { OnboardingStart } from "@/components/onboarding/OnboardingWizard";

export const metadata = { title: "Welcome to Prisma", alternates: { canonical: "/onboarding" } };

export default function OnboardingPage() {
  return <OnboardingStart />;
}
