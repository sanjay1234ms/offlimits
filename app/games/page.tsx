import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { GameBrowser } from "@/components";
import { PageHero } from "@/components/PageHero";

const TITLE = "All Party Games: Find the Right Game for Your Group";
const DESCRIPTION =
  "Browse every free OffLimits party game and filter by group size, who's playing and the vibe to find the right one: trivia, charades, imposter games and more.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/games" },
  ...shareMetadata(TITLE, DESCRIPTION, "/games"),
};

export default function GamesPage() {
  return (
    <div className="min-h-dvh bg-background pb-24">
      <PageHero
        title="What kind of game do you need?"
        eyebrow="🎲 All games"
        emojis={["🎲", "🏆", "🎭"]}
      >
        <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
          Tell us the group and we&apos;ll narrow it down. Tap a filter again to
          remove it.
        </p>
      </PageHero>
      <div className="mx-auto max-w-content px-4 sm:px-6">
        <GameBrowser />
      </div>
    </div>
  );
}
