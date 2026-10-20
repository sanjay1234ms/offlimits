"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Minus, Plus, RotateCcw, Swords } from "lucide-react";
import type { CatalogGame } from "@/data/catalog";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";
import { track, trackCardNext, trackGameFinished } from "@/lib/analytics";

const SLOT_OPTIONS = [12, 16, 24] as const;
const FLIGHT_MS = 560;
const SUSPENSE_MS = 520;
const LAUNCH_MS = 1900;

/* Barrel geometry, in SVG user units (viewBox 0 -60 320 440). */
const CX = 160;
const TOP_Y = 150;
const BOTTOM_Y = 355;
const END_RX = 92;
const BULGE = 15;
const SVG_NS = "http://www.w3.org/2000/svg";

function halfWidth(y: number): number {
  return END_RX + BULGE * Math.sin((Math.PI * (y - TOP_Y)) / (BOTTOM_Y - TOP_Y));
}

interface Slot {
  x: number;
  y: number;
  rx: number;
}

/** Lays the slots out in rows across the front of the barrel, squashed
 * towards the edges so they wrap around it. */
function layoutSlots(count: number): Slot[] {
  const cols = count === 24 ? 6 : 4;
  const rows = count / cols;
  const slots: Slot[] = [];
  for (let r = 0; r < rows; r++) {
    const y = 222 + (r * (318 - 222)) / Math.max(1, rows - 1);
    const w = halfWidth(y);
    for (let c = 0; c < cols; c++) {
      const phi = ((-62 + (c * 124) / (cols - 1)) * Math.PI) / 180;
      slots.push({ x: CX + w * Math.sin(phi), y, rx: 10 * Math.cos(phi) + 2 });
    }
  }
  return slots;
}

interface StuckKnife {
  slot: number;
  angle: number;
}

/** Runs `frame(t)` with t from 0 to 1 on animation frames, then `done`. */
function tween(
  ms: number,
  frame: (t: number) => void,
  done: () => void,
  frames: Set<number>,
): void {
  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / ms);
    frame(t);
    if (t < 1) {
      frames.add(requestAnimationFrame(step));
    } else {
      done();
    }
  };
  frames.add(requestAnimationFrame(step));
}

/** Wood chips that burst out of a slot and fall with gravity. Drawn straight
 * into the SVG so a burst never re-renders React. */
function splinters(
  layer: SVGGElement,
  x: number,
  y: number,
  count: number,
  power: number,
  frames: Set<number>,
): void {
  const chips = Array.from({ length: count }, () => {
    const el = document.createElementNS(SVG_NS, "rect");
    const size = 2 + Math.random() * 3.5;
    el.setAttribute("width", String(size * 1.8));
    el.setAttribute("height", String(size));
    el.setAttribute("rx", "1");
    el.setAttribute("fill", Math.random() < 0.5 ? "#c98a4b" : "#7c4a1e");
    layer.appendChild(el);
    const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
    const v = power * (0.5 + Math.random() * 0.7);
    return { el, vx: Math.cos(a) * v, vy: Math.sin(a) * v, spin: (Math.random() - 0.5) * 900 };
  });
  tween(
    650,
    (t) => {
      const s = t * 0.65;
      chips.forEach((c) => {
        const px = x + c.vx * s;
        const py = y + c.vy * s + 0.5 * 900 * s * s;
        c.el.setAttribute("transform", `translate(${px},${py}) rotate(${c.spin * s})`);
        c.el.setAttribute("opacity", String(1 - t * t));
      });
    },
    () => chips.forEach((c) => c.el.remove()),
    frames,
  );
}

/** A throwing knife with its tip at the origin, pointing along +x. */
function Knife({ buried }: { buried?: boolean }) {
  return (
    <g>
      <path
        d={
          buried
            ? "M-9,-1.8 L-24,-5 L-30,-5 L-30,3 L-24,3 L-9,1 Z"
            : "M0,0 L-24,-5 L-30,-5 L-30,3 L-24,3 Z"
        }
        fill="#e5e7eb"
        stroke="#6b7280"
        strokeWidth="0.8"
      />
      <path d="M-24,-1 L-30,-1" stroke="#9ca3af" strokeWidth="0.8" />
      <rect x="-33" y="-8" width="3.5" height="16" rx="1.2" fill="#d4a017" />
      <rect x="-48" y="-3.5" width="15" height="7" rx="3" fill="#7c2d12" />
      <path d="M-45,-3.5 L-45,3.5 M-41,-3.5 L-41,3.5 M-37,-3.5 L-37,3.5" stroke="#451a03" strokeWidth="0.8" />
      <circle cx="-49" cy="0" r="3.5" fill="#d4a017" />
    </g>
  );
}

