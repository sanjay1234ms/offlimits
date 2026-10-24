"use client";

import { useEffect, useRef, useState } from "react";
import {
  Check,
  Copy,
  Gift,
  Play,
  RotateCcw,
  Shuffle,
  Snowflake,
  Undo2,
} from "lucide-react";
import { confettiBurst } from "@/lib/confetti";
import { track } from "@/lib/analytics";
import { shuffle } from "@/lib/shuffle";
import { parseNames } from "@/lib/secretSanta";
import {
  canSteal,
  isWeGame,
  newGame,
  openGift,
  skipFinalSwap,
  stealGift,
  type WeGame,
} from "@/lib/whiteElephant";

const FIELD =
  "w-full rounded-xl border-2 border-border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors placeholder:text-muted/60 focus:border-accent";
const GAME_KEY = "we-game-v1";

type Tab = "shuffle" | "hat" | "game";

function burstFrom(el: Element | null, count = 40) {
  if (!el) return;
  const r = el.getBoundingClientRect();
  confettiBurst(r.left + r.width / 2, r.top + r.height / 2, count);
}

/* ------------------------------------------------------------------ */
/* Shuffle names                                                       */
/* ------------------------------------------------------------------ */

function ShuffleNames({
  raw,
  setRaw,
  onStart,
}: {
  raw: string;
  setRaw: (v: string) => void;
  onStart: (order: string[]) => void;
}) {
  const names = parseNames(raw);
  const [order, setOrder] = useState<string[] | null>(null);
  const [spinning, setSpinning] = useState(false);
  const [round, setRound] = useState(0);
  const [copied, setCopied] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);

  function go() {
    if (names.length < 2 || spinning) return;
    setSpinning(true);
    setCopied(false);
    let ticks = 0;
    // A few fast fake shuffles, then settle on the real one.
    const timer = setInterval(() => {
      setOrder(shuffle(names));
      if (++ticks >= 9) {
        clearInterval(timer);
        setOrder(shuffle(names));
        setRound((r) => r + 1);
        setSpinning(false);
        requestAnimationFrame(() => burstFrom(listRef.current, 30));
        track("white_elephant_shuffle", { people: names.length });
      }
    }, 90);
  }

  async function copy() {
    if (!order) return;
    try {
      await navigator.clipboard.writeText(
        `🐘 White Elephant turn order\n\n${order.map((n, i) => `${i + 1}. ${n}`).join("\n")}`,
      );
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold text-foreground">
          Everyone who brought a gift, one per line
        </span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={"Priya\nSam\nJordan\nAlex"}
          className={`${FIELD} resize-y font-mono leading-relaxed`}
        />
      </label>
      <p className="-mt-2 text-xs text-muted">
        {names.length < 2 ? "Add at least two names." : `${names.length} people.`}
      </p>
      <button
        type="button"
        onClick={go}
        disabled={names.length < 2 || spinning}
        className="btn-primary w-full py-3.5 text-base"
      >
        <Shuffle className={`h-5 w-5 ${spinning ? "animate-spin" : ""}`} aria-hidden />
        {spinning ? "Shuffling…" : order ? "Shuffle again" : "Shuffle the order"}
      </button>

      {order ? (
        <>
          <ol ref={listRef} className="grid gap-2 sm:grid-cols-2">
            {order.map((name, i) => (
              <li
                key={`${round}-${spinning ? i : name}`}
                style={{ animationDelay: spinning ? "0ms" : `${i * 55}ms` }}
                className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 ${
                  i === 0 && !spinning
                    ? "border-amber-400 bg-amber-400/15"
                    : "border-border bg-background/60"
                } ${spinning ? "opacity-70 blur-[1px]" : "motion-safe:animate-pop-in [animation-fill-mode:both]"}`}
              >
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-white">
                  {i + 1}
                </span>
                <span className="min-w-0 truncate font-bold text-foreground">{name}</span>
                {i === 0 && !spinning ? (
                  <span className="ml-auto text-xs font-bold text-amber-500">goes first</span>
                ) : null}
              </li>
            ))}
          </ol>
          {!spinning ? (
            <div className="flex flex-wrap gap-2">
              <button type="button" onClick={copy} className="btn-ghost px-4 py-2 text-sm">
                {copied ? <Check className="h-4 w-4" aria-hidden /> : <Copy className="h-4 w-4" aria-hidden />}
                {copied ? "Copied" : "Copy the order"}
              </button>
              <button type="button" onClick={() => onStart(order)} className="btn-primary px-4 py-2 text-sm">
                <Play className="h-4 w-4" aria-hidden />
                Run the game with this order
              </button>
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Draw from a hat                                                     */
/* ------------------------------------------------------------------ */

function HatDraw() {
  const [count, setCount] = useState("10");
  const [hat, setHat] = useState<number[] | null>(null);
  const [drawn, setDrawn] = useState<number | null>(null);
  const [shaking, setShaking] = useState(false);
  const numRef = useRef<HTMLParagraphElement>(null);

  const n = Math.min(100, Math.max(2, Number(count) || 0));

  function fill() {
    setHat(shuffle(Array.from({ length: n }, (_, i) => i + 1)));
    setDrawn(null);
    track("white_elephant_hat", { people: n });
  }

  function draw() {
    if (!hat?.length || shaking) return;
    setShaking(true);
    setTimeout(() => {
      setDrawn(hat[0]);
      setHat(hat.slice(1));
      setShaking(false);
      requestAnimationFrame(() => burstFrom(numRef.current, hat[0] === 1 ? 50 : 18));
    }, 650);
  }

  if (!hat) {
    return (
      <div className="flex flex-col gap-4">
        <label className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-foreground">How many people brought a gift?</span>
          <input
            type="number"
            min={2}
            max={100}
            inputMode="numeric"
            value={count}
            onChange={(e) => setCount(e.target.value)}
            className={`${FIELD} !w-24`}
          />
        </label>
        <button type="button" onClick={fill} className="btn-primary w-full py-3.5 text-base">
          🎩 Fill the hat with {n} numbers
        </button>
        <p className="text-xs text-muted">
          Pass the phone round. Each person taps once and sees only their own
          number, so nobody knows who&apos;s first until the game starts.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-4 text-center">
      {drawn !== null ? (
        <>
          <p className="text-sm font-semibold text-muted">Your number. Remember it, then hide it.</p>
          <p
            ref={numRef}
            key={drawn}
            className="text-8xl font-extrabold tabular-nums text-foreground motion-safe:animate-pop-in"
          >
            {drawn}
          </p>
          {drawn === 1 ? (
            <p className="text-sm font-bold text-amber-500">You go first! 🎉</p>
          ) : drawn === n ? (
            <p className="text-sm font-bold text-emerald-500">Last pick, best seat in the house 😎</p>
          ) : null}
          <button type="button" onClick={() => setDrawn(null)} className="btn-primary w-full py-3.5 text-base">
            Hide it and pass the phone
          </button>
        </>
      ) : hat.length ? (
        <>
          <p className="text-sm font-semibold text-muted">
            {hat.length} of {n} numbers left in the hat
          </p>
          <button
            type="button"
            onClick={draw}
            aria-label="Draw your number"
            className={`text-8xl transition-transform hover:scale-110 active:scale-95 ${
              shaking ? "animate-wiggle [animation-iteration-count:infinite]" : "motion-safe:animate-float-slow"
            }`}
          >
            🎩
          </button>
          <button type="button" onClick={draw} disabled={shaking} className="btn-primary w-full py-3.5 text-base">
            {shaking ? "Rummaging…" : "Draw your number"}
          </button>
        </>
      ) : (
        <>
          <p className="text-5xl" aria-hidden>
            🎉
          </p>
          <p className="text-xl font-extrabold text-foreground">The hat is empty</p>
          <p className="text-sm text-muted">Everyone has a number. Whoever drew 1, you&apos;re up!</p>
        </>
      )}
      <button type="button" onClick={() => setHat(null)} className="btn-ghost px-4 py-2 text-sm">
        <RotateCcw className="h-4 w-4" aria-hidden />
        Empty the hat
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Game runner                                                         */
/* ------------------------------------------------------------------ */

function GameSetup({
  raw,
  setRaw,
  onStart,
}: {
  raw: string;
  setRaw: (v: string) => void;
  onStart: (players: string[], freezeAt: number, finalSwap: boolean) => void;
}) {
  const names = parseNames(raw);
  const [freezeAt, setFreezeAt] = useState(3);
  const [finalSwap, setFinalSwap] = useState(true);
  return (
    <div className="flex flex-col gap-4">
      <label className="flex flex-col gap-2">
        <span className="text-sm font-bold text-foreground">Players in turn order, one per line</span>
        <textarea
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          rows={6}
          spellCheck={false}
          placeholder={"Number 1 first\nthen number 2\n…"}
          className={`${FIELD} resize-y font-mono leading-relaxed`}
        />
      </label>
      <div className="flex flex-col gap-2">
        <span className="text-sm font-bold text-foreground">A gift freezes after</span>
        <div className="flex flex-wrap gap-2">
          {[
            { v: 2, label: "2 steals" },
            { v: 3, label: "3 steals" },
            { v: 0, label: "Never" },
          ].map((o) => (
            <button
              key={o.v}
              type="button"
              onClick={() => setFreezeAt(o.v)}
              className={`rounded-full border-2 px-4 py-2 text-sm font-bold transition-all active:scale-95 ${
                freezeAt === o.v
                  ? "border-accent bg-accent text-white"
                  : "border-border bg-background/60 text-foreground hover:border-accent"
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
      <label className="flex cursor-pointer items-start gap-3 rounded-xl border-2 border-border bg-background/60 p-3">
        <input
          type="checkbox"
          checked={finalSwap}
          onChange={(e) => setFinalSwap(e.target.checked)}
          className="mt-0.5 h-5 w-5 accent-[var(--accent)]"
        />
        <span className="text-sm">
          <span className="font-bold text-foreground">Final swap for Number 1</span>
          <span className="block text-muted">
            Once every gift is open, Number 1 can swap for any gift that isn&apos;t frozen.
          </span>
        </span>
      </label>
      <button
        type="button"
        disabled={names.length < 2}
        onClick={() => onStart(names, freezeAt, finalSwap)}
        className="btn-primary w-full py-3.5 text-base"
      >
        <Play className="h-5 w-5" aria-hidden />
        Start the game
      </button>
      <p className="text-xs text-muted">
        Free, no limits. The game saves on this device, so a refresh won&apos;t lose it.
      </p>
    </div>
  );
}

function GameBoard({
  game,
  onChange,
  onUndo,
  canUndo,
  onQuit,
}: {
  game: WeGame;
  onChange: (g: WeGame) => void;
  onUndo: () => void;
  canUndo: boolean;
  onQuit: () => void;
}) {
  const [label, setLabel] = useState("");
  const [hit, setHit] = useState<number | null>(null);
  const boardRef = useRef<HTMLDivElement>(null);
  const who = game.players[game.active];
  const robbed = game.blocked !== null;
  const blockedGift = game.gifts.find((g) => g.id === game.blocked);

  useEffect(() => {
    if (game.phase === "done") burstFrom(boardRef.current, 70);
  }, [game.phase]);

  function open() {
    const next = openGift(game, label);
    setLabel("");
    setHit(next.gifts[next.gifts.length - 1]?.id ?? null);
    onChange(next);
  }

  function steal(id: number) {
    setHit(id);
    onChange(stealGift(game, id));
  }

  const holding = (i: number) => game.gifts.find((g) => g.holder === i);

  if (game.phase === "done") {
    return (
      <div ref={boardRef} className="flex flex-col gap-4">
        <div className="flex flex-col items-center gap-1 rounded-[1.75rem] border-2 border-amber-300/60 bg-gradient-to-br from-amber-300 to-yellow-400 p-6 text-center text-slate-900 shadow-lg motion-safe:animate-pop-in">
          <span className="text-5xl" aria-hidden>
            🐘
          </span>
          <p className="text-2xl font-extrabold">That&apos;s a wrap!</p>
          <p className="text-sm font-medium">Here&apos;s who went home with what.</p>
        </div>
        <ul className="grid gap-2 sm:grid-cols-2">
          {game.players.map((p, i) => (
            <li
              key={i}
              style={{ animationDelay: `${i * 50}ms` }}
              className="flex items-center justify-between gap-3 rounded-xl border-2 border-border bg-background/60 px-4 py-3 motion-safe:animate-pop-in [animation-fill-mode:both]"
            >
              <span className="font-bold text-foreground">{p}</span>
              <span className="truncate text-sm font-semibold text-accent">🎁 {holding(i)?.label}</span>
            </li>
          ))}
        </ul>
        <div className="flex flex-wrap justify-center gap-2">
          {canUndo ? (
            <button type="button" onClick={onUndo} className="btn-ghost px-4 py-2 text-sm">
              <Undo2 className="h-4 w-4" aria-hidden />
              Undo
            </button>
          ) : null}
          <button type="button" onClick={onQuit} className="btn-primary px-4 py-2 text-sm">
            <RotateCcw className="h-4 w-4" aria-hidden />
            New game
          </button>
        </div>
      </div>
    );
  }

  const finalSwap = game.phase === "finalSwap";

  return (
    <div ref={boardRef} className="flex flex-col gap-4">
      {/* Whose turn */}
      <div
        key={`${game.active}-${game.log.length}`}
        className={`flex flex-col items-center gap-1 rounded-[1.75rem] border-2 p-5 text-center shadow-lg motion-safe:animate-pop-in ${
          robbed
            ? "border-rose-400/60 bg-gradient-to-br from-rose-500 to-pink-500 text-white"
            : "border-amber-300/60 bg-gradient-to-br from-amber-300 to-yellow-400 text-slate-900"
        }`}
      >
        <p className="text-xs font-black uppercase tracking-wider opacity-80">
          {finalSwap
            ? "Final swap"
            : robbed
              ? "Robbed! Goes again"
              : `Turn ${game.turn + 1} of ${game.players.length}`}
        </p>
        <p className="text-4xl font-extrabold tracking-tight sm:text-5xl">{who}</p>
        <p className="text-sm font-semibold">
          {finalSwap
            ? "Swap your gift for any unfrozen one, or keep it."
            : game.gifts.some((g) => canSteal(game, g))
              ? `Open a new gift or steal one${blockedGift ? ` (not ${blockedGift.label})` : ""}.`
              : "Nothing to steal yet. Open a new gift!"}
        </p>
      </div>

      {/* Open a gift */}
      {!finalSwap ? (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            open();
          }}
          className="flex gap-2"
        >
          <input
            value={label}
            onChange={(e) => setLabel(e.target.value.slice(0, 40))}
            placeholder={`What's inside? (Gift ${game.gifts.length + 1})`}
            aria-label="Gift name"
            className={`${FIELD} min-w-0 flex-1`}
          />
          <button type="submit" className="btn-primary shrink-0 px-4 py-2.5 text-sm">
            <Gift className="h-4 w-4" aria-hidden />
            Open new
          </button>
        </form>
      ) : (
        <button type="button" onClick={() => onChange(skipFinalSwap(game))} className="btn-primary w-full py-3">
          Keep {holding(0)?.label}
        </button>
      )}

      {/* Gift table */}
      {game.gifts.length ? (
        <div>
          <p className="mb-2 text-sm font-bold text-foreground">
            On the table ({game.gifts.length} of {game.players.length} opened)
          </p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {game.gifts.map((g) => {
              const ok = canSteal(game, g);
              return (
                <li
                  key={`${g.id}-${g.holder}`}
                  className={`flex items-center gap-3 rounded-xl border-2 px-3 py-2.5 transition-colors ${
                    g.frozen
                      ? "border-sky-300/60 bg-sky-400/10"
                      : "border-border bg-background/60"
                  } ${hit === g.id ? "motion-safe:animate-pop-in" : ""}`}
                >
                  <span className="text-2xl" aria-hidden>
                    {g.frozen ? "🧊" : "🎁"}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-bold text-foreground">{g.label}</span>
                    <span className="flex items-center gap-1.5 text-xs text-muted">
                      with {game.players[g.holder]}
                      {game.rules.freezeAt > 0 ? (
                        <span className="inline-flex gap-0.5" aria-label={`${g.steals} of ${game.rules.freezeAt} steals`}>
                          {Array.from({ length: game.rules.freezeAt }, (_, k) => (
                            <span
                              key={k}
                              className={`h-1.5 w-1.5 rounded-full ${k < g.steals ? "bg-rose-500" : "bg-border"}`}
                            />
                          ))}
                        </span>
                      ) : g.steals ? (
                        <span>· stolen {g.steals}×</span>
                      ) : null}
                      {g.frozen ? (
                        <span className="inline-flex items-center gap-0.5 font-bold text-sky-500">
                          <Snowflake className="h-3 w-3" aria-hidden />
                          frozen
                        </span>
                      ) : null}
                    </span>
                  </span>
                  {ok ? (
                    <button
                      type="button"
                      onClick={() => steal(g.id)}
                      className="shrink-0 rounded-full border-2 border-rose-500 px-3 py-1.5 text-xs font-black text-rose-500 transition-all hover:bg-rose-500 hover:text-white active:scale-95"
                    >
                      {finalSwap ? "Swap" : "Steal"}
                    </button>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </div>
      ) : null}

      {/* Log */}
      <details className="rounded-xl border border-border bg-background/40 px-4 py-2 text-sm">
        <summary className="cursor-pointer font-semibold text-foreground">What&apos;s happened so far</summary>
        <ul className="mt-2 max-h-48 space-y-1 overflow-auto text-muted">
          {game.log.map((line, i) => (
            <li key={game.log.length - i}>{line}</li>
          ))}
        </ul>
      </details>

      <div className="flex flex-wrap justify-center gap-2">
        <button type="button" onClick={onUndo} disabled={!canUndo} className="btn-ghost px-4 py-2 text-sm disabled:opacity-40">
          <Undo2 className="h-4 w-4" aria-hidden />
          Undo
        </button>
        <button
          type="button"
          onClick={() => window.confirm("End this game and start over?") && onQuit()}
          className="btn-ghost px-4 py-2 text-sm"
        >
          <RotateCcw className="h-4 w-4" aria-hidden />
          Start over
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shell                                                               */
/* ------------------------------------------------------------------ */

/** White Elephant toolkit: shuffle the turn order, draw numbers from a hat,
 * or run the whole game (opens, steals, freezes, final swap) on one screen. */
export function WhiteElephant() {
  const [tab, setTab] = useState<Tab>("shuffle");
  const [raw, setRaw] = useState("");
  const [gameRaw, setGameRaw] = useState("");
  const [game, setGame] = useState<WeGame | null>(null);
  const [history, setHistory] = useState<WeGame[]>([]);
  const toolRef = useRef<HTMLDivElement>(null);

  // Resume a game in progress after a refresh.
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(GAME_KEY) ?? "null");
      if (isWeGame(saved)) {
        setGame(saved);
        setTab("game");
      }
    } catch {
      // Nothing saved.
    }
  }, []);

  useEffect(() => {
    try {
      if (game) localStorage.setItem(GAME_KEY, JSON.stringify(game));
      else localStorage.removeItem(GAME_KEY);
    } catch {
      // Private mode; the game still runs, it just won't survive a refresh.
    }
  }, [game]);

  function update(next: WeGame) {
    if (game && next !== game) setHistory((h) => [...h.slice(-49), game]);
    setGame(next);
  }

  function start(players: string[], freezeAt: number, finalSwap: boolean) {
    setHistory([]);
    setGame(newGame(players, { freezeAt, finalSwap }));
    track("white_elephant_game_start", { people: players.length, freezeAt });
  }

  const TABS: { id: Tab; label: string; emoji: string }[] = [
    { id: "shuffle", label: "Shuffle names", emoji: "🔀" },
    { id: "hat", label: "Draw from a hat", emoji: "🎩" },
    { id: "game", label: "Run the game", emoji: "🐘" },
  ];

  return (
    <div ref={toolRef} className="glass-card flex flex-col gap-5 p-5 sm:p-6">
      <div className="grid grid-cols-3 gap-1 rounded-2xl border border-border bg-background/50 p-1" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            onClick={() => setTab(t.id)}
            className={`flex flex-col items-center gap-0.5 rounded-xl px-2 py-2 text-xs font-bold transition-all sm:flex-row sm:justify-center sm:gap-1.5 sm:text-sm ${
              tab === t.id ? "bg-accent text-white shadow-md" : "text-muted hover:text-foreground"
            }`}
          >
            <span aria-hidden>{t.emoji}</span>
            {t.label}
          </button>
        ))}
      </div>

      <div key={tab} className="motion-safe:animate-fade-up">
        {tab === "shuffle" ? (
          <ShuffleNames
            raw={raw}
            setRaw={setRaw}
            onStart={(order) => {
              setGameRaw(order.join("\n"));
              setGame(null);
              setTab("game");
              toolRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }}
          />
        ) : tab === "hat" ? (
          <HatDraw />
        ) : game ? (
          <GameBoard
            game={game}
            onChange={update}
            canUndo={history.length > 0}
            onUndo={() => {
              setGame(history[history.length - 1]);
              setHistory((h) => h.slice(0, -1));
            }}
            onQuit={() => {
              setGameRaw(game.players.join("\n"));
              setGame(null);
              setHistory([]);
            }}
          />
        ) : (
          <GameSetup raw={gameRaw || raw} setRaw={setGameRaw} onStart={start} />
        )}
      </div>
    </div>
  );
}
