/** Tiny Web Audio synth, no asset files. Every effect respects the global
 * mute toggle (`offlimits_effects_muted` in localStorage). */

export const EFFECTS_MUTED_KEY = "offlimits_effects_muted";
export const EFFECTS_EVENT = "offlimits:effects";

export function areEffectsMuted(): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(EFFECTS_MUTED_KEY) === "true";
  } catch {
    return false;
  }
}

export function setEffectsMuted(muted: boolean): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(EFFECTS_MUTED_KEY, String(muted));
    window.dispatchEvent(new Event(EFFECTS_EVENT));
  } catch {
    /* ignore */
  }
}

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    try {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctor) return null;
      ctx = new Ctor();
    } catch {
      return null;
    }
  }
  if (ctx.state === "suspended") void ctx.resume().catch(() => {});
  return ctx;
}

function tone(
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.14,
  delay = 0,
): void {
  const c = getCtx();
  if (!c || areEffectsMuted()) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

export const sfx = {
  flip: () => {
    tone(440, 0.07, "triangle", 0.1);
    tone(660, 0.06, "triangle", 0.07, 0.045);
  },
  tick: (urgency = 0) =>
    tone(760 + urgency * 260, 0.035, "square", 0.05 + urgency * 0.02),
  buzzer: () => {
    tone(150, 0.45, "sawtooth", 0.2);
    tone(115, 0.5, "sawtooth", 0.16, 0.03);
  },
  spin: () => {
    for (let i = 0; i < 14; i++) {
      tone(280 + i * 26, 0.045, "square", 0.045, i * 0.05);
    }
  },
  forfeit: () => {
    tone(523, 0.1, "triangle", 0.12);
    tone(392, 0.12, "triangle", 0.12, 0.1);
    tone(659, 0.16, "triangle", 0.14, 0.22);
  },
  win: () => {
    [523, 659, 784, 1047].forEach((f, i) =>
      tone(f, 0.14, "triangle", 0.12, i * 0.09),
    );
  },
};

/** Nudge the AudioContext awake from a user gesture so later effects play. */
export function primeAudio(): void {
  getCtx();
}
