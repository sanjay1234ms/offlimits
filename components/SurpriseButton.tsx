"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Shuffle } from "lucide-react";
import { CATALOG, type CatalogGame } from "@/data/catalog";
import { track } from "@/lib/analytics";
import { confettiBurst } from "@/lib/confetti";

const GAMES = CATALOG.filter((g) => !g.adult);

/** Spin delays, in ms: a slot-machine roll that slows to a stop. */
const ROLL = [60, 60, 60, 70, 80, 90, 110, 130, 160, 200, 260];

/** Jumps straight into a random (clean) game, after a quick slot-machine
 * roll through the game names and a burst of confetti. */
export function SurpriseButton({ className = "" }: { className?: string }) {
  const router = useRouter();
  const [rolling, setRolling] = useState<CatalogGame | null>(null);
  const timer = useRef<number>();
  const button = useRef<HTMLButtonElement>(null);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function go() {
    if (rolling) return;
    const pick = GAMES[Math.floor(Math.random() * GAMES.length)];
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    function land() {
      setRolling(pick);
      const r = button.current?.getBoundingClientRect();
      if (r) confettiBurst(r.left + r.width / 2, r.top + r.height / 2);
      track("surprise_me", { game: pick.slug });
      timer.current = window.setTimeout(() => router.push(pick.href), 350);
    }

    if (reduced) return land();

    let step = 0;
    function tick() {
      if (step >= ROLL.length) return land();
      setRolling(GAMES[(step * 7 + pick.title.length) % GAMES.length]);
      timer.current = window.setTimeout(tick, ROLL[step++]);
    }
    tick();
  }

  return (
    <button
      ref={button}
      type="button"
      onClick={go}
      aria-busy={rolling ? true : undefined}
      className={`group ${className}`}
    >
      <Shuffle
        className={`h-5 w-5 shrink-0 transition-transform duration-500 group-hover:rotate-180 ${
          rolling ? "animate-spin" : ""
        }`}
        aria-hidden
      />
      <span className="inline-block min-w-[7.5rem] truncate">
        {rolling ? `${rolling.emoji} ${rolling.title}` : "Surprise me"}
      </span>
    </button>
  );
}
