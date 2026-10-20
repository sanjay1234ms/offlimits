import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import Link from "next/link";
import { questionCount } from "@/components/QuestionListPage";
import { QUESTION_LISTS } from "@/data/questionLists";

const TITLE = "Party Game Questions: Would You Rather, Never Have I Ever & More";
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
      <div className="mx-auto max-w-2xl px-4 pt-12 sm:px-6 sm:pt-16">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Party game questions
        </h1>
        <p className="mt-4 text-base text-muted sm:text-lg">
          Ready-made lists you can read out loud or play one at a time on your
          phone. All free, no signup.
        </p>
        <ul className="mt-8 grid gap-2">
          {QUESTION_LISTS.map((l) => (
            <li key={l.slug}>
              <Link
                href={`/questions/${l.slug}`}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-surface/60 px-4 py-3 text-sm font-semibold text-foreground transition-colors hover:border-accent sm:text-base"
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
