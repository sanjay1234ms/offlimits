import gamesData from "@/data/games.json";
import { ADULT_TEASERS } from "@/data/adultDeck";

/*
 * Party-room store. Uses Supabase (Postgres over its REST API) when
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set, so every serverless
 * instance on Vercel sees the same rooms. Table setup: supabase/party_rooms.sql.
 * Without those env vars it falls back to an in-memory Map, which is fine
 * for a single `next dev` process.
 *
 * Rooms store prompt IDs, not prompt text, so each poll stays a few KB; the
 * text is resolved here from the bundled decks.
 */

export interface RoomPrompt {
  id: string;
  game: string;
  text: string;
  isAdult: boolean;
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

interface RoomRow {
  code: string;
  name: string;
  games: string[];
  host_id: string;
  phase: "lobby" | "playing";
  prompt_ids: string[];
  idx: number;
  created_at: string;
  started_at: string | null;
}

interface PlayerRow {
  code: string;
  player_id: string;
  name: string;
  last_seen: string;
}

const CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
const PLAYER_TTL = 25_000; // drop a player not seen in 25s
const ROOM_TTL = 3 * 60 * 60 * 1000; // 3 hours

const STANDARD_GAMES = new Set(["would_you_rather", "never_have_i_ever", "most_likely_to"]);

interface RawPromptRow {
  id: string;
  game: string;
  prompt: string;
  isAdult: boolean;
}

/* ------------------------------------------------------------------ */
/* Prompt catalogue                                                    */
/* ------------------------------------------------------------------ */

const PROMPTS_BY_ID = new Map<string, RoomPrompt>();
for (const row of gamesData as unknown as RawPromptRow[]) {
  if (STANDARD_GAMES.has(row.game) && !row.isAdult) {
    PROMPTS_BY_ID.set(row.id, { id: row.id, game: row.game, text: row.prompt, isAdult: false });
  }
}
for (const t of ADULT_TEASERS) {
  PROMPTS_BY_ID.set(t.id, { id: t.id, game: t.game, text: t.prompt, isAdult: true });
}

function shuffle<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function buildPromptIds(games: string[]): string[] {
  const ids: string[] = [];
  for (const p of Array.from(PROMPTS_BY_ID.values())) {
    const wanted = p.isAdult ? games.includes("18plus") : games.includes(p.game);
    if (wanted) ids.push(p.id);
  }
  return shuffle(ids);
}

function makeCode(): string {
  let code = "";
  for (let i = 0; i < 6; i++) code += CODE_ALPHABET[Math.floor(Math.random() * CODE_ALPHABET.length)];
  return code;
}

function view(room: RoomRow, players: PlayerRow[]): RoomView {
  const now = Date.now();
  const id = room.prompt_ids[room.idx];
  return {
    code: room.code,
    name: room.name,
    games: room.games,
    phase: room.phase,
    players: players
      .filter((p) => now - new Date(p.last_seen).getTime() < PLAYER_TTL)
      .map((p) => ({ id: p.player_id, name: p.name })),
    index: room.idx,
    total: room.prompt_ids.length,
    currentPrompt: room.phase === "playing" && id ? (PROMPTS_BY_ID.get(id) ?? null) : null,
  };
}

const expired = (room: RoomRow) => Date.now() - new Date(room.created_at).getTime() > ROOM_TTL;

/* ------------------------------------------------------------------ */
/* Storage backends                                                    */
/* ------------------------------------------------------------------ */

interface Backend {
  insertRoom(room: RoomRow): Promise<boolean>; // false = code taken
  getRoom(code: string): Promise<RoomRow | null>;
  updateRoom(code: string, patch: Partial<RoomRow>): Promise<RoomRow | null>;
  players(code: string): Promise<PlayerRow[]>;
  upsertPlayer(p: PlayerRow): Promise<void>;
  touchPlayer(code: string, playerId: string): Promise<void>;
  removePlayer(code: string, playerId: string): Promise<void>;
  cleanup(): Promise<void>;
}

const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function sb(path: string, init: RequestInit = {}, prefer = "return=representation"): Promise<Response> {
  return fetch(`${SB_URL}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: SB_KEY!,
      Authorization: `Bearer ${SB_KEY}`,
      "Content-Type": "application/json",
      Prefer: prefer,
      ...init.headers,
    },
  });
}

const enc = encodeURIComponent;

const supabaseBackend: Backend = {
  async insertRoom(room) {
    const res = await sb("party_rooms", { method: "POST", body: JSON.stringify(room) });
    if (res.status === 409) return false;
    if (!res.ok) throw new Error(`room insert ${res.status} ${await res.text()}`);
    return true;
  },
  async getRoom(code) {
    const res = await sb(`party_rooms?code=eq.${enc(code)}&select=*`);
    if (!res.ok) throw new Error(`room read ${res.status}`);
    return ((await res.json()) as RoomRow[])[0] ?? null;
  },
  async updateRoom(code, patch) {
    const res = await sb(`party_rooms?code=eq.${enc(code)}`, { method: "PATCH", body: JSON.stringify(patch) });
    if (!res.ok) throw new Error(`room update ${res.status}`);
    return ((await res.json()) as RoomRow[])[0] ?? null;
  },
  async players(code) {
    const since = new Date(Date.now() - PLAYER_TTL).toISOString();
    const res = await sb(`party_room_players?code=eq.${enc(code)}&last_seen=gt.${enc(since)}&select=*&order=joined_at.asc`);
    if (!res.ok) throw new Error(`players read ${res.status}`);
    return (await res.json()) as PlayerRow[];
  },
  async upsertPlayer(p) {
    const res = await sb(
      "party_room_players?on_conflict=code,player_id",
      { method: "POST", body: JSON.stringify(p) },
      "resolution=merge-duplicates,return=minimal",
    );
    if (!res.ok) throw new Error(`player upsert ${res.status} ${await res.text()}`);
  },
  async touchPlayer(code, playerId) {
    await sb(
      `party_room_players?code=eq.${enc(code)}&player_id=eq.${enc(playerId)}`,
      { method: "PATCH", body: JSON.stringify({ last_seen: new Date().toISOString() }) },
      "return=minimal",
    );
  },
  async removePlayer(code, playerId) {
    await sb(`party_room_players?code=eq.${enc(code)}&player_id=eq.${enc(playerId)}`, { method: "DELETE" }, "return=minimal");
  },
  async cleanup() {
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    await sb(`party_rooms?created_at=lt.${enc(cutoff)}`, { method: "DELETE" }, "return=minimal");
  },
};

/* In-memory fallback, pinned to globalThis so every route shares it. */
interface MemStore {
  rooms: Map<string, RoomRow>;
  players: Map<string, PlayerRow[]>;
}
const g = globalThis as unknown as { __offlimitsRooms2?: MemStore };
const MEM: MemStore =
  g.__offlimitsRooms2 ??
  (g.__offlimitsRooms2 = { rooms: new Map<string, RoomRow>(), players: new Map<string, PlayerRow[]>() });

const memoryBackend: Backend = {
  async insertRoom(room) {
    if (MEM.rooms.has(room.code)) return false;
    MEM.rooms.set(room.code, { ...room });
    return true;
  },
  async getRoom(code) {
    const r = MEM.rooms.get(code);
    return r ? { ...r } : null;
  },
  async updateRoom(code, patch) {
    const r = MEM.rooms.get(code);
    if (!r) return null;
    Object.assign(r, patch);
    return { ...r };
  },
  async players(code) {
    const now = Date.now();
    return (MEM.players.get(code) ?? []).filter((p) => now - new Date(p.last_seen).getTime() < PLAYER_TTL);
  },
  async upsertPlayer(p) {
    const list = MEM.players.get(p.code) ?? [];
    const i = list.findIndex((x) => x.player_id === p.player_id);
    if (i >= 0) list[i] = { ...list[i], ...p };
    else list.push({ ...p });
    MEM.players.set(p.code, list);
  },
  async touchPlayer(code, playerId) {
    const p = (MEM.players.get(code) ?? []).find((x) => x.player_id === playerId);
    if (p) p.last_seen = new Date().toISOString();
  },
  async removePlayer(code, playerId) {
    MEM.players.set(code, (MEM.players.get(code) ?? []).filter((p) => p.player_id !== playerId));
  },
  async cleanup() {
    for (const [code, r] of Array.from(MEM.rooms.entries())) {
      if (expired(r)) {
        MEM.rooms.delete(code);
        MEM.players.delete(code);
      }
    }
  },
};

export const roomStoreMode: "supabase" | "memory" = SB_URL && SB_KEY ? "supabase" : "memory";

/** True once Supabase says the tables don't exist yet (SQL not run). */
let tablesMissing = false;

/** Supabase with a safety net: if the tables haven't been created yet,
 * fall back to memory instead of failing every room request. */
const db: Backend =
  roomStoreMode === "memory"
    ? memoryBackend
    : (Object.fromEntries(
        (Object.keys(supabaseBackend) as (keyof Backend)[]).map((k) => [
          k,
          async (...args: unknown[]) => {
            if (tablesMissing) return (memoryBackend[k] as (...a: unknown[]) => unknown)(...args);
            try {
              return await (supabaseBackend[k] as (...a: unknown[]) => unknown)(...args);
            } catch (err) {
              if (/\b404\b|PGRST205|does not exist/.test(String(err))) {
                tablesMissing = true;
                console.warn("[rooms] Supabase tables missing; using memory. Run supabase/party_rooms.sql.");
                return (memoryBackend[k] as (...a: unknown[]) => unknown)(...args);
              }
              throw err;
            }
          },
        ]),
      ) as unknown as Backend);

/* ------------------------------------------------------------------ */
/* Public API (used by app/api/rooms)                                  */
/* ------------------------------------------------------------------ */

async function liveRoom(code: string): Promise<RoomRow | null> {
  const room = await db.getRoom(code);
  return room && !expired(room) ? room : null;
}

async function withPlayers(room: RoomRow | null): Promise<RoomView | null> {
  if (!room) return null;
  return view(room, await db.players(room.code));
}

export async function createRoom(input: { name?: string; games?: unknown; hostId: string }): Promise<RoomView> {
  // Occasional tidy-up of day-old rooms; never blocks room creation.
  if (Math.random() < 0.2) db.cleanup().catch(() => {});
  const games = Array.isArray(input.games) ? input.games.filter((x): x is string => typeof x === "string").slice(0, 10) : [];
  const base = {
    name: (input.name ?? "").toString().slice(0, 40),
    games,
    host_id: input.hostId.slice(0, 100),
    phase: "lobby" as const,
    prompt_ids: buildPromptIds(games),
    idx: 0,
    created_at: new Date().toISOString(),
    started_at: null,
  };
  for (let attempt = 0; attempt < 6; attempt++) {
    const room: RoomRow = { ...base, code: makeCode() };
    if (await db.insertRoom(room)) return view(room, []);
  }
  throw new Error("Could not allocate a room code");
}

/** Reads a room; when playerId is given, also heartbeats that player. */
export async function getRoom(code: string, playerId?: string | null): Promise<RoomView | null> {
  if (playerId) await db.touchPlayer(code, playerId.slice(0, 100));
  return withPlayers(await liveRoom(code));
}

export async function joinRoom(code: string, playerId: string, name: string): Promise<RoomView | null> {
  const room = await liveRoom(code);
  if (!room) return null;
  const clean = (name || "").toString().trim().slice(0, 24) || "Player";
  await db.upsertPlayer({ code, player_id: playerId.slice(0, 100), name: clean, last_seen: new Date().toISOString() });
  return withPlayers(room);
}

export async function leaveRoom(code: string, playerId: string): Promise<void> {
  await db.removePlayer(code, playerId);
}

export async function startRoom(code: string): Promise<RoomView | null> {
  if (!(await liveRoom(code))) return null;
  return withPlayers(await db.updateRoom(code, { phase: "playing", idx: 0, started_at: new Date().toISOString() }));
}

export async function advanceRoom(code: string, dir: 1 | -1 = 1): Promise<RoomView | null> {
  const room = await liveRoom(code);
  if (!room) return null;
  const len = room.prompt_ids.length;
  if (!len) return withPlayers(room);
  return withPlayers(await db.updateRoom(code, { idx: (room.idx + dir + len) % len }));
}

export async function resetRoomToLobby(code: string): Promise<RoomView | null> {
  if (!(await liveRoom(code))) return null;
  return withPlayers(await db.updateRoom(code, { phase: "lobby", idx: 0, started_at: null }));
}
