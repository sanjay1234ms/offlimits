"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Crown, Flag, Minus, Plus, Trophy, X } from "lucide-react";
import type { Scoreboard } from "@/hooks/useScoreboard";
import { parseNames } from "@/hooks/useScoreboard";
import { MIN_PLAYERS } from "@/data/competitive";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";

interface ScoreboardBarProps {
  board: Scoreboard;
  /** When set, shows a compact "Finish" button at the end of the bar. */
  onFinish?: () => void;
}

/** Slim, sticky, horizontally-scrolling scoreboard. Stays under ~46px tall so
 * the prompt card and controls remain front-and-centre on mobile. Tapping a
 * pill turns it into an inline name field (commit on Enter or blur) with a
 * small ±1 / remove popover. */
export function ScoreboardBar({ board, onFinish }: ScoreboardBarProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [nameDraft, setNameDraft] = useState("");
  const [adding, setAdding] = useState(false);
  const [addDraft, setAddDraft] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  // Latest values for the outside-click commit.
  const editingRef = useRef<string | null>(null);
  const nameDraftRef = useRef("");
  editingRef.current = editingId;
  nameDraftRef.current = nameDraft;

  const { rename } = board;

  useEffect(() => {
    function onDown(e: MouseEvent) {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) {
        if (editingRef.current && nameDraftRef.current.trim()) {
          rename(editingRef.current, nameDraftRef.current.trim());
        }
        setEditingId(null);
        setAdding(false);
      }
    }
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [rename]);

  function startEdit(p: { id: string; name: string }) {
    if (editingId && editingId !== p.id && nameDraft.trim()) {
      rename(editingId, nameDraft.trim());
    }
    setAdding(false);
    setEditingId(p.id);
    setNameDraft(p.name);
  }

  function commitEdit(id: string) {
    if (nameDraft.trim()) rename(id, nameDraft.trim());
    setEditingId(null);
  }

  function bump(id: string, delta: number) {
    board.adjust(id, delta);
    if (delta > 0) {
      sfx.flip();
      haptic(HAPTIC.advance);
    }
  }

  function commitAdd() {
    const names = parseNames(addDraft);
    if (names.length) board.addNames(names);
    setAddDraft("");
    setAdding(false);
  }

  return (
    <div
      ref={wrapRef}
      className="sticky top-14 z-40 -mx-4 border-y border-white/10 bg-background/80 px-4 py-2 backdrop-blur-xl sm:top-16"
    >
      <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
        <Trophy className="h-4 w-4 shrink-0 text-amber-400" aria-hidden />

        {board.ranked.map((p) => {
          const isLeader = board.leaderId === p.id;
          const isEditing = editingId === p.id;
          return (
            <div key={p.id} className="relative shrink-0">
              {isEditing ? (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    commitEdit(p.id);
                  }}
                  className="inline-flex items-center rounded-full border-2 border-accent bg-surface px-1.5 py-0.5"
                >
                  <input
                    autoFocus
                    value={nameDraft}
                    onChange={(e) => setNameDraft(e.target.value)}
                    onFocus={(e) => e.currentTarget.select()}
                    onBlur={() => commitEdit(p.id)}
                    onKeyDown={(e) => {
                      if (e.key === "Escape") setEditingId(null);
                    }}
                    aria-label={`Rename ${p.name}`}
                    className="w-24 bg-transparent px-1 py-0.5 text-xs font-bold text-foreground outline-none"
                  />
                </form>
              ) : (
                <button
                  type="button"
                  onClick={() => startEdit(p)}
                  aria-label={`Rename or score ${p.name}`}
                  className={`inline-flex items-center gap-1.5 rounded-full border py-0.5 pl-0.5 pr-1.5 text-xs font-bold tracking-tight transition-transform duration-100 active:scale-95 ${
                    isLeader
                      ? "border-amber-400/60 bg-amber-500/15 text-amber-200 shadow-[0_0_14px_rgba(251,191,36,0.3)]"
                      : "border-white/10 bg-white/5 text-foreground"
                  }`}
                >
                  <span
                    className={`grid h-5 w-5 shrink-0 place-items-center rounded-full text-[0.6rem] font-black uppercase ${
                      isLeader
                        ? "bg-amber-400 text-amber-950"
                        : "bg-white/10 text-foreground"
                    }`}
                    aria-hidden
                  >
                    {isLeader ? (
                      <Crown className="h-2.5 w-2.5" />
                    ) : (
                      p.name.trim().charAt(0) || "?"
                    )}
                  </span>
                  <span className="max-w-[6rem] truncate">{p.name}</span>
                  <span
                    className={`grid h-4 min-w-[1.1rem] place-items-center rounded-full px-1 text-[0.65rem] font-black tabular-nums ${
                      p.score > 0
                        ? "bg-emerald-400 text-emerald-950"
                        : "bg-white/10 text-muted"
                    }`}
                  >
                    {p.score}
                  </span>
                </button>
              )}

              {isEditing ? (
                <div className="absolute left-0 top-full z-50 mt-1 flex items-center gap-1 rounded-xl border-2 border-border-strong bg-surface p-1 shadow-lg">
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => bump(p.id, -1)}
                    aria-label={`Minus one for ${p.name}`}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-border-strong text-foreground hover:bg-red-500/15 hover:text-red-400"
                  >
                    <Minus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <span className="min-w-[1.5rem] text-center text-xs font-extrabold tabular-nums text-foreground">
                    {p.score}
                  </span>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => bump(p.id, 1)}
                    aria-label={`Plus one for ${p.name}`}
                    className="grid h-7 w-7 place-items-center rounded-lg border border-border-strong text-foreground hover:bg-emerald-500/15 hover:text-emerald-400"
                  >
                    <Plus className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  <span className="mx-0.5 h-5 w-px bg-border" />
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => commitEdit(p.id)}
                    aria-label="Done"
                    className="grid h-7 w-7 place-items-center rounded-lg bg-accent text-[color:var(--accent-contrast)]"
                  >
                    <Check className="h-3.5 w-3.5" aria-hidden />
                  </button>
                  {board.players.length > MIN_PLAYERS ? (
                    <button
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => {
                        board.remove(p.id);
                        setEditingId(null);
                      }}
                      aria-label={`Remove ${p.name}`}
                      className="grid h-7 w-7 place-items-center rounded-lg border border-border-strong text-muted hover:bg-red-500/15 hover:text-red-400"
                    >
                      <X className="h-3.5 w-3.5" aria-hidden />
                    </button>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}

        {/* Add player */}
        <div className="relative shrink-0">
          {adding ? (
            <form
              className="flex items-center gap-1"
              onSubmit={(e) => {
                e.preventDefault();
                commitAdd();
              }}
            >
              <input
                autoFocus
                value={addDraft}
                onChange={(e) => setAddDraft(e.target.value)}
                onBlur={commitAdd}
                placeholder="name, name…"
                className="w-32 rounded-full border border-border-strong bg-surface px-2.5 py-1 text-xs text-foreground outline-none focus:border-accent"
              />
              <button
                type="submit"
                onMouseDown={(e) => e.preventDefault()}
                aria-label="Add"
                className="grid h-6 w-6 place-items-center rounded-full bg-accent text-[color:var(--accent-contrast)]"
              >
                <Check className="h-3 w-3" aria-hidden />
              </button>
            </form>
          ) : (
            <button
              type="button"
              onClick={() => {
                setAdding(true);
                setAddDraft("");
                setEditingId(null);
              }}
              className="inline-flex items-center gap-0.5 rounded-full border border-dashed border-border-strong px-2 py-1 text-xs font-bold text-muted hover:text-foreground"
            >
              <Plus className="h-3 w-3" aria-hidden />
              Add
            </button>
          )}
        </div>

        {onFinish ? (
          <button
            type="button"
            onClick={onFinish}
            className="ml-auto inline-flex shrink-0 items-center gap-1 rounded-full border border-amber-400/60 bg-amber-500/15 px-2.5 py-1 text-xs font-extrabold text-amber-300"
          >
            <Flag className="h-3 w-3" aria-hidden />
            Finish
          </button>
        ) : null}
      </div>
    </div>
  );
}
