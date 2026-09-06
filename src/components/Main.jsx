import React from 'react';
import HeroSection from './home/HeroSection';
import PracticeStudioSection from './home/PracticeStudioSection';
import CoursesSection from './home/CoursesSection';
import BenefitsSection from './home/BenefitsSection';
import ResultsSection from './home/ResultsSection';
import MentorsSection from './home/MentorsSection';
import AboutTrustSection from './home/AboutTrustSection';
import FAQSection from './home/FAQSection';
import CTASection from './home/CTASection';

export default function Main() {
  return (
    <main className="relative min-h-screen">
      {/* 1. Cinematic Editorial Hero with Live CDI Exam Simulator & Band Calculator */}
      <HeroSection />

      {/* 2. Interactive Digital Practice Studio (Reading, Listening, AI Writing, Placement) */}
      <PracticeStudioSection />

      {/* 3. Course Roadmap & CEFR Journey Matrix */}
      <CoursesSection />

      {/* 4. Why OptimumELC / 3 Core Principles & Comparative Matrix */}
      <BenefitsSection />

      {/* 5. Verified Hall of Fame & Student Certificates Gallery */}
      <ResultsSection />

      {/* 6. Expert Faculty & Senior Mentors Showcase */}
      <MentorsSection />

      {/* 7. Bukhara Campus & Trust Building Section */}
      <AboutTrustSection />

      {/* 8. Interactive FAQ Accordion */}
      <FAQSection />

      {/* 9. High-Conversion Booking Terminal */}
      <CTASection />
    </main>
  );
}
