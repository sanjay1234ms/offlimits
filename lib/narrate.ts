/* The game narrator: the browser's speech synthesis, tuned to sound like a
 * storyteller. It picks the most natural voice on the device, speaks one
 * sentence at a time with dramatic pauses, and resolves when it's done, so
 * games can wait for the line to finish before moving on. Does nothing
 * (quickly) where speech isn't supported or the narrator is muted. */

let muted = false;
let voice: SpeechSynthesisVoice | null = null;
let run = 0;
const listeners = new Set<(speaking: boolean) => void>();

function supported(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** Higher is better: neural/natural voices first, robotic desktop voices last. */
function score(v: SpeechSynthesisVoice): number {
  const n = v.name;
  const lang = v.lang?.toLowerCase() ?? "";
  if (!lang.startsWith("en")) return -1000;
  let s = 0;
  if (/natural|neural/i.test(n)) s += 120;
  if (/online/i.test(n)) s += 40;
  if (/Google UK English Male/i.test(n)) s += 90;
  if (/Google UK English Female|Google US English/i.test(n)) s += 50;
  if (/\b(Daniel|Arthur|Ryan|Thomas|George|Guy|Davis|Andrew|Brian|Christopher|Eric|Oliver|Aaron|Gordon|Rishi)\b/i.test(n)) s += 45;
  if (/enhanced|premium|siri/i.test(n)) s += 60;
  if (/\b(Zira|David|Mark|Hazel|Susan|George Desktop)\b|Desktop/i.test(n)) s -= 80;
  if (/Albert|Bad News|Bahh|Bells|Boing|Bubbles|Cellos|Good News|Jester|Organ|Superstar|Trinoids|Whisper|Wobble|Zarvox|Fred|Junior|Ralph|Kathy|Princess/i.test(n)) s -= 200;
  if (lang === "en-gb") s += 25;
  else if (lang === "en-us") s += 15;
  else if (lang.startsWith("en-au") || lang.startsWith("en-ie")) s += 10;
  return s;
}

function pickVoice(): SpeechSynthesisVoice | null {
  if (!supported()) return null;
  const voices = window.speechSynthesis.getVoices();
  if (!voices.length) return null;
  return [...voices].sort((a, b) => score(b) - score(a))[0] ?? null;
}

if (supported()) {
  voice = pickVoice();
  window.speechSynthesis.addEventListener?.("voiceschanged", () => {
    voice = pickVoice();
  });
}

const wait = (ms: number) => new Promise<void>((r) => window.setTimeout(r, ms));

function setSpeaking(on: boolean) {
  listeners.forEach((fn) => fn(on));
}

/** Subscribe to speaking on/off (for a "narrator is talking" indicator). */
export function onSpeaking(fn: (speaking: boolean) => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function narrationSupported(): boolean {
  return supported();
}

export function narratorVoiceName(): string | null {
  voice = voice ?? pickVoice();
  return voice?.name ?? null;
}

export function setNarrationMuted(m: boolean) {
  muted = m;
  if (m) stopNarration();
}

export function isNarrationMuted(): boolean {
  return muted;
}

/** Break a line into sentences so each gets its own breath. */
function sentences(text: string): string[] {
  return (text.match(/[^.!?…]+[.!?…]+["”’)]*|[^.!?…]+$/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}

function speakOne(text: string, id: number): Promise<void> {
  return new Promise((resolve) => {
    if (id !== run) return resolve();
    const synth = window.speechSynthesis;
    const u = new SpeechSynthesisUtterance(text);
    voice = voice ?? pickVoice();
    if (voice) {
      u.voice = voice;
      u.lang = voice.lang;
    }
    const natural = voice ? /natural|neural|online|google|enhanced|premium/i.test(voice.name) : false;
    u.rate = natural ? 0.92 : 0.88;
    u.pitch = natural ? 0.95 : 0.9;
    u.volume = 1;
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      window.clearTimeout(guard);
      resolve();
    };
    // Some browsers never fire onend; don't let the game hang.
    const guard = window.setTimeout(finish, 1500 + text.split(/\s+/).length * 520);
    u.onend = finish;
    u.onerror = finish;
    synth.speak(u);
    // Chrome pauses long queues in background tabs; nudge it.
    if (synth.paused) synth.resume();
  });
}

/**
 * Speak one or more lines, sentence by sentence, with pauses between them.
 * Interrupts anything already being said. Resolves when finished (or right
 * away, after a short beat, when muted/unsupported) so callers can await it.
 */
export async function say(lines: string | string[], opts: { pause?: number; linePause?: number } = {}): Promise<void> {
  const id = ++run;
  const list = (Array.isArray(lines) ? lines : [lines]).filter(Boolean);
  if (!list.length) return;
  if (muted || !supported()) {
    await wait(400);
    return;
  }
  const synth = window.speechSynthesis;
  synth.cancel();
  await wait(60);
  setSpeaking(true);
  try {
    for (let li = 0; li < list.length; li++) {
      const parts = sentences(list[li]);
      for (let k = 0; k < parts.length; k++) {
        if (id !== run) return;
        await speakOne(parts[k], id);
        if (id !== run) return;
        if (k < parts.length - 1) await wait(opts.pause ?? 380);
      }
      if (li < list.length - 1) await wait(opts.linePause ?? 750);
    }
  } finally {
    if (id === run) setSpeaking(false);
  }
}

/** Fire-and-forget version of {@link say}. */
export function narrate(lines: string | string[]) {
  void say(lines);
}

export function stopNarration() {
  run++;
  setSpeaking(false);
  if (supported()) window.speechSynthesis.cancel();
}

/** iOS only allows speech that starts from a tap: call this inside one. */
export function primeNarration() {
  if (!supported() || muted) return;
  const u = new SpeechSynthesisUtterance(" ");
  u.volume = 0;
  window.speechSynthesis.speak(u);
}

const VOICE_KEY = "ol-narrator-voice";

/** English voices on this device, best first. */
export function listVoices(): { name: string; lang: string; good: boolean }[] {
  if (!supported()) return [];
  return window.speechSynthesis
    .getVoices()
    .filter((v) => v.lang?.toLowerCase().startsWith("en") && score(v) > -150)
    .sort((a, b) => score(b) - score(a))
    .map((v) => ({ name: v.name, lang: v.lang, good: score(v) >= 40 }));
}

/** Use a specific voice (remembered on this device). */
export function chooseVoice(name: string) {
  if (!supported()) return;
  const v = window.speechSynthesis.getVoices().find((x) => x.name === name);
  if (!v) return;
  voice = v;
  try {
    localStorage.setItem(VOICE_KEY, name);
  } catch {
    /* ignore */
  }
}

/** Restore a voice picked earlier on this device. */
export function restoreVoice() {
  try {
    const name = localStorage.getItem(VOICE_KEY);
    if (name) chooseVoice(name);
  } catch {
    /* ignore */
  }
}
