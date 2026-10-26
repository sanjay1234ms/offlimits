"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Printer, Shuffle } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track } from "@/lib/analytics";

/** Seeded shuffle so a card can be re-created from its number. */
function seeded(seed: number) {
  let s = seed % 2147483647 || 1;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

const LINES: number[][] = [
  ...[0, 1, 2, 3, 4].map((r) => [0, 1, 2, 3, 4].map((c) => r * 5 + c)),
  ...[0, 1, 2, 3, 4].map((c) => [0, 1, 2, 3, 4].map((r) => r * 5 + c)),
  [0, 6, 12, 18, 24],
  [4, 8, 12, 16, 20],
];

/** A 5x5 bingo card with a free centre square. Each guest gets their own
 * random card (shareable by number), taps squares as things happen, and the
 * card shouts BINGO on any full line. */
export function BingoCard({ words, title, slug, free = "FREE 💍" }: { words: string[]; title: string; slug: string; free?: string }) {
  const [seed, setSeed] = useState(0);
  const [marked, setMarked] = useState<number[]>([12]);
  const [bingo, setBingo] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 9000) + 1000);
  }, []);

  const cells = useMemo(() => {
    if (!seed) return [];
    const r = seeded(seed);
    const pool = [...words];
    for (let i = pool.length - 1; i > 0; i--) {
      const j = Math.floor(r() * (i + 1));
      [pool[i], pool[j]] = [pool[j], pool[i]];
    }
    const out = pool.slice(0, 24);
    out.splice(12, 0, free);
    return out;
  }, [seed, words, free]);

  function tap(k: number) {
    if (k === 12) return;
    const next = marked.includes(k) ? marked.filter((x) => x !== k) : [...marked, k];
    setMarked(next);
    sfx.tick(0);
    haptic(HAPTIC.advance);
    const has = LINES.some((l) => l.every((x) => next.includes(x)));
    if (has && !bingo) {
      setBingo(true);
      sfx.win();
      const r = cardRef.current?.getBoundingClientRect();
      if (r) confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 90);
      track("bingo", { game: slug });
    } else if (!has) setBingo(false);
  }

  const winLine = LINES.find((l) => l.every((x) => marked.includes(x)));

  return (
    <div className="flex flex-col gap-3">
      <style>{`@media print { body * { visibility: hidden !important; } #bingo-print, #bingo-print * { visibility: visible !important; } #bingo-print { position: absolute; inset: 0 auto auto 0; width: 100%; } }`}</style>
      <div id="bingo-print" ref={cardRef} className="mx-auto w-full max-w-md rounded-[2rem] bg-gradient-to-br from-rose-200 via-pink-100 to-amber-100 p-4 shadow-2xl sm:p-5">
        <div className="mb-3 flex items-end justify-between">
          <p className="text-xl font-black text-slate-900">{title}</p>
          <p className="text-xs font-bold text-slate-600">Card #{seed}</p>
        </div>
        <div className="grid grid-cols-5 gap-1.5">
          {"BINGO".split("").map((l) => (
            <span key={l} className="text-center text-lg font-black text-rose-600">
              {l}
            </span>
          ))}
          {cells.map((w, k) => {
            const on = marked.includes(k);
            const win = winLine?.includes(k);
            return (
              <button
                key={k}
                type="button"
                onClick={() => tap(k)}
                className={`flex aspect-square items-center justify-center rounded-xl p-1 text-center text-[10px] font-bold leading-tight transition-all sm:text-xs ${
                  k === 12
                    ? "bg-rose-500 text-white"
                    : on
                      ? `${win ? "bg-amber-400" : "bg-rose-400"} scale-95 text-white shadow-inner`
                      : "bg-white text-slate-800 hover:bg-rose-50"
                }`}
              >
                {w}
              </button>
            );
          })}
        </div>
      </div>
      {bingo ? <p className="text-center text-4xl font-black text-rose-400 motion-safe:animate-pop-in">BINGO! 🎉</p> : null}
      <div className="flex justify-center gap-2">
        <button
          type="button"
          onClick={() => {
            setSeed(Math.floor(Math.random() * 9000) + 1000);
            setMarked([12]);
            setBingo(false);
          }}
          className="btn-ghost px-4 py-2 text-sm"
        >
          <Shuffle className="h-4 w-4" aria-hidden />
          New card
        </button>
        <button type="button" onClick={() => window.print()} className="btn-ghost px-4 py-2 text-sm">
          <Printer className="h-4 w-4" aria-hidden />
          Print
        </button>
      </div>
      <p className="text-center text-xs text-muted">Every guest opens this page for their own card. Mark squares as they happen during gift opening.</p>
    </div>
  );
}
