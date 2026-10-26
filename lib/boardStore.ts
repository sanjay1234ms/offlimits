/* Server-only: multi-phone party boards ("How well do you know…" quizzes and
 * prediction pools). Supabase when configured (supabase/party_boards.sql),
 * in-memory otherwise or if the tables are missing. Quiz answers and pool
 * results never leave the server until they're meant to. */

export type BoardKind = "quiz" | "pool";

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
}

export interface PoolField {
  id: string;
  label: string;
  type: "date" | "number" | "choice" | "text";
  unit?: string;
  options?: string[];
}

export interface QuizConfig {
  subject: string;
  questions: QuizQuestion[];
}

export interface PoolConfig {
  subject: string;
  fields: PoolField[];
}

interface BoardRow {
  id: string;
  kind: BoardKind;
  owner_token: string;
  title: string;
  config: QuizConfig | PoolConfig;
  result: Record<string, string> | null;
  created_at: string;
  expires_at: string;
}

interface EntryRow {
  id?: number;
  board_id: string;
  name: string;
  payload: Record<string, unknown>;
  score: number | null;
  created_at: string;
}

/* ------------------------------------------------------------------ */
/* Backends                                                            */
/* ------------------------------------------------------------------ */

const SB_URL = process.env.SUPABASE_URL?.replace(/\/$/, "");
const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const enc = encodeURIComponent;

