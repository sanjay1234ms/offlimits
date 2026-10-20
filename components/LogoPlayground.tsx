"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Wind, X } from "lucide-react";
import { CATALOG, type CatalogGame } from "@/data/catalog";
import { logoMotion } from "@/data/logoMotion";
import { track } from "@/lib/analytics";
import { confettiBurst } from "@/lib/confetti";
import { ConfettiLink } from "./ConfettiLink";

const GAMES = CATALOG.filter((g) => !g.adult);

interface Body {
  x: number;
  y: number;
  vx: number;
  vy: number;
  rot: number;
}

/** Pointer within this many px pushes bubbles away (mouse only). */
const REPEL_RADIUS = 110;
/** Movement under this many px between press and release counts as a tap. */
const TAP_SLOP = 8;

/** A box of floating game-logo bubbles. Push them with the mouse, drag and
 * fling them, or tap one to see the game and jump into it. The physics only
 * runs while the box is on screen; reduced-motion visitors get a still grid
 * that is just as tappable. */
export function LogoPlayground() {
  const box = useRef<HTMLDivElement>(null);
  const bubbles = useRef<(HTMLButtonElement | null)[]>([]);
  const bodies = useRef<Body[]>([]);
  const pointer = useRef<{ x: number; y: number; mouse: boolean } | null>(null);
  const drag = useRef<{
    index: number;
    id: number;
    startX: number;
    startY: number;
    moved: number;
    lastX: number;
    lastY: number;
    lastT: number;
  } | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<CatalogGame | null>(null);

  function play(index: number) {
    const el = bubbles.current[index]?.querySelector(".game-logo");
    if (!el) return;
    el.classList.remove("is-playing");
    // Restart the animation even if it is mid-way through.
    void (el as HTMLElement).offsetWidth;
    el.classList.add("is-playing");
  }

  function choose(index: number) {
    const game = GAMES[index];
    setSelected(game);
    play(index);
    const r = bubbles.current[index]?.getBoundingClientRect();
    if (r) confettiBurst(r.left + r.width / 2, r.top + r.height / 2, 16);
    track("logo_playground_tap", { game: game.slug });
  }

  function shake() {
    for (const b of bodies.current) {
      b.vx += (Math.random() - 0.5) * 26;
      b.vy += (Math.random() - 0.5) * 26 - 6;
    }
    bubbles.current.forEach((_, i) => play(i));
  }

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    let width = el.clientWidth;
    let height = el.clientHeight;
    // Matches the bubble sizes in the markup (60px, 76px from `sm`).
    const radius = () => (window.innerWidth >= 640 ? 38 : 30);

    // Start on a loose grid so nothing overlaps on the first frame.
    const cols = Math.max(3, Math.floor(width / (radius() * 2.6)));
    const rows = Math.ceil(GAMES.length / cols);
    bodies.current = GAMES.map((_, i) => ({
      x: ((i % cols) + 0.5) * (width / cols),
      y: (Math.floor(i / cols) + 0.5) * (height / rows),
      vx: reduced ? 0 : (Math.random() - 0.5) * 3,
      vy: reduced ? 0 : (Math.random() - 0.5) * 3,
      rot: 0,
    }));

    function paint() {
      const r = radius();
      bodies.current.forEach((b, i) => {
        const node = bubbles.current[i];
        if (node) {
          node.style.transform = `translate3d(${b.x - r}px, ${b.y - r}px, 0) rotate(${b.rot}deg)`;
        }
      });
    }
    paint();
    setReady(true);
    if (reduced) return;

    let frame = 0;
    let last = performance.now();
    let visible = false;

    function step(now: number) {
      const dt = Math.min(2, (now - last) / 16.67);
      last = now;
      const r = radius();
      const list = bodies.current;
      const p = pointer.current;
      const dragging = drag.current?.index;

      for (let i = 0; i < list.length; i++) {
        const b = list[i];
        if (i === dragging) continue;

        // Keep everything gently drifting.
        const speed = Math.hypot(b.vx, b.vy);
        if (speed < 0.35) {
          b.vx += (Math.random() - 0.5) * 0.25;
          b.vy += (Math.random() - 0.5) * 0.25;
        }
        if (p?.mouse) {
          const dx = b.x - p.x;
          const dy = b.y - p.y;
          const d = Math.hypot(dx, dy) || 1;
          if (d < REPEL_RADIUS) {
            const push = ((REPEL_RADIUS - d) / REPEL_RADIUS) * 1.4 * dt;
            b.vx += (dx / d) * push;
            b.vy += (dy / d) * push;
          }
        }
        b.vx *= Math.pow(0.985, dt);
        b.vy *= Math.pow(0.985, dt);
        b.x += b.vx * dt;
        b.y += b.vy * dt;
        b.rot += b.vx * 0.6 * dt;

        if (b.x < r) {
          b.x = r;
          b.vx = Math.abs(b.vx) * 0.85;
        } else if (b.x > width - r) {
          b.x = width - r;
          b.vx = -Math.abs(b.vx) * 0.85;
        }
        if (b.y < r) {
          b.y = r;
          b.vy = Math.abs(b.vy) * 0.85;
        } else if (b.y > height - r) {
          b.y = height - r;
          b.vy = -Math.abs(b.vy) * 0.85;
        }
      }

      // Bubble-to-bubble bounces.
      for (let i = 0; i < list.length; i++) {
        for (let j = i + 1; j < list.length; j++) {
          const a = list[i];
          const b = list[j];
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const d = Math.hypot(dx, dy) || 0.01;
          const overlap = r * 2 - d;
          if (overlap <= 0) continue;
          const nx = dx / d;
          const ny = dy / d;
          const aFixed = i === dragging;
          const bFixed = j === dragging;
          const share = aFixed || bFixed ? 1 : 0.5;
          const rel = (b.vx - a.vx) * nx + (b.vy - a.vy) * ny;
          const impulse = rel < 0 ? -rel * 0.9 : 0;
          if (!aFixed) {
            a.x -= nx * overlap * share;
            a.y -= ny * overlap * share;
            a.vx -= nx * impulse;
            a.vy -= ny * impulse;
          }
          if (!bFixed) {
            b.x += nx * overlap * share;
            b.y += ny * overlap * share;
            b.vx += nx * impulse;
            b.vy += ny * impulse;
          }
        }
      }

      paint();
      if (visible) frame = requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      cancelAnimationFrame(frame);
      if (visible) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    });
    observer.observe(el);

    const resize = new ResizeObserver(() => {
      width = el.clientWidth;
      height = el.clientHeight;
    });
    resize.observe(el);

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      resize.disconnect();
    };
  }, []);

  function local(e: React.PointerEvent) {
    const r = box.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  }

  function onBubbleDown(index: number, e: React.PointerEvent) {
    const { x, y } = local(e);
    box.current?.setPointerCapture(e.pointerId);
    drag.current = {
      index,
      id: e.pointerId,
      startX: x,
      startY: y,
      moved: 0,
      lastX: x,
      lastY: y,
      lastT: performance.now(),
    };
  }

  function onMove(e: React.PointerEvent) {
    const { x, y } = local(e);
    pointer.current = { x, y, mouse: e.pointerType === "mouse" };
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    const b = bodies.current[d.index];
    const now = performance.now();
    const dt = Math.max(1, now - d.lastT) / 16.67;
    b.vx = (x - d.lastX) / dt;
    b.vy = (y - d.lastY) / dt;
    b.x = x;
    b.y = y;
    d.moved = Math.max(d.moved, Math.hypot(x - d.startX, y - d.startY));
    d.lastX = x;
    d.lastY = y;
    d.lastT = now;
  }

  function onUp(e: React.PointerEvent) {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    if (d.moved < TAP_SLOP) {
      choose(d.index);
    } else {
      const b = bodies.current[d.index];
      b.vx = Math.max(-30, Math.min(30, b.vx));
      b.vy = Math.max(-30, Math.min(30, b.vy));
    }
  }

  return (
    <div className="relative">
      <div
        ref={box}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerCancel={onUp}
        onPointerLeave={() => (pointer.current = null)}
        className="relative h-[22rem] touch-pan-y overflow-hidden rounded-[2rem] border-[3px] border-slate-900 bg-gradient-to-br from-indigo-950 via-violet-950 to-slate-950 shadow-[6px_6px_0_#0f172a] sm:h-[26rem]"
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.35)_1px,transparent_1.5px)] [background-size:22px_22px]"
        />
        {GAMES.map((game, i) => (
          <button
            key={game.slug}
            ref={(node) => {
              bubbles.current[i] = node;
            }}
            type="button"
            aria-label={`${game.title}: show this game`}
            onPointerDown={(e) => onBubbleDown(i, e)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                choose(i);
              }
            }}
            className={`absolute left-0 top-0 grid h-[60px] w-[60px] cursor-grab touch-none select-none place-items-center rounded-full border-2 border-white/25 bg-white/10 text-3xl shadow-[0_10px_30px_-10px_rgba(0,0,0,0.6),inset_0_2px_0_rgba(255,255,255,0.25)] backdrop-blur-sm transition-[opacity,box-shadow,border-color] duration-300 will-change-transform hover:border-white/60 active:cursor-grabbing sm:h-[76px] sm:w-[76px] sm:text-4xl ${
              ready ? "opacity-100" : "opacity-0"
            } ${
              selected?.slug === game.slug
                ? "border-yellow-300 shadow-[0_0_0_4px_rgba(253,224,71,0.45),0_10px_30px_-10px_rgba(0,0,0,0.6)]"
                : ""
            }`}
          >
            <span
              data-motion={logoMotion(game.slug)}
              className="game-logo pointer-events-none block"
            >
              {game.emoji}
            </span>
          </button>
        ))}

        <button
          type="button"
          onClick={shake}
          className="absolute right-3 top-3 z-10 inline-flex items-center gap-1.5 rounded-full border-2 border-slate-900 bg-yellow-300 px-3 py-1.5 text-xs font-black uppercase tracking-wider text-slate-900 shadow-[3px_3px_0_#0f172a] transition-transform active:scale-95"
        >
          <Wind className="h-3.5 w-3.5" aria-hidden />
          Shake
        </button>

        {selected ? (
          <div
            key={selected.slug}
            className="absolute inset-x-3 bottom-3 z-10 flex animate-pop-in items-center gap-3 rounded-2xl border-2 border-slate-900 bg-white p-3 text-slate-900 shadow-[4px_4px_0_#0f172a] sm:mx-auto sm:w-[28rem]"
          >
            <span className="text-3xl" aria-hidden>
              {selected.emoji}
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate font-black">{selected.title}</p>
              <p className="truncate text-xs font-semibold text-slate-600">
                {selected.players} · {selected.time}
              </p>
            </div>
            <ConfettiLink
              href={selected.href}
              className="inline-flex shrink-0 items-center gap-1 rounded-full border-2 border-slate-900 bg-lime-300 px-3 py-1.5 text-sm font-extrabold"
            >
              Play
              <ArrowRight className="h-4 w-4" aria-hidden />
            </ConfettiLink>
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Close"
              className="grid h-8 w-8 shrink-0 place-items-center rounded-full hover:bg-slate-100"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
