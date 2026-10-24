"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  ExternalLink,
  Gift,
  Plus,
  RotateCcw,
  Share2,
  X,
} from "lucide-react";
import { track } from "@/lib/analytics";
import {
  CURRENCIES,
  drawWithRules,
  encodeDraw,
  parseNames,
  type KeepApart,
} from "@/lib/secretSanta";

const FIELD =
  "w-full rounded-xl border-2 border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/70 focus:border-accent";
const LABEL = "text-sm font-bold text-foreground";
const ORGANISER_KEY = "ss-organiser-links";

interface DrawResult {
  groupLink: string;
  /** Null in link-only mode (no database), where there's no organiser page. */
  organiserLink: string | null;
  people: number;
}

/** Remember organiser links on this device, newest first, so a lost tab
 * isn't a lost draw. */
function rememberOrganiserLink(title: string, link: string) {
  try {
    const list = JSON.parse(localStorage.getItem(ORGANISER_KEY) ?? "[]");
    const next = [{ title, link, at: Date.now() }, ...(Array.isArray(list) ? list : [])].slice(0, 10);
    localStorage.setItem(ORGANISER_KEY, JSON.stringify(next));
  } catch {
    // Private mode; the on-screen "save this link" note covers it.
  }
}

function LinkRow({
  link,
  copied,
  onCopy,
}: {
  link: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="flex w-full items-center gap-2 rounded-xl border-2 border-border bg-background/60 p-1.5 pl-3">
      <span className="min-w-0 flex-1 truncate text-left font-mono text-xs text-muted sm:text-sm">
        {link}
      </span>
      <button type="button" onClick={onCopy} className="btn-primary shrink-0 px-4 py-2 text-sm">
        {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

/** Secret Santa setup: names, keep-apart rules and optional details. The
 * server draws and stores the pairings, then hands back a group link and a
 * private organiser link. If the database isn't set up, it falls back to a
 * link-only draw packed into the URL's #hash. */
export function SecretSantaDraw() {
  const [raw, setRaw] = useState("");
  const [rules, setRules] = useState<KeepApart[]>([]);
  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState("CAD");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<DrawResult | null>(null);
  const [copied, setCopied] = useState<"group" | "organiser" | null>(null);

  const names = parseNames(raw);
  const canDraw = names.length >= 3;
  // Rules pointing at a name that's since been removed are ignored.
  const liveRules = rules.filter(
    ([a, b]) => a && b && a !== b && names.includes(a) && names.includes(b),
  );

  function addRule() {
    setRules((r) => [...r, [names[0] ?? "", names[1] ?? ""]]);
  }

  function updateRule(i: number, side: 0 | 1, value: string) {
    setRules((r) =>
      r.map((rule, j) => {
        if (j !== i) return rule;
        const next: KeepApart = [...rule];
        next[side] = value;
        return next;
      }),
    );
  }

  const RULES_ERROR =
    "Those keep-apart rules can't all work with this group. Remove a rule or add more people.";

  /** No database: draw in the browser and pack it into the link. */
  function drawLocally(): DrawResult | null {
    const receivers = drawWithRules(names, liveRules);
    if (!receivers) return null;
    const code = encodeDraw({
      title: title.trim(),
      names,
      receivers,
      currency,
      budget: budget.trim(),
      date,
      message: message.trim(),
    });
    return {
      groupLink: `${window.location.origin}/secret-santa/draw#${code}`,
      organiserLink: null,
      people: names.length,
    };
  }

  async function draw() {
    setError("");
    setBusy(true);
    let next: DrawResult | null = null;
    try {
      const res = await fetch("/api/santa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          names,
          rules: liveRules,
          currency,
          budget,
          date,
          message,
        }),
      });
      if (res.status === 422) {
        setError(RULES_ERROR);
        return;
      }
      if (res.ok) {
        const { id, organiserToken } = (await res.json()) as { id: string; organiserToken: string };
        const origin = window.location.origin;
        next = {
          groupLink: `${origin}/secret-santa/draw/${id}`,
          organiserLink: `${origin}/secret-santa/draw/${id}/organiser?t=${organiserToken}`,
          people: names.length,
        };
        rememberOrganiserLink(title.trim(), next.organiserLink!);
      } else {
        next = drawLocally();
      }
    } catch {
      next = drawLocally();
    } finally {
      setBusy(false);
    }
    if (!next) {
      setError(RULES_ERROR);
      return;
    }
    setResult(next);
    setCopied(null);
    requestAnimationFrame(() =>
      document.getElementById("santa-tool")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
    track("secret_santa_draw", {
      people: names.length,
      rules: liveRules.length,
      online: next.organiserLink ? 1 : 0,
    });
  }

  async function copy(which: "group" | "organiser", text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      if (which === "group") track("secret_santa_share", { method: "copy" });
    } catch {
      setCopied(null);
    }
  }

  async function share(link: string) {
    try {
      await navigator.share({
        title: title.trim() || "Secret Santa",
        text: "Tap your name to see who you're buying for 🎁",
        url: link,
      });
      track("secret_santa_share", { method: "native" });
    } catch {
      // Cancelled, or the browser can't share. Copy still works.
    }
  }

  if (result) {
    const canShare = typeof navigator !== "undefined" && "share" in navigator;
    return (
      <div className="mx-auto flex max-w-2xl flex-col gap-4">
        <div className="flex flex-col items-center gap-2 rounded-[1.75rem] border-2 border-amber-300/60 bg-gradient-to-br from-amber-300 to-yellow-400 p-6 text-center text-slate-900 shadow-lg sm:p-8">
          <span className="text-5xl" aria-hidden>
            🎁
          </span>
          <h2 className="text-2xl font-extrabold tracking-tight sm:text-3xl">Your draw is ready</h2>
          <p className="max-w-md text-sm font-medium sm:text-base">
            {title.trim() ? `${title.trim()}: ` : ""}
            {result.people} names matched. Nobody, including you, can see who
            got who.
          </p>
        </div>

        <div className="glass-card flex flex-col gap-3 p-5 sm:p-6">
          <div>
            <h3 className="text-lg font-extrabold text-foreground">1. Send this to the group</h3>
            <p className="mt-1 text-sm text-muted">
              One link for everyone. Each person taps their own name to see who
              they&apos;re buying for{result.organiserLink ? ", and that name locks to their phone" : ""}.
            </p>
          </div>
          <LinkRow
            link={result.groupLink}
            copied={copied === "group"}
            onCopy={() => copy("group", result.groupLink)}
          />
          {canShare ? (
            <button
              type="button"
              onClick={() => share(result.groupLink)}
              className="btn-ghost self-start px-4 py-2 text-sm"
            >
              <Share2 className="h-4 w-4" aria-hidden />
              Share to WhatsApp, Messages…
            </button>
          ) : null}
        </div>

        {result.organiserLink ? (
          <div className="glass-card flex flex-col gap-3 p-5 sm:p-6">
            <div>
              <h3 className="text-lg font-extrabold text-foreground">2. Keep this one for yourself</h3>
              <p className="mt-1 text-sm text-muted">
                Your organiser page. See who has opened their name, nudge
                anyone who hasn&apos;t, and reset a name if someone taps the
                wrong one. Don&apos;t share it.
              </p>
            </div>
            <LinkRow
              link={result.organiserLink}
              copied={copied === "organiser"}
              onCopy={() => copy("organiser", result.organiserLink!)}
            />
            <a
              href={result.organiserLink}
              target="_blank"
              rel="noopener"
              className="btn-ghost self-start px-4 py-2 text-sm"
            >
              <ExternalLink className="h-4 w-4" aria-hidden />
              Open organiser page
            </a>
            <p className="rounded-xl border border-amber-400/40 bg-amber-400/10 px-3 py-2 text-xs leading-relaxed text-foreground">
              <strong>Save the organiser link now.</strong> There are no
              accounts or emails, so this link is the only way back in. Copy it
              somewhere safe, like a note or a message to yourself.
            </p>
          </div>
        ) : null}

        <div className="flex justify-center">
          <button type="button" onClick={() => setResult(null)} className="btn-ghost">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Edit and redraw
          </button>
        </div>
        <p className="text-center text-xs text-muted">
          Redrawing makes a new draw, so only send the latest link.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      {/* Who's playing + keep-apart rules */}
      <div className="glass-card flex flex-col gap-4 p-5 sm:p-6">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-extrabold text-foreground">
            Who&apos;s playing?
            <span className="rounded-full bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
              {names.length}
            </span>
          </h2>
          <p className="mt-1 text-sm text-muted">One name per line. At least 3 people.</p>
        </div>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={9}
          spellCheck={false}
          aria-label="Names, one per line"
          placeholder={"Alice\nBen\nChloe\nDev\nElena\nFarid"}
          className={`${FIELD} resize-y font-mono leading-relaxed`}
        />

        <div className="border-t-2 border-dashed border-border pt-4">
          <h3 className="text-base font-extrabold text-foreground">Keep people apart</h3>
          <p className="mt-1 text-sm text-muted">
            Stop couples or siblings drawing each other. Works both ways.
          </p>
          <ul className="mt-3 flex flex-col gap-2">
            {rules.map(([a, b], i) => (
              <li key={i} className="flex items-center gap-2">
                {[a, b].map((value, side) => (
                  <select
                    key={side}
                    value={value}
                    onChange={(e) => updateRule(i, side as 0 | 1, e.target.value)}
                    aria-label={side === 0 ? "First person" : "Second person"}
                    className={`${FIELD} min-w-0 flex-1`}
                  >
                    <option value="">Pick…</option>
                    {names.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                ))}
                <button
                  type="button"
                  onClick={() => setRules((r) => r.filter((_, j) => j !== i))}
                  aria-label="Remove rule"
                  className="btn-ghost shrink-0 p-2.5"
                >
                  <X className="h-4 w-4" aria-hidden />
                </button>
              </li>
            ))}
          </ul>
          <button
            type="button"
            onClick={addRule}
            disabled={names.length < 2}
            className="btn-ghost mt-3 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Plus className="h-4 w-4" aria-hidden />
            Add a rule
          </button>
          {names.length < 2 ? (
            <p className="mt-2 text-xs text-muted">Add names first, then pick who to keep apart.</p>
          ) : null}
        </div>
      </div>

      {/* Details */}
      <div className="glass-card flex flex-col gap-4 p-5 sm:p-6">
        <h2 className="text-lg font-extrabold text-foreground">
          Details <span className="text-xs font-bold text-muted">optional</span>
        </h2>
        <label className="flex flex-col gap-2">
          <span className={LABEL}>Name of the draw</span>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={60}
            placeholder="Smith Family Christmas"
            className={FIELD}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <span className={LABEL} id="budget-label">
              Budget
            </span>
            <div className="flex gap-2">
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                aria-label="Currency"
                className={`${FIELD} !w-[5.5rem] shrink-0 px-2`}
              >
                {CURRENCIES.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                value={budget}
                onChange={(e) => setBudget(e.target.value.replace(/[^\d.]/g, ""))}
                inputMode="decimal"
                aria-labelledby="budget-label"
                placeholder="25"
                className={`${FIELD} min-w-0 flex-1`}
              />
            </div>
          </div>
          <label className="flex flex-col gap-2">
            <span className={LABEL}>Exchange date</span>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={FIELD}
            />
          </label>
        </div>
        <label className="flex flex-col gap-2">
          <span className={LABEL}>Message for everyone</span>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={3}
            maxLength={200}
            placeholder="Gifts under the tree by 6pm!"
            className={`${FIELD} resize-y`}
          />
        </label>

        <div className="mt-auto flex flex-col gap-2 pt-2">
          {error ? (
            <p role="alert" className="text-sm font-semibold text-rose-500">
              {error}
            </p>
          ) : null}
          <button
            type="button"
            onClick={draw}
            disabled={!canDraw || busy}
            className="btn-primary w-full py-4 text-lg"
          >
            {busy ? "Drawing…" : "Draw names"}
            <Gift className="h-5 w-5" aria-hidden />
          </button>
          <p className="text-center text-xs text-muted">
            {canDraw
              ? "No signup. No email addresses needed."
              : `Add ${3 - names.length} more ${names.length === 2 ? "person" : "people"} to draw.`}
          </p>
        </div>
      </div>
    </div>
  );
}
