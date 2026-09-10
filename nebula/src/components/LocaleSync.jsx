'use client';

import { useEffect, useLayoutEffect, useRef } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import { registerGsap } from '@/lib/animations';
import { restorePrefs, useCopy, useLang, useTheme } from '@/i18n/prefs';

registerGsap();

// Mirrors `viewport.themeColor` in app/layout.js; the meta is rewritten here so
// the browser chrome follows a manual switch instead of the OS preference.
const CHROME_COLOR = { dark: '#07070a', light: '#f6f4ef' };

/**
 * LocaleSync — the single owner of everything the browser needs to know about
 * the active language, and the reason no other component has to react to it.
 *
 * On mount it restores the stored preferences (the <head> script has already
 * painted the right theme, so this never republishes styles). After that, a
 * language change updates <html lang>, the document title and description, and
 * re-measures the scroll choreography once — translated copy is longer or
 * shorter than English, so pinned rails and scrub ranges need fresh numbers,
 * while the scroll position itself is preserved.
 */
export default function LocaleSync() {
  const lang = useLang();
  const theme = useTheme();
  const t = useCopy();
  const mounted = useRef(false);

  useEffect(() => {
    for (const meta of document.querySelectorAll('meta[name="theme-color"]')) {
      meta.removeAttribute('media');
      meta.setAttribute('content', CHROME_COLOR[theme] ?? CHROME_COLOR.dark);
    }
  }, [theme]);

  useLayoutEffect(() => {
    restorePrefs();
  }, []);

  useEffect(() => {
    document.title = t.meta.title;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute('content', t.meta.description);
    const og = document.querySelector('meta[property="og:description"]');
    if (og) og.setAttribute('content', t.meta.ogDescription);

    // First run is the render itself; measuring then would fight the boot.
    if (!mounted.current) {
      mounted.current = true;
      return undefined;
    }

    let a = 0;
    let b = 0;
    // Two frames: React has committed the new text, and layout has settled.
    a = requestAnimationFrame(() => {
      b = requestAnimationFrame(() => ScrollTrigger.refresh());
    });
    return () => {
      cancelAnimationFrame(a);
      cancelAnimationFrame(b);
    };
  }, [lang, t]);

  return null;
}
