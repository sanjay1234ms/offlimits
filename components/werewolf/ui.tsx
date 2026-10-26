"use client";

import { useEffect, useState } from "react";
import { Settings2, Volume2, VolumeX } from "lucide-react";
import { ROLES, type Role, type Skin } from "@/lib/werewolf";
import { chooseVoice, listVoices, narratorVoiceName, onSpeaking, restoreVoice, say, setNarrationMuted } from "@/lib/narrate";

export type SceneMood = "night" | "day" | "blood" | "dawn";

const SKY: Record<SceneMood, string> = {
  night: "linear-gradient(180deg, #050816 0%, #0b1238 45%, #1b1446 100%)",
  dawn: "linear-gradient(180deg, #1b1446 0%, #6b2c5c 55%, #f59e0b 100%)",
  day: "linear-gradient(180deg, #38bdf8 0%, #7dd3fc 45%, #fde68a 100%)",
  blood: "linear-gradient(180deg, #0a0204 0%, #3b0710 55%, #7f1d1d 100%)",
};

const STARS = Array.from({ length: 28 }, (_, i) => ({
  left: (i * 37) % 100,
  top: (i * 53) % 55,
  size: i % 5 === 0 ? 3 : 2,
  delay: (i % 7) * 0.45,
}));

/** The game's backdrop: a starry night with a moon over pines (Werewolf) or
 * a city skyline (Mafia), a sunny day, or a blood moon when the wolves win. */
export function Scene({
  mood,
  skin,
  children,
  className = "",
}: {
  mood: SceneMood;
  skin: Skin;
  children: React.ReactNode;
  className?: string;
}) {
  const dark = mood !== "day";
  return (
    <div
      className={`relative isolate overflow-hidden rounded-[2rem] border border-white/10 px-4 pb-28 pt-6 sm:px-8 sm:pb-36 sm:pt-8 ${className}`}
      style={{ background: SKY[mood], transition: "background 1.2s ease" }}
    >
      {/* Stars */}
      <div aria-hidden className={`pointer-events-none absolute inset-0 -z-10 transition-opacity duration-1000 ${dark ? "opacity-100" : "opacity-0"}`}>
        {STARS.map((s, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white motion-safe:animate-glow-pulse"
            style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `${s.delay}s` }}
          />
        ))}
      </div>

      {/* Moon / sun */}
      <div
        aria-hidden
        className="pointer-events-none absolute -z-10 transition-all duration-1000"
        style={{ right: mood === "day" ? "12%" : "8%", top: "4.25rem" }}
      >
        <div
          className="h-20 w-20 rounded-full sm:h-28 sm:w-28 motion-safe:animate-float-slow"
          style={{
            background:
              mood === "day"
                ? "radial-gradient(circle at 40% 40%, #fff7cc, #fbbf24 60%, #f59e0b)"
                : mood === "blood"
                  ? "radial-gradient(circle at 35% 35%, #fecaca, #dc2626 55%, #7f1d1d)"
                  : "radial-gradient(circle at 35% 35%, #ffffff, #e2e8f0 50%, #94a3b8)",
            boxShadow:
              mood === "day"
                ? "0 0 80px 20px rgba(251,191,36,0.55)"
                : mood === "blood"
                  ? "0 0 90px 24px rgba(220,38,38,0.55)"
                  : "0 0 80px 18px rgba(226,232,240,0.35)",
          }}
        />
      </div>

      {/* Drifting fog */}
      <div
        aria-hidden
        className={`pointer-events-none absolute inset-x-[-20%] bottom-10 -z-10 h-32 blur-2xl transition-opacity duration-1000 motion-safe:animate-[marquee_60s_linear_infinite] ${dark ? "opacity-60" : "opacity-0"}`}
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(148,163,184,0.35), transparent 60%), radial-gradient(ellipse at 75% 60%, rgba(148,163,184,0.25), transparent 60%)" }}
      />

      {/* Horizon silhouette */}
      <svg aria-hidden viewBox="0 0 400 80" preserveAspectRatio="none" className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-24 w-full sm:h-32">
        {skin === "werewolf" ? (
          <path
            fill={mood === "day" ? "#166534" : "#020617"}
            d="M0 80 L0 52 L14 30 L22 46 L32 18 L44 48 L56 34 L66 50 L80 14 L94 50 L108 38 L118 52 L134 22 L148 52 L160 44 L172 56 L190 26 L204 54 L220 40 L232 54 L248 20 L262 52 L276 42 L290 56 L306 24 L320 54 L334 40 L346 52 L362 16 L376 50 L388 40 L400 50 L400 80 Z"
          />
        ) : (
          <path
            fill={mood === "day" ? "#334155" : "#020617"}
            d="M0 80 L0 50 L20 50 L20 30 L42 30 L42 44 L58 44 L58 18 L76 18 L76 40 L96 40 L96 26 L118 26 L118 48 L136 48 L136 10 L150 10 L150 46 L170 46 L170 34 L192 34 L192 52 L210 52 L210 22 L232 22 L232 42 L252 42 L252 30 L270 30 L270 50 L290 50 L290 16 L306 16 L306 44 L326 44 L326 28 L348 28 L348 48 L366 48 L366 36 L386 36 L386 52 L400 52 L400 80 Z"
          />
        )}
      </svg>

      <div className={dark ? "text-white" : "text-slate-900"}>{children}</div>
    </div>
  );
}

