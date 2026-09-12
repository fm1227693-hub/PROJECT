import Link from "next/link";
import { BRAND, SOCIALS } from "@/lib/data/brand";
import { FOOTER_NAV } from "@/lib/data/navigation";
import Logo from "@/components/brand/Logo";
import { ArrowUpRight } from "lucide-react";

export default function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-auto border-t border-line bg-surface">
      <div className="container-page">
        <div className="grid gap-12 py-14 lg:grid-cols-[1.4fr_2.6fr] lg:gap-16 lg:py-16">
          <div className="max-w-sm">
            <Link href="/" aria-label="Prisma — home" className="inline-block rounded-md">
              <Logo suffix="Diagnostic Center" />
            </Link>
            <p className="mt-5 text-[14px] leading-relaxed text-ink-soft">{BRAND.summary}</p>

            <div className="mt-6 rounded-lg border border-line bg-surface-2 p-4">
              <p className="eyebrow">Talk to us</p>
              <p className="mt-2 text-[13px] leading-relaxed text-muted">
                Questions about a school rollout, a diagnostic, or an invoice?
              </p>
              <div className="mt-3 flex flex-col gap-1.5">
                <a href={`mailto:${BRAND.email}`} className="group inline-flex items-center gap-1.5 text-[13px] font-medium text-brand">
                  {BRAND.email}
                  <ArrowUpRight className="size-3.5 transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                </a>
                <Link href="/contact" className="text-[13px] text-ink-soft underline-offset-4 hover:text-brand hover:underline">
                  Contact form
                </Link>
              </div>
            </div>

            <ul className="mt-6 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="inline-flex h-9 items-center rounded-md border border-line bg-surface px-3 text-[12.5px] font-medium text-ink-soft transition-[border-color,color,transform] duration-200 hover:-translate-y-px hover:border-line-3 hover:text-ink"
                  >
                    {social.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {FOOTER_NAV.map((column) => (
              <div key={column.title}>
                <h2 className="text-[12px] font-semibold uppercase tracking-[0.1em] text-ink">{column.title}</h2>
                <ul className="mt-4 space-y-2.5">
                  {column.links.map((link) => (
                    <li key={`${column.title}-${link.label}`}>
                      <Link
                        href={link.href}
                        className="link-underline text-[13.5px] text-muted transition-colors duration-200 hover:text-ink"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        <div className="prism-rule" aria-hidden="true" />

        <div className="flex flex-col gap-4 py-6 md:flex-row md:items-center md:justify-between">
          <p className="text-[12.5px] text-muted">
            © {year} {BRAND.legalName}. Assessment data belongs to the learner.
          </p>
          <ul className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <li>
              <Link href="/privacy" className="text-[12.5px] text-muted transition-colors hover:text-ink">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-[12.5px] text-muted transition-colors hover:text-ink">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/faq" className="text-[12.5px] text-muted transition-colors hover:text-ink">
                FAQ
              </Link>
            </li>
            <li>
              <span className="inline-flex items-center gap-1.5 text-[12.5px] text-faint">
                <span className="size-1.5 rounded-full bg-strong" aria-hidden="true" />
                All systems operational
              </span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
