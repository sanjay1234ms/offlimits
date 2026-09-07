"use client";

import { useState } from "react";
import { Lightbulb, RefreshCw } from "lucide-react";
import {
  SUGGEST_LABEL,
  drawSuggestion,
  type SuggestType,
} from "@/data/suggestions";
import {
  persistAgeConfirmed,
  readAgeConfirmed,
} from "@/lib/monetization";
import { useAdultPreview } from "@/hooks/useAdultPreview";
import { AgeGateModal } from "../AgeGateModal";
import { PaywallOverlay } from "../PaywallOverlay";

interface SuggestHelperProps {
  type: SuggestType;
  /** Renders a Normal / 18+ toggle inside the helper (used by the wheel). */
  showModeToggle?: boolean;
  /** When there's no toggle, the parent fixes the mode (games pass adultMode). */
  adult?: boolean;
  className?: string;
}

/** "💡 Suggest a prompt" idea generator. Normal mode is unlimited; 18+ mode
 * draws from the shared 3-item preview budget, then hits the paywall. */
export function SuggestHelper({
  type,
  showModeToggle = false,
  adult = false,
  className,
}: SuggestHelperProps) {
  const preview = useAdultPreview();
  const [mode, setMode] = useState<"normal" | "adult">(
    adult ? "adult" : "normal",
  );
  const [ageGateOpen, setAgeGateOpen] = useState(false);
  const [suggestion, setSuggestion] = useState<string | null>(null);

  const effectiveAdult = showModeToggle ? mode === "adult" : adult;
  const trial = effectiveAdult && preview.hydrated && !preview.unlocked;

  function selectMode(next: "normal" | "adult") {
    if (next === "adult" && !readAgeConfirmed()) {
      setAgeGateOpen(true);
      return;
    }
    setMode(next);
    setSuggestion(null);
    preview.closePaywall();
  }

  function confirmAge() {
    persistAgeConfirmed();
    setAgeGateOpen(false);
    setMode("adult");
    setSuggestion(null);
  }

  function draw() {
    if (effectiveAdult && !readAgeConfirmed()) {
      setAgeGateOpen(true);
      return;
    }
    if (effectiveAdult && !preview.unlocked) {
      const token = `sg-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      if (!preview.consume(token)) {
        preview.openPaywall();
        return;
      }
    }
    setSuggestion((prev) => drawSuggestion(type, effectiveAdult, prev));
  }

  return (
    <div
      className={`w-full rounded-3xl border-2 p-4 backdrop-blur ${
        effectiveAdult
          ? "border-red-500/40 bg-red-950/20"
          : "border-white/10 bg-white/[0.03]"
      } ${className ?? ""}`}
    >
      {preview.paywallOpen ? (
        <div className="relative min-h-[20rem]">
          <PaywallOverlay onUnlock={preview.unlock} />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-subtle">
              <Lightbulb className="h-3.5 w-3.5 text-amber-300" aria-hidden />
              Need an idea?
            </p>

            {showModeToggle ? (
              <div className="inline-flex rounded-full border border-white/10 bg-white/5 p-0.5 text-xs font-bold">
                <button
                  type="button"
                  onClick={() => selectMode("normal")}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    mode === "normal"
                      ? "bg-accent text-[color:var(--accent-contrast)]"
                      : "text-muted hover:text-foreground"
                  }`}
                >
                  Normal
                </button>
                <button
                  type="button"
                  onClick={() => selectMode("adult")}
                  className={`rounded-full px-3 py-1 transition-colors ${
                    mode === "adult"
                      ? "bg-red-600 text-white"
                      : "text-red-300 hover:text-red-200"
                  }`}
                >
                  18+ Uncensored
                </button>
              </div>
            ) : null}
          </div>

          <div
            className={`mt-3 min-h-[4.5rem] rounded-2xl border p-3 text-center text-sm font-semibold ${
              effectiveAdult
                ? "border-red-500/30 text-red-100"
                : "border-white/10 text-foreground"
            }`}
          >
            {suggestion ?? (
              <span className="text-muted">
                Tap below for a{" "}
                {type === "scenario"
                  ? "hot-seat scenario"
                  : type === "confession"
                    ? "confession"
                    : type === "dare"
                      ? "dare"
                      : "prompt"}
                .
              </span>
            )}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={draw}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-extrabold transition-transform duration-150 hover:-translate-y-0.5 active:scale-95 ${
                effectiveAdult
                  ? "bg-red-600 text-white"
                  : "bg-accent text-[color:var(--accent-contrast)]"
              }`}
            >
              {suggestion ? (
                <RefreshCw className="h-4 w-4" aria-hidden />
              ) : (
                <Lightbulb className="h-4 w-4" aria-hidden />
              )}
              {suggestion
                ? "Another idea"
                : `💡 ${SUGGEST_LABEL[type]}${
                    effectiveAdult ? " (18+)" : ""
                  }`}
            </button>

            {trial ? (
              <span className="rounded-full border border-red-500/40 bg-red-950/40 px-2.5 py-1 text-xs font-bold text-red-300">
                {preview.used > 0
                  ? `Preview: ${preview.used} of ${preview.cap}`
                  : `${preview.cap} free 18+ ideas`}
              </span>
            ) : null}
          </div>
        </>
      )}

      <AgeGateModal
        open={ageGateOpen}
        onConfirm={confirmAge}
        onCancel={() => {
          setAgeGateOpen(false);
          setMode("normal");
        }}
      />
    </div>
  );
}
