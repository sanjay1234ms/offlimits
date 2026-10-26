"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Plus, Share2, Trash2, Trophy } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track } from "@/lib/analytics";

export interface QuizTemplate {
  q: string;
  options: string[];
}

const FIELD =
  "w-full rounded-xl border-2 border-border bg-background/60 px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent";

function useCopy() {
  const [copied, setCopied] = useState<string | null>(null);
  const copy = async (k: string, text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(k);
      setTimeout(() => setCopied((c) => (c === k ? null : c)), 1800);
    } catch {
      /* ignore */
    }
  };
  return { copied, copy };
}

/* ------------------------------------------------------------------ */
/* Builder                                                             */
/* ------------------------------------------------------------------ */

interface Draft {
  q: string;
  options: string[];
  answer: number | null;
  on: boolean;
}

/** Host builds a "How well do you know …" quiz and gets a link for guests. */
export function QuizBuilder({
  subjectLabel,
  subjectPlaceholder,
  titleTemplate,
  templates,
  slug,
}: {
  /** e.g. "The bride's name" */
  subjectLabel: string;
  subjectPlaceholder: string;
  /** "{name}" is replaced, e.g. "How well do you know {name}?" */
  titleTemplate: string;
  templates: QuizTemplate[];
  slug: string;
}) {
  const [subject, setSubject] = useState("");
  const [drafts, setDrafts] = useState<Draft[]>(() => templates.map((t, i) => ({ ...t, options: [...t.options], answer: null, on: i < 10 })));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [link, setLink] = useState<string | null>(null);
  const { copied, copy } = useCopy();

  const name = subject.trim() || subjectPlaceholder.replace(/^e\.g\.\s*/i, "");
  const fill = (s: string) => s.replace(/\{name\}/g, name);
  const chosen = drafts.filter((d) => d.on);
  const ready = chosen.filter((d) => d.answer !== null && d.options.filter((o) => o.trim()).length >= 2);

  function update(i: number, patch: Partial<Draft>) {
    setDrafts((list) => list.map((d, j) => (j === i ? { ...d, ...patch } : d)));
  }

  async function create() {
    setError("");
    if (!subject.trim()) {
      setError("Add a name first so guests know who the quiz is about.");
      return;
    }
    if (ready.length < 3) {
      setError("Pick the right answer on at least 3 questions.");
      return;
    }
    setBusy(true);
    try {
      const res = await fetch("/api/boards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          kind: "quiz",
          title: fill(titleTemplate),
          config: {
            subject: name,
            questions: ready.map((d) => {
              const opts = d.options.map((o) => fill(o.trim())).filter(Boolean);
              const answerText = fill(d.options[d.answer!].trim());
              return { q: fill(d.q), options: opts, answer: Math.max(0, opts.indexOf(answerText)) };
            }),
          },
        }),
      });
      if (!res.ok) throw new Error(String(res.status));
      const { id } = (await res.json()) as { id: string };
      const url = `${window.location.origin}/quiz/${id}`;
      setLink(url);
      try {
        const saved = JSON.parse(localStorage.getItem("ol-quizzes") ?? "[]");
        localStorage.setItem("ol-quizzes", JSON.stringify([{ id, title: fill(titleTemplate), at: Date.now() }, ...saved].slice(0, 10)));
      } catch {
        /* ignore */
      }
      track("quiz_created", { game: slug, questions: ready.length });
    } catch {
      setError("Couldn't create the quiz. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  if (link) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-[2rem] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 p-6 text-center text-white shadow-xl sm:p-8">
        <span className="text-5xl" aria-hidden>
          💌
        </span>
        <h3 className="text-2xl font-black">{fill(titleTemplate)} is ready!</h3>
        <p className="max-w-md text-sm font-medium text-white/90">
          Send this link to the group chat. Everyone plays on their own phone and lands on a live leaderboard.
        </p>
        <div className="flex w-full max-w-md items-center gap-2 rounded-2xl bg-white/15 p-1.5 pl-3 ring-1 ring-white/30">
          <span className="min-w-0 flex-1 truncate text-left font-mono text-xs">{link}</span>
          <button type="button" onClick={() => copy("l", link)} className="inline-flex shrink-0 items-center gap-1.5 rounded-xl bg-white px-3 py-2 text-sm font-black text-slate-900">
            {copied === "l" ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
            {copied === "l" ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-2">
          {typeof navigator !== "undefined" && "share" in navigator ? (
            <button
              type="button"
              onClick={() => navigator.share({ title: fill(titleTemplate), url: link }).catch(() => {})}
              className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold ring-1 ring-white/40"
            >
              <Share2 className="h-4 w-4" aria-hidden />
              Share
            </button>
          ) : null}
          <Link href={link.replace(window.location.origin, "")} className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-bold ring-1 ring-white/40">
            <Trophy className="h-4 w-4" aria-hidden />
            Open it / leaderboard
          </Link>
          <button type="button" onClick={() => setLink(null)} className="rounded-full px-4 py-2 text-sm font-bold text-white/80 underline">
            Make another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card flex flex-col gap-4 p-5 sm:p-6">
      <div>
        <h3 className="text-lg font-black text-foreground">{fill(titleTemplate)}</h3>
        <p className="mt-1 text-sm text-muted">
          Tap the right answer on each question (edit any option), then send the link. Guests play on their own phones.
        </p>
      </div>
      <label className="flex flex-col gap-1.5">
        <span className="text-sm font-bold text-foreground">{subjectLabel}</span>
        <input value={subject} onChange={(e) => setSubject(e.target.value.slice(0, 30))} placeholder={subjectPlaceholder} className={FIELD} />
      </label>

      <ol className="flex flex-col gap-3">
        {drafts.map((d, i) => (
          <li key={i} className={`rounded-2xl p-3 ring-1 transition-colors ${d.on ? "bg-white/5 ring-border" : "bg-transparent opacity-50 ring-white/5"}`}>
            <div className="flex items-start gap-2">
              <input
                type="checkbox"
                checked={d.on}
                onChange={(e) => update(i, { on: e.target.checked })}
                className="mt-1 h-4 w-4 accent-[var(--accent)]"
                aria-label="Include this question"
              />
              <input value={fill(d.q)} onChange={(e) => update(i, { q: e.target.value })} className="flex-1 bg-transparent text-sm font-bold text-foreground outline-none" />
            </div>
            {d.on ? (
              <div className="mt-2 grid grid-cols-2 gap-1.5">
                {d.options.map((o, k) => (
                  <div key={k} className="relative">
                    <input
                      value={fill(o)}
                      onChange={(e) => update(i, { options: d.options.map((x, j) => (j === k ? e.target.value : x)) })}
                      onFocus={() => update(i, { answer: k })}
                      className={`w-full rounded-xl border-2 px-2.5 py-2 pr-7 text-xs font-semibold outline-none transition-colors ${
                        d.answer === k ? "border-emerald-400 bg-emerald-400/15 text-foreground" : "border-border bg-background/40 text-muted"
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => update(i, { answer: k })}
                      aria-label="This is the right answer"
                      className={`absolute right-1.5 top-1/2 grid h-5 w-5 -translate-y-1/2 place-items-center rounded-full ${d.answer === k ? "bg-emerald-400 text-slate-900" : "bg-white/10 text-transparent"}`}
                    >
                      <Check className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            ) : null}
          </li>
        ))}
      </ol>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDrafts((l) => [...l, { q: "Your own question?", options: ["", "", "", ""], answer: null, on: true }])}
          className="btn-ghost px-3 py-2 text-xs"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden />
          Add your own question
        </button>
        {drafts.length > templates.length ? (
          <button type="button" onClick={() => setDrafts((l) => l.slice(0, -1))} className="btn-ghost px-3 py-2 text-xs">
            <Trash2 className="h-3.5 w-3.5" aria-hidden />
            Remove last
          </button>
        ) : null}
      </div>
      {error ? <p className="text-sm font-bold text-rose-400">{error}</p> : null}
      <button type="button" onClick={create} disabled={busy} className="btn-primary w-full py-3.5">
        {busy ? "Creating…" : `Create quiz · ${ready.length} question${ready.length === 1 ? "" : "s"} ready`}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Guest play + leaderboard                                            */
/* ------------------------------------------------------------------ */

interface QuizView {
  id: string;
  title: string;
  subject: string;
  questions: { q: string; options: string[] }[];
  entries: { name: string; score: number | null; total?: number }[];
}

function ScoreRing({ score, total }: { score: number; total: number }) {
  const pct = total ? score / total : 0;
  const R = 52;
  const C = 2 * Math.PI * R;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
        <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="12" />
        <circle
          cx="60"
          cy="60"
          r={R}
          fill="none"
          stroke="url(#qr)"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={C}
          strokeDashoffset={C * (1 - pct)}
          style={{ transition: "stroke-dashoffset 1.2s cubic-bezier(.16,1,.3,1)" }}
        />
        <defs>
          <linearGradient id="qr" x1="0" x2="1">
            <stop offset="0" stopColor="#f472b6" />
            <stop offset="1" stopColor="#facc15" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute inset-0 grid place-items-center text-center">
        <span>
          <span className="block text-4xl font-black text-white">{Math.round(pct * 100)}%</span>
          <span className="text-xs font-bold text-white/70">
            {score}/{total}
          </span>
        </span>
      </div>
    </div>
  );
}

function Leaderboard({ entries, me }: { entries: QuizView["entries"]; me?: string }) {
  if (!entries.length) return <p className="text-center text-sm text-muted">No scores yet. Be the first!</p>;
  return (
    <ol className="space-y-1.5">
      {entries.slice(0, 25).map((e, i) => (
        <li
          key={`${e.name}-${i}`}
          className={`flex items-center gap-3 rounded-2xl px-3 py-2 ring-1 ${e.name === me ? "bg-amber-400/15 ring-amber-400/60" : "bg-white/5 ring-border"}`}
        >
          <span className="w-7 text-center text-lg">{["🥇", "🥈", "🥉"][i] ?? <span className="text-sm font-black text-muted">{i + 1}</span>}</span>
          <span className="flex-1 truncate font-bold text-foreground">{e.name}</span>
          <span className="font-black tabular-nums text-accent">
            {e.score}/{e.total}
          </span>
        </li>
      ))}
    </ol>
  );
}

/** The page a guest opens from the share link. */
export function QuizPlay({ id }: { id: string }) {
  const [view, setView] = useState<QuizView | null | undefined>(undefined);
  const [name, setName] = useState("");
  const [started, setStarted] = useState(false);
  const [q, setQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<{ score: number; correct: number[] } | null>(null);
  const [busy, setBusy] = useState(false);
  const stage = useRef<HTMLDivElement>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/boards/${id}`, { cache: "no-store" });
      setView(res.ok ? await res.json() : null);
    } catch {
      /* keep last */
    }
  }, [id]);

  useEffect(() => {
    load();
    const t = window.setInterval(load, 6000);
    return () => window.clearInterval(t);
  }, [load]);

  useEffect(() => {
    try {
      const prev = JSON.parse(localStorage.getItem(`ol-quiz-${id}`) ?? "null");
      if (prev?.score !== undefined) {
        setResult(prev);
        setName(prev.name ?? "");
        setAnswers(prev.answers ?? []);
      }
    } catch {
      /* ignore */
    }
  }, [id]);

  async function choose(k: number) {
    if (!view) return;
    sfx.tick(1);
    haptic(HAPTIC.advance);
    const next = [...answers, k];
    setAnswers(next);
    if (q + 1 < view.questions.length) {
      setQ(q + 1);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch(`/api/boards/${id}/entries`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() || "Guest", payload: { answers: next } }),
      });
      const out = (await res.json()) as { score: number; correct: number[] };
      setResult(out);
      try {
        localStorage.setItem(`ol-quiz-${id}`, JSON.stringify({ ...out, name: name.trim(), answers: next }));
      } catch {
        /* ignore */
      }
      sfx.win();
      requestAnimationFrame(() => {
        const r = stage.current?.getBoundingClientRect();
        if (r) confettiBurst(r.left + r.width / 2, r.top + 120, 70);
      });
      track("quiz_played", { score: out.score, total: view.questions.length });
      load();
    } finally {
      setBusy(false);
    }
  }

  if (view === undefined) return <div className="glass-card mx-auto h-72 max-w-xl animate-pulse" />;
  if (view === null)
    return (
      <div className="glass-card mx-auto max-w-xl p-8 text-center">
        <p className="text-2xl font-black text-foreground">This quiz has ended or the link is wrong</p>
        <Link href="/" className="btn-primary mt-4 inline-flex">
          Find more games
        </Link>
      </div>
    );

  const total = view.questions.length;

  if (result) {
    const pct = result.score / total;
    const verdict = pct === 1 ? "Basically their twin 👯" : pct >= 0.7 ? "Certified bestie 💖" : pct >= 0.4 ? "Not bad, not great 😅" : "Do you even know them? 🙈";
    return (
      <div ref={stage} className="mx-auto flex max-w-xl flex-col gap-4">
        <div className="flex flex-col items-center gap-3 rounded-[2rem] bg-gradient-to-br from-violet-600 via-fuchsia-600 to-pink-500 p-6 text-center text-white shadow-xl">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-white/80">{view.title}</p>
          <ScoreRing score={result.score} total={total} />
          <p className="text-2xl font-black">{verdict}</p>
        </div>
        <div className="glass-card p-5">
          <h2 className="mb-3 flex items-center gap-2 text-lg font-black text-foreground">
            <Trophy className="h-5 w-5 text-amber-400" aria-hidden />
            Live leaderboard
          </h2>
          <Leaderboard entries={view.entries} me={name.trim() || "Guest"} />
        </div>
        <details className="glass-card px-5 py-4">
          <summary className="cursor-pointer font-bold text-foreground">See the right answers</summary>
          <ol className="mt-3 space-y-2 text-sm">
            {view.questions.map((qq, k) => (
              <li key={k}>
                <p className="font-bold text-foreground">{qq.q}</p>
                <p className={answers[k] === result.correct[k] ? "text-emerald-400" : "text-rose-400"}>
                  {answers[k] === result.correct[k] ? "✓ " : `✗ You said ${qq.options[answers[k]] ?? "-"} · `}
                  {qq.options[result.correct[k]]}
                </p>
              </li>
            ))}
          </ol>
        </details>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="mx-auto flex max-w-xl flex-col gap-4">
        <div className="rounded-[2rem] bg-gradient-to-br from-fuchsia-500 via-pink-500 to-rose-500 p-7 text-center text-white shadow-xl">
          <p className="text-5xl" aria-hidden>
            💖
          </p>
          <h1 className="mt-2 text-3xl font-black">{view.title}</h1>
          <p className="mt-1 text-sm font-medium text-white/90">
            {total} questions · {view.entries.length} {view.entries.length === 1 ? "person has" : "people have"} played
          </p>
        </div>
        <form
          className="glass-card flex flex-col gap-3 p-5"
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) setStarted(true);
          }}
        >
          <label className="text-sm font-bold text-foreground" htmlFor="quiz-name">
            Your name for the leaderboard
          </label>
          <input id="quiz-name" value={name} onChange={(e) => setName(e.target.value.slice(0, 24))} placeholder="e.g. Julia" className={FIELD} />
          <button type="submit" disabled={!name.trim()} className="btn-primary py-3.5">
            Start the quiz
          </button>
        </form>
        <div className="glass-card p-5">
          <h2 className="mb-3 text-sm font-black uppercase tracking-wider text-muted">Leaderboard so far</h2>
          <Leaderboard entries={view.entries} />
        </div>
      </div>
    );
  }

  const cur = view.questions[q];
  return (
    <div ref={stage} className="mx-auto flex max-w-xl flex-col gap-4">
      <div className="flex items-center gap-1">
        {view.questions.map((_, k) => (
          <span key={k} className={`h-1.5 flex-1 rounded-full transition-colors ${k < q ? "bg-pink-500" : k === q ? "bg-pink-500/60" : "bg-white/10"}`} />
        ))}
      </div>
      <div key={q} className="rounded-[2rem] bg-white p-6 text-center shadow-2xl motion-safe:animate-pop-in sm:p-8">
        <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-500">
          Question {q + 1} of {total}
        </p>
        <p className="mt-3 text-balance text-2xl font-black leading-snug text-slate-900">{cur.q}</p>
      </div>
      <div className="grid gap-2 sm:grid-cols-2">
        {cur.options.map((o, k) => (
          <button
            key={k}
            type="button"
            disabled={busy}
            onClick={() => choose(k)}
            className="rounded-2xl bg-white/5 px-4 py-4 text-left text-base font-bold text-foreground ring-2 ring-border transition-all hover:-translate-y-0.5 hover:ring-pink-400 active:scale-[0.98]"
          >
            <span className="mr-2 inline-grid h-7 w-7 place-items-center rounded-full bg-pink-500/20 text-sm font-black text-pink-400">
              {String.fromCharCode(65 + k)}
            </span>
            {o}
          </button>
        ))}
      </div>
    </div>
  );
}
