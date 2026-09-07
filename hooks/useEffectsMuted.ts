"use client";

import { useCallback, useEffect, useState } from "react";
import { EFFECTS_EVENT, areEffectsMuted, setEffectsMuted } from "@/lib/audio";

/** Reactive view of the global sound/haptics mute toggle. */
export function useEffectsMuted() {
  const [muted, setMuted] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const sync = () => setMuted(areEffectsMuted());
    sync();
    setHydrated(true);
    window.addEventListener(EFFECTS_EVENT, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(EFFECTS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const toggle = useCallback(() => {
    setEffectsMuted(!areEffectsMuted());
  }, []);

  return { muted, hydrated, toggle };
}
