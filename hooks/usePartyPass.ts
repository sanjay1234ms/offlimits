"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ADULT_STATE_EVENT,
  activatePartyPass,
  clearPartyPass,
  readPartyPass,
} from "@/lib/monetization";

function formatRemaining(ms: number): string {
  if (ms <= 0) return "expired";
  const minutes = Math.floor(ms / 60_000);
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h >= 1) return `${h}h ${m}m left`;
  if (m >= 1) return `${m}m left`;
  return "under 1m left";
}

export interface PartyPass {
  hydrated: boolean;
  /** True only while a valid, non-expired 24-hour pass is active. */
  active: boolean;
  expiresAt: number | null;
  remainingMs: number;
  remainingLabel: string;
  /** Activate the 24-hour pass (checkout success / access code). */
  activate: () => void;
  /** End the pass now. */
  clear: () => void;
}

/**
 * The single source of truth for the global 24-Hour Party Pass. Ticks every
 * 30s so the countdown updates and an expired pass auto-invalidates, and
 * re-syncs across tabs / same-tab hook instances via events.
 */
export function usePartyPass(): PartyPass {
  const [hydrated, setHydrated] = useState(false);
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const sync = useCallback(() => {
    const record = readPartyPass();
    setExpiresAt(record ? record.expiresAt : null);
    setNow(Date.now());
  }, []);

  useEffect(() => {
    sync();
    setHydrated(true);
    const id = window.setInterval(sync, 30_000);
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    window.addEventListener(ADULT_STATE_EVENT, sync);
    return () => {
      window.clearInterval(id);
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADULT_STATE_EVENT, sync);
    };
  }, [sync]);

  const activate = useCallback(() => {
    activatePartyPass();
    sync();
  }, [sync]);

  const clear = useCallback(() => {
    clearPartyPass();
    sync();
  }, [sync]);

  const remainingMs = expiresAt ? Math.max(0, expiresAt - now) : 0;
  const active = !!expiresAt && remainingMs > 0;

  return {
    hydrated,
    active,
    expiresAt: active ? expiresAt : null,
    remainingMs,
    remainingLabel: formatRemaining(remainingMs),
    activate,
    clear,
  };
}
