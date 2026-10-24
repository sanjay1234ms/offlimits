"use client";

import { useEffect, useRef } from "react";

const ROWS = [
  "PLAY · LAUGH · REPEAT · SPILL THE TEA · ",
  "DARE · DEFEND IT · POINT AT SOMEONE · NO TAKEBACKS · ",
];

/** Two rows of giant outlined words that slide in opposite directions as the
 * page scrolls. Decorative; static for reduced-motion users. */
export function ScrollWords() {
  const wrap = useRef<HTMLDivElement>(null);
  const rows = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let frame = 0;
    let visible = false;

    const update = () => {
      frame = 0;
      const el = wrap.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      // -1 when the band enters at the bottom, +1 when it leaves at the top.
      const t = 1 - (r.top + r.height) / (window.innerHeight + r.height);
      const shift = (t - 0.5) * 2 * 260;
      rows.current.forEach((row, i) => {
        if (row) row.style.transform = `translate3d(${i % 2 ? -shift - 400 : shift - 400}px,0,0)`;
      });
    };
    const onScroll = () => {
      if (visible && !frame) frame = requestAnimationFrame(update);
    };
    const io = new IntersectionObserver(([e]) => {
      visible = e.isIntersecting;
      if (visible) update();
    });
    if (wrap.current) io.observe(wrap.current);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <div ref={wrap} aria-hidden className="pointer-events-none select-none overflow-hidden py-6 sm:py-10">
      {ROWS.map((text, i) => (
        <div
          key={i}
          ref={(el) => {
            rows.current[i] = el;
          }}
          className={`scroll-words whitespace-nowrap text-6xl font-black leading-[1.05] tracking-tight will-change-transform sm:text-8xl lg:text-9xl ${
            i % 2 ? "scroll-words--accent" : ""
          }`}
          style={{ transform: "translate3d(-400px,0,0)" }}
        >
          {text.repeat(4)}
        </div>
      ))}
    </div>
  );
}
