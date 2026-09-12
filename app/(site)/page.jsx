import Hero from "@/components/home/Hero";
import {
  BenefitsHome,
  FinalCTA,
  HowItWorksHome,
  ProblemSection,
  SolutionSection,
  TrustStrip,
} from "@/components/home/Story";
import { EnglishPreview, MathPreview, PathPreview } from "@/components/home/Diagnostics";
import { EducatorsSection, ProgressSection, ReportProof, TestimonialsSection } from "@/components/home/Proof";

export const metadata = {
  title: "Prisma — Know exactly what to learn next",
  description:
    "Diagnose your Mathematics and English skills, discover your weak areas, and follow a personalized learning path built around your actual needs.",
  alternates: { canonical: "/" },
};

/**
 * Page 01 — Home.
 * Landing story: Problem → Solution → Proof → Personalization → Progress → CTA.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <ProblemSection />
      <SolutionSection />
      <ReportProof />
      <MathPreview />
      <EnglishPreview />
      <PathPreview />
      <HowItWorksHome />
      <ProgressSection />
      <BenefitsHome />
      <EducatorsSection />
      <TestimonialsSection />
      <FinalCTA />
    </>
  );
}
