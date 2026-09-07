"use client";

import { useEffect, useState } from "react";
import { Flag, Share2 } from "lucide-react";
import { ForfeitOverlay } from "./ForfeitOverlay";
import { ShareCardModal } from "./ShareCardModal";
import { SpeedBomb } from "./SpeedBomb";

interface CardExtrasProps {
  /** The prompt text on the active card. */
  promptText: string;
  /** Human game name, e.g. "Most Likely To" or "18+ Uncensored". */
  gameLabel: string;
  /** Playful stamp for the share card. */
  badge?: string;
  adult?: boolean;
  /** Changes per card, resets the speed bomb. */
  cardKey: string | number;
  /** Show the 10-second Hot Potato countdown above the buttons. */
  speedBomb?: boolean;
}

/** The per-card action strip: Bail Out spinner, Share card, and (optionally)
 * the Speed Bomb timer. Shared by every deck. */
export function CardExtras({
  promptText,
  gameLabel,
  badge,
  adult,
  cardKey,
  speedBomb,
}: CardExtrasProps) {
  const [forfeitOpen, setForfeitOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  // A fresh card cancels any lingering "time's up" forfeit prompt.
  useEffect(() => {
    setForfeitOpen(false);
  }, [cardKey]);

  return (
    <div className="w-full">
      {speedBomb ? (
        <div className="mb-3">
          <SpeedBomb runKey={cardKey} onExpire={() => setForfeitOpen(true)} />
        </div>
      ) : null}

      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => setForfeitOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-rose-500/50 bg-rose-500/10 px-3.5 py-1.5 text-xs font-extrabold text-rose-300 transition-transform duration-150 hover:-translate-y-0.5 hover:bg-rose-500/20 active:scale-95"
        >
          <Flag className="h-3.5 w-3.5" aria-hidden />
          Bail out
        </button>
        <button
          type="button"
          onClick={() => setShareOpen(true)}
          className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-extrabold text-muted transition-transform duration-150 hover:-translate-y-0.5 hover:text-foreground active:scale-95"
        >
          <Share2 className="h-3.5 w-3.5" aria-hidden />
          Share
        </button>
      </div>

      <ForfeitOverlay
        open={forfeitOpen}
        onClose={() => setForfeitOpen(false)}
      />
      <ShareCardModal
        open={shareOpen}
        onClose={() => setShareOpen(false)}
        prompt={promptText}
        gameLabel={gameLabel}
        badge={badge}
        adult={adult}
      />
    </div>
  );
}
