import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import Link from "next/link";
import { questionCount } from "@/components/QuestionListPage";
import { QUESTION_LISTS } from "@/data/questionLists";
import { corePageForGame } from "@/data/corePages";
import type { PromptGame } from "@/types";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbJsonLd } from "@/lib/site";
import { KEYWORD_PAGES, itemCount, type KeywordPage } from "@/data/keywordPages";

const TITLE =
  "Party Game Questions: Would You Rather & More";
const DESCRIPTION =
  "Free lists of Would You Rather, Never Have I Ever, Truth or Dare, trivia, icebreaker, charades and Christmas questions for friends, couples, kids and work.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/questions" },
  ...shareMetadata(TITLE, DESCRIPTION, "/questions"),
};

/** One section per game, in the order the lists appear. */
const GROUPS: { game: PromptGame; heading: string; blurb: string }[] = [
  {
    game: "would_you_rather",
    heading: "Would You Rather questions",
    blurb:
      "Two options, no way out, and everyone has to pick a side. Would You Rather is the easiest game to start a room talking: read a question out, let people vote with a show of hands, then make the minority defend their choice. Pick the funny list for parties, the kids list for family nights, the couples list for date night and the work list for team meetings.",
  },
  {
    game: "never_have_i_ever",
    heading: "Never Have I Ever questions",
    blurb:
      "Everyone holds up five fingers. Read a statement, and anyone who has done it puts a finger down. The last person with fingers up wins. The clean list works for mixed groups, the juicy list is for adults who want a few confessions, and the couples list is a fun way to learn something new about each other.",
  },
  {
    game: "most_likely_to",
    heading: "Most Likely To questions",
    blurb:
      "Read a prompt, count to three, and everyone points at the person most likely to do it. Whoever gets the most fingers has to explain themselves. It needs no setup and works with any group size, which makes it a favourite for big parties and office socials.",
  },
  {
    game: "this_or_that",
    heading: "This or That questions",
    blurb:
      "Rapid-fire pairs answered on instinct: no explaining, no overthinking. This or That is a great warm-up for classrooms and meetings, and the couples list doubles as a game of how many answers you share.",
  },
  {
    game: "truth_or_dare",
    heading: "Truth or Dare questions",
    blurb:
      "The classic: pick truth and answer honestly, or pick dare and do it. These lists keep things fun rather than mean, with friend-group truths and dares plus a couples list for two.",
  },
];

const KEYWORD_GROUPS: {
  id: KeywordPage["group"];
  heading: string;
  blurb: string;
  unit: string;
}[] = [
  {
    id: "seasonal",
    heading: "Holiday and seasonal lists",
    blurb:
      "Christmas trivia, festive Would You Rather and Never Have I Ever, Thanksgiving quizzes and New Year's Eve games, ready for the family table or the office party.",
    unit: "ideas",
  },
  {
    id: "questions",
    heading: "More question lists",
    blurb:
      "Truth or dare for kids, teens and adults, icebreakers, hot seat, Paranoia, 21 Questions and questions to ask your partner.",
    unit: "questions",
  },
  {
    id: "trivia",
    heading: "Trivia questions with answers",
    blurb: "Tap any question to reveal its answer, so the quizmaster can play too.",
    unit: "questions",
  },
  {
    id: "games",
    heading: "Charades, Pictionary and icebreaker games",
    blurb: "Word lists and game ideas sorted by difficulty, from kids to adults.",
    unit: "ideas",
  },
  {
    id: "gifts",
    heading: "Gift swap guides",
    blurb: "White Elephant rules plus gift ideas for White Elephant and Secret Santa, sorted by budget.",
    unit: "ideas",
  },
];

export default function QuestionsIndexPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd data={breadcrumbJsonLd([{ name: "Questions", path: "/questions" }])} />
      <PageHero
        title="Party game questions"
        eyebrow="📝 Question lists"
        emojis={["🤔", "🙈", "😈"]}
        width="max-w-2xl"
      >
        <p className="mt-4 text-base text-muted sm:text-lg">
          Ready-made lists you can read out loud or play one at a time on your
          phone. All free, no signup.
        </p>
      </PageHero>
      <div className="mx-auto max-w-2xl px-4 sm:px-6">
        <p className="mt-8 text-sm leading-relaxed text-muted sm:text-base">
          Every list below is free to read, print or screenshot. Each one is
          written for a specific group, so you can pick questions that suit
          the room: clean lists for kids and family, office-safe lists for
          work, and spicier lists for friends and couples. When you are ready
          to play, tap the button on any list and the questions load one at a
          time on your phone, shuffled so nothing repeats.
        </p>
        {GROUPS.map((group) => {
          const lists = QUESTION_LISTS.filter((l) => l.game === group.game);
          if (lists.length === 0) return null;
          const core = corePageForGame(group.game);
          return (
            <section key={group.game} className="mt-10">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                {group.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {group.blurb}
                {core ? (
                  <>
                    {" "}
                    <Link
                      href={`/games/${core.slug}`}
                      className="font-bold text-accent hover:underline"
                    >
                      How to play {core.h1.replace(/ Questions$/, "")}
                    </Link>
                    .
                  </>
                ) : null}
              </p>
              <ul className="mt-4 grid gap-2">
                {lists.map((l, i) => (
                  <li
                    key={l.slug}
                    className="animate-fade-up [animation-fill-mode:both]"
                    style={{ animationDelay: `${120 + i * 40}ms` }}
                  >
                    <Link
                      href={`/questions/${l.slug}`}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-semibold text-foreground transition-[transform,border-color,box-shadow] duration-200 hover:translate-x-1 hover:border-accent hover:shadow-[0_10px_30px_-18px_var(--accent-glow)] sm:text-base"
                    >
                      {l.h1}
                      <span className="shrink-0 text-xs font-bold text-muted">
                        {questionCount(l)} questions
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        {KEYWORD_GROUPS.map((group) => {
          const pages = KEYWORD_PAGES.filter((p) => p.group === group.id);
          if (pages.length === 0) return null;
          return (
            <section key={group.id} className="mt-10">
              <h2 className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
                {group.heading}
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-muted">{group.blurb}</p>
              <ul className="mt-4 grid gap-2">
                {pages.map((p, i) => (
                  <li
                    key={p.path}
                    className="animate-fade-up [animation-fill-mode:both]"
                    style={{ animationDelay: `${120 + i * 40}ms` }}
                  >
                    <Link
                      href={p.path}
                      className="group flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-semibold text-foreground transition-[transform,border-color,box-shadow] duration-200 hover:translate-x-1 hover:border-accent hover:shadow-[0_10px_30px_-18px_var(--accent-glow)] sm:text-base"
                    >
                      <span>
                        {p.h1}
                        {p.adult ? <span className="ml-2 text-xs font-bold text-rose-400">18+</span> : null}
                      </span>
                      <span className="shrink-0 text-xs font-bold text-muted">
                        {itemCount(p)} {group.unit}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
