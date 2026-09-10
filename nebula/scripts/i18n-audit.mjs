/**
 * i18n audit — run with `npm run i18n:audit`.
 *
 * The dictionaries are hand-maintained, so the one thing that must never rot is
 * their shape: every language has to cover exactly what English covers. This
 * compares key paths (and array lengths) against en, and fails loudly.
 */
import { de } from '../src/i18n/dictionaries/de.js';
import { en } from '../src/i18n/dictionaries/en.js';
import { es } from '../src/i18n/dictionaries/es.js';
import { fr } from '../src/i18n/dictionaries/fr.js';
import { zh } from '../src/i18n/dictionaries/zh.js';

const DICTS = { es, zh, de, fr };

function paths(node, prefix = '', out = []) {
  if (Array.isArray(node)) {
    node.forEach((item, i) => paths(item, `${prefix}[${i}]`, out));
    return out;
  }
  if (node && typeof node === 'object') {
    for (const key of Object.keys(node)) paths(node[key], prefix ? `${prefix}.${key}` : key, out);
    return out;
  }
  out.push(prefix);
  return out;
}

const expected = paths(en);
let problems = 0;

for (const [lang, dict] of Object.entries(DICTS)) {
  const got = new Set(paths(dict));
  const missing = expected.filter((p) => !got.has(p));
  const extra = [...got].filter((p) => !expected.includes(p));
  if (missing.length || extra.length) {
    problems += missing.length + extra.length;
    console.error(`\n✗ ${lang}`);
    for (const m of missing) console.error(`   missing  ${m}`);
    for (const x of extra) console.error(`   unknown  ${x}`);
  } else {
    console.log(`✓ ${lang} — ${expected.length} strings, shape matches en`);
  }
}

// Brand names and technical tokens must survive every translation untouched.
for (const [lang, dict] of Object.entries({ en, ...DICTS })) {
  if (dict.meta.tagline && !dict.meta.title.includes('NUVANE')) {
    console.error(`✗ ${lang}: title must carry the NUVANE brand`);
    problems += 1;
  }
}

if (problems) {
  console.error(`\n${problems} problem(s).`);
  process.exit(1);
}
console.log('\nAll five languages are structurally identical to English.');
