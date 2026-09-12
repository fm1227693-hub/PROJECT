import { cn } from "@/lib/utils";

/**
 * PRISMA decorative vocabulary.
 *
 * Static, cheap SVG/CSS layers that give each subject a visual language:
 *   math    → coordinate plots, curves, points, equation fragments
 *   english → baselines, word fragments, quotation marks, letter grids
 *
 * Every export is aria-hidden, pointer-events-none and absolutely positioned.
 * No filters, no continuous animation — composition only.
 */

const base = "pointer-events-none absolute inset-0 overflow-hidden";

/* ---------------------------------------------------------------- math ---- */

/** Fine coordinate plane with one parabola, one line and a few plotted points. */
export function MathPlot({ className, opacity = 0.5 }) {
  return (
    <div className={cn(base, className)} style={{ opacity }} aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1200 600" fill="none">
        <defs>
          <pattern id="mp-fine" width="24" height="24" patternUnits="userSpaceOnUse">
            <path d="M24 0H0V24" stroke="currentColor" strokeWidth="0.5" className="text-brand/10" />
          </pattern>
          <pattern id="mp-bold" width="120" height="120" patternUnits="userSpaceOnUse">
            <path d="M120 0H0V120" stroke="currentColor" strokeWidth="0.8" className="text-brand/16" />
          </pattern>
        </defs>
        <rect width="1200" height="600" fill="url(#mp-fine)" />
        <rect width="1200" height="600" fill="url(#mp-bold)" />
        {/* axes */}
        <path d="M0 420H1200" stroke="currentColor" strokeWidth="1" className="text-brand/25" />
        <path d="M180 0V600" stroke="currentColor" strokeWidth="1" className="text-brand/25" />
        {/* parabola y = x² */}
        <path d="M300 120C420 400 500 470 600 470C700 470 780 400 900 120" stroke="currentColor" strokeWidth="1.4" className="text-brand/35" />
        {/* line y = mx + c */}
        <path d="M120 520L1080 160" stroke="currentColor" strokeWidth="1.2" className="text-accent/30" strokeDasharray="6 6" />
        {/* plotted points */}
        {[[420, 330], [600, 470], [780, 330], [860, 240]].map(([x, y]) => (
          <g key={`${x}-${y}`}>
            <circle cx={x} cy={y} r="3.5" className="fill-brand/45" />
            <circle cx={x} cy={y} r="8" stroke="currentColor" strokeWidth="1" className="text-brand/25" />
          </g>
        ))}
        {/* right-angle marker */}
        <path d="M180 404h16v16h-16z" stroke="currentColor" strokeWidth="1" className="text-brand/30" />
      </svg>
    </div>
  );
}

