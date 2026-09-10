import './globals.css';

import Preloader from '@/components/Preloader';
import Atmosphere from '@/components/Atmosphere';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import SmoothScroll from '@/components/SmoothScroll';
import LocaleSync from '@/components/LocaleSync';
import SkipLink from '@/components/SkipLink';

import { en } from '@/i18n/dictionaries/en';

/**
 * Metadata is authored in English — the dictionaries under src/i18n hold the
 * other four, and LocaleSync writes the matching title/description once the
 * stored preference is known, so the shared preview always matches what the
 * visitor is reading.
 */
export const metadata = {
  title: en.meta.title,
  description: en.meta.description,
  openGraph: {
    title: en.meta.title,
    description: en.meta.ogDescription,
    type: 'website',
  },
};

// Matches the canvas of each theme, so the browser chrome disappears into it.
export const viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#07070a' },
    { media: '(prefers-color-scheme: light)', color: '#f6f4ef' },
  ],
};

/**
 * Runs in <head>, before the first paint and before hydration, so the document
 * already knows its motion tier, its theme and its language. The tiers and the
 * two preference attributes are written by this script only — React never
 * renders them, so there is no server/client attribute disagreement to
 * reconcile during hydration, and neither theme nor language can flash.
 */
const BOOTSTRAP = `
(function () {
  var d = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  d.dataset.motion = reduced ? 'reduced' : 'full';
  d.dataset.pointer = fine ? 'fine' : 'coarse';
  d.dataset.cursor = fine && !reduced ? 'on' : 'off';

  var store = null;
  try { store = window.localStorage; } catch (e) { store = null; }
  var get = function (k) { try { return store ? store.getItem(k) : null; } catch (e) { return null; } };

  var theme = get('theme');
  if (theme !== 'light' && theme !== 'dark') {
    theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
  }
  d.dataset.theme = theme;

  var LANGS = { en: 1, es: 1, zh: 1, de: 1, fr: 1 };
  var ATTRS = { en: 'en', es: 'es', zh: 'zh-Hans', de: 'de', fr: 'fr' };
  var lang = get('language');
  if (!lang || !LANGS[lang]) {
    lang = null;
    var tags = window.navigator.languages || [window.navigator.language];
    for (var i = 0; i < tags.length && !lang; i++) {
      var base = String(tags[i] || '').toLowerCase().slice(0, 2);
      if (base === 'zh') lang = 'zh';
      else if (LANGS[base] && base !== 'en') lang = base;
    }
  }
  lang = lang || 'en';
  d.dataset.lang = lang;
  d.lang = ATTRS[lang];
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />
        {/* Reveal states are hidden by CSS until GSAP plays them; with JS off
            (or before it runs) every layer must still be readable. */}
        <noscript>
          <style>{`.preload{display:none!important}.hero-pre,.hero-scene{opacity:1!important}.line-inner{transform:none!important;opacity:1!important}.headline-anim .line-inner{transform:none!important;opacity:1!important}.seam__line,.hero-rule,.rail__bar>span,.tech-bar>span{transform:none!important}.atmos__tone--hero{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body className="text-mist antialiased">
        <LocaleSync />
        <SkipLink />
        <Preloader />
        <Atmosphere />
        <CustomCursor />
        <Navbar />
        <ScrollProgress />
        <main id="main" tabIndex={-1} className="relative focus:outline-none">
          {children}
        </main>
        <SmoothScroll />
        <div className="grain" aria-hidden="true" />
      </body>
    </html>
  );
}
