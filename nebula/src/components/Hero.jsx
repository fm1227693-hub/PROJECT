'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { registerGsap, EASE, depth, countUp } from '@/lib/animations';
import { whenBooted } from '@/lib/boot';
import dynamic from 'next/dynamic';
import MagneticButton from '@/components/MagneticButton';
import { SITE } from '@/data/site';
import { useCopy } from '@/i18n/prefs';
import { useStats } from '@/i18n/use-copy';

registerGsap();

/**
 * The WebGL layer is code-split and client-only: three.js never blocks the
 * first paint, and the hero typography renders without it.
 */
const HeroScene = dynamic(() => import('@/components/HeroScene'), {
  ssr: false,
  loading: () => null,
});

/**
 * Hero — the entrance, then the descent.
 *
 * Entrance (one timeline, fired the moment the preloader starts lifting):
 * atmosphere fades up → eyebrow slides in → headline lines rise through their
 * masks on staggered timing → the rule draws → the lead softens from blur to
 * sharp → CTAs land → the WebGL world fades up and settles → stats count up.
 *
 * Descent (scrubbed, never pinned): four layers travel at four speeds while the
 * headline loses scale and the bottom fade thickens, so the page reads as one
 * move through a space rather than a stack of sections.
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const started = useRef(false);
  const t = useCopy();
  const stats = useStats();

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || started.current) return undefined;
    started.current = true;

    const reduced = document.documentElement.dataset.motion === 'reduced';

    if (reduced) {
      // Nothing animates, so nothing may be left in a pre-animation state.
      gsap.set(el.querySelectorAll('.hero-pre, .hero-scene, .hero-rule, [data-reveal-line]'), {
        clearProps: 'all',
      });
      return undefined;
    }

    // The counters start at zero behind the curtain, so the numbers never
    // flash their final value before the entrance plays.
    el.querySelectorAll('[data-count]').forEach((node) => {
      node.textContent = '0';
    });

    const heroTone = () => {
      document.documentElement.dataset.tone = 'hero';
    };

    let ctx = null;
    const cancelBoot = whenBooted(() => {
      ctx = gsap.context(() => {
        const lines = el.querySelectorAll('[data-reveal-line]');
        const lead = el.querySelector('[data-hero-lead]');
        const scene = el.querySelector('[data-hero-scene]');

        // One factor for the whole hero: on a phone every entrance distance is
        // cut to ~38% and the two decorative layers stand down, so mobile feels
        // calmer rather than merely smaller.
        const d = depth(1);
        const wide = d === 1;

        /* ---------------- Entrance ---------------- */
        gsap
          .timeline({
            defaults: { ease: EASE.out },
            onComplete: () => ScrollTrigger.refresh(),
          })
          .fromTo(
            '[data-hero-bg]',
            { opacity: 0, scale: 1.1 },
            { opacity: 1, scale: 1, duration: 1.8, ease: 'power2.out' },
            0
          )
          .fromTo(
            '[data-hero-top] > *',
            { y: -14 * d, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85, stagger: 0.08 },
            0.08
          )
          .fromTo(
            '[data-hero-eyebrow]',
            { x: -22 * d },
            { x: 0, duration: 1, ease: 'expo.out' },
            0.1
          )
          // Two layers per line: the mask gives a little way downward while the
          // type rises inside it. That counter-move is what separates a mask
          // reveal from a plain slide-up — desktop only.
          .fromTo(
            '.line-mask',
            { y: wide ? 10 : 0 },
            { y: 0, duration: 1.5, ease: 'expo.out', stagger: 0.15 },
            0.14
          )
          .fromTo(
            lines,
            { yPercent: 135, y: 0, x: -14 * d, opacity: 0 },
            {
              yPercent: 0,
              y: 0,
              x: 0,
              opacity: 1,
              duration: 1.35,
              ease: 'expo.out',
              // Each line has its own breath: the opening is quick, the object
              // line lands heavier, the accent glides in last.
              stagger: { each: 0.15, from: 'start' },
            },
            0.16
          )
          .fromTo(
            wide ? lines[1] : [],
            { scale: 1.04 },
            { scale: 1, duration: 1.9, ease: 'power3.out' },
            0.3
          )
          .fromTo(
            '[data-hero-rule]',
            { scaleX: 0 },
            { scaleX: 1, duration: 1.15, ease: 'power3.inOut' },
            0.82
          )
          .fromTo(
            lead,
            { y: 24 * d, opacity: 0, filter: wide ? 'blur(7px)' : 'blur(4px)' },
            {
              y: 0,
              opacity: 1,
              filter: 'blur(0px)',
              duration: 0.95,
              onComplete: () => gsap.set(lead, { clearProps: 'filter' }),
            },
            0.9
          )
          .fromTo(
            '[data-hero-cta]',
            { y: 20 * d, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.1 },
            1.04
          )
          // The world opens like an aperture: a clip that unwinds while the
          // scale settles, instead of a layer simply fading in over the top.
          .fromTo(
            scene,
            { opacity: 0, scale: 0.92, clipPath: 'inset(17% 38% 17% 38% round 2px)' },
            {
              opacity: 1,
              scale: 1,
              clipPath: 'inset(0% 0% 0% 0% round 0px)',
              duration: 2.1,
              ease: 'power2.out',
              clearProps: 'clip-path',
            },
            0.5
          )
          .fromTo(
            '[data-hero-stat]',
            { y: 16 * d, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.7, stagger: 0.08 },
            1.26
          )
          .fromTo('[data-hero-cue]', { y: 12 * d, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, 1.42)
          .add(() => {
            el.querySelectorAll('[data-hero-stat]').forEach((stat, i) => {
              countUp(stat.querySelector('[data-count]'), Number(stat.dataset.countTo || 0), {
                duration: 1.15 - i * 0.12,
                pad: 0,
              });
            });
          }, 1.3);

        /* ---------------- Scroll choreography ---------------- */

        // The hero owns the global tone while it is in view, so scrolling back
        // to the top returns the atmosphere to its opening weather.
        ScrollTrigger.create({
          trigger: el,
          start: 'top top',
          end: 'bottom 55%',
          onEnter: heroTone,
          onEnterBack: heroTone,
        });

        // Explicit from/to pairs, so a resize mid-hero can never re-capture a
        // half-animated value as the baseline.
        gsap
          .timeline({
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.7,
              invalidateOnRefresh: true,
            },
          })
          // Atmosphere barely moves: it is the furthest layer away.
          .fromTo('[data-hero-bg]', { yPercent: 0 }, { yPercent: 6 * d, ease: EASE.linear }, 0)
          // The world travels furthest and grows — you move through it.
          .fromTo(
            '[data-hero-scene-shift]',
            { yPercent: 0, scale: 1, opacity: 1 },
            { yPercent: 15 * d, scale: 1.14, opacity: 0.3, ease: EASE.linear },
            0
          )
          // Copy rises against it and loses its voice.
          .fromTo(
            '[data-hero-copy]',
            { yPercent: 0, opacity: 1 },
            { yPercent: -11 * d, opacity: 0.05, ease: EASE.linear },
            0
          )
          // Headline keeps its left edge and recedes like a physical object.
          .fromTo('[data-hero-headline]', { scale: 1 }, { scale: 1 - 0.09 * d, ease: EASE.linear }, 0)
          // Foreground strip moves fastest.
          .fromTo(
            '[data-hero-footer]',
            { yPercent: 0, opacity: 1 },
            { yPercent: -17 * d, opacity: 0.12, ease: EASE.linear },
            0
          )
          .fromTo(
            '[data-hero-top]',
            { yPercent: 0, opacity: 1 },
            { yPercent: -30 * d, opacity: 0, ease: EASE.linear },
            0
          )
          .fromTo('[data-hero-fade]', { opacity: 0.6 }, { opacity: 1, ease: EASE.linear }, 0)
          // The instrument turns as you descend.
          .fromTo(
            '[data-hero-dial]',
            { rotate: 0, scale: 1, opacity: 0.75 },
            { rotate: 46, scale: 0.9, opacity: 0.15, ease: EASE.linear },
            0
          );

        gsap.utils.toArray('[data-hero-rail]').forEach((rail) => {
          gsap.to(rail, {
            yPercent: rail.dataset.heroRail === 'left' ? -8 : 8,
            ease: EASE.linear,
            scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 1.1 },
          });
        });
      }, el);
    });

    return () => {
      cancelBoot();
      ctx?.revert();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="top"
      className="relative isolate overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* LAYER 1 — atmosphere */}
      <div
        data-hero-bg
        aria-hidden="true"
        className="pointer-events-none absolute inset-[-10%] -z-30"
        style={{
          background:
            'radial-gradient(115% 80% at 74% 6%, rgb(var(--ember-rgb) / 0.16) 0%, rgb(var(--ember-rgb) / 0.035) 40%, transparent 70%), radial-gradient(90% 70% at 4% 96%, rgb(var(--cool-rgb) / 0.09) 0%, transparent 62%)',
        }}
      />

      {/* LAYER 2 — the WebGL world. The wrapper carries the scroll travel, the
          inner layer carries the entrance, so the two timelines never write the
          same property on the same node. */}
      <div data-hero-scene-shift className="hero-scene-wrap">
        <div data-hero-scene className="hero-scene h-full w-full">
          <HeroScene className="h-full w-full" />
        </div>
      </div>

      {/* LAYER 3 — legibility scrim + the fade into the next act */}
      <div className="hero-scrim" aria-hidden="true" />
      <div
        data-hero-fade
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-[4] h-[38%]"
        style={{
          opacity: 0.6,
          background:
            'linear-gradient(to bottom, transparent, rgb(var(--bg-rgb) / 0.8) 62%, var(--color-void))',
        }}
      />

      {/* LAYER 4 — typography + controls */}
      <div className="shell hero-stage relative">
        <p className="hero-side hero-side--left" data-hero-rail="left" aria-hidden="true">
          <span>
            {t.ui.established} {SITE.established} — {t.ui.independent}
          </span>
        </p>
        <p className="hero-side hero-side--right" data-hero-rail="right" aria-hidden="true">
          <span>{t.ui.scrollDescend}</span>
        </p>

        {/* Echo of the engine dial — the same instrument, smaller. It answers
            scroll instead of looping, so it costs nothing while you read. */}
        <div
          data-hero-dial
          className="hero-dial"
          aria-hidden="true"
        >
          <svg viewBox="0 0 200 200" className="h-full w-full">
            <circle cx="100" cy="100" r="88" fill="none" stroke="currentColor" strokeWidth="0.75" className="text-mist/12" />
            <path
              d="M100 12 A88 88 0 0 1 188 100"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              className="text-ember/80"
            />
            <circle cx="188" cy="100" r="2.4" fill="currentColor" className="text-halo" />
            <circle cx="100" cy="100" r="34" fill="none" stroke="currentColor" strokeWidth="0.6" strokeDasharray="2 6" className="text-mist/16" />
            <rect x="96" y="96" width="8" height="8" fill="none" stroke="currentColor" strokeWidth="0.9" className="text-mist/30" transform="rotate(45 100 100)" />
          </svg>
        </div>

        <div data-hero-top className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <p data-hero-eyebrow className="eyebrow flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-ember/70" aria-hidden="true" />
            {SITE.name} — {t.meta.tagline.toUpperCase()}
          </p>
          <p className="eyebrow eyebrow--dim hidden items-center gap-2.5 md:flex">
            <span className="status-dot" aria-hidden="true" />
            {t.meta.city.toUpperCase()} · {SITE.coordinates}
          </p>
        </div>

        <div data-hero-copy className="relative flex flex-1 flex-col justify-center py-10">
          <h1
            id="hero-title"
            data-hero-headline
            className="headline-anim display-xl hero-bleed"
          >
            {t.hero.lines.map((line, i) => (
              // Keyed by position: a language change then updates the text in the
              // same node, so the masks keep the transforms their timeline wrote.
              <span key={`hero-line-${i}`} className="line-mask">
                <span
                  data-reveal-line
                  className={`line-inner${i === 1 ? ' hairline-type hero-line--em' : ''}${
                    i === 2 ? ' hero-line--tail' : ''
                  }`}
                  // Copy is authored in src/data/site.js — never user input.
                  dangerouslySetInnerHTML={{ __html: line }}
                />
              </span>
            ))}
          </h1>

          <span
            data-hero-rule
            className="hero-rule mt-8 block w-full max-w-[620px]"
            aria-hidden="true"
          />

          <div className="mt-8 flex flex-col gap-8 lg:mt-10 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
            <p data-hero-lead className="hero-pre lead">
              {t.hero.lead}
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              <span data-hero-cta className="hero-pre">
                <MagneticButton href="#contact">{t.ui.startProject}</MagneticButton>
              </span>
              <span data-hero-cta className="hero-pre">
                <MagneticButton href="#work" variant="ghost">
                  {t.ui.viewWork}
                </MagneticButton>
              </span>
            </div>
          </div>
        </div>

        <div
          data-hero-footer
          className="relative flex flex-wrap items-end justify-between gap-x-10 gap-y-6 border-t pt-5"
          style={{ borderColor: 'var(--line)' }}
        >
          <ul className="flex flex-wrap items-end gap-x-9 gap-y-5 sm:gap-x-14">
            {stats.map((s) => (
              <li key={s.label} data-hero-stat data-count-to={s.value} className="hero-stat hero-pre">
                <span className="hero-stat__value block" data-count>
                  {s.value}
                </span>
                <span className="eyebrow eyebrow--dim mt-2 block text-[9px]">{s.label}</span>
              </li>
            ))}
          </ul>

          <div data-hero-cue className="scroll-cue hero-pre eyebrow eyebrow--dim text-[9px]">
            <span>{t.ui.scroll}</span>
            <span className="scroll-cue__track" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  );
}
