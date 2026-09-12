"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { useApp } from "@/lib/store/AppProvider";
import Reveal from "@/components/motion/Reveal";
import { SectionHeading } from "@/components/ui/Card";
import Accordion from "@/components/ui/Accordion";
import { EnglishLines } from "@/components/decor/Backgrounds";

/** Homepage FAQ preview — reads the CMS-managed list, so admin edits show here. */
export default function HomeFaq() {
  const { faqs } = useApp();
  const items = (faqs ?? []).slice(0, 6);

  return (
    <section className="relative overflow-hidden bg-canvas py-16 md:py-24">
      <EnglishLines className="opacity-40" />
      <div className="container-page relative grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <Reveal>
          <SectionHeading
            eyebrow="Questions"
            title="Asked before every signup."
            body="The six things people want to know before they spend twenty minutes on a diagnostic."
            size="md"
          />
          <Link
            href="/faq"
            className="mt-6 inline-flex items-center gap-1.5 rounded-md border border-line bg-surface px-4 py-2.5 text-[13px] font-medium text-ink transition-[transform,border-color] duration-200 hover:-translate-y-px hover:border-line-3"
          >
            Open the full help centre
            <ArrowRight className="size-3.5 text-brand" aria-hidden="true" />
          </Link>
        </Reveal>

        <Reveal delay={0.06}>
          <Accordion items={items.map((item) => ({ ...item, content: item.answer }))} />
        </Reveal>
      </div>
    </section>
  );
}
