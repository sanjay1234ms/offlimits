"use client";

import { useRef } from "react";
import { Dices } from "lucide-react";
import { sfx } from "@/lib/audio";
import { haptic, HAPTIC } from "@/lib/haptics";

/** "Pick one for me" button for a printed list: jumps to a random item in
 * the list inside #target and lights it up, so a list page plays like a
 * game. */
export function RandomPick({ target }: { target: string }) {
  const last = useRef<HTMLElement | null>(null);

  function pick() {
    const items = Array.from(
      document.querySelectorAll<HTMLElement>(`#${target} li`),
    );
    if (items.length === 0) return;
    let item = items[Math.floor(Math.random() * items.length)];
    if (item === last.current && items.length > 1) {
      item = items[(items.indexOf(item) + 1) % items.length];
    }
    last.current?.classList.remove("random-picked");
    // Restart the highlight animation on the new item.
    item.classList.remove("random-picked");
    void item.offsetWidth;
    item.classList.add("random-picked");
    last.current = item;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    item.scrollIntoView({
      behavior: reduced ? "auto" : "smooth",
      block: "center",
    });
    sfx.flip();
    haptic(HAPTIC.advance);
  }

  return (
    <button
      type="button"
      onClick={pick}
      className="group mt-3 inline-flex items-center gap-2 rounded-full border-2 border-slate-900 bg-lime-300 px-4 py-2 text-sm font-extrabold text-slate-900 shadow-[3px_3px_0_#0f172a] transition-[transform,box-shadow] hover:-translate-y-0.5 hover:shadow-[5px_5px_0_#0f172a] active:translate-y-0.5 active:shadow-[1px_1px_0_#0f172a]"
    >
      <Dices
        className="h-4 w-4 transition-transform duration-500 group-hover:rotate-180"
        aria-hidden
      />
      Pick a random one
    </button>
  );
}