/** Scattered equation fragments — mono type, very low contrast. */
export function EquationScatter({ className, opacity = 0.55 }) {
  const items = [
    ["2x + 5 = 17", "6%", "12%", "-4deg"],
    ["a² + b² = c²", "72%", "8%", "3deg"],
    ["y = mx + c", "16%", "68%", "2deg"],
    ["Δ = b² − 4ac", "64%", "74%", "-3deg"],
    ["f(x) = x² − 4x + 3", "38%", "38%", "1.5deg"],
    ["x = −b ± √Δ / 2a", "82%", "44%", "-2deg"],
    ["∑ wᵢ·sᵢ / ∑ wᵢ", "6%", "42%", "2.5deg"],
    ["|x − 3| ≤ 7", "44%", "86%", "-1.5deg"],
  ];
  return (
    <div className={cn(base, className)} style={{ opacity }} aria-hidden="true">
      {items.map(([text, left, top, rot]) => (
        <span
          key={text}
          className="absolute font-mono text-[11px] tracking-tight text-brand/35 select-none"
          style={{ left, top, transform: `rotate(${rot})` }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}

/** A single clean curve that reads as “a graph drawing itself”. Static. */
export function CurveSketch({ className, tone = "brand" }) {
  return (
    <div className={cn(base, className)} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 600 260" fill="none" preserveAspectRatio="none">
        <path
          d="M0 220C90 214 130 150 200 140C280 128 300 190 380 170C450 152 470 60 600 44"
          stroke="currentColor"
          strokeWidth="1.6"
          className={tone === "brand" ? "text-brand/40" : "text-accent/40"}
        />
        <path
          d="M0 236C120 232 160 190 240 184C330 177 360 214 440 200C510 188 540 130 600 118"
          stroke="currentColor"
          strokeWidth="1"
          strokeDasharray="4 6"
          className={tone === "brand" ? "text-accent/30" : "text-brand/30"}
        />
        {[[200, 140], [380, 170], [600, 44]].map(([x, y]) => (
          <circle key={x} cx={x} cy={y} r="3" className={tone === "brand" ? "fill-brand/50" : "fill-accent/50"} />
        ))}
      </svg>
    </div>
  );
}

/** Horizontal number line with ticks and one highlighted interval. */
export function NumberLine({ className }) {
  return (
    <div className={cn(base, className)} aria-hidden="true">
      <svg className="h-full w-full" viewBox="0 0 800 80" fill="none" preserveAspectRatio="none">
        <path d="M20 40H780" stroke="currentColor" strokeWidth="1" className="text-ink/20" />
        {Array.from({ length: 15 }, (_, i) => 40 + i * 50).map((x, i) => (
          <path key={x} d={`M${x} ${i % 5 === 0 ? 30 : 34}V${i % 5 === 0 ? 50 : 46}`} stroke="currentColor" strokeWidth="1" className="text-ink/25" />
        ))}
        <rect x="240" y="36" width="200" height="8" rx="4" className="fill-brand/20" />
        <circle cx="240" cy="40" r="4" className="fill-brand/60" />
        <circle cx="440" cy="40" r="4" className="fill-brand/60" />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------- english ---- */

/** Ruled paper with faint sentence fragments sitting on the baselines. */
export function EnglishLines({ className, opacity = 0.6 }) {
  const fragments = [
    ["“the present perfect connects past and present”", "8%", "18%"],
    ["subject · verb · object", "58%", "34%"],
    ["a / an / the — definiteness", "12%", "52%"],
    ["inference ≠ summary", "66%", "68%"],
    ["collocation: make a decision", "30%", "84%"],
    ["gist first, detail second", "74%", "10%"],
  ];
  return (
    <div className={cn(base, "eng-rule mask-fade-b", className)} style={{ opacity }} aria-hidden="true">
      {fragments.map(([text, left, top]) => (
        <span
          key={text}
          className="absolute font-display text-[13px] italic tracking-tight text-accent/40 select-none"
          style={{ left, top }}
        >
          {text}
        </span>
      ))}
    </div>
  );
}

/** Oversized quotation marks + letter lattice for English heroes. */
export function QuoteField({ className, opacity = 0.5 }) {
  return (
    <div className={cn(base, className)} style={{ opacity }} aria-hidden="true">
      <span className="absolute -left-6 top-2 font-display text-[220px] leading-none text-accent/12 select-none">“</span>
      <span className="absolute right-4 bottom-[-70px] font-display text-[220px] leading-none text-brand/10 select-none">”</span>
      <div className="dot-field mask-fade-x absolute inset-x-0 bottom-0 h-1/2 opacity-60" />
    </div>
  );
}

/** Vocabulary-card lattice: small rounded rectangles like flash cards. */
export function VocabLattice({ className, opacity = 0.5 }) {
  const words = ["nuance", "infer", "coherent", "mitigate", "pragmatic", "denote", "subtle", "articulate", "precise", "context", "implicit", "register"];
  return (
    <div className={cn(base, className)} style={{ opacity }} aria-hidden="true">
      <div className="absolute inset-0 grid grid-cols-4 gap-3 p-6 sm:grid-cols-6">
        {words.map((word, i) => (
          <span
            key={word}
            className={cn(
              "flex items-center justify-center rounded-md border border-accent/15 bg-surface/40 font-mono text-[10px] text-accent/45",
              i % 3 === 0 && "rotate-[-1.2deg]",
              i % 4 === 1 && "rotate-[1deg]",
            )}
          >
            {word}
          </span>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- general ---- */

/** Layered radial light + hairline horizon. Use once per hero. */
export function LightField({ className, tone = "brand" }) {
  return (
    <div className={cn(base, tone === "accent" ? "field-accent" : tone === "warm" ? "field-warm" : "field-brand", className)} aria-hidden="true" />
  );
}

/** Thin concentric rings — depth without blobs. */
export function RingField({ className, tone = "brand" }) {
  return (
    <div className={cn(base, className)} aria-hidden="true">
      <svg className="absolute -right-40 -top-40 h-[560px] w-[560px]" viewBox="0 0 560 560" fill="none">
        {[260, 210, 160, 110, 60].map((r, i) => (
          <circle
            key={r}
            cx="280"
            cy="280"
            r={r}
            stroke="currentColor"
            strokeWidth="1"
            className={tone === "accent" ? "text-accent/14" : "text-brand/14"}
            strokeDasharray={i % 2 ? "3 7" : undefined}
          />
        ))}
      </svg>
    </div>
  );
}

/** Section divider: prism rule that fades at both ends. */
export function PrismDivider({ className }) {
  return (
    <div className={cn("relative h-px w-full", className)} aria-hidden="true">
      <div className="prism-rule mask-fade-x absolute inset-0" />
    </div>
  );
}
