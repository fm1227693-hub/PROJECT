import './globals.css';

import Preloader from '@/components/Preloader';
import Atmosphere from '@/components/Atmosphere';
import Navbar from '@/components/Navbar';
import CustomCursor from '@/components/CustomCursor';
import ScrollProgress from '@/components/ScrollProgress';
import SmoothScroll from '@/components/SmoothScroll';

export const metadata = {
  title: 'NEBULA — AI Creative Studio',
  description:
    'NEBULA is an AI creative studio building digital worlds: AI experiences, digital products, interactive systems and creative technology.',
  openGraph: {
    title: 'NEBULA — AI Creative Studio',
    description: 'We build digital worlds for the AI era.',
    type: 'website',
  },
};

// Matches the near-black canvas, so the browser chrome disappears into it.
export const viewport = {
  themeColor: '#07070a',
};

/**
 * Runs in <head>, before the first paint and before hydration, so the document
 * already knows its motion tier. The tiers are written as data attributes by
 * this script only — React never renders them, so there is no server/client
 * attribute disagreement to reconcile during hydration.
 */
const BOOTSTRAP = `
(function () {
  var d = document.documentElement;
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  d.dataset.motion = reduced ? 'reduced' : 'full';
  d.dataset.pointer = fine ? 'fine' : 'coarse';
  d.dataset.cursor = fine && !reduced ? 'on' : 'off';
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: BOOTSTRAP }} />
        {/* Reveal states are hidden by CSS until GSAP plays them; with JS off
            (or before it runs) every layer must still be readable. */}
        <noscript>
          <style>{`.preload{display:none!important}.hero-pre,.hero-scene{opacity:1!important}.line-inner{transform:none!important;opacity:1!important}.headline-anim .line-inner{transform:none!important;opacity:1!important}.seam__line,.hero-rule,.rail__bar>span,.tech-bar>span{transform:none!important}.atmos__tone--hero{opacity:1!important}`}</style>
        </noscript>
      </head>
      <body className="text-mist antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[130] focus:bg-mist focus:px-4 focus:py-2 focus:text-[11px] focus:uppercase focus:tracking-[0.2em] focus:text-void"
        >
          Skip to content
        </a>
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
