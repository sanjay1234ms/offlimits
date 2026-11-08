"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { Shuffle } from "lucide-react";
import { DailyFrame, MoreDaily } from "./DailyFrame";
import { FinishPanel } from "./Leaderboard";
import { WorldMap, distanceKm, isInCountry, type MapPoint, type WorldMapHandle } from "./WorldMap";
import { useDailyClock } from "@/hooks/useDailyClock";
import { DAILY_GAMES } from "@/data/daily/puzzles";
import { MAP_CARDS, PACKS, type MapCard, type MapPack } from "@/data/daily/offTheMap";
import {
  dailyPicks,
  formatClock,
  loadProgress,
  loadStats,
  recordResult,
  saveProgress,
  seededRandom,
  seededShuffle,
  type DailyStats,
} from "@/lib/daily";
import { track } from "@/lib/analytics";

const GAME = DAILY_GAMES[1];
const ROUNDS = 5;
const SECONDS = 30;
const PACK_ORDER: MapPack[] = ["landmark", "nature", "country", "city"];

/** 100 within 20 km, then fading with distance: ~68 at 1,000 km, ~35 at
 * 2,600 km, ~14 at 5,000 km, a point or two out to 10,000 km. */
export function pinPoints(km: number): number {
  if (km <= 20) return 100;
  return Math.max(0, Math.round(100 * Math.exp(-(km - 20) / 2500)));
}
/** Outside a country's border tops out at 85. */
const OUTSIDE_COUNTRY_MAX = 85;

const BANDS = [
  { max: 150, sq: "🟩", cls: "bg-lime-400", label: "within 150 km" },
  { max: 600, sq: "🟨", cls: "bg-yellow-300", label: "within 600" },
  { max: 1500, sq: "🟧", cls: "bg-orange-400", label: "within 1,500" },
  { max: 4000, sq: "🟥", cls: "bg-rose-400", label: "within 4,000" },
  { max: Infinity, sq: "⬛", cls: "bg-slate-700", label: "further" },
];
const band = (km: number | null) => (km === null ? BANDS[4] : BANDS.find((b) => km <= b.max)!);

function quip(km: number | null, points: number): string {
  if (km === null) return "No pin, no points. The clock wins this one.";
  if (km === 0) return "Inside the border. Full marks.";
  if (points >= 95) return "Practically standing on it.";
  if (points >= 75) return "Right neighbourhood. Very nice.";
  if (points >= 50) return "Same part of the world. Solid.";
  if (points >= 25) return `A long way out, and still ${points} points.`;
  if (points > 0) return `Wrong side of things, but ${points} ${points === 1 ? "point" : "points"} is better than none.`;
  return "Other side of the planet. It happens to everyone.";
}

interface RoundResult {
  pin: MapPoint | null;
  km: number | null;
  points: number;
}

interface Progress {
  results: RoundResult[];
  done: boolean;
  startedAt: number | null;
  ms: number;
}

const FRESH: Progress = { results: [], done: false, startedAt: null, ms: 0 };

type Round = { kind: "daily"; day: number } | { kind: "bonus"; seed: number };

function formatKm(km: number): string {
  return km < 10 ? `${km.toFixed(1)} km` : `${Math.round(km).toLocaleString()} km`;
}

/** One card from each pack, plus a fifth from any pack, in a shuffled order. */
function pickCards(round: Round): MapCard[] {
  const seed = round.kind === "daily" ? round.day : round.seed;
  const byPack = (p: MapPack) => MAP_CARDS.filter((c) => c.pack === p);
  let cards: MapCard[];
  if (round.kind === "daily") {
    cards = PACK_ORDER.map((p, i) => dailyPicks(byPack(p), round.day, 1, 41 + i)[0]);
    const extraPack = PACK_ORDER[round.day % PACK_ORDER.length];
    const extra = dailyPicks(byPack(extraPack).filter((c) => !cards.includes(c)), round.day, 1, 61)[0];
    cards.push(extra);
  } else {
    const rand = seededRandom(seed);
    cards = PACK_ORDER.map((p) => {
      const list = byPack(p);
      return list[Math.floor(rand() * list.length)];
    });
    const rest = MAP_CARDS.filter((c) => !cards.includes(c));
    cards.push(rest[Math.floor(rand() * rest.length)]);
  }
  return seededShuffle(cards, seed * 7 + 3);
}

