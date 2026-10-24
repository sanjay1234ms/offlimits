"use client";

import { useEffect, useRef, useState } from "react";
import { confettiBurst } from "@/lib/confetti";
import { track } from "@/lib/analytics";

/* Interactive pieces of the homepage Christmas section. Every animation runs
 * on requestAnimationFrame with simple spring physics, only while its element
 * is on screen, and stays still for visitors who prefer reduced motion. */

function prefersReducedMotion(): boolean {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/** Calls `onChange` when the element enters or leaves the viewport. */
function watchVisibility(el: Element, onChange: (visible: boolean) => void) {
  if (typeof IntersectionObserver === "undefined") {
    onChange(true);
    return () => {};
  }
  const observer = new IntersectionObserver(([entry]) =>
    onChange(entry.isIntersecting),
  );
  observer.observe(el);
  return () => observer.disconnect();
}

/** A damped spring: call step() each frame to move `x` toward `target`. */
class Spring {
  x: number;
  v = 0;
  target: number;
  constructor(
    value: number,
    private stiffness = 170,
    private damping = 14,
  ) {
    this.x = value;
    this.target = value;
  }
  step(dt: number) {
    const a = -this.stiffness * (this.x - this.target) - this.damping * this.v;
    this.v += a * dt;
    this.x += this.v * dt;
  }
  get resting() {
    return Math.abs(this.v) < 0.01 && Math.abs(this.x - this.target) < 0.01;
  }
}

/* ------------------------------------------------------------------ */
/* Snowfall                                                            */
/* ------------------------------------------------------------------ */

interface Flake {
  x: number;
  y: number;
  r: number;
  phase: number;
}

/** Soft snowfall drawn on a canvas behind the section. Bigger flakes fall
 * faster (parallax), and the wind leans toward the pointer. */
export function Snowfall() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx || prefersReducedMotion()) return;

    let width = 0;
    let height = 0;
    let flakes: Flake[] = [];
    let wind = 0;
    let windTarget = 0;
    let frame = 0;
    let last = 0;
    let running = false;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(90, Math.round(width / 16));
      flakes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        r: 1 + Math.random() * 2.6,
        phase: Math.random() * Math.PI * 2,
      }));
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      wind += (windTarget - wind) * Math.min(dt * 2, 1);
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(255,255,255,0.85)";
      ctx.beginPath();
      for (const f of flakes) {
        f.phase += dt * (0.6 + f.r * 0.25);
        f.y += (14 + f.r * 16) * dt;
        f.x += (Math.sin(f.phase) * 10 + wind * f.r * 14) * dt;
        if (f.y - f.r > height) {
          f.y = -f.r;
          f.x = Math.random() * width;
        }
        if (f.x > width + 4) f.x = -4;
        if (f.x < -4) f.x = width + 4;
        ctx.moveTo(f.x + f.r, f.y);
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2);
      }
      ctx.fill();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    const onPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      windTarget = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
    };

    resize();
    window.addEventListener("resize", resize);
    canvas.parentElement?.addEventListener("pointermove", onPointer);
    const unwatch = watchVisibility(canvas, (v) => (v ? start() : stop()));
    return () => {
      stop();
      unwatch();
      window.removeEventListener("resize", resize);
      canvas.parentElement?.removeEventListener("pointermove", onPointer);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none absolute inset-0 h-full w-full"
    />
  );
}

/* ------------------------------------------------------------------ */
/* Countdown                                                           */
/* ------------------------------------------------------------------ */

function nextChristmas(now: Date): Date {
  const year =
    now.getMonth() === 11 && now.getDate() > 25
      ? now.getFullYear() + 1
      : now.getFullYear();
  return new Date(year, 11, 25);
}

/** Live "days to Christmas" pill. Renders a neutral label on the server so
 * the first paint never mismatches the visitor's clock. */
