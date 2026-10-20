"use client";

import { useEffect, useRef } from "react";

/** A soft glow that follows the mouse around its parent section. Renders
 * nothing visible for touch or reduced-motion visitors. */
export function HeroSpotlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    const parent = el?.parentElement;
    if (!el || !parent) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame = 0;
    function onMove(e: PointerEvent) {
      if (e.pointerType !== "mouse" || !el || !parent) return;
      const r = parent.getBoundingClientRect();
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
        el.style.opacity = "1";
      });
    }
    function onLeave() {
      if (el) el.style.opacity = "0";
    }
    parent.addEventListener("pointermove", onMove);
    parent.addEventListener("pointerleave", onLeave);
    return () => {
      cancelAnimationFrame(frame);
      parent.removeEventListener("pointermove", onMove);
      parent.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden
      style={{ opacity: 0 }}
      className="pointer-events-none absolute inset-0 transition-opacity duration-500 [background:radial-gradient(32rem_circle_at_var(--sx,50%)_var(--sy,50%),rgba(163,230,53,0.12),rgba(244,114,182,0.08)_40%,transparent_70%)]"
    />
  );
}
