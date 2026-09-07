"use client";

import { useState } from "react";
import { Plus, RotateCw, Trophy, X } from "lucide-react";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { useEffectsMuted } from "@/hooks/useEffectsMuted";
import { SuggestHelper } from "./games/SuggestHelper";

/** Maps a "Truth or Dare wheel" result to a suggestion type. */
function todType(winner: string | null): "truth" | "dare" | null {
  const w = winner?.trim().toLowerCase();
  if (w === "truth") return "truth";
  if (w === "dare" || w === "double dare") return "dare";
  return null;
}

const SLICE_COLORS = [
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#f97316",
  "#f59e0b",
  "#10b981",
  "#14b8a6",
  "#0ea5e9",
];

const CENTER = 50;
const RADIUS = 48;
const SPIN_MS = 4200;

const DEFAULT_OPTIONS = ["Alex", "Jordan", "Riley", "Taylor", "Morgan", "Casey"];

function polar(angleDeg: number, radius: number) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return {
    x: CENTER + radius * Math.cos(rad),
    y: CENTER + radius * Math.sin(rad),
  };
}

/** Split a blob of text into clean options on commas and line breaks. */
function parseOptions(text: string): string[] {
  return text
    .split(/[,\n]/)
    .map((entry) => entry.trim())
    .filter(Boolean);
}

interface SpinWheelProps {
  /** Pre-fills the wheel slices (used by ready-made wheel presets). */
  initialOptions?: string[];
  /** Shown above the wheel when a preset is loaded. */
  initialTitle?: string;
}

/** Interactive SVG wheel: add options as chips, spin, and it decelerates to a
 * pick. Used for the freeform wheel and every ready-made preset. */
