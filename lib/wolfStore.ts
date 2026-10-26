/* Server-only: Werewolf / Mafia Party Rooms. Stored in the party_boards
 * tables (kind 'wolf'): the room row holds the game state (roles included)
 * in `result`, and players only ever append rows to party_board_entries
 * (joins, night actions, votes). Only the host moves the game on, so the
 * state has a single writer. Each phone gets a view with just what its own
 * player may know. */

import { boardDb as db, randomId, type BoardRow, type EntryRow } from "./boardStore";
import {
  dealRoles,
  fixSetup,
  MAX_PLAYERS,
  MIN_PLAYERS,
  resolveNight,
  resolveVote,
  ROLES,
  winner,
  type Role,
  type Setup,
  type Skin,
  type Team,
} from "./werewolf";

export type WolfPhase = "lobby" | "roles" | "night" | "morning" | "day" | "verdict" | "end";

interface WolfState {
  phase: Exclude<WolfPhase, "lobby">;
  round: number;
  setup: Setup;
  order: string[];
  names: string[];
  roles: Role[];
  alive: boolean[];
  night?: { killed: number | null; saved: boolean };
  vote?: { counts: number[]; out: number | null; tie: boolean };
  winner: Team | null;
  story: string[];
  /** Bumps on every host action; acts are tied to it. */
  seq: number;
  /** Bumps on every new deal (play again). */
  game: number;
}

interface WolfConfig {
  skin: Skin;
}

export interface WolfPlayer {
  i: number;
  name: string;
  alive: boolean;
  /** End of game only. */
  role?: Role;
}

export interface WolfView {
  code: string;
  skin: Skin;
  phase: WolfPhase;
  round: number;
  isHost: boolean;
  setup?: Setup;
  players: WolfPlayer[];
  /** Lobby only: names of everyone who's joined. */
  lobby?: string[];
  me: { joined: boolean; i: number | null; name: string | null; role: Role | null; alive: boolean };
  /** For wolves: the rest of the pack, and their picks tonight. */
  pack?: { i: number; name: string; pick: number | null }[];
  /** My choice in the current phase (night pick / day vote / ready). */
  myAct: number | null;
  /** For the seer: everything they've learned. */
  checks?: { round: number; i: number; isWolf: boolean }[];
  /** How many alive players have acted in this phase. */
  acted: number;
  aliveCount: number;
  night?: { killed: number | null; saved: boolean; role?: Role };
  vote?: { counts: number[]; out: number | null; tie: boolean; role?: Role };
  winner: Team | null;
  /** True once a side has won (the next host step shows the end). */
  over: boolean;
  story: string[];
}

const LIFETIME_MS = 2 * 86_400_000;
const CODE_RE = /^[a-z0-9]{6}$/;

const str = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const validPid = (v: unknown): v is string => typeof v === "string" && /^[A-Za-z0-9_-]{12,40}$/.test(v);

async function room(code: string): Promise<BoardRow | null> {
  const c = code.toLowerCase();
  if (!CODE_RE.test(c)) return null;
  const b = await db.getBoard(c);
  if (!b || b.kind !== "wolf" || new Date(b.expires_at).getTime() < Date.now()) return null;
  return b;
}

const stateOf = (b: BoardRow) => (b.result as unknown as WolfState | null) ?? null;
const skinOf = (b: BoardRow): Skin => ((b.config as unknown as WolfConfig).skin === "mafia" ? "mafia" : "werewolf");

/** Joined players in join order (latest name wins), capped. */
function joins(entries: EntryRow[]): { pid: string; name: string }[] {
  const map = new Map<string, string>();
  for (const e of entries) {
    const p = e.payload as { t?: string; pid?: string };
    if (p?.t === "join" && validPid(p.pid)) {
      if (!map.has(p.pid) && map.size >= MAX_PLAYERS) continue;
      map.set(p.pid, e.name);
    }
  }
  return Array.from(map, ([pid, name]) => ({ pid, name }));
}

/** Latest act per player for this step of the game. */
function acts(entries: EntryRow[], seq: number): Map<string, number> {
  const m = new Map<string, number>();
  for (const e of entries) {
    const p = e.payload as { t?: string; pid?: string; seq?: number; target?: number };
    if (p?.t === "act" && p.seq === seq && validPid(p.pid) && Number.isInteger(p.target)) m.set(p.pid, p.target as number);
  }
  return m;
}

/* ------------------------------------------------------------------ */

export async function createWolfRoom(input: { skin: unknown; pid: unknown; name: unknown }): Promise<{ code: string; hostToken: string } | null> {
  if (!validPid(input.pid)) return null;
  const name = str(input.name, 16) || "Host";
  const now = new Date();
  let code = randomId(6);
  for (let k = 0; k < 4 && (await db.getBoard(code)); k++) code = randomId(6);
  const hostToken = randomId(24);
  await db.insertBoard({
    id: code,
    kind: "wolf",
    owner_token: hostToken,
    title: "",
    config: { skin: input.skin === "mafia" ? "mafia" : "werewolf" },
    result: null,
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + LIFETIME_MS).toISOString(),
  });
  await db.addEntry({ board_id: code, name, payload: { t: "join", pid: input.pid }, score: null, created_at: now.toISOString() });
  return { code, hostToken };
}

