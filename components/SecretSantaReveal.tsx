"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CalendarDays, Check, EyeOff, Gift, Wallet } from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { track } from "@/lib/analytics";
import {
  decodeDraw,
  formatBudget,
  formatDate,
  type SantaDraw,
} from "@/lib/secretSanta";

type Step =
  | { kind: "pick" }
  | { kind: "confirm"; name: string }
  | { kind: "wrapped"; name: string }
  | { kind: "revealed"; name: string };

function openedKey(code: string) {
  return `ss-opened:${code.slice(0, 48)}`;
}

/** Reveal page for a shared draw link: tap your name, confirm it's you, open
 * the gift. Names opened on this device are remembered so a mis-tap is
 * obvious when the phone is passed around. */
export function SecretSantaReveal() {
  const [code, setCode] = useState<string | null>(null);
  const [draw, setDraw] = useState<SantaDraw | null | undefined>(undefined);
  const [opened, setOpened] = useState<string[]>([]);
  const [step, setStep] = useState<Step>({ kind: "pick" });

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    setCode(hash);
    setDraw(hash ? decodeDraw(hash) : null);
    try {
      setOpened(JSON.parse(localStorage.getItem(openedKey(hash)) ?? "[]"));
    } catch {
      setOpened([]);
    }
  }, []);

  function remember(name: string) {
    if (!code) return;
    setOpened((prev) => {
      const next = prev.includes(name) ? prev : [...prev, name];
      try {
        localStorage.setItem(openedKey(code), JSON.stringify(next));
      } catch {
        // Private mode etc. Remembering is a nicety.
      }
      return next;
    });
  }

  if (draw === undefined) {
    return <div className="glass-card mx-auto h-64 max-w-xl animate-pulse" />;
  }

  if (draw === null) {
    return (
      <div className="glass-card mx-auto flex max-w-xl flex-col items-center gap-3 p-8 text-center">
        <span className="text-5xl" aria-hidden>
          🎁
        </span>
        <h1 className="text-2xl font-extrabold text-foreground">This link looks incomplete</h1>
        <p className="text-sm text-muted">
          The draw is stored in the whole link, so make sure you copied all of
          it. Ask your organiser to send it again, or start a new draw.
        </p>
        <Link href="/secret-santa" className="btn-primary mt-2">
          Start a Secret Santa
        </Link>
      </div>
    );
  }

  const budget = formatBudget(draw);
  const date = formatDate(draw.date);
  const sorted = [...draw.names].sort((a, b) => a.localeCompare(b));

  const details = (
    <div className="flex flex-wrap justify-center gap-2 text-sm">
      {budget ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 font-semibold text-foreground">
          <Wallet className="h-4 w-4 text-accent" aria-hidden />
          Budget {budget}
        </span>
      ) : null}
      {date ? (
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background/60 px-3 py-1 font-semibold text-foreground">
          <CalendarDays className="h-4 w-4 text-accent" aria-hidden />
          {date}
        </span>
      ) : null}
    </div>
  );

  return (
    <div className="mx-auto flex max-w-xl flex-col gap-5">
      <header className="text-center">
        <p className="text-sm font-bold uppercase tracking-wide text-accent">🎅 Secret Santa</p>
        <h1 className="mt-1 text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
          {draw.title || "Your Secret Santa"}
        </h1>
        <div className="mt-3">{details}</div>
        {draw.message ? (
          <p className="mx-auto mt-3 max-w-md rounded-2xl border border-border bg-background/60 px-4 py-3 text-sm italic text-foreground">
            “{draw.message}”
          </p>
        ) : null}
      </header>

      {step.kind === "pick" ? (
        <div className="glass-card flex flex-col gap-4 p-5 sm:p-6">
          <div className="text-center">
            <h2 className="text-lg font-extrabold text-foreground">Who are you?</h2>
            <p className="mt-1 text-sm text-muted">
              Tap your own name. No peeking at anyone else&apos;s.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {sorted.map((name) => {
              const done = opened.includes(name);
              return (
                <button
                  key={name}
                  type="button"
                  onClick={() => setStep({ kind: "confirm", name })}
                  className={`inline-flex min-h-12 items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-3 text-sm font-bold transition-all hover:-translate-y-0.5 ${
                    done
                      ? "border-border bg-background/40 text-muted"
                      : "border-accent/50 bg-background/60 text-foreground hover:border-accent"
                  }`}
                >
                  {done ? <Check className="h-4 w-4" aria-hidden /> : null}
                  {name}
                </button>
              );
            })}
          </div>
          {opened.length ? (
            <p className="text-center text-xs text-muted">
              ✓ means that name was already opened on this phone.
            </p>
          ) : null}
        </div>
      ) : null}

      {step.kind === "confirm" ? (
        <div className="glass-card flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <h2 className="text-2xl font-extrabold text-foreground">Are you {step.name}?</h2>
          <p className="max-w-sm text-sm text-muted">
            {opened.includes(step.name)
              ? `${step.name} was already opened on this phone. Only carry on if you're ${step.name}.`
              : "Only open your own name, or you'll spoil someone's surprise."}
          </p>
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-center">
            <button
              type="button"
              onClick={() => setStep({ kind: "wrapped", name: step.name })}
              className="btn-primary"
            >
              Yes, I&apos;m {step.name}
            </button>
            <button type="button" onClick={() => setStep({ kind: "pick" })} className="btn-ghost">
              No, go back
            </button>
          </div>
        </div>
      ) : null}

      {step.kind === "wrapped" ? (
        <div className="glass-card flex flex-col items-center gap-4 p-6 text-center sm:p-8">
          <p className="text-sm font-bold text-muted">{step.name}, your match is inside</p>
          <button
            type="button"
            onClick={(e) => {
              const r = e.currentTarget.getBoundingClientRect();
              confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 40);
              remember(step.name);
              setStep({ kind: "revealed", name: step.name });
              track("secret_santa_reveal", { people: draw.names.length });
            }}
            aria-label="Open your gift"
            className="group relative text-8xl transition-transform hover:scale-110 active:scale-95 motion-safe:animate-bounce"
          >
            🎁
          </button>
          <p className="text-sm font-semibold text-foreground">Tap the gift to open it</p>
        </div>
      ) : null}

      {step.kind === "revealed" ? (
        <div className="glass-card flex flex-col items-center gap-3 p-6 text-center sm:p-8">
          <p className="text-sm font-bold text-muted">{step.name}, you&apos;re buying for</p>
          <p className="break-words text-5xl font-extrabold tracking-tight text-foreground motion-safe:animate-fade-up sm:text-6xl">
            {draw.names[draw.receivers[draw.names.indexOf(step.name)]]}
          </p>
          {budget || date ? <div className="mt-1">{details}</div> : null}
          <p className="mt-2 max-w-sm text-xs text-muted">
            Screenshot this if you&apos;ll forget. Keep it to yourself!
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
      ) : null}

      <p className="text-center text-sm text-muted">
        <Gift className="mr-1 inline h-4 w-4 align-[-2px]" aria-hidden />
        Need gift ideas or running your own?{" "}
        <Link href="/secret-santa" className="font-semibold text-accent hover:underline">
          Make a Secret Santa draw
        </Link>
      </p>
    </div>
  );
}