export function SpinWheel({ initialOptions, initialTitle }: SpinWheelProps = {}) {
  const [options, setOptions] = useState<string[]>(() =>
    initialOptions && initialOptions.length > 0
      ? initialOptions
      : DEFAULT_OPTIONS,
  );
  const [draft, setDraft] = useState("");
  const [rotation, setRotation] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const [autoRemove, setAutoRemove] = useState(false);

  const { muted, toggle: toggleMuted } = useEffectsMuted();

  const count = options.length;
  const seg = count > 0 ? 360 / count : 360;
  const canSpin = count >= 2 && !spinning;

  function addOptions(text: string) {
    const items = parseOptions(text);
    if (items.length === 0) return;
    setOptions((prev) => [...prev, ...items]);
    setDraft("");
  }

  function handleDraftChange(value: string) {
    // A paste (or typed comma) that contains separators commits immediately.
    if (/[,\n]/.test(value)) {
      addOptions(value);
    } else {
      setDraft(value);
    }
  }

  function handlePaste(event: React.ClipboardEvent<HTMLInputElement>) {
    const text = event.clipboardData.getData("text");
    if (/[,\n]/.test(text)) {
      event.preventDefault();
      addOptions(`${draft}\n${text}`);
    }
  }

  function removeOption(index: number) {
    setOptions((prev) => prev.filter((_, i) => i !== index));
  }

  function spin() {
    if (!canSpin) return;
    setWinner(null);
    setSpinning(true);
    sfx.spin();

    const reduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const turns = reduced ? 2 : 5 + Math.floor(Math.random() * 4);
    const extra = Math.random() * 360;
    setRotation(rotation + turns * 360 + extra);
  }

  function handleTransitionEnd() {
    if (!spinning) return;
    setSpinning(false);
    const normalized = ((rotation % 360) + 360) % 360;
    const pointerInWheel = (360 - normalized) % 360;
    const idx = Math.floor(pointerInWheel / seg) % count;
    const win = options[idx] ?? null;
    setWinner(win);
    sfx.win();
    haptic(HAPTIC.advance);
    if (win !== null && autoRemove) {
      setOptions((prev) => prev.filter((_, i) => i !== idx));
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {initialTitle ? (
        <span className="w-fit rounded-full border-2 border-accent/50 bg-[color:var(--accent-soft)] px-3 py-1 text-xs font-extrabold uppercase tracking-wide text-accent">
          {initialTitle}
        </span>
      ) : null}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        {/* Wheel */}
        <div className="flex flex-col items-center gap-6">
          <div className="relative w-full max-w-md">
            {/* Fixed pointer at the top, pointing into the wheel */}
            <div
              className="pointer-events-none absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 -translate-y-1"
              style={{
                borderLeft: "11px solid transparent",
                borderRight: "11px solid transparent",
                borderTop: "20px solid var(--accent)",
              }}
              aria-hidden
            />
            <svg
              viewBox="0 0 100 100"
              className="w-full drop-shadow-xl"
              role="img"
              aria-label={
                count >= 2
                  ? `Wheel with ${count} options`
                  : "Wheel, add at least two options"
              }
            >
              <circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS + 1.5}
                fill="var(--border-strong)"
              />
              <g
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "50px 50px",
                  transition: `transform ${SPIN_MS}ms cubic-bezier(0.16, 0.9, 0.2, 1)`,
                }}
                onTransitionEnd={handleTransitionEnd}
              >
                {count <= 1 ? (
                  <circle
                    cx={CENTER}
                    cy={CENTER}
                    r={RADIUS}
                    fill={SLICE_COLORS[0]}
                  />
                ) : (
                  options.map((entry, i) => {
                    const a0 = i * seg;
                    const a1 = (i + 1) * seg;
                    const p0 = polar(a0, RADIUS);
                    const p1 = polar(a1, RADIUS);
                    const largeArc = seg > 180 ? 1 : 0;
                    const mid = a0 + seg / 2;
                    const label = polar(mid, RADIUS * 0.6);
                    let rot = mid - 90;
                    if (mid > 90 && mid < 270) rot += 180;
                    const text =
                      entry.length > 14 ? `${entry.slice(0, 13)}…` : entry;
                    return (
                      <g key={`${entry}-${i}`}>
                        <path
                          d={`M ${CENTER} ${CENTER} L ${p0.x} ${p0.y} A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${p1.x} ${p1.y} Z`}
                          fill={SLICE_COLORS[i % SLICE_COLORS.length]}
                          stroke="rgba(2,6,23,0.35)"
                          strokeWidth={0.4}
                        />
                        <text
                          x={label.x}
                          y={label.y}
                          fill="#ffffff"
                          fontSize={seg < 22 ? 3 : seg < 40 ? 3.6 : 4.2}
                          fontWeight={700}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          transform={`rotate(${rot} ${label.x} ${label.y})`}
                        >
                          {text}
                        </text>
                      </g>
                    );
                  })
                )}
              </g>
              <circle
                cx={CENTER}
                cy={CENTER}
                r={5}
                fill="var(--card-bg)"
                stroke="var(--border-strong)"
                strokeWidth={1.5}
              />
            </svg>
          </div>

          <button
            type="button"
            onClick={spin}
            disabled={!canSpin}
            className="btn-primary min-w-[12rem] py-4 text-base"
          >
            <RotateCw
              className={`h-5 w-5 ${spinning ? "animate-spin" : ""}`}
              aria-hidden
            />
            {spinning ? "Spinning…" : "Spin"}
          </button>

          <div
            className="min-h-[3.5rem] w-full max-w-md text-center"
            aria-live="polite"
          >
            {winner ? (
              <div className="animate-fade-up flex flex-col items-center gap-3 rounded-card border border-accent bg-[color:var(--accent-soft)] p-4">
                <p className="inline-flex items-center gap-2 text-lg font-bold text-foreground">
                  <Trophy className="h-5 w-5 text-accent" aria-hidden />
                  {winner}
                </p>
                {todType(winner) ? (
                  <SuggestHelper type={todType(winner)!} showModeToggle />
                ) : null}
              </div>
            ) : count < 2 ? (
              <p className="text-sm text-muted">
                Add at least two options to spin.
              </p>
            ) : null}
          </div>
        </div>

        {/* Options editor */}
        <div className="card flex h-max flex-col gap-4">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-bold text-foreground">
              Options{" "}
              <span className="text-muted">[{count}]</span>
            </h2>
            <button
              type="button"
              onClick={() => setOptions([])}
              disabled={count === 0}
              className="text-xs font-semibold text-muted underline-offset-2 transition-colors hover:text-foreground hover:underline disabled:opacity-40 disabled:hover:no-underline"
            >
              Clear all
            </button>
          </div>

          <form
            className="flex items-center gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              addOptions(draft);
            }}
          >
            <input
              value={draft}
              onChange={(event) => handleDraftChange(event.target.value)}
              onPaste={handlePaste}
              spellCheck={false}
              aria-label="Add wheel options"
              placeholder="Press Enter after each option, or add several at once, separated by commas or new lines."
              className="min-w-0 flex-1 rounded-xl border-2 border-border-strong bg-surface px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-subtle focus:border-accent"
            />
            <button
              type="submit"
              disabled={draft.trim() === ""}
              aria-label="Add option"
              className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-accent text-[color:var(--accent-contrast)] shadow-[0_10px_24px_-10px_var(--accent-glow)] transition-transform duration-150 hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:active:scale-100"
            >
              <Plus className="h-5 w-5" aria-hidden />
            </button>
          </form>

          {count > 0 ? (
            <ul className="flex flex-wrap gap-2">
              {options.map((option, index) => (
                <li key={`${option}-${index}`}>
                  <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-[color:var(--card-border)] bg-[color:var(--card-bg)] py-1 pl-3 pr-1.5 text-sm font-semibold text-foreground shadow-[2px_2px_0_var(--card-border)]">
                    {option}
                    <button
                      type="button"
                      onClick={() => removeOption(index)}
                      aria-label={`Remove ${option}`}
                      className="grid h-5 w-5 place-items-center rounded-full text-muted transition-colors hover:bg-red-500/15 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-subtle">
              No options yet, add a few above to build the wheel.
            </p>
          )}

          <div className="flex flex-col gap-2.5 border-t border-border pt-3">
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={autoRemove}
                onChange={(event) => setAutoRemove(event.target.checked)}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
              Remove each winner after spinning
            </label>
            <label className="flex cursor-pointer items-center gap-2.5 text-sm text-foreground">
              <input
                type="checkbox"
                checked={!muted}
                onChange={toggleMuted}
                className="h-4 w-4 accent-[color:var(--accent)]"
              />
              Sound
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
