"use client";

import { useCallback, useEffect, useState } from "react";

type Updater<T> = T | ((prev: T) => T);

/**
 * SSR-safe localStorage state. Renders `initialValue` on the server and the
 * first client paint, then swaps in the stored value once mounted. The third
 * tuple item, `hydrated`, is false until that read has happened, use it to
 * avoid flashing gated UI (e.g. a paywall) at users who have already paid.
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): readonly [T, (value: Updater<T>) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* storage unavailable or malformed, keep the default */
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (next: Updater<T>) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function"
            ? (next as (p: T) => T)(prev)
            : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignore write failures (private mode, quota) */
        }
        return resolved;
      });
    },
    [key],
  );

  return [value, set, hydrated] as const;
}
