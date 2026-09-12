"use client";

import { useApp } from "@/lib/store/AppProvider";

/**
 * Hides a homepage section when the admin CMS toggles it off.
 * Renders children untouched by default, so SSR markup is complete.
 */
export default function CmsSection({ section, children }) {
  const { cms } = useApp();
  if (cms?.sections && cms.sections[section] === false) return null;
  return children;
}
