"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Check, Minus, Plus, Shuffle as ShuffleIcon } from "lucide-react";
import { shuffle } from "@/lib/shuffle";
import {
  COUNTRIES,
  SCAVENGER_PACKS,
  WORD_CATEGORIES,
  type CountryEntry,
} from "@/data/pickerData";
import { PICKER_META, PICKER_SLUGS, type PickerMeta } from "@/data/pickers";

function parseList(raw: string): string[] {
  return raw
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function Editor({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label: string;
}) {
  const count = parseList(value).length;
  return (
    <div className="card flex flex-col gap-2">
      <div className="flex items-center justify-between text-sm font-bold text-foreground">
        {label}
        <span className="text-xs font-normal text-muted">{count} entries</span>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={8}
        spellCheck={false}
        className="w-full resize-y rounded-xl border-2 border-white/10 bg-white/5 px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />
      <p className="text-xs text-subtle">One per line.</p>
    </div>
  );
}

function Stepper({
  value,
  onChange,
  min,
  max,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm font-bold text-foreground">{label}</span>
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="btn-ghost !px-3"
        aria-label="Decrease"
      >
        <Minus className="h-4 w-4" aria-hidden />
      </button>
      <span className="w-8 text-center text-2xl font-extrabold text-foreground">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        className="btn-ghost !px-3"
        aria-label="Increase"
      >
        <Plus className="h-4 w-4" aria-hidden />
      </button>
    </div>
  );
}

function ResultCard({
  meta,
  children,
}: {
  meta: PickerMeta;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`animate-pop-in flex min-h-[12rem] w-full flex-col items-center justify-center gap-2 rounded-3xl border-2 bg-gradient-to-br p-6 text-center ${meta.border} ${meta.grad}`}
      style={{ backgroundColor: "var(--card-bg)" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */

function NamePicker({ meta }: { meta: PickerMeta }) {
  const [raw, setRaw] = useState("Alex\nJordan\nSam\nTaylor\nMorgan\nCasey");
  const [remaining, setRemaining] = useState<string[] | null>(null);
  const [drawn, setDrawn] = useState<string | null>(null);
  const pool = useMemo(() => parseList(raw), [raw]);

  useEffect(() => {
    setRemaining(null);
    setDrawn(null);
  }, [raw]);

  function draw() {
    const list =
      remaining && remaining.length > 0 ? remaining : shuffle(pool);
    if (list.length === 0) return;
    setDrawn(list[0]);
    setRemaining(list.slice(1));
  }

  const left = remaining ? remaining.length : pool.length;

  return (
    <div className="flex flex-col gap-4">
      <ResultCard meta={meta}>
        <p className="text-3xl font-extrabold text-foreground sm:text-4xl">
          {drawn ?? ", "}
        </p>
        <p className="text-xs text-muted">{left} left before it resets</p>
      </ResultCard>
      <button
        type="button"
        onClick={draw}
        disabled={pool.length === 0}
        className="btn-primary py-4 text-base"
      >
        <ShuffleIcon className="h-5 w-5" aria-hidden />
        Draw a name
      </button>
      {remaining && remaining.length === 0 ? (
        <button
          type="button"
          onClick={() => {
            setRemaining(null);
            setDrawn(null);
          }}
          className="btn-ghost"
        >
          Reset the list
        </button>
      ) : null}
      <Editor value={raw} onChange={setRaw} label="Names" />
    </div>
  );
}

function TeamGenerator({ meta }: { meta: PickerMeta }) {
  const [raw, setRaw] = useState(
    "Alex\nJordan\nSam\nTaylor\nMorgan\nCasey\nJamie\nRiley",
  );
  const [teamCount, setTeamCount] = useState(2);
  const [teams, setTeams] = useState<string[][] | null>(null);
  const pool = useMemo(() => parseList(raw), [raw]);

  function generate() {
    const s = shuffle(pool);
    const out: string[][] = Array.from({ length: teamCount }, () => []);
    s.forEach((name, i) => out[i % teamCount].push(name));
    setTeams(out);
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper
        value={teamCount}
        onChange={(v) => setTeamCount(v)}
        min={2}
        max={8}
        label="Teams"
      />
      <button
        type="button"
        onClick={generate}
        disabled={pool.length < teamCount}
        className="btn-primary py-4 text-base"
      >
        <ShuffleIcon className="h-5 w-5" aria-hidden />
        Generate teams
      </button>
      {teams ? (
        <div className="grid gap-3 sm:grid-cols-2">
          {teams.map((team, i) => (
            <div
              key={i}
              className={`rounded-3xl border-2 bg-gradient-to-br p-4 ${meta.border} ${meta.grad}`}
              style={{ backgroundColor: "var(--card-bg)" }}
            >
              <p className={`text-sm font-extrabold ${meta.accent}`}>
                Team {i + 1}
              </p>
              <ul className="mt-2 flex flex-col gap-1 text-sm font-semibold text-foreground">
                {team.map((name) => (
                  <li key={name}>{name}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}
      <Editor value={raw} onChange={setRaw} label="People" />
    </div>
  );
}

function ScavengerHunt({ meta }: { meta: PickerMeta }) {
  const [packId, setPackId] = useState<string | null>(null);
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const pack = SCAVENGER_PACKS.find((p) => p.id === packId);

  if (!pack) {
    return (
      <div className="flex flex-col gap-3">
        <p className="text-sm font-bold text-foreground">Pick a pack</p>
        {SCAVENGER_PACKS.map((p) => (
          <button
            key={p.id}
            type="button"
            onClick={() => {
              setPackId(p.id);
              setChecked(new Set());
            }}
            className={`rounded-3xl border-2 bg-gradient-to-br p-4 text-left transition-transform hover:-translate-y-1 ${meta.border} ${meta.grad}`}
            style={{ backgroundColor: "var(--card-bg)" }}
          >
            <p className={`text-base font-extrabold ${meta.accent}`}>{p.name}</p>
            <p className="text-xs text-muted">{p.items.length} things to find</p>
          </button>
        ))}
      </div>
    );
  }

  const done = pack.items.filter((i) => checked.has(i)).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className={`text-base font-extrabold ${meta.accent}`}>{pack.name}</p>
        <button
          type="button"
          onClick={() => setPackId(null)}
          className="text-xs font-bold text-muted hover:text-foreground"
        >
          Different pack
        </button>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-lime-400 transition-[width] duration-300"
          style={{ width: `${(done / pack.items.length) * 100}%` }}
        />
      </div>
      <ul className="flex flex-col gap-2">
        {pack.items.map((item) => {
          const on = checked.has(item);
          return (
            <li key={item}>
              <button
                type="button"
                onClick={() =>
                  setChecked((prev) => {
                    const n = new Set(prev);
                    if (n.has(item)) n.delete(item);
                    else n.add(item);
                    return n;
                  })
                }
                className="flex w-full items-center gap-3 rounded-2xl border-2 border-white/10 bg-white/5 p-3 text-left"
              >
                <span
                  className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 ${
                    on
                      ? "border-lime-400 bg-lime-400 text-lime-950"
                      : "border-white/25"
                  }`}
                >
                  {on ? <Check className="h-3 w-3" aria-hidden /> : null}
                </span>
                <span
                  className={`text-sm font-semibold ${
                    on ? "text-muted line-through" : "text-foreground"
                  }`}
                >
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Raffle({ meta }: { meta: PickerMeta }) {
  const [raw, setRaw] = useState(
    "Ada\nBen\nChloe\nDev\nElla\nFinn\nGrace\nHugo\nIris\nJack",
  );
  const [winnerCount, setWinnerCount] = useState(1);
  const [winners, setWinners] = useState<string[] | null>(null);
  const pool = useMemo(() => parseList(raw), [raw]);

  function draw() {
    setWinners(shuffle(pool).slice(0, Math.min(winnerCount, pool.length)));
  }

  return (
    <div className="flex flex-col gap-4">
      <Stepper
        value={winnerCount}
        onChange={setWinnerCount}
        min={1}
        max={10}
        label="Winners"
      />
      <button
        type="button"
        onClick={draw}
        disabled={pool.length === 0}
        className="btn-primary py-4 text-base"
      >
        🎟️ Draw winners
      </button>
      {winners ? (
        <ResultCard meta={meta}>
          <ul className="flex flex-col gap-1.5">
            {winners.map((w, i) => (
              <li
                key={w}
                className="text-xl font-extrabold text-foreground sm:text-2xl"
              >
                {i + 1}. {w}
              </li>
            ))}
          </ul>
        </ResultCard>
      ) : null}
      <Editor value={raw} onChange={setRaw} label="Tickets" />
    </div>
  );
}

function WordGenerator({ meta }: { meta: PickerMeta }) {
  const [catId, setCatId] = useState(WORD_CATEGORIES[0].id);
  const [word, setWord] = useState<string | null>(null);
  const cat = WORD_CATEGORIES.find((c) => c.id === catId) ?? WORD_CATEGORIES[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap gap-2">
        {WORD_CATEGORIES.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setCatId(c.id);
              setWord(null);
            }}
            aria-pressed={c.id === catId}
            className="filter-chip"
          >
            {c.name}
          </button>
        ))}
      </div>
      <ResultCard meta={meta}>
        <p className="text-3xl font-extrabold capitalize text-foreground sm:text-4xl">
          {word ?? ", "}
        </p>
      </ResultCard>
      <button
        type="button"
        onClick={() =>
          setWord(cat.words[Math.floor(Math.random() * cat.words.length)])
        }
        className="btn-primary py-4 text-base"
      >
        <ShuffleIcon className="h-5 w-5" aria-hidden />
        Generate a word
      </button>
    </div>
  );
}

function RandomCountry({ meta }: { meta: PickerMeta }) {
  const [country, setCountry] = useState<CountryEntry | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <ResultCard meta={meta}>
        {country ? (
          <>
            <span className="text-6xl" aria-hidden>
              {country.flag}
            </span>
            <p className="text-2xl font-extrabold text-foreground sm:text-3xl">
              {country.name}
            </p>
            <p className="text-sm text-muted">
              Capital: {country.capital} · {country.region}
            </p>
          </>
        ) : (
          <p className="text-3xl font-extrabold text-foreground">, </p>
        )}
      </ResultCard>
      <button
        type="button"
        onClick={() =>
          setCountry(COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)])
        }
        className="btn-primary py-4 text-base"
      >
        <ShuffleIcon className="h-5 w-5" aria-hidden />
        Draw a country
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */

export function PickerRunner({ tool }: { tool: string }) {
  const meta = PICKER_META[tool];
  if (!meta) {
    return <p className="text-sm text-muted">That picker doesn&apos;t exist.</p>;
  }

  let body: React.ReactNode;
  switch (tool) {
    case "teams":
      body = <TeamGenerator meta={meta} />;
      break;
    case "scavenger":
      body = <ScavengerHunt meta={meta} />;
      break;
    case "raffle":
      body = <Raffle meta={meta} />;
      break;
    case "word":
      body = <WordGenerator meta={meta} />;
      break;
    case "country":
      body = <RandomCountry meta={meta} />;
      break;
    case "name":
    default:
      body = <NamePicker meta={meta} />;
  }

  return (
    <div className="flex flex-col gap-6">
      {body}
      <div className="flex flex-wrap gap-2 border-t border-white/10 pt-5">
        <span className="text-xs font-bold uppercase tracking-wide text-subtle">
          More pickers
        </span>
        <Link href="/wheel" className="text-xs font-bold text-accent">
          Spin the Wheel
        </Link>
        {PICKER_SLUGS.filter((s) => s !== tool).map((s) => (
          <Link
            key={s}
            href={`/pickers/${s}`}
            className="text-xs font-bold text-muted hover:text-foreground"
          >
            {PICKER_META[s].title}
          </Link>
        ))}
      </div>
    </div>
  );
}
