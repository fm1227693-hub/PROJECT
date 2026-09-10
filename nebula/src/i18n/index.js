import { DEFAULT_LANG, isLang } from './config';
import { de } from './dictionaries/de';
import { en } from './dictionaries/en';
import { es } from './dictionaries/es';
import { fr } from './dictionaries/fr';
import { zh } from './dictionaries/zh';

/**
 * The registry. English is the authored source; every other dictionary is
 * filled from it, key by key, so a missing translation can never render
 * `undefined` in the UI.
 */
export const DICTIONARIES = { en, es, zh, de, fr };

const cache = new Map([[DEFAULT_LANG, en]]);

function fill(base, over) {
  if (Array.isArray(base)) {
    const list = Array.isArray(over) ? over : [];
    return base.map((item, i) => fill(item, list[i]));
  }
  if (base && typeof base === 'object') {
    const out = {};
    for (const key of Object.keys(base)) out[key] = fill(base[key], over?.[key]);
    return out;
  }
  return over === undefined || over === null || over === '' ? base : over;
}

export function getDict(lang) {
  if (!isLang(lang) || lang === DEFAULT_LANG) return en;
  let dict = cache.get(lang);
  if (!dict) {
    dict = fill(en, DICTIONARIES[lang]);
    cache.set(lang, dict);
  }
  return dict;
}