async function sb(path: string, init: RequestInit = {}, prefer = "return=representation") {
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

interface Backend {
  insertBoard(b: BoardRow): Promise<void>;
  getBoard(id: string): Promise<BoardRow | null>;
  setResult(id: string, result: Record<string, string>): Promise<void>;
  entries(id: string): Promise<EntryRow[]>;
  addEntry(e: EntryRow): Promise<void>;
  setScores(scores: { id: number; score: number }[]): Promise<void>;
}

const supabaseBackend: Backend = {
  async insertBoard(b) {
    const res = await sb("party_boards", { method: "POST", body: JSON.stringify(b) }, "return=minimal");
    if (!res.ok) throw new Error(`board insert ${res.status} ${await res.text()}`);
  },
  async getBoard(id) {
    const res = await sb(`party_boards?id=eq.${enc(id)}&select=*`);
    if (!res.ok) throw new Error(`board read ${res.status}`);
    return ((await res.json()) as BoardRow[])[0] ?? null;
  },
  async setResult(id, result) {
    const res = await sb(`party_boards?id=eq.${enc(id)}`, { method: "PATCH", body: JSON.stringify({ result }) }, "return=minimal");
    if (!res.ok) throw new Error(`board result ${res.status}`);
  },
  async entries(id) {
    const res = await sb(`party_board_entries?board_id=eq.${enc(id)}&select=*&order=created_at.asc&limit=500`);
    if (!res.ok) throw new Error(`entries read ${res.status}`);
    return (await res.json()) as EntryRow[];
  },
  async addEntry(e) {
    const res = await sb("party_board_entries", { method: "POST", body: JSON.stringify(e) }, "return=minimal");
    if (!res.ok) throw new Error(`entry insert ${res.status} ${await res.text()}`);
  },
  async setScores(scores) {
    await Promise.all(
      scores.map((s) =>
        sb(`party_board_entries?id=eq.${s.id}`, { method: "PATCH", body: JSON.stringify({ score: s.score }) }, "return=minimal"),
      ),
    );
  },
};

interface Mem {
  boards: Map<string, BoardRow>;
  entries: Map<string, EntryRow[]>;
  seq: number;
}
const g = globalThis as unknown as { __offlimitsBoards?: Mem };
const MEM: Mem = g.__offlimitsBoards ?? (g.__offlimitsBoards = { boards: new Map(), entries: new Map(), seq: 1 });

const memoryBackend: Backend = {
  async insertBoard(b) {
    MEM.boards.set(b.id, structuredClone(b));
  },
  async getBoard(id) {
    const b = MEM.boards.get(id);
    return b ? structuredClone(b) : null;
  },
  async setResult(id, result) {
    const b = MEM.boards.get(id);
    if (b) b.result = result;
  },
  async entries(id) {
    return structuredClone(MEM.entries.get(id) ?? []);
  },
  async addEntry(e) {
    const list = MEM.entries.get(e.board_id) ?? [];
    list.push({ ...structuredClone(e), id: MEM.seq++ });
    MEM.entries.set(e.board_id, list);
  },
  async setScores(scores) {
    for (const list of Array.from(MEM.entries.values())) {
      for (const e of list) {
        const s = scores.find((x) => x.id === e.id);
        if (s) e.score = s.score;
      }
    }
  },
};

let tablesMissing = false;
const useSupabase = Boolean(SB_URL && SB_KEY);

const db: Backend = useSupabase
  ? (Object.fromEntries(
      (Object.keys(supabaseBackend) as (keyof Backend)[]).map((k) => [
        k,
        async (...args: unknown[]) => {
          if (tablesMissing) return (memoryBackend[k] as (...a: unknown[]) => unknown)(...args);
          try {
            return await (supabaseBackend[k] as (...a: unknown[]) => unknown)(...args);
          } catch (err) {
            if (/\b404\b|PGRST205|does not exist/.test(String(err))) {
              tablesMissing = true;
              console.warn("[boards] Supabase tables missing; using memory. Run supabase/party_boards.sql.");
              return (memoryBackend[k] as (...a: unknown[]) => unknown)(...args);
            }
            throw err;
          }
        },
      ]),
    ) as unknown as Backend)
  : memoryBackend;

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const LIFETIME_DAYS = 120;

function randomId(n: number): string {
  const a = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(bytes, (b) => a[b % a.length]).join("");
}

const str = (v: unknown, max: number) =>
  typeof v === "string" ? v.trim().slice(0, max) : typeof v === "number" && Number.isFinite(v) ? String(v).slice(0, max) : "";

function sanitizeQuiz(raw: unknown): QuizConfig | null {
  const r = raw as Partial<QuizConfig>;
  if (!r || !Array.isArray(r.questions)) return null;
  const questions = r.questions
    .slice(0, 30)
    .map((q) => {
      const options = Array.isArray(q?.options) ? q.options.map((o) => str(o, 80)).filter(Boolean).slice(0, 6) : [];
      const answer = Number(q?.answer);
      return { q: str(q?.q, 160), options, answer };
    })
    .filter((q) => q.q && q.options.length >= 2 && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length);
  if (questions.length < 3) return null;
  return { subject: str(r.subject, 40) || "them", questions };
}

function sanitizePool(raw: unknown): PoolConfig | null {
  const r = raw as Partial<PoolConfig>;
  if (!r || !Array.isArray(r.fields)) return null;
  const fields = r.fields
    .slice(0, 12)
    .map((f) => ({
      id: str(f?.id, 24),
      label: str(f?.label, 60),
      type: (["date", "number", "choice", "text"].includes(f?.type as string) ? f?.type : "text") as PoolField["type"],
      unit: str(f?.unit, 12) || undefined,
      options: Array.isArray(f?.options) ? f.options.map((o) => str(o, 40)).filter(Boolean).slice(0, 8) : undefined,
    }))
    .filter((f) => f.id && f.label);
  if (!fields.length) return null;
  return { subject: str(r.subject, 40) || "Baby", fields };
}

function scoreQuiz(cfg: QuizConfig, answers: unknown): number {
  const a = Array.isArray(answers) ? answers : [];
  return cfg.questions.reduce((s, q, i) => s + (Number(a[i]) === q.answer ? 1 : 0), 0);
}

/** Pool scoring: up to 10 points per field for closeness. */
function scorePool(cfg: PoolConfig, guess: Record<string, unknown>, result: Record<string, string>): number {
  let total = 0;
  for (const f of cfg.fields) {
    const real = result[f.id];
    const g = String(guess[f.id] ?? "");
    if (!real || !g) continue;
    if (f.type === "date") {
      const days = Math.abs((new Date(g).getTime() - new Date(real).getTime()) / 86_400_000);
      if (Number.isFinite(days)) total += Math.max(0, 10 - Math.round(days));
    } else if (f.type === "number") {
      const r = Number(real);
      const n = Number(g);
      if (Number.isFinite(r) && Number.isFinite(n) && r !== 0) {
        total += Math.max(0, Math.round(10 - (Math.abs(n - r) / Math.abs(r)) * 40));
      }
    } else if (g.trim().toLowerCase() === real.trim().toLowerCase()) {
      total += 10;
    }
  }
  return total;
}

/* ------------------------------------------------------------------ */
/* Public API                                                          */
/* ------------------------------------------------------------------ */

export interface BoardView {
  id: string;
  kind: BoardKind;
  title: string;
  subject: string;
  /** Quiz: questions without answers. */
  questions?: { q: string; options: string[] }[];
  /** Pool: fields to predict. */
  fields?: PoolField[];
  revealed: boolean;
  result?: Record<string, string> | null;
  entries: { name: string; score: number | null; total?: number; payload?: Record<string, unknown> }[];
}

export async function createBoard(input: {
  kind: unknown;
  title: unknown;
  config: unknown;
}): Promise<{ id: string; ownerToken: string } | null> {
  const kind = input.kind === "pool" ? "pool" : input.kind === "quiz" ? "quiz" : null;
  if (!kind) return null;
  const config = kind === "quiz" ? sanitizeQuiz(input.config) : sanitizePool(input.config);
  if (!config) return null;
  const now = new Date();
  const row: BoardRow = {
    id: randomId(10),
    kind,
    owner_token: randomId(24),
    title: str(input.title, 60),
    config,
    result: null,
    created_at: now.toISOString(),
    expires_at: new Date(now.getTime() + LIFETIME_DAYS * 86_400_000).toISOString(),
  };
  await db.insertBoard(row);
  return { id: row.id, ownerToken: row.owner_token };
}

async function liveBoard(id: string): Promise<BoardRow | null> {
  if (!/^[a-z0-9]{6,16}$/.test(id)) return null;
  const b = await db.getBoard(id);
  return b && new Date(b.expires_at).getTime() > Date.now() ? b : null;
}

export async function getBoard(id: string): Promise<BoardView | null> {
  const b = await liveBoard(id);
  if (!b) return null;
  const entries = await db.entries(id);
  if (b.kind === "quiz") {
    const cfg = b.config as QuizConfig;
    return {
      id: b.id,
      kind: b.kind,
      title: b.title,
      subject: cfg.subject,
      questions: cfg.questions.map((q) => ({ q: q.q, options: q.options })),
      revealed: true,
      entries: entries
        .map((e) => ({ name: e.name, score: e.score, total: cfg.questions.length }))
        .sort((x, y) => (y.score ?? 0) - (x.score ?? 0)),
    };
  }
  const cfg = b.config as PoolConfig;
  const revealed = Boolean(b.result);
  return {
    id: b.id,
    kind: b.kind,
    title: b.title,
    subject: cfg.subject,
    fields: cfg.fields,
    revealed,
    result: b.result,
    entries: entries
      .map((e) => ({ name: e.name, score: revealed ? e.score : null, payload: revealed ? e.payload : undefined }))
      .sort((x, y) => (y.score ?? 0) - (x.score ?? 0)),
  };
}

/** A guest's quiz answers or pool predictions. Quiz entries are scored at
 * once and the correct answers come back; pool entries wait for the reveal. */
export async function addEntry(
  id: string,
  nameRaw: unknown,
  payload: unknown,
): Promise<{ score: number | null; correct?: number[] } | null> {
  const b = await liveBoard(id);
  if (!b) return null;
  const name = str(nameRaw, 24) || "Guest";
  if (b.kind === "quiz") {
    const cfg = b.config as QuizConfig;
    const answers = Array.isArray((payload as { answers?: unknown })?.answers)
      ? ((payload as { answers: unknown[] }).answers.map(Number).slice(0, cfg.questions.length))
      : [];
    const score = scoreQuiz(cfg, answers);
    await db.addEntry({ board_id: id, name, payload: { answers }, score, created_at: new Date().toISOString() });
    return { score, correct: cfg.questions.map((q) => q.answer) };
  }
  if (b.result) return null; // pool closed
  const cfg = b.config as PoolConfig;
  const values: Record<string, string> = {};
  for (const f of cfg.fields) values[f.id] = str((payload as Record<string, unknown>)?.[f.id], 40);
  await db.addEntry({ board_id: id, name, payload: values, score: null, created_at: new Date().toISOString() });
  return { score: null };
}

/** Host reveals the real results; every prediction gets scored. */
export async function revealPool(id: string, token: unknown, resultRaw: unknown): Promise<boolean> {
  const b = await liveBoard(id);
  if (!b || b.kind !== "pool" || typeof token !== "string" || token !== b.owner_token) return false;
  const cfg = b.config as PoolConfig;
  const result: Record<string, string> = {};
  for (const f of cfg.fields) result[f.id] = str((resultRaw as Record<string, unknown>)?.[f.id], 40);
  await db.setResult(id, result);
  const entries = await db.entries(id);
  await db.setScores(
    entries
      .filter((e): e is EntryRow & { id: number } => typeof e.id === "number")
      .map((e) => ({ id: e.id, score: scorePool(cfg, e.payload, result) })),
  );
  return true;
}

export async function isOwner(id: string, token: unknown): Promise<boolean> {
  const b = await liveBoard(id);
  return Boolean(b && typeof token === "string" && token === b.owner_token);
}
