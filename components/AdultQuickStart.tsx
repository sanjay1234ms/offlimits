"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { track } from "@/lib/analytics";

const STARTS = [
  { emoji: "🔥", title: "Dirty truth or dare", line: "Flirty truths, bold dares", href: "/play?game=truth_or_dare&adult=1" },
  { emoji: "🙊", title: "Never Have I Ever after dark", line: "Fingers down, stories out", href: "/play?game=never_have_i_ever&adult=1" },
  { emoji: "👉", title: "Most Likely To, no filter", line: "Point on three", href: "/play?game=most_likely_to&adult=1" },
] as const;

/** One-tap starts right under the 18+ hero, so visitors can be playing in a
 * second instead of reading first. Each opens the 18+ pack of that game. */
export function AdultQuickStart() {
  return (
    <div className="rounded-3xl border-2 border-rose-500/40 bg-rose-500/[0.06] p-4 sm:p-5">
      <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-rose-400">Start playing in one tap</p>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        {STARTS.map((s) => (
          <Link
            key={s.href}
            href={s.href}
            onClick={() => track("adult_quick_start", { game: s.title })}
            className="group flex items-center gap-3 rounded-2xl border-2 border-border bg-surface/70 px-4 py-3 transition-[transform,border-color] duration-200 hover:-translate-y-0.5 hover:border-rose-500"
          >
            <span className="text-3xl" aria-hidden>{s.emoji}</span>
            <span className="flex-1">
              <span className="block font-extrabold text-foreground">{s.title}</span>
              <span className="block text-xs text-muted">{s.line}</span>
            </span>
            <ArrowRight className="h-4 w-4 text-rose-400 transition-transform group-hover:translate-x-0.5" aria-hidden />
          </Link>
        ))}
      </div>
    </div>
  );
}
