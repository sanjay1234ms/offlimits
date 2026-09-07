"use client";

import { useEffect, useRef, useState } from "react";
import { Dices, X } from "lucide-react";
import { FORFEITS } from "@/data/forfeits";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";

interface ForfeitOverlayProps {
  open: boolean;
  onClose: () => void;
}

/** "Bail Out" penalty spinner, rattles through forfeits, then lands on one. */
export function ForfeitOverlay({ open, onClose }: ForfeitOverlayProps) {
  const [text, setText] = useState(FORFEITS[0]);
  const [spinning, setSpinning] = useState(true);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    if (!open) return;
    setSpinning(true);
    sfx.spin();

    const start = Date.now();
    let i = Math.floor(Math.random() * FORFEITS.length);

    const step = () => {
      i = (i + 1) % FORFEITS.length;
      setText(FORFEITS[i]);
      const elapsed = Date.now() - start;
      if (elapsed < 1500) {
        timers.current.push(
          window.setTimeout(step, 60 + elapsed / 18),
        );
      } else {
        setText(FORFEITS[Math.floor(Math.random() * FORFEITS.length)]);
        setSpinning(false);
        sfx.forfeit();
        haptic(HAPTIC.forfeit);
      }
    };
    timers.current.push(window.setTimeout(step, 60));

    return () => {
      timers.current.forEach((t) => window.clearTimeout(t));
      timers.current = [];
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Forfeit"
    >
      <div
        className="absolute inset-0 animate-fade-in bg-black/80 backdrop-blur-sm"
        onClick={spinning ? undefined : onClose}
      />
      <div className="relative z-10 w-full max-w-sm animate-pop-in rounded-3xl border-2 border-rose-500/60 bg-surface/95 p-6 text-center shadow-[0_0_50px_rgba(244,63,94,0.4)] backdrop-blur-xl">
        {!spinning ? (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="h-4 w-4" aria-hidden />
          </button>
        ) : null}

        <p className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-[0.2em] text-rose-400">
          <Dices
            className={`h-4 w-4 ${spinning ? "animate-spin" : ""}`}
            aria-hidden
          />
          {spinning ? "Rolling your penalty" : "Your forfeit"}
        </p>

        <p
          className={`mt-4 min-h-[5rem] text-lg font-extrabold leading-snug text-foreground transition-opacity ${
            spinning ? "opacity-60" : "opacity-100"
          }`}
        >
          {text}
        </p>

        {!spinning ? (
          <button
            type="button"
            onClick={onClose}
            className="btn-primary mt-5 w-full py-3"
          >
            Done, next player
          </button>
        ) : null}
      </div>
    </div>
  );
}
