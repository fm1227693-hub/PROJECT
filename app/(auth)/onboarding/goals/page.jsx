import { OnboardingGoals } from "@/components/onboarding/OnboardingWizard";

export const metadata = { title: "Learning goals", alternates: { canonical: "/onboarding/goals" } };

export default function OnboardingGoalsPage() {
  return <OnboardingGoals />;
}
