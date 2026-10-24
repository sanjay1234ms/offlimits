"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy, Link2, Printer, Sparkles } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { track } from "@/lib/analytics";
import { fromBase64Url, toBase64Url } from "@/lib/secretSanta";

interface Question {
  id: string;
  emoji: string;
  label: string;
  placeholder: string;
  /** Quick-pick chips instead of free text. */
  chips?: string[];
  long?: boolean;
  /** The one box we nudge everyone to fill in. */
  key?: boolean;
}

export const QUESTIONS: Question[] = [
  { id: "taste", emoji: "🍬", label: "Sweet or savoury?", placeholder: "", chips: ["Sweet", "Savoury", "Both, obviously", "Neither"] },
  { id: "snack", emoji: "🍿", label: "A snack that would make your day", placeholder: "Ketchup chips, dark chocolate, anything with sea salt" },
  { id: "drink", emoji: "☕", label: "Your go-to drink", placeholder: "Oat latte, peppermint tea, ginger ale" },
  { id: "colours", emoji: "🎨", label: "Colours you actually wear or use", placeholder: "Forest green, black, nothing neon" },
  { id: "hobbies", emoji: "🎳", label: "How you spend a free afternoon", placeholder: "Hiking, baking, board games, napping" },
  { id: "treat", emoji: "✨", label: "A small thing you'd love but never buy yourself", placeholder: "Fancy hot sauce, a nice notebook, warm slippers" },
  { id: "shops", emoji: "🛍️", label: "Shops or brands you like", placeholder: "Indigo, Uniqlo, the local bakery" },
  { id: "avoid", emoji: "🚫", label: "Allergies or things to avoid", placeholder: "Peanut allergy, no strong scents, vegetarian", key: true, long: true },
  { id: "nope", emoji: "🙅", label: "A gift you'd rather not get", placeholder: "Another mug. I have eleven." },
  { id: "sizes", emoji: "🧦", label: "Sizes (only if you want to share)", placeholder: "Socks 9–11, hoodie L" },
  { id: "now", emoji: "📺", label: "Into right now: shows, books, games", placeholder: "Rewatching The Office, a cozy mystery series" },
  { id: "else", emoji: "💌", label: "Anything else your Santa should know", placeholder: "You can never go wrong with good chocolate", long: true },
];

type Answers = Record<string, string>;

const FIELD =
  "w-full rounded-xl border-2 border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

function encode(name: string, answers: Answers): string {
  return toBase64Url(JSON.stringify({ n: name, a: QUESTIONS.map((q) => answers[q.id] ?? "") }));
}

function decode(code: string): { name: string; answers: Answers } | null {
  try {
    const raw = JSON.parse(fromBase64Url(code));
    if (!Array.isArray(raw?.a)) return null;
    const answers: Answers = {};
    QUESTIONS.forEach((q, i) => {
      const v = raw.a[i];
      if (typeof v === "string" && v) answers[q.id] = v.slice(0, 300);
    });
    return { name: String(raw.n ?? "").slice(0, 40), answers };
  } catch {
    return null;
  }
}

function asText(name: string, answers: Answers): string {
  const lines = [`🎁 Secret Santa questionnaire${name ? ` for ${name}` : ""}`, ""];
  for (const q of QUESTIONS) {
    if (answers[q.id]?.trim()) lines.push(`${q.emoji} ${q.label}`, answers[q.id].trim(), "");
  }
  return lines.join("\n").trim();
}

/** A fill-in-the-blanks gift questionnaire. Answers live only in the link it
 * makes (?a=...), so there's nothing stored anywhere. */
