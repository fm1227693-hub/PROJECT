'use client';

import { toggleTheme, useCopy, useTheme } from '@/i18n/prefs';

/**
 * ThemeToggle — one button, two states, no re-render of the page.
 *
 * The click writes a single data attribute on <html>; every colour on the site
 * is a CSS variable, so switching themes never touches React state below the
 * navbar. The icons cross-fade on `opacity`/`scale`/`rotate` — composited
 * properties only — and the whole control stays inside the navbar's own rhythm.
 */
export default function ThemeToggle({ variant = 'nav' }) {
  const theme = useTheme();
  const t = useCopy();
  const light = theme === 'light';

  return (
    <button
      type="button"
      className={`tool-btn tool-btn--theme${variant === 'sheet' ? ' tool-btn--wide' : ''}${
        light ? ' is-light' : ''
      }`}
      onClick={toggleTheme}
      role="switch"
      aria-checked={light}
      aria-label={light ? t.ui.toDark : t.ui.toLight}
      data-cursor="expand"
      data-theme-btn
    >
      <span className="theme-toggle__icons" aria-hidden="true">
        <svg className="theme-toggle__icon theme-toggle__icon--moon" viewBox="0 0 24 24" fill="none">
          <path
            d="M20 14.5A8.5 8.5 0 0 1 9.5 4a8.5 8.5 0 1 0 10.5 10.5Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </svg>
        <svg className="theme-toggle__icon theme-toggle__icon--sun" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="4.25" stroke="currentColor" strokeWidth="1.5" />
          <path
            d="M12 2.5v2.2M12 19.3v2.2M2.5 12h2.2M19.3 12h2.2M5.3 5.3l1.6 1.6M17.1 17.1l1.6 1.6M18.7 5.3l-1.6 1.6M6.9 17.1l-1.6 1.6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </span>
      {variant === 'sheet' ? (
        <span className="tool-btn__label eyebrow text-[9px]">{light ? t.ui.themeLight : t.ui.themeDark}</span>
      ) : null}
    </button>
  );
}
