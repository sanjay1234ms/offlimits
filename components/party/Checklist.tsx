"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Check, RotateCcw } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";

export interface HuntItem {
  text: string;
  points: number;
}

const TIERS = [
  { at: 0, label: "Getting started", emoji: "🌱" },
  { at: 0.25, label: "Bronze", emoji: "🥉" },
  { at: 0.5, label: "Silver", emoji: "🥈" },
  { at: 0.75, label: "Gold", emoji: "🥇" },
  { at: 1, label: "Legend", emoji: "👑" },
];

/** A tap-to-tick scavenger hunt with points, tiers and a saved state. */
export function Checklist({ items, title, storageKey, gradient = "from-pink-500 to-rose-500" }: { items: HuntItem[]; title: string; storageKey: string; gradient?: string }) {
  const [done, setDone] = useState<number[]>([]);
  const ring = useRef<HTMLDivElement>(null);
  const total = useMemo(() => items.reduce((s, i) => s + i.points, 0), [items]);
  const score = done.reduce((s, k) => s + (items[k]?.points ?? 0), 0);
  const pct = total ? score / total : 0;
  const tier = [...TIERS].reverse().find((t) => pct >= t.at) ?? TIERS[0];

  useEffect(() => {
    try {
      setDone(JSON.parse(localStorage.getItem(storageKey) ?? "[]"));
    } catch {
      /* ignore */
    }
  }, [storageKey]);

  function toggle(k: number) {
    const was = done.includes(k);
    const next = was ? done.filter((x) => x !== k) : [...done, k];
    setDone(next);
    try {
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      /* ignore */
    }
    if (!was) {
      sfx.tick(1);
      haptic(HAPTIC.advance);
      const before = TIERS.filter((t) => score / total >= t.at).length;
      const after = TIERS.filter((t) => (score + items[k].points) / total >= t.at).length;
      if (after > before) {
        sfx.win();
        const r = ring.current?.getBoundingClientRect();
        if (r) confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 50);
      }
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div ref={ring} className={`flex items-center gap-4 rounded-[2rem] bg-gradient-to-br p-5 text-white shadow-xl ${gradient}`}>
        <div className="grid h-20 w-20 shrink-0 place-items-center rounded-full bg-white/20 text-4xl ring-4 ring-white/40" key={tier.label}>
          <span className="motion-safe:animate-pop-in">{tier.emoji}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-xs font-black uppercase tracking-[0.15em] text-white/80">{title}</p>
          <p className="text-3xl font-black tabular-nums">
            {score}
            <span className="text-base font-bold text-white/75"> / {total} pts</span>
          </p>
          <div className="mt-1.5 h-2.5 overflow-hidden rounded-full bg-white/25">
            <div className="h-full rounded-full bg-white transition-[width] duration-500" style={{ width: `${pct * 100}%` }} />
          </div>
          <p className="mt-1 text-xs font-bold text-white/90">{tier.label} tier</p>
        </div>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2">
        {items.map((it, k) => {
          const on = done.includes(k);
          return (
            <li key={k}>
              <button
                type="button"
                onClick={() => toggle(k)}
                aria-pressed={on}
                className={`flex w-full items-start gap-3 rounded-2xl p-3 text-left ring-2 transition-all active:scale-[0.98] ${
                  on ? "bg-emerald-400/15 ring-emerald-400" : "bg-white/5 ring-border hover:ring-pink-400"
                }`}
              >
                <span className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all ${on ? "scale-110 bg-emerald-400 text-slate-900" : "bg-white/10 text-transparent"}`}>
                  <Check className="h-4 w-4" />
                </span>
                <span className={`flex-1 text-sm font-semibold ${on ? "text-muted line-through" : "text-foreground"}`}>{it.text}</span>
                <span className="shrink-0 rounded-full bg-amber-400/20 px-2 py-0.5 text-xs font-black text-amber-400">+{it.points}</span>
              </button>
            </li>
          );
        })}
      </ul>
      {done.length ? (
        <button
          type="button"
          onClick={() => {
            setDone([]);
            try {
              localStorage.removeItem(storageKey);
            } catch {
              /* ignore */
            }
          }}
          className="btn-ghost self-center px-4 py-2 text-xs"
        >
          <RotateCcw className="h-3.5 w-3.5" aria-hidden />
          Reset the hunt
        </button>
      ) : null}
    </div>
  );
}
