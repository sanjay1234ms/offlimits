import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import Link from "next/link";
import { questionCount } from "@/components/QuestionListPage";
import { QUESTION_LISTS } from "@/data/questionLists";
import { PageHero } from "@/components/PageHero";

const TITLE =
  "Party Game Questions: Would You Rather, Never Have I Ever & More";
const DESCRIPTION =
  "Free lists of Would You Rather, Never Have I Ever, Most Likely To, This or That and Truth or Dare questions for friends, couples, kids and work. Read or play.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/questions" },
  ...shareMetadata(TITLE, DESCRIPTION, "/questions"),
};

export default function QuestionsIndexPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
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
        <ul className="mt-8 grid gap-2">
          {QUESTION_LISTS.map((l, i) => (
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
      </div>
    </div>
  );
}
