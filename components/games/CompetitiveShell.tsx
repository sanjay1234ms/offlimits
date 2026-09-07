"use client";

import { Trophy } from "lucide-react";
import { COMPETITIVE_TAGLINE } from "@/data/competitive";
import { ScoreTray } from "./ScoreTray";

interface CompetitiveShellProps {
  gameTitle: string;
  /** Identifies the game session, scores start at 0 on every fresh mount. */
  gameSlug: string;
  children: React.ReactNode;
}

/** Wraps an engine game with the competitive layer: heat-of-battle badge,
 * inline player setup, sticky scoreboard, and the Finish & Crown podium. */
export function CompetitiveShell({
  gameTitle,
  gameSlug,
  children,
}: CompetitiveShellProps) {
  return (
    <div className="flex flex-col gap-4">
      <span className="inline-flex w-fit items-center gap-1.5 rounded-full border-2 border-amber-400/50 bg-amber-500/10 px-3 py-1 text-xs font-extrabold text-amber-300">
        <Trophy className="h-3.5 w-3.5" aria-hidden />
        {COMPETITIVE_TAGLINE}
      </span>
      <ScoreTray gameTitle={gameTitle} gameSlug={gameSlug}>
        {children}
      </ScoreTray>
    </div>
  );
}
