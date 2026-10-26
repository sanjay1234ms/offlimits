"use client";

import { X } from "lucide-react";

/** The white action pill under a card stage: a red ✕ to skip and a big
 * smile to say "done". Both throw the card the matching way. */
export function DeckPill({
  onSkip,
  onDone,
  skipLabel = "Skip",
  doneLabel = "Done, next card",
  disabled = false,
}: {
  onSkip: () => void;
  onDone: () => void;
  skipLabel?: string;
  doneLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="inline-flex items-center rounded-full bg-white p-1.5 shadow-[0_18px_40px_-14px_rgba(0,0,0,0.6)] ring-1 ring-black/5">
      <button
        type="button"
        onClick={onSkip}
        disabled={disabled}
        aria-label={skipLabel}
        title={skipLabel}
        className="grid h-14 w-14 place-items-center rounded-full bg-gradient-to-br from-rose-500 to-red-600 text-white shadow-[inset_0_-3px_0_rgba(0,0,0,0.15)] transition-transform duration-150 hover:scale-105 active:scale-90 disabled:opacity-50"
      >
        <X className="h-6 w-6" strokeWidth={3} aria-hidden />
      </button>
      <span aria-hidden className="mx-3 h-9 w-px bg-slate-200" />
      <button
        type="button"
        onClick={onDone}
        disabled={disabled}
        aria-label={doneLabel}
        title={doneLabel}
        className="group grid h-14 w-16 place-items-center rounded-full text-slate-900 transition-transform duration-150 hover:scale-105 active:scale-90 disabled:opacity-50"
      >
        <svg viewBox="0 0 40 24" className="h-6 w-10 transition-transform duration-300 group-hover:scale-y-125" aria-hidden>
          <path d="M5 5 Q20 26 35 5" fill="none" stroke="currentColor" strokeWidth="4.5" strokeLinecap="round" />
        </svg>
      </button>
    </div>
  );
}
