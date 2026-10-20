"use client";

import { useEffect, useRef } from "react";

/** Thin gradient bar along the bottom of the header showing how far down
 * the page the visitor has scrolled. Writes the transform directly so
 * scrolling never re-renders React. */
export function ScrollProgress() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    function update() {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const el = ref.current;
        if (!el) return;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        const p = max > 0 ? Math.min(1, window.scrollY / max) : 0;
        el.style.transform = `scaleX(${p})`;
      });
    }
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ transform: "scaleX(0)" }}
      className="pointer-events-none absolute inset-x-0 -bottom-px h-[3px] origin-left bg-gradient-to-r from-lime-300 via-yellow-300 to-pink-500"
    />
  );
}
