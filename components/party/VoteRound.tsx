"use client";

import { useMemo, useRef, useState } from "react";
import { Crown, EyeOff, Plus, RotateCcw, SkipForward } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track } from "@/lib/analytics";
import { shuffle } from "@/lib/shuffle";

type Phase = "setup" | "pass" | "vote" | "reveal" | "final";

const AVATAR = ["bg-pink-400", "bg-sky-400", "bg-amber-400", "bg-emerald-400", "bg-violet-400", "bg-rose-500", "bg-cyan-400", "bg-lime-400"];

function Avatar({ name, i, size = "h-10 w-10 text-base" }: { name: string; i: number; size?: string }) {
  return (
    <span className={`grid shrink-0 place-items-center rounded-full font-black text-slate-900 ${AVATAR[i % AVATAR.length]} ${size}`}>
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

/** Pass-the-phone Most Likely To with secret votes and a bar-chart reveal. */
export function VoteRound({
  questions,
  title = "Most Likely To",
  slug,
  defaultPlayers = [],
}: {
  questions: string[];
  title?: string;
  slug: string;
  defaultPlayers?: string[];
}) {
  const [players, setPlayers] = useState<string[]>(defaultPlayers);
  const [draft, setDraft] = useState("");
  const [phase, setPhase] = useState<Phase>("setup");
  const [deck, setDeck] = useState<string[]>([]);
  const [q, setQ] = useState(0);
  const [voter, setVoter] = useState(0);
  const [votes, setVotes] = useState<number[]>([]);
  const [awards, setAwards] = useState<number[]>([]);
  const revealRef = useRef<HTMLDivElement>(null);

  const tally = useMemo(() => {
    const t = players.map(() => 0);
    votes.forEach((v) => (t[v] += 1));
    return t;
  }, [votes, players]);
  const top = Math.max(0, ...tally);
  const winners = tally.map((c, k) => (c === top && top > 0 ? k : -1)).filter((k) => k >= 0);

  function addPlayer() {
    const n = draft.trim().slice(0, 16);
    if (!n || players.length >= 12 || players.includes(n)) return;
    setPlayers((p) => [...p, n]);
    setDraft("");
  }

  function start() {
    setDeck(shuffle(questions));
    setQ(0);
    setAwards(players.map(() => 0));
    beginQuestion();
    track("mlt_vote_start", { game: slug, players: players.length });
  }

  function beginQuestion() {
    setVotes([]);
    setVoter(0);
    setPhase("pass");
  }

  function vote(k: number) {
    sfx.tick(1);
    haptic(HAPTIC.advance);
    const next = [...votes, k];
    setVotes(next);
    if (voter + 1 < players.length) {
      setVoter(voter + 1);
      setPhase("pass");
    } else {
      setPhase("reveal");
      sfx.win();
      const t = players.map(() => 0);
      next.forEach((v) => (t[v] += 1));
      const best = Math.max(...t);
      setAwards((a) => a.map((x, j) => x + (t[j] === best ? 1 : 0)));
      requestAnimationFrame(() => {
        const r = revealRef.current?.getBoundingClientRect();
        if (r) confettiBurst(r.left + r.width / 2, r.top + 60, 40);
      });
    }
  }

  function nextQuestion() {
    if (q + 1 >= deck.length) {
      setPhase("final");
      return;
    }
    setQ(q + 1);
    beginQuestion();
  }

  if (phase === "setup") {
    return (
      <div className="glass-card flex flex-col gap-4 p-5 sm:p-6">
        <div>
          <h3 className="text-lg font-black text-foreground">👉 {title}: secret vote</h3>
          <p className="mt-1 text-sm text-muted">
            Add everyone playing. Each question, the phone goes round and everyone votes in secret. Then the big reveal.
          </p>
        </div>
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            addPlayer();
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Add a player"
            className="min-w-0 flex-1 rounded-xl border-2 border-border bg-background/60 px-3 py-2.5 text-sm outline-none focus:border-accent"
          />
          <button type="submit" className="btn-primary px-4 text-sm" aria-label="Add player">
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </form>
        <div className="flex flex-wrap gap-2">
          {players.map((p, k) => (
            <button
              key={p}
              type="button"
              onClick={() => setPlayers((l) => l.filter((x) => x !== p))}
              className="inline-flex items-center gap-2 rounded-full bg-white/5 py-1 pl-1 pr-3 text-sm font-bold text-foreground ring-1 ring-border hover:ring-rose-400 motion-safe:animate-pop-in"
            >
              <Avatar name={p} i={k} size="h-7 w-7 text-xs" />
              {p}
            </button>
          ))}
        </div>
        <button type="button" onClick={start} disabled={players.length < 3} className="btn-primary w-full py-3.5">
          {players.length < 3 ? `Add ${3 - players.length} more player${3 - players.length === 1 ? "" : "s"}` : `Start · ${questions.length} questions`}
        </button>
      </div>
    );
  }

  if (phase === "final") {
    const ranked = players.map((p, k) => ({ p, k, n: awards[k] ?? 0 })).sort((a, b) => b.n - a.n);
    return (
      <div className="glass-card flex flex-col items-center gap-4 p-6 text-center">
        <Crown className="h-10 w-10 text-amber-400" aria-hidden />
        <h3 className="text-2xl font-black text-foreground">Most likely to… everything</h3>
        <ol className="w-full space-y-2">
          {ranked.map((r, i) => (
            <li key={r.p} className="flex items-center gap-3 rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-border">
              <span className="w-6 text-lg">{["🥇", "🥈", "🥉"][i] ?? `${i + 1}`}</span>
              <Avatar name={r.p} i={r.k} size="h-8 w-8 text-sm" />
              <span className="flex-1 text-left font-bold text-foreground">{r.p}</span>
              <span className="text-sm font-black text-accent">{r.n} 👑</span>
            </li>
          ))}
        </ol>
        <button type="button" onClick={start} className="btn-primary">
          <RotateCcw className="h-4 w-4" aria-hidden />
          Play again
        </button>
      </div>
    );
  }

  const question = deck[q];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center gap-1" aria-hidden>
        {deck.slice(0, Math.min(deck.length, 20)).map((_, k) => (
          <span key={k} className={`h-1.5 flex-1 rounded-full ${k < q ? "bg-accent" : k === q ? "bg-accent/60" : "bg-white/10"}`} />
        ))}
      </div>
      <div className="rounded-[2rem] bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 p-6 text-center text-white shadow-xl sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">Who&apos;s most likely to…</p>
        <p key={question} className="mt-3 text-balance text-2xl font-black leading-snug motion-safe:animate-pop-in sm:text-3xl">
          {question}
        </p>
      </div>

      {phase === "pass" ? (
        <div className="glass-card flex flex-col items-center gap-3 p-6 text-center">
          <EyeOff className="h-8 w-8 text-muted" aria-hidden />
          <p className="text-sm font-bold text-muted">
            Vote {voter + 1} of {players.length}
          </p>
          <p className="text-2xl font-black text-foreground">Pass to {players[voter]} 🔒</p>
          <button type="button" onClick={() => setPhase("vote")} className="btn-primary px-6">
            I&apos;m {players[voter]}, let me vote
          </button>
        </div>
      ) : phase === "vote" ? (
        <div className="glass-card p-4 sm:p-5">
          <p className="mb-3 text-center text-sm font-bold text-muted">{players[voter]}, tap who it is</p>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {players.map((p, k) => (
              <button
                key={p}
                type="button"
                onClick={() => vote(k)}
                className="flex items-center gap-2 rounded-2xl bg-white/5 p-2.5 text-left font-bold text-foreground ring-1 ring-border transition-all hover:-translate-y-0.5 hover:ring-accent active:scale-95"
              >
                <Avatar name={p} i={k} />
                <span className="truncate">{p}</span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div ref={revealRef} className="glass-card flex flex-col gap-3 p-5 sm:p-6">
          <p className="text-center text-lg font-black text-foreground">
            {winners.length === 1 ? `👑 ${players[winners[0]]}!` : `👑 Tie: ${winners.map((k) => players[k]).join(" & ")}`}
          </p>
          <div className="space-y-2">
            {players
              .map((p, k) => ({ p, k, n: tally[k] }))
              .sort((a, b) => b.n - a.n)
              .map(({ p, k, n }, idx) => (
                <div key={p} className="flex items-center gap-2">
                  <Avatar name={p} i={k} size="h-8 w-8 text-sm" />
                  <div className="relative h-8 flex-1 overflow-hidden rounded-xl bg-white/5">
                    <div
                      className={`absolute inset-y-0 left-0 rounded-xl transition-[width] duration-700 ease-out ${n === top && top > 0 ? "bg-gradient-to-r from-amber-400 to-pink-500" : "bg-white/15"}`}
                      style={{ width: `${players.length ? (n / players.length) * 100 : 0}%`, transitionDelay: `${idx * 90}ms` }}
                    />
                    <span className="relative z-10 flex h-full items-center justify-between px-3 text-sm font-bold text-foreground">
                      {p}
                      <span>{n}</span>
                    </span>
                  </div>
                </div>
              ))}
          </div>
          <button type="button" onClick={nextQuestion} className="btn-primary mt-1">
            <SkipForward className="h-4 w-4" aria-hidden />
            {q + 1 >= deck.length ? "See the awards" : "Next question"}
          </button>
        </div>
      )}
    </div>
  );
}
