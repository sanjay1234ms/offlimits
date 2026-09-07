import gamesData from "@/data/games.json";
import { ADULT_TEASERS } from "@/data/adultDeck";

/*
 * In-memory party-room store. Lives for the life of the Node process, so it
 * works across browsers/tabs against a single `next dev` / `next start`
 * server. It is NOT durable across restarts or serverless instances, wire a
 * real datastore (Redis, Durable Object, etc.) before deploying multiplayer.
 */

export interface RoomPrompt {
  id: string;
  game: string;
  text: string;
  isAdult: boolean;
}

export interface RoomPlayer {
  id: string;
  name: string;
  lastSeen: number;
}

interface Room {
  code: string;
  name: string;
  games: string[];
  hostId: string;
  players: RoomPlayer[];
  phase: "lobby" | "playing";
  prompts: RoomPrompt[];
  index: number;
  createdAt: number;
  startedAt: number | null;
}

/** Shape sent to clients. */
export interface RoomView {
  code: string;
  name: string;
  games: string[];
  phase: "lobby" | "playing";
  players: { id: string; name: string }[];
  index: number;
  total: number;
  currentPrompt: RoomPrompt | null;
}

/*
 * Each API route is bundled separately, so a plain module-level Map would give
 * every route its own copy. Pin it to globalThis so `POST /api/rooms` and
 * `GET /api/rooms/[code]` share one store for the life of the process.
 */
const globalForRooms = globalThis as unknown as {
  __offlimitsRooms?: Map<string, Room>;
};
const ROOMS: Map<string, Room> =
  globalForRooms.__offlimitsRooms ??
  (globalForRooms.__offlimitsRooms = new Map<string, Room>());

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PLAYER_TTL = 25_000; // drop a player not seen in 25s
const ROOM_TTL = 3 * 60 * 60 * 1000; // 3 hours

const STANDARD_GAMES = new Set([
  "would_you_rather",
  "never_have_i_ever",
  "most_likely_to",
]);

interface RawPromptRow {
  id: string;
  game: string;
  prompt: string;
  isAdult: boolean;
}

function makeCode(): string {
  let code = "";
  do {
    code = "";
    for (let i = 0; i < 6; i++) {
      code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
    }
  } while (ROOMS.has(code));
  return code;
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPrompts(games: string[]): RoomPrompt[] {
  const pool: RoomPrompt[] = [];
  const rows = gamesData as unknown as RawPromptRow[];
  for (const game of games) {
    if (STANDARD_GAMES.has(game)) {
      for (const row of rows) {
        if (row.game === game && !row.isAdult) {
          pool.push({
            id: row.id,
            game: row.game,
            text: row.prompt,
            isAdult: false,
          });
        }
      }
    } else if (game === "18plus") {
      for (const teaser of ADULT_TEASERS) {
        pool.push({
          id: teaser.id,
          game: teaser.game,
          text: teaser.prompt,
          isAdult: true,
        });
      }
    }
  }
  return shuffle(pool);
}

function prune(): void {
  const now = Date.now();
  Array.from(ROOMS.keys()).forEach((code) => {
    const room = ROOMS.get(code);
    if (!room) return;
    if (now - room.createdAt > ROOM_TTL) {
      ROOMS.delete(code);
      return;
    }
    room.players = room.players.filter(
      (p: RoomPlayer) => now - p.lastSeen < PLAYER_TTL,
    );
  });
}

function view(room: Room): RoomView {
  return {
    code: room.code,
    name: room.name,
    games: room.games,
    phase: room.phase,
    players: room.players.map((p) => ({ id: p.id, name: p.name })),
    index: room.index,
    total: room.prompts.length,
    currentPrompt:
      room.phase === "playing" ? (room.prompts[room.index] ?? null) : null,
  };
}

export function createRoom(input: {
  name?: string;
  games?: unknown;
  hostId: string;
}): RoomView {
  prune();
  const games = Array.isArray(input.games)
    ? input.games.filter((g): g is string => typeof g === "string")
    : [];
  const room: Room = {
    code: makeCode(),
    name: (input.name ?? "").toString().slice(0, 40),
    games,
    hostId: input.hostId,
    players: [],
    phase: "lobby",
    prompts: buildPrompts(games),
    index: 0,
    createdAt: Date.now(),
    startedAt: null,
  };
  ROOMS.set(room.code, room);
  return view(room);
}

export function getRoom(code: string): RoomView | null {
  prune();
  const room = ROOMS.get(code);
  return room ? view(room) : null;
}

export function touchPlayer(code: string, playerId: string): void {
  const room = ROOMS.get(code);
  if (!room) return;
  const player = room.players.find((p) => p.id === playerId);
  if (player) player.lastSeen = Date.now();
}

export function joinRoom(
  code: string,
  playerId: string,
  name: string,
): RoomView | null {
  prune();
  const room = ROOMS.get(code);
  if (!room) return null;
  const clean = (name || "").toString().trim().slice(0, 24) || "Player";
  const existing = room.players.find((p) => p.id === playerId);
  if (existing) {
    existing.name = clean;
    existing.lastSeen = Date.now();
  } else {
    room.players.push({ id: playerId, name: clean, lastSeen: Date.now() });
  }
  return view(room);
}

export function leaveRoom(code: string, playerId: string): void {
  const room = ROOMS.get(code);
  if (!room) return;
  room.players = room.players.filter((p) => p.id !== playerId);
}

export function startRoom(code: string): RoomView | null {
  const room = ROOMS.get(code);
  if (!room) return null;
  room.phase = "playing";
  room.index = 0;
  room.startedAt = Date.now();
  return view(room);
}

export function advanceRoom(code: string, dir: 1 | -1 = 1): RoomView | null {
  const room = ROOMS.get(code);
  if (!room || room.prompts.length === 0) {
    return room ? view(room) : null;
  }
  const len = room.prompts.length;
  room.index = (room.index + dir + len) % len;
  return view(room);
}

export function resetRoomToLobby(code: string): RoomView | null {
  const room = ROOMS.get(code);
  if (!room) return null;
  room.phase = "lobby";
  room.index = 0;
  room.startedAt = null;
  return view(room);
}