export function SantaQuestionnaire() {
  const [name, setName] = useState("");
  const [answers, setAnswers] = useState<Answers>({});
  const [sharedFrom, setSharedFrom] = useState<string | null>(null);
  const [copied, setCopied] = useState<"link" | "text" | null>(null);
  const celebrated = useRef(false);
  const meterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get("a");
    const parsed = code ? decode(code) : null;
    if (parsed) {
      setName(parsed.name);
      setAnswers(parsed.answers);
      setSharedFrom(parsed.name || "Someone");
      celebrated.current = true;
    }
  }, []);

  const answered = QUESTIONS.filter((q) => answers[q.id]?.trim()).length;
  const pct = Math.round((answered / QUESTIONS.length) * 100);

  useEffect(() => {
    if (answered === QUESTIONS.length && !celebrated.current && meterRef.current) {
      celebrated.current = true;
      const r = meterRef.current.getBoundingClientRect();
      confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 50);
      track("santa_questionnaire_complete");
    }
  }, [answered]);

  function set(id: string, value: string) {
    setAnswers((a) => ({ ...a, [id]: value }));
    if (sharedFrom) setSharedFrom(null);
  }

  function startBlank() {
    setName("");
    setAnswers({});
    setSharedFrom(null);
    celebrated.current = false;
    window.history.replaceState(null, "", window.location.pathname);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function copy(kind: "link" | "text") {
    const text =
      kind === "link"
        ? `${window.location.origin}${window.location.pathname}?a=${encode(name.trim(), answers)}`
        : asText(name.trim(), answers);
    try {
      await navigator.clipboard.writeText(text);
      setCopied(kind);
      setTimeout(() => setCopied((c) => (c === kind ? null : c)), 2000);
      track("santa_questionnaire_share", { method: kind, answered });
    } catch {
      setCopied(null);
    }
  }

  const meterMood =
    answered === QUESTIONS.length
      ? "Your Santa is going to nail this 🎯"
      : answered >= 8
        ? "Nearly there, looking great"
        : answered >= 4
          ? "Good start, keep going"
          : answered >= 1
            ? "Every answer helps"
            : "Tap any question to start";

  const actions = (
    <div className="no-print flex flex-wrap gap-2">
      <button type="button" onClick={() => copy("link")} className="btn-primary px-4 py-2.5 text-sm">
        {copied === "link" ? <Check className="h-4 w-4" aria-hidden /> : <Link2 className="h-4 w-4" aria-hidden />}
        {copied === "link" ? "Link copied" : "Copy share link"}
      </button>
      <button type="button" onClick={() => copy("text")} className="btn-ghost px-4 py-2.5 text-sm">
        {copied === "text" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
        {copied === "text" ? "Copied" : "Copy as text"}
      </button>
      <button
        type="button"
        onClick={() => {
          track("santa_questionnaire_print");
          window.print();
        }}
        className="btn-ghost px-4 py-2.5 text-sm"
      >
        <Printer className="h-4 w-4" aria-hidden />
        Print
      </button>
    </div>
  );

  return (
    <div id="santa-q" className="mx-auto flex max-w-2xl flex-col gap-4">
      <style>{`@media print {
        body * { visibility: hidden !important; }
        #santa-q, #santa-q * { visibility: visible !important; }
        #santa-q { position: absolute; inset: 0 auto auto 0; width: 100%; color: #000; }
        #santa-q .no-print { display: none !important; }
        #santa-q .glass-card { box-shadow: none !important; background: #fff !important; border: 1px solid #999 !important; break-inside: avoid; }
      }`}</style>

      {sharedFrom ? (
        <div className="no-print flex flex-col items-center gap-2 rounded-[1.75rem] border-2 border-amber-300/60 bg-gradient-to-br from-amber-300 to-yellow-400 p-5 text-center text-slate-900 shadow-lg motion-safe:animate-pop-in">
          <span className="text-4xl" aria-hidden>
            📝
          </span>
          <p className="text-xl font-extrabold">{sharedFrom}&apos;s answers</p>
          <p className="text-sm font-medium">Shopping for {sharedFrom}? Here&apos;s your cheat sheet. Editing any box starts your own copy.</p>
          <button
            type="button"
            onClick={startBlank}
            className="mt-1 rounded-full border-2 border-slate-900 bg-white px-4 py-1.5 text-sm font-bold text-slate-900 shadow-[3px_3px_0_#0f172a] transition-transform hover:-translate-y-0.5"
          >
            Fill in a blank one
          </button>
        </div>
      ) : null}

      {/* Progress meter */}
      <div
        ref={meterRef}
        className="glass-card no-print sticky top-20 z-10 flex flex-col gap-2 p-4 sm:p-5"
      >
        <div className="flex items-baseline justify-between gap-3">
          <p className="text-sm font-bold text-foreground">
            <span className="text-2xl font-extrabold tabular-nums">{answered}</span>
            <span className="text-muted"> / {QUESTIONS.length} answered</span>
          </p>
          <p key={meterMood} className="text-right text-xs font-semibold text-muted motion-safe:animate-fade-up">
            {meterMood}
          </p>
        </div>
        <div className="h-3 overflow-hidden rounded-full bg-border/60" role="progressbar" aria-valuenow={pct} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="h-full rounded-full bg-gradient-to-r from-rose-500 via-amber-400 to-emerald-400 transition-[width] duration-500 ease-out"
            style={{ width: `${Math.max(pct, 3)}%` }}
          />
        </div>
      </div>

      <div className="glass-card flex flex-col gap-2 p-5 sm:p-6">
        <label htmlFor="sq-name" className="text-sm font-bold text-foreground">
          👋 Your name
        </label>
        <input
          id="sq-name"
          value={name}
          onChange={(e) => {
            setName(e.target.value.slice(0, 40));
            if (sharedFrom) setSharedFrom(null);
          }}
          placeholder="Priya"
          className={FIELD}
        />
      </div>

      {QUESTIONS.map((q, i) => {
        const value = answers[q.id] ?? "";
        const done = Boolean(value.trim());
        return (
          <div
            key={q.id}
            style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
            className={`glass-card flex flex-col gap-2 p-5 transition-colors motion-safe:animate-fade-up sm:p-6 ${
              q.key ? "ring-2 ring-amber-400/50" : ""
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <label htmlFor={`sq-${q.id}`} className="text-sm font-bold text-foreground">
                <span className="mr-1.5" aria-hidden>
                  {q.emoji}
                </span>
                {q.label}
              </label>
              <span
                aria-hidden
                className={`grid h-6 w-6 shrink-0 place-items-center rounded-full transition-all duration-300 ${
                  done ? "scale-100 bg-emerald-500 text-white" : "scale-75 bg-border/60 text-transparent"
                }`}
              >
                <Check className="h-3.5 w-3.5" />
              </span>
            </div>
            {q.key ? (
              <p className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                The most useful box. Fill this one in even if you skip the rest.
              </p>
            ) : null}
            {q.chips ? (
              <div className="flex flex-wrap gap-2" role="radiogroup" aria-label={q.label}>
                {q.chips.map((chip) => {
                  const on = value === chip;
                  return (
                    <button
                      key={chip}
                      type="button"
                      role="radio"
                      aria-checked={on}
                      onClick={() => set(q.id, on ? "" : chip)}
                      className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                        on
                          ? "scale-105 border-accent bg-accent text-white shadow-md"
                          : "border-border bg-background/60 text-foreground hover:border-accent"
                      }`}
                    >
                      {chip}
                    </button>
                  );
                })}
              </div>
            ) : q.long ? (
              <textarea
                id={`sq-${q.id}`}
                value={value}
                onChange={(e) => set(q.id, e.target.value.slice(0, 300))}
                rows={3}
                placeholder={q.placeholder}
                className={`${FIELD} resize-y`}
              />
            ) : (
              <input
                id={`sq-${q.id}`}
                value={value}
                onChange={(e) => set(q.id, e.target.value.slice(0, 300))}
                placeholder={q.placeholder}
                className={FIELD}
              />
            )}
          </div>
        );
      })}

      <div className="glass-card no-print flex flex-col gap-3 p-5 sm:p-6">
        <p className="text-sm font-bold text-foreground">Done? Send it to your Santa or the organiser.</p>
        {actions}
        <p className="text-xs text-muted">
          Nothing is saved on our side. Your answers live only inside the link
          you copy, so nobody sees them unless you share it.
        </p>
      </div>
    </div>
  );
}
