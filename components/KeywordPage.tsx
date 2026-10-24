import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Eye, Flame, Lock } from "lucide-react";
import {
  KEYWORD_PAGES,
  fillN,
  itemCount,
  itemText,
  type KeywordPage as Page,
} from "@/data/keywordPages";
import { QUESTION_LISTS } from "@/data/questionLists";
import { FREE_ADULT_LIMIT, PARTY_PASS_LABEL, UNLOCK_18_PRICE } from "@/lib/monetization";
import { shareMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, faqJsonLd, itemListJsonLd } from "@/lib/site";
import { JsonLd } from "./JsonLd";
import { PageHero } from "./PageHero";
import { RandomPick } from "./RandomPick";
import { SectionHeading } from "./SectionHeading";

export function keywordPageMetadata(page: Page): Metadata {
  const title = fillN(page.title, page);
  const description = fillN(page.description, page);
  return {
    title: { absolute: `${title} | OffLimits` },
    description,
    alternates: { canonical: page.path },
    ...shareMetadata(title, description, page.path),
  };
}

/** Titles for related links: keyword pages, deck question lists, then a
 * fallback built from the path. */
function labelFor(path: string): string {
  const kw = KEYWORD_PAGES.find((p) => p.path === path);
  if (kw) return kw.h1;
  const ql = QUESTION_LISTS.find((l) => `/questions/${l.slug}` === path);
  if (ql) return ql.h1;
  const last = path.split("/").filter(Boolean).pop() ?? "";
  return last.replace(/-/g, " ").replace(/^\w/, (c) => c.toUpperCase());
}

function crumbs(page: Page) {
  if (page.path.startsWith("/questions/")) {
    return [{ name: "Questions", path: "/questions" }, { name: page.h1, path: page.path }];
  }
  if (page.path.startsWith("/white-elephant/")) {
    return [{ name: "White Elephant", path: "/white-elephant" }, { name: page.h1, path: page.path }];
  }
  if (page.path.startsWith("/secret-santa/")) {
    return [{ name: "Secret Santa Generator", path: "/secret-santa" }, { name: page.h1, path: page.path }];
  }
  return [{ name: page.h1, path: page.path }];
}

/** A search-targeted list page: hero, interactive list (tap-to-reveal trivia
 * answers, random pick), how-to, tips, FAQ and related links. Everything is
 * server-rendered so search engines see the full content. */
/** 18+ pages only ever send the free preview to the browser: the first
 * FREE_ADULT_LIMIT items. The rest stay on the server behind the Party Pass. */
function previewSections(page: Page): Page["sections"] {
  let left = FREE_ADULT_LIMIT;
  return page.sections
    .map((s) => {
      const items = s.items.slice(0, Math.max(0, left));
      left -= items.length;
      return { ...s, items };
    })
    .filter((s) => s.items.length > 0);
}

function LockedRest({ count }: { count: number }) {
  return (
    <div className="relative mt-4 overflow-hidden rounded-2xl border-2 border-rose-500/50">
      <ol aria-hidden className="space-y-2 p-3 blur-[5px] select-none">
        {Array.from({ length: Math.min(count, 5) }, (_, i) => (
          <li key={i} className="flex gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3">
            <span className="h-4 w-6 rounded bg-rose-400/40" />
            <span className="h-4 flex-1 rounded bg-foreground/20" style={{ maxWidth: `${70 + ((i * 13) % 25)}%` }} />
          </li>
        ))}
      </ol>
      <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-background/70 p-5 text-center backdrop-blur-[2px]">
        <span className="grid h-12 w-12 place-items-center rounded-full bg-rose-500/20">
          <Lock className="h-6 w-6 text-rose-400" aria-hidden />
        </span>
        <p className="text-lg font-extrabold text-foreground">{count} more locked</p>
        <p className="max-w-sm text-sm text-muted">
          You&apos;ve seen the {FREE_ADULT_LIMIT} free previews. The {PARTY_PASS_LABEL} unlocks
          every 18+ deck and list for 24 hours, for {UNLOCK_18_PRICE}.
        </p>
        <Link
          href="/play?category=18-plus&vibe=wild"
          className="inline-flex items-center gap-2 rounded-full border-2 border-rose-500 bg-rose-500 px-5 py-2.5 text-sm font-extrabold text-white shadow-[0_0_24px_rgba(244,63,94,0.45)] transition-transform hover:-translate-y-0.5"
        >
          <Flame className="h-4 w-4" aria-hidden />
          Unlock all with the Party Pass
        </Link>
      </div>
    </div>
  );
}

