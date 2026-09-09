'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap, EASE, countUp, typeSpread } from '@/lib/animations';
import { isReducedMotion } from '@/lib/motion';
import Seam from '@/components/Seam';
import Reveal from '@/components/Reveal';
import { CAPABILITIES } from '@/data/site';

registerGsap();

/**
 * Capabilities — an editorial index, not a card grid.
 *
 * Desktop: the headline column sticks while the four practices pass beside it.
 * The row closest to the centre of the viewport becomes dominant — its title
 * lifts, its rule stays drawn, its ghost number surfaces, and the visual panel
 * in the sticky column cross-fades to that practice's frame. Hovering takes over
 * the same channel, so pointer and scroll drive one system. All the switching is
 * class writes on four nodes; nothing re-renders.
 *
 * Below 1024px the stickiness and dimming are dropped and the rows simply
 * reveal in sequence.
 */
export default function Capabilities() {
  const sectionRef = useRef(null);

  // The heading opens as it climbs: one scrubbed gesture, both tiers.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isReducedMotion()) return undefined;
    const ctx = gsap.context(() => {
      typeSpread('[data-cap-spread]', { amount: 1.05 });
    }, el);
    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || isReducedMotion()) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const rows = gsap.utils.toArray('[data-cap-row]', el);
      const dots = gsap.utils.toArray('[data-cap-dot]', el);
      const figs = gsap.utils.toArray('[data-cap-fig]', el);
      const metric = el.querySelector('[data-cap-metric]');
      let activeIndex = 0;

      const paint = (index) => {
        rows.forEach((row, i) => row.classList.toggle('is-active', i === index));
        dots.forEach((dot, i) => dot.classList.toggle('is-on', i === index));
        figs.forEach((fig, i) => fig.classList.toggle('is-on', i === index));
        if (metric) metric.textContent = CAPABILITIES[index].metric;
      };

      const offs = [];
      const ctx = gsap.context(() => {
        // Desktop owns the counting numbers; the server markup keeps the
        // authored value so the reduced-motion path never shows "00".
        rows.forEach((row) => {
          const num = row.querySelector('[data-cap-num]');
          num.dataset.final = num.textContent.trim();
          num.textContent = '00';
        });

        rows.forEach((row, i) => {
          // Dominance follows the centre line of the viewport.
          ScrollTrigger.create({
            trigger: row,
            start: 'top 66%',
            end: 'bottom 44%',
            onEnter: () => {
              activeIndex = i;
              paint(i);
            },
            onEnterBack: () => {
              activeIndex = i;
              paint(i);
            },
          });

          gsap.fromTo(
            row.querySelector('[data-cap-rule]'),
            { scaleX: 0 },
            {
              scaleX: 1,
              ease: EASE.linear,
              scrollTrigger: { trigger: row, start: 'top 84%', end: 'top 46%', scrub: 0.4 },
            }
          );

          countUp(row.querySelector('[data-cap-num]'), i + 1, {
            duration: 0.8,
            trigger: row,
            start: 'top 88%',
          });

          // Each row rises once, on its own beat.
          gsap.fromTo(row.querySelectorAll('[data-cap-rise]'), { y: 34, opacity: 0 }, {
            y: 0,
            opacity: 1,
            duration: 0.95,
            ease: EASE.out,
            stagger: 0.07,
            clearProps: 'transform',
            scrollTrigger: { trigger: row, start: 'top 78%', once: true },
          });

          const enter = () => paint(i);
          const leave = () => paint(activeIndex);
          row.addEventListener('pointerenter', enter);
          row.addEventListener('pointerleave', leave);
          row.addEventListener('focusin', enter);
          offs.push(() => {
            row.removeEventListener('pointerenter', enter);
            row.removeEventListener('pointerleave', leave);
            row.removeEventListener('focusin', enter);
          });
        });

        // The viewer belongs to the scroll, not to the column: it travels a few
        // pixels against the list so the sticky half never feels frozen.
        gsap.fromTo(
          '.cap-view',
          { yPercent: 3.5 },
          {
            yPercent: -3.5,
            ease: EASE.linear,
            scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 1 },
          }
        );

        paint(0);
      }, el);

      return () => {
        offs.forEach((off) => off());
        ctx.revert();
      };
    });

    mm.add('(max-width: 1023px)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('[data-cap-row]', el).forEach((row) => {
          gsap.fromTo(
            row.querySelectorAll('[data-cap-rise]'),
            { y: 26, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.85,
              ease: EASE.out,
              stagger: 0.06,
              clearProps: 'transform',
              scrollTrigger: { trigger: row, start: 'top 86%', once: true },
            }
          );
        });
      }, el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="capabilities"
      aria-labelledby="capabilities-title"
      className="relative"
    >
      <div className="shell">
        <Seam
          index="01"
          label="CAPABILITIES"
          note="FOUR PRACTICES — ONE TEAM"
          tone="capabilities"
        />

        <div className="cap-grid">
          <div className="cap-sticky">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-ember/70" aria-hidden="true" />
                WHAT WE DO / 04
              </p>
            </Reveal>

            <Reveal from="lines" stagger={0.1}>
              <h2
                id="capabilities-title"
                className="headline-anim display-md max-w-[22ch]"
              >
                <span className="line-mask">
                  <span data-reveal-line data-cap-spread className="line-inner">
                    WE TURN COMPLEX
                  </span>
                </span>
                <span className="line-mask">
                  <span data-reveal-line data-cap-spread className="line-inner">
                    TECHNOLOGY INTO
                  </span>
                </span>
                <span className="line-mask">
                  <span data-reveal-line className="line-inner text-ember">
                    EXPERIENCES.
                  </span>
                </span>
              </h2>
            </Reveal>

            <Reveal delay={0.2}>
              <p className="lead mt-7 max-w-[38ch]">
                Four practices, one team. We move between research, design and engineering without
                hand-offs — which is the only way to ship intelligent work that feels considered.
              </p>
            </Reveal>

            {/* Focus visual — cross-faded by hover and scroll together */}
            <div className="cap-view" aria-hidden="true">
              {CAPABILITIES.map((cap, i) => (
                <figure key={cap.id} data-cap-fig className={`cap-view__fig${i === 0 ? ' is-on' : ''}`}>
                  <img src={cap.image} alt="" loading="lazy" width={1408} height={768} />
                  <span className="cap-view__grid" />
                  <figcaption className="cap-view__meta">
                    <span>{cap.id}</span>
                    <span>{cap.title}</span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="mt-9 flex items-center gap-5">
              <ul className="cap-dots" aria-hidden="true">
                {CAPABILITIES.map((cap, i) => (
                  <li key={cap.id} data-cap-dot className={`cap-dot${i === 0 ? ' is-on' : ''}`} />
                ))}
              </ul>
              <p className="eyebrow eyebrow--dim text-[9px] lg:hidden">04 PRACTICES</p>
              <p
                data-cap-metric
                className="num ml-auto hidden text-[9px] text-halo/70 lg:block"
                aria-hidden="true"
              >
                {CAPABILITIES[0].metric}
              </p>
            </div>
          </div>

          <ul className="cap-list">
            {CAPABILITIES.map((cap) => (
              <li key={cap.id} data-cap-row className="cap-row">
                <span className="cap-row__bar" aria-hidden="true" />
                <span className="cap-ghost" aria-hidden="true">
                  {cap.id}
                </span>

                <div className="flex items-start gap-5 lg:gap-9">
                  <span data-cap-num className="cap-row__num pt-2.5">
                    {cap.id}
                  </span>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
                      <h3 className="cap-title" data-cap-rise>
                        {cap.title}
                      </h3>
                      <span className="cap-row__go" data-cap-rise>
                        {cap.metric}
                      </span>
                    </div>

                    <span data-cap-rule className="cap-rule" aria-hidden="true" />

                    <p data-cap-blurb className="cap-blurb" data-cap-rise>
                      {cap.blurb}
                    </p>

                    <ul className="cap-tags" data-cap-rise>
                      {cap.detail.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
