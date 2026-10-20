import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { GameBrowser } from "@/components";

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
      <div className="mx-auto max-w-content px-4 pt-10 sm:px-6">
        <GameBrowser />
      </div>
    </div>
  );
}