export function KeywordPageView({ page }: { page: Page }) {
  const n = itemCount(page);
  const sections = page.adult ? previewSections(page) : page.sections;
  const shown = sections.reduce((k, s) => k + s.items.length, 0);
  const locked = n - shown;
  const allItems = sections.flatMap((s) => s.items);
  const isTrivia = allItems.some((i) => typeof i !== "string");
  let counter = 0;

  const PlayButton = page.play ? (
    <Link href={page.play.href} className="btn-primary w-full sm:w-auto">
      {page.play.label}
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  ) : null;

  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={[
          itemListJsonLd({ name: page.h1, path: page.path, items: allItems.map(itemText) }),
          faqJsonLd(page.faq),
          breadcrumbJsonLd(crumbs(page)),
        ]}
      />
      <PageHero title={page.h1} eyebrow={page.eyebrow} emojis={page.emojis} width="max-w-2xl">
        <p className="mt-4 text-pretty text-base text-muted sm:text-lg">{fillN(page.intro, page)}</p>
        {page.adult ? (
          <p className="mt-4 inline-flex items-center gap-2 rounded-full border border-rose-500/50 bg-rose-500/10 px-3 py-1 text-sm font-bold text-rose-400">
            <Flame className="h-4 w-4" aria-hidden />
            Adults only (18+). Play only with people who are into it.
          </p>
        ) : null}
        {PlayButton ? <div className="mt-6 flex flex-col gap-3 pb-4 sm:flex-row">{PlayButton}</div> : null}
      </PageHero>

      {page.howTo ? (
        <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <SectionHeading title="How to play" />
          <ol className="mt-4 flex flex-col gap-2">
            {page.howTo.map((step, i) => (
              <li key={step} className="glass-card flex items-start gap-3 px-4 py-3">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-accent text-xs font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="pt-0.5 text-sm leading-relaxed text-muted sm:text-base">{step}</span>
              </li>
            ))}
          </ol>
        </section>
      ) : null}

      <section id="keyword-list" className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm font-semibold text-muted">
            {page.adult ? `${FREE_ADULT_LIMIT} free previews of ${n}` : `${n} ${isTrivia ? "questions" : "ideas"}`} · {page.adult ? "unlock the rest with the Party Pass" : isTrivia ? "tap a question to see the answer" : "free to read, print or play"}
          </p>
          <RandomPick target="keyword-list" />
        </div>

        {sections.map((section) => (
          <div key={section.heading} className="mt-8">
            <SectionHeading title={section.heading} />
            {section.intro ? <p className="mt-2 text-sm text-muted">{section.intro}</p> : null}
            <ol className="mt-4 space-y-2">
              {section.items.map((item) => {
                counter += 1;
                const num = counter;
                return typeof item === "string" ? (
                  <li
                    key={item}
                    className="flex gap-3 rounded-xl border border-border bg-surface/50 px-4 py-3 text-sm leading-relaxed text-foreground/90 transition-colors hover:border-accent sm:text-base"
                  >
                    <span className="w-6 shrink-0 text-right font-extrabold tabular-nums text-accent">{num}.</span>
                    <span>{item}</span>
                  </li>
                ) : (
                  <li key={item.q}>
                    <details className="group rounded-xl border border-border bg-surface/50 px-4 py-3 transition-colors hover:border-accent open:border-accent [&_summary::-webkit-details-marker]:hidden">
                      <summary className="flex cursor-pointer list-none gap-3 text-sm leading-relaxed text-foreground sm:text-base">
                        <span className="w-6 shrink-0 text-right font-extrabold tabular-nums text-accent">{num}.</span>
                        <span className="flex-1 font-semibold">{item.q}</span>
                        <span className="inline-flex shrink-0 items-center gap-1 self-start rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent group-open:hidden">
                          <Eye className="h-3.5 w-3.5" aria-hidden />
                          Answer
                        </span>
                      </summary>
                      <p className="mt-2 pl-9 text-sm font-bold text-emerald-500 group-open:animate-fade-up sm:text-base">
                        ✓ {item.a}
                      </p>
                    </details>
                  </li>
                );
              })}
            </ol>
          </div>
        ))}
        {locked > 0 ? <LockedRest count={locked} /> : null}
        {PlayButton ? <div className="mt-8">{PlayButton}</div> : null}
      </section>

      {page.tips?.length ? (
        <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
          <SectionHeading title="Tips" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {page.tips.map((t) => (
              <div key={t.title} className="glass-card p-4 sm:p-5">
                <h3 className="font-extrabold text-foreground">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted">{t.body}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="Frequently asked questions" />
        <div className="mt-4 space-y-2">
          {page.faq.map((item) => (
            <details
              key={item.q}
              className="group rounded-xl border border-border bg-surface/60 px-4 py-3 transition-colors hover:border-accent open:border-accent [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-sm font-semibold text-foreground">
                {item.q}
                <span aria-hidden className="text-lg leading-none text-muted transition-transform duration-200 group-open:rotate-45">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm leading-relaxed text-muted group-open:animate-fade-up">{item.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <SectionHeading title="Keep the party going" />
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {page.related.map((path) => (
            <li key={path}>
              <Link
                href={path}
                className="block rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-semibold text-foreground transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent"
              >
                {labelFor(path)}
              </Link>
            </li>
          ))}
        </ul>
        <Link href="/questions" className="mt-4 inline-block text-sm font-semibold text-accent underline-offset-2 hover:underline">
          See every question list
        </Link>
      </section>
    </div>
  );
}