export async function joinWolfRoom(code: string, pid: unknown, nameRaw: unknown): Promise<"ok" | "missing" | "started" | "full" | "bad"> {
  const b = await room(code);
  if (!b) return "missing";
  if (!validPid(pid)) return "bad";
  const name = str(nameRaw, 16);
  if (!name) return "bad";
  const st = stateOf(b);
  const entries = await db.entries(b.id, 3000);
  const list = joins(entries);
  if (st) return list.some((j) => j.pid === pid) ? "ok" : "started";
  if (!list.some((j) => j.pid === pid) && list.length >= MAX_PLAYERS) return "full";
  await db.addEntry({ board_id: b.id, name, payload: { t: "join", pid }, score: null, created_at: new Date().toISOString() });
  return "ok";
}

export async function wolfAct(code: string, pid: unknown, targetRaw: unknown): Promise<boolean> {
  const b = await room(code);
  const st = b && stateOf(b);
  if (!b || !st || !validPid(pid)) return false;
  const me = st.order.indexOf(pid);
  if (me < 0) return false;
  const target = Number(targetRaw);
  if (!Number.isInteger(target)) return false;
  const n = st.order.length;
  if (st.phase === "roles") {
    if (target !== 0) return false;
  } else if (st.phase === "night") {
    if (!st.alive[me] || target < 0 || target >= n || !st.alive[target]) return false;
    const role = st.roles[me];
    if (role === "wolf" && st.roles[target] === "wolf") return false;
    if (role === "seer" && target === me) return false;
    // The seer's look is final: no peeking at a second player.
    if (role === "seer" && acts(await db.entries(b.id, 3000), st.seq).has(pid)) return false;
  } else if (st.phase === "day") {
    if (!st.alive[me] || target < -1 || target >= n || (target >= 0 && !st.alive[target])) return false;
  } else return false;
  await db.addEntry({
    board_id: b.id,
    name: st.names[me],
    payload: { t: "act", pid, seq: st.seq, game: st.game, ph: st.phase, round: st.round, target },
    score: null,
    created_at: new Date().toISOString(),
  });
  return true;
}

/** Host controls: start, next, again, lobby. `expect` guards double taps. */
export async function wolfHost(
  code: string,
  token: unknown,
  action: unknown,
  expect: unknown,
  setupRaw: unknown,
): Promise<"ok" | "forbidden" | "stale" | "few" | "missing"> {
  const b = await room(code);
  if (!b) return "missing";
  if (typeof token !== "string" || token !== b.owner_token) return "forbidden";
  const st = stateOf(b);
  const phase: WolfPhase = st?.phase ?? "lobby";
  if (typeof expect === "string" && expect !== phase) return "stale";
  const entries = await db.entries(b.id, 3000);
  const skin = skinOf(b);
  const R = ROLES[skin];

  if (action === "lobby") {
    await db.setResult(b.id, null);
    return "ok";
  }

  if (action === "start" || (action === "again" && st)) {
    const people = action === "again" && st ? st.order.map((pid, i) => ({ pid, name: st.names[i] })) : joins(entries);
    if (people.length < MIN_PLAYERS) return "few";
    const setup = fixSetup(people.length, (setupRaw as Partial<Setup>) ?? st?.setup ?? {});
    const next: WolfState = {
      phase: "roles",
      round: 1,
      setup,
      order: people.map((p) => p.pid),
      names: people.map((p) => p.name),
      roles: dealRoles(people.length, setup),
      alive: people.map(() => true),
      winner: null,
      story: [],
      seq: (st?.seq ?? 0) + 1,
      game: (st?.game ?? 0) + 1,
    };
    await db.setResult(b.id, next);
    return "ok";
  }

  if (action !== "next" || !st) return "stale";
  const s: WolfState = { ...st, seq: st.seq + 1 };
  const picks = acts(entries, st.seq);
  const pickOf = (i: number) => picks.get(st.order[i]);

  if (st.phase === "roles") {
    s.phase = "night";
  } else if (st.phase === "night") {
    const wolfPicks = st.roles.flatMap((r, i) => (r === "wolf" && st.alive[i] && pickOf(i) !== undefined ? [pickOf(i)!] : []));
    const doc = st.roles.findIndex((r, i) => r === "doctor" && st.alive[i]);
    const save = doc >= 0 ? (pickOf(doc) ?? null) : null;
    const res = resolveNight(wolfPicks, save, st.alive);
    const alive = [...st.alive];
    if (res.killed !== null) alive[res.killed] = false;
    s.alive = alive;
    s.night = { killed: res.killed, saved: res.saved };
    s.story = [
      ...st.story,
      res.killed !== null
        ? `Night ${st.round}: ${st.names[res.killed]} was ${skin === "werewolf" ? "eaten" : "taken out"}.`
        : res.saved
          ? `Night ${st.round}: the Doctor saved the victim.`
          : `Night ${st.round}: nobody died.`,
    ];
    s.winner = winner(st.roles, alive);
    s.phase = "morning";
  } else if (st.phase === "morning") {
    s.phase = st.winner ? "end" : "day";
  } else if (st.phase === "day") {
    const votes = st.order.flatMap((_, i) => (st.alive[i] && pickOf(i) !== undefined ? [pickOf(i)!] : []));
    const res = resolveVote(votes, st.alive);
    const alive = [...st.alive];
    if (res.out !== null) alive[res.out] = false;
    s.alive = alive;
    s.vote = res;
    s.story = [
      ...st.story,
      res.out !== null
        ? `Day ${st.round}: ${st.names[res.out]} was voted out${st.setup.reveal ? ` (${R[st.roles[res.out]].name})` : ""}.`
        : `Day ${st.round}: ${res.tie ? "a tie, " : ""}nobody was voted out.`,
    ];
    s.winner = winner(st.roles, alive);
    s.phase = "verdict";
  } else if (st.phase === "verdict") {
    if (st.winner) s.phase = "end";
    else {
      s.phase = "night";
      s.round = st.round + 1;
      s.night = undefined;
      s.vote = undefined;
    }
  } else return "stale";
  await db.setResult(b.id, s);
  return "ok";
}

