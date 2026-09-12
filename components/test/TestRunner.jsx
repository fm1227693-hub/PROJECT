"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Check, Clock, Flag, ListChecks, Pause, Play, RotateCcw, Sparkles, Volume2, X } from "lucide-react";

import { cn, formatDuration } from "@/lib/utils";
import { useApp } from "@/lib/store/AppProvider";
import { getStimulus } from "@/lib/data/questions";
import { isAnswerCorrect } from "@/lib/engine/scoring";
import Button from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import ProgressBar from "@/components/ui/ProgressBar";
import { EmptyState } from "@/components/ui/States";
import { Input, Textarea } from "@/components/ui/Field";

/**
 * Simulated audio player for listening items. The demo has no audio files, so
 * playback is a deterministic timer over the track duration — the UI, the
 * pacing and the transcript reveal all behave like a real player.
 */
function AudioPlayerUI({ track }) {
  const [playing, setPlaying] = useState(false);
  const [position, setPosition] = useState(0);
  const [listened, setListened] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const timer = useRef(null);
  const duration = track.durationSeconds ?? 45;

  useEffect(() => () => window.clearInterval(timer.current), []);

  const toggle = () => {
    if (playing) {
      window.clearInterval(timer.current);
      setPlaying(false);
      return;
    }
    setPlaying(true);
    /* 4× speed so the demo stays brisk; one tick per 250 ms = 1 s of audio */
    timer.current = window.setInterval(() => {
      setPosition((prev) => {
        const next = prev + 1;
        if (next >= duration) {
          window.clearInterval(timer.current);
          setPlaying(false);
          setListened(true);
          return duration;
        }
        return next;
      });
    }, 250);
  };

  const pctPlayed = Math.min(100, (position / duration) * 100);

  return (
    <div className="mt-3 rounded-lg border border-line bg-canvas p-4">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "Pause audio" : "Play audio"}
          className={cn(
            "grid size-10 shrink-0 place-items-center rounded-full border transition-transform duration-200 hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand",
            playing ? "border-accent bg-accent text-white" : "border-accent-line bg-accent-soft text-accent",
          )}
        >
          {playing ? <Pause className="size-4" aria-hidden="true" /> : <Play className="ml-0.5 size-4" aria-hidden="true" />}
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-2 text-[11px] text-muted">
            <span className="flex min-w-0 items-center gap-1.5">
              <Volume2 className="size-3.5 shrink-0 text-accent" aria-hidden="true" />
              <span className="truncate font-medium text-ink-soft">{track.title}</span>
              <Badge tone="accent" size="xs">{track.level}</Badge>
            </span>
            <span className="tnum shrink-0 font-mono">
              {formatDuration(position)} / {formatDuration(duration)}
            </span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-line" role="progressbar" aria-valuenow={Math.round(pctPlayed)} aria-valuemin={0} aria-valuemax={100} aria-label="Audio progress">
            <div
              className="h-full origin-left rounded-full bg-accent transition-transform duration-200 ease-linear"
              style={{ width: "100%", transform: `scaleX(${pctPlayed / 100})` }}
            />
          </div>
        </div>
      </div>
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
        <p className="text-[11px] text-faint">
          {listened ? "Track finished. Answer from memory first, then check the transcript if you need to." : playing ? "Playing… (demo simulation)" : "Press play — the track runs once at a time."}
        </p>
        {listened ? (
          <button
            type="button"
            onClick={() => setShowTranscript((v) => !v)}
            aria-expanded={showTranscript}
            className="text-[11.5px] font-medium text-brand hover:underline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand"
          >
            {showTranscript ? "Hide transcript" : "Show transcript"}
          </button>
        ) : null}
      </div>
      {listened && showTranscript ? (
        <div className="mt-2 rounded-md border border-line bg-surface p-3.5">
          <p className="eyebrow mb-1">Transcript</p>
          <p className="whitespace-pre-line text-[12px] leading-relaxed text-ink-soft">{track.transcript}</p>
        </div>
      ) : null}
    </div>
  );
}

const SUBJECT_LABEL = { math: "Mathematics", english: "English", both: "Full diagnostic" };

/**
 * The assessment runner — used for diagnostics (no feedback until review) and
 * for practice sets (instant explanation). One component, two honest modes.
 */
