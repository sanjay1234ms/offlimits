import type { Metadata } from "next";
import { GameBrowser } from "@/components";

export const metadata: Metadata = {
  title: "Choose a game",
  description:
    "Tell us the group size, who's playing, and the vibe, OffLimits narrows the catalog down to the right game.",
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
