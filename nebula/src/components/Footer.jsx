'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { registerGsap, EASE } from '@/lib/animations';
import { scrollToSection } from '@/lib/scroll';
import { isReducedMotion } from '@/lib/motion';
import { FOOTER_SOCIAL, SITE } from '@/data/site';
import { useCopy } from '@/i18n/prefs';
import { useNavLinks } from '@/i18n/use-copy';

registerGsap();

/**
 * Footer — deliberately quiet.
 *
 * One scrubbed travel on the ghost wordmark, a single pulsing status dot, and
 * hover states that live in CSS. Everything above it already moved; this is
 * where the page stops.
 */
export default function Footer() {
  const footRef = useRef(null);
  const year = new Date().getFullYear();
  const t = useCopy();
  const navLinks = useNavLinks();

  useEffect(() => {
    const el = footRef.current;
    if (!el || isReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        '[data-foot-word]',
        { yPercent: -6, opacity: 0.55 },
        {
          yPercent: 0,
          opacity: 1,
          ease: EASE.linear,
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: 0.8 },
        }
      );
    }, el);

    return () => ctx.revert();
  }, []);

  const toTop = () => scrollToSection('#top', { offset: 0, duration: 1.6 });
  const onJump = (href) => (e) => {
    // Keep the real href for no-JS and middle clicks, but scroll with the page.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
    e.preventDefault();
    scrollToSection(href);
  };

  return (
    <footer ref={footRef} className="relative border-t bg-ink/40" style={{ borderColor: 'var(--line)' }}>
      <div className="shell pb-12 pt-16 lg:pt-20">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_repeat(3,minmax(0,0.68fr))]">
          <div>
            <p className="font-display text-3xl leading-none tracking-[0.06em]">{SITE.name}</p>
            <p className="mt-4 max-w-[30ch] text-[13px] leading-relaxed text-ash">
              {t.footer.blurb}
            </p>
            <p className="avail mt-7">
              <span className="status-dot" aria-hidden="true" />
              <span className="eyebrow text-[9px]">{t.ui.availability}</span>
            </p>
          </div>

          <nav aria-label={t.ui.footerNav}>
            <h2 className="eyebrow eyebrow--dim mb-5 text-[9px]">{t.ui.index}</h2>
            <ul className="flex flex-col gap-2.5">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a href={link.href} onClick={onJump(link.href)} className="foot-link">
                    <span className="link-underline">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="eyebrow eyebrow--dim mb-5 text-[9px]">{t.ui.contact}</h2>
            <ul className="flex flex-col gap-2.5 text-[15px]">
              <li>
                <a href={`mailto:${SITE.email}`} className="foot-link">
                  <span className="link-underline">{SITE.email}</span>
                </a>
              </li>
              <li className="text-ash">{SITE.phone}</li>
              <li className="leading-relaxed text-ash">
                {SITE.address}
                <br />
                {t.meta.city}, {t.meta.country}
              </li>
            </ul>
          </div>

          <div>
            <h2 className="eyebrow eyebrow--dim mb-5 text-[9px]">{t.ui.elsewhere}</h2>
            <ul className="flex flex-col gap-2.5 text-[15px]">
              {FOOTER_SOCIAL.map(([label, href]) => (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="foot-link"
                    data-cursor="open"
                    data-cursor-label={t.ui.open}
                  >
                    {label}
                    <span className="foot-link__arrow" aria-hidden="true">
                      ↗
                    </span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="eyebrow eyebrow--dim mt-7 text-[9px]">{SITE.coordinates}</p>
          </div>
        </div>

        <div
          className="mt-14 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-t pt-6"
          style={{ borderColor: 'var(--line)' }}
        >
          <p className="eyebrow eyebrow--dim text-[9px]">
            © {year} {SITE.name} — {t.ui.rights}
          </p>
          <p className="eyebrow eyebrow--dim text-[9px]">
            {t.ui.designedIn} {t.meta.city.toUpperCase()} · {t.meta.timezone}
          </p>
          <button type="button" onClick={toTop} className="foot-link group" aria-label={t.ui.backToTop}>
            <span className="link-underline text-[9px] eyebrow">{t.ui.backToTop}</span>
            <span
              className="inline-block text-[11px] transition-transform duration-500 group-hover:-translate-y-1"
              aria-hidden="true"
            >
              ↑
            </span>
          </button>
        </div>
      </div>

      {/* Ghost wordmark — the closing chord. */}
      <div className="foot-word" aria-hidden="true">
        <span className="foot-word__text" data-foot-word>
          {SITE.name}
        </span>
      </div>
    </footer>
  );
}
