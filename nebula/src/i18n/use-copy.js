'use client';

import { useMemo } from 'react';

import { CAP_MEDIA, NAV_HREFS, PROJECT_MEDIA, STAT_VALUES } from '@/data/site';

import { useCopy } from './prefs';

/**
 * Read-through hooks that stitch the translated copy onto the technical data.
 *
 * `useCopy()` gives the component the whole dictionary for the active language;
 * these helpers only merge in media, ids and anchors, memoised on the
 * dictionary — which changes exactly once per language switch.
 */

export function useNavLinks() {
  const t = useCopy();
  return useMemo(() => NAV_HREFS.map((href, i) => ({ href, label: t.nav[i] })), [t]);
}

export function useCapabilities() {
  const t = useCopy();
  return useMemo(() => t.capabilities.items.map((item, i) => ({ ...item, ...CAP_MEDIA[i] })), [t]);
}

export function useProjects() {
  const t = useCopy();
  return useMemo(() => t.projects.items.map((item, i) => ({ ...item, ...PROJECT_MEDIA[i] })), [t]);
}

export function useStats() {
  const t = useCopy();
  return useMemo(() => STAT_VALUES.map((value, i) => ({ value, label: t.hero.stats[i] })), [t]);
}

export function usePillars() {
  const t = useCopy();
  return useMemo(
    () =>
      t.technology.pillars.map((pillar, i) => ({
        ...pillar,
        id: String(i + 1).padStart(2, '0'),
      })),
    [t]
  );
}
