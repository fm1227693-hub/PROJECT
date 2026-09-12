"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, X } from "lucide-react";

import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";

const QUESTIONS = [
  {
    id: "demo_m1",
    subject: "math",
    topic: "Linear equations",
    prompt: "Solve for x:  2x + 5 = 17",
    options: ["x = 4", "x = 5", "x = 6", "x = 7"],
    answer: 2,
    explanation: "Subtract 5 from both sides (2x = 12), then divide by 2.",
  },
  {
    id: "demo_m2",
    subject: "math",
    topic: "Quadratic equations",
    prompt: "The roots of  x² − 5x + 6 = 0  are:",
    options: ["x = 1 and x = 6", "x = 2 and x = 3", "x = −2 and x = −3", "x = 5 and x = 6"],
    answer: 1,
    explanation: "Factor: (x − 2)(x − 3) = 0. Two numbers that multiply to 6 and add to −5.",
  },
  {
    id: "demo_e1",
    subject: "english",
    topic: "Articles",
    prompt: "Choose the correct article:  “She is ___ honest person.”",
    options: ["a", "an", "the", "no article"],
    answer: 1,
    explanation: "“Honest” begins with a vowel sound (the h is silent), so it takes “an”.",
  },
  {
    id: "demo_e2",
    subject: "english",
    topic: "Vocabulary",
    prompt: "Which word is closest in meaning to “mitigate”?",
    options: ["to intensify", "to make less severe", "to imitate", "to postpone"],
    answer: 1,
    explanation: "To mitigate a risk is to reduce its severity — not to remove or delay it.",
  },
];

/**
 * A real four-question demo on the homepage. Answers are checked against the
 * bank, explained, and turned into a per-subject demo score — then handed to
 * the full diagnostic. Nothing here is decorative.
 */
