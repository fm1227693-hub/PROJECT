"use client";

import { useMemo, useState } from "react";
import { Search, SearchX } from "lucide-react";

import { cn } from "@/lib/utils";
import { FAQS, FAQ_CATEGORIES } from "@/lib/data/faq";
import Accordion from "@/components/ui/Accordion";
import { EmptyState } from "@/components/ui/States";
import Button from "@/components/ui/Button";

/** Searchable, categorised FAQ browser. */
export default function FaqBrowser({ initialCategory = "all" }) {
  const [category, setCategory] = useState(initialCategory);
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((item) => {
      const inCategory = category === "all" || item.category === category;
      const inQuery = !q || item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q);
      return inCategory && inQuery;
    });
  }, [category, query]);

  const counts = useMemo(() => {
    const map = { all: FAQS.length };
    for (const item of FAQS) map[item.category] = (map[item.category] ?? 0) + 1;
    return map;
  }, []);

  return (
    <div>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full lg:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-faint" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search the help centre"
            aria-label="Search frequently asked questions"
            className="h-10 w-full rounded-md border border-line bg-surface pl-9 pr-3 text-[13.5px] text-ink transition-colors placeholder:text-faint hover:border-line-2 focus-visible:border-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/15"
          />
        </div>

        <ul className="scroll-slim -mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1" role="tablist" aria-label="FAQ categories">
          {FAQ_CATEGORIES.map((item) => {
            const active = category === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setCategory(item.id)}
                  className={cn(
                    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12.5px] font-medium transition-colors duration-200",
                    active
                      ? "border-brand bg-brand text-white"
                      : "border-line bg-surface text-ink-soft hover:border-line-3 hover:text-ink",
                  )}
                >
                  {item.label}
                  <span className={cn("tnum text-[10.5px]", active ? "text-white/70" : "text-faint")}>{counts[item.id] ?? 0}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="mt-8">
        {results.length ? (
          <>
            <p className="mb-3 text-[12.5px] text-muted">
              {results.length} {results.length === 1 ? "answer" : "answers"}
              {category !== "all" ? ` in ${FAQ_CATEGORIES.find((c) => c.id === category)?.label}` : ""}
              {query ? ` matching “${query}”` : ""}
            </p>
            <Accordion
              items={results.map((item) => ({ ...item, content: item.answer }))}
              defaultOpen={results.length === 1 ? results[0].id : null}
              tone="display"
            />
          </>
        ) : (
          <EmptyState
            icon={SearchX}
            title="No answers match that search"
            description={`Nothing in the help centre mentions “${query}”. Try a different word, or ask us directly.`}
            action={
              <Button href="/contact" size="sm">
                Contact support
              </Button>
            }
            secondaryAction={
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("");
                  setCategory("all");
                }}
              >
                Clear filters
              </Button>
            }
          />
        )}
      </div>
    </div>
  );
}
