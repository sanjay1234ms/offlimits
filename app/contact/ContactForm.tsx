"use client";

import { useMemo, useState } from "react";
import { Check, Copy, Mail, Send } from "lucide-react";

export const CONTACT_EMAIL = "hello@playofflimits.com";

const CATEGORIES = [
  { id: "card-idea", label: "Card idea", subject: "Card idea submission" },
  { id: "bug", label: "Bug report", subject: "Bug report and device feedback" },
  { id: "billing", label: "Party Pass and billing", subject: "Party Pass and billing" },
  {
    id: "partnerships",
    label: "Partnerships and events",
    subject: "Partnerships and custom events",
  },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];

const PLACEHOLDER =
  "Tell us what happened, what you had in mind, or what you need. If it is a bug, include your device, browser, and roughly when it happened.";

/** Client-side contact form. There is no backend, so submitting composes a
 * pre-filled message and hands it to the visitor's own mail client. */
export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState<CategoryId>("card-idea");
  const [message, setMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [copied, setCopied] = useState(false);

  const active = useMemo(
    () => CATEGORIES.find((c) => c.id === category) ?? CATEGORIES[0],
    [category],
  );

  const canSend = name.trim().length > 0 && message.trim().length > 0;

  const mailtoHref = useMemo(() => {
    const subject = `[${active.subject}] from ${name.trim() || "a player"}`;
    const body = [
      `Name: ${name.trim() || "(not given)"}`,
      `Email: ${email.trim() || "(not given)"}`,
      `Topic: ${active.label}`,
      "",
      message.trim(),
    ].join("\n");
    return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
  }, [active, name, email, message]);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!canSend) return;
    window.location.href = mailtoHref;
    setSent(true);
  }

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  const fieldClass =
    "w-full rounded-2xl border border-slate-200 bg-white/80 px-4 py-3 text-sm font-medium text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-accent focus:ring-2 focus:ring-accent/40 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-100 dark:placeholder:text-slate-500";

  return (
    <div className="rounded-3xl border border-slate-200 bg-white/80 p-6 backdrop-blur-sm dark:border-white/10 dark:bg-slate-900/60 sm:p-8">
      {sent ? (
        <div className="flex flex-col items-start gap-3 py-4">
          <span className="grid h-11 w-11 place-items-center rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-600 dark:border-emerald-500/30 dark:bg-emerald-500/10 dark:text-emerald-300">
            <Check className="h-5 w-5" aria-hidden />
          </span>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Your mail client should be open
          </h3>
          <p className="max-w-md text-sm leading-relaxed text-slate-600 dark:text-slate-300">
            We pre-filled the note for you. Hit send in your email app and it
            lands with a real person. If nothing opened, write to us directly at{" "}
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="font-bold text-accent hover:underline"
            >
              {CONTACT_EMAIL}
            </a>
            .
          </p>
          <button
            type="button"
            onClick={() => setSent(false)}
            className="btn-ghost mt-1"
          >
            Write another
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Name
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={80}
                autoComplete="name"
                placeholder="Alex Rivera"
                className={fieldClass}
              />
            </label>
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Email
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                maxLength={120}
                autoComplete="email"
                placeholder="you@example.com"
                className={fieldClass}
              />
            </label>
          </div>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              What is this about?
            </span>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={category === c.id}
                  onClick={() => setCategory(c.id)}
                  className="filter-chip"
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Message
            </span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              maxLength={4000}
              placeholder={PLACEHOLDER}
              className={`${fieldClass} resize-y leading-relaxed`}
            />
          </label>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={!canSend}
              className="btn-primary w-full sm:w-auto"
            >
              <Send className="h-4 w-4" aria-hidden />
              Send message
            </button>

            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Mail className="h-4 w-4 shrink-0" aria-hidden />
              <span>Prefer your own client?</span>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-bold text-accent hover:underline"
              >
                {CONTACT_EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label="Copy email address"
                className="grid h-7 w-7 place-items-center rounded-lg border border-slate-200 bg-white/80 text-slate-500 transition-colors hover:text-slate-900 dark:border-white/10 dark:bg-slate-900/60 dark:text-slate-400 dark:hover:text-white"
              >
                {copied ? (
                  <Check className="h-3.5 w-3.5" aria-hidden />
                ) : (
                  <Copy className="h-3.5 w-3.5" aria-hidden />
                )}
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
