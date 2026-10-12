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
    <div className="relative w-full overflow-hidden py-8 sm:py-12 select-none z-20 border-y border-black/[0.06] dark:border-white/[0.06] bg-black/[0.02] dark:bg-white/[0.015]">
      {/* Row 1: Left to Right Marquee */}
      <div className="relative flex whitespace-nowrap overflow-hidden">
        <div className="flex animate-marquee-fast gap-8 sm:gap-14 text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase text-slate-800 dark:text-slate-200">
          {[...TICKER_ITEMS_1, ...TICKER_ITEMS_1].map((text, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-default font-heading">{text}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="flex animate-marquee-fast gap-8 sm:gap-14 text-xs sm:text-sm md:text-base font-black tracking-[0.25em] uppercase text-slate-800 dark:text-slate-200">
          {[...TICKER_ITEMS_1, ...TICKER_ITEMS_1].map((text, idx) => (
            <div key={`dup-${idx}`} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-default font-heading">{text}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right to Left Reverse Marquee */}
      <div className="relative flex whitespace-nowrap overflow-hidden mt-3 sm:mt-4 opacity-75">
        <div className="flex animate-marquee-reverse gap-8 sm:gap-14 text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.28em] uppercase text-slate-500 dark:text-slate-400">
          {[...TICKER_ITEMS_2, ...TICKER_ITEMS_2].map((text, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">{text}</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-red-500/70" />
            </div>
          ))}
        </div>
        <div aria-hidden="true" className="flex animate-marquee-reverse gap-8 sm:gap-14 text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.28em] uppercase text-slate-500 dark:text-slate-400">
          {[...TICKER_ITEMS_2, ...TICKER_ITEMS_2].map((text, idx) => (
            <div key={`dup2-${idx}`} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">{text}</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-red-500/70" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
