import type { Metadata } from "next";
import Link from "next/link";
import { shareMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/JsonLd";
import { DailyStrip } from "@/components/daily/DailyStrip";
import { breadcrumbJsonLd, itemListJsonLd } from "@/lib/site";
import { DAILY_GAMES } from "@/data/daily/puzzles";

const TITLE = "Daily Puzzles: Word, Map and Number Games";
const DESCRIPTION =
  "Three free daily puzzles: Word Heist (five-letter word), Off the Map (geography pins) and Close Call (number guessing). New puzzles at midnight, streaks and leaderboards.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/daily" },
  ...shareMetadata(TITLE, DESCRIPTION, "/daily"),
};

export default function DailyPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <JsonLd
        data={[
          breadcrumbJsonLd([{ name: "Daily puzzles", path: "/daily" }]),
          itemListJsonLd({ name: "OffLimits daily puzzles", path: "/daily", items: DAILY_GAMES.map((g) => g.name) }),
        ]}
      />
      <PageHero title="Daily puzzles" eyebrow="📅 New every midnight" emojis={["🔐", "📍", "🎯"]}>
        <p className="mt-3 max-w-2xl text-pretty text-base text-muted sm:text-lg">
          Three quick puzzles a day, the same for everyone. Keep your streak going, share your score in the group chat and
          see where you land on today&apos;s table.
        </p>
      </PageHero>
      <div className="mx-auto mt-6 max-w-content px-4 sm:px-6">
        <DailyStrip showHeading={false} />
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {DAILY_GAMES.map((g) => (
            <Link
              key={g.id}
              href={g.href}
              className="rounded-2xl border border-[color:var(--border)] bg-[color:var(--surface)] p-5 transition-transform hover:-translate-y-0.5"
            >
              <p className="text-3xl" aria-hidden>
                {g.emoji}
              </p>
              <h2 className="mt-2 text-xl font-black text-foreground">{g.name}</h2>
              <p className="mt-1 text-sm text-muted">{g.tagline}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-wider text-subtle">
                {g.genre} · about {g.minutes} min
              </p>
            </Link>
          ))}
        </div>
        <p className="mx-auto mt-10 max-w-2xl text-center text-sm text-muted">
          Missed a day? Each puzzle keeps the last seven days open as practice. Finished early? Every game has unlimited
          bonus rounds.
        </p>
      </div>
    </div>
  );
}
