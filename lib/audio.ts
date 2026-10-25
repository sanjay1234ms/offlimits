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

/** A pitch glide, for thumps, boings and wah-wahs. */
function sweep(
  from: number,
  to: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.16,
  delay = 0,
): void {
  const c = getCtx();
  if (!c || areEffectsMuted()) return;
  const t = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(from, t);
  osc.frequency.exponentialRampToValueAtTime(Math.max(1, to), t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(c.destination);
  osc.start(t);
  osc.stop(t + dur + 0.03);
}

let noiseBuf: AudioBuffer | null = null;

/** Filtered white noise: crunches, snips, rustles and whooshes. */
function noise(
  dur: number,
  gain: number,
  filter: BiquadFilterType,
  freq: number,
  delay = 0,
  freqTo?: number,
): void {
  const c = getCtx();
  if (!c || areEffectsMuted()) return;
  if (!noiseBuf) {
    noiseBuf = c.createBuffer(1, c.sampleRate, c.sampleRate);
    const d = noiseBuf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  const t = c.currentTime + delay;
  const src = c.createBufferSource();
  src.buffer = noiseBuf;
  const f = c.createBiquadFilter();
  f.type = filter;
  f.frequency.setValueAtTime(freq, t);
  if (freqTo) f.frequency.exponentialRampToValueAtTime(freqTo, t + dur);
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(c.destination);
  src.start(t);
  src.stop(t + dur + 0.03);
}

/** Rock Paper Scissors sound set. */
export const rpsSfx = {
  /** Countdown drum hit; beat 0, 1, 2 rises in pitch. */
  beat: (n: number) => {
    sweep(150 + n * 30, 55, 0.22, "sine", 0.32);
    noise(0.05, 0.08, "highpass", 2500);
  },
  shoot: () => {
    noise(0.28, 0.12, "bandpass", 600, 0, 3000);
    [523, 784, 1047].forEach((f) => tone(f, 0.22, "triangle", 0.08, 0.04));
  },
  /** Rock smashes scissors: boom, crunch, falling debris. */
  smash: () => {
    sweep(130, 38, 0.5, "sine", 0.45);
    noise(0.35, 0.3, "lowpass", 1200, 0, 200);
    for (let i = 0; i < 6; i++) tone(1800 + Math.random() * 1600, 0.04, "square", 0.03, 0.12 + i * 0.07);
  },
  /** Scissors cut paper: snip-snip with a metallic ring. */
  snip: () => {
    [0, 0.13, 0.26].forEach((d) => {
      noise(0.05, 0.22, "bandpass", 5200, d);
      tone(2600, 0.09, "triangle", 0.05, d + 0.01);
    });
    noise(0.35, 0.08, "highpass", 1800, 0.36, 4000);
  },
  /** Paper covers rock: a papery rustle and soft whoosh. */
  wrap: () => {
    noise(0.4, 0.14, "highpass", 1400, 0, 3500);
    noise(0.25, 0.09, "bandpass", 900, 0.15);
    sweep(220, 330, 0.3, "sine", 0.06, 0.2);
  },
  /** Draw: cartoon boing. */
  boing: () => {
    sweep(180, 520, 0.12, "sine", 0.2);
    sweep(520, 240, 0.28, "sine", 0.16, 0.12);
  },
  roundWin: () => {
    [659, 784, 988].forEach((f, i) => tone(f, 0.13, "triangle", 0.12, i * 0.08));
  },
  /** Wah-wah, for losing a round. */
  roundLose: () => {
    sweep(330, 290, 0.22, "sawtooth", 0.07);
    sweep(290, 220, 0.38, "sawtooth", 0.07, 0.22);
  },
  matchWin: () => {
    [523, 659, 784, 1047, 784, 1047].forEach((f, i) => tone(f, i === 5 ? 0.45 : 0.13, "triangle", 0.13, i * 0.11));
  },
  /** Sad trombone. */
  matchLose: () => {
    [392, 370, 349].forEach((f, i) => sweep(f, f * 0.97, 0.3, "sawtooth", 0.07, i * 0.32));
    sweep(330, 250, 0.8, "sawtooth", 0.07, 0.96);
  },
  /** Throw button tap. */
  pop: () => {
    sweep(420, 900, 0.07, "sine", 0.12);
  },
};

/** Nudge the AudioContext awake from a user gesture so later effects play. */
export function primeAudio(): void {
  getCtx();
}
