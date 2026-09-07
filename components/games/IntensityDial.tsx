"use client";

import { Flame } from "lucide-react";

interface IntensityDialProps {
  value: number;
  onChange: (level: number) => void;
}

/** Per-segment neon fill + ambient glow, ramping amber → fiery coral →
 * electric hot pink across the five levels. */
const SEGMENTS = [
  {
    fill: "from-amber-300 to-amber-500",
    glow: "shadow-[0_0_12px_1px_rgba(251,191,36,0.5)]",
  },
  {
    fill: "from-amber-400 to-orange-500",
    glow: "shadow-[0_0_12px_1px_rgba(249,115,22,0.5)]",
  },
  {
    fill: "from-orange-500 to-rose-500",
    glow: "shadow-[0_0_14px_2px_rgba(244,63,94,0.55)]",
  },
  {
    fill: "from-rose-500 to-rose-600",
    glow: "shadow-[0_0_14px_2px_rgba(244,63,94,0.6)]",
  },
  {
    fill: "from-pink-500 to-fuchsia-600",
    glow: "shadow-[0_0_18px_3px_rgba(232,121,249,0.65)]",
  },
];

/** The live "Spicy Meter", a slim neon 5-segment heat track. Changing it
 * re-filters the deck on the fly; it never restarts the game. */
export function IntensityDial({ value, onChange }: IntensityDialProps) {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between gap-2">
        <span className="text-[0.7rem] font-bold uppercase tracking-[0.2em] text-subtle">
          Spicy meter
        </span>
        <span className="inline-flex items-center gap-1 text-[0.7rem] font-extrabold uppercase tracking-[0.16em] text-rose-400">
          <Flame className="h-3 w-3" aria-hidden />
          Heat level: {value}
        </span>
      </div>

      <div
        className="mt-2.5 flex gap-1.5 rounded-full bg-white/[0.04] p-1"
        role="group"
        aria-label="Heat level"
      >
        {SEGMENTS.map((seg, i) => {
          const n = i + 1;
          const on = n <= value;
          const isTip = n === value;
          return (
            <button
              key={n}
              type="button"
              aria-pressed={isTip}
              aria-label={`Heat level ${n}`}
              onClick={() => onChange(n)}
              className="flex-1 rounded-full py-1 outline-none transition-transform duration-100 active:scale-95 focus-visible:opacity-80"
            >
              <span
                className={`block h-2.5 rounded-full bg-gradient-to-r transition-all duration-300 ${
                  on
                    ? `${seg.fill} ${seg.glow}`
                    : "from-white/[0.07] to-white/[0.07]"
                } ${isTip ? "ring-2 ring-white/50" : ""}`}
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
