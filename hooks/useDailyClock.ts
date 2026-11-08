"use client";

import { useEffect, useState } from "react";
import { dayIndex, msUntilNext } from "@/lib/daily";

/** Today's puzzle day and time left, known only after mount (the server
 * can't know the player's date). Rolls over at local midnight. */
export function useDailyClock(tickMs = 30_000): { day: number | null; msLeft: number } {
  const [state, setState] = useState<{ day: number | null; msLeft: number }>({
    day: null,
    msLeft: 0,
  });
  useEffect(() => {
    const update = () => setState({ day: dayIndex(), msLeft: msUntilNext() });
    update();
    const id = window.setInterval(update, tickMs);
    return () => window.clearInterval(id);
  }, [tickMs]);
  return state;
}
