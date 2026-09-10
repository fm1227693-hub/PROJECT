'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { registerGsap, EASE } from '@/lib/animations';
import { isReducedMotion } from '@/lib/motion';
import Reveal from '@/components/Reveal';
import Seam from '@/components/Seam';
import Ticker from '@/components/Ticker';
import { SITE } from '@/data/site';
import { LANG_EVENT, useCopy } from '@/i18n/prefs';
import { usePillars } from '@/i18n/use-copy';

registerGsap();

/** One normalized beat per pillar inside the pinned timeline. */
const STEP = 1;

/**
 * Tick ring, generated once at module scope. A single path beats 48 <line>
 * nodes: one DOM element, no long float attributes, byte-identical markup on
 * server and client.
 */
const TICKS = (() => {
  const f = (n) => n.toFixed(1);
  let d = '';
  for (let i = 0; i < 48; i += 1) {
    const a = (i / 48) * Math.PI * 2;
    const r1 = 152;
    const r2 = i % 4 === 0 ? 136 : 146;
    d += `M${f(200 + Math.cos(a) * r1)} ${f(200 + Math.sin(a) * r1)}L${f(200 + Math.cos(a) * r2)} ${f(200 + Math.sin(a) * r2)}`;
  }
  return d;
})();

/** Cardinal label positions on the dial. */
const NODES = [
  { x: 200, y: 24, anchor: 'middle' },
  { x: 376, y: 200, anchor: 'start' },
  { x: 200, y: 384, anchor: 'middle' },
  { x: 24, y: 200, anchor: 'end' },
];

/**
 * Technology — the studio's engine, drawn as one instrument.
 *
 * Desktop: the stage pins for a deliberate beat while a scrubbed timeline walks
 * AI → DESIGN → CODE → MOTION. The word stack swaps through masks, the dial
 * rotates, the scan line sweeps once, the active node on the ring lights up and
 * the progress hairline fills. One timeline, transforms and opacity only.
 *
 * Below 1024px the pin is dropped: the four disciplines become a plain
 * editorial stack, so a phone never pays for a scrub it cannot enjoy.
 */
