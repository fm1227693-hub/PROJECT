/**
 * Language registry — the single source of truth for what the site speaks.
 *
 * Deliberately dependency-free: five dictionaries of plain objects, one small
 * external store, and `useSyncExternalStore`. No i18n library, no provider
 * tree, no context, because the whole page has to switch language inside one
 * frame without re-mounting anything.
 */

export const LANGS = ['en', 'es', 'zh', 'de', 'fr'];

export const DEFAULT_LANG = 'en';

/**
 * `short`  — the compact trigger label in the navbar (never translated).
 * `native` — the name of the language, written in that language.
 * `attr`   — the value mirrored onto `<html lang>` for a11y + font selection.
 */
export const LANG_META = {
  en: { short: 'EN', native: 'English', attr: 'en' },
  es: { short: 'ES', native: 'Español', attr: 'es' },
  zh: { short: '中文', native: '中文', attr: 'zh-Hans' },
  de: { short: 'DE', native: 'Deutsch', attr: 'de' },
  fr: { short: 'FR', native: 'Français', attr: 'fr' },
};

export function isLang(value) {
  return typeof value === 'string' && LANGS.includes(value);
}

/** Best-guess language from the browser, restricted to what we actually ship. */
export function matchBrowserLang(locales) {
  if (!Array.isArray(locales)) return null;
  for (const raw of locales) {
    const base = String(raw).toLowerCase().split('-')[0];
    if (base === 'zh' || base.startsWith('zh')) return 'zh';
    if (isLang(base)) return base;
  }
  return null;
}

/** BCP-47 tags used for locale-aware formatting (the studio clock, dates). */
export const LOCALES = {
  en: 'en-GB',
  es: 'es-ES',
  zh: 'zh-CN',
  de: 'de-DE',
  fr: 'fr-FR',
};