export default function DemoQuiz() {
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [revealed, setRevealed] = useState(false);

  const question = QUESTIONS[index];
  const chosen = answers[question.id];
  const answeredCount = Object.keys(answers).length;
  const done = answeredCount === QUESTIONS.length;

  const result = useMemo(() => {
    const bySubject = { math: { correct: 0, total: 0 }, english: { correct: 0, total: 0 } };
    for (const item of QUESTIONS) {
      const bucket = bySubject[item.subject];
      bucket.total += 1;
      if (answers[item.id] === item.answer) bucket.correct += 1;
    }
    const pct = (bucket) => Math.round((bucket.correct / bucket.total) * 100);
    return { math: pct(bySubject.math), english: pct(bySubject.english), correct: bySubject.math.correct + bySubject.english.correct };
  }, [answers]);

  const choose = (optionIndex) => {
    if (revealed) return;
    setAnswers((prev) => ({ ...prev, [question.id]: optionIndex }));
    setRevealed(true);
  };

  const reset = () => {
    setAnswers({});
    setIndex(0);
    setRevealed(false);
  };

  /* ------------------------------------------------------------ results */
  if (done) {
    return (
      <div className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 shadow-xl">
        <div className="flex items-center justify-between gap-3">
          <p className="eyebrow">Your demo result</p>
          <Badge tone={result.correct === QUESTIONS.length ? "strong" : result.correct >= 2 ? "developing" : "risk"} size="sm">
            {result.correct} of {QUESTIONS.length} correct
          </Badge>
        </div>

        <div className="mt-5 space-y-4">
          {[
            { label: "Math fundamentals", value: result.math, tone: "brand" },
            { label: "English fundamentals", value: result.english, tone: "accent" },
          ].map((row) => (
            <div key={row.label}>
              <div className="mb-1.5 flex items-baseline justify-between gap-3">
                <span className="text-[13px] font-medium text-ink">{row.label}</span>
                <span className={cn("tnum text-[13px] font-semibold", row.tone === "brand" ? "text-brand" : "text-accent")}>{row.value}%</span>
              </div>
              <ProgressBar value={row.value} tone={row.tone} size="sm" />
            </div>
          ))}
        </div>

        <p className="mt-5 rounded-md border border-line bg-canvas p-3.5 text-[12.5px] leading-relaxed text-muted">
          Four questions measure four skills. The full diagnostic measures{" "}
          <span className="font-semibold text-ink">25</span> — and turns them into a ranked, week-by-week plan.
        </p>

        <div className="mt-auto flex flex-wrap gap-2.5 pt-5">
          <Button href="/student/diagnostic/start" size="md">
            Take the full diagnostic
            <ArrowRight className="size-4" aria-hidden="true" />
          </Button>
          <Button variant="ghost" size="md" onClick={reset}>
            <RotateCcw className="size-4" aria-hidden="true" />
            Retake demo
          </Button>
        </div>
      </div>
    );
  }

  /* ----------------------------------------------------------- question */
  return (
    <div className="flex h-full flex-col rounded-xl border border-line bg-surface p-6 shadow-xl">
      <div className="flex items-center justify-between gap-3">
        <p className="eyebrow">
          Question {String(index + 1).padStart(2, "0")} · {question.subject === "math" ? "Mathematics" : "English"}
        </p>
        <div className="flex items-center gap-1.5" aria-hidden="true">
          {QUESTIONS.map((item, i) => (
            <span
              key={item.id}
              className={cn(
                "h-1.5 rounded-full transition-all duration-300",
                i === index ? "w-6 bg-brand" : answers[item.id] !== undefined ? "w-1.5 bg-strong/60" : "w-1.5 bg-line-2",
              )}
            />
          ))}
        </div>
      </div>

      <p className="mt-1 text-[11.5px] text-faint">{question.topic}</p>

      <p className="mt-4 font-mono text-[15px] leading-relaxed tracking-tight text-ink">{question.prompt}</p>

      <div className="mt-4 grid gap-2" role="radiogroup" aria-label={question.prompt}>
        {question.options.map((option, optionIndex) => {
          const isChosen = chosen === optionIndex;
          const isCorrect = optionIndex === question.answer;
          const state = !revealed ? "idle" : isCorrect ? "correct" : isChosen ? "wrong" : "idle";
          return (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={isChosen}
              onClick={() => choose(optionIndex)}
              className={cn(
                "flex items-center gap-3 rounded-md border px-3.5 py-2.5 text-left text-[13px] transition-[border-color,background-color,transform] duration-200",
                state === "idle" && "border-line bg-canvas text-ink-soft hover:-translate-y-px hover:border-line-3 hover:text-ink",
                state === "correct" && "border-strong/40 bg-strong-soft text-strong",
                state === "wrong" && "border-risk/40 bg-risk-soft text-risk",
                revealed && state === "idle" && "opacity-60",
              )}
            >
              <span
                className={cn(
                  "grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[10px]",
                  state === "correct" ? "border-strong/40 bg-strong text-white" : state === "wrong" ? "border-risk/40 bg-risk text-white" : "border-line-2 text-muted",
                )}
                aria-hidden="true"
              >
                {state === "correct" ? <Check className="size-3" /> : state === "wrong" ? <X className="size-3" /> : String.fromCharCode(65 + optionIndex)}
              </span>
              {option}
            </button>
          );
        })}
      </div>

      {revealed ? (
        <p className="mt-3 rounded-md border border-line bg-canvas px-3.5 py-2.5 text-[12px] leading-relaxed text-muted">
          {question.explanation}
        </p>
      ) : null}

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <Button variant="ghost" size="sm" onClick={() => setIndex((i) => Math.max(0, i - 1))} disabled={index === 0}>
          <ArrowLeft className="size-3.5" aria-hidden="true" />
          Previous
        </Button>
        {index < QUESTIONS.length - 1 ? (
          <Button size="sm" variant="secondary" onClick={() => { setIndex((i) => i + 1); setRevealed(answers[QUESTIONS[index + 1].id] !== undefined); }}>
            Next question
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </Button>
        ) : (
          <p className="text-[12px] text-muted" aria-live="polite">
            {revealed ? "Result appears when you answer." : "Select an option to finish."}
          </p>
        )}
      </div>
    </div>
  );
}
