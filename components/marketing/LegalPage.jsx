import Link from "next/link";
import { ArrowUpRight, Mail } from "lucide-react";

import { BRAND } from "@/lib/data/brand";
import { LEGAL_META } from "@/lib/data/legal";
import Reveal from "@/components/motion/Reveal";
import { PageHero } from "@/components/marketing/PageHero";
import { Badge } from "@/components/ui/Badge";

/** Table of contents + sectioned legal document with a sticky index. */
export default function LegalPage({ title, intro, sections, meta }) {
  return (
    <>
      <PageHero decor="rings" eyebrow={meta.type} title={title} body={intro} meta={meta.stats} />

      <section className="relative overflow-hidden bg-canvas py-16 md:py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
          <Reveal>
            <nav aria-label="Document sections" className="lg:sticky lg:top-28 lg:self-start">
              <p className="eyebrow mb-3">Contents</p>
              <ol className="space-y-1 border-l border-line pl-4">
                {sections.map((section, index) => (
                  <li key={section.id}>
                    <a
                      href={`#${section.id}`}
                      className="link-underline block py-1 text-[12.5px] leading-snug text-muted transition-colors hover:text-ink"
                    >
                      <span className="tnum mr-1.5 font-mono text-[10.5px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                      {section.title}
                    </a>
                  </li>
                ))}
              </ol>
              <div className="mt-6 rounded-lg border border-line bg-surface p-4">
                <p className="text-[11.5px] leading-relaxed text-muted">
                  Questions about any of this?
                </p>
                <a
                  href={`mailto:${LEGAL_META.contact}`}
                  className="mt-2 inline-flex items-center gap-1 text-[12.5px] font-medium text-brand hover:underline"
                >
                  <Mail className="size-3.5" aria-hidden="true" />
                  {LEGAL_META.contact}
                </a>
              </div>
            </nav>
          </Reveal>

          <div className="min-w-0 space-y-10">
            {sections.map((section, index) => (
              <Reveal key={section.id}>
                <article id={section.id} className="scroll-mt-28 rounded-lg border border-line bg-surface p-6 md:p-8">
                  <header className="mb-4 flex items-baseline gap-3 border-b border-line pb-4">
                    <span className="tnum shrink-0 font-mono text-[11px] text-faint">{String(index + 1).padStart(2, "0")}</span>
                    <h2 className="font-display text-[20px] leading-snug tracking-[-0.022em] text-ink">{section.title}</h2>
                  </header>

                  {section.body ? (
                    <div className="space-y-3.5">
                      {section.body.map((paragraph) => (
                        <p key={paragraph.slice(0, 40)} className="text-[14px] leading-[1.75] text-ink-soft">
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  ) : null}

                  {section.items ? (
                    <dl className="grid gap-4 sm:grid-cols-2">
                      {section.items.map((item) => (
                        <div key={item.label} className="rounded-md border border-line bg-canvas p-4">
                          <dt className="text-[13px] font-semibold text-ink">{item.label}</dt>
                          <dd className="mt-1.5 text-[12.5px] leading-relaxed text-muted">{item.body}</dd>
                        </div>
                      ))}
                    </dl>
                  ) : null}
                </article>
              </Reveal>
            ))}

            <Reveal>
              <div className="rounded-lg border border-line bg-surface-2 p-6">
                <p className="eyebrow">Last updated</p>
                <p className="mt-2 text-[13.5px] leading-relaxed text-ink-soft">
                  Version {LEGAL_META.version} of this document, updated {LEGAL_META.updated}, published by{" "}
                  {LEGAL_META.entity}. Earlier versions are available on request.
                </p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <Badge tone="neutral" size="sm">Version {LEGAL_META.version}</Badge>
                  <Badge tone="neutral" size="sm">Updated {LEGAL_META.updated}</Badge>
                  <Link
                    href={meta.other.href}
                    className="inline-flex items-center gap-1 rounded-full border border-line bg-surface px-3 py-1 text-[12px] font-medium text-ink-soft transition-colors hover:border-line-3 hover:text-ink"
                  >
                    Read the {meta.other.label}
                    <ArrowUpRight className="size-3" aria-hidden="true" />
                  </Link>
                </div>
              </div>
            </Reveal>
          </div>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-canvas" aria-hidden="true" />
      </section>

      <section className="border-t border-line bg-surface py-12">
        <div className="container-page flex flex-wrap items-center justify-between gap-6">
          <p className="max-w-lg text-[13.5px] leading-relaxed text-muted">
            © {BRAND.foundedYear}–{new Date().getFullYear()} {BRAND.name}. {BRAND.legal}.
          </p>
          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[13px]" aria-label="Legal">
            <Link href="/privacy" className="link-underline text-muted transition-colors hover:text-ink">Privacy</Link>
            <Link href="/terms" className="link-underline text-muted transition-colors hover:text-ink">Terms</Link>
            <Link href="/contact" className="link-underline text-muted transition-colors hover:text-ink">Contact</Link>
            <Link href="/faq" className="link-underline text-muted transition-colors hover:text-ink">FAQ</Link>
          </nav>
        </div>
      </section>
    </>
  );
}
