"use client";

import { useEffect } from "react";
import { useApp } from "@/lib/store/AppProvider";

/**
 * Applies the learner's appearance preferences to <html>. All three themes are
 * bright by design — Prisma never ships a dark surface.
 */
export default function AppearanceSync() {
  const { settings, hydrated } = useApp();

  useEffect(() => {
    if (!hydrated) return;
    const root = document.documentElement;
    root.dataset.appearance = settings.appearance ?? "default";
    root.dataset.density = settings.density ?? "comfortable";
    root.lang = settings.language ?? "en";
  }, [hydrated, settings.appearance, settings.density, settings.language]);

  return null;
}
