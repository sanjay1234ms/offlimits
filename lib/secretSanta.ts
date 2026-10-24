import { shuffle } from "@/lib/shuffle";

/** A finished draw, everything the reveal page needs. It travels inside the
 * share link's #hash, so nothing is stored on a server and the hash never
 * reaches our logs. */
export interface SantaDraw {
  /** Draw name, e.g. "Smith Family Christmas". */
  title: string;
  names: string[];
  /** receivers[i] is the index of the person names[i] buys for. */
  receivers: number[];
  currency: string;
  budget: string;
  /** ISO yyyy-mm-dd, or "". */
  date: string;
  message: string;
}

export type KeepApart = [string, string];

export const CURRENCIES = [
  "CAD", "USD", "GBP", "EUR", "AUD", "NZD", "INR", "AED", "SGD", "ZAR",
  "MXN", "BRL", "PHP", "JPY", "CHF", "SEK", "NOK", "DKK", "PLN", "HKD",
] as const;

export function parseNames(raw: string): string[] {
  const seen = new Set<string>();
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter((name) => {
      const key = name.toLowerCase();
      if (!name || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

/**
 * Random assignment where nobody gets themselves and no keep-apart pair gets
 * each other in either direction. Backtracks over shuffled candidates, so it
 * either finds a valid draw or proves there isn't one (returns null).
 */
export function drawWithRules(
  names: string[],
  rules: KeepApart[],
): number[] | null {
  const n = names.length;
  const index = new Map(names.map((name, i) => [name, i]));
  const blocked = names.map((_, i) => new Set<number>([i]));
  for (const [a, b] of rules) {
    const ia = index.get(a);
    const ib = index.get(b);
    if (ia === undefined || ib === undefined || ia === ib) continue;
    blocked[ia].add(ib);
    blocked[ib].add(ia);
  }

  const givers = shuffle(names.map((_, i) => i));
  const receivers = new Array<number>(n).fill(-1);
  const taken = new Array<boolean>(n).fill(false);
  let steps = 0;

  function place(k: number): boolean {
    if (k === n) return true;
    if (++steps > 200_000) return false;
    const giver = givers[k];
    for (const r of shuffle(names.map((_, i) => i))) {
      if (taken[r] || blocked[giver].has(r)) continue;
      taken[r] = true;
      receivers[giver] = r;
      if (place(k + 1)) return true;
      taken[r] = false;
    }
    return false;
  }

  return place(0) ? receivers : null;
}

/* ---------- Share-link encoding ---------- */

// Receivers are scrambled with a per-draw key so a glance at the link (or the
// organiser's address bar) doesn't spoil anything. It's a spoiler guard, not
// encryption.
function scramble(receivers: number[], key: number, n: number, dir: 1 | -1) {
  return receivers.map((r, i) => {
    const offset = (key * (i + 7) + i * i) % n;
    return (((r + dir * offset) % n) + n) % n;
  });
}

function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  bytes.forEach((b) => (bin += String.fromCharCode(b)));
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): string {
  const b64 = text.replace(/-/g, "+").replace(/_/g, "/");
  const bin = atob(b64 + "===".slice((b64.length + 3) % 4));
  return new TextDecoder().decode(Uint8Array.from(bin, (c) => c.charCodeAt(0)));
}

export function encodeDraw(draw: SantaDraw): string {
  const n = draw.names.length;
  const key = 1 + Math.floor(Math.random() * 997);
  return toBase64Url(
    JSON.stringify({
      v: 1,
      t: draw.title,
      p: draw.names,
      k: key,
      r: scramble(draw.receivers, key, n, 1),
      c: draw.currency,
      b: draw.budget,
      d: draw.date,
      m: draw.message,
    }),
  );
}

export function decodeDraw(code: string): SantaDraw | null {
  try {
    const raw = JSON.parse(fromBase64Url(code));
    if (raw?.v !== 1 || !Array.isArray(raw.p) || !Array.isArray(raw.r)) return null;
    const n = raw.p.length;
    if (n < 3 || raw.r.length !== n) return null;
    const receivers = scramble(raw.r, Number(raw.k) || 0, n, -1);
    return {
      title: String(raw.t ?? ""),
      names: raw.p.map(String),
      receivers,
      currency: String(raw.c ?? ""),
      budget: String(raw.b ?? ""),
      date: String(raw.d ?? ""),
      message: String(raw.m ?? ""),
    };
  } catch {
    return null;
  }
}

export function formatBudget(draw: Pick<SantaDraw, "budget" | "currency">): string {
  const amount = Number(draw.budget);
  if (!draw.budget || !Number.isFinite(amount)) return draw.budget;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: draw.currency || "CAD",
      maximumFractionDigits: amount % 1 ? 2 : 0,
    }).format(amount);
  } catch {
    return `${draw.budget} ${draw.currency}`;
  }
}

export function formatDate(iso: string): string {
  if (!iso) return "";
  const d = new Date(`${iso}T12:00:00`);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}