function Pirate({ popped }: { popped: boolean }) {
  return (
    <g>
      {/* Legs dangling over the front of the lid */}
      <rect x="139" y="140" width="15" height="48" rx="6" fill="#1e3a8a" />
      <rect x="166" y="140" width="15" height="48" rx="6" fill="#1e3a8a" />
      <ellipse cx="145" cy="192" rx="11" ry="6" fill="#111827" />
      <ellipse cx="175" cy="192" rx="11" ry="6" fill="#111827" />
      {/* Arms bracing on the rim, or flung up when launched */}
      {popped ? (
        <>
          <path d="M136,98 Q112,80 108,56" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M184,98 Q208,80 212,56" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="108" cy="52" r="6.5" fill="#f2c094" />
          <circle cx="212" cy="52" r="6.5" fill="#f2c094" />
        </>
      ) : (
        <>
          <path d="M136,98 Q116,118 118,142" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" fill="none" />
          <path d="M184,98 Q204,118 202,142" stroke="#dc2626" strokeWidth="11" strokeLinecap="round" fill="none" />
          <circle cx="118" cy="145" r="6.5" fill="#f2c094" />
          <circle cx="202" cy="145" r="6.5" fill="#f2c094" />
        </>
      )}
      {/* Striped shirt, belt */}
      <rect x="132" y="86" width="56" height="64" rx="14" fill="#dc2626" />
      <path d="M134,100 H186 M133,113 H187 M133,126 H187" stroke="#fef2f2" strokeWidth="4" />
      <rect x="132" y="134" width="56" height="9" fill="#111827" />
      <rect x="154" y="134" width="12" height="9" rx="1.5" fill="none" stroke="#d4a017" strokeWidth="2" />
      {/* Head */}
      <circle cx="160" cy="62" r="24" fill="#f2c094" />
      <path d="M137,66 Q140,94 160,94 Q180,94 183,66 Q172,78 160,76 Q148,78 137,66 Z" fill="#5b3412" />
      {popped ? (
        <>
          <path d="M147,54 L155,62 M155,54 L147,62" stroke="#111827" strokeWidth="2.4" strokeLinecap="round" />
          <ellipse cx="160" cy="78" rx="4.5" ry="5.5" fill="#111827" />
        </>
      ) : (
        <>
          <circle cx="151" cy="58" r="3" fill="#111827" />
          <path d="M152,77 Q160,82 168,77" stroke="#111827" strokeWidth="2" fill="none" strokeLinecap="round" />
        </>
      )}
      <path d="M137,48 L183,66" stroke="#111827" strokeWidth="2" />
      <ellipse cx="169" cy="58" rx="6.5" ry="6" fill="#111827" />
      {/* Tricorn hat */}
      <path d="M122,46 Q160,2 198,46 Q160,34 122,46 Z" fill="#111827" />
      <circle cx="160" cy="30" r="5" fill="#f9fafb" />
      <path d="M154,38 L166,42 M166,38 L154,42" stroke="#f9fafb" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

/** Pirate Barrel, throw knives into the barrel. One slot launches the pirate. */
export function PirateBarrelGame({ game }: { game: CatalogGame }) {
  const [slotCount, setSlotCount] = useState<number>(16);
  const [playerCount, setPlayerCount] = useState(4);
  const [trap, setTrap] = useState(-1);
  const [stuck, setStuck] = useState<StuckKnife[]>([]);
  const [busy, setBusy] = useState(false);
  const [popped, setPopped] = useState(false);
  const [flying, setFlying] = useState(false);

  const timers = useRef<number[]>([]);
  const frames = useRef(new Set<number>());
  const barrelRef = useRef<SVGGElement>(null);
  const pirateRef = useRef<SVGGElement>(null);
  const knifeRef = useRef<SVGGElement>(null);
  const chipsRef = useRef<SVGGElement>(null);
  const stuckRefs = useRef(new Map<number, SVGGElement>());

  const slots = useMemo(() => layoutSlots(slotCount), [slotCount]);

  const stopAll = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
    frames.current.forEach((f) => cancelAnimationFrame(f));
    frames.current.clear();
    chipsRef.current?.replaceChildren();
  };

  const newBarrel = useCallback((count: number) => {
    stopAll();
    setTrap(Math.floor(Math.random() * count));
    setStuck([]);
    setBusy(false);
    setFlying(false);
    setPopped(false);
    barrelRef.current?.removeAttribute("transform");
    pirateRef.current?.removeAttribute("transform");
    pirateRef.current?.removeAttribute("visibility");
  }, []);

  useEffect(() => {
    newBarrel(slotCount);
  }, [slotCount, newBarrel]);

  useEffect(() => stopAll, []);

  const used = new Set(stuck.map((k) => k.slot));
  const turn = stuck.length % playerCount;
  const loser = (stuck.length - 1) % playerCount;
  const safeLeft = slotCount - stuck.length - (popped ? 0 : 1);

  /** Damped wobble: the barrel rocks from the hit, the knife quivers. */
  const impact = (slot: number, angle: number, strength: number) => {
    const rad = (angle * Math.PI) / 180;
    const knifeEl = () => stuckRefs.current.get(slot);
    const { x, y } = slots[slot];
    tween(
      strength > 1 ? 700 : 480,
      (t) => {
        const decay = Math.exp(-6 * t);
        const wave = Math.sin(t * Math.PI * 9) * decay;
        const push = 3.2 * strength * wave;
        barrelRef.current?.setAttribute(
          "transform",
          `translate(${Math.cos(rad) * push},${Math.abs(Math.sin(rad) * push) * 0.4}) rotate(${push * 0.45} ${CX} ${BOTTOM_Y})`,
        );
        knifeEl()?.setAttribute(
          "transform",
          `translate(${x},${y}) rotate(${angle + 9 * Math.sin(t * Math.PI * 14) * decay})`,
        );
      },
      () => barrelRef.current?.removeAttribute("transform"),
      frames.current,
    );
  };

  const launchPirate = (slot: number) => {
    const el = pirateRef.current;
    if (!el) return;
    const { x, y } = slots[slot];
    if (chipsRef.current) splinters(chipsRef.current, x, y, 16, 260, frames.current);
    impact(slot, 0, 2.4);
    const drift = Math.random() < 0.5 ? -1 : 1;
    tween(
      LAUNCH_MS,
      (t) => {
        // Real projectile: fast up, gravity pulls it back down past the barrel.
        const s = t * 1.85;
        const ty = -480 * s + 0.5 * 900 * s * s;
        const tx = drift * 110 * s;
        const rot = drift * 540 * s;
        el.setAttribute("transform", `translate(${tx},${ty}) rotate(${rot} 160 110)`);
      },
      () => el.setAttribute("visibility", "hidden"),
      frames.current,
    );
  };

  const throwAt = (target?: number) => {
    if (busy || popped) return;
    const open = slots.map((_, i) => i).filter((i) => !used.has(i));
    if (!open.length) return;
    const slot =
      target !== undefined && !used.has(target)
        ? target
        : open[Math.floor(Math.random() * open.length)];
    const { x, y } = slots[slot];

    // Thrown from a random spot off the left, right or bottom, on an arc.
    const side = Math.floor(Math.random() * 3);
    const fx = side === 0 ? -70 : side === 1 ? 390 : 30 + Math.random() * 260;
    const fy = side === 2 ? 460 : 170 + Math.random() * 220;
    const lift = 50 + Math.random() * 40;
    const angle = (Math.atan2(y - fy + 4 * lift, x - fx) * 180) / Math.PI;
    const spins = 2 + Math.floor(Math.random() * 2);

    setBusy(true);
    setFlying(true);
    sfx.spin();
    const knives = stuck.length + 1;

    tween(
      FLIGHT_MS,
      (t) => {
        const e = 1 - Math.pow(1 - t, 1.5);
        const px = fx + (x - fx) * e;
        const py = fy + (y - fy) * e - lift * 4 * e * (1 - e);
        const rot = angle - 360 * spins * (1 - e);
        const scale = 1.9 - 0.9 * e;
        knifeRef.current?.setAttribute(
          "transform",
          `translate(${px},${py}) rotate(${rot}) scale(${scale})`,
        );
      },
      () => {
        setFlying(false);
        setStuck((s) => [...s, { slot, angle }]);
        sfx.tick(2);
        haptic(HAPTIC.advance);
        if (chipsRef.current) splinters(chipsRef.current, x, y, 7, 150, frames.current);
        // Wait a frame so the stuck knife exists before it starts quivering.
        frames.current.add(requestAnimationFrame(() => impact(slot, angle, 1)));

        timers.current.push(
          window.setTimeout(() => {
            if (slot === trap) {
              setPopped(true);
              setBusy(false);
              launchPirate(slot);
              sfx.buzzer();
              haptic(HAPTIC.buzzer);
              track("pirate_popped", { game: game.slug, knives, slots: slotCount });
              trackGameFinished(game.slug);
            } else {
              setBusy(false);
              sfx.flip();
              trackCardNext(game.slug, knives);
            }
          }, SUSPENSE_MS),
        );
      },
      frames.current,
    );
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex w-full flex-wrap items-center justify-between gap-3 text-sm font-bold">
        <div className="flex items-center gap-2">
          <span className="text-muted">Players</span>
          <button
            type="button"
            aria-label="Fewer players"
            onClick={() => setPlayerCount((n) => Math.max(1, n - 1))}
            disabled={stuck.length > 0 && !popped}
            className="btn-ghost h-8 w-8 p-0 disabled:opacity-40"
          >
            <Minus className="h-4 w-4" aria-hidden />
          </button>
          <span className={`w-6 text-center tabular-nums ${game.text}`}>
            {playerCount}
          </span>
          <button
            type="button"
            aria-label="More players"
            onClick={() => setPlayerCount((n) => Math.min(20, n + 1))}
            disabled={stuck.length > 0 && !popped}
            className="btn-ghost h-8 w-8 p-0 disabled:opacity-40"
          >
            <Plus className="h-4 w-4" aria-hidden />
          </button>
        </div>
        <div className="flex items-center gap-1.5" role="group" aria-label="Barrel size">
          {SLOT_OPTIONS.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setSlotCount(n)}
              aria-pressed={slotCount === n}
              className={`rounded-full border px-3 py-1 text-xs font-bold transition-colors ${
                slotCount === n
                  ? `${game.border} ${game.text} bg-white/5`
                  : "border-white/10 text-muted hover:text-foreground"
              }`}
            >
              {n} slots
            </button>
          ))}
        </div>
      </div>

      <div
        className={`relative flex w-full flex-col items-center gap-3 overflow-hidden rounded-3xl border-2 bg-gradient-to-b from-sky-400/25 via-sky-300/10 to-amber-600/20 px-4 pb-6 pt-5 text-center sm:px-9 ${game.border}`}
        style={{ backgroundColor: "var(--card-bg)" }}
      >
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-subtle">
          {popped
            ? "The pirate is out!"
            : playerCount > 1
              ? `Player ${turn + 1}, throw a knife`
              : "Throw a knife"}
        </p>

        <svg
          viewBox="0 -60 320 440"
          className="w-full max-w-[19rem] cursor-crosshair touch-manipulation select-none overflow-visible sm:max-w-[21rem]"
          role="img"
          aria-label={`Pirate barrel with ${stuck.length} knives in`}
          onClick={() => throwAt()}
        >
          <defs>
            <linearGradient id="pb-wood" x1="0" x2="1" y1="0" y2="0">
              <stop offset="0" stopColor="#6e3d17" />
              <stop offset="0.3" stopColor="#b06d33" />
              <stop offset="0.55" stopColor="#c27c3e" />
              <stop offset="1" stopColor="#6e3d17" />
            </linearGradient>
          </defs>

          {/* Ground shadow */}
          <ellipse cx={CX} cy="370" rx="120" ry="12" fill="#000" opacity="0.18" />

          <g ref={barrelRef}>
            {/* Barrel body */}
            <path
              d={`M${CX - END_RX},${TOP_Y} Q${CX - END_RX - 2 * BULGE},252 ${CX - END_RX},${BOTTOM_Y} A${END_RX},20 0 0 0 ${CX + END_RX},${BOTTOM_Y} Q${CX + END_RX + 2 * BULGE},252 ${CX + END_RX},${TOP_Y} Z`}
              fill="url(#pb-wood)"
              stroke="#4a2511"
              strokeWidth="4"
            />
            {/* Staves */}
            {[-0.82, -0.55, -0.27, 0, 0.27, 0.55, 0.82].map((s) => (
              <path
                key={s}
                d={`M${CX + END_RX * s},${TOP_Y + 20 * Math.sqrt(1 - s * s)} Q${CX + (END_RX + 2 * BULGE) * s},252 ${CX + END_RX * s},${BOTTOM_Y + 20 * Math.sqrt(1 - s * s)}`}
                stroke="#5a2f10"
                strokeWidth="2"
                fill="none"
                opacity="0.6"
              />
            ))}
            {/* Iron hoops */}
            {[190, 340].map((y) => {
              const w = halfWidth(y) + 1;
              return (
                <g key={y}>
                  <path
                    d={`M${CX - w},${y} A${w},18 0 0 0 ${CX + w},${y}`}
                    stroke="#374151"
                    strokeWidth="8"
                    fill="none"
                  />
                  <path
                    d={`M${CX - w + 4},${y - 2} A${w - 4},16 0 0 0 ${CX + w - 4},${y - 2}`}
                    stroke="#9ca3af"
                    strokeWidth="1.5"
                    fill="none"
                    opacity="0.6"
                  />
                </g>
              );
            })}
            {/* Lid */}
            <ellipse cx={CX} cy={TOP_Y} rx={END_RX} ry="20" fill="#c98a4b" stroke="#4a2511" strokeWidth="4" />
            <ellipse cx={CX} cy={TOP_Y} rx={END_RX - 12} ry="13" fill="#3b1d0b" />

            {/* Slots */}
            {slots.map((s, i) => {
              const isTrap = popped && i === trap;
              return (
                <g
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    throwAt(i);
                  }}
                  className={!used.has(i) && !busy && !popped ? "cursor-pointer" : ""}
                >
                  {isTrap ? (
                    <circle cx={s.x} cy={s.y} r="20" fill="#f97316" opacity="0.85" />
                  ) : null}
                  <ellipse
                    cx={s.x}
                    cy={s.y}
                    rx={s.rx}
                    ry="7"
                    fill={isTrap ? "#7f1d1d" : "#1c0d04"}
                    stroke="#3b1d0b"
                    strokeWidth="1.5"
                  />
                  {/* Larger invisible hit area */}
                  <ellipse cx={s.x} cy={s.y} rx={s.rx + 6} ry="13" fill="transparent" />
                </g>
              );
            })}

            {/* Knives already in */}
            {stuck.map((k) => (
              <g
                key={k.slot}
                ref={(el) => {
                  if (el) stuckRefs.current.set(k.slot, el);
                  else stuckRefs.current.delete(k.slot);
                }}
                transform={`translate(${slots[k.slot].x},${slots[k.slot].y}) rotate(${k.angle})`}
              >
                <Knife buried />
              </g>
            ))}
          </g>

          {/* Pirate sitting on the lid */}
          <g ref={pirateRef}>
            <g>
              {popped ? null : (
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  values="-1.5 160 190;1.5 160 190;-1.5 160 190"
                  dur="2.6s"
                  repeatCount="indefinite"
                />
              )}
              <Pirate popped={popped} />
            </g>
          </g>

          {/* Wood chips */}
          <g ref={chipsRef} />

          {/* Knife in flight */}
          <g ref={knifeRef} visibility={flying ? "visible" : "hidden"}>
            <Knife />
          </g>
        </svg>

        {popped ? (
          <p className="animate-pop-in text-2xl font-extrabold text-red-500">
            {playerCount > 1 ? `Player ${loser + 1} launched the pirate!` : "You launched the pirate!"}
          </p>
        ) : (
          <p className="text-sm font-bold text-muted">
            {stuck.length} {stuck.length === 1 ? "knife" : "knives"} in · {safeLeft} safe slot
            {safeLeft === 1 ? "" : "s"} left
          </p>
        )}
      </div>

      <div className="flex w-full flex-col gap-3 sm:flex-row sm:justify-center">
        {popped ? (
          <button
            type="button"
            onClick={() => newBarrel(slotCount)}
            className="btn-primary w-full py-4 text-base sm:w-auto sm:min-w-[12rem]"
          >
            <RotateCcw className="h-5 w-5" aria-hidden />
            New barrel
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => throwAt()}
              disabled={busy}
              className="btn-primary w-full py-4 text-base disabled:opacity-60 sm:w-auto sm:min-w-[12rem]"
            >
              <Swords className="h-5 w-5" aria-hidden />
              Throw a knife
            </button>
            <button
              type="button"
              onClick={() => newBarrel(slotCount)}
              className="btn-ghost w-full sm:w-auto"
            >
              <RotateCcw className="h-4 w-4" aria-hidden />
              New barrel
            </button>
          </>
        )}
      </div>
    </div>
  );
}
