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
import { HomeFaq, InteractiveDemoSection } from "@/components/home/Interactive";
import CmsSection from "@/components/home/CmsSection";

export const metadata = {
  title: "Prisma — Know exactly what to learn next",
  description:
    "Diagnose your Mathematics and English skills, discover your weak areas, and follow a personalized learning path built around your actual needs.",
  alternates: { canonical: "/" },
};

/**
 * Page 01 — Home.
 * Hero → interactive demo → problem → solution → proof → subjects → path →
 * how it works → progress → student → educators → testimonials → FAQ → CTA.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CmsSection section="demoQuiz"><InteractiveDemoSection /></CmsSection>
      <CmsSection section="problem"><ProblemSection /></CmsSection>
      <SolutionSection />
      <CmsSection section="reportProof"><ReportProof /></CmsSection>
      <CmsSection section="subjects"><MathPreview /></CmsSection>
      <CmsSection section="subjects"><EnglishPreview /></CmsSection>
      <CmsSection section="path"><PathPreview /></CmsSection>
      <HowItWorksHome />
      <CmsSection section="progress"><ProgressSection /></CmsSection>
      <BenefitsHome />
      <CmsSection section="educators"><EducatorsSection /></CmsSection>
      <CmsSection section="testimonials"><TestimonialsSection /></CmsSection>
      <CmsSection section="faq"><HomeFaq /></CmsSection>
      <FinalCTA />
    </>
  );
}
