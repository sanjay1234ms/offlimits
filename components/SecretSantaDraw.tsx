"use client";

import { useState } from "react";
import { Eye, EyeOff, Gift, RotateCcw } from "lucide-react";
import { shuffle } from "@/lib/shuffle";

function parseNames(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((name) => {
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/** Shuffle, then everyone gives to the next person in the circle, so nobody
 * can ever draw themselves and the whole group forms one loop. */
function drawPairs(names: string[]): Record<string, string> {
  const order = shuffle(names);
  const pairs: Record<string, string> = {};
  order.forEach((giver, i) => {
    pairs[giver] = order[(i + 1) % order.length];
  });
  return pairs;
}

/** Pass-the-phone Secret Santa: type names, draw, then each person taps their
 * own name to privately see who they're buying for. Nothing leaves the phone. */
export function SecretSantaDraw() {
  const [raw, setRaw] = useState("");
  const [budget, setBudget] = useState("");
  const [pairs, setPairs] = useState<Record<string, string> | null>(null);
  const [seen, setSeen] = useState<string[]>([]);
  const [showing, setShowing] = useState<string | null>(null);

  const names = parseNames(raw);
  const canDraw = names.length >= 3;

  function draw() {
    setPairs(drawPairs(names));
    setSeen([]);
    setShowing(null);
  }

  function reset() {
    setPairs(null);
    setSeen([]);
    setShowing(null);
  }

  if (!pairs) {
    return (
      <div className="glass-card flex flex-col gap-4 p-5 sm:p-6">
        <label className="flex flex-col gap-2 text-sm font-bold text-foreground">
          Everyone taking part, one name per line
          <textarea
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            rows={8}
            spellCheck={false}
            placeholder={"Alex\nSam\nPriya\nJordan"}
            className="w-full resize-y rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-accent"
          />
        </label>
        <label className="flex flex-col gap-2 text-sm font-bold text-foreground">
          Gift budget (optional)
          <input
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            placeholder="e.g. $20"
            className="w-full rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm font-normal text-foreground outline-none focus:border-accent"
          />
        </label>
        <button
          type="button"
          onClick={draw}
          disabled={!canDraw}
          className="btn-primary w-full disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Gift className="h-4 w-4" aria-hidden />
          Draw names ({names.length})
        </button>
        {!canDraw ? (
          <p className="text-xs text-muted">Add at least three people to draw.</p>
        ) : null}
      </div>
    );
  }

  if (showing) {
    return (
      <div className="glass-card flex flex-col items-center gap-4 p-6 text-center sm:p-8">
        <p className="text-sm font-bold text-muted">{showing}, you&apos;re buying for</p>
        <p className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          {pairs[showing]}
        </p>
        {budget ? (
          <p className="text-sm text-muted">Budget: {budget}</p>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setSeen((s) => (s.includes(showing) ? s : [...s, showing]));
            setShowing(null);
          }}
          className="btn-primary mt-2 w-full sm:w-auto"
        >
          <EyeOff className="h-4 w-4" aria-hidden />
          Hide it and pass the phone
        </button>
      </div>
    );
  }

  const order = Object.keys(pairs).sort((a, b) => a.localeCompare(b));
  return (
    <div className="glass-card flex flex-col gap-4 p-5 sm:p-6">
      <p className="text-sm text-muted">
        Names are drawn. Pass the phone around: each person taps their own
        name to see who they&apos;re buying for, then hides it.{" "}
        <span className="font-bold text-foreground">
          {seen.length} of {order.length} have looked.
        </span>
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {order.map((name) => {
          const done = seen.includes(name);
          return (
            <button
              key={name}
              type="button"
              onClick={() => setShowing(name)}
              disabled={done}
              className={`inline-flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-bold transition-colors ${
                done
                  ? "border-white/5 bg-white/5 text-muted line-through"
                  : "border-accent/50 bg-white/5 text-foreground hover:border-accent"
              }`}
            >
              {done ? null : <Eye className="h-4 w-4" aria-hidden />}
              {name}
            </button>
          );
        })}
      </div>
      <button type="button" onClick={reset} className="btn-ghost w-full sm:w-auto">
        <RotateCcw className="h-4 w-4" aria-hidden />
        Start over
      </button>
    </div>
  );
}
