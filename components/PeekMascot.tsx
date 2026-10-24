"use client";

import { useEffect, useRef, useState } from "react";

const GREETINGS = ["hi!", "pick a game!", "boo 👀", "let's play", "no limits!", "hehe"];

/** A little pink blob peeking over the hero sticker. Its pupils follow the
 * pointer (or finger), it blinks now and then, and a tap makes it squish and
 * say something. Purely decorative, so it's hidden from assistive tech. */
export function PeekMascot() {
  const rootRef = useRef<HTMLButtonElement>(null);
  const pupils = useRef<(HTMLSpanElement | null)[]>([]);
  const [blink, setBlink] = useState(false);
  const [squish, setSquish] = useState(0);
  const [say, setSay] = useState<string | null>(null);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let frame = 0;
    let target = { x: 0, y: 0 };

    const aim = (clientX: number, clientY: number) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const dx = clientX - (r.left + r.width / 2);
      const dy = clientY - (r.top + r.height / 2);
      const len = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, len / 160);
      target = { x: (dx / len) * 3.5 * reach, y: (dy / len) * 3 * reach };
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        for (const p of pupils.current) {
          if (p) p.style.transform = `translate(${target.x}px, ${target.y}px)`;
        }
      });
    };

    const onMove = (e: PointerEvent) => aim(e.clientX, e.clientY);
    window.addEventListener("pointermove", onMove, { passive: true });

    // Idle wander + blinking so it feels alive on touch screens too.
    let blinkTimer = 0;
    const scheduleBlink = () => {
      blinkTimer = window.setTimeout(() => {
        setBlink(true);
        window.setTimeout(() => setBlink(false), 140);
        scheduleBlink();
      }, 2600 + Math.random() * 3000);
    };
    if (!reduce) scheduleBlink();

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(frame);
      window.clearTimeout(blinkTimer);
    };
  }, []);

  function poke() {
    setSquish((s) => s + 1);
    setSay(GREETINGS[Math.floor(Math.random() * GREETINGS.length)]);
    window.setTimeout(() => setSay(null), 1400);
  }

  return (
    <button
      ref={rootRef}
      type="button"
      tabIndex={-1}
      aria-hidden
      onClick={poke}
      className="peek-mascot absolute -right-3 -top-7 z-0 cursor-pointer sm:-top-11 sm:right-6"
    >
      {say ? (
        <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full border-2 border-slate-900 bg-white px-2 py-0.5 text-xs font-black text-slate-900 shadow-[2px_2px_0_#0f172a] motion-safe:animate-pop-in">
          {say}
        </span>
      ) : null}
      <span
        key={squish}
        className="relative block h-10 w-14 rounded-t-[2rem] border-[3px] border-slate-900 bg-pink-400 motion-safe:animate-[peek-squish_0.45s_cubic-bezier(0.34,1.56,0.64,1)] sm:h-14 sm:w-20"
      >
        {[0, 1].map((i) => (
          <span
            key={i}
            className={`absolute top-2 grid h-5 w-5 place-items-center overflow-hidden rounded-full border-2 border-slate-900 bg-white sm:top-3 sm:h-6 sm:w-6 ${
              i === 0 ? "left-1.5 sm:left-3" : "right-1.5 sm:right-3"
            }`}
          >
            <span
              ref={(el) => {
                pupils.current[i] = el;
              }}
              className="block h-2.5 w-2.5 rounded-full bg-slate-900 transition-transform duration-100 ease-out sm:h-3 sm:w-3"
            />
            <span
              className={`absolute inset-0 origin-top bg-pink-400 transition-transform duration-100 ${
                blink ? "scale-y-100" : "scale-y-0"
              }`}
            />
          </span>
        ))}
      </span>
    </button>
  );
}
