"use client";

import { useMemo, useRef, useState } from "react";
import { RotateCcw } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { shuffle } from "@/lib/shuffle";

export interface PriceItem {
  name: string;
  emoji: string;
  /** Typical US store price in dollars. */
  price: number;
}

/** "The Price Is Right": guess what baby gear costs. Closest without going
 * over earns a bonus, just like the show. */
export function PriceGuess({ items, rounds = 8 }: { items: PriceItem[]; rounds?: number }) {
  const [deck, setDeck] = useState<PriceItem[]>(() => items.slice(0, rounds));
  const [i, setI] = useState(0);
  const [guess, setGuess] = useState("");
  const [shown, setShown] = useState(false);
  const [score, setScore] = useState(0);
  const [log, setLog] = useState<number[]>([]);
  const box = useRef<HTMLDivElement>(null);

  const item = deck[i];
  const g = Number(guess);
  const points = useMemo(() => {
    if (!shown || !item || !Number.isFinite(g) || g <= 0) return 0;
    const off = Math.abs(g - item.price) / item.price;
    const base = Math.max(0, Math.round(100 - off * 100));
    return base + (g <= item.price && off <= 0.1 ? 50 : 0);
  }, [shown, item, g]);

  function reveal() {
    if (!guess) return;
    setShown(true);
    const off = Math.abs(g - item.price) / item.price;
    const pts = Math.max(0, Math.round(100 - off * 100)) + (g <= item.price && off <= 0.1 ? 50 : 0);
    setScore((s) => s + pts);
    setLog((l) => [...l, pts]);
    if (pts >= 90) {
      sfx.win();
      const r = box.current?.getBoundingClientRect();
      if (r) confettiBurst(r.left + r.width / 2, r.top + 60, 40);
    } else sfx.flip();
  }

  function next() {
    setI((n) => n + 1);
    setGuess("");
    setShown(false);
  }

  function restart() {
    setDeck(shuffle(items).slice(0, rounds));
    setI(0);
    setScore(0);
    setLog([]);
    setGuess("");
    setShown(false);
  }

  if (!item) {
    return (
      <div className="glass-card flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-5xl" aria-hidden>
          🏆
        </p>
        <p className="text-2xl font-black text-foreground">{score} points</p>
        <p className="text-sm text-muted">{score > rounds * 100 ? "Bargain-hunting legend." : score > rounds * 60 ? "Ready for parenthood." : "Babies are expensive, huh?"}</p>
        <button type="button" onClick={restart} className="btn-primary">
          <RotateCcw className="h-4 w-4" aria-hidden />
          Play again
        </button>
      </div>
    );
  }

  return (
    <div ref={box} className="flex flex-col gap-3">
      <div className="flex items-center justify-between text-sm font-bold text-muted">
        <span>
          Item {i + 1} of {deck.length}
        </span>
        <span className="text-foreground">{score} pts</span>
      </div>
      <div className="rounded-[2rem] bg-gradient-to-br from-sky-200 via-indigo-100 to-pink-100 p-6 text-center shadow-xl">
        <p className="text-7xl" aria-hidden>
          {item.emoji}
        </p>
        <p className="mt-2 text-xl font-black text-slate-900">{item.name}</p>
        {shown ? (
          <div className="mt-3 motion-safe:animate-pop-in">
            <p className="text-4xl font-black text-emerald-600">${item.price.toFixed(2)}</p>
            <p className="text-sm font-bold text-slate-700">
              You said ${g.toFixed(2)} · <span className="text-pink-600">+{points} pts</span>
              {g <= item.price && Math.abs(g - item.price) / item.price <= 0.1 ? " (no-overbid bonus!)" : ""}
            </p>
          </div>
        ) : (
          <p className="mt-2 text-sm font-semibold text-slate-600">Typical store price? Closest without going over wins a bonus.</p>
        )}
      </div>
      {shown ? (
        <button type="button" onClick={next} className="btn-primary py-3">
          Next item
        </button>
      ) : (
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            reveal();
          }}
        >
          <span className="grid place-items-center rounded-xl bg-white/5 px-3 font-black text-muted">$</span>
          <input
            inputMode="decimal"
            value={guess}
            onChange={(e) => setGuess(e.target.value.replace(/[^\d.]/g, ""))}
            placeholder="Your guess"
            className="min-w-0 flex-1 rounded-xl border-2 border-border bg-background/60 px-3 py-3 text-lg font-bold text-foreground outline-none focus:border-accent"
          />
          <button type="submit" className="btn-primary px-5">
            Reveal
          </button>
        </form>
      )}
      <div className="flex gap-1" aria-hidden>
        {deck.map((_, k) => (
          <span key={k} className={`h-1.5 flex-1 rounded-full ${k < log.length ? (log[k] >= 90 ? "bg-emerald-400" : log[k] >= 50 ? "bg-amber-400" : "bg-rose-400") : "bg-white/10"}`} />
        ))}
      </div>
      <p className="text-center text-xs text-muted">Prices are typical US store prices and vary by brand and store.</p>
    </div>
  );
}
