import { areEffectsMuted } from "./audio";

/** Vibrate on supported devices. Silenced by the same toggle as the audio. */
export function haptic(pattern: number | number[]): void {
  if (typeof navigator === "undefined" || typeof navigator.vibrate !== "function")
    return;
  if (areEffectsMuted()) return;
  try {
    navigator.vibrate(pattern);
  } catch {
    /* ignore */
  }
}

export const HAPTIC = {
  advance: [30] as number[],
  buzzer: [50, 50, 100] as number[],
  forfeit: [40, 30, 60] as number[],
};
