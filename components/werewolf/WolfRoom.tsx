"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Check, Copy, Crown, Loader2, Minus, Plus, Share2 } from "lucide-react";
import { fixSetup, MIN_PLAYERS, ROLES, script, SKIN_META, suggestSetup, type Setup } from "@/lib/werewolf";
import type { WolfView } from "@/lib/wolfStore";
import { narrate, primeNarration, say, stopNarration } from "@/lib/narrate";
import { nightAmbience, wolfSfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { confettiBurst } from "@/lib/confetti";
import { track } from "@/lib/analytics";
import { NarratorLine, PlayerGrid, RoleCard, Scene, SpeakingBadge, VoiceToggle } from "./ui";

const PID_KEY = "ol-wolf-pid";
const hostKey = (code: string) => `ol-wolf-host-${code}`;

export function wolfPid(): string {
  try {
    const have = localStorage.getItem(PID_KEY);
    if (have && /^[A-Za-z0-9_-]{12,40}$/.test(have)) return have;
    const a = "abcdefghijkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    const id = Array.from(crypto.getRandomValues(new Uint8Array(20)), (b) => a[b % a.length]).join("");
    localStorage.setItem(PID_KEY, id);
    return id;
  } catch {
    return "anon" + Math.random().toString(36).slice(2, 16);
  }
}

export function rememberHost(code: string, token: string) {
  try {
    localStorage.setItem(hostKey(code), token);
  } catch {
    /* ignore */
  }
}

type View = WolfView & { error?: string | null };

/** Werewolf / Mafia on every phone: secret roles, night actions and votes
 * on each player's own screen; the host's phone narrates out loud. */
export function WolfRoom({ code }: { code: string }) {
  const [pid, setPid] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [view, setView] = useState<View | null>(null);
  const [missing, setMissing] = useState(false);
  const [busy, setBusy] = useState(false);
  const [name, setName] = useState("");
  const [flipped, setFlipped] = useState(false);
  const [setup, setSetup] = useState<Setup | null>(null);
  const [copied, setCopied] = useState(false);
  const [note, setNote] = useState("");
  const lastPhase = useRef<string>("");
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setPid(wolfPid());
    try {
      setToken(localStorage.getItem(hostKey(code)));
      setName(localStorage.getItem("ol-wolf-name") ?? "");
    } catch {
      /* ignore */
    }
    return () => stopNarration();
  }, [code]);

  const call = useCallback(
    async (body: Record<string, unknown>) => {
      if (!pid) return null;
      try {
        const res = await fetch(`/api/wolf/${code}`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ p: pid, t: token, ...body }),
        });
        if (res.status === 404) {
          setMissing(true);
          return null;
        }
        if (!res.ok) return null;
        const v = (await res.json()) as View;
        setView(v);
        return v;
      } catch {
        return null;
      }
    },
    [code, pid, token],
  );

  // Poll for changes.
  useEffect(() => {
    if (!pid) return;
    let stop = false;
    void call({ op: "view" });
    const id = window.setInterval(() => {
      if (!stop && document.visibilityState === "visible") void call({ op: "view" });
    }, 1500);
    return () => {
      stop = true;
      window.clearInterval(id);
    };
  }, [pid, call]);

  const skin = view?.skin ?? "werewolf";
  const S = useMemo(() => script(skin), [skin]);
  const R = ROLES[skin];

  // Phase changes: a buzz on every phone; the host's phone narrates, with
  // night ambience under it, and holds each reveal until the narrator says it.
  const [held, setHeld] = useState(false);
  useEffect(() => {
    if (!view) return;
    const key = `${view.phase}:${view.round}`;
    if (key === lastPhase.current) return;
    const first = lastPhase.current === "";
    lastPhase.current = key;
    if (first) return;
    setFlipped(false);
    haptic(HAPTIC.advance);
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    const names = view.players.map((p) => p.name);
    const isHost = view.isHost;
    if (view.phase === "night") {
      if (isHost) {
        nightAmbience.start();
        wolfSfx.howl();
        window.setTimeout(() => narrate(S.roomNight(view.round)), 1300);
      }
      return;
    }
    if (isHost) nightAmbience.stop();
    if (view.phase === "roles") {
      if (isHost) narrate(S.intro);
      return;
    }
    if (view.phase === "morning" && view.night) {
      const n = view.night;
      const lines = n.killed !== null ? S.morningDead(names[n.killed], n.role) : n.saved ? S.morningSaved : S.morningQuiet;
      if (!isHost) return;
      wolfSfx.morning();
      if (n.killed === null) {
        narrate(lines);
        return;
      }
      setHeld(true);
      void (async () => {
        await say(lines.slice(0, 2));
        setHeld(false);
        wolfSfx.gong();
        await say(lines.slice(2));
      })();
      return;
    }
    if (view.phase === "day") {
      if (isHost) narrate(S.day);
      return;
    }
    if (view.phase === "verdict" && view.vote) {
      const v = view.vote;
      if (!isHost) return;
      if (v.out === null) {
        narrate(S.tie);
        return;
      }
      const lines = S.votedOut(names[v.out], v.role);
      setHeld(true);
      void (async () => {
        await say(lines.slice(0, 2));
        setHeld(false);
        wolfSfx.gong();
        await say(lines.slice(2));
      })();
      return;
    }
    if (view.phase === "end") {
      if (view.winner === "village") {
        const r = top.current?.getBoundingClientRect();
        if (r) confettiBurst(r.left + r.width / 2, r.top + 120, 70);
      } else wolfSfx.howl();
      if (isHost) narrate(view.winner === "village" ? S.villageWins : S.wolvesWin);
      track("werewolf_end", { skin, winner: view.winner ?? "", mode: "room" });
    }
  }, [view, S, skin]);

  useEffect(
    () => () => {
      nightAmbience.stop();
    },
    [],
  );

  async function host(action: string, extra: Record<string, unknown> = {}) {
    if (!view || busy) return;
    primeNarration();
    setBusy(true);
    const v = await call({ op: "host", action, expect: view.phase, ...extra });
    setBusy(false);
    if (v?.error === "few") setNote(`You need at least ${MIN_PLAYERS} players.`);
    else setNote("");
    if (action === "start") track("werewolf_start", { skin, players: view.lobby?.length ?? 0, mode: "room" });
  }

  async function act(target: number) {
    haptic(HAPTIC.advance);
    const v = await call({ op: "act", target });
    if (v?.error) setNote("That choice isn't allowed.");
    else setNote("");
  }

  async function join() {
    const n = name.trim().slice(0, 16);
    if (!n) return;
    try {
      localStorage.setItem("ol-wolf-name", n);
    } catch {
      /* ignore */
    }
    setBusy(true);
    const v = await call({ op: "join", name: n });
    setBusy(false);
    if (v?.error === "started") setNote("This game has already started. Ask the host to start a new round.");
    else if (v?.error === "full") setNote("This room is full.");
  }

  if (missing) {
    return (
      <Scene mood="night" skin="werewolf">
        <div className="py-10 text-center">
          <p className="text-5xl">🌫️</p>
          <h3 className="mt-3 text-2xl font-black">Room not found</h3>
          <p className="mt-1 text-sm text-white/70">The code may be wrong, or the room has expired (rooms last 2 days).</p>
          <Link href="/werewolf-game" className="mt-5 inline-block rounded-2xl bg-white px-6 py-3 font-black text-slate-900">
            Start a new game
          </Link>
        </div>
      </Scene>
    );
  }

  if (!view) {
    return (
      <Scene mood="night" skin="werewolf">
        <div className="grid place-items-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-white/70" aria-hidden />
        </div>
      </Scene>
    );
  }

  const ph = view.phase;
  const mood = ph === "end" ? (view.winner === "wolves" ? "blood" : "day") : ph === "day" || ph === "verdict" ? "day" : ph === "morning" ? "dawn" : "night";
  const dark = mood !== "day";
  const link = typeof window !== "undefined" ? `${window.location.origin}/wolf/${view.code}` : `/wolf/${view.code}`;
  const role = view.me.role;
  const meta = role ? R[role] : null;
  const myI = view.me.i;
  const marks: Record<number, string> = {};
  if (ph === "night" && view.pack) for (const w of view.pack) if (w.pick !== null) marks[w.pick] = `${marks[w.pick] ? marks[w.pick] + " " : ""}${R.wolf.emoji}${w.name.slice(0, 6)}`;
  if (ph === "night" && view.pack) for (const w of view.pack) marks[w.i] = marks[w.i] ?? "pack";
  if (ph === "verdict" && view.vote) view.vote.counts.forEach((c, i) => c && (marks[i] = `${c} vote${c === 1 ? "" : "s"}`));
  const seerTonight = view.checks?.find((c) => c.round === view.round);

  const hostBar = view.isHost ? (
    <div className={`mt-6 rounded-3xl p-4 ${dark ? "bg-black/35" : "bg-white/60"} backdrop-blur`}>
      <p className={`mb-2 flex items-center gap-1.5 text-xs font-black uppercase tracking-[0.15em] ${dark ? "text-amber-300" : "text-amber-700"}`}>
        <Crown className="h-3.5 w-3.5" aria-hidden /> Host controls
      </p>
      {ph === "lobby" ? (
        <HostSetup
          n={view.lobby?.length ?? 0}
          setup={setup ?? suggestSetup(Math.max(MIN_PLAYERS, view.lobby?.length ?? 0))}
          onChange={setSetup}
          skin={skin}
          busy={busy}
          onStart={() => host("start", { setup: setup ?? undefined })}
        />
      ) : ph === "end" ? (
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={busy} onClick={() => host("again")} className="rounded-2xl bg-white px-5 py-3 font-black text-slate-900">
            Play again, new roles
          </button>
          <button type="button" disabled={busy} onClick={() => host("lobby")} className={`rounded-2xl px-5 py-3 font-black ${dark ? "bg-white/15" : "bg-slate-900/10"}`}>
            Back to lobby (add players)
          </button>
        </div>
      ) : (
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={() => host("next")}
            className={`rounded-2xl px-6 py-3.5 font-black shadow-xl transition-transform active:scale-95 disabled:opacity-50 ${dark ? "bg-white text-slate-900" : "bg-slate-900 text-white"}`}
          >
            {ph === "roles"
              ? "Everyone's seen their role: night falls 🌙"
              : ph === "night"
                ? "Wake the town: reveal the morning 🌅"
                : ph === "morning"
                  ? view.over
                    ? "See who won"
                    : "Start the day ☀️"
                  : ph === "day"
                    ? "Count the votes ⚖️"
                    : view.over
                      ? "See who won"
                      : "Next: night falls 🌙"}
          </button>
          {ph === "roles" || ph === "night" || ph === "day" ? (
            <span className="text-sm font-bold opacity-80">
              {view.acted}/{view.aliveCount} {ph === "roles" ? "ready" : ph === "night" ? "done" : "voted"}
            </span>
          ) : null}
        </div>
      )}
      {note ? <p className="mt-2 text-sm font-bold text-red-300">{note}</p> : null}
    </div>
  ) : null;

  return (
    <div ref={top} className="scroll-mt-24">
      <Scene mood={mood} skin={skin}>
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur ${dark ? "bg-white/10" : "bg-slate-900/10"}`}>
            {SKIN_META[skin].emoji} Room {view.code.toUpperCase()} ·{" "}
            {ph === "lobby" ? "Lobby" : ph === "roles" ? "Roles" : ph === "night" ? `Night ${view.round}` : ph === "end" ? "Game over" : `Day ${view.round}`}
          </span>
          {view.isHost ? (
            <span className="flex items-center gap-2">
              <SpeakingBadge dark={dark} />
              <VoiceToggle dark={dark} />
            </span>
          ) : view.me.name ? (
            <span className="text-xs font-bold opacity-80">You: {view.me.name}</span>
          ) : null}
        </div>

        {/* ---------- Lobby ---------- */}
        {ph === "lobby" ? (
          <div className="mx-auto flex max-w-xl flex-col gap-5 text-center">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">Room code</p>
              <p className="mt-1 font-mono text-5xl font-black tracking-[0.25em]">{view.code.toUpperCase()}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    void navigator.clipboard?.writeText(link);
                    setCopied(true);
                    window.setTimeout(() => setCopied(false), 1600);
                  }}
                  className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-bold"
                >
                  {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                  {copied ? "Copied" : "Copy invite link"}
                </button>
                {typeof navigator !== "undefined" && "share" in navigator ? (
                  <button
                    type="button"
                    onClick={() => navigator.share({ title: `Join my ${SKIN_META[skin].title} game`, url: link }).catch(() => {})}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-2 text-sm font-bold"
                  >
                    <Share2 className="h-4 w-4" aria-hidden /> Share
                  </button>
                ) : null}
              </div>
            </div>

            {!view.me.joined ? (
              <form
                className="mx-auto flex w-full max-w-sm gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  void join();
                }}
              >
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                  aria-label="Your name"
                  className="min-w-0 flex-1 rounded-2xl border-2 border-white/15 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none placeholder:text-white/40 focus:border-white/50"
                />
                <button type="submit" disabled={busy || !name.trim()} className="rounded-2xl bg-white px-5 font-black text-slate-900 disabled:opacity-50">
                  Join
                </button>
              </form>
            ) : (
              <p className="text-sm font-bold text-emerald-300">You&apos;re in as {view.me.name}. {view.isHost ? "Start when everyone has joined." : "Waiting for the host to start…"}</p>
            )}

            <div className="flex flex-wrap justify-center gap-2">
              {(view.lobby ?? []).map((n, k) => (
                <span key={`${n}-${k}`} className="rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold motion-safe:animate-pop-in">
                  {k === 0 ? "👑 " : ""}
                  {n}
                </span>
              ))}
            </div>
            <p className="text-xs text-white/60">
              {view.lobby?.length ?? 0} joined · {MIN_PLAYERS}-20 players · everyone plays on their own phone
            </p>
          </div>
        ) : null}

        {/* ---------- Spectator ---------- */}
        {ph !== "lobby" && !view.me.joined ? (
          <div className="py-8 text-center">
            <p className="text-5xl">👀</p>
            <h3 className="mt-2 text-2xl font-black">This game has started</h3>
            <p className="mt-1 text-sm opacity-75">You can join when the host goes back to the lobby for the next round.</p>
          </div>
        ) : null}

        {/* ---------- Roles ---------- */}
        {ph === "roles" && role ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
            <h3 className="text-2xl font-black">Your secret role</h3>
            <RoleCard
              role={role}
              skin={skin}
              revealed={flipped}
              onToggle={() => {
                if (!flipped) wolfSfx.reveal();
                setFlipped((f) => !f);
              }}
            />
            {flipped && view.pack?.length ? (
              <p className="rounded-2xl bg-red-500/25 px-4 py-2 text-sm font-bold">Your pack: {view.pack.map((w) => w.name).join(", ")}</p>
            ) : null}
            {view.myAct === null ? (
              <button type="button" disabled={!flipped} onClick={() => act(0)} className="rounded-2xl bg-white px-8 py-3.5 font-black text-slate-900 shadow-xl disabled:opacity-40">
                Got it, I&apos;m ready
              </button>
            ) : (
              <p className="text-sm font-bold text-emerald-300">Ready. Waiting for everyone ({view.acted}/{view.aliveCount})…</p>
            )}
          </div>
        ) : null}

        {/* ---------- Night ---------- */}
        {ph === "night" && view.me.joined && meta ? (
          view.me.alive ? (
            <div className="mx-auto flex max-w-xl flex-col gap-4">
              <div className="text-center">
                <span className="text-5xl">{meta.emoji}</span>
                <h3 className="mt-1 text-2xl font-black">You&apos;re the {meta.name}</h3>
                <p className="mt-1 text-sm text-white/75">{meta.night}</p>
                <p className="mt-1 text-xs text-white/50">Keep your screen hidden. Everyone taps something, so nobody can tell who&apos;s who.</p>
              </div>
              {role === "seer" && seerTonight ? (
                <div className={`mx-auto w-full max-w-xs rounded-3xl p-5 text-center motion-safe:animate-pop-in ${seerTonight.isWolf ? "bg-red-600/40" : "bg-emerald-500/30"}`}>
                  <p className="text-5xl">{seerTonight.isWolf ? R.wolf.emoji : "😇"}</p>
                  <p className="mt-2 text-xl font-black">
                    {view.players[seerTonight.i]?.name} {seerTonight.isWolf ? (skin === "werewolf" ? "IS a Werewolf!" : "IS in the Mafia!") : `is not ${skin === "werewolf" ? "a Werewolf" : "in the Mafia"}.`}
                  </p>
                </div>
              ) : (
                <PlayerGrid
                  players={view.players}
                  selected={view.myAct}
                  onPick={act}
                  marks={marks}
                  disabled={(i) => (role === "wolf" && Boolean(view.pack?.some((w) => w.i === i))) || ((role === "seer" || role === "villager") && i === myI)}
                />
              )}
              {view.myAct !== null && role !== "seer" ? (
                <p className="text-center text-sm font-bold text-emerald-300">Locked in. You can still change it until the host wakes the town.</p>
              ) : null}
              {role === "seer" && view.checks && view.checks.length > (seerTonight ? 1 : 0) ? (
                <p className="text-center text-xs text-white/70">
                  Earlier: {view.checks.filter((c) => c.round !== view.round).map((c) => `${view.players[c.i]?.name} ${c.isWolf ? R.wolf.emoji : "😇"}`).join(" · ")}
                </p>
              ) : null}
            </div>
          ) : (
            <Dead />
          )
        ) : null}

        {/* ---------- Morning ---------- */}
        {(ph === "morning" || ph === "verdict") && held ? (
          <div className="py-8 text-center">
            <span className="inline-block text-7xl motion-safe:animate-float-slow">{ph === "morning" ? "🌅" : "⚖️"}</span>
            <h3 className="mt-3 text-3xl font-black">{ph === "morning" ? "Everyone, wake up…" : `The ${SKIN_META[skin].town} has spoken…`}</h3>
          </div>
        ) : null}

        {ph === "morning" && view.night && !held ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-3 text-center">
            {view.night.killed !== null ? (
              <>
                <span className="text-7xl motion-safe:animate-pop-in">💀</span>
                <h3 className="text-3xl font-black">{view.players[view.night.killed]?.name} is dead</h3>
                {view.night.role ? <p className="font-bold opacity-85">They were {R[view.night.role].emoji} {R[view.night.role].name}.</p> : null}
                {view.night.killed === myI ? <p className="rounded-full bg-black/30 px-4 py-1.5 text-sm font-bold">That&apos;s you. Stay quiet from here on 🤐</p> : null}
              </>
            ) : (
              <>
                <span className="text-7xl motion-safe:animate-pop-in">{view.night.saved ? "🩺" : "🌅"}</span>
                <h3 className="text-3xl font-black">{view.night.saved ? "The Doctor saved them!" : "Everyone survived"}</h3>
              </>
            )}
          </div>
        ) : null}

        {/* ---------- Day ---------- */}
        {ph === "day" && view.me.joined ? (
          view.me.alive ? (
            <div className="mx-auto flex max-w-xl flex-col gap-4">
              <div className="text-center">
                <h3 className="text-2xl font-black">Vote someone out</h3>
                <p className="mt-1 text-sm font-semibold text-slate-800">Talk it out first. Votes stay secret until the host counts them. ({view.acted}/{view.aliveCount} voted)</p>
              </div>
              <PlayerGrid players={view.players} selected={view.myAct !== null && view.myAct >= 0 ? view.myAct : null} onPick={act} tone="day" disabled={(i) => i === myI} />
              <button
                type="button"
                onClick={() => act(-1)}
                aria-pressed={view.myAct === -1}
                className={`mx-auto rounded-full px-5 py-2 text-sm font-black ${view.myAct === -1 ? "bg-slate-900 text-white" : "bg-white/70 text-slate-900"}`}
              >
                Skip vote
              </button>
            </div>
          ) : (
            <Dead day />
          )
        ) : null}

        {/* ---------- Verdict ---------- */}
        {ph === "verdict" && view.vote && !held ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            {view.vote.out !== null ? (
              <>
                <span className="text-7xl motion-safe:animate-pop-in">{view.vote.role ? R[view.vote.role].emoji : "⚖️"}</span>
                <h3 className="text-3xl font-black">{view.players[view.vote.out]?.name} is out</h3>
                {view.vote.role ? (
                  <p className={`rounded-full px-4 py-1.5 text-sm font-black text-white ${view.vote.role === "wolf" ? "bg-red-600" : "bg-slate-900"}`}>
                    {view.vote.role === "wolf" ? `Got one! ${R.wolf.name} ${R.wolf.emoji}` : `Oops, they were the ${R[view.vote.role].name}`}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <span className="text-7xl">🤷</span>
                <h3 className="text-3xl font-black">{view.vote.tie ? "It's a tie: nobody is out" : "Nobody voted"}</h3>
              </>
            )}
            <VoteBars players={view.players} counts={view.vote.counts} />
          </div>
        ) : null}

        {/* ---------- End ---------- */}
        {ph === "end" ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-4 text-center">
            <span className="text-7xl motion-safe:animate-pop-in">{view.winner === "wolves" ? R.wolf.emoji : "🎉"}</span>
            <h3 className="text-3xl font-black sm:text-4xl">{view.winner === "wolves" ? `The ${R.wolf.plural} win` : `The ${SKIN_META[skin].town} wins`}</h3>
            {role ? (
              <p className="text-sm font-bold opacity-85">
                You were {R[role].emoji} {R[role].name}: {(R[role].team === "wolves") === (view.winner === "wolves") ? "you won! 🏆" : "better luck next time."}
              </p>
            ) : null}
            <div className="grid w-full grid-cols-2 gap-2 sm:grid-cols-3">
              {view.players.map((p) => (
                <div key={p.i} className={`rounded-2xl px-3 py-2 text-left text-sm font-bold ${p.role === "wolf" ? "bg-red-600/40" : dark ? "bg-white/10" : "bg-white/70"} ${p.alive ? "" : "opacity-60"}`}>
                  <span className="mr-1">{p.role ? R[p.role].emoji : ""}</span>
                  {p.name}
                  <span className="block text-[11px] font-semibold opacity-75">
                    {p.role ? R[p.role].name : ""}
                    {p.alive ? "" : " · 💀"}
                  </span>
                </div>
              ))}
            </div>
            {view.story.length ? (
              <ol className={`w-full rounded-2xl p-4 text-left text-sm ${dark ? "bg-black/30" : "bg-white/60"}`}>
                {view.story.map((s, k) => (
                  <li key={k} className="py-0.5">
                    {s}
                  </li>
                ))}
              </ol>
            ) : null}
            {!view.isHost ? <p className="text-xs opacity-70">Waiting for the host to start another round…</p> : null}
          </div>
        ) : null}

        {ph === "night" && view.isHost ? (
          <div className="mt-6">
            <NarratorLine text={S.roomNight(view.round)} />
          </div>
        ) : null}

        {hostBar}
        {note && !view.isHost ? <p className="mt-3 text-center text-sm font-bold text-red-300">{note}</p> : null}
      </Scene>
    </div>
  );
}

function Dead({ day = false }: { day?: boolean }) {
  return (
    <div className="py-8 text-center">
      <p className="text-6xl">👻</p>
      <h3 className="mt-2 text-2xl font-black">You&apos;re out</h3>
      <p className={`mt-1 text-sm ${day ? "text-slate-800" : "text-white/70"}`}>Ghosts don&apos;t talk. Watch the chaos and no hints!</p>
    </div>
  );
}

function VoteBars({ players, counts }: { players: { i: number; name: string }[]; counts: number[] }) {
  const max = Math.max(1, ...counts);
  const rows = players.filter((p) => counts[p.i] > 0).sort((a, b) => counts[b.i] - counts[a.i]);
  if (!rows.length) return null;
  return (
    <div className="w-full max-w-sm space-y-1.5 text-left">
      {rows.map((p) => (
        <div key={p.i} className="flex items-center gap-2 text-sm font-bold">
          <span className="w-20 truncate">{p.name}</span>
          <span className="h-3 flex-1 overflow-hidden rounded-full bg-slate-900/15">
            <span className="block h-full rounded-full bg-slate-900 transition-[width] duration-700" style={{ width: `${(counts[p.i] / max) * 100}%` }} />
          </span>
          <span className="w-5 text-right tabular-nums">{counts[p.i]}</span>
        </div>
      ))}
    </div>
  );
}

function HostSetup({
  n,
  setup,
  onChange,
  skin,
  busy,
  onStart,
}: {
  n: number;
  setup: Setup;
  onChange: (s: Setup) => void;
  skin: "werewolf" | "mafia";
  busy: boolean;
  onStart: () => void;
}) {
  const R = ROLES[skin];
  const size = Math.max(MIN_PLAYERS, n);
  const s = fixSetup(size, setup);
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-2 text-sm font-bold">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/25 px-3 py-1.5">
          {R.wolf.emoji} {s.wolves} {s.wolves === 1 ? R.wolf.name : R.wolf.plural}
          <button type="button" aria-label="Fewer" onClick={() => onChange(fixSetup(size, { ...s, wolves: s.wolves - 1 }))} className="ml-1 grid h-6 w-6 place-items-center rounded-full bg-white/20">
            <Minus className="h-3.5 w-3.5" aria-hidden />
          </button>
          <button type="button" aria-label="More" onClick={() => onChange(fixSetup(size, { ...s, wolves: s.wolves + 1 }))} className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
            <Plus className="h-3.5 w-3.5" aria-hidden />
          </button>
        </span>
        {(["seer", "doctor"] as const).map((r) => (
          <button
            key={r}
            type="button"
            aria-pressed={s[r]}
            onClick={() => onChange(fixSetup(size, { ...s, [r]: !s[r] }))}
            className={`rounded-full px-3 py-1.5 ${s[r] ? "bg-violet-500/30" : "bg-white/5 text-white/40 line-through"}`}
          >
            {R[r].emoji} {R[r].name}
          </button>
        ))}
        <label className="inline-flex items-center gap-1.5 text-xs">
          <input type="checkbox" checked={s.reveal} onChange={(e) => onChange({ ...s, reveal: e.target.checked })} className="h-4 w-4 accent-red-500" />
          Reveal roles when out
        </label>
      </div>
      <button
        type="button"
        disabled={busy || n < MIN_PLAYERS}
        onClick={onStart}
        className="rounded-2xl bg-white py-3.5 text-lg font-black text-slate-900 shadow-xl transition-transform active:scale-95 disabled:opacity-40"
      >
        {n < MIN_PLAYERS ? `Waiting for ${MIN_PLAYERS - n} more player${MIN_PLAYERS - n === 1 ? "" : "s"}` : `Deal roles to ${n} players ${SKIN_META[skin].emoji}`}
      </button>
    </div>
  );
}
