"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ADULT_STATE_EVENT,
  FREE_ADULT_LIMIT,
  checkIs18PlusUnlocked,
  readPreviewIds,
  writePreviewIds,
} from "@/lib/monetization";
import { usePartyPass } from "./usePartyPass";

export interface AdultPreview {
  hydrated: boolean;
  /** True while the global 24-Hour Party Pass is active. */
  unlocked: boolean;
  /** Distinct 18+ items previewed for free so far. */
  used: number;
  cap: number;
  remaining: number;
  /**
   * Records a preview of one 18+ item, keyed by a stable token (a card id, or
   * a fresh id per suggestion draw). Idempotent per token, re-showing an
   * already-previewed item never costs another slot. Returns false when the
   * free budget is spent (the caller should open the paywall).
   */
  consume: (token: string) => boolean;
  paywallOpen: boolean;
  openPaywall: () => void;
  closePaywall: () => void;
  /** Activate the global Party Pass (from the paywall's unlock callback). */
  unlock: () => void;
}

/** Shared, localStorage-backed 18+ preview budget. `unlocked` reads the global
 * Party Pass, so activating anywhere lifts the cap everywhere and an expired
 * pass reverts every surface to the 3-item preview. */
export function useAdultPreview(): AdultPreview {
  const pass = usePartyPass();
  const [used, setUsed] = useState(0);
  const [paywallOpen, setPaywallOpen] = useState(false);

  useEffect(() => {
    function sync() {
      setUsed(readPreviewIds().length);
    }
    sync();
    window.addEventListener("focus", sync);
    window.addEventListener("storage", sync);
    window.addEventListener(ADULT_STATE_EVENT, sync);
    return () => {
      window.removeEventListener("focus", sync);
      window.removeEventListener("storage", sync);
      window.removeEventListener(ADULT_STATE_EVENT, sync);
    };
  }, []);

  const cap = FREE_ADULT_LIMIT;

  const consume = useCallback(
    (token: string): boolean => {
      if (checkIs18PlusUnlocked()) return true;
      const ids = readPreviewIds();
      if (ids.includes(token)) return true;
      if (ids.length >= cap) {
        setUsed(ids.length);
        return false;
      }
      const next = [...ids, token];
      writePreviewIds(next);
      setUsed(next.length);
      return true;
    },
    [cap],
  );

  const openPaywall = useCallback(() => setPaywallOpen(true), []);
  const closePaywall = useCallback(() => setPaywallOpen(false), []);

  const { activate } = pass;
  const unlock = useCallback(() => {
    activate();
    setPaywallOpen(false);
  }, [activate]);

  return {
    hydrated: pass.hydrated,
    unlocked: pass.active,
    used,
    cap,
    remaining: Math.max(0, cap - used),
    consume,
    paywallOpen,
    openPaywall,
    closePaywall,
    unlock,
  };
}
