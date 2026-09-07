"use client";

import { useEffect, useRef, useState } from "react";
import { Bomb } from "lucide-react";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";

const START = 10;

interface SpeedBombProps {
  /** Restarts the countdown whenever this changes (i.e. a new card). */
  runKey: string | number;
  /** Fired once when the timer hits zero. */
  onExpire?: () => void;
}

/** "Hot Potato", a 10-second bar that ramps green → yellow → pulsing red with
 * an escalating tick and a buzzer at zero. Answer before it blows. */
export function SpeedBomb({ runKey, onExpire }: SpeedBombProps) {
  const [secs, setSecs] = useState(START);
  const [done, setDone] = useState(false);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  // New card → reset.
  useEffect(() => {
    setSecs(START);
    setDone(false);
  }, [runKey]);

  useEffect(() => {
    if (done) return;
    if (secs <= 0) {
      setDone(true);
      sfx.buzzer();
      haptic(HAPTIC.buzzer);
      expireRef.current?.();
      return;
    }
    const elapsed = START - secs;
    sfx.tick(elapsed >= 7 ? 2 : elapsed >= 4 ? 1 : 0);
    const id = window.setTimeout(() => setSecs((s) => s - 1), 1000);
    return () => window.clearTimeout(id);
  }, [secs, done]);

  const pct = Math.max(0, (secs / START) * 100);
  const zone =
    secs > 6
      ? "bg-emerald-500"
      : secs > 3
        ? "bg-amber-400"
        : "bg-red-500 animate-pulse";

  return (
    <div className="w-full">
      <div className="flex items-center justify-between text-[0.7rem] font-bold uppercase tracking-wider">
        <span className="inline-flex items-center gap-1 text-subtle">
          <Bomb className="h-3.5 w-3.5" aria-hidden />
          {done ? "Time!" : "Speed bomb"}
        </span>
        <span className={done ? "text-red-500" : "text-muted"}>
          {done ? "💥" : `${secs}s`}
        </span>
      </div>
      <div className="mt-1 h-2.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className={`h-full rounded-full transition-[width] duration-1000 ease-linear ${zone}`}
          style={{ width: `${done ? 100 : pct}%` }}
        />
      </div>
    </div>
  );
}
