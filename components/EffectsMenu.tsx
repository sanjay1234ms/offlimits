"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Palette, Volume2, VolumeX } from "lucide-react";
import { useEffectsMuted } from "@/hooks/useEffectsMuted";
import {
  PARTY_THEMES,
  applyPartyTheme,
  readPartyTheme,
  type PartyThemeId,
} from "@/lib/partyTheme";
import { primeAudio, sfx } from "@/lib/audio";

/** Header control: sound/haptics mute plus the party-theme skins. */
export function EffectsMenu() {
  const { muted, hydrated, toggle } = useEffectsMuted();
  const [open, setOpen] = useState(false);
  const [theme, setTheme] = useState<PartyThemeId>("default");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTheme(readPartyTheme());
  }, []);

  useEffect(() => {
    if (!open) return;
    function onDown(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function pickTheme(id: PartyThemeId) {
    setTheme(id);
    applyPartyTheme(id);
  }

  function onToggleMute() {
    const wasMuted = muted;
    toggle();
    // Give instant feedback when turning sound back on.
    if (wasMuted) {
      primeAudio();
      window.setTimeout(() => sfx.flip(), 0);
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Sound and theme settings"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border-strong text-foreground transition-colors hover:bg-surface"
      >
        {!hydrated ? (
          <span className="h-4 w-4" />
        ) : muted ? (
          <VolumeX className="h-4 w-4" aria-hidden />
        ) : (
          <Volume2 className="h-4 w-4" aria-hidden />
        )}
      </button>

      {open ? (
        <div className="absolute right-0 top-11 z-50 w-60 rounded-2xl border border-white/10 bg-surface/95 p-3 shadow-[0_20px_50px_-15px_rgba(0,0,0,0.6)] backdrop-blur-xl">
          <button
            type="button"
            onClick={onToggleMute}
            className="flex w-full items-center justify-between rounded-xl border border-border-strong px-3 py-2 text-sm font-bold text-foreground transition-colors hover:bg-white/5"
          >
            <span className="inline-flex items-center gap-2">
              {muted ? (
                <VolumeX className="h-4 w-4" aria-hidden />
              ) : (
                <Volume2 className="h-4 w-4" aria-hidden />
              )}
              Sound &amp; haptics
            </span>
            <span
              className={`text-xs ${muted ? "text-muted" : "text-emerald-400"}`}
            >
              {muted ? "Off" : "On"}
            </span>
          </button>

          <div className="mt-3">
            <p className="mb-1.5 inline-flex items-center gap-1.5 px-1 text-[0.7rem] font-bold uppercase tracking-wider text-subtle">
              <Palette className="h-3.5 w-3.5" aria-hidden />
              Party theme
            </p>
            <div className="flex flex-col gap-1">
              {PARTY_THEMES.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => pickTheme(t.id)}
                  className="flex items-center justify-between rounded-lg px-2.5 py-1.5 text-sm font-semibold text-foreground transition-colors hover:bg-white/5"
                >
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="h-3.5 w-3.5 rounded-full ring-1 ring-white/20"
                      style={{ backgroundColor: t.swatch }}
                      aria-hidden
                    />
                    {t.label}
                  </span>
                  {theme === t.id ? (
                    <Check className="h-4 w-4 text-accent" aria-hidden />
                  ) : null}
                </button>
              ))}
            </div>
            <p className="mt-1.5 px-1 text-[0.7rem] text-subtle">
              Skins apply in dark mode.
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}
