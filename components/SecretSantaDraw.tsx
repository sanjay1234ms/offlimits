"use client";

import { useState } from "react";
import {
  Check,
  Copy,
  Gift,
  Plus,
  RotateCcw,
  Share2,
  Smartphone,
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

/** Secret Santa setup: names, keep-apart rules and optional details, then one
 * share link. The organiser never sees the pairings; the draw lives in the
 * link's #hash so nothing is stored on a server. */
export function SecretSantaDraw() {
  const [raw, setRaw] = useState("");
  const [rules, setRules] = useState<KeepApart[]>([]);
  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState("CAD");
  const [budget, setBudget] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  function draw() {
    setError("");
    const receivers = drawWithRules(names, liveRules);
    if (!receivers) {
      setError(
        "Those keep-apart rules can't all work with this group. Remove a rule or add more people.",
      );
      return;
    }
    const code = encodeDraw({
      title: title.trim(),
      names,
      receivers,
      currency,
      budget: budget.trim(),
      date,
      message: message.trim(),
    });
    setLink(`${window.location.origin}/secret-santa/draw#${code}`);
    setCopied(false);
    requestAnimationFrame(() =>
      document.getElementById("santa-tool")?.scrollIntoView({ behavior: "smooth", block: "start" }),
    );
    track("secret_santa_draw", { people: names.length, rules: liveRules.length });
  }

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      track("secret_santa_share", { method: "copy" });
    } catch {
      setCopied(false);
    }
  }

  async function share() {
    if (!link) return;
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

  if (link) {
    const canShare = typeof navigator !== "undefined" && "share" in navigator;
    return (
      <div className="glass-card mx-auto flex max-w-2xl flex-col items-center gap-4 p-6 text-center sm:p-8">
        <span className="text-5xl" aria-hidden>
          🎉
        </span>
        <h2 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Names drawn for {title.trim() || `${names.length} people`}
        </h2>
        <p className="max-w-md text-sm text-muted sm:text-base">
          Send this link to the group chat. Everyone taps their own name and
          sees only who they&apos;re buying for. You haven&apos;t seen the
          pairings either, so you can play too.
        </p>
        <div className="flex w-full items-center gap-2 rounded-xl border-2 border-border bg-background/60 p-1.5 pl-3">
          <span className="min-w-0 flex-1 truncate text-left text-sm text-muted">
            {link}
          </span>
          <button type="button" onClick={copy} className="btn-primary shrink-0 px-4 py-2 text-sm">
            {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied ? "Copied" : "Copy link"}
          </button>
        </div>
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
          {canShare ? (
            <button type="button" onClick={share} className="btn-ghost">
              <Share2 className="h-4 w-4" aria-hidden />
              Share
            </button>
          ) : null}
          <a
            href={link}
            onClick={() => track("secret_santa_share", { method: "this_phone" })}
            className="btn-ghost"
          >
            <Smartphone className="h-4 w-4" aria-hidden />
            Everyone&apos;s here: use this phone
          </a>
          <button type="button" onClick={() => setLink(null)} className="btn-ghost">
            <RotateCcw className="h-4 w-4" aria-hidden />
            Edit and redraw
          </button>
        </div>
        <p className="text-xs text-muted">
          Redrawing makes a new link, so only send the latest one.
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
            disabled={!canDraw}
            className="btn-primary w-full py-4 text-lg"
          >
            Draw names
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
