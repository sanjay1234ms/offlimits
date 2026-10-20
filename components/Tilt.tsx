"use client";

import { useEffect, useRef } from "react";

interface TiltProps {
  children: React.ReactNode;
  className?: string;
  /** Maximum tilt, in degrees. */
  max?: number;
}

/** Tilts its children in 3D toward a mouse pointer, with a soft glare that
 * follows it and logos (.logo-depth-*) that shift for a sense of depth. Touch and reduced-motion users get a plain, static card. */
export function Tilt({ children, className = "", max = 8 }: TiltProps) {
  const ref = useRef<HTMLDivElement>(null);
  const frame = useRef(0);
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current = !window.matchMedia("(prefers-reduced-motion: reduce)")
      .matches;
    return () => cancelAnimationFrame(frame.current);
  }, []);

  // Touch screens have no hover, so play the card's logo animation once as
  // it scrolls into view instead.
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    if (!window.matchMedia("(hover: none)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let timeout = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timeout = window.setTimeout(() => {
          el.classList.add("logo-play");
          timeout = window.setTimeout(
            () => el.classList.remove("logo-play"),
            1600,
          );
        }, 250);
      },
      { threshold: 0.6 },
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
    };
  }, []);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    const el = ref.current;
    if (!el || !enabled.current || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${((0.5 - y) * max).toFixed(2)}deg`);
      el.style.setProperty("--ry", `${((x - 0.5) * max).toFixed(2)}deg`);
      el.style.setProperty("--gx", `${(x * 100).toFixed(1)}%`);
      el.style.setProperty("--gy", `${(y * 100).toFixed(1)}%`);
      el.style.setProperty("--px", (x - 0.5).toFixed(3));
      el.style.setProperty("--py", (y - 0.5).toFixed(3));
      el.dataset.tilting = "true";
    });
  }

  function onLeave() {
    const el = ref.current;
    if (!el) return;
    cancelAnimationFrame(frame.current);
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.style.setProperty("--px", "0");
    el.style.setProperty("--py", "0");
    delete el.dataset.tilting;
  }

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className={`tilt ${className}`}
    >
      {children}
      <span aria-hidden className="tilt-glare" />
    </div>
  );
}
