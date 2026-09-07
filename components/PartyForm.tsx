"use client";

import { useMemo, useState } from "react";
import {
  ArrowLeft,
  Check,
  DoorOpen,
  Gamepad2,
  ListChecks,
  Loader2,
  LogIn,
} from "lucide-react";
import { Modal } from "./Modal";
import { HostRoom, PlayerRoom } from "./PartyRoom";
import type { RoomView } from "@/hooks/useRoom";

const PARTY_GAMES = [
  { id: "would_you_rather", label: "Would You Rather", emoji: "🤔" },
  { id: "never_have_i_ever", label: "Never Have I Ever", emoji: "🙈" },
  { id: "most_likely_to", label: "Most Likely To", emoji: "👉" },
  { id: "18plus", label: "18+ Uncensored", emoji: "🔥" },
];

type Mode =
  | { kind: "form" }
  | { kind: "host"; code: string }
  | { kind: "player"; code: string; playerId: string; name: string };

function newId(): string {
  try {
    return crypto.randomUUID();
  } catch {
    return `p_${Math.random().toString(36).slice(2)}${Date.now().toString(36)}`;
  }
}

/** The party-room hub: open a room as host, or join one as a player. Both
 * halves talk to the in-memory `/api/rooms` store so they sync across
 * browsers and tabs. */
