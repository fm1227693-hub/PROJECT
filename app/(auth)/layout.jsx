import Link from "next/link";
import Logo from "@/components/brand/Logo";

export const metadata = { title: "Sign in" };

/**
 * Authentication shell: brand panel on the left, single-purpose form on the
 * right. Collapses to just the form on small screens.
 */
export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-dvh bg-canvas lg:grid-cols-[1.05fr_1fr]">
      <aside className="relative hidden overflow-hidden border-r border-line bg-surface lg:flex lg:flex-col lg:justify-between">
        <div className="prism-wash absolute inset-0" aria-hidden="true" />
        <div className="grid-paper absolute inset-0 opacity-[0.55]" aria-hidden="true" />

        <div className="relative px-12 pt-12">
          <Link href="/" className="inline-block rounded-md">
            <Logo suffix="Diagnostic Center" />
          </Link>
        </div>

        <div className="relative px-12">
          <p className="eyebrow">Math &amp; English Diagnostic Center</p>
          <h2 className="mt-4 max-w-md font-display text-[34px] leading-[1.12] tracking-[-0.028em] text-ink">
            Know what you know. Know what to learn next.
          </h2>
          <p className="mt-4 max-w-md text-[15px] leading-relaxed text-ink-soft">
            One score tells you almost nothing. Prisma separates your result into the skills that
            produced it — then builds the plan that follows from them.
          </p>

          <dl className="mt-10 grid max-w-md grid-cols-3 gap-px overflow-hidden rounded-lg border border-line bg-line">
            {[
              { label: "Skills measured", value: "25" },
              { label: "Diagnostic time", value: "20–30 min" },
              { label: "Questions", value: "30" },
            ].map((item) => (
              <div key={item.label} className="bg-surface px-4 py-3.5">
                <dt className="text-[10.5px] uppercase tracking-[0.09em] text-faint">{item.label}</dt>
                <dd className="tnum mt-1 font-display text-[22px] leading-none text-ink">{item.value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative px-12 pb-12">
          <div className="prism-rule max-w-md" aria-hidden="true" />
          <p className="mt-4 max-w-md text-[12.5px] leading-relaxed text-muted">
            Assessment data belongs to the learner. Results are exportable at any time and never sold
            or used for advertising.
          </p>
        </div>
      </aside>

      <main id="main" className="relative flex flex-col" tabIndex={-1}>
        <div className="flex items-center justify-between border-b border-line px-5 py-4 lg:hidden">
          <Link href="/" className="rounded-md">
            <Logo compact suffix="Diagnostic Center" />
          </Link>
          <Link href="/" className="text-[13px] font-medium text-muted transition-colors hover:text-ink">
            Back to site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[26rem]">{children}</div>
        </div>

        <footer className="border-t border-line px-5 py-4 lg:px-8">
          <p className="text-[12px] leading-relaxed text-muted">
            By continuing you agree to our{" "}
            <Link href="/terms" className="text-ink-soft underline-offset-4 hover:text-brand hover:underline">
              Terms
            </Link>{" "}
            and{" "}
            <Link href="/privacy" className="text-ink-soft underline-offset-4 hover:text-brand hover:underline">
              Privacy Policy
            </Link>
            .
          </p>
        </footer>
      </main>
    </div>
  );
}