export async function getWolfView(code: string, pidRaw: unknown, token: unknown): Promise<WolfView | null> {
  const b = await room(code);
  if (!b) return null;
  const pid = validPid(pidRaw) ? pidRaw : null;
  const isHost = typeof token === "string" && token === b.owner_token;
  const skin = skinOf(b);
  const st = stateOf(b);
  const entries = await db.entries(b.id, 3000);

  if (!st) {
    const list = joins(entries);
    const mine = pid ? list.find((j) => j.pid === pid) : undefined;
    return {
      code: b.id,
      skin,
      phase: "lobby",
      round: 0,
      isHost,
      players: [],
      lobby: list.map((j) => j.name),
      me: { joined: Boolean(mine), i: null, name: mine?.name ?? null, role: null, alive: true },
      myAct: null,
      acted: 0,
      aliveCount: list.length,
      winner: null,
      over: false,
      story: [],
    };
  }

  const n = st.order.length;
  const me = pid ? st.order.indexOf(pid) : -1;
  const role = me >= 0 ? st.roles[me] : null;
  const ended = st.phase === "end";
  const picks = acts(entries, st.seq);
  const counting = st.phase === "night" || st.phase === "day" || st.phase === "roles";
  const acted = counting
    ? st.order.filter((p, i) => (st.phase === "roles" || st.alive[i]) && picks.has(p)).length
    : 0;

  const view: WolfView = {
    code: b.id,
    skin,
    phase: st.phase,
    round: st.round,
    isHost,
    setup: st.setup,
    players: st.names.map((name, i) => ({ i, name, alive: st.alive[i], role: ended ? st.roles[i] : undefined })),
    me: { joined: me >= 0, i: me >= 0 ? me : null, name: me >= 0 ? st.names[me] : null, role, alive: me >= 0 ? st.alive[me] : false },
    myAct: me >= 0 ? (picks.get(st.order[me]) ?? null) : null,
    acted,
    aliveCount: st.phase === "roles" ? n : st.alive.filter(Boolean).length,
    winner: ended ? st.winner : null,
    over: Boolean(st.winner) && (st.phase === "morning" || st.phase === "verdict" || ended),
    story: st.story,
  };

  if (role === "wolf") {
    view.pack = st.roles.flatMap((r, i) =>
      r === "wolf" && i !== me ? [{ i, name: st.names[i], pick: st.phase === "night" ? (picks.get(st.order[i]) ?? null) : null }] : [],
    );
  }

  if (role === "seer" && pid) {
    // Every check this seer made this game, from their own night act rows.
    const byRound = new Map<number, number>();
    for (const e of entries) {
      const p = e.payload as { t?: string; pid?: string; game?: number; ph?: string; round?: number; target?: number };
      if (p?.t === "act" && p.pid === pid && p.game === st.game && p.ph === "night" && typeof p.round === "number" && Number.isInteger(p.target)) {
        byRound.set(p.round, p.target as number);
      }
    }
    view.checks = Array.from(byRound, ([round, i]) => ({ round, i, isWolf: st.roles[i] === "wolf" }))
      .filter((c) => c.i >= 0 && c.i < n && c.i !== me)
      .sort((x, z) => x.round - z.round);
  }

  if (st.night && (st.phase === "morning" || st.phase === "day" || st.phase === "verdict" || ended)) {
    view.night = { ...st.night, role: st.night.killed !== null && st.setup.reveal ? st.roles[st.night.killed] : undefined };
  }
  if (st.vote && (st.phase === "verdict" || ended)) {
    view.vote = { ...st.vote, role: st.vote.out !== null && st.setup.reveal ? st.roles[st.vote.out] : undefined };
  }
  return view;
}