export default function TestRunner({ subject, mode = "test", onFinish, finishHref }) {
  const router = useRouter();
  const app = useApp();
  const { activeTest, answerQuestion, adaptAfterAnswer, flagQuestion, goToQuestion, tickTest, cancelTest } = app;
  const [showPalette, setShowPalette] = useState(false);

  const test = activeTest;
  const questions = test?.questions ?? [];
  const question = questions[test?.index ?? 0];
  const stimulus = question?.stimulus ? getStimulus(question.stimulus) : null;

  /* timer */
  useEffect(() => {
    if (!test?.timed) return undefined;
    const id = window.setInterval(() => tickTest(1), 1000);
    return () => window.clearInterval(id);
  }, [test?.timed, test?.id, tickTest]);

  useEffect(() => {
    if (test?.timed && test.secondsRemaining === 0 && mode === "test") {
      router.push("/student/diagnostic/review");
    }
  }, [test?.timed, test?.secondsRemaining, mode, router]);

  const answeredCount = useMemo(() => questions.filter((q) => test?.answers[q.id] !== undefined).length, [questions, test?.answers]);

  if (!test || (subject && test.subject !== subject && test.subject !== "both")) {
    return (
      <EmptyState
        icon={ListChecks}
        title={mode === "practice" ? "No practice set active" : "No diagnostic in progress"}
        description="Set one up below — you choose the subject, the conditions and the length."
        action={<Button href="/student/diagnostic/start">Open diagnostic setup</Button>}
        secondaryAction={<Button href="/student/practice" variant="ghost">Practice center</Button>}
      />
    );
  }

  const chosen = question ? test.answers[question.id] : undefined;
  const revealed = mode === "practice" && chosen !== undefined;
  const isLast = (test.index ?? 0) === questions.length - 1;
  const flagged = test.flagged?.includes(question?.id);

  const select = (value) => {
    answerQuestion(question.id, value);
    /* deterministic adaptivity: push a harder/easier same-topic follow-up */
    if (mode === "test" && test?.adaptive && question) {
      adaptAfterAnswer(question, isAnswerCorrect(question, value));
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_260px]">
      {/* ------------------------------------------------------ main column */}
      <div className="min-w-0">
        {/* runner header */}
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Badge tone={test.subject === "math" ? "brand" : test.subject === "english" ? "accent" : "info"} size="sm">
                {SUBJECT_LABEL[test.subject]}
              </Badge>
              <p className="text-[12.5px] text-muted">
                Question <span className="tnum font-semibold text-ink">{(test.index ?? 0) + 1}</span> of{" "}
                <span className="tnum">{questions.length}</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {test.timed ? (
                <p
                  className={cn(
                    "tnum flex items-center gap-1.5 rounded-md border px-2.5 py-1 font-mono text-[12px]",
                    test.secondsRemaining < 120 ? "border-risk/30 bg-risk-soft text-risk" : "border-line bg-canvas text-ink-soft",
                  )}
                  aria-label="Time remaining"
                >
                  <Clock className="size-3.5" aria-hidden="true" />
                  {formatDuration(test.secondsRemaining)}
                </p>
              ) : null}
              <button
                type="button"
                onClick={() => flagQuestion(question.id)}
                className={cn(
                  "inline-flex h-8 items-center gap-1.5 rounded-md border px-2.5 text-[12px] font-medium transition-colors duration-200",
                  flagged ? "border-developing/40 bg-developing-soft text-developing" : "border-line bg-canvas text-muted hover:border-line-3 hover:text-ink",
                )}
                aria-pressed={Boolean(flagged)}
              >
                <Flag className="size-3.5" aria-hidden="true" />
                {flagged ? "Flagged" : "Flag"}
              </button>
            </div>
          </div>
          <ProgressBar value={Math.round((answeredCount / questions.length) * 100)} size="xs" className="mt-3" />
          <p className="mt-1.5 text-[11px] text-faint">
            {answeredCount} answered · {questions.length - answeredCount} remaining
            {mode === "practice" ? " · practice mode: instant explanations" : ""}
          </p>
        </div>

        {/* stimulus */}
        {stimulus ? (
          <article className="mt-4 rounded-xl border border-line bg-surface p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="eyebrow">{stimulus.kind ?? stimulus.genre ?? "Stimulus"}</p>
              <Badge tone="neutral" size="xs">
                {stimulus.title}
              </Badge>
            </div>
            {stimulus.body ? (
              <div className="mt-3 space-y-3">
                {stimulus.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 32)} className="text-[13.5px] leading-[1.75] text-ink-soft">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            {stimulus.transcript ? <AudioPlayerUI track={stimulus} /> : null}
          </article>
        ) : null}

        {/* question */}
        {question ? (
          <article className="mt-4 rounded-xl border border-line bg-surface p-5 md:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-[11.5px] font-medium uppercase tracking-[0.09em] text-faint">
                {question.topicName ?? question.topicId}
              </p>
              {question.type && question.type !== "mcq" ? (
                <Badge tone="neutral" size="xs">
                  {question.type === "boolean" ? "True / false" : question.type === "fill" ? "Fill in the blank" : question.type === "short" ? "Short answer" : question.type === "equation" ? "Equation" : question.type === "numeric" ? "Numeric" : question.type}
                </Badge>
              ) : null}
              {question.adapted ? (
                <Badge tone="accent" size="xs" icon={Sparkles}>
                  Adaptive follow-up
                </Badge>
              ) : null}
            </div>
            <p className="mt-2.5 font-mono text-[15px] leading-relaxed tracking-tight text-ink md:text-[16px]">{question.prompt}</p>

            {question.type === "numeric" ? (
              <div className="mt-5 max-w-xs">
                <Input
                  type="number"
                  aria-label="Your answer"
                  value={chosen ?? ""}
                  onChange={(event) => select(event.target.value === "" ? undefined : Number(event.target.value))}
                  placeholder="Type a number"
                />
              </div>
            ) : question.type === "boolean" ? (
              <div className="mt-5 grid max-w-xs grid-cols-2 gap-2" role="radiogroup" aria-label={question.prompt}>
                {[true, false].map((value) => {
                  const isChosen = chosen === value || String(chosen) === String(value);
                  const isCorrect = isAnswerCorrect(question, value);
                  const state = !revealed ? (isChosen ? "chosen" : "idle") : isCorrect ? "correct" : isChosen ? "wrong" : "dim";
                  return (
                    <button
                      key={String(value)}
                      type="button"
                      role="radio"
                      aria-checked={isChosen}
                      onClick={() => select(value)}
                      className={cn(
                        "flex items-center justify-center gap-2 rounded-md border px-4 py-3 text-[13.5px] font-semibold transition-[border-color,background-color,transform] duration-200",
                        state === "idle" && "border-line bg-canvas text-ink-soft hover:-translate-y-px hover:border-line-3 hover:text-ink",
                        state === "chosen" && "border-brand bg-brand-soft text-ink shadow-[inset_0_0_0_1px_var(--color-brand)]",
                        state === "correct" && "border-strong/40 bg-strong-soft text-strong",
                        state === "wrong" && "border-risk/40 bg-risk-soft text-risk",
                        state === "dim" && "border-line bg-canvas text-faint",
                      )}
                    >
                      {state === "correct" ? <Check className="size-3.5" aria-hidden="true" /> : state === "wrong" ? <X className="size-3.5" aria-hidden="true" /> : null}
                      {value ? "True" : "False"}
                    </button>
                  );
                })}
              </div>
            ) : question.type === "fill" ? (
              <div className="mt-5 max-w-md">
                <Input
                  aria-label="Your answer"
                  value={chosen ?? ""}
                  onChange={(event) => select(event.target.value)}
                  placeholder="Type the missing word or value"
                  className={question.subject === "math" ? "font-mono" : undefined}
                />
                <p className="mt-1.5 text-[11px] text-faint">Spelling counts in English items; spacing does not in math items.</p>
              </div>
            ) : question.type === "short" ? (
              <div className="mt-5 max-w-lg">
                <Textarea
                  aria-label="Your answer"
                  rows={2}
                  value={chosen ?? ""}
                  onChange={(event) => select(event.target.value)}
                  placeholder="Answer in a word, number or short phrase"
                />
              </div>
            ) : question.type === "equation" ? (
              <div className="mt-5 max-w-md">
                <Input
                  aria-label="Your answer"
                  value={chosen ?? ""}
                  onChange={(event) => select(event.target.value)}
                  placeholder="e.g. x=7  or  2,3  or  8x-12"
                  className="font-mono"
                />
                <p className="mt-1.5 text-[11px] text-faint">Spaces and operator spellings (×, *) are normalised before checking.</p>
              </div>
            ) : (
              <div className="mt-5 grid gap-2" role="radiogroup" aria-label={question.prompt}>
                {question.options.map((option, optionIndex) => {
                  const isChosen = chosen === optionIndex;
                  const isCorrect = optionIndex === question.answer;
                  const state = !revealed ? (isChosen ? "chosen" : "idle") : isCorrect ? "correct" : isChosen ? "wrong" : "dim";
                  return (
                    <button
                      key={option}
                      type="button"
                      role="radio"
                      aria-checked={isChosen}
                      onClick={() => select(optionIndex)}
                      className={cn(
                        "flex items-start gap-3 rounded-md border px-4 py-3 text-left text-[13.5px] leading-snug transition-[border-color,background-color,transform] duration-200",
                        state === "idle" && "border-line bg-canvas text-ink-soft hover:-translate-y-px hover:border-line-3 hover:text-ink",
                        state === "chosen" && "border-brand bg-brand-soft text-ink shadow-[inset_0_0_0_1px_var(--color-brand)]",
                        state === "correct" && "border-strong/40 bg-strong-soft text-strong",
                        state === "wrong" && "border-risk/40 bg-risk-soft text-risk",
                        state === "dim" && "border-line bg-canvas text-faint",
                      )}
                    >
                      <span
                        className={cn(
                          "mt-px grid size-5 shrink-0 place-items-center rounded-full border font-mono text-[10px]",
                          state === "chosen" && "border-brand bg-brand text-white",
                          state === "correct" && "border-strong bg-strong text-white",
                          state === "wrong" && "border-risk bg-risk text-white",
                          (state === "idle" || state === "dim") && "border-line-2 text-muted",
                        )}
                        aria-hidden="true"
                      >
                        {state === "correct" ? <Check className="size-3" /> : state === "wrong" ? <X className="size-3" /> : String.fromCharCode(65 + optionIndex)}
                      </span>
                      <span className={cn(question.subject === "math" && "font-mono tracking-tight")}>{option}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {revealed ? (
              <p className="mt-4 rounded-md border border-line bg-canvas px-4 py-3 text-[12.5px] leading-relaxed text-muted">
                <span className={cn("font-semibold", isAnswerCorrect(question, chosen) ? "text-strong" : "text-risk")}>
                  {isAnswerCorrect(question, chosen) ? "Correct. " : "Not quite. "}
                </span>
                {question.explanation}
              </p>
            ) : null}
          </article>
        ) : null}

        {/* nav */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <Button variant="secondary" size="md" onClick={() => goToQuestion((test.index ?? 0) - 1)} disabled={(test.index ?? 0) === 0}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Previous
          </Button>

          <div className="flex items-center gap-2.5">
            {mode === "test" ? (
              <Button variant="ghost" size="md" onClick={() => { cancelTest(); router.push("/student/diagnostic"); }}>
                Exit test
              </Button>
            ) : null}
            {isLast ? (
              mode === "test" ? (
                <Button size="md" onClick={() => router.push("/student/diagnostic/review")}>
                  <ListChecks className="size-4" aria-hidden="true" />
                  Review answers
                </Button>
              ) : (
                <Button size="md" onClick={onFinish}>
                  Finish practice
                  <Check className="size-4" aria-hidden="true" />
                </Button>
              )
            ) : (
              <Button size="md" onClick={() => goToQuestion((test.index ?? 0) + 1)}>
                Next question
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------- palette */}
      <aside className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-xl border border-line bg-surface p-4">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow">Questions</p>
            <button type="button" className="text-[11.5px] font-medium text-brand hover:underline lg:hidden" onClick={() => setShowPalette((v) => !v)}>
              {showPalette ? "Hide" : "Show"}
            </button>
          </div>
          <div className={cn("mt-3 grid grid-cols-8 gap-1.5 lg:grid-cols-5", !showPalette && "hidden lg:grid")}>
            {questions.map((item, index) => {
              const isCurrent = index === test.index;
              const isAnswered = test.answers[item.id] !== undefined;
              const isFlagged = test.flagged?.includes(item.id);
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goToQuestion(index)}
                  aria-label={`Question ${index + 1}${isAnswered ? ", answered" : ""}${isFlagged ? ", flagged" : ""}`}
                  aria-current={isCurrent ? "true" : undefined}
                  className={cn(
                    "tnum relative grid size-8 place-items-center rounded-md border font-mono text-[11px] transition-[transform,border-color,background-color] duration-150 hover:-translate-y-px",
                    isCurrent ? "border-brand bg-brand text-white" : isAnswered ? "border-strong/35 bg-strong-soft text-strong" : "border-line bg-canvas text-muted",
                  )}
                >
                  {index + 1}
                  {isFlagged ? <span className="absolute -right-1 -top-1 size-2 rounded-full bg-developing" aria-hidden="true" /> : null}
                </button>
              );
            })}
          </div>
          <ul className="mt-4 space-y-1.5 border-t border-line pt-3 text-[11px] text-muted">
            <li className="flex items-center gap-2"><span className="size-2.5 rounded-sm border border-strong/35 bg-strong-soft" aria-hidden="true" /> Answered</li>
            <li className="flex items-center gap-2"><span className="size-2.5 rounded-sm border border-line bg-canvas" aria-hidden="true" /> Not answered</li>
            <li className="flex items-center gap-2"><span className="size-2 rounded-full bg-developing" aria-hidden="true" /> Flagged for review</li>
          </ul>
          {mode === "test" ? (
            <Button href={finishHref ?? "/student/diagnostic/review"} variant="secondary" size="sm" full className="mt-4">
              Go to review
            </Button>
          ) : (
            <Button variant="secondary" size="sm" full className="mt-4" onClick={() => { cancelTest(); onFinish?.(); }}>
              <RotateCcw className="size-3.5" aria-hidden="true" />
              End practice set
            </Button>
          )}
        </div>
      </aside>
    </div>
  );
}
