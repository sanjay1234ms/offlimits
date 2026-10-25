"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import type { CatalogGame } from "@/data/catalog";
import { aiLearn, aiThrow, judge, newAi, type AiState, type Move } from "@/lib/rpsAi";

const RockPaperScissors3DGame = dynamic(
  () => import("./RockPaperScissors3D").then((m) => m.RockPaperScissors3DGame),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[30rem] w-full items-center justify-center rounded-3xl border-2 border-violet-500/40 bg-gradient-to-b from-violet-900 to-indigo-950 text-sm font-bold text-white">
        Warming up the arena…
      </div>
    ),
  },
);

function hasWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return Boolean(c.getContext("webgl2") ?? c.getContext("webgl"));
  } catch {
    return false;
  }
}

const EMOJI: Record<Move, string> = { rock: "🪨", paper: "📄", scissors: "✂️" };

/** Plain fallback for devices without WebGL: same computer, no 3D. */
function RockPaperScissorsLite() {
  const [ai, setAi] = useState<AiState>(() => newAi());
  const [last, setLast] = useState<{ you: Move; cpu: Move } | null>(null);
  const [score, setScore] = useState<[number, number]>([0, 0]);

  function play(m: Move) {
    const t = aiThrow(ai);
    const o = judge(m, t.move);
    setAi(aiLearn(t.state, { player: m, ai: t.move }));
    setLast({ you: m, cpu: t.move });
    setScore(([a, b]) => [a + (o === "win" ? 1 : 0), b + (o === "lose" ? 1 : 0)]);
  }

  return (
    <div className="glass-card flex flex-col items-center gap-4 p-6 text-center">
      <p className="text-3xl font-black">
        You {score[0]} – {score[1]} Computer
      </p>
      {last ? (
        <p className="text-5xl" key={`${last.you}${last.cpu}${score.join()}`}>
          {EMOJI[last.you]} <span className="text-base font-bold text-muted">vs</span> {EMOJI[last.cpu]}
        </p>
      ) : null}
      <div className="grid w-full grid-cols-3 gap-2">
        {(["rock", "paper", "scissors"] as Move[]).map((m) => (
          <button key={m} type="button" onClick={() => play(m)} className="btn-ghost flex-col py-4 text-3xl">
            {EMOJI[m]}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Rock Paper Scissors: the 3D arena when WebGL is available. */
export function RockPaperScissorsGame({ game }: { game: CatalogGame }) {
  const [webgl, setWebgl] = useState<boolean | null>(null);
  useEffect(() => setWebgl(hasWebGL()), []);
  if (webgl === null) return <div className="h-[30rem] w-full" aria-hidden />;
  return webgl ? <RockPaperScissors3DGame game={game} /> : <RockPaperScissorsLite />;
}
