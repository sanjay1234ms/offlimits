"use client";

import { useEffect, useRef, useState } from "react";
import { Play, RotateCcw } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track } from "@/lib/analytics";
import { shuffle } from "@/lib/shuffle";

/** Hot potato: pass the phone while it ticks faster and faster; whoever is
 * holding it when it goes off answers a prompt. */
export function HotPotato({
  emoji,
  itemName,
  boom,
  prompts,
  gradient = "from-amber-400 via-orange-500 to-rose-500",
  slug,
}: {
  emoji: string;
  itemName: string;
  boom: string;
  prompts: string[];
  gradient?: string;
  slug: string;
}) {
  const [phase, setPhase] = useState<"idle" | "ticking" | "boom">("idle");
  const [deck, setDeck] = useState<string[]>([]);
  const [i, setI] = useState(0);
  const [heat, setHeat] = useState(0);
  const timers = useRef<number[]>([]);
  const stage = useRef<HTMLDivElement>(null);

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), []);

  function start() {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    if (!deck.length) setDeck(shuffle(prompts));
    setPhase("ticking");
    setHeat(0);
    const total = 12000 + Math.random() * 23000;
    const began = performance.now();
    const tick = () => {
      const elapsed = performance.now() - began;
      const p = Math.min(1, elapsed / total);
      setHeat(p);
      if (p >= 1) {
        setPhase("boom");
        sfx.buzzer();
        haptic(HAPTIC.buzzer);
        const r = stage.current?.getBoundingClientRect();
        if (r) confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 60);
        track("hot_potato_boom", { game: slug });
        return;
      }
      sfx.tick(p > 0.7 ? 2 : p > 0.4 ? 1 : 0);
      if (p > 0.6) haptic(15);
      // Ticks speed up from ~900ms to ~140ms as the timer runs down.
      timers.current.push(window.setTimeout(tick, 900 - 760 * p));
    };
    tick();
    track("hot_potato_start", { game: slug });
  }

  function again() {
    setI((n) => n + 1);
    start();
  }

  const shake = phase === "ticking" ? 2 + heat * 10 : 0;

  return (
    <div ref={stage} className={`relative overflow-hidden rounded-[2rem] bg-gradient-to-br p-6 text-center text-white shadow-xl sm:p-8 ${gradient}`}>
      <style>{`@keyframes hp-shake{0%,100%{transform:translate(0,0) rotate(0)}25%{transform:translate(calc(var(--s)*-1px),calc(var(--s)*.5px)) rotate(calc(var(--s)*-1deg))}75%{transform:translate(calc(var(--s)*1px),calc(var(--s)*-.5px)) rotate(calc(var(--s)*1deg))}}`}</style>
      {phase === "boom" ? (
        <div className="flex flex-col items-center gap-3 motion-safe:animate-pop-in">
          <p className="text-6xl font-black tracking-tight drop-shadow-[0_4px_0_rgba(0,0,0,0.25)] sm:text-7xl">{boom}</p>
          <p className="text-sm font-bold text-white/85">Whoever&apos;s holding the phone:</p>
          <p className="max-w-md text-balance text-xl font-black sm:text-2xl">{deck[i % Math.max(1, deck.length)]}</p>
          <button type="button" onClick={again} className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-black text-slate-900 shadow-lg transition-transform hover:scale-105 active:scale-95">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Pass it again
          </button>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <span
            aria-hidden
            className="select-none text-[7rem] leading-none drop-shadow-[0_10px_0_rgba(0,0,0,0.15)] motion-reduce:animate-none"
            style={phase === "ticking" ? ({ animation: `hp-shake ${0.5 - heat * 0.38}s infinite`, ["--s" as string]: shake } as React.CSSProperties) : undefined}
          >
            {emoji}
          </span>
          {phase === "ticking" ? (
            <>
              <p className="text-2xl font-black">Pass it! Pass it!</p>
              <div className="h-2 w-48 overflow-hidden rounded-full bg-white/25">
                <div className="h-full rounded-full bg-white/90" style={{ width: `${30 + heat * 70}%`, filter: `blur(${heat * 1.5}px)` }} />
              </div>
              <p className="text-xs font-bold text-white/80">It&apos;s getting hotter… nobody knows when it goes off.</p>
            </>
          ) : (
            <>
              <p className="text-2xl font-black">Pass the {itemName}</p>
              <p className="max-w-sm text-sm font-medium text-white/85">
                Hit start and pass the phone around the circle. When it goes off, whoever&apos;s holding it answers the question.
              </p>
              <button type="button" onClick={start} className="inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-lg font-black text-slate-900 shadow-lg transition-transform hover:scale-105 active:scale-95">
                <Play className="h-5 w-5" aria-hidden />
                Start
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