export default function Technology() {
  const sectionRef = useRef(null);
  const stageRef = useRef(null);
  const t = useCopy();
  const pillars = usePillars();
  // The dial's readout is a DOM write owned by the pinned timeline; reading it
  // through a ref keeps a language swap from having to rebuild that timeline.
  const pillarsRef = useRef(pillars);

  useEffect(() => {
    pillarsRef.current = pillars;
  }, [pillars]);

  useEffect(() => {
    const el = sectionRef.current;
    const stage = stageRef.current;
    if (!el || !stage || isReducedMotion()) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const items = gsap.utils.toArray('[data-tech-item]', el);
      const rings = el.querySelector('[data-tech-rings]');
      const bar = el.querySelector('[data-tech-bar]');
      const readout = el.querySelector('[data-tech-readout]');
      const stepLabel = el.querySelector('[data-tech-step]');
      const scan = el.querySelector('[data-tech-scan]');
      const glow = el.querySelector('[data-tech-glow]');
      const nodes = gsap.utils.toArray('[data-tech-node]', el);
      let step = -1;

      const setStep = (next) => {
        if (next === step) return;
        step = next;
        items.forEach((it, i) => it.classList.toggle('is-active', i === next));
        nodes.forEach((n, i) => n.classList.toggle('is-on', i === next));
        if (readout) readout.textContent = pillarsRef.current[next].word;
        if (stepLabel) stepLabel.textContent = String(next + 1).padStart(2, '0');
      };

      const ctx = gsap.context(() => {
        setStep(0);

        const tl = gsap.timeline({
          defaults: { ease: EASE.linear },
          scrollTrigger: {
            trigger: stage,
            start: 'top top',
            end: () => `+=${window.innerHeight * 1.45}`,
            pin: true,
            pinType: 'fixed',
            scrub: 0.6,
            anticipatePin: 1,
          },
        });

        const total = items.length;
        tl.to(rings, { rotate: 90, duration: total * STEP }, 0);
        tl.to(glow, { scale: 1.08, duration: total * STEP }, 0);
        tl.to(bar, { scaleX: 1, duration: total * STEP, transformOrigin: '0 50%' }, 0);
        tl.fromTo(
          scan,
          { yPercent: -120, scaleX: 0.15, opacity: 0 },
          { yPercent: 120, scaleX: 1, opacity: 0.9, duration: total * STEP, ease: 'sine.inOut' },
          0
        );
        tl.to(scan, { opacity: 0, duration: 0.4 }, total * STEP - 0.4);

        items.forEach((item, i) => {
          const label = item.querySelector('[data-tech-label]');
          const copy = item.querySelector('[data-tech-copy]');
          tl.fromTo(
            label,
            { yPercent: 64, y: 0, opacity: 0 },
            { yPercent: 0, y: 0, opacity: 1, duration: STEP * 0.45, ease: 'power3.out' },
            i * STEP
          );
          if (i < total - 1) {
            tl.to(
              label,
              { yPercent: -72, y: 0, opacity: 0, duration: STEP * 0.45, ease: 'power3.in' },
              i * STEP + STEP * 0.55
            );
          }
          tl.fromTo(
            copy,
            { y: 16, opacity: 0 },
            { y: 0, opacity: 1, duration: STEP * 0.4, ease: EASE.out },
            i * STEP + 0.1
          );
          if (i < total - 1) {
            tl.to(copy, { y: -12, opacity: 0, duration: STEP * 0.3 }, (i + 1) * STEP - 0.34);
          }
          tl.call(() => setStep(i), null, i * STEP + 0.02);
        });
      }, el);

      // Re-label the readout in the new language, after React has committed.
      const onLang = () =>
        requestAnimationFrame(() => {
          if (readout && step >= 0) readout.textContent = pillarsRef.current[step].word;
        });
      window.addEventListener(LANG_EVENT, onLang, { passive: true });

      return () => {
        window.removeEventListener(LANG_EVENT, onLang);
        ctx.revert();
      };
    });

    mm.add('(max-width: 1023px)', () => {
      const ctx = gsap.context(() => {
        gsap.utils.toArray('[data-tech-item]', el).forEach((item) => {
          item.classList.add('is-active');
        });
      }, el);
      return () => ctx.revert();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="about" aria-labelledby="about-title" className="relative">
      <div className="shell">
        <Seam
          index="03"
          label={t.seams.engine.label}
          note={t.seams.engine.note}
          tone="engine"
        />
      </div>

      <div className="shell">
        <div ref={stageRef} className="tech-stage py-16 lg:py-0">
          <div className="relative">
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-ember/70" aria-hidden="true" />
                {t.technology.eyebrow}
              </p>
            </Reveal>

            <Reveal from="lines">
              <h2 id="about-title" className="headline-anim display-md max-w-[20ch]">
                {t.technology.heading.map((line, i) => (
                  <span className="line-mask" key={`tech-line-${i}`}>
                    <span
                      data-reveal-line
                      className={`line-inner${i === 1 ? ' hairline-type' : ''}`}
                    >
                      {line}
                    </span>
                  </span>
                ))}
              </h2>
            </Reveal>

            <div className="tech-words mt-9 lg:mt-12">
              {pillars.map((p, i) => (
                <div
                  key={p.word}
                  data-tech-item
                  className={`tech-item${i === 0 ? ' is-active' : ' lg:absolute lg:inset-0'}`}
                >
                  <span data-tech-label className="tech-word block">
                    {p.word}
                    <span className="num ml-3 align-super text-[10px] tracking-[0.2em]">{p.id}</span>
                  </span>
                  <span className="eyebrow mt-3 block text-[9px] text-halo/70">{p.note}</span>
                  <p data-tech-copy className="tech-copy">
                    {p.copy}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-10 hidden items-center gap-5 lg:flex" aria-hidden="true">
              <span className="eyebrow w-[104px] text-[9px]">
                <span data-tech-readout>AI</span>
              </span>
              <span className="tech-bar">
                <span data-tech-bar />
              </span>
              <span className="eyebrow eyebrow--dim text-[9px]">
                <span data-tech-step>01</span> / {String(pillars.length).padStart(2, '0')}
              </span>
            </div>
          </div>

          {/* The dial */}
          <div className="tech-dial">
            <div className="tech-dial__glow" data-tech-glow aria-hidden="true" />
            <span className="tech-scan" data-tech-scan aria-hidden="true" />
            <svg data-tech-rings viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
              <g className="tech-ambient" fill="none" style={{ transformBox: 'view-box', transformOrigin: '50% 50%' }}>
                <g stroke="currentColor" className="text-mist/12">
                  <circle cx="200" cy="200" r="172" strokeWidth="1" />
                  <circle cx="200" cy="200" r="126" strokeWidth="1" className="text-mist/8" />
                  <circle cx="200" cy="200" r="76" strokeWidth="1" strokeDasharray="2 7" />
                </g>
                <path d={TICKS} stroke="currentColor" className="text-mist/25" strokeWidth="1" />
                <g className="text-ember" stroke="currentColor" fill="none">
                  <path d="M200 28 A172 172 0 0 1 372 200" strokeWidth="1.5" opacity="0.85" />
                  <circle cx="372" cy="200" r="3" fill="currentColor" stroke="none" />
                </g>
                <rect
                  x="192"
                  y="192"
                  width="16"
                  height="16"
                  stroke="currentColor"
                  className="text-mist/40"
                  transform="rotate(45 200 200)"
                />
              </g>
              <g className="tech-nodes">
                {NODES.map((n, i) => (
                  <text
                    key={pillars[i].word}
                    data-tech-node
                    x={n.x}
                    y={n.y}
                    textAnchor={n.anchor}
                    dominantBaseline="middle"
                    className="tech-node"
                  >
                    {pillars[i].word}
                  </text>
                ))}
              </g>
            </svg>
          </div>
        </div>
      </div>

      {/* Manifesto — the visual pause before the last act */}
      <div className="border-t" style={{ borderColor: 'var(--line)' }}>
        <div className="shell py-14 lg:py-20">
          <Reveal stagger={0.14}>
            <p data-reveal-item className="manifesto">
              {t.technology.manifesto}
            </p>
            <p data-reveal-item className="eyebrow eyebrow--dim mt-7 text-[9px]">
              {t.meta.city.toUpperCase()} · {t.ui.established} {SITE.established} ·{' '}
              {t.technology.independent}
            </p>
          </Reveal>
        </div>
      </div>

      <Ticker />
    </section>
  );
}
