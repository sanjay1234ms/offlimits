"use client";

import { useRef, useState } from "react";
import { EyeOff, Heart, RotateCcw } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track } from "@/lib/analytics";
import { shuffle } from "@/lib/shuffle";

export interface CoupleQ {
  q: string;
  /** Two options. Use "{a}" / "{b}" to put the partners' names in. */
  options: [string, string];
}

type Phase = "names" | "passA" | "a" | "passB" | "b" | "reveal" | "final";

/** Both partners answer each question in secret on one phone, then reveal
 * whether they matched. Ends with a match percentage. */
export function CouplesQuiz({ questions, rounds = 10, slug }: { questions: CoupleQ[]; rounds?: number; slug: string }) {
  const [names, setNames] = useState<[string, string]>(["", ""]);
  const [phase, setPhase] = useState<Phase>("names");
  const [deck, setDeck] = useState<CoupleQ[]>([]);
  const [i, setI] = useState(0);
  const [a, setA] = useState<number | null>(null);
  const [matches, setMatches] = useState<boolean[]>([]);
  const stage = useRef<HTMLDivElement>(null);
  const [na, nb] = names.map((n) => n.trim() || "") as [string, string];

  const fill = (s: string) => s.replace(/\{a\}/g, na || "Partner 1").replace(/\{b\}/g, nb || "Partner 2");

  function start() {
    setDeck(shuffle(questions).slice(0, rounds));
    setI(0);
    setMatches([]);
    setPhase("passA");
    track("couples_quiz_start", { game: slug });
  }

  function answer(k: number) {
    sfx.tick(1);
    haptic(HAPTIC.advance);
    if (phase === "a") {
      setA(k);
      setPhase("passB");
      return;
    }
    const match = k === a;
    setMatches((m) => [...m, match]);
    setPhase("reveal");
    if (match) {
      sfx.win();
      const r = stage.current?.getBoundingClientRect();
      if (r) confettiBurst(r.left + r.width / 2, r.top + 80, 30);
    } else sfx.flip();
  }

  function next() {
    if (i + 1 >= deck.length) {
      setPhase("final");
      return;
    }
    setI(i + 1);
    setA(null);
    setPhase("passA");
  }

  if (phase === "names") {
    return (
      <div className="glass-card flex flex-col gap-3 p-5 sm:p-6">
        <h3 className="text-lg font-black text-foreground">💞 Couples quiz: are you in sync?</h3>
        <p className="text-sm text-muted">Each question, you both answer in secret on this phone. Then see if you matched.</p>
        <div className="grid grid-cols-2 gap-2">
          {[0, 1].map((k) => (
            <input
              key={k}
              value={names[k]}
              onChange={(e) => setNames((n) => (k ? [n[0], e.target.value.slice(0, 16)] : [e.target.value.slice(0, 16), n[1]]))}
              placeholder={k ? "Partner 2" : "Partner 1"}
              className="rounded-xl border-2 border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none focus:border-accent"
            />
          ))}
        </div>
        <button type="button" onClick={start} disabled={!na || !nb} className="btn-primary py-3.5">
          <Heart className="h-4 w-4" aria-hidden />
          Start · {rounds} questions
        </button>
      </div>
    );
  }

  if (phase === "final") {
    const pct = Math.round((matches.filter(Boolean).length / matches.length) * 100);
    const verdict = pct >= 90 ? "Soulmates. Disgusting. 💍" : pct >= 70 ? "Very in sync 💞" : pct >= 50 ? "Opposites attract? 😅" : "Do you two even talk? 🙈";
    return (
      <div ref={stage} className="flex flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-br from-rose-500 via-pink-500 to-fuchsia-600 p-7 text-center text-white shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">
          {na} & {nb}
        </p>
        <p className="text-7xl font-black">{pct}%</p>
        <p className="text-xl font-black">{verdict}</p>
        <button type="button" onClick={start} className="mt-2 inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 font-black text-slate-900">
          <RotateCcw className="h-4 w-4" aria-hidden />
          Play again
        </button>
      </div>
    );
  }

  const cur = deck[i];
  const who = phase === "a" || phase === "passA" ? na : nb;

  return (
    <div ref={stage} className="flex flex-col gap-3">
      <div className="flex items-center gap-1" aria-hidden>
        {deck.map((_, k) => (
          <span key={k} className={`h-1.5 flex-1 rounded-full ${k < matches.length ? (matches[k] ? "bg-pink-400" : "bg-white/30") : "bg-white/10"}`} />
        ))}
      </div>
      <div className="rounded-[2rem] bg-gradient-to-br from-rose-100 via-pink-50 to-fuchsia-100 p-6 text-center shadow-xl">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-600">
          Question {i + 1} of {deck.length}
        </p>
        <p className="mt-2 text-balance text-2xl font-black text-slate-900">{fill(cur.q)}</p>
      </div>
      {phase === "passA" || phase === "passB" ? (
        <div className="glass-card flex flex-col items-center gap-3 p-6 text-center">
          <EyeOff className="h-7 w-7 text-muted" aria-hidden />
          <p className="text-xl font-black text-foreground">{who}&apos;s turn. No peeking! 🙈</p>
          <button type="button" onClick={() => setPhase(phase === "passA" ? "a" : "b")} className="btn-primary px-6">
            I&apos;m {who}
          </button>
        </div>
      ) : phase === "reveal" ? (
        <div className="glass-card flex flex-col items-center gap-3 p-6 text-center motion-safe:animate-pop-in">
          <p className="text-5xl" aria-hidden>
            {matches[matches.length - 1] ? "💞" : "💔"}
          </p>
          <p className="text-xl font-black text-foreground">{matches[matches.length - 1] ? "You matched!" : "Not in sync on this one"}</p>
          <button type="button" onClick={next} className="btn-primary px-6">
            {i + 1 >= deck.length ? "See your score" : "Next question"}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-2">
          {cur.options.map((o, k) => (
            <button
              key={k}
              type="button"
              onClick={() => answer(k)}
              className="rounded-2xl bg-white/5 px-4 py-5 text-base font-black text-foreground ring-2 ring-border transition-all hover:-translate-y-0.5 hover:ring-pink-400 active:scale-95"
            >
              {fill(o)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
