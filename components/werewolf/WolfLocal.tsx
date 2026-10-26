"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Minus, Pause, Play, Plus, RotateCcw, UserPlus, X } from "lucide-react";
import {
  dealRoles,
  fixSetup,
  MAX_PLAYERS,
  MIN_PLAYERS,
  nightOrder,
  resolveNight,
  ROLES,
  script,
  SKIN_META,
  suggestSetup,
  winner,
  type Role,
  type Setup,
  type Skin,
  type Team,
} from "@/lib/werewolf";
import { narrate, primeNarration, say, stopNarration } from "@/lib/narrate";
import { nightAmbience, wolfSfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { confettiBurst } from "@/lib/confetti";
import { track } from "@/lib/analytics";
import { NarratorLine, PlayerGrid, RoleCard, Scene, SpeakingBadge, VoiceToggle } from "./ui";

type Phase = "setup" | "deal" | "night" | "morning" | "day" | "verdict" | "end";

interface Story {
  round: number;
  text: string;
}

const NAMES_KEY = "ol-wolf-names";

/** One phone in the middle of the table: the app deals roles, narrates the
 * night (calling each role awake in turn) and runs the day vote. */
export function WolfLocal({ skin }: { skin: Skin }) {
  const S = useMemo(() => script(skin), [skin]);
  const R = ROLES[skin];
  const [phase, setPhase] = useState<Phase>("setup");
  const [names, setNames] = useState<string[]>([]);
  const [draft, setDraft] = useState("");
  const [setup, setSetup] = useState<Setup>(suggestSetup(6));
  const [custom, setCustom] = useState(false);
  const [roles, setRoles] = useState<Role[]>([]);
  const [alive, setAlive] = useState<boolean[]>([]);
  const [round, setRound] = useState(1);
  // Deal
  const [dealIdx, setDealIdx] = useState(0);
  const [peek, setPeek] = useState<"pass" | "look">("pass");
  const [flipped, setFlipped] = useState(false);
  // Night
  const [step, setStep] = useState(0);
  const [pick, setPick] = useState<number | null>(null);
  const [wolfPick, setWolfPick] = useState<number | null>(null);
  const [savePick, setSavePick] = useState<number | null>(null);
  const [seerShown, setSeerShown] = useState(false);
  /** The narrator has finished calling this role awake. */
  const [awake, setAwake] = useState(false);
  /** The role the narrator is calling right now; null while everyone sleeps. */
  const [calling, setCalling] = useState<Role | null>(null);
  /** Morning/verdict: the narrator has reached the big reveal. */
  const [reveal, setReveal] = useState(true);
  const [night, setNight] = useState<{ killed: number | null; saved: boolean } | null>(null);
  // Day
  const [out, setOut] = useState<number | null | "none">(null);
  const [timer, setTimer] = useState(180);
  const [running, setRunning] = useState(false);
  const [win, setWin] = useState<Team | null>(null);
  const [story, setStory] = useState<Story[]>([]);
  const top = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(NAMES_KEY) ?? "[]");
      if (Array.isArray(saved)) setNames(saved.filter((n) => typeof n === "string").slice(0, MAX_PLAYERS));
    } catch {
      /* ignore */
    }
    return () => {
      flow.current++;
      stopNarration();
      nightAmbience.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!custom) setSetup(suggestSetup(Math.max(MIN_PLAYERS, names.length)));
  }, [names.length, custom]);

  // Day timer
  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setTimer((t) => {
        if (t <= 1) {
          setRunning(false);
          wolfSfx.gong();
          return 0;
        }
        if (t <= 11) wolfSfx.heartbeat();
        return t - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [running]);

  const steps = useMemo(() => nightOrder(roles, alive), [roles, alive]);
  const stepRole = steps[step] as Role | undefined;
  const players = names.map((name, i) => ({ i, name, alive: alive[i] ?? true }));
  const mood = phase === "end" ? (win === "wolves" ? "blood" : "day") : phase === "day" || phase === "verdict" ? "day" : phase === "morning" ? "dawn" : "night";
  const dark = mood !== "day";

  function scrollTop() {
    top.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function saveNames(list: string[]) {
    setNames(list);
    try {
      localStorage.setItem(NAMES_KEY, JSON.stringify(list));
    } catch {
      /* ignore */
    }
  }

  function addName() {
    const n = draft.trim().slice(0, 16);
    if (!n || names.length >= MAX_PLAYERS || names.some((x) => x.toLowerCase() === n.toLowerCase())) return;
    saveNames([...names, n]);
    setDraft("");
  }

  function start() {
    const s = fixSetup(names.length, setup);
    setSetup(s);
    setRoles(dealRoles(names.length, s));
    setAlive(names.map(() => true));
    setRound(1);
    setDealIdx(0);
    setPeek("pass");
    setFlipped(false);
    setStory([]);
    setWin(null);
    setPhase("deal");
    flow.current++;
    nightAmbience.stop();
    primeNarration();
    narrate(S.intro);
    track("werewolf_start", { skin, players: names.length, mode: "local" });
    scrollTop();
  }

  function nextDeal() {
    setFlipped(false);
    if (dealIdx + 1 < names.length) {
      setDealIdx(dealIdx + 1);
      setPeek("pass");
    } else {
      setPeek("pass");
      setDealIdx(names.length);
    }
  }

  /** Each night/day flow gets a ticket; an old flow stops when a new one starts. */
  const flow = useRef(0);
  const pauseFor = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

  async function wakeStep(k: number, order: Role[], ticket: number) {
    const role = order[k];
    if (!role || ticket !== flow.current) return;
    setStep(k);
    setPick(null);
    setSeerShown(false);
    setAwake(false);
    setCalling(role);
    wolfSfx.heartbeat();
    await say(S.wake(role));
    if (ticket === flow.current) setAwake(true);
  }

  async function beginNight(r: number) {
    const ticket = ++flow.current;
    setRound(r);
    setStep(0);
    setAwake(false);
    setCalling(null);
    setPick(null);
    setWolfPick(null);
    setSavePick(null);
    setSeerShown(false);
    setPhase("night");
    scrollTop();
    primeNarration();
    nightAmbience.start();
    wolfSfx.howl();
    await pauseFor(1400);
    if (ticket !== flow.current) return;
    await say(S.nightFall(r));
    if (ticket !== flow.current) return;
    await pauseFor(1500);
    await wakeStep(0, nightOrder(roles, alive), ticket);
  }

  async function confirmStep() {
    if (!stepRole || pick === null || !awake) return;
    haptic(HAPTIC.advance);
    if (stepRole === "seer" && !seerShown) {
      setSeerShown(true);
      wolfSfx.reveal();
      return;
    }
    const ticket = flow.current;
    if (stepRole === "wolf") setWolfPick(pick);
    if (stepRole === "doctor") setSavePick(pick);
    const w = stepRole === "wolf" ? pick : wolfPick;
    const sv = stepRole === "doctor" ? pick : savePick;
    setAwake(false);
    setCalling(null);
    setPick(null);
    setSeerShown(false);
    await say(S.sleep(stepRole));
    if (ticket !== flow.current) return;
    await pauseFor(1800);
    if (ticket !== flow.current) return;
    if (step + 1 < steps.length) await wakeStep(step + 1, steps, ticket);
    else void endNight(w, sv, ticket);
  }

  async function endNight(w: number | null, sv: number | null, ticket: number) {
    const res = resolveNight(w === null ? [] : [w], sv, alive);
    const nextAlive = [...alive];
    if (res.killed !== null) nextAlive[res.killed] = false;
    nightAmbience.stop();
    setAlive(nextAlive);
    setNight({ killed: res.killed, saved: res.saved });
    setStory((s) => [...s, { round, text: res.killed !== null ? `Night ${round}: ${names[res.killed]} was ${skin === "werewolf" ? "eaten" : "taken out"}.` : res.saved ? `Night ${round}: the Doctor saved the victim.` : `Night ${round}: nobody died.` }]);
    setWin(winner(roles, nextAlive));
    setReveal(false);
    setPhase("morning");
    scrollTop();
    wolfSfx.morning();
    await pauseFor(900);
    if (ticket !== flow.current) return;
    const lines =
      res.killed !== null
        ? S.morningDead(names[res.killed], setup.reveal ? roles[res.killed] : undefined)
        : res.saved
          ? S.morningSaved
          : S.morningQuiet;
    // Hold the big reveal until the narrator gets to the name.
    const before = res.killed !== null ? lines.slice(0, 2) : lines;
    await say(before);
    if (ticket !== flow.current) return;
    setReveal(true);
    if (res.killed !== null) {
      wolfSfx.gong();
      await say(lines.slice(2));
    }
  }

  function finish(team: Team) {
    flow.current++;
    nightAmbience.stop();
    setWin(team);
    setPhase("end");
    narrate(team === "village" ? S.villageWins : S.wolvesWin);
    if (team === "village") {
      wolfSfx.morning();
      const r = top.current?.getBoundingClientRect();
      if (r) confettiBurst(r.left + r.width / 2, r.top + 120, 70);
    } else wolfSfx.howl();
    track("werewolf_end", { skin, winner: team, mode: "local" });
    scrollTop();
  }

  async function confirmVote() {
    if (out === null) return;
    const ticket = ++flow.current;
    const nextAlive = [...alive];
    if (out !== "none") nextAlive[out] = false;
    setAlive(nextAlive);
    setRunning(false);
    setWin(winner(roles, nextAlive));
    setReveal(false);
    setPhase("verdict");
    scrollTop();
    if (out === "none") {
      setStory((s) => [...s, { round, text: `Day ${round}: nobody was voted out.` }]);
      setReveal(true);
      await say(S.tie);
      return;
    }
    setStory((s) => [...s, { round, text: `Day ${round}: ${names[out]} was voted out${setup.reveal ? ` (${R[roles[out]].name})` : ""}.` }]);
    const lines = S.votedOut(names[out], setup.reveal ? roles[out] : undefined);
    await say(lines.slice(0, 2));
    if (ticket !== flow.current) return;
    wolfSfx.gong();
    setReveal(true);
    if (lines.length > 2) await say(lines.slice(2));
  }

  /* ---------------------------------------------------------------- */

  const n = names.length;
  const canStart = n >= MIN_PLAYERS;

  return (
    <div ref={top} className="scroll-mt-24">
      <Scene mood={mood} skin={skin}>
        <div className="mb-5 flex items-center justify-between gap-2">
          <span className={`rounded-full px-3 py-1 text-xs font-black uppercase tracking-wider backdrop-blur ${dark ? "bg-white/10" : "bg-slate-900/10"}`}>
            {phase === "setup" ? `${SKIN_META[skin].emoji} One phone` : phase === "deal" ? "Dealing roles" : phase === "night" ? `🌙 Night ${round}` : phase === "end" ? "Game over" : `☀️ Day ${round}`}
          </span>
          <span className="flex items-center gap-2">
            <SpeakingBadge dark={dark} />
            <VoiceToggle dark={dark} />
          </span>
        </div>

        {/* ---------------- Setup ---------------- */}
        {phase === "setup" ? (
          <div className="mx-auto flex max-w-xl flex-col gap-5">
            <div className="text-center">
              <h3 className="text-2xl font-black sm:text-3xl">Who&apos;s playing?</h3>
              <p className="mt-1 text-sm text-white/70">
                {MIN_PLAYERS}-{MAX_PLAYERS} players. Put the phone in the middle: the app is the narrator, so everyone gets to play.
              </p>
            </div>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                addName();
              }}
            >
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Add a player's name"
                aria-label="Player name"
                className="min-w-0 flex-1 rounded-2xl border-2 border-white/15 bg-white/10 px-4 py-3 text-base font-bold text-white outline-none placeholder:text-white/40 focus:border-white/50"
              />
              <button type="submit" className="grid h-[3.25rem] w-[3.25rem] place-items-center rounded-2xl bg-white text-slate-900 transition-transform active:scale-90" aria-label="Add player">
                <UserPlus className="h-5 w-5" aria-hidden />
              </button>
            </form>
            {n ? (
              <div className="flex flex-wrap gap-2">
                {names.map((name, i) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => saveNames(names.filter((_, j) => j !== i))}
                    className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold text-white backdrop-blur transition-colors hover:bg-red-500/40"
                    title="Remove"
                  >
                    {name}
                    <X className="h-3.5 w-3.5 opacity-70" aria-hidden />
                  </button>
                ))}
              </div>
            ) : null}

            <div className="rounded-3xl bg-black/30 p-4 backdrop-blur">
              <div className="flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-[0.15em] text-white/70">Roles</p>
                <button type="button" onClick={() => setCustom((c) => !c)} className="text-xs font-bold text-white/70 underline-offset-2 hover:underline">
                  {custom ? "Use recommended" : "Customise"}
                </button>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-bold">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-red-500/25 px-3 py-1.5">
                  {R.wolf.emoji} {setup.wolves} {setup.wolves === 1 ? R.wolf.name : R.wolf.plural}
                  {custom ? (
                    <>
                      <button type="button" aria-label="Fewer" onClick={() => setSetup((s) => fixSetup(Math.max(n, MIN_PLAYERS), { ...s, wolves: s.wolves - 1 }))} className="ml-1 grid h-6 w-6 place-items-center rounded-full bg-white/20">
                        <Minus className="h-3.5 w-3.5" aria-hidden />
                      </button>
                      <button type="button" aria-label="More" onClick={() => setSetup((s) => fixSetup(Math.max(n, MIN_PLAYERS), { ...s, wolves: s.wolves + 1 }))} className="grid h-6 w-6 place-items-center rounded-full bg-white/20">
                        <Plus className="h-3.5 w-3.5" aria-hidden />
                      </button>
                    </>
                  ) : null}
                </span>
                {(["seer", "doctor"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    disabled={!custom}
                    aria-pressed={setup[r]}
                    onClick={() => setSetup((s) => fixSetup(Math.max(n, MIN_PLAYERS), { ...s, [r]: !s[r] }))}
                    className={`rounded-full px-3 py-1.5 transition-colors ${setup[r] ? "bg-violet-500/30" : "bg-white/5 text-white/40 line-through"}`}
                  >
                    {R[r].emoji} {R[r].name}
                  </button>
                ))}
                <span className="rounded-full bg-emerald-500/20 px-3 py-1.5">
                  {R.villager.emoji} {Math.max(0, Math.max(n, MIN_PLAYERS) - setup.wolves - (setup.seer ? 1 : 0) - (setup.doctor ? 1 : 0))} {R.villager.plural}
                </span>
              </div>
              {custom ? (
                <label className="mt-3 flex items-center gap-2 text-xs font-bold text-white/80">
                  <input type="checkbox" checked={setup.reveal} onChange={(e) => setSetup((s) => ({ ...s, reveal: e.target.checked }))} className="h-4 w-4 accent-red-500" />
                  Reveal a player&apos;s role when they&apos;re out
                </label>
              ) : null}
            </div>

            <button type="button" disabled={!canStart} onClick={start} className="rounded-2xl bg-white py-4 text-lg font-black text-slate-900 shadow-xl transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-40">
              {canStart ? `Deal the roles ${SKIN_META[skin].emoji}` : `Add ${MIN_PLAYERS - n} more player${MIN_PLAYERS - n === 1 ? "" : "s"}`}
            </button>
          </div>
        ) : null}

        {/* ---------------- Deal ---------------- */}
        {phase === "deal" ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-5 text-center">
            {dealIdx < n ? (
              peek === "pass" ? (
                <>
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-white/60">
                    Player {dealIdx + 1} of {n}
                  </p>
                  <h3 className="text-3xl font-black">Pass the phone to {names[dealIdx]}</h3>
                  <p className="text-sm text-white/70">Everyone else, look away. No peeking.</p>
                  <button type="button" onClick={() => setPeek("look")} className="rounded-2xl bg-white px-8 py-4 text-lg font-black text-slate-900 shadow-xl transition-transform active:scale-95">
                    I&apos;m {names[dealIdx]} 👀
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-black">{names[dealIdx]}, this is you</h3>
                  <RoleCard
                    role={roles[dealIdx]}
                    skin={skin}
                    revealed={flipped}
                    onToggle={() => {
                      if (!flipped) wolfSfx.reveal();
                      setFlipped((f) => !f);
                    }}
                  />
                  {roles[dealIdx] === "wolf" && flipped && setup.wolves > 1 ? (
                    <p className="rounded-2xl bg-red-500/20 px-4 py-2 text-sm font-bold">
                      Your pack: {roles.flatMap((r, i) => (r === "wolf" && i !== dealIdx ? [names[i]] : [])).join(", ")}
                    </p>
                  ) : null}
                  <button type="button" disabled={!flipped} onClick={nextDeal} className="rounded-2xl bg-white px-8 py-3.5 font-black text-slate-900 shadow-xl transition-transform active:scale-95 disabled:opacity-40">
                    Got it, hide my card
                  </button>
                </>
              )
            ) : (
              <>
                <span className="text-6xl motion-safe:animate-float-slow">🌕</span>
                <h3 className="text-3xl font-black">Everyone knows their role</h3>
                <p className="text-sm text-white/75">Put the phone in the middle where everyone can hear it. When the narrator calls your role, open your eyes and tap your choice. Quietly.</p>
                <button type="button" onClick={() => beginNight(1)} className="rounded-2xl bg-white px-8 py-4 text-lg font-black text-slate-900 shadow-xl transition-transform active:scale-95">
                  Night falls 🌙
                </button>
              </>
            )}
          </div>
        ) : null}

        {/* ---------------- Night ---------------- */}
        {phase === "night" ? (
          <div className="mx-auto flex max-w-xl flex-col gap-5">
            {calling && awake ? (
              <>
                <div className="text-center">
                  <span className="text-6xl motion-safe:animate-pop-in">{R[calling].emoji}</span>
                  <h3 className="mt-2 text-2xl font-black">{calling === "wolf" ? R.wolf.plural : `The ${R[calling].name}`}, it&apos;s your turn</h3>
                  <p className="mt-1 text-sm text-white/70">{R[calling].night} Tap quietly. Everyone else keeps their eyes shut.</p>
                </div>
                {calling === "seer" && seerShown && pick !== null ? (
                  <div className={`mx-auto w-full max-w-xs rounded-3xl p-5 text-center motion-safe:animate-pop-in ${roles[pick] === "wolf" ? "bg-red-600/40" : "bg-emerald-500/30"}`}>
                    <p className="text-5xl">{roles[pick] === "wolf" ? R.wolf.emoji : "😇"}</p>
                    <p className="mt-2 text-xl font-black">
                      {names[pick]} {roles[pick] === "wolf" ? (skin === "werewolf" ? "IS a Werewolf!" : "IS in the Mafia!") : `is not ${skin === "werewolf" ? "a Werewolf" : "in the Mafia"}.`}
                    </p>
                  </div>
                ) : (
                  <PlayerGrid
                    players={players}
                    selected={pick}
                    onPick={setPick}
                    disabled={(i) => (calling === "wolf" && roles[i] === "wolf") || (calling === "seer" && roles[i] === "seer")}
                  />
                )}
                <button type="button" disabled={pick === null} onClick={confirmStep} className="mx-auto rounded-2xl bg-white px-8 py-3.5 font-black text-slate-900 shadow-xl transition-transform active:scale-95 disabled:opacity-40">
                  {calling === "seer" && !seerShown ? "Reveal 🔮" : "Done, close your eyes"}
                </button>
              </>
            ) : (
              <div className="py-8 text-center">
                <span className="inline-block text-6xl motion-safe:animate-float-slow">{calling ? R[calling].emoji : "😴"}</span>
                <p className="mt-3 text-lg font-bold text-white/80">
                  {calling ? (calling === "wolf" ? `${R.wolf.plural}, listen…` : `${R[calling].name}, listen…`) : "Everyone sleeps…"}
                </p>
                <p className="mt-1 text-xs font-semibold text-white/50">Eyes closed. The narrator will tell you when.</p>
              </div>
            )}
          </div>
        ) : null}

        {/* ---------------- Morning ---------------- */}
        {phase === "morning" && night ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
            {!reveal ? (
              <>
                <span className="text-7xl motion-safe:animate-float-slow">🌅</span>
                <h3 className="text-3xl font-black">Everyone, wake up…</h3>
              </>
            ) : night.killed !== null ? (
              <>
                <span className="text-7xl motion-safe:animate-pop-in">💀</span>
                <h3 className="text-3xl font-black">{names[night.killed]} is dead</h3>
                {setup.reveal ? <p className="text-base font-bold text-white/85">They were {R[roles[night.killed]].emoji} {R[roles[night.killed]].name}.</p> : null}
              </>
            ) : (
              <>
                <span className="text-7xl motion-safe:animate-pop-in">{night.saved ? "🩺" : "🌅"}</span>
                <h3 className="text-3xl font-black">{night.saved ? "The Doctor saved them!" : "Everyone survived"}</h3>
              </>
            )}
            <button
              type="button"
              onClick={() => {
                if (win) return finish(win);
                setOut(null);
                setTimer(180);
                setRunning(true);
                setPhase("day");
                flow.current++;
                narrate(S.day);
              }}
              disabled={!reveal}
              className="rounded-2xl bg-white px-8 py-3.5 font-black text-slate-900 shadow-xl transition-transform active:scale-95 disabled:opacity-40"
            >
              {win ? "See who won" : "Start the day ☀️"}
            </button>
          </div>
        ) : null}

        {/* ---------------- Day ---------------- */}
        {phase === "day" ? (
          <div className="mx-auto flex max-w-xl flex-col gap-5">
            <div className="text-center">
              <p className="text-5xl font-black tabular-nums">
                {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, "0")}
              </p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <button type="button" onClick={() => setRunning((r) => !r)} className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/10 px-3 py-1.5 text-xs font-black">
                  {running ? <Pause className="h-3.5 w-3.5" aria-hidden /> : <Play className="h-3.5 w-3.5" aria-hidden />}
                  {running ? "Pause" : "Resume"}
                </button>
                <button type="button" onClick={() => setTimer((t) => t + 60)} className="rounded-full bg-slate-900/10 px-3 py-1.5 text-xs font-black">
                  +1 min
                </button>
              </div>
              <p className="mt-3 text-sm font-semibold text-slate-800">Argue, accuse, defend. Then vote by pointing on three, and tap who the {SKIN_META[skin].town} voted out.</p>
            </div>
            <PlayerGrid players={players} selected={typeof out === "number" ? out : null} onPick={setOut} tone="day" />
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button type="button" onClick={() => setOut("none")} aria-pressed={out === "none"} className={`rounded-full px-4 py-2 text-sm font-black ${out === "none" ? "bg-slate-900 text-white" : "bg-white/70 text-slate-900"}`}>
                Tie: nobody&apos;s out
              </button>
              <button type="button" disabled={out === null} onClick={confirmVote} className="rounded-2xl bg-slate-900 px-6 py-3 font-black text-white shadow-xl transition-transform active:scale-95 disabled:opacity-40">
                Lock in the vote
              </button>
            </div>
          </div>
        ) : null}

        {/* ---------------- Verdict ---------------- */}
        {phase === "verdict" ? (
          <div className="mx-auto flex max-w-md flex-col items-center gap-4 text-center">
            {!reveal ? (
              <>
                <span className="text-7xl motion-safe:animate-float-slow">⚖️</span>
                <h3 className="text-3xl font-black">The {SKIN_META[skin].town} has spoken…</h3>
              </>
            ) : out !== "none" && out !== null ? (
              <>
                <span className="text-7xl motion-safe:animate-pop-in">{setup.reveal ? R[roles[out]].emoji : "⚖️"}</span>
                <h3 className="text-3xl font-black">{names[out]} is out</h3>
                {setup.reveal ? (
                  <p className={`rounded-full px-4 py-1.5 text-sm font-black ${roles[out] === "wolf" ? "bg-red-600 text-white" : "bg-slate-900 text-white"}`}>
                    {roles[out] === "wolf" ? `Got one! ${R.wolf.name} ${R.wolf.emoji}` : `Oops, they were the ${R[roles[out]].name}`}
                  </p>
                ) : null}
              </>
            ) : (
              <>
                <span className="text-7xl">🤷</span>
                <h3 className="text-3xl font-black">Nobody is out</h3>
              </>
            )}
            <button type="button" disabled={!reveal} onClick={() => (win ? finish(win) : void beginNight(round + 1))} className="rounded-2xl bg-slate-900 px-8 py-3.5 font-black text-white shadow-xl transition-transform active:scale-95 disabled:opacity-40">
              {win ? "See who won" : "Night falls 🌙"}
            </button>
          </div>
        ) : null}

        {/* ---------------- End ---------------- */}
        {phase === "end" && win ? (
          <div className="mx-auto flex max-w-xl flex-col items-center gap-5 text-center">
            <span className="text-7xl motion-safe:animate-pop-in">{win === "wolves" ? R.wolf.emoji : "🎉"}</span>
            <h3 className="text-3xl font-black sm:text-4xl">{win === "wolves" ? `The ${R.wolf.plural} win` : `The ${SKIN_META[skin].town} wins`}</h3>
            <div className={`grid w-full grid-cols-2 gap-2 sm:grid-cols-3 ${dark ? "" : "text-slate-900"}`}>
              {names.map((name, i) => (
                <div key={name} className={`rounded-2xl px-3 py-2 text-left text-sm font-bold ${roles[i] === "wolf" ? "bg-red-600/40" : dark ? "bg-white/10" : "bg-white/70"} ${alive[i] ? "" : "opacity-60"}`}>
                  <span className="mr-1">{R[roles[i]].emoji}</span>
                  {name}
                  <span className="block text-[11px] font-semibold opacity-75">
                    {R[roles[i]].name}
                    {alive[i] ? "" : " · 💀"}
                  </span>
                </div>
              ))}
            </div>
            {story.length ? (
              <ol className={`w-full rounded-2xl p-4 text-left text-sm ${dark ? "bg-black/30" : "bg-white/60"}`}>
                {story.map((s, k) => (
                  <li key={k} className="py-0.5">
                    {s.text}
                  </li>
                ))}
              </ol>
            ) : null}
            <div className="flex flex-wrap justify-center gap-2">
              <button type="button" onClick={start} className="inline-flex items-center gap-2 rounded-2xl bg-white px-6 py-3 font-black text-slate-900 shadow-xl">
                <RotateCcw className="h-4 w-4" aria-hidden /> Play again, new roles
              </button>
              <button type="button" onClick={() => setPhase("setup")} className={`rounded-2xl px-6 py-3 font-black ${dark ? "bg-white/15 text-white" : "bg-slate-900/10 text-slate-900"}`}>
                Change players
              </button>
            </div>
          </div>
        ) : null}

        {/* Narrator caption (night / morning / verdict) */}
        {phase === "night" ? (
          <div className="mt-6">
            <NarratorLine text={calling ? S.wake(calling) : S.nightFall(round)} />
          </div>
        ) : null}
      </Scene>
    </div>
  );
}
