'use client';

import { useSyncExternalStore } from 'react';

import { isLang, LANG_META } from './config';
import { getDict } from './index';

/**
 * prefs — one tiny external store for the two settings the navbar owns:
 * language and theme.
 *
 * Why not context? Because a context value change re-renders every consumer at
 * once and any provider wrapper in between, while `useSyncExternalStore` lets
 * each component subscribe to exactly one primitive. The language swap then
 * costs a single text pass over the tree (no remount, no re-layout of the
 * scroll choreography) and the theme swap costs *nothing* in React at all —
 * it is one attribute on `<html>`, and CSS variables do the rest.
 */

export const LANG_KEY = 'language';
export const THEME_KEY = 'theme';

/** Components that measure DOM after a swap listen for this (nav marker, rail). */
export const LANG_EVENT = 'nebula:lang';

const THEMES = ['dark', 'light'];

let lang = 'en';
let theme = 'dark';
let dict = getDict(lang);
let restored = false;
let swapTimer = null;
let animTimer = null;

const langSubs = new Set();
const themeSubs = new Set();

function emit(set) {
  // Copy first: a listener may unsubscribe itself while running.
  for (const notify of [...set]) notify();
}

function read(key) {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key, value) {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    /* private mode: preferences simply do not persist */
  }
}

function prefersLight() {
  return typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-color-scheme: light)').matches
    : false;
}

function applyLangDom(next) {
  const root = document.documentElement;
  root.lang = LANG_META[next].attr;
  root.dataset.lang = next;
}

function applyThemeDom(next) {
  document.documentElement.dataset.theme = next;
}

/**
 * Called once, before paint, from LocaleSync. The inline script in <head> has
 * already set the theme attribute, so restoring here never repaints the page.
 */
export function restorePrefs() {
  if (restored || typeof window === 'undefined') return;
  restored = true;

  const storedTheme = read(THEME_KEY);
  const storedLang = read(LANG_KEY);

  const nextTheme = THEMES.includes(storedTheme)
    ? storedTheme
    : prefersLight()
      ? 'light'
      : 'dark';

  let nextLang = isLang(storedLang) ? storedLang : null;
  if (!nextLang) {
    const nav = window.navigator;
    const guess = [...(nav?.languages ?? []), nav?.language].filter(Boolean);
    nextLang = guess
      .map((tag) => String(tag).toLowerCase().slice(0, 2))
      .find((base) => base === 'zh' || (isLang(base) && base !== 'en'));
  }
  if (!isLang(nextLang)) nextLang = 'en';

  theme = nextTheme;
  lang = nextLang;
  dict = getDict(lang);
  // Written unconditionally: hydration may re-assert the attributes React
  // rendered (data-theme="dark", lang="en"), and this layout effect runs
  // before the browser paints — so a stored light theme can never blink dark.
  applyThemeDom(theme);
  applyLangDom(lang);

  // Follow the system only while the visitor has never chosen a theme.
  if (typeof window.matchMedia === 'function') {
    const mq = window.matchMedia('(prefers-color-scheme: light)');
    const onChange = (e) => {
      if (read(THEME_KEY)) return;
      setTheme(e.matches ? 'light' : 'dark', { persist: false, animate: true });
    };
    mq.addEventListener?.('change', onChange, { passive: true });
  }

  // Keep two tabs in sync — cheap, and it avoids two sources of truth.
  window.addEventListener(
    'storage',
    (e) => {
      if (e.key === THEME_KEY && THEMES.includes(e.newValue) && e.newValue !== theme) {
        setTheme(e.newValue, { persist: false, animate: true });
      }
      if (e.key === LANG_KEY && isLang(e.newValue) && e.newValue !== lang) {
        setLang(e.newValue, { persist: false });
      }
    },
    { passive: true }
  );

  if (lang !== 'en') emit(langSubs);
  if (theme !== 'dark') emit(themeSubs);
}

export function setLang(next, { persist = true } = {}) {
  if (!isLang(next) || next === lang) return;
  lang = next;
  dict = getDict(next);
  if (persist) write(LANG_KEY, next);
  applyLangDom(next);

  const root = document.documentElement;
  root.classList.add('is-lang-swap');
  clearTimeout(swapTimer ?? undefined);
  swapTimer = setTimeout(() => root.classList.remove('is-lang-swap'), 320);

  emit(langSubs);
  window.dispatchEvent(new CustomEvent(LANG_EVENT, { detail: { lang: next } }));
}

export function setTheme(next, { persist = true, animate = true } = {}) {
  if (!THEMES.includes(next) || next === theme) return;
  theme = next;
  if (persist) write(THEME_KEY, next);

  const root = document.documentElement;
  // The colour transition is switched on for the length of the swap only, so it
  // never interferes with the states the scroll timeline owns.
  if (animate && !isReduced()) {
    root.classList.add('is-theme-anim');
    clearTimeout(animTimer ?? undefined);
    animTimer = setTimeout(() => root.classList.remove('is-theme-anim'), 340);
  }
  applyThemeDom(next);
  emit(themeSubs);
}

export function toggleTheme() {
  setTheme(theme === 'light' ? 'dark' : 'light');
}

function isReduced() {
  return (
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

export function getLang() {
  return lang;
}

export function getTheme() {
  return theme;
}

/** For DOM-level consumers (the WebGL scene) that must not re-render. */
export function subscribeTheme(listener) {
  themeSubs.add(listener);
  return () => themeSubs.delete(listener);
}

const subLang = (notify) => {
  langSubs.add(notify);
  return () => langSubs.delete(notify);
};

const subTheme = (notify) => {
  themeSubs.add(notify);
  return () => themeSubs.delete(notify);
};

export function useLang() {
  return useSyncExternalStore(subLang, () => lang, () => 'en');
}

/** The active dictionary. Object identity changes only when the language does. */
export function useCopy() {
  return useSyncExternalStore(subLang, () => dict, () => getDict('en'));
}

export function useTheme() {
  return useSyncExternalStore(subTheme, () => theme, () => 'dark');
}
