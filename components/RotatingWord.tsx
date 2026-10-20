"use client";

import { useEffect, useState } from "react";

const WORDS = [
  "house parties",
  "game night",
  "office parties",
  "date night",
  "road trips",
  "sleepovers",
  "Zoom calls",
  "pre-drinks",
];

/** "Perfect for ___" line whose last words flip through party types. */
export function RotatingWord() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        setIndex((i) => (i + 1) % WORDS.length);
      }
    }, 2200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="text-lg font-extrabold text-foreground sm:text-xl">
      Perfect for{" "}
      <span className="relative inline-block overflow-hidden align-bottom [perspective:400px]">
        <span
          key={index}
          className="inline-block animate-word-flip bg-gradient-to-r from-lime-600 via-amber-500 to-pink-600 dark:from-lime-300 dark:via-yellow-300 dark:to-pink-400 bg-clip-text text-transparent"
        >
          {WORDS[index]}
        </span>
      </span>
    </p>
  );
}
