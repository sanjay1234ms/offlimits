"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Lock, Trophy } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { track } from "@/lib/analytics";

export interface PoolFieldDef {
  id: string;
  label: string;
  type: "date" | "number" | "choice" | "text";
  unit?: string;
  options?: string[];
  emoji: string;
}

export const BABY_FIELDS: PoolFieldDef[] = [
  { id: "date", label: "Birth date", type: "date", emoji: "📅" },
  { id: "weight", label: "Weight", type: "number", unit: "lb", emoji: "⚖️" },
  { id: "length", label: "Length", type: "number", unit: "in", emoji: "📏" },
  { id: "sex", label: "Girl or boy", type: "choice", options: ["Girl", "Boy"], emoji: "🎀" },
  { id: "hair", label: "Hair", type: "choice", options: ["Bald", "A little fuzz", "A full head"], emoji: "💇" },
  { id: "letter", label: "First letter of the name", type: "text", emoji: "🔤" },
  { id: "time", label: "Time of birth", type: "choice", options: ["Morning", "Afternoon", "Evening", "Middle of the night"], emoji: "⏰" },
];

const FIELD =
  "w-full rounded-xl border-2 border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

function FieldInput({ f, value, onChange }: { f: PoolFieldDef; value: string; onChange: (v: string) => void }) {
  if (f.type === "choice") {
    return (
      <div className="flex flex-wrap gap-1.5">
        {f.options!.map((o) => (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            className={`rounded-full border-2 px-3 py-1.5 text-sm font-bold transition-all ${
              value === o ? "scale-105 border-pink-400 bg-pink-400 text-slate-900" : "border-border bg-white/5 text-foreground hover:border-pink-300"
            }`}
          >
            {o}
          </button>
        ))}
      </div>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <input
        type={f.type === "date" ? "date" : f.type === "number" ? "number" : "text"}
        inputMode={f.type === "number" ? "decimal" : undefined}
        step={f.type === "number" ? "0.1" : undefined}
        maxLength={f.type === "text" ? 1 : undefined}
        value={value}
        onChange={(e) => onChange(f.type === "text" ? e.target.value.toUpperCase().slice(0, 1) : e.target.value)}
        className={FIELD}
        placeholder={f.type === "text" ? "A" : f.type === "number" ? "7.5" : undefined}
      />
      {f.unit ? <span className="text-sm font-bold text-muted">{f.unit}</span> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */

export function PoolBuilder({ slug }: { slug: string }) {
  const [subject, setSubject] = useState("");
  const [on, setOn] = useState<string[]>(["date", "weight", "sex", "hair", "letter"]);
  const [links, setLinks] = useState<{ guest: string; host: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [copied, setCopied] = useState<string | null>(null);

  async function create() {
    setBusy(true);
    try {
      const fields = BABY_FIELDS.filter((f) => on.includes(f.id)).map((f) => ({ id: f.id, label: f.label, type: f.type, unit: f.unit, options: f.options }));
      const title = `${subject.trim() || "Baby"} predictions`;
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kind: "pool", title, config: { subject: subject.trim() || "Baby", fields } }),
      });
      const { id, ownerToken } = (await res.json()) as { id: string; ownerToken: string };
      const o = window.location.origin;
      setLinks({ guest: `${o}/pool/${id}`, host: `${o}/pool/${id}?t=${ownerToken}` });
      track("pool_created", { game: slug, fields: fields.length });
    } finally {
      setBusy(false);
    }
  }

  async function copy(k: string, t: string) {
    try {
      await navigator.clipboard.writeText(t);
      setCopied(k);
      setTimeout(() => setCopied(null), 1800);
    } catch {
      /* ignore */
    }
  }

  if (links) {
    return (
      <div className="flex flex-col gap-3 rounded-[2rem] bg-gradient-to-br from-sky-400 via-violet-400 to-pink-400 p-6 text-white shadow-xl sm:p-8">
        <p className="text-center text-5xl" aria-hidden>
          🍼
        </p>
        <h3 className="text-center text-2xl font-black">Your prediction pool is open!</h3>
        {[
          { k: "g", label: "1. Send to guests", url: links.guest, note: "Everyone adds their guesses on their own phone." },
          { k: "h", label: "2. Keep for yourself", url: links.host, note: "Open this after the birth to enter the real results and crown a winner. Don't share it." },
        ].map((l) => (
          <div key={l.k} className="rounded-2xl bg-white/15 p-3 ring-1 ring-white/30">
            <p className="text-sm font-black">{l.label}</p>
            <p className="text-xs text-white/85">{l.note}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className="min-w-0 flex-1 truncate font-mono text-xs">{l.url}</span>
              <button type="button" onClick={() => copy(l.k, l.url)} className="inline-flex shrink-0 items-center gap-1 rounded-xl bg-white px-3 py-1.5 text-xs font-black text-slate-900">
                {copied === l.k ? <Check className="h-3.5 w-3.5" aria-hidden /> : <Copy className="h-3.5 w-3.5" aria-hidden />}
                {copied === l.k ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col gap-4 p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-black text-foreground">🍼 Baby prediction pool</h3>
        <p className="mt-1 text-sm text-muted">Guests guess on their own phones. After the birth, you enter the real answers and the closest guess wins.</p>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-foreground">Baby&apos;s nickname or family name</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value.slice(0, 30))} placeholder="Baby Smith" className={FIELD} />
      </label>
      <div>
        <p className="mb-2 text-sm font-bold text-foreground">What should guests predict?</p>
        <div className="grid grid-cols-2 gap-2">
          {BABY_FIELDS.map((f) => {
            const sel = on.includes(f.id);
            return (
              <button
                key={f.id}
                type="button"
                onClick={() => setOn((l) => (sel ? l.filter((x) => x !== f.id) : [...l, f.id]))}
                className={`flex items-center gap-2 rounded-2xl px-3 py-2.5 text-left text-sm font-bold ring-2 transition-all ${
                  sel ? "bg-pink-400/15 text-foreground ring-pink-400" : "bg-white/5 text-muted ring-border"
                }`}
              >
                <span aria-hidden>{f.emoji}</span>
                {f.label}
              </button>
            );
          })}
        </div>
      </div>
      <button type="button" onClick={create} disabled={busy || !on.length} className="btn-primary w-full py-3.5">
        {busy ? "Opening…" : "Open the prediction pool"}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Guest + host page                                                   */
/* ------------------------------------------------------------------ */

interface PoolView {
  id: string;
  title: string;
  subject: string;
  fields: PoolFieldDef[];
  revealed: boolean;
  result: Record<string, string> | null;
  owner: boolean;
  entries: { name: string; score: number | null; payload?: Record<string, string> }[];
}

const emojiFor = (id: string) => BABY_FIELDS.find((f) => f.id === id)?.emoji ?? "✨";

export function PoolPlay({ id }: { id: string }) {
  const [token, setToken] = useState("");
  const [view, setView] = useState<PoolView | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [vals, setVals] = useState<Record<string, string>>({});
  const [real, setReal] = useState<Record<string, string>>({});
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  const load = useCallback(
    async (t: string) => {
      try {
        const res = await fetch(`/api/boards/${id}${t ? `?t=${encodeURIComponent(t)}` : ""}`, { cache: "no-store" });
        setView(res.ok ? await res.json() : null);
      } catch {
        /* keep */
      }
    },
    [id],
  );

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("t") ?? "";
    setToken(t);
    load(t);
    setSent(localStorage.getItem(`ol-pool-${id}`) === "1");
    const iv = window.setInterval(() => load(t), 8000);
    return () => window.clearInterval(iv);
  }, [id, load]);

  async function submit() {
    if (!view || !name.trim()) return;
    setBusy(true);
    try {
      await fetch(`/api/boards/${id}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim(), payload: vals }),
      });
      localStorage.setItem(`ol-pool-${id}`, "1");
      setSent(true);
      sfx.win();
      const r = stage.current?.getBoundingClientRect();
      if (r) confettiBurst(r.left + r.width / 2, r.top + 80, 40);
      track("pool_guess", {});
      load(token);
    } finally {
      setBusy(false);
    }
  }

  async function reveal() {
    setBusy(true);
    try {
      await fetch(`/api/boards/${id}/reveal`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, result: real }),
      });
      sfx.win();
      const r = stage.current?.getBoundingClientRect();
      if (r) confettiBurst(r.left + r.width / 2, r.top + 80, 90);
      load(token);
    } finally {
      setBusy(false);
    }
  }

  if (view === undefined) return <div className="glass-card mx-auto h-72 max-w-xl animate-pulse" />;
  if (view === null)
    return (
      <div className="glass-card mx-auto max-w-xl p-8 text-center">
        <p className="text-2xl font-black text-foreground">This pool has closed or the link is wrong</p>
        <Link href="/baby-shower-games" className="btn-primary mt-4 inline-flex">
          Baby shower games
        </Link>
      </div>
    );

  return (
    <div ref={stage} className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="rounded-[2rem] bg-gradient-to-br from-sky-400 via-violet-400 to-pink-400 p-7 text-center text-white shadow-xl">
        <p className="text-5xl" aria-hidden>
          {view.revealed ? "🎉" : "🍼"}
        </p>
        <h1 className="mt-2 text-3xl font-black">{view.title}</h1>
        <p className="text-sm font-medium text-white/90">
          {view.revealed ? "The results are in!" : `${view.entries.length} guess${view.entries.length === 1 ? "" : "es"} so far`}
        </p>
      </div>

      {view.revealed ? (
        <>
          <div className="glass-card grid grid-cols-2 gap-2 p-4">
            {view.fields.map((f) => (
              <div key={f.id} className="rounded-xl bg-white/5 px-3 py-2">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted">
                  {emojiFor(f.id)} {f.label}
                </p>
                <p className="font-black text-foreground">
                  {view.result?.[f.id] || "-"} {view.result?.[f.id] && f.unit ? f.unit : ""}
                </p>
              </div>
            ))}
          </div>
          <div className="glass-card p-5">
            <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-foreground">
              <Trophy className="h-5 w-5 text-amber-400" aria-hidden />
              Who called it
            </h2>
            <ol className="space-y-1.5">
              {view.entries.map((e, i) => (
                <li key={`${e.name}-${i}`} className="rounded-2xl bg-white/5 px-3 py-2 ring-1 ring-border">
                  <div className="flex items-center gap-3">
                    <span className="w-7 text-center text-lg">{["🥇", "🥈", "🥉"][i] ?? <span className="text-sm font-black text-muted">{i + 1}</span>}</span>
                    <span className="flex-1 font-bold text-foreground">{e.name}</span>
                    <span className="font-black text-accent">{e.score ?? 0} pts</span>
                  </div>
                  {e.payload ? (
                    <p className="mt-1 pl-10 text-xs text-muted">
                      {view.fields.map((f) => `${emojiFor(f.id)} ${e.payload?.[f.id] || "-"}`).join(" · ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ol>
          </div>
        </>
      ) : view.owner ? (
        <div className="glass-card flex flex-col gap-3 p-5">
          <p className="flex items-center gap-2 text-lg font-black text-foreground">
            <Lock className="h-5 w-5 text-pink-400" aria-hidden />
            Host: enter the real results
          </p>
          <p className="text-sm text-muted">{view.entries.length} {view.entries.length === 1 ? "guest has" : "guests have"} guessed. Once you reveal, guessing closes and everyone is scored.</p>
          {view.fields.map((f) => (
            <label key={f.id} className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-foreground">
                {emojiFor(f.id)} {f.label}
              </span>
              <FieldInput f={{ ...f, emoji: emojiFor(f.id) }} value={real[f.id] ?? ""} onChange={(v) => setReal((r) => ({ ...r, [f.id]: v }))} />
            </label>
          ))}
          <button type="button" onClick={reveal} disabled={busy} className="btn-primary py-3.5">
            🎉 Reveal and crown the winner
          </button>
        </div>
      ) : sent ? (
        <div className="glass-card p-6 text-center">
          <p className="text-2xl font-black text-foreground">Your guess is in! 🎉</p>
          <p className="mt-1 text-sm text-muted">Come back to this link after the big day to see who won.</p>
          <p className="mt-3 text-sm font-bold text-foreground">{view.entries.map((e) => e.name).join(", ")}</p>
        </div>
      ) : (
        <div className="glass-card flex flex-col gap-3 p-5">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-bold text-foreground">Your name</span>
            <input value={name} onChange={(e) => setName(e.target.value.slice(0, 24))} placeholder="Aunt Julia" className={FIELD} />
          </label>
          {view.fields.map((f) => (
            <label key={f.id} className="flex flex-col gap-1.5">
              <span className="text-sm font-bold text-foreground">
                {emojiFor(f.id)} {f.label}
              </span>
              <FieldInput f={{ ...f, emoji: emojiFor(f.id) }} value={vals[f.id] ?? ""} onChange={(v) => setVals((r) => ({ ...r, [f.id]: v }))} />
            </label>
          ))}
          <button type="button" onClick={submit} disabled={busy || !name.trim()} className="btn-primary py-3.5">
            Lock in my guesses
          </button>
        </div>
      )}
    </div>
  );
}
