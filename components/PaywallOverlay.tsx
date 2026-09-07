"use client";

import { useState } from "react";
import { KeyRound, Lock, Zap } from "lucide-react";
import {
  ACCESS_CODE,
  PARTY_PASS_BLURB,
  PARTY_PASS_LABEL,
  UNLOCK_18_PRICE,
  UNLOCK_18_URL,
} from "@/lib/monetization";

interface PaywallOverlayProps {
  /** Called when a valid access code is entered / checkout succeeds. */
  onUnlock: () => void;
}

/** The standard 18+ paywall, shown once the free preview is spent, anywhere.
 * Sells the single site-wide 24-Hour Party Pass. */
export function PaywallOverlay({ onUnlock }: PaywallOverlayProps) {
  const [showCode, setShowCode] = useState(false);
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);

  function submitCode(event: React.FormEvent) {
    event.preventDefault();
    if (code.trim().toUpperCase() === ACCESS_CODE) {
      setError(false);
      onUnlock();
    } else {
      setError(true);
    }
  }

  return (
    <div className="animate-pop-in absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-3xl border border-red-500/40 bg-background/90 p-6 text-center shadow-[inset_0_0_60px_-20px_rgba(239,68,68,0.4)] backdrop-blur-md">
      <span className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-amber-400/50 bg-amber-500/15 shadow-[0_0_28px_rgba(251,191,36,0.4)]">
        <Zap className="h-5 w-5 text-amber-300" aria-hidden />
      </span>

      <p className="text-[0.7rem] font-extrabold uppercase tracking-[0.25em] text-red-400">
        You&apos;ve reached the free preview
      </p>

      <p className="text-balance text-base font-extrabold leading-snug text-foreground">
        {PARTY_PASS_LABEL}
      </p>
      <p className="text-balance text-sm text-muted">{PARTY_PASS_BLURB}</p>

      <div className="mt-1 flex w-full max-w-xs flex-col gap-2.5">
        <a
          href={UNLOCK_18_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary w-full"
        >
          <Zap className="h-4 w-4" aria-hidden />
          Get the 24-Hour Party Pass ({UNLOCK_18_PRICE})
        </a>

        {!showCode ? (
          <button
            type="button"
            onClick={() => setShowCode(true)}
            className="btn-ghost w-full text-sm"
          >
            <KeyRound className="h-4 w-4" aria-hidden />
            Already have a pass? Enter access code
          </button>
        ) : (
          <form onSubmit={submitCode} className="flex flex-col gap-2">
            <input
              autoFocus
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setError(false);
              }}
              placeholder="Access code"
              aria-label="Access code"
              aria-invalid={error}
              className="w-full rounded-xl border border-border-strong bg-surface px-3 py-2 text-center text-sm font-semibold uppercase tracking-widest text-foreground outline-none transition-colors placeholder:normal-case placeholder:tracking-normal placeholder:text-subtle focus:border-accent"
            />
            <button type="submit" className="btn-primary w-full text-sm">
              <Lock className="h-4 w-4" aria-hidden />
              Activate pass
            </button>
            {error ? (
              <p className="text-xs font-semibold text-rose-400">
                That code didn&apos;t work. Try again.
              </p>
            ) : null}
          </form>
        )}
      </div>

      <p className="text-[0.7rem] text-subtle">
        One pass unlocks 18+ everywhere for 24 hours. No second purchase, no
        per-game passes.
      </p>
    </div>
  );
}
