"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Check, Copy, EyeOff, Lock, RefreshCw, RotateCcw } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { track } from "@/lib/analytics";
import { getDeviceId } from "@/lib/deviceId";
import type { SantaOpenResult, SantaPublicView } from "@/lib/santaView";
import { DrawDetails } from "@/components/SecretSantaReveal";

function mineKey(id: string) {
  return `ss-mine:${id}`;
}

function readMine(id: string): number[] {
  try {
    const v = JSON.parse(localStorage.getItem(mineKey(id)) ?? "[]");
    return Array.isArray(v) ? v.filter(Number.isInteger) : [];
  } catch {
    return [];
  }
}

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = useCallback(async (key: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(key);
      setTimeout(() => setCopied((c) => (c === key ? null : c)), 2000);
    } catch {
      setCopied(null);
    }
  }, []);
  return { copied, copy };
}

function NotFound() {
  return (
    <div className="glass-card mx-auto flex max-w-xl flex-col items-center gap-3 p-8 text-center">
      <span className="text-5xl" aria-hidden>
        🎁
      </span>
      <h1 className="text-2xl font-extrabold text-foreground">We can&apos;t find this draw</h1>
      <p className="text-sm text-muted">
        The link may be incomplete, or the draw has expired. Ask your organiser
        to send it again, or start a new one.
      </p>
      <Link href="/secret-santa" className="btn-primary mt-2">
        Start a Secret Santa
      </Link>
    </div>
  );
}

type Step =
  | { kind: "pick" }
  | { kind: "confirm"; index: number }
  | { kind: "wrapped"; index: number }
  | { kind: "opening"; index: number }
  | { kind: "revealed"; result: SantaOpenResult }
  | { kind: "taken"; index: number };

/** The group link page: tap your name, confirm, open your gift. The match
 * comes from the server, and each name locks to the first phone that opens
 * it. */
