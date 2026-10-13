import React from 'react';

const TICKER_ITEMS_1 = [
  "OPTIMUM ELC",
  "CAMBRIDGE STANDARDS",
  "CDI MOCK SIMULATOR",
  "IELTS 8.5 MASTERY",
  "AI ESSAY FEEDBACK",
  "BUKHARA · 39°46′N 64°25′E",
];

const TICKER_ITEMS_2 = [
  "INDIVIDUAL MENTORSHIP",
  "TASK 1 & TASK 2 AI ANALYSIS",
  "OFFICIAL TEST FORMAT",
  "ACCREDITED EXCELLENCE",
  "YOUR POTENTIAL · WITHOUT LIMITS",
];

export default function BrandTicker() {
  return (
    <section 
      aria-label="Optimum brand indicators ticker"
      className="relative w-full overflow-hidden py-6 sm:py-9 select-none z-20 border-y border-black/[0.06] dark:border-white/[0.07] bg-[#F4F2EC] dark:bg-[#07090b]/95 backdrop-blur-xl"
    >
      <style>{`
        .ticker-track-1 {
          display: flex;
          width: max-content;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          animation: oxMarqueeLeft 38s linear infinite;
        }
        .ticker-track-2 {
          display: flex;
          width: max-content;
          will-change: transform;
          transform: translate3d(0, 0, 0);
          animation: oxMarqueeRight 44s linear infinite;
        }
        @keyframes oxMarqueeLeft {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
        @keyframes oxMarqueeRight {
          0% { transform: translate3d(-50%, 0, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track-1, .ticker-track-2 {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* Row 1: Left to Right Marquee */}
      <div className="relative flex whitespace-nowrap overflow-hidden">
        <div className="ticker-track-1 gap-8 sm:gap-14 text-xs sm:text-sm font-black tracking-[0.25em] uppercase text-slate-900 dark:text-[#f2ede8]">
          {[...TICKER_ITEMS_1, ...TICKER_ITEMS_1].map((text, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-red-600 dark:hover:text-red-500 transition-colors cursor-default font-heading tracking-[0.22em]">{text}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-red-600 shadow-[0_0_8px_rgba(225,29,72,0.8)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Right to Left Reverse Marquee */}
      <div className="relative flex whitespace-nowrap overflow-hidden mt-2.5 sm:mt-3 opacity-75">
        <div className="ticker-track-2 gap-8 sm:gap-14 text-[10px] sm:text-xs font-extrabold tracking-[0.28em] uppercase text-slate-600 dark:text-slate-400">
          {[...TICKER_ITEMS_2, ...TICKER_ITEMS_2].map((text, idx) => (
            <div key={idx} className="flex items-center gap-6 sm:gap-8">
              <span className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-default">{text}</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-red-500/80" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
