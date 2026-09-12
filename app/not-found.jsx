import Link from "next/link";
import { Compass, Home, ScanLine } from "lucide-react";

export const metadata = { title: "Page not found" };

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center bg-canvas px-5 py-16">
      <div className="w-full max-w-lg text-center">
        <p className="eyebrow justify-center">Error 404</p>
        <h1 className="mt-4 font-display text-[clamp(2rem,5vw,3rem)] leading-tight tracking-[-0.03em] text-ink">
          This page is not in the syllabus.
        </h1>
        <p className="mx-auto mt-4 max-w-sm text-[14px] leading-relaxed text-muted">
          The link may be old, or the page may have moved. The diagnostic, however, is exactly where you left it.
        </p>
        <div className="prism-rule mx-auto mt-8 max-w-xs" aria-hidden="true" />
        <div className="mt-8 flex flex-wrap justify-center gap-2.5">
          <Link href="/" className="inline-flex h-11 items-center gap-2 rounded-md border border-ink bg-ink px-5 text-[14px] font-medium text-canvas transition-transform hover:-translate-y-px">
            <Home className="size-4" aria-hidden="true" />
            Back to home
          </Link>
          <Link href="/student/diagnostic/start" className="inline-flex h-11 items-center gap-2 rounded-md border border-line bg-surface px-5 text-[14px] font-medium text-ink transition-[transform,border-color] hover:-translate-y-px hover:border-line-3">
            <ScanLine className="size-4" aria-hidden="true" />
            Take a diagnostic
          </Link>
          <Link href="/faq" className="inline-flex h-11 items-center gap-2 rounded-md px-4 text-[14px] font-medium text-muted transition-colors hover:text-ink">
            <Compass className="size-4" aria-hidden="true" />
            Help centre
          </Link>
        </div>
      </div>
    </main>
  );
}
