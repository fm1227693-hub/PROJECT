'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatePresence, motion } from 'framer-motion';
import { registerGsap, EASE } from '@/lib/animations';
import { scrollToSection } from '@/lib/scroll';
import { whenBooted } from '@/lib/boot';
import { isReducedMotion } from '@/lib/motion';
import { NAV_LINKS, SITE } from '@/data/site';
import MagneticButton from '@/components/MagneticButton';

registerGsap();

const SHEET_EASE = [0.22, 1, 0.36, 1];

/**
 * Navbar — a control interface, not a banner.
 *
 * Floating and transparent over the hero; on scroll the shell contracts into a
 * glass panel with a hairline border. Every state change is written straight to
 * the DOM from one ScrollTrigger (never React state on a scroll frame), and the
 * active item is tracked by a single hairline marker that GSAP slides between
 * links with transform only.
 */
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const headRef = useRef(null);
  const listRef = useRef(null);
  const markerRef = useRef(null);
  const clockRef = useRef(null);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return undefined;

    // Listeners this effect owns are removed by hand — gsap.context reverts
    // tweens and triggers, not addEventListener.
    let offReveal = null;
    const ctx = gsap.context(() => {
      const links = gsap.utils.toArray('[data-nav-link]', el);
      const marker = markerRef.current;
      const list = listRef.current;

      const place = (href, animate = true) => {
        if (!marker || !list) return;
        const link = links.find((l) => l.getAttribute('href') === href);
        if (!link) return;
        const x = link.offsetLeft;
        const scaleX = Math.max(12, link.offsetWidth) / 10;
        if (animate && !isReducedMotion()) {
          gsap.to(marker, { x, scaleX, duration: 0.55, ease: 'power3.out' });
        } else {
          gsap.set(marker, { x, scaleX });
        }
        marker.classList.add('is-on');
      };
      const setActive = (href) => {
        links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === href));
        if (href) place(href);
        else marker.classList.remove('is-on');
      };

      // One trigger owns the whole bar's state: the compact glass, and a
      // retract that gets out of the way when the reader commits downward and
      // returns the moment they come back up. Class writes only — no re-render,
      // and the movement itself is a single CSS `translate`.
      const smart = !isReducedMotion() && window.matchMedia('(min-width: 640px)').matches;
      let lastY = window.scrollY;
      let hidden = false;
      const setHidden = (next) => {
        if (!smart || next === hidden) return;
        hidden = next;
        el.classList.toggle('is-hidden', next);
      };
      ScrollTrigger.create({
        start: 56,
        end: 'max',
        onRefresh: (self) => {
          el.classList.toggle('is-scrolled', self.scroll() > 56);
          lastY = self.scroll();
        },
        onUpdate: (self) => {
          const y = self.scroll();
          el.classList.toggle('is-scrolled', y > 56);
          const locked = document.documentElement.classList.contains('is-locked');
          if (!locked && y > 760 && y - lastY > 8) setHidden(true);
          else if (lastY - y > 8 || y < 660) setHidden(false);
          lastY = y;
        },
      });

      // Focus must never land on a bar that is retracted.
      const reveal = () => setHidden(false);
      el.addEventListener('focusin', reveal);
      offReveal = () => el.removeEventListener('focusin', reveal);

      // Active section: one trigger per anchor.
      links.forEach((link) => {
        const href = link.getAttribute('href');
        const section = document.querySelector(href);
        if (!section) return;
        ScrollTrigger.create({
          trigger: section,
          start: 'top 42%',
          end: 'bottom 42%',
          onToggle: (self) => {
            if (self.isActive) setActive(href);
          },
          onLeaveBack: () => setActive(null),
        });
      });

      if (!isReducedMotion()) {
        gsap.set(el, { y: -26, opacity: 0 });
        whenBooted(() => {
          gsap.to(el, { y: 0, opacity: 1, duration: 1, ease: EASE.cinematic });
        });
      }
    }, el);

    return () => {
      offReveal?.();
      ctx.revert();
    };
  }, []);

  // Berlin time — a text write once a second, never a re-render.
  useEffect(() => {
    const node = clockRef.current;
    if (!node) return undefined;
    const tick = () => {
      try {
        node.textContent = new Intl.DateTimeFormat('en-GB', {
          timeZone: SITE.timeZoneId,
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        }).format(new Date());
      } catch {
        node.textContent = '--:--';
      }
    };
    tick();
    const id = setInterval(tick, 30000);
    return () => clearInterval(id);
  }, []);

  // Lock the scroll (Lenis and native) while the sheet is open.
  useEffect(() => {
    const locked = menuOpen;
    headRef.current?.classList.remove('is-hidden');
    document.documentElement.classList.toggle('is-locked', locked);
    document.body.classList.toggle('is-locked', locked);
    const lenis = window.nebulaLenis;
    if (lenis) {
      if (locked) lenis.stop();
      else lenis.start();
    }
    return () => {
      document.documentElement.classList.remove('is-locked');
      document.body.classList.remove('is-locked');
      window.nebulaLenis?.start();
    };
  }, [menuOpen]);

  const onNav = useCallback(
    (e, href) => {
      e.preventDefault();
      if (!href.startsWith('#')) return;
      if (menuOpen) {
        setMenuOpen(false);
        // The sheet unlocks Lenis on its cleanup; wait one frame for that.
        requestAnimationFrame(() => scrollToSection(href));
      } else {
        scrollToSection(href);
      }
    },
    [menuOpen]
  );

  const toggleMenu = useCallback(() => setMenuOpen((v) => !v), []);

  return (
    <>
      <header ref={headRef} className="site-head">
        <div className="nav-shell">
          <a
            href="#top"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection('#top', { offset: 0, duration: 1.5 });
            }}
            className="nav-word group"
            aria-label={`${SITE.name} — back to top`}
            data-cursor="expand"
          >
            <span className="nav-word__mark">{SITE.name}</span>
            <span className="nav-word__dot" aria-hidden="true" />
            <span className="nav-word__label hidden sm:inline">STUDIO</span>
          </a>

          <nav aria-label="Primary" ref={listRef} className="nav-list">
            {NAV_LINKS.map((link, i) => (
              <a
                key={link.href}
                href={link.href}
                data-nav-link
                onClick={(e) => onNav(e, link.href)}
                data-cursor="expand"
                className="nav-link"
              >
                <span className="nav-link__idx" aria-hidden="true">
                  0{i + 1}
                </span>
                {link.label}
              </a>
            ))}
            <span className="nav-marker" ref={markerRef} aria-hidden="true" />
          </nav>

          <div className="flex items-center gap-6">
            <p className="nav-clock eyebrow hidden text-[9px] lg:block" aria-label="Local studio time">
              <span ref={clockRef} /> BERLIN
            </p>
            <span className="nav-cta">
              <MagneticButton href="#contact" className="!px-4 !py-2.5" strength={0.85}>
                START A PROJECT
              </MagneticButton>
            </span>

            <button
              type="button"
              onClick={toggleMenu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              aria-label={menuOpen ? 'Close menu' : 'Open menu'}
              className="nav-burger"
              data-cursor="expand"
            >
              <span className="nav-burger__label">{menuOpen ? 'CLOSE' : 'MENU'}</span>
              <span className="nav-burger__box" aria-hidden="true">
                <span className="nav-burger__bar" />
                <span className="nav-burger__bar" />
              </span>
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="sheet flex flex-col justify-between px-6 pb-9 pt-28"
            initial={{ clipPath: 'inset(0 0 100% 0)' }}
            animate={{ clipPath: 'inset(0 0 0% 0)' }}
            exit={{ clipPath: 'inset(0 0 100% 0)' }}
            transition={{ duration: 0.6, ease: SHEET_EASE }}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => onNav(e, link.href)}
                  initial={{ y: 34, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.14 + i * 0.07, duration: 0.62, ease: SHEET_EASE }}
                  className="flex items-baseline gap-4 border-b py-4 font-display text-[13vw] leading-none tracking-[0.005em] sm:text-6xl"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span className="num text-ember">0{i + 1}</span>
                  {link.label}
                </motion.a>
              ))}
            </nav>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.6, ease: SHEET_EASE }}
              className="flex flex-col gap-4"
            >
              <a
                href={`mailto:${SITE.email}`}
                className="link-underline w-fit font-display text-[6.5vw] leading-none sm:text-2xl"
              >
                {SITE.email}
              </a>
              <p className="eyebrow eyebrow--dim flex items-center gap-2.5 text-[9px]">
                <span className="status-dot" aria-hidden="true" />
                AVAILABLE FOR SELECT PROJECTS
              </p>
              <p className="eyebrow eyebrow--dim text-[9px]">
                {SITE.city.toUpperCase()} · {SITE.timezone}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
