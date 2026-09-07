"use client";

import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Copy,
  DoorOpen,
  Loader2,
  Play,
  Users,
} from "lucide-react";
import type { Prompt, PromptGame } from "@/types";
import { gameTheme } from "@/lib/gameTheme";
import { useRoom, roomAction, type RoomView } from "@/hooks/useRoom";
import { PromptCard } from "./PromptCard";

const GAME_LABEL: Record<string, string> = {
  would_you_rather: "Would You Rather",
  never_have_i_ever: "Never Have I Ever",
  most_likely_to: "Most Likely To",
  "18plus": "18+ Uncensored",
};

function adaptPrompt(current: RoomView["currentPrompt"]): Prompt {
  return {
    id: current?.id ?? "none",
    game: (current?.game ?? "would_you_rather") as PromptGame,
    text: current?.text ?? "",
    category: current?.isAdult ? "18+" : "Friends",
    isAdult: !!current?.isAdult,
    groupSize: [],
    vibe: [],
    occasion: [],
  };
}

function Roster({ players }: { players: RoomView["players"] }) {
  return (
    <div className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-5 backdrop-blur">
      <p className="flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-foreground">
        <Users className="h-4 w-4 text-accent" aria-hidden />
        Players in room
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-muted">
          {players.length}
        </span>
      </p>
      {players.length === 0 ? (
        <p className="mt-3 text-sm text-subtle">
          Nobody has joined yet. Read the code out loud.
        </p>
      ) : (
        <ul className="mt-3 flex flex-wrap gap-2">
          {players.map((player) => (
            <li
              key={player.id}
              className="inline-flex items-center gap-2 rounded-full border-2 border-white/10 bg-white/5 px-3 py-1.5 text-sm font-bold text-foreground"
            >
              <span
                aria-hidden
                className="grid h-5 w-5 place-items-center rounded-full bg-accent text-[0.7rem] font-extrabold text-[color:var(--accent-contrast)]"
              >
                {player.name.slice(0, 1).toUpperCase()}
              </span>
              {player.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function RoomGame({
  room,
  isHost,
  onNext,
  onPrev,
  onLobby,
}: {
  room: RoomView;
  isHost?: boolean;
  onNext?: () => void;
  onPrev?: () => void;
  onLobby?: () => void;
}) {
  const prompt = adaptPrompt(room.currentPrompt);
  const themeKey = prompt.isAdult ? "18+" : prompt.game;
  const theme = gameTheme(themeKey);

  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center gap-5">
      <div className="flex w-full items-center justify-between gap-3 text-sm font-semibold">
        <span className={`font-bold ${theme.text}`}>
          Card {room.total === 0 ? 0 : room.index + 1} of {room.total}
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted backdrop-blur">
          Room {room.code}
        </span>
      </div>

      {room.total === 0 ? (
        <div className="w-full rounded-3xl border-2 border-white/10 bg-white/[0.03] p-10 text-center text-muted">
          This room has no prompts. Head back to the lobby and pick some games.
        </div>
      ) : (
        <div className="w-full" style={{ perspective: "1200px" }}>
          <div className="preserve-3d" key={prompt.id}>
            <PromptCard
              prompt={prompt}
              gameEmoji={theme.emoji}
              gameTitle={theme.label}
              themeKey={themeKey}
            />
          </div>
        </div>
      )}

      {isHost ? (
        <div className="flex w-full flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
          <button type="button" onClick={onPrev} className="btn-ghost sm:w-auto">
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
          <button
            type="button"
            onClick={onNext}
            className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[16rem]"
          >
            Next Question
            <ArrowRight className="h-5 w-5" aria-hidden />
          </button>
          <button type="button" onClick={onLobby} className="btn-ghost sm:w-auto">
            End round
          </button>
        </div>
      ) : (
        <p className="text-xs text-subtle">
          The host is running the deck. Answer out loud when it&apos;s your turn.
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Host
 * ------------------------------------------------------------------ */

export function HostRoom({
  code,
  partyName,
  games,
  onExit,
}: {
  code: string;
  partyName: string;
  games: string[];
  onExit: () => void;
}) {
  const { room, error } = useRoom(code);
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked, the code is on screen anyway */
    }
  }

  if (room?.phase === "playing") {
    return (
      <RoomGame
        room={room}
        isHost
        onNext={() => roomAction(code, { action: "next", dir: 1 })}
        onPrev={() => roomAction(code, { action: "next", dir: -1 })}
        onLobby={() => roomAction(code, { action: "reset" })}
      />
    );
  }

  const players = room?.players ?? [];
  const total = room?.total ?? 0;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="rounded-3xl border-2 border-lime-400/40 bg-lime-400/10 p-6 text-center backdrop-blur sm:p-8">
        <p className="text-xs font-extrabold uppercase tracking-[0.25em] text-lime-300">
          Room open{partyName ? ` · ${partyName}` : ""}
        </p>
        <p className="mt-3 font-mono text-5xl font-extrabold tracking-[0.35em] text-foreground sm:text-6xl">
          {code}
        </p>
        <button
          type="button"
          onClick={copyCode}
          className="btn-ghost mx-auto mt-4"
        >
          {copied ? (
            <Check className="h-4 w-4" aria-hidden />
          ) : (
            <Copy className="h-4 w-4" aria-hidden />
          )}
          {copied ? "Copied" : "Copy code"}
        </button>
        <p className="mx-auto mt-3 max-w-sm text-sm text-muted">
          Put this on the biggest screen in the house. Everyone else opens
          this page on their phone and types the code.
        </p>
      </div>

      <Roster players={players} />

      {error ? (
        <p className="text-center text-sm text-red-400">{error}</p>
      ) : null}

      <button
        type="button"
        disabled={!room || total === 0}
        onClick={() => roomAction(code, { action: "start" })}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-lime-400 px-5 py-4 text-base font-extrabold text-lime-950 shadow-[0_14px_36px_-10px_rgba(163,230,53,0.55)] transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] hover:-translate-y-0.5 hover:bg-lime-300 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {!room ? (
          <Loader2 className="h-5 w-5 animate-spin" aria-hidden />
        ) : (
          <Play className="h-5 w-5" aria-hidden />
        )}
        Start Game
      </button>

      <p className="text-center text-xs text-subtle">
        {games.map((g) => GAME_LABEL[g] ?? g).join(" · ") || "No games picked"}
        {total > 0 ? ` · ${total} prompts` : ""}
      </p>

      <button
        type="button"
        onClick={onExit}
        className="mx-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Close the room
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Player
 * ------------------------------------------------------------------ */

export function PlayerRoom({
  code,
  playerId,
  name,
  onExit,
}: {
  code: string;
  playerId: string;
  name: string;
  onExit: () => void;
}) {
  const { room, error } = useRoom(code, { playerId });

  if (error) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-white/10 bg-white/[0.03] p-8 text-center backdrop-blur">
        <p className="text-sm font-bold text-red-400">{error}</p>
        <button type="button" onClick={onExit} className="btn-ghost mt-4">
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to the form
        </button>
      </div>
    );
  }

  if (room?.phase === "playing") {
    return <RoomGame room={room} />;
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="rounded-3xl border-2 border-white/10 bg-white/[0.03] p-6 text-center backdrop-blur sm:p-8">
        <p className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.25em] text-accent">
          <DoorOpen className="h-4 w-4" aria-hidden />
          You&apos;re in
        </p>
        <p className="mt-3 text-2xl font-extrabold text-foreground">
          {room?.name || `Room ${code}`}
        </p>
        <p className="mt-1 font-mono text-sm tracking-[0.3em] text-muted">
          {code}
        </p>
        <p className="mt-3 inline-flex items-center gap-2 text-sm text-muted">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
          Playing as <span className="font-bold text-foreground">{name}</span>, waiting for the host to start…
        </p>
      </div>

      <Roster players={room?.players ?? []} />

      <button
        type="button"
        onClick={() => {
          roomAction(code, { action: "leave", playerId });
          onExit();
        }}
        className="mx-auto inline-flex items-center gap-1.5 text-xs font-semibold text-muted transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden />
        Leave the room
      </button>
    </div>
  );
}
