"use client";

import { useEffect, useRef, useState } from "react";

export interface RoomView {
  code: string;
  name: string;
  games: string[];
  phase: "lobby" | "playing";
  players: { id: string; name: string }[];
  index: number;
  total: number;
  currentPrompt: {
    id: string;
    game: string;
    text: string;
    isAdult: boolean;
  } | null;
}

interface UseRoomOptions {
  /** When set, the poll also heartbeats this player so they stay on the roster. */
  playerId?: string;
  intervalMs?: number;
}

/** Polls `/api/rooms/[code]` on an interval and returns the latest state. */
export function useRoom(code: string | null, options: UseRoomOptions = {}) {
  const { playerId, intervalMs = 1500 } = options;
  const [room, setRoom] = useState<RoomView | null>(null);
  const [error, setError] = useState<string | null>(null);
  const stopped = useRef(false);
  const misses = useRef(0);

  useEffect(() => {
    if (!code) return;
    stopped.current = false;
    misses.current = 0;

    async function tick() {
      try {
        const query = playerId ? `?p=${encodeURIComponent(playerId)}` : "";
        const res = await fetch(`/api/rooms/${code}${query}`, {
          cache: "no-store",
        });
        if (stopped.current) return;
        if (res.status === 404) {
          // One miss can be a blip; only call it closed after a few in a row.
          misses.current += 1;
          if (misses.current >= 3) setError("That room has closed.");
          return;
        }
        misses.current = 0;
        if (!res.ok) {
          setError("Lost the room. Retrying…");
          return;
        }
        const data = (await res.json()) as RoomView;
        if (stopped.current) return;
        setRoom(data);
        setError(null);
      } catch {
        if (!stopped.current) setError("Connection dropped. Retrying…");
      }
    }

    tick();
    const id = setInterval(tick, intervalMs);
    return () => {
      stopped.current = true;
      clearInterval(id);
    };
  }, [code, playerId, intervalMs]);

  return { room, error };
}

/** Fire-and-forget POST helper for room actions. */
export async function roomAction(
  code: string,
  body: Record<string, unknown>,
): Promise<RoomView | null> {
  try {
    const res = await fetch(`/api/rooms/${code}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    if (!res.ok) return null;
    return (await res.json()) as RoomView;
  } catch {
    return null;
  }
}
