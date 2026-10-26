"use client";

import { useRef, useState } from "react";
import { Eye, RotateCcw } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { shuffle } from "@/lib/shuffle";

export interface EmojiClue {
  emoji: string;
  answer: string;
}

/** Emoji flashcards: the room shouts the answer, tap to reveal, score it. */
export function EmojiQuiz({ clues, title }: { clues: EmojiClue[]; title: string }) {
  const [deck, setDeck] = useState(clues);
  const [i, setI] = useState(0);
  const [shown, setShown] = useState(false);
  const [right, setRight] = useState(0);
  const box = useRef<HTMLDivElement>(null);
  const clue = deck[i];

  function mark(ok: boolean) {
    if (ok) {
      setRight((r) => r + 1);
      sfx.win();
    } else sfx.flip();
    setShown(false);
    setI((n) => n + 1);
    if (i + 1 === deck.length && ok) {
      const r = box.current?.getBoundingClientRect();
      if (r) confettiBurst(r.left + r.width / 2, r.top + 80, 60);
    }
  }

  if (!clue)
    return (
      <div ref={box} className="glass-card flex flex-col items-center gap-3 p-6 text-center">
        <p className="text-2xl font-black text-foreground">
          {right} / {deck.length} guessed
        </p>
        <button
          type="button"
          onClick={() => {
            setDeck(shuffle(clues));
            setI(0);
            setRight(0);
          }}
          className="btn-primary"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Play again
        </button>
      </div>
    );

  return (
    <div ref={box} className="flex flex-col gap-3">
      <div className="flex justify-between text-sm font-bold text-muted">
        <span>{title}</span>
        <span>
          {i + 1}/{deck.length} · {right} ✓
        </span>
      </div>
      <div key={i} className="rounded-[2rem] bg-gradient-to-br from-amber-100 via-rose-100 to-sky-100 p-8 text-center shadow-xl motion-safe:animate-card-flip">
        <p className="text-6xl tracking-wider sm:text-7xl">{clue.emoji}</p>
        {shown ? <p className="mt-4 text-2xl font-black text-slate-900 motion-safe:animate-pop-in">{clue.answer}</p> : <p className="mt-4 text-sm font-semibold text-slate-600">Shout it out!</p>}
      </div>
      {shown ? (
        <div className="grid grid-cols-2 gap-2">
          <button type="button" onClick={() => mark(false)} className="btn-ghost py-3">
            Nobody got it
          </button>
          <button type="button" onClick={() => mark(true)} className="btn-primary py-3">
            Got it! ✓
          </button>
        </div>
      ) : (
        <button type="button" onClick={() => setShown(true)} className="btn-primary py-3">
          <Eye className="h-4 w-4" aria-hidden />
          Reveal
        </button>
      )}
    </div>
  );
}
