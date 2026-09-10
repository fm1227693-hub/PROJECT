'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { registerGsap, EASE, depth, typeSpread } from '@/lib/animations';
import { isReducedMotion } from '@/lib/motion';
import MagneticButton from '@/components/MagneticButton';
import Seam from '@/components/Seam';
import { SITE } from '@/data/site';
import { useCopy } from '@/i18n/prefs';

registerGsap();

/**
 * Final CTA — the last movement.
 *
 * The headline rises line by line, the light pools swell and drift against the
 * scroll, the button lands last, and the mail line opens into solid type on
 * hover. Everything is scrubbed or plays once: nothing loops here, so the
 * section costs almost nothing while you read it.
 */
export default function FinalCTA() {
  const sectionRef = useRef(null);
  const t = useCopy();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isReducedMotion()) return undefined;

    const ctx = gsap.context(() => {
      const desktop = window.matchMedia('(min-width: 1024px)').matches;
      const amount = desktop ? 0.3 : 0.12;
      const d = depth(1);

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: `top ${1 - amount}`, once: true },
          defaults: { ease: EASE.out },
        })
        .fromTo(
          '[data-cta-line]',
          { yPercent: 135, y: 0, opacity: 0 },
          { yPercent: 0, y: 0, opacity: 1, duration: 1.3, ease: EASE.cinematic, stagger: 0.14 },
          0
        )
        .fromTo('[data-cta-fact]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 }, 0.5)
        .fromTo('[data-cta-sub]', { y: 22, opacity: 0 }, { y: 0, opacity: 1, duration: 0.85 }, 0.55)
        .fromTo('[data-cta-button]', { y: 18, opacity: 0 }, { y: 0, opacity: 1, duration: 0.75 }, 0.78)
        .fromTo('[data-cta-mail]', { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 1.05, ease: EASE.cinematic }, 0.9);

      gsap
        .timeline({
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.9 },
        })
        .fromTo(
          '[data-cta-pool]',
          { yPercent: 20, scale: 0.88, opacity: 0.3 },
          { yPercent: -16, scale: 1.12, opacity: 0.9, ease: EASE.linear, stagger: 0.05 },
          0
        )
        .to('[data-cta-title]', { scale: 1 - 0.035 * d, ease: EASE.linear }, 0)
        .to('[data-cta-mail]', { xPercent: -2.4 * d, ease: EASE.linear }, 0)
        .fromTo('[data-cta-wash]', { opacity: 0 }, { opacity: 1, ease: EASE.linear }, 0);

      // The last words on the page open slightly as you reach them.
      typeSpread('[data-cta-line]', { amount: 1.15, start: 'top 72%', end: 'top 22%' });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={sectionRef} id="contact" aria-labelledby="cta-title" className="cta">
      <div className="shell">
        <Seam
          index="04"
          label={t.seams.contact.label}
          note={t.seams.contact.note}
          tone="contact"
        />
      </div>

      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <span data-cta-pool className="aura aura--drift left-[-18%] top-[-26%] h-[62vh] w-[62vh] opacity-40" />
        <span
          data-cta-pool
          className="aura aura--drift-slow bottom-[-34%] right-[-14%] h-[54vh] w-[54vh] opacity-30"
        />
        <span
          data-cta-wash
          className="absolute inset-0"
          style={{
            opacity: 0,
            background:
              'radial-gradient(90% 70% at 50% 104%, rgb(var(--ember-rgb) / 0.13) 0%, transparent 64%)',
          }}
        />
      </div>

      <div className="shell pb-10 pt-16 lg:pb-14 lg:pt-24">
        <p className="eyebrow mb-8 flex flex-wrap items-center gap-3">
          <span className="status-dot" aria-hidden="true" />
          {t.cta.eyebrow}
        </p>

        <h2 id="cta-title" data-cta-title className="cta__title headline-anim">
          {t.cta.heading.map((line, i) => (
            <span className="line-mask" key={`cta-line-${i}`}>
              <span
                data-cta-line
                className={`line-inner${
                  i === 1 ? ' hairline-type' : i === 2 ? ' text-ember' : ''
                }`}
              >
                {line}
              </span>
            </span>
          ))}
        </h2>

        <dl className="cta__facts mt-12 lg:mt-16" aria-label={t.ui.studioAvailability}>
          {t.cta.facts.map(([k, v]) => (
            <div key={k} data-cta-fact className="cta__fact">
              <dt className="eyebrow eyebrow--dim text-[9px]">{k}</dt>
              <dd className="mt-2 text-[13px] tracking-[0.02em] text-mist/85">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-12 flex flex-col gap-9 sm:mt-16 sm:flex-row sm:items-end sm:justify-between">
          <p data-cta-sub className="lead max-w-[40ch]">{t.cta.lead}</p>

          <div data-cta-button className="shrink-0">
            <MagneticButton href={`mailto:${SITE.email}`} strength={1.15}>
              {t.ui.startProject}
            </MagneticButton>
          </div>
        </div>
      </div>

      {/* The mail line doubles as the section's floor — no dead space, no filler. */}
      <div className="shell pb-14 pt-10 lg:pb-20">
        {/* The wrapper owns the scroll motion; the anchor owns the hover. */}
        <span data-cta-mail className="block">
          <a
            href={`mailto:${SITE.email}`}
            className="cta__mail"
            data-cursor="solid"
            data-cursor-label={t.ui.write}
            aria-label={`${t.ui.emailAria} ${SITE.email}`}
          >
            {SITE.email}
          </a>
        </span>
        <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-2 border-t pt-4" style={{ borderColor: 'var(--line)' }}>
          <span className="eyebrow eyebrow--dim text-[9px]">
            {SITE.address} · {t.meta.city}, {t.meta.country}
          </span>
          <span className="eyebrow eyebrow--dim ml-auto text-[9px]">{SITE.coordinates}</span>
        </div>
      </div>
    </section>
  );
}
