'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { isReducedMotion } from '@/lib/motion';
import { registerGsap, EASE } from '@/lib/animations';
import ProjectCard from '@/components/ProjectCard';
import Reveal from '@/components/Reveal';
import Seam from '@/components/Seam';
import { useCopy } from '@/i18n/prefs';
import { useProjects } from '@/i18n/use-copy';

registerGsap();

/**
 * Projects — three worlds on one horizontal rail.
 *
 * Desktop: the stage pins for exactly one viewport and vertical scroll travels
 * the track sideways. Distance is measured (`scrollWidth − innerWidth`), applied
 * as `xPercent`, and re-measured on refresh — never a magic number, never a
 * layout property. Each plate drifts a few percent against the track so the row
 * has parallax inside the parallax, and the HUD (index, ticks, progress hairline)
 * is written straight to the DOM from `onUpdate`.
 *
 * Tablet / mobile: the same plates become a vertical list with clip-path image
 * reveals. Horizontal scrolling is never forced on touch.
 */
export default function Projects() {
  const sectionRef = useRef(null);
  const railRef = useRef(null);
  const trackRef = useRef(null);
  const t = useCopy();
  const projects = useProjects();

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    const track = trackRef.current;
    if (!section || !rail || !track || isReducedMotion()) return undefined;

    const mm = gsap.matchMedia();

    mm.add('(min-width: 1024px)', () => {
      const cards = gsap.utils.toArray('[data-project-card]', rail);
      const ticks = gsap.utils.toArray('[data-rail-tick]', rail);
      const bar = rail.querySelector('[data-rail-bar]');
      const readout = rail.querySelector('[data-rail-readout]');
      // The rail is inset by the shell, so measure the rail — not the window.
        const getDistance = () => Math.max(1, track.scrollWidth - rail.clientWidth);

      let railTrigger = null;
      let lastIndex = -1;

      const setIndex = (i) => {
        if (i === lastIndex) return;
        lastIndex = i;
        if (readout) readout.textContent = `${String(i + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}`;
        ticks.forEach((t, n) => t.classList.toggle('is-on', n === i));
      };

      let onFocusIn = () => {};

      const ctx = gsap.context(() => {
        // Plates surface once, then the rail takes over.
        const frames = gsap.utils.toArray('[data-reveal-frame]', rail);
        const zooms = gsap.utils.toArray('[data-reveal-media]', rail);

        const intro = gsap.timeline({
          scrollTrigger: { trigger: rail, start: 'top 70%', once: true },
        });
        intro
          .fromTo(
            frames,
            { clipPath: 'inset(0 100% 0 0)' },
            { clipPath: 'inset(0 0% 0 0)', duration: 1.2, ease: EASE.inOut, stagger: 0.14, clearProps: 'clip-path' }
          )
          .fromTo(
            zooms,
            { scale: 1.14 },
            { scale: 1, duration: 1.6, ease: EASE.cinematic, stagger: 0.14, clearProps: 'transform' },
            0.08
          );

        railTrigger = gsap.to(track, {
          xPercent: () => (-getDistance() / track.offsetWidth) * 100,
          ease: EASE.linear,
          scrollTrigger: {
            trigger: rail,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            pin: true,
            // The scroller is the window (Lenis drives native scroll), and no
            // ancestor of the rail transforms — so fixed pinning is exact.
            pinType: 'fixed',
            scrub: 0.8,
            anticipatePin: 1,
            invalidateOnRefresh: true,
            onUpdate: (self) => {
              setIndex(Math.min(cards.length - 1, Math.max(0, Math.round(self.progress * (cards.length - 1)))));
              if (bar) gsap.set(bar, { scaleX: Math.max(0.02, self.progress) });
            },
            onRefresh: (self) => {
              setIndex(Math.min(cards.length - 1, Math.max(0, Math.round(self.progress * (cards.length - 1)))));
            },
          },
        });

        // Depth inside the rail: each plate lags the track slightly.
        gsap.to(cards, {
          xPercent: 4.5,
          ease: EASE.linear,
          scrollTrigger: {
            trigger: rail,
            start: 'top top',
            end: () => `+=${getDistance()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });

        /* ---------------- Drag to scrub ----------------
         *
         * The pin is scroll-driven, so the drag writes scroll position too —
         * one source of truth, and the scrub smoothing does the easing.
         * Pointer capture keeps the gesture alive when the cursor outruns the
         * rail; a drag longer than a few pixels swallows the click that ends it.
         */
        let dragging = false;
        let moved = 0;
        let startX = 0;
        let startScroll = 0;
        let ratio = 1;
        let range = { start: 0, end: 0 };

        const onDown = (e) => {
          const st = railTrigger?.scrollTrigger;
          if (!st || e.button !== 0 || e.target.closest('a, button')) return;
          dragging = true;
          moved = 0;
          startX = e.clientX;
          startScroll = window.scrollY;
          range = { start: st.start, end: st.end };
          ratio = (st.end - st.start) / Math.max(1, getDistance());
          rail.classList.add('is-dragging');
          try {
            rail.setPointerCapture(e.pointerId);
          } catch {
            /* capture is a nicety, not a requirement */
          }
        };

        const onMove = (e) => {
          if (!dragging) return;
          const dx = e.clientX - startX;
          if (Math.abs(dx) > 3) moved = Math.abs(dx);
          const target = Math.min(range.end, Math.max(range.start, startScroll - dx * ratio));
          if (window.nebulaLenis) window.nebulaLenis.scrollTo(target, { immediate: true });
          else window.scrollTo({ top: target, behavior: 'auto' });
        };

        const onUp = () => {
          if (!dragging) return;
          dragging = false;
          rail.classList.remove('is-dragging');
        };

        // A drag that travelled must not also open a project.
        const onClick = (e) => {
          if (moved > 6) {
            e.preventDefault();
            e.stopPropagation();
            moved = 0;
          }
        };

        rail.addEventListener('pointerdown', onDown);
        rail.addEventListener('pointermove', onMove, { passive: true });
        rail.addEventListener('pointerup', onUp);
        rail.addEventListener('pointercancel', onUp);
        rail.addEventListener('lostpointercapture', onUp);
        rail.addEventListener('click', onClick, true);
        offs.push(() => {
          rail.removeEventListener('pointerdown', onDown);
          rail.removeEventListener('pointermove', onMove);
          rail.removeEventListener('pointerup', onUp);
          rail.removeEventListener('pointercancel', onUp);
          rail.removeEventListener('lostpointercapture', onUp);
          rail.removeEventListener('click', onClick, true);
        });

        // Keyboard access: the rail is a transform, so a focused plate can sit
        // off-screen. Work in the rail's own content coordinates.
        onFocusIn = (e) => {
          const card = e.target?.closest?.('[data-project-card]');
          const st = railTrigger?.scrollTrigger;
          if (!card || !st) return;
          const distance = getDistance();
          const left = card.offsetLeft;
          const travel = st.progress * distance;
          const framed = left - travel >= 24 && left - travel + card.offsetWidth <= rail.clientWidth - 24;
          if (framed) return;
          const wanted = Math.min(distance, Math.max(0, left - 48));
          const target = Math.min(st.end, st.start + (wanted / distance) * (st.end - st.start));
          const jump = () => {
            if (window.nebulaLenis) window.nebulaLenis.scrollTo(target, { immediate: true });
            else window.scrollTo({ top: target, behavior: 'auto' });
          };
          requestAnimationFrame(jump);
        };
        rail.addEventListener('focusin', onFocusIn);

        // The heading travels against the rail as the section passes.
        gsap.to('[data-projects-heading]', {
          xPercent: -7,
          scale: 0.97,
          ease: EASE.linear,
          scrollTrigger: { trigger: section, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }, section);

      document.fonts?.ready.then(() => ScrollTrigger.refresh()).catch(() => {});

      return () => {
        rail.removeEventListener('focusin', onFocusIn);
        ctx.revert();
      };
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={sectionRef} id="work" aria-labelledby="work-title" className="relative">
      <div className="shell">
        <Seam index="02" label={t.seams.work.label} note={t.seams.work.note} tone="work" />

        <div className="section-head">
          <div>
            <Reveal>
              <p className="eyebrow mb-6 flex items-center gap-3">
                <span className="inline-block h-px w-8 bg-ember/70" aria-hidden="true" />
                {t.projects.eyebrow}
              </p>
            </Reveal>
            <Reveal from="lines" stagger={0.12}>
              <h2 id="work-title" data-projects-heading className="headline-anim display-lg">
                {t.projects.heading.map((line, i) => (
                  <span className="line-mask" key={`prj-line-${i}`}>
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
          </div>

          <Reveal delay={0.18} className="hidden max-w-[34ch] lg:block">
            <p className="lead">{t.projects.lead}</p>
            <p className="eyebrow eyebrow--dim mt-6 text-[9px]">{t.ui.holdDrag}</p>
          </Reveal>
        </div>
      </div>

      {/* Desktop: pinned horizontal stage */}
      <div
        ref={railRef}
        className="rail no-scrollbar"
        data-cursor="drag"
        data-cursor-label={t.ui.drag}
      >
        <span className="rail__edge rail__edge--l" aria-hidden="true" />
        <span className="rail__edge rail__edge--r" aria-hidden="true" />

        <div ref={trackRef} className="rail__track">
          {projects.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} layout="rail" />
          ))}
        </div>

        <div className="rail__hud">
          <p className="eyebrow eyebrow--dim text-[9px]">
            <span data-rail-readout>01 / {String(projects.length).padStart(2, '0')}</span>
          </p>
          <span className="rail__bar" aria-hidden="true">
            <span data-rail-bar />
          </span>
          <div className="rail__ticks" aria-hidden="true">
            {projects.map((p, i) => (
              <span key={p.id} data-rail-tick className={`rail__tick${i === 0 ? ' is-on' : ''}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Mobile / tablet: vertical list */}
      <div className="shell pb-20 pt-4 lg:hidden">
        <div className="prj-stack">
          {projects.map((project, i) => (
            <Reveal key={project.id} from="clip" className="w-full">
              <ProjectCard project={project} index={i} layout="stack" />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
