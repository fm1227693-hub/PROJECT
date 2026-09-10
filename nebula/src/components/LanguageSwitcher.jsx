'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';

import { LANG_META, LANGS } from '@/i18n/config';
import { setLang, useCopy, useLang } from '@/i18n/prefs';

/**
 * LanguageSwitcher — the whole multilingual surface, in two shapes.
 *
 * `menu`  (navbar, ≥640px): a compact `EN ▾` trigger with a dropdown that opens
 *         on opacity + a 6px translate + a 2% scale. Nothing animates layout,
 *         so the panel costs one composited frame.
 * `chips` (mobile sheet): five inline chips — no overlay to position inside a
 *         clipped sheet, and one tap is enough.
 *
 * Picking a language writes one attribute + one class on <html> and notifies
 * the store; React updates text nodes in place, so scroll position, pinned
 * sections and every running GSAP timeline survive untouched.
 */
export default function LanguageSwitcher({ variant = 'menu' }) {
  const lang = useLang();
  const t = useCopy();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const listRef = useRef(null);
  const id = useId();

  const close = useCallback((focusTrigger = true) => {
    setOpen(false);
    if (focusTrigger) triggerRef.current?.focus();
  }, []);

  // Dismiss on pointer-down outside, and on Escape from anywhere in the widget.
  useEffect(() => {
    if (!open) return undefined;
    const root = rootRef.current;
    const onPointerDown = (e) => {
      if (root && !root.contains(e.target)) setOpen(false);
    };
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        close();
      }
    };
    document.addEventListener('pointerdown', onPointerDown, { passive: true });
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open, close]);

  const pick = useCallback(
    (next) => {
      setLang(next);
      if (variant === 'menu') setOpen(false);
    },
    [variant]
  );

  const onListKeyDown = (e) => {
    const items = [...(listRef.current?.querySelectorAll('[role="menuitemradio"]') ?? [])];
    if (!items.length) return;
    const at = items.indexOf(document.activeElement);
    let to = null;
    if (e.key === 'ArrowDown') to = at < 0 ? 0 : (at + 1) % items.length;
    else if (e.key === 'ArrowUp') to = at < 0 ? items.length - 1 : (at - 1 + items.length) % items.length;
    else if (e.key === 'Home') to = 0;
    else if (e.key === 'End') to = items.length - 1;
    else if (e.key === 'Tab') {
      close(false);
      return;
    }
    if (to !== null) {
      e.preventDefault();
      items[to].focus();
    }
  };

  if (variant === 'chips') {
    return (
      <div className="lang-chips" role="group" aria-label={t.ui.chooseLanguage}>
        {LANGS.map((code) => (
          <button
            key={code}
            type="button"
            className={`lang-chip${code === lang ? ' is-on' : ''}`}
            onClick={() => pick(code)}
            aria-pressed={code === lang}
            lang={LANG_META[code].attr}
          >
            {LANG_META[code].short}
          </button>
        ))}
      </div>
    );
  }

  const onLeave = (e) => {
    // `relatedTarget` is where focus is going; if that is outside the widget the
    // list has been tabbed or clicked away from.
    if (!rootRef.current?.contains(e.relatedTarget)) setOpen(false);
  };

  return (
    <div
      ref={rootRef}
      className={`lang${open ? ' is-open' : ''}`}
      onFocusOut={onLeave}
      onKeyDown={(e) => {
        if (e.key === 'Escape' && open) {
          e.preventDefault();
          close();
        }
      }}
    >
      <button
        ref={triggerRef}
        type="button"
        className="tool-btn tool-btn--lang"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="true"
        aria-expanded={open}
        aria-controls={`${id}-lang-list`}
        aria-label={`${t.ui.language}: ${LANG_META[lang].native}`}
        data-cursor="expand"
      >
        <span className="tool-btn__code">{LANG_META[lang].short}</span>
        <svg className="tool-btn__caret" viewBox="0 0 10 6" fill="none" aria-hidden="true">
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.25" strokeLinecap="square" />
        </svg>
      </button>

      <div
        id={`${id}-lang-list`}
        ref={listRef}
        className="lang__panel"
        role="menu"
        aria-label={t.ui.chooseLanguage}
        onKeyDown={onListKeyDown}
        // `inert` while closed keeps the panel unreachable to assistive tech
        // during the 220ms it is still fading out.
        inert={!open}
      >
        {LANGS.map((code) => (
          <button
            key={code}
            type="button"
            role="menuitemradio"
            aria-checked={code === lang}
            tabIndex={open ? 0 : -1}
            lang={LANG_META[code].attr}
            className={`lang__item${code === lang ? ' is-on' : ''}`}
            onClick={() => pick(code)}
          >
            <span className="lang__item-dot" aria-hidden="true" />
            <span className="lang__item-name">{LANG_META[code].native}</span>
            <span className="lang__item-code">{LANG_META[code].short}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