export function PartyForm() {
  const [mode, setMode] = useState<Mode>({ kind: "form" });

  const [joinCode, setJoinCode] = useState("");
  const [joinStage, setJoinStage] = useState<"code" | "name">("code");
  const [playerName, setPlayerName] = useState("");
  const [partyName, setPartyName] = useState("");
  const [selected, setSelected] = useState<string[]>([
    "would_you_rather",
    "never_have_i_ever",
    "most_likely_to",
  ]);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const selectedGames = useMemo(
    () => PARTY_GAMES.filter((game) => selected.includes(game.id)),
    [selected],
  );

  function toggleGame(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((g) => g !== id) : [...prev, id],
    );
  }

  function resetForm() {
    setMode({ kind: "form" });
    setJoinStage("code");
    setJoinCode("");
    setPlayerName("");
    setError(null);
    setBusy(false);
  }

  async function openRoom() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          name: partyName,
          games: selected,
          hostId: newId(),
        }),
      });
      if (!res.ok) throw new Error("bad response");
      const room = (await res.json()) as RoomView;
      setMode({ kind: "host", code: room.code });
    } catch {
      setError("Could not open the room. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function checkCode() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch(`/api/rooms/${joinCode}`, { cache: "no-store" });
      if (res.status === 404) {
        setError("No room with that code.");
        return;
      }
      if (!res.ok) throw new Error("bad response");
      setJoinStage("name");
    } catch {
      setError("Could not reach that room. Try again.");
    } finally {
      setBusy(false);
    }
  }

  async function confirmJoin() {
    setBusy(true);
    setError(null);
    const playerId = newId();
    try {
      const res = await fetch(`/api/rooms/${joinCode}`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "join",
          playerId,
          name: playerName,
        }),
      });
      if (res.status === 404) {
        setError("That room just closed.");
        return;
      }
      if (!res.ok) throw new Error("bad response");
      setMode({
        kind: "player",
        code: joinCode,
        playerId,
        name: playerName.trim() || "Player",
      });
    } catch {
      setError("Could not join. Try again.");
    } finally {
      setBusy(false);
    }
  }

  if (mode.kind === "host") {
    return (
      <HostRoom
        code={mode.code}
        partyName={partyName}
        games={selected}
        onExit={resetForm}
      />
    );
  }

  if (mode.kind === "player") {
    return (
      <PlayerRoom
        code={mode.code}
        playerId={mode.playerId}
        name={mode.name}
        onExit={resetForm}
      />
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      {/* Card 1, Join */}
      <div className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:p-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
          Got a code?
        </h2>

        {joinStage === "code" ? (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row">
            <input
              value={joinCode}
              onChange={(event) => {
                setJoinCode(
                  event.target.value
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "")
                    .slice(0, 6),
                );
                setError(null);
              }}
              inputMode="text"
              autoCapitalize="characters"
              spellCheck={false}
              placeholder="ABC123"
              aria-label="Room code"
              className="w-full rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 text-center font-mono text-lg font-extrabold uppercase tracking-[0.35em] text-foreground outline-none transition-colors placeholder:tracking-[0.2em] placeholder:text-subtle focus:border-accent"
            />
            <button
              type="button"
              disabled={joinCode.length !== 6 || busy}
              onClick={checkCode}
              className="btn-primary shrink-0 px-6"
            >
              {busy ? (
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
              ) : (
                <LogIn className="h-4 w-4" aria-hidden />
              )}
              Join
            </button>
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-2">
            <p className="text-sm text-muted">
              Joining <span className="font-mono font-bold">{joinCode}</span>.
              What should we call you?
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <input
                value={playerName}
                autoFocus
                onChange={(event) => setPlayerName(event.target.value)}
                maxLength={24}
                placeholder="Your name"
                aria-label="Your name"
                className="w-full rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-subtle focus:border-accent"
              />
              <button
                type="button"
                disabled={playerName.trim().length === 0 || busy}
                onClick={confirmJoin}
                className="btn-primary shrink-0 px-6"
              >
                {busy ? (
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                ) : (
                  <LogIn className="h-4 w-4" aria-hidden />
                )}
                Join room
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                setJoinStage("code");
                setError(null);
              }}
              className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-muted hover:text-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
              Different code
            </button>
          </div>
        )}

        {error ? (
          <p className="mt-2 text-xs font-semibold text-red-400">{error}</p>
        ) : (
          <p className="mt-2 text-xs text-subtle">
            Six characters, letters and numbers. Ask your host.
          </p>
        )}
      </div>

      {/* Card 2, Name */}
      <div className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:p-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
          Name the party
        </h2>
        <input
          value={partyName}
          onChange={(event) => setPartyName(event.target.value)}
          maxLength={40}
          placeholder="Friday night"
          aria-label="Party name (optional)"
          className="mt-3 w-full rounded-2xl border-2 border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-foreground outline-none transition-colors placeholder:text-subtle focus:border-accent"
        />
        <p className="mt-2 text-xs text-subtle">
          Optional. Shows on the shared screen so people know they&apos;re in
          the right room.
        </p>
      </div>

      {/* Card 3, Playlist + open */}
      <div className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-5 backdrop-blur sm:p-6">
        <h2 className="text-sm font-extrabold uppercase tracking-wide text-foreground">
          What are you playing?
        </h2>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {selectedGames.length > 0 ? (
            selectedGames.map((game) => (
              <span
                key={game.id}
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-white/10 bg-white/5 px-3 py-1.5 text-xs font-bold text-foreground"
              >
                <span aria-hidden>{game.emoji}</span>
                {game.label}
              </span>
            ))
          ) : (
            <span className="text-sm text-subtle">No games picked yet.</span>
          )}
        </div>

        <button
          type="button"
          onClick={() => setPickerOpen(true)}
          className="btn-ghost mt-3 w-full"
        >
          <ListChecks className="h-4 w-4" aria-hidden />
          Pick the games
        </button>

        <button
          type="button"
          disabled={selected.length === 0 || busy}
          onClick={openRoom}
          className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-5 py-4 text-base font-extrabold text-lime-950 shadow-[0_14px_36px_-10px_rgba(163,230,53,0.55)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:bg-lime-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {busy ? (
            <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
          ) : (
            <DoorOpen className="h-5 w-5" aria-hidden />
          )}
          Open the room
        </button>
      </div>

      <Modal
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        title="Pick the games"
      >
        <div className="mt-3 flex flex-col gap-2">
          {PARTY_GAMES.map((game) => {
            const on = selected.includes(game.id);
            return (
              <button
                key={game.id}
                type="button"
                onClick={() => toggleGame(game.id)}
                aria-pressed={on}
                className={`flex items-center gap-3 rounded-2xl border-2 p-3 text-left transition-colors ${
                  on
                    ? "border-accent bg-[color:var(--accent-soft)]"
                    : "border-white/10 bg-white/5 hover:border-white/25"
                }`}
              >
                <span className="text-xl" aria-hidden>
                  {game.emoji}
                </span>
                <span className="flex-1 text-sm font-bold text-foreground">
                  {game.label}
                </span>
                <span
                  className={`grid h-5 w-5 place-items-center rounded-md border-2 ${
                    on
                      ? "border-accent bg-accent text-white"
                      : "border-white/25"
                  }`}
                  aria-hidden
                >
                  {on ? <Check className="h-3 w-3" /> : null}
                </span>
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => setPickerOpen(false)}
            className="btn-primary mt-2"
          >
            <Gamepad2 className="h-4 w-4" aria-hidden />
            Done
          </button>
        </div>
      </Modal>
    </div>
  );
}
