'use client';

import { useCopy } from '@/i18n/prefs';

/**
 * Skip link — visually hidden until focused, and translated like any other
 * control. It is a client component for exactly one reason: the label has to
 * follow the active language, and the root layout stays on the server.
 */
export default function SkipLink() {
  const t = useCopy();
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-[130] focus:bg-mist focus:px-4 focus:py-2 focus:text-[11px] focus:uppercase focus:tracking-[0.2em] focus:text-void"
    >
      {t.ui.skip}
    </a>
  );
}
