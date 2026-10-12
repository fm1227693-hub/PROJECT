import React from 'react';

const TICKER_ITEMS_1 = [
  "LEARN WITH PURPOSE",
  "BUILD YOUR FUTURE",
  "THINK BEYOND LIMITS",
  "OPTIMUM EDUCATION",
  "IELTS 8.5 MASTERY",
  "CAMBRIDGE STANDARDS",
];

const TICKER_ITEMS_2 = [
  "CDI MOCK SIMULATOR",
  "AI ESSAY EVALUATION",
  "INDIVIDUAL MENTORSHIP",
  "PROVEN RESULTS",
  "ACCREDITED EXCELLENCE",
];

export default function BrandTicker() {
  return (
    <div className="relative w-full overflow-hidden py-10 sm:py-14 select-none -my-4 z-20">
      {/* Background Subtle Angular Cut */}
      <div className="absolute inset-0 bg-gradient-to-r from-red-950/20 via-black/40 to-slate-950/30 backdrop-blur-md -skew-y-2 scale-105 pointer-events-none border-y border-white/[0.06]" />

      {/* Row 1: Left to Right Marquee */}
      <div className="relative flex whitespace-nowrap overflow-hidden -skew-y-2 transform-gpu">
        <div className="flex animate-marquee-fast gap-8 sm:gap-12 text-sm sm:text-base md:text-lg font-black tracking-[0.25em] uppercase text-white/80 will-change-transform">
          {[...TICKER_ITEMS_1, ...TICKER_ITEMS_1].map((text, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-red-500 transition-colors cursor-default font-heading">{text}</span>
              <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_#ef4444]" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="flex animate-marquee-fast gap-8 sm:gap-12 text-sm sm:text-base md:text-lg font-black tracking-[0.25em] uppercase text-white/80">
          {[...TICKER_ITEMS_1, ...TICKER_ITEMS_1].map((text, idx) => (
            <div key={`dup-${idx}`} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-red-500 transition-colors cursor-default font-heading">{text}</span>
              <span className="w-2 h-2 rounded-full bg-red-600 shadow-[0_0_10px_#ef4444]" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right to Left Reverse Marquee with Accent Hue */}
      <div className="relative flex whitespace-nowrap overflow-hidden -skew-y-2 mt-3 sm:mt-4 opacity-70 transform-gpu">
        <div className="flex animate-marquee-reverse gap-8 sm:gap-12 text-xs sm:text-sm md:text-base font-extrabold tracking-[0.3em] uppercase text-slate-400 will-change-transform">
          {[...TICKER_ITEMS_2, ...TICKER_ITEMS_2].map((text, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-white transition-colors cursor-default">{text}</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="flex animate-marquee-reverse gap-8 sm:gap-12 text-xs sm:text-sm md:text-base font-extrabold tracking-[0.3em] uppercase text-slate-400">
          {[...TICKER_ITEMS_2, ...TICKER_ITEMS_2].map((text, idx) => (
            <div key={`dup2-${idx}`} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-white transition-colors cursor-default">{text}</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