/** A role card that flips over in 3D. */
export function RoleCard({
  role,
  skin,
  revealed,
  onToggle,
  hint = "Tap to see your role",
}: {
  role: Role;
  skin: Skin;
  revealed: boolean;
  onToggle?: () => void;
  hint?: string;
}) {
  const meta = ROLES[skin][role];
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={revealed ? `Your role: ${meta.name}. Tap to hide` : hint}
      className="mx-auto block w-full max-w-[17rem] [perspective:1200px]"
    >
      <div
        className="preserve-3d relative aspect-[3/4] w-full transition-transform duration-700"
        style={{ transform: revealed ? "rotateY(180deg)" : "rotateY(0deg)", transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
      >
        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-[1.75rem] border-2 border-white/20 bg-gradient-to-br from-slate-800 via-indigo-950 to-black p-5 text-center shadow-2xl [backface-visibility:hidden]">
          <span className="text-6xl motion-safe:animate-float-slow">{skin === "werewolf" ? "🌕" : "🃏"}</span>
          <span className="text-sm font-black uppercase tracking-[0.2em] text-white/80">{hint}</span>
          <span className="text-xs font-semibold text-white/50">Keep it hidden from everyone else</span>
        </div>
        {/* Front */}
        <div
          className={`absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[1.75rem] border-2 border-white/25 bg-gradient-to-br p-5 text-center text-white shadow-2xl [backface-visibility:hidden] ${meta.card}`}
          style={{ transform: "rotateY(180deg)" }}
        >
          <span className="text-[5rem] leading-none drop-shadow-lg">{meta.emoji}</span>
          <span className="text-3xl font-black tracking-tight">{meta.name}</span>
          <span
            className={`rounded-full px-3 py-0.5 text-[11px] font-black uppercase tracking-wider ${
              meta.team === "wolves" ? "bg-red-500/30 text-red-100" : "bg-emerald-400/25 text-emerald-100"
            }`}
          >
            Team {meta.team === "wolves" ? meta.plural : skin === "werewolf" ? "Village" : "Town"}
          </span>
          <span className="mt-1 text-pretty text-sm font-semibold text-white/85">{meta.blurb}</span>
        </div>
      </div>
    </button>
  );
}

/** Tap a player: used for night actions and votes. */
export function PlayerGrid({
  players,
  selected,
  onPick,
  disabled,
  tone = "night",
  marks,
}: {
  players: { i: number; name: string; alive: boolean; note?: string }[];
  selected: number | null;
  onPick: (i: number) => void;
  disabled?: (i: number) => boolean;
  tone?: "night" | "day";
  /** Small badge per player, e.g. vote counts or "🐺 teammate". */
  marks?: Record<number, string>;
}) {
  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {players.map((p) => {
        const off = !p.alive || disabled?.(p.i);
        const on = selected === p.i;
        return (
          <button
            key={p.i}
            type="button"
            disabled={off}
            onClick={() => onPick(p.i)}
            aria-pressed={on}
            className={`relative flex items-center gap-2 rounded-2xl border-2 px-3 py-2.5 text-left text-sm font-extrabold transition-all active:scale-95 disabled:cursor-not-allowed ${
              on
                ? tone === "night"
                  ? "border-red-400 bg-red-500/25 text-white shadow-[0_0_24px_rgba(239,68,68,0.45)]"
                  : "border-slate-900 bg-slate-900 text-white"
                : off
                  ? tone === "night"
                    ? "border-white/5 bg-white/5 text-white/30 line-through"
                    : "border-slate-900/10 bg-white/30 text-slate-500 line-through"
                  : tone === "night"
                    ? "border-white/15 bg-white/10 text-white hover:border-white/40"
                    : "border-slate-900/15 bg-white/70 text-slate-900 hover:border-slate-900/40"
            }`}
          >
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-black ${
                on ? "bg-white text-slate-900" : tone === "night" ? "bg-white/15" : "bg-slate-900/10"
              }`}
            >
              {p.alive ? p.name.slice(0, 1).toUpperCase() : "💀"}
            </span>
            <span className="min-w-0 flex-1 truncate">{p.name}</span>
            {marks?.[p.i] ? <span className="shrink-0 text-xs font-black opacity-90">{marks[p.i]}</span> : null}
          </button>
        );
      })}
    </div>
  );
}

/** Narrator speech bubble. */
export function NarratorLine({ text, dark = true }: { text: string | string[]; dark?: boolean }) {
  const line = Array.isArray(text) ? text.join(" ") : text;
  return (
    <p
      key={line}
      className={`mx-auto max-w-lg text-balance rounded-2xl px-4 py-3 text-center text-base font-bold italic leading-snug motion-safe:animate-fade-up sm:text-lg ${
        dark ? "bg-black/30 text-white/90 backdrop-blur" : "bg-white/60 text-slate-900"
      }`}
    >
      “{line}”
    </p>
  );
}

/** Animated sound bars while the narrator is talking. */
export function SpeakingBadge({ dark = true }: { dark?: boolean }) {
  const [on, setOn] = useState(false);
  useEffect(() => onSpeaking(setOn), []);
  if (!on) return null;
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-black motion-safe:animate-fade-in ${
        dark ? "bg-white/15 text-white" : "bg-slate-900/10 text-slate-900"
      }`}
      aria-live="polite"
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className="narrator-bar w-[3px] rounded-full bg-current"
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
      </span>
      Narrator speaking
    </span>
  );
}

/** Narrator voice on/off (remembered). */
export function VoiceToggle({ dark = true }: { dark?: boolean }) {
  const [muted, setMuted] = useState(false);
  const [open, setOpen] = useState(false);
  const [voices, setVoices] = useState<{ name: string; lang: string; good: boolean }[]>([]);
  const [current, setCurrent] = useState<string | null>(null);

  useEffect(() => {
    try {
      const m = localStorage.getItem("ol-wolf-voice") === "off";
      setMuted(m);
      setNarrationMuted(m);
    } catch {
      /* ignore */
    }
    const load = () => {
      restoreVoice();
      setVoices(listVoices());
      setCurrent(narratorVoiceName());
    };
    load();
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.addEventListener?.("voiceschanged", load);
      return () => window.speechSynthesis.removeEventListener?.("voiceschanged", load);
    }
  }, []);

  const chip = dark ? "bg-white/10 text-white hover:bg-white/20" : "bg-slate-900/10 text-slate-900";
  return (
    <span className="relative inline-flex items-center gap-1">
      <button
        type="button"
        onClick={() => {
          const m = !muted;
          setMuted(m);
          setNarrationMuted(m);
          try {
            localStorage.setItem("ol-wolf-voice", m ? "off" : "on");
          } catch {
            /* ignore */
          }
        }}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black backdrop-blur transition-colors ${chip}`}
        aria-pressed={!muted}
      >
        {muted ? <VolumeX className="h-3.5 w-3.5" aria-hidden /> : <Volume2 className="h-3.5 w-3.5" aria-hidden />}
        Narrator {muted ? "off" : "on"}
      </button>
      {voices.length > 1 ? (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-label="Choose the narrator's voice"
          title="Choose the narrator's voice"
          className={`grid h-7 w-7 place-items-center rounded-full backdrop-blur transition-colors ${chip}`}
        >
          <Settings2 className="h-3.5 w-3.5" aria-hidden />
        </button>
      ) : null}
      {open ? (
        <span className="absolute right-0 top-9 z-20 w-64 rounded-2xl border border-white/10 bg-slate-950/95 p-2 text-left text-white shadow-2xl backdrop-blur motion-safe:animate-menu-in">
          <span className="block px-2 pb-1 pt-1 text-[10px] font-black uppercase tracking-[0.15em] text-white/50">Narrator voice on this device</span>
          <span className="block max-h-64 overflow-y-auto">
            {voices.map((v) => (
              <button
                key={v.name}
                type="button"
                onClick={() => {
                  chooseVoice(v.name);
                  setCurrent(v.name);
                  void say(["Night falls…", "Everyone, close your eyes."]);
                }}
                className={`flex w-full items-center justify-between gap-2 rounded-xl px-2 py-1.5 text-left text-xs font-bold transition-colors hover:bg-white/10 ${
                  current === v.name ? "bg-white/15" : ""
                }`}
              >
                <span className="min-w-0 truncate">{v.name.replace(/^Microsoft |^Google /, "")}</span>
                <span className="shrink-0 text-[10px] text-white/50">
                  {v.good ? "★ " : ""}
                  {v.lang}
                </span>
              </button>
            ))}
          </span>
          <span className="block px-2 pt-1.5 text-[10px] text-white/45">Tap to hear it. ★ = most natural. Voices depend on your browser.</span>
        </span>
      ) : null}
    </span>
  );
}
