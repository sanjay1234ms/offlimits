/* Server-only: imported by app/api/santa routes, never by components.
 *
 * Secret Santa draw storage. Uses Supabase (Postgres via its REST API) when
 * SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set; table setup lives in
 * supabase/secret_santa.sql. Without them it falls back to an in-memory Map,
 * which is fine for `next dev` but not for Vercel, so in production the API
 * reports "not configured" and the page uses the old link-only draw instead.
 *
 * Pairings never leave the server except to the one person who opens a name.
 */

export interface OpenedMark {
  /** SHA-256 of the opener's device id, so the same phone can reopen. */
  by: string;
  at: string;
}

export interface StoredDraw {
  id: string;
  organiser_token: string;
  title: string;
  names: string[];
  receivers: number[];
  currency: string;
  budget: string;
  exchange_date: string;
  message: string;
  /** Keyed "p<index>" so PostgREST can filter on a single name atomically. */
  opened: Record<string, OpenedMark>;
  created_at: string;
  expires_at: string;
}

const TABLE = "secret_santa_draws";
const URL_ = process.env.SUPABASE_URL?.replace(/\/$/, "");
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const santaStoreMode: "supabase" | "memory" | "off" =
  URL_ && KEY ? "supabase" : process.env.NODE_ENV === "production" ? "off" : "memory";

const globalForSanta = globalThis as unknown as { __santaDraws?: Map<string, StoredDraw> };
const MEMORY: Map<string, StoredDraw> =
  globalForSanta.__santaDraws ?? (globalForSanta.__santaDraws = new Map());

export const openedKey = (index: number) => `p${index}`;

async function rest(path: string, init: RequestInit = {}): Promise<Response> {
  return fetch(`${URL_}/rest/v1/${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      apikey: KEY!,
      Authorization: `Bearer ${KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
      ...init.headers,
    },
  });
}

export async function insertDraw(draw: StoredDraw): Promise<void> {
  if (santaStoreMode === "memory") {
    MEMORY.set(draw.id, structuredClone(draw));
    return;
  }
  const res = await rest(TABLE, { method: "POST", body: JSON.stringify(draw) });
  if (!res.ok) throw new Error(`insert failed: ${res.status} ${await res.text()}`);
}

export async function getDraw(id: string): Promise<StoredDraw | null> {
  let draw: StoredDraw | null = null;
  if (santaStoreMode === "memory") {
    draw = MEMORY.get(id) ?? null;
  } else {
    const res = await rest(`${TABLE}?id=eq.${encodeURIComponent(id)}&select=*`);
    if (!res.ok) throw new Error(`read failed: ${res.status}`);
    const rows = (await res.json()) as StoredDraw[];
    draw = rows[0] ?? null;
  }
  if (draw && new Date(draw.expires_at).getTime() < Date.now()) return null;
  return draw ? structuredClone(draw) : null;
}

/** Marks a name opened only if nobody has opened it yet. Returns false when
 * someone beat us to it. */
export async function markOpened(
  id: string,
  index: number,
  mark: OpenedMark,
  current: StoredDraw,
): Promise<boolean> {
  const key = openedKey(index);
  if (santaStoreMode === "memory") {
    const draw = MEMORY.get(id);
    if (!draw || draw.opened[key]) return false;
    draw.opened[key] = mark;
    return true;
  }
  // Conditional update: only matches while this name is still unopened.
  const res = await rest(
    `${TABLE}?id=eq.${encodeURIComponent(id)}&opened->>${key}=is.null`,
    { method: "PATCH", body: JSON.stringify({ opened: { ...current.opened, [key]: mark } }) },
  );
  if (!res.ok) throw new Error(`open failed: ${res.status}`);
  return ((await res.json()) as unknown[]).length > 0;
}

export async function clearOpened(id: string, index: number): Promise<void> {
  const key = openedKey(index);
  if (santaStoreMode === "memory") {
    delete MEMORY.get(id)?.opened[key];
    return;
  }
  const draw = await getDraw(id);
  if (!draw) return;
  delete draw.opened[key];
  const res = await rest(`${TABLE}?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify({ opened: draw.opened }),
  });
  if (!res.ok) throw new Error(`reset failed: ${res.status}`);
}

export async function sha256(text: string): Promise<string> {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf), (b) => b.toString(16).padStart(2, "0")).join("");
}

/** Random [a-z0-9] string from crypto, for draw ids and organiser tokens. */
export function randomId(length: number): string {
  const alphabet = "abcdefghijkmnpqrstuvwxyz23456789";
  const bytes = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

/** Constant-time-ish string compare for organiser tokens. */
export function sameToken(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}
