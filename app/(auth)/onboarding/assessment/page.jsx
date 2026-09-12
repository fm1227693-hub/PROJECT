import { OnboardingAssessment } from "@/components/onboarding/OnboardingWizard";

export const metadata = { title: "Assessment preferences", alternates: { canonical: "/onboarding/assessment" } };

export default function OnboardingAssessmentPage() {
  return <OnboardingAssessment />;
}
