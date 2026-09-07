"use client";

import { Bomb } from "lucide-react";
import {
  heatEmoji,
  heatTierLabel,
  type HeatCategory,
} from "@/lib/intensity";
import { IntensityDial } from "./IntensityDial";

interface GameControlBarProps {
  intensity: number;
  onIntensity: (level: number) => void;
  /** Drives the tier copy: office / couples / general / adult. */
  heatCategory: HeatCategory;
  /** Only Most Likely To and This or That get the Hot Potato timer. */
  showSpeedBomb: boolean;
  speedBomb: boolean;
  onSpeedBomb: (on: boolean) => void;
  /** Card count at the current heat, for the hint line. */
  matchCount?: number;
}

/** The game control bar above the deck: the live Spicy Meter plus the
 * optional Speed Bomb toggle. */
export function GameControlBar({
  intensity,
  onIntensity,
  heatCategory,
  showSpeedBomb,
  speedBomb,
  onSpeedBomb,
  matchCount,
}: GameControlBarProps) {
  return (
    <div className="glass-card w-full px-4 py-3.5 sm:px-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
        <div className="min-w-0 flex-1">
          <IntensityDial value={intensity} onChange={onIntensity} />
          <p className="mt-2 truncate text-xs font-semibold text-muted">
            <span aria-hidden>{heatEmoji(intensity)}</span>{" "}
            {heatTierLabel(heatCategory, intensity)}
            {typeof matchCount === "number" ? (
              <span className="text-subtle"> · {matchCount} cards in play</span>
            ) : null}
          </p>
        </div>

        {showSpeedBomb ? (
          <div className="sm:w-40 sm:shrink-0 sm:border-l sm:border-white/10 sm:pl-6">
            <span className="text-[0.7rem] font-bold uppercase tracking-wider text-subtle">
              Hot potato
            </span>
            <button
              type="button"
              aria-pressed={speedBomb}
              onClick={() => onSpeedBomb(!speedBomb)}
              className={`mt-1.5 inline-flex w-full items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-1.5 text-sm font-extrabold transition-transform duration-100 active:scale-95 ${
                speedBomb
                  ? "border-transparent bg-gradient-to-r from-rose-600 to-red-600 text-white shadow-[0_0_18px_rgba(239,68,68,0.55)]"
                  : "border-white/15 bg-white/5 text-muted hover:border-red-400/50 hover:text-foreground"
              }`}
            >
              <Bomb className="h-4 w-4" aria-hidden />
              {speedBomb ? "10s timer on" : "10s timer off"}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
