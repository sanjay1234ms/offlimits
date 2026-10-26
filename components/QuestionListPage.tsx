import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "./SectionHeading";
import { ALL_DECK_CARDS, renderText, type DeckCard } from "@/data/decks";
import { corePageForGame } from "@/data/corePages";
import {
  QUESTION_LISTS,
  fillCount,
  type QuestionList,
} from "@/data/questionLists";
import { shareMetadata } from "@/lib/seo";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/site";
import { JsonLd } from "./JsonLd";
import { PageHero } from "./PageHero";
import { RandomPick } from "./RandomPick";
import { MOST_LIKELY_PAGES } from "@/data/keywordPages/mostLikely";

/** Deck cards for a list, in deck order (heat ascending within a category). */
function cardsFor(list: QuestionList): DeckCard[] {
  return list.sources.flatMap((src) =>
    ALL_DECK_CARDS.filter(
      (c) =>
        c.game === list.game &&
        c.category === src.category &&
        src.heats.includes(c.intensity),
    ).sort((a, b) => a.intensity - b.intensity),
  );
}

export function questionCount(list: QuestionList): number {
  return (list.extra?.length ?? 0) + cardsFor(list).length;
}

export function questionListMetadata(list: QuestionList): Metadata {
  const n = questionCount(list);
  const title = fillCount(list.title, n);
  const description = fillCount(list.description, n);
  return {
    title: { absolute: `${title} | OffLimits` },
    description,
    alternates: { canonical: `/questions/${list.slug}` },
    ...shareMetadata(title, description, `/questions/${list.slug}`),
  };
}

function playHref(list: QuestionList): string {
  const params = new URLSearchParams({ game: list.game });
  if (list.playCategory) params.set("category", list.playCategory);
  return `/play?${params.toString()}`;
}

function NumberedList({
  items,
  start = 1,
}: {
  items: string[];
  start?: number;
}) {
  return (
    <ol
      start={start}
      className="mt-4 list-decimal space-y-2.5 pl-6 text-sm leading-relaxed text-foreground/90 marker:font-extrabold marker:text-accent sm:text-base"
    >
      {items.map((q) => (
        <li key={q} className="pl-1">
          {q}
        </li>
      ))}
    </ol>
  );
}

/** A readable, printable list of questions with a one-tap way into the game. */
export function QuestionListPage({ list }: { list: QuestionList }) {
  const cards = cardsFor(list);
  const n = questionCount(list);
  const core = corePageForGame(list.game);
  const isTod = list.game === "truth_or_dare";

  const extra = list.extra ?? [];
  const deckQuestions = cards.map(renderText);
  const truths = cards.filter((c) => c.kind === "truth").map(renderText);
  const dares = cards.filter((c) => c.kind === "dare").map(renderText);

  const related = QUESTION_LISTS.filter((l) => l.slug !== list.slug)
    .sort((a, b) => Number(b.game === list.game) - Number(a.game === list.game))
    .slice(0, 6);
  // Most Likely To lists also point at the flavour pages and the vote game.
  const extraLinks =
    list.game === "most_likely_to"
      ? [
          { href: "/most-likely-to-game", label: "Most Likely To voting game" },
          ...MOST_LIKELY_PAGES.map((p) => ({ href: p.path, label: p.h1 })),
        ]
      : [];

  const PlayButton = (
    <Link href={playHref(list)} className="btn-primary w-full sm:w-auto">
      Play these on your phone
      <ArrowRight className="h-4 w-4" aria-hidden />
    </Link>
  );

  const path = `/questions/${list.slug}`;

  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={[
          itemListJsonLd({
            name: list.h1,
            path,
            items: [...extra, ...deckQuestions],
          }),
          breadcrumbJsonLd([
            { name: "Questions", path: "/questions" },
            { name: list.h1, path },
          ]),
        ]}
      />
      <PageHero
        title={list.h1}
        eyebrow={`📝 ${n} questions`}
        emojis={["🤔", "😂", "🙈"]}
        width="max-w-2xl"
      >
        <p className="mt-4 text-pretty text-base text-muted sm:text-lg">
          {fillCount(list.intro, n)}
        </p>
        <div className="mt-6 flex flex-col gap-3 pb-4 sm:flex-row">
          {PlayButton}
          {core ? (
            <Link
              href={`/games/${core.slug}`}
              className="btn-ghost w-full sm:w-auto"
            >
              How to play {core.h1.replace(/ Questions$/, "")}
            </Link>
          ) : null}
        </div>
      </PageHero>

      <section className="mx-auto max-w-2xl px-4 py-6 sm:px-6">
        <SectionHeading title="How to play" />
        <ol className="mt-4 list-decimal space-y-2 pl-6 text-sm leading-relaxed text-muted sm:text-base">
          {list.howTo.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </section>

      <section
        id="question-list"
        className="mx-auto max-w-2xl px-4 py-6 sm:px-6"
      >
        <RandomPick target="question-list" />
        {isTod ? (
          <>
            <SectionHeading title={`${truths.length} truth questions`} />
            <NumberedList items={truths} />
            <div className="mt-10">
              <SectionHeading title={`${dares.length} dares`} />
              <NumberedList items={dares} />
            </div>
          </>
        ) : (
          <>
            <SectionHeading title={`All ${n} questions`} />
            <NumberedList items={[...extra, ...deckQuestions]} />
          </>
        )}
        <div className="mt-8">{PlayButton}</div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <SectionHeading title="More question lists" />
        <ul className="mt-4 grid gap-2 sm:grid-cols-2">
          {related.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/questions/${l.slug}`}
                className="block rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-semibold text-foreground transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent"
              >
                {l.h1}
              </Link>
            </li>
          ))}
          {extraLinks.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                className="block rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-semibold text-foreground transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-accent"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/questions"
          className="mt-4 inline-block text-sm font-semibold text-accent underline-offset-2 hover:underline"
        >
          See all question lists
        </Link>
      </section>
    </div>
  );
}