export function ChristmasCountdown() {
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  let label = "Christmas is coming";
  let parts: [number, string][] = [];
  if (now) {
    if (now.getMonth() === 11 && now.getDate() === 25) {
      label = "It's Christmas Day!";
    } else {
      const ms = nextChristmas(now).getTime() - now.getTime();
      const s = Math.floor(ms / 1000);
      parts = [
        [Math.floor(s / 86400), "d"],
        [Math.floor((s % 86400) / 3600), "h"],
        [Math.floor((s % 3600) / 60), "m"],
        [s % 60, "s"],
      ];
    }
  }

  return (
    <span className="inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-white px-3 py-1 text-xs font-black text-slate-900 shadow-[3px_3px_0_#0f172a]">
      <span aria-hidden>⏳</span>
      {parts.length ? (
        <span className="tabular-nums" aria-label={`${parts[0][0]} days to Christmas`}>
          {parts.map(([n, unit]) => (
            <span key={unit} className="mr-1 last:mr-0">
              {unit === "d" ? n : String(n).padStart(2, "0")}
              <span className="text-slate-500">{unit}</span>
            </span>
          ))}
          <span className="ml-1 font-bold text-slate-600">to Christmas</span>
        </span>
      ) : (
        <span>{label}</span>
      )}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Jiggling emoji badge                                                */
/* ------------------------------------------------------------------ */

/** An emoji in a round badge that springs into a wobble when its card is
 * hovered or tapped, and once when it first scrolls into view. */
export function JiggleBadge({
  emoji,
  className = "",
}: {
  emoji: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const card = el?.closest("a");
    if (!el || !card || prefersReducedMotion()) return;

    const rot = new Spring(0, 260, 9);
    const scale = new Spring(1, 300, 12);
    let frame = 0;
    let last = 0;

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      rot.step(dt);
      scale.step(dt);
      el.style.transform = `rotate(${rot.x}deg) scale(${scale.x})`;
      if (rot.resting && scale.resting) {
        frame = 0;
        return;
      }
      frame = requestAnimationFrame(tick);
    };
    const kick = () => {
      rot.v += 520 * (Math.random() > 0.5 ? 1 : -1);
      scale.v += 6;
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    let seen = false;
    const unwatch = watchVisibility(el, (v) => {
      if (v && !seen) {
        seen = true;
        window.setTimeout(kick, 250);
      }
    });
    card.addEventListener("pointerenter", kick);
    card.addEventListener("pointerdown", kick);
    return () => {
      cancelAnimationFrame(frame);
      unwatch();
      card.removeEventListener("pointerenter", kick);
      card.removeEventListener("pointerdown", kick);
    };
  }, []);

  return (
    <span
      ref={ref}
      aria-hidden
      className={`grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-slate-900 text-2xl shadow-[2px_2px_0_#0f172a] will-change-transform ${className}`}
    >
      {emoji}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* The gift                                                            */
/* ------------------------------------------------------------------ */

const SAMPLE_NAMES = [
  "Priya",
  "Uncle Ray",
  "Jordan",
  "Aisha",
  "Grandma",
  "Leo",
  "Sam",
  "Mei",
  "Your boss",
  "Marcus",
  "Nana",
  "Chloe",
];

/** A gift box you can poke: it rattles on its own now and then, the tag
 * swings like a pendulum, and a tap pops the lid to reveal a sample draw. */
export function SecretSantaGift() {
  const svgRef = useRef<SVGSVGElement>(null);
  const boxRef = useRef<SVGGElement>(null);
  const lidRef = useRef<SVGGElement>(null);
  const slipRef = useRef<SVGGElement>(null);
  const tagRef = useRef<SVGGElement>(null);
  const openRef = useRef<() => void>(() => {});
  const [name, setName] = useState(SAMPLE_NAMES[0]);
  const [draws, setDraws] = useState(0);

  useEffect(() => {
    const svg = svgRef.current;
    const box = boxRef.current;
    const lid = lidRef.current;
    const slip = slipRef.current;
    const tag = tagRef.current;
    if (!svg || !box || !lid || !slip || !tag) return;

    const reduced = prefersReducedMotion();
    const lidY = new Spring(0, 120, 11);
    const lidRot = new Spring(0, 120, 10);
    const slipY = new Spring(0, 90, 12);
    const shake = new Spring(0, 400, 7);
    const squash = new Spring(1, 260, 10);
    // Tag pendulum: angle (rad) and angular velocity.
    let tagA = 0.25;
    let tagV = 0;
    let t = 0;
    let nextRattle = 2.5;
    let closeAt = 0;
    let frame = 0;
    let last = 0;
    let running = false;

    const render = () => {
      const bob = reduced ? 0 : Math.sin(t * 2.2) * 2.2;
      box.setAttribute(
        "transform",
        `translate(110 ${200 + bob}) rotate(${shake.x}) scale(${2 - squash.x} ${squash.x}) translate(-110 -200)`,
      );
      lid.setAttribute(
        "transform",
        `translate(0 ${lidY.x}) rotate(${lidRot.x} 40 88)`,
      );
      slip.setAttribute("transform", `translate(0 ${slipY.x})`);
      tag.setAttribute("transform", `rotate(${(tagA * 180) / Math.PI} 168 98)`);
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.04);
      last = now;
      t += dt;

      if (t > nextRattle && lidY.target === 0) {
        // A little rattle every few seconds says "tap me".
        shake.v += 160;
        squash.v -= 1.2;
        tagV += 1.6;
        nextRattle = t + 3.5 + Math.random() * 3;
      }
      if (closeAt && t > closeAt) {
        closeAt = 0;
        lidY.target = 0;
        lidRot.target = 0;
        slipY.target = 0;
      }

      const prevShake = shake.x;
      for (const s of [lidY, lidRot, slipY, shake, squash]) s.step(dt);
      // Gravity pulls the tag down; the box shaking drags its pivot sideways.
      const pivotAccel = (shake.x - prevShake) / Math.max(dt, 0.001);
      tagV += (-18 * Math.sin(tagA) - 0.9 * tagV - pivotAccel * 0.004) * dt;
      tagA += tagV * dt;
      if (Math.abs(tagA) > 1.1) {
        // The string can't swing the tag up over the lid.
        tagA = Math.sign(tagA) * 1.1;
        tagV *= -0.4;
      }

      render();
      frame = requestAnimationFrame(tick);
    };

    const start = () => {
      if (running || reduced) return;
      running = true;
      last = performance.now();
      frame = requestAnimationFrame(tick);
    };
    const stop = () => {
      running = false;
      cancelAnimationFrame(frame);
    };

    openRef.current = () => {
      setName((prev) => {
        let next = prev;
        while (next === prev) {
          next = SAMPLE_NAMES[Math.floor(Math.random() * SAMPLE_NAMES.length)];
        }
        return next;
      });
      setDraws((n) => n + 1);
      track("holiday_gift_open");
      if (reduced) {
        lidY.x = -64;
        lidRot.x = -16;
        slipY.x = -78;
        render();
        window.setTimeout(() => {
          lidY.x = lidRot.x = slipY.x = 0;
          render();
        }, 2600);
        return;
      }
      lidY.target = -64;
      lidRot.target = -16;
      slipY.target = -78;
      lidY.v -= 220;
      squash.v -= 3;
      tagV += 2.5;
      closeAt = t + 2.6;
      nextRattle = t + 6;
      const rect = svg.getBoundingClientRect();
      confettiBurst(rect.left + rect.width / 2, rect.top + rect.height * 0.35, 30);
    };

    render();
    const unwatch = watchVisibility(svg, (v) => (v ? start() : stop()));
    const onEnter = () => {
      tagV += 1.2;
      squash.v += 1.5;
    };
    svg.addEventListener("pointerenter", onEnter);
    return () => {
      stop();
      unwatch();
      svg.removeEventListener("pointerenter", onEnter);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => openRef.current()}
      aria-label="Open the gift for a sample Secret Santa draw"
      className="group relative mx-auto mt-10 block w-[13rem] shrink-0 touch-manipulation rounded-3xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-yellow-300 sm:mt-0 sm:w-[15rem]"
    >
      <svg
        ref={svgRef}
        viewBox="0 0 220 220"
        className="h-auto w-full overflow-visible"
        aria-hidden
      >
        <ellipse cx="112" cy="206" rx="78" ry="9" fill="#0f172a" opacity="0.18" />

        {/* Slip that rises out of the box; drawn first so the box hides it. */}
        <g ref={slipRef}>
          <g transform="rotate(-4 110 140)">
            <rect x="62" y="104" width="96" height="58" rx="6" fill="#fff" stroke="#0f172a" strokeWidth="4" />
            <text x="110" y="124" textAnchor="middle" fontSize="11" fontWeight="800" fill="#64748b">
              YOU GOT
            </text>
            <text x="110" y="145" textAnchor="middle" fontSize={name.length > 7 ? 14 : 17} fontWeight="900" fill="#0f172a">
              {name}
            </text>
          </g>
        </g>

        <g ref={boxRef}>
          {/* Body */}
          <rect x="40" y="104" width="140" height="96" rx="9" fill="#e11d48" stroke="#0f172a" strokeWidth="5" />
          <rect x="44" y="108" width="34" height="88" rx="6" fill="#fff" opacity="0.12" />
          <rect x="100" y="104" width="20" height="96" fill="#16a34a" stroke="#0f172a" strokeWidth="4" />
          {/* Snowflake print */}
          <g fill="#fff" opacity="0.55">
            <circle cx="66" cy="178" r="3" />
            <circle cx="152" cy="128" r="3" />
            <circle cx="160" cy="176" r="2.5" />
            <circle cx="70" cy="132" r="2" />
          </g>
          {/* Holly */}
          <g transform="translate(142 160)">
            <path d="M0 0 C 10 -14 26 -12 30 -2 C 22 -4 18 4 10 2 C 6 8 -2 6 0 0Z" fill="#15803d" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
            <path d="M0 0 C -6 -16 4 -28 14 -26 C 10 -20 14 -14 8 -10 C 10 -4 4 -2 0 0Z" fill="#22c55e" stroke="#0f172a" strokeWidth="3" strokeLinejoin="round" />
            <circle cx="-2" cy="4" r="5.5" fill="#dc2626" stroke="#0f172a" strokeWidth="3" />
            <circle cx="8" cy="8" r="5" fill="#dc2626" stroke="#0f172a" strokeWidth="3" />
          </g>

          {/* Lid, bow and tag swing together */}
          <g ref={lidRef}>
            <rect x="30" y="80" width="160" height="30" rx="7" fill="#f43f5e" stroke="#0f172a" strokeWidth="5" />
            <rect x="98" y="80" width="24" height="30" fill="#22c55e" stroke="#0f172a" strokeWidth="4" />
            {/* Bow */}
            <path d="M110 80 C 88 50 62 56 70 74 C 76 86 98 84 110 80Z" fill="#22c55e" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
            <path d="M110 80 C 132 50 158 56 150 74 C 144 86 122 84 110 80Z" fill="#22c55e" stroke="#0f172a" strokeWidth="4" strokeLinejoin="round" />
            <path d="M104 80 L 92 100 M116 80 L 128 100" stroke="#0f172a" strokeWidth="4" strokeLinecap="round" />
            <circle cx="110" cy="79" r="9" fill="#16a34a" stroke="#0f172a" strokeWidth="4" />
            {/* Swinging gift tag */}
            <g ref={tagRef}>
              <path d="M168 98 L 168 128" stroke="#0f172a" strokeWidth="2.5" />
              <g transform="translate(168 128) rotate(8)">
                <path d="M-14 0 L 14 0 L 14 30 L 0 38 L -14 30 Z" fill="#fde047" stroke="#0f172a" strokeWidth="3.5" strokeLinejoin="round" />
                <circle cx="0" cy="6" r="2.5" fill="#0f172a" />
                <text x="0" y="24" textAnchor="middle" fontSize="11" fontWeight="900" fill="#0f172a">
                  ?
                </text>
              </g>
            </g>
          </g>
        </g>
      </svg>
      <span className="mt-1 block text-center text-xs font-black uppercase tracking-wider text-slate-500 transition-colors group-hover:text-rose-600">
        {draws === 0 ? "Tap the gift 👆" : "Tap again for another name"}
      </span>
    </button>
  );
}