/** Circular countdown badge. */
function TimerBadge({ left, total }: { left: number; total: number }) {
  const r = 15;
  const c = 2 * Math.PI * r;
  const low = left <= 5;
  return (
    <span className={`relative grid h-10 w-10 place-items-center ${low ? "motion-safe:animate-pulse" : ""}`} aria-label={`${left} seconds left`}>
      <svg viewBox="0 0 36 36" className="absolute inset-0 -rotate-90">
        <circle cx={18} cy={18} r={r} fill={low ? "#fda4af" : "#fde047"} stroke="#0f172a" strokeWidth={2.5} />
        <circle
          cx={18}
          cy={18}
          r={r - 4}
          fill="none"
          stroke="#0f172a"
          strokeOpacity={0.25}
          strokeWidth={3}
          strokeDasharray={2 * Math.PI * (r - 4)}
          strokeDashoffset={2 * Math.PI * (r - 4) * (1 - left / total)}
          style={{ transition: "stroke-dashoffset 250ms linear" }}
        />
        <circle cx={18} cy={18} r={r} fill="none" stroke="#0f172a" strokeWidth={0} strokeDasharray={c} />
      </svg>
      <span className="relative text-sm font-black">{left}</span>
    </span>
  );
}

export function OffTheMap() {
  const { day: today, msLeft } = useDailyClock(1000);
  const [round, setRound] = useState<Round | null>(null);
  const [p, setP] = useState<Progress>(FRESH);
  const [pin, setPin] = useState<MapPoint | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [landed, setLanded] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(SECONDS);
  const [stats, setStats] = useState<DailyStats | null>(null);
  const lockRef = useRef<() => void>(() => {});
  const mapRef = useRef<WorldMapHandle>(null);
  const locking = useRef(false);

  useEffect(() => {
    if (today !== null && round === null) setRound({ kind: "daily", day: today });
  }, [today, round]);

  const cards = useMemo(() => (round ? pickCards(round) : []), [round]);
  const practice = round?.kind !== "daily" || round.day !== today;

  useEffect(() => {
    if (!round) return;
    const saved = round.kind === "daily" ? loadProgress<Progress>("off-the-map", round.day) : null;
    setP(saved ?? FRESH);
    setPin(null);
    setRevealed(false);
    setLanded(false);
    setSecondsLeft(SECONDS);
    setStats(loadStats("off-the-map"));
    mapRef.current?.reset();
  }, [round]);

  const idx = revealed ? p.results.length - 1 : p.results.length;
  const card = cards[idx] as MapCard | undefined;
  const result = revealed ? p.results[idx] : undefined;
  const pack = card ? PACKS[card.pack] : null;
  const namesOff = card?.pack === "country" || card?.pack === "city";

  const persist = useCallback(
    (next: Progress) => {
      setP(next);
      if (round?.kind === "daily") saveProgress("off-the-map", round.day, next);
    },
    [round],
  );

  const lockIn = useCallback(async () => {
    if (!card || revealed || p.done || locking.current) return;
    locking.current = true;
    let km: number | null = pin ? distanceKm(pin, card) : null;
    let points = km === null ? 0 : pinPoints(km);
    if (pin && card.country) {
      if (await isInCountry(card.country, pin)) {
        km = 0;
        points = 100;
      } else {
        points = Math.min(OUTSIDE_COUNTRY_MAX, points);
      }
    }
    const results = [...p.results, { pin, km, points }];
    persist({ ...p, results });
    setLanded(false);
    setRevealed(true);
    locking.current = false;
    track("map_pin", { puzzle: "off-the-map", round: results.length, points, pack: card.pack });
  }, [card, revealed, p, pin, persist]);

  lockRef.current = lockIn;

  // Round timer. Running out locks the pin where it sits.
  useEffect(() => {
    if (revealed || p.done || !card) return;
    setSecondsLeft(SECONDS);
    const started = Date.now();
    const id = window.setInterval(() => {
      const left = SECONDS - Math.floor((Date.now() - started) / 1000);
      setSecondsLeft(Math.max(0, left));
      if (left <= 0) {
        window.clearInterval(id);
        lockRef.current();
      }
    }, 250);
    return () => window.clearInterval(id);
  }, [idx, revealed, p.done, card]);

  function next() {
    setRevealed(false);
    setLanded(false);
    setPin(null);
    if (p.results.length >= ROUNDS) {
      const total = p.results.reduce((a, r) => a + r.points, 0);
      const ms = p.startedAt ? Date.now() - p.startedAt : 0;
      persist({ ...p, done: true, ms });
      if (round?.kind === "daily" && !practice) setStats(recordResult("off-the-map", round.day, total > 0));
      track("daily_finish", { puzzle: "off-the-map", score: total, practice });
    } else {
      mapRef.current?.reset();
    }
  }

  function dropPin(pt: MapPoint) {
    if (revealed || p.done) return;
    if (!p.startedAt) persist({ ...p, startedAt: Date.now() });
    setPin(pt);
  }

  const total = p.results.reduce((a, r) => a + r.points, 0);
  const number = round?.kind === "daily" ? round.day + 1 : null;
  const dateLabel = new Date().toLocaleDateString(undefined, { day: "numeric", month: "short" });
  const shareLines = [
    `OffLimits Off the Map ${number ? `No. ${number}` : "bonus"} · ${total}/500`,
    p.results.map((r) => band(r.km).sq).join(""),
    "playofflimits.com/daily/off-the-map",
  ].join("\n");

  return (
    <DailyFrame
      game={GAME}
      today={today}
      day={round?.kind === "daily" ? round.day : null}
      onPickDay={(d) => setRound({ kind: "daily", day: d })}
      rules={<OffTheMapRules />}
    >
      {round?.kind === "bonus" ? (
        <p className="mb-2 text-center">
          <span className="rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-800">Bonus trip · just for fun</span>
        </p>
      ) : null}

      {!p.done && card && pack ? (
        <>
          <div className="mb-2.5 flex items-center gap-2.5">
            {!revealed ? <TimerBadge left={secondsLeft} total={SECONDS} /> : null}
            <span className="text-sm font-black">
              {number ? `No. ${number}` : "Bonus"} · {dateLabel}
            </span>
            <span className="ml-auto rounded-full border-2 border-slate-900 px-2.5 py-0.5 text-xs font-black">
              {idx + 1} of {ROUNDS}
            </span>
          </div>

          {!revealed ? (
            <div key={`q${idx}`} className="mb-3 flex items-center gap-3 rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3 shadow-[4px_4px_0_#0f172a] motion-safe:animate-pop-in">
              <div className="min-w-0 flex-1">
                <p className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-slate-500">
                  <span className={`h-2.5 w-2.5 rounded-full border-2 border-slate-900 ${pack.tint}`} />
                  {pack.label}
                </p>
                <p className="mt-0.5 text-lg font-black leading-tight sm:text-xl">Where is {card.name}?</p>
                <p className="text-xs font-semibold text-slate-500">{namesOff ? "Names are off for this card" : "Tap the map where you think it is"}</p>
              </div>
              <span className={`grid h-12 w-12 shrink-0 -rotate-6 place-items-center rounded-xl border-2 border-dashed border-slate-900 text-2xl ${pack.tint}`} aria-hidden>
                {pack.emoji}
              </span>
            </div>
          ) : result ? (
            <div key={`r${idx}`} className="mb-3 rounded-2xl border-[3px] border-slate-900 bg-white px-4 py-3 text-center shadow-[4px_4px_0_#0f172a] motion-safe:animate-pop-in">
              <p className="text-[11px] font-black uppercase tracking-[0.18em] text-slate-500">{pack.ask}</p>
              <p className="mt-0.5 text-3xl font-black tracking-tight sm:text-4xl">
                {result.km === null ? "No pin" : result.km === 0 ? "Bullseye" : formatKm(result.km)}
              </p>
              <span className={`mt-1 inline-block rounded-full border-2 border-slate-900 px-2.5 py-0.5 text-xs font-black ${band(result.km).cls} ${band(result.km).max === Infinity ? "text-white" : ""}`}>
                +{result.points}
              </span>
              <p className="mt-1.5 text-sm font-semibold text-slate-600">{quip(result.km, result.points)}</p>
            </div>
          ) : null}

          <WorldMap
            ref={mapRef}
            pin={revealed ? (result?.pin ?? null) : pin}
            onPin={dropPin}
            locked={revealed}
            namesOff={namesOff && !revealed}
            compact={revealed}
            answer={revealed ? { lat: card.lat, lng: card.lng, label: card.name, country: card.country } : null}
            onRevealed={() => setLanded(true)}
          />

          {revealed ? (
            <>
              <div className={`mt-3 rounded-2xl border-2 border-dashed border-slate-900 bg-white px-4 py-3 transition-opacity duration-500 ${landed ? "opacity-100" : "opacity-0"}`}>
                <p className="font-black">
                  {card.name}
                  {card.pack !== "country" ? <span className="font-semibold text-slate-500"> · {card.where}</span> : null}
                </p>
                <p className="text-sm text-slate-600">{card.fact}</p>
              </div>
              <button
                type="button"
                onClick={next}
                className="mt-3 w-full rounded-full border-[3px] border-slate-900 bg-lime-300 px-6 py-3.5 text-lg font-black shadow-[4px_4px_0_#0f172a] transition-transform hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#0f172a]"
              >
                {p.results.length >= ROUNDS ? "See today's score" : "Next card"}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={lockIn}
              disabled={!pin}
              className={`mt-3 w-full rounded-full border-[3px] border-slate-900 px-6 py-3.5 text-lg font-black transition-[transform,background-color,box-shadow] ${
                pin
                  ? "bg-lime-300 shadow-[4px_4px_0_#0f172a] hover:-translate-y-0.5 active:translate-y-0.5 active:shadow-[1px_1px_0_#0f172a]"
                  : "cursor-default bg-white text-base shadow-[3px_3px_0_#0f172a]"
              }`}
            >
              {pin ? "Lock my pin" : "Tap the map to drop your pin"}
            </button>
          )}
        </>
      ) : null}

      {p.done ? (
        <>
          <div className="rounded-2xl border-[3px] border-slate-900 bg-white p-5 text-center shadow-[5px_5px_0_#0f172a] motion-safe:animate-pop-in">
            <p className="text-xs font-black uppercase tracking-[0.18em]">
              {number ? `No. ${number}` : "Bonus trip"} · {dateLabel}
            </p>
            <p className="text-xs font-semibold text-slate-500">Today you scored</p>
            <p className="text-6xl font-black leading-none tracking-tight">{total}</p>
            <p className="text-xs font-semibold text-slate-500">of 500</p>
            <ul className="mt-4 space-y-1.5 text-left text-sm">
              {cards.map((c, i) => {
                const r = p.results[i];
                return (
                  <li key={c.name} className="flex items-center gap-2.5">
                    <span className={`h-4 w-4 shrink-0 rounded border-2 border-slate-900 ${band(r?.km ?? null).cls}`} />
                    <span className="flex-1 truncate font-semibold">{c.name}</span>
                    <span className="text-xs text-slate-500">{r?.km == null ? "no pin" : formatKm(r.km)}</span>
                    <span className="w-7 text-right font-black">{r?.points ?? 0}</span>
                  </li>
                );
              })}
            </ul>
            <div className="mt-3 flex flex-wrap justify-center gap-x-3 gap-y-1 text-[11px] font-semibold text-slate-600">
              {BANDS.map((b) => (
                <span key={b.label} className="inline-flex items-center gap-1">
                  <span className={`h-3 w-3 rounded-sm border-2 border-slate-900 ${b.cls}`} />
                  {b.label}
                </span>
              ))}
            </div>
          </div>
          <FinishPanel
            key={JSON.stringify(round)}
            puzzle="off-the-map"
            day={round?.kind === "daily" ? round.day : -1}
            practice={practice}
            headline={total >= 400 ? "Human GPS 🧭" : total >= 250 ? "Well travelled ✈️" : total >= 120 ? "Scenic route 🗺️" : "Took the long way 🐢"}
            label={`${total}`}
            rank={-total}
            ms={p.ms}
            shareLines={shareLines}
            stats={stats}
          >
            <p className="mt-1 text-xs text-slate-600">
              New places at midnight, your time. Or play with friends in a{" "}
              <Link href="/party" className="font-bold underline">
                party room
              </Link>
              .
            </p>
          </FinishPanel>
          <button
            type="button"
            onClick={() => setRound({ kind: "bonus", seed: Math.floor(Math.random() * 1e6) })}
            className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-900 bg-white px-5 py-2.5 text-sm font-black shadow-[3px_3px_0_#0f172a] hover:-translate-y-0.5"
          >
            <Shuffle className="h-4 w-4" aria-hidden />
            Take a bonus trip (5 random cards)
          </button>
          <MoreDaily current="off-the-map" games={DAILY_GAMES} clock={formatClock(msLeft)} />
        </>
      ) : null}
    </DailyFrame>
  );
}

export function OffTheMapRules() {
  return (
    <>
      <p>
        Five cards a day, the same five for everyone: a landmark, a wild place, a country, a city and one bonus. Find
        each one on the world map.
      </p>
      <ol className="list-decimal space-y-1.5 pl-5">
        <li>Read the card. It tells you what you&apos;re looking for.</li>
        <li>Drag to move the map, and pinch, scroll or use + and − to zoom. Country and city names appear as you zoom in.</li>
        <li>Tap to drop your pin. Drag the pin, or tap somewhere else, to move it.</li>
        <li>Press Lock my pin before the 30-second timer runs out. If time runs out, the pin locks where it is. No pin scores 0.</li>
        <li>The map flies to the real spot and shows how far off you were.</li>
      </ol>
      <p>
        <strong>Names off:</strong> on country and city cards, the map hides every name until the reveal. Borders stay on.
      </p>
      <p>
        <strong>Scoring:</strong> within 20 km is a perfect 100. After that it fades with distance: about 68 at 1,000 km,
        35 at 2,600 km and 14 at 5,000 km. On country cards, a pin anywhere inside the border scores 100; outside it,
        the most you can get is 85. Distances go around the globe, so a pin across the edge of the map can still be
        close. Best possible day: 500.
      </p>
      <p>
        <strong>Leaderboard:</strong> highest total wins, ties go to the faster time, counted from your first pin.
      </p>
    </>
  );
}
