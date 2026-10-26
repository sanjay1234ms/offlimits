"use client";

import { useEffect, useState } from "react";

export interface HubTool {
  id: string;
  title: string;
  emoji: string;
  tag: string;
  gradient: string;
  /** Shown as a small badge, e.g. "18+" or "Multi-phone". */
  badge?: string;
  node: React.ReactNode;
}

/** Game picker for event pages: colourful tiles up top, the chosen game
 * below. The last choice is remembered per page. */
export function PlayHub({ tools, storageKey, heading = "Play now" }: { tools: HubTool[]; storageKey: string; heading?: string }) {
  const [active, setActive] = useState(tools[0]?.id);

  // A #play-<id> link (from the catalog) opens that game and scrolls to it;
  // otherwise restore the last pick.
  useEffect(() => {
    function fromHash() {
      const id = window.location.hash.match(/^#play-([\w-]+)$/)?.[1];
      if (!id || !tools.some((t) => t.id === id)) return false;
      setActive(id);
      document.getElementById("play")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return true;
    }
    if (!fromHash()) {
      try {
        const saved = localStorage.getItem(storageKey);
        if (saved && tools.some((t) => t.id === saved)) setActive(saved);
      } catch {
        /* ignore */
      }
    }
    window.addEventListener("hashchange", fromHash);
    return () => window.removeEventListener("hashchange", fromHash);
  }, [storageKey, tools]);

  function choose(id: string) {
    setActive(id);
    try {
      localStorage.setItem(storageKey, id);
    } catch {
      /* ignore */
    }
  }

  const tool = tools.find((t) => t.id === active) ?? tools[0];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-end justify-between gap-3">
        <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{heading}</h2>
        <span className="text-xs font-bold text-muted">{tools.length} games · free</span>
      </div>
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-4">
        {tools.map((t) => {
          const on = t.id === tool.id;
          return (
            <button
              key={t.id}
              type="button"
              onClick={() => choose(t.id)}
              aria-pressed={on}
              className={`group relative flex min-h-[7.5rem] flex-col justify-between overflow-hidden rounded-3xl bg-gradient-to-br p-4 text-left text-white transition-all duration-300 ${t.gradient} ${
                on ? "scale-[1.02] shadow-[0_18px_40px_-14px_rgba(236,72,153,0.7)] ring-4 ring-white/70" : "opacity-80 hover:-translate-y-1 hover:opacity-100"
              }`}
            >
              <span aria-hidden className="absolute -bottom-4 -right-2 text-7xl opacity-25 transition-transform duration-500 group-hover:-rotate-12 group-hover:scale-110">
                {t.emoji}
              </span>
              <span className="flex items-start justify-between gap-1">
                <span className="text-3xl">{t.emoji}</span>
                {t.badge ? <span className="whitespace-nowrap rounded-full bg-black/35 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider sm:text-[10px]">{t.badge}</span> : null}
              </span>
              <span className="relative">
                <span className="block text-base font-black leading-tight">{t.title}</span>
                <span className="block text-[11px] font-semibold text-white/85">{t.tag}</span>
              </span>
            </button>
          );
        })}
      </div>
      <div key={tool.id} className="motion-safe:animate-fade-up">
        {tool.node}
      </div>
    </div>
  );
}