export function SantaGroupPage({ id }: { id: string }) {
  const [view, setView] = useState<SantaPublicView | null | undefined>(undefined);
  const [mine, setMine] = useState<number[]>([]);
  const [step, setStep] = useState<Step>({ kind: "pick" });
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/santa/${id}`, { cache: "no-store" });
      setView(res.ok ? await res.json() : null);
    } catch {
      setError("Couldn't reach the server. Check your connection and refresh.");
    }
  }, [id]);

  useEffect(() => {
    setMine(readMine(id));
    load();
  }, [id, load]);

  async function open(index: number, el: HTMLElement) {
    setStep({ kind: "opening", index });
    try {
      const res = await fetch(`/api/santa/${id}/open`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ index, deviceId: getDeviceId() }),
      });
      if (res.status === 409) {
        setStep({ kind: "taken", index });
        load();
        return;
      }
      if (!res.ok) throw new Error(String(res.status));
      const result = (await res.json()) as SantaOpenResult;
      const r = el.getBoundingClientRect();
      confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 40);
      const nextMine = mine.includes(index) ? mine : [...mine, index];
      setMine(nextMine);
      try {
        localStorage.setItem(mineKey(id), JSON.stringify(nextMine));
      } catch {
        // Fine; the server still remembers this phone.
      }
      setStep({ kind: "revealed", result });
      track("secret_santa_reveal", { people: view?.names.length ?? 0, online: 1 });
      load();
    } catch {
      setError("Something went wrong opening your gift. Try again.");
      setStep({ kind: "wrapped", index });
    }
  }

  if (view === undefined && !error) {
    return <div className="glass-card mx-auto h-64 max-w-xl animate-pulse" />;
  }
  if (!view) return error ? <p className="text-center text-muted">{error}</p> : <NotFound />;

  const order = view.names
    .map((name, index) => ({ name, index }))
    .sort((a, b) => a.name.localeCompare(b.name));

  let body: React.ReactNode;
  if (step.kind === "confirm") {
    const name = view.names[step.index];
    body = (
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <h2 className="text-2xl font-extrabold text-foreground">Are you {name}?</h2>
        <p className="max-w-sm text-sm text-muted">
          Once you open it, {name} locks to this phone so nobody else can.
          Only open your own name.
        </p>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          <button
            type="button"
            onClick={() => setStep({ kind: "wrapped", index: step.index })}
            className="btn-primary"
          >
            Yes, I&apos;m {name}
          </button>
          <button type="button" onClick={() => setStep({ kind: "pick" })} className="btn-ghost">
            No, go back
          </button>
        </div>
      </div>
    );
  } else if (step.kind === "wrapped" || step.kind === "opening") {
    const index = step.index;
    body = (
      <div className="flex flex-col items-center gap-4 py-2 text-center">
        <p className="text-sm font-bold text-muted">{view.names[index]}, your match is inside</p>
        <button
          type="button"
          disabled={step.kind === "opening"}
          onClick={(e) => open(index, e.currentTarget)}
          aria-label="Open your gift"
          className="mt-6 text-8xl transition-transform hover:scale-110 active:scale-95 disabled:opacity-60 motion-safe:animate-bounce"
        >
          🎁
        </button>
        <p className="text-sm font-semibold text-foreground">
          {step.kind === "opening" ? "Unwrapping…" : "Tap the gift to open it"}
        </p>
        {error ? <p className="text-sm text-rose-500">{error}</p> : null}
      </div>
    );
  } else if (step.kind === "revealed") {
    body = (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <p className="text-sm font-bold text-muted">{step.result.name}, you&apos;re buying for</p>
        <p className="break-words text-5xl font-extrabold tracking-tight text-foreground motion-safe:animate-fade-up sm:text-6xl">
          {step.result.receiver}
        </p>
        <div className="mt-1">
          <DrawDetails draw={view} />
        </div>
        <p className="mt-2 max-w-sm text-xs text-muted">
          You can come back to this link on this phone any time to see it again.
        </p>
        <button
          type="button"
          onClick={() => setStep({ kind: "pick" })}
          className="btn-primary mt-2 w-full sm:w-auto"
        >
          <EyeOff className="h-4 w-4" aria-hidden />
          Hide it
        </button>
      </div>
    );
  } else if (step.kind === "taken") {
    body = (
      <div className="flex flex-col items-center gap-3 py-2 text-center">
        <Lock className="h-10 w-10 text-muted" aria-hidden />
        <h2 className="text-xl font-extrabold text-foreground">
          {view.names[step.index]} has already been opened
        </h2>
        <p className="max-w-sm text-sm text-muted">
          It was opened on a different phone. If that wasn&apos;t you, ask the
          organiser to reset your name, then try again.
        </p>
        <button type="button" onClick={() => setStep({ kind: "pick" })} className="btn-ghost">
          Back to names
        </button>
      </div>
    );
  } else {
    body = (
      <div className="flex flex-col gap-4">
        <div className="text-center">
          <h2 className="text-lg font-extrabold text-foreground">Who are you?</h2>
          <p className="mt-1 text-sm text-muted">
            Tap your own name. Each name can only be opened once.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {order.map(({ name, index }) => {
            const isMine = mine.includes(index);
            const locked = view.opened[index] && !isMine;
            return (
              <button
                key={index}
                type="button"
                onClick={() =>
                  setStep(
                    isMine
                      ? { kind: "wrapped", index }
                      : locked
                        ? { kind: "taken", index }
                        : { kind: "confirm", index },
                  )
                }
                className={`inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all ${
                  locked
                    ? "border-border bg-background/40 text-muted"
                    : "border-accent/50 bg-background/60 text-foreground hover:-translate-y-0.5 hover:border-accent"
                }`}
              >
                {locked ? <Lock className="h-4 w-4" aria-hidden /> : null}
                {isMine ? <Check className="h-4 w-4" aria-hidden /> : null}
                {name}
              </button>
            );
          })}
        </div>
        <p className="text-center text-xs text-muted">
          🔒 already opened · ✓ opened on this phone (tap to see it again)
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <header className="text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">🎅 Secret Santa</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {view.title || "Your Secret Santa"}
        </h1>
        <div className="mt-3">
          <DrawDetails draw={view} />
        </div>
        {view.message ? (
          <p className="mx-auto mt-3 max-w-md rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm italic text-foreground">
            “{view.message}”
          </p>
        ) : null}
      </header>
      <div className="glass-card p-5 sm:p-6">{body}</div>
      <p className="text-center text-sm text-muted">
        Running your own gift swap?{" "}
        <Link href="/secret-santa" className="font-semibold text-accent hover:underline">
          Make a Secret Santa draw
        </Link>
      </p>
    </div>
  );
}

interface OrganiserView {
  id: string;
  title: string;
  people: { name: string; openedAt: string | null }[];
}

function listNames(names: string[]) {
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}

/** Organiser page: who has opened their name, reminders and resets. Never
 * shows the pairings. */
export function SantaOrganiserPage({ id }: { id: string }) {
  const [token, setToken] = useState("");
  const [view, setView] = useState<OrganiserView | null | undefined>(undefined);
  const [busy, setBusy] = useState<number | null>(null);
  const { copied, copy } = useCopy();

  const load = useCallback(
    async (t: string) => {
      try {
        const res = await fetch(`/api/santa/${id}/organiser?t=${encodeURIComponent(t)}`, {
          cache: "no-store",
        });
        setView(res.ok ? await res.json() : null);
      } catch {
        // Keep showing the last good data; the next poll retries.
      }
    },
    [id],
  );

  useEffect(() => {
    const t = new URLSearchParams(window.location.search).get("t") ?? "";
    setToken(t);
    load(t);
    const timer = setInterval(() => load(t), 15_000);
    return () => clearInterval(timer);
  }, [load]);

  async function reset(index: number, name: string) {
    if (!window.confirm(`Reset ${name}? Their name unlocks so the right person can open it.`)) return;
    setBusy(index);
    try {
      await fetch(`/api/santa/${id}/organiser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ t: token, index }),
      });
      track("secret_santa_reset");
      await load(token);
    } finally {
      setBusy(null);
    }
  }

  if (view === undefined) {
    return <div className="glass-card mx-auto h-64 max-w-xl animate-pulse" />;
  }
  if (!view) return <NotFound />;

  const groupLink = `${window.location.origin}/secret-santa/draw/${id}`;
  const waiting = view.people.filter((p) => !p.openedAt).map((p) => p.name);
  const openedCount = view.people.length - waiting.length;
  const reminder =
    `🎁 ${view.title || "Secret Santa"}: ${waiting.length} ${waiting.length === 1 ? "person still hasn't" : "people still haven't"} opened theirs\n\n` +
    `${listNames(waiting)}, tap the link, find your name, and you'll see who you're buying for.\n\n${groupLink}`;

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-4">
      <header className="text-center">
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {view.title || "Secret Santa"}
        </h1>
        <p className="mt-1 text-sm font-semibold text-muted">
          Organiser page · bookmark it, don&apos;t share it
        </p>
      </header>

      <div className="glass-card flex flex-col gap-3 p-5 sm:p-6">
        <h2 className="font-extrabold text-foreground">Share this with the group</h2>
        <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-background/60 p-1.5 pl-3">
          <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted sm:text-sm">
            {groupLink}
          </span>
          <button
            type="button"
            onClick={() => copy("group", groupLink)}
            className="btn-primary shrink-0 px-4 py-2 text-sm"
          >
            {copied === "group" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied === "group" ? "Copied" : "Copy"}
          </button>
        </div>
      </div>

      <div className="flex flex-col items-center rounded-[1.75rem] border-2 border-amber-300/60 bg-gradient-to-br from-amber-300 to-yellow-400 p-6 text-center text-slate-900 shadow-lg">
        <p className="text-4xl font-extrabold tracking-tight">
          {openedCount} / {view.people.length}
        </p>
        <p className="text-sm font-semibold">have opened their name</p>
      </div>

      {waiting.length ? (
        <div className="glass-card flex flex-col gap-3 p-5 sm:p-6">
          <div>
            <h2 className="font-extrabold text-foreground">Nudge whoever hasn&apos;t opened theirs</h2>
            <p className="mt-1 text-sm text-muted">
              {waiting.length} {waiting.length === 1 ? "person still hasn't" : "people still haven't"}.
              Paste this wherever you sent the link.
            </p>
          </div>
          <textarea
            readOnly
            value={reminder}
            rows={5}
            className="w-full resize-y rounded-xl border-2 border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none"
          />
          <button
            type="button"
            onClick={() => copy("nudge", reminder)}
            className="btn-primary self-start px-4 py-2 text-sm"
          >
            {copied === "nudge" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied === "nudge" ? "Copied" : "Copy reminder"}
          </button>
        </div>
      ) : (
        <div className="glass-card p-5 text-center sm:p-6">
          <p className="text-lg font-extrabold text-foreground">🎉 Everyone has opened their name</p>
          <p className="mt-1 text-sm text-muted">Nothing left to do but shop.</p>
        </div>
      )}

      <ul className="flex flex-col gap-2">
        {view.people.map((p, index) => (
          <li
            key={index}
            className="glass-card flex items-center justify-between gap-3 px-4 py-3"
          >
            <span className="min-w-0 truncate font-bold text-foreground">{p.name}</span>
            {p.openedAt ? (
              <span className="flex shrink-0 items-center gap-2">
                <span className="inline-flex items-center gap-1 text-sm font-semibold text-emerald-500">
                  <Check className="h-4 w-4" aria-hidden />
                  Opened
                </span>
                <button
                  type="button"
                  onClick={() => reset(index, p.name)}
                  disabled={busy === index}
                  className="btn-ghost px-3 py-1.5 text-xs"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden />
                  Reset
                </button>
              </span>
            ) : (
              <span className="shrink-0 text-sm font-semibold text-muted">Waiting</span>
            )}
          </li>
        ))}
      </ul>
      <button
        type="button"
        onClick={() => load(token)}
        className="btn-ghost self-center px-4 py-2 text-xs"
      >
        <RefreshCw className="h-3.5 w-3.5" aria-hidden />
        Refresh (updates every 15s)
      </button>

      <div className="glass-card p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-foreground">You can&apos;t see the pairings, on purpose</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Not even from this page, so you can join your own draw and still be
          surprised. Use <strong className="text-foreground">Reset</strong> if
          someone taps the wrong name by mistake. It unlocks that name so the
          right person can open it.
        </p>
      </div>

      <div className="glass-card p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-foreground">Planning the party too?</h2>
        <p className="mt-1 text-sm leading-relaxed text-muted">
          Pick a few games for when everyone&apos;s together and the gifts are
          handed out.
        </p>
        <Link href="/christmas-party-games" className="btn-ghost mt-3 px-4 py-2 text-sm">
          🎄 Christmas party games
        </Link>
      </div>
    </div>
  );
}
