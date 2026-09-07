"use client";

import { useCallback, useMemo, useState } from "react";
import { Crown, RefreshCw } from "lucide-react";
import { useCompetitiveGame } from "@/hooks/useCompetitiveGame";
import { PlayerSetup } from "./PlayerSetup";
import { ScoreboardBar } from "./ScoreboardBar";
import { PodiumModal } from "./PodiumModal";
import { ScoreContext } from "./ScoreContext";

interface ScoreTrayProps {
  gameTitle: string;
  /** Identifies the game session, scores start at 0 on every fresh mount. */
  gameSlug: string;
  /** Rendered between the scoreboard and the Finish button. */
  children?: React.ReactNode;
}

/** Self-contained competitive layer: inline setup → sticky scoreboard →
 * Finish & Crown Winner → podium + share card. Drop it above any game. */
export function ScoreTray({ gameTitle, gameSlug, children }: ScoreTrayProps) {
  const board = useCompetitiveGame(gameSlug);
  const [podiumOpen, setPodiumOpen] = useState(false);

  const { adjust, syncCount } = board;
  const award = useCallback((id: string) => adjust(id, 1), [adjust]);
  const scoreValue = useMemo(
    () => ({ players: board.players, award, syncCount }),
    [board.players, award, syncCount],
  );

  if (!board.hydrated) return <>{children}</>;

  return (
    <div className="flex flex-col gap-4">
      {board.started ? (
        <ScoreboardBar board={board} />
      ) : (
        <PlayerSetup
          onAddNames={board.addNames}
          onSeedCount={board.syncCount}
        />
      )}

      <ScoreContext.Provider value={scoreValue}>
        {children}
      </ScoreContext.Provider>

      {board.started ? (
        <div className="flex flex-col gap-2 pt-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setPodiumOpen(true)}
            className="btn-primary w-full py-3 sm:w-auto sm:min-w-[16rem]"
          >
            <Crown className="h-4 w-4" aria-hidden />
            Finish &amp; Crown Winner
          </button>
          <button
            type="button"
            onClick={board.resetScores}
            className="btn-ghost w-full sm:w-auto"
          >
            <RefreshCw className="h-4 w-4" aria-hidden />
            Reset scores
          </button>
        </div>
      ) : null}

      <PodiumModal
        open={podiumOpen}
        onClose={() => setPodiumOpen(false)}
        players={board.players}
        gameTitle={gameTitle}
      />
    </div>
  );
}
