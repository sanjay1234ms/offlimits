/* Werewolf / Mafia: the shared rules engine for the one-phone game
 * (components/werewolf/WolfLocal.tsx) and Party Room mode (lib/wolfStore.ts).
 * Pure functions only, safe on the client and the server. */

export type Skin = "werewolf" | "mafia";
export type Role = "wolf" | "villager" | "seer" | "doctor";
export type Team = "wolves" | "village";

export interface RoleMeta {
  name: string;
  plural: string;
  emoji: string;
  team: Team;
  blurb: string;
  /** What this role does at night, shown on their phone. */
  night: string;
  /** Card gradient. */
  card: string;
}

export const ROLES: Record<Skin, Record<Role, RoleMeta>> = {
  werewolf: {
    wolf: {
      name: "Werewolf",
      plural: "Werewolves",
      emoji: "🐺",
      team: "wolves",
      blurb: "Each night, pick a villager to eat with your pack. By day, blend in and lie.",
      night: "Pick someone to eat tonight.",
      card: "from-red-700 via-rose-900 to-black",
    },
    villager: {
      name: "Villager",
      plural: "Villagers",
      emoji: "🧑‍🌾",
      team: "village",
      blurb: "No powers, just instincts. Find the werewolves and vote them out by day.",
      night: "Who do you suspect? (Nobody sees this. It keeps every phone busy.)",
      card: "from-emerald-600 via-teal-800 to-slate-900",
    },
    seer: {
      name: "Seer",
      plural: "Seers",
      emoji: "🔮",
      team: "village",
      blurb: "Each night, look into one player's soul and learn if they're a werewolf.",
      night: "Pick someone to look into.",
      card: "from-violet-600 via-indigo-800 to-slate-900",
    },
    doctor: {
      name: "Doctor",
      plural: "Doctors",
      emoji: "🩺",
      team: "village",
      blurb: "Each night, protect one player (yourself included) from the wolves.",
      night: "Pick someone to protect tonight.",
      card: "from-sky-500 via-cyan-800 to-slate-900",
    },
  },
  mafia: {
    wolf: {
      name: "Mafia",
      plural: "Mafia",
      emoji: "🕴️",
      team: "wolves",
      blurb: "Each night, choose a civilian to take out. By day, keep your cover.",
      night: "Pick your target tonight.",
      card: "from-zinc-800 via-red-950 to-black",
    },
    villager: {
      name: "Civilian",
      plural: "Civilians",
      emoji: "🧍",
      team: "village",
      blurb: "No special powers. Work out who the Mafia are and vote them out.",
      night: "Who do you suspect? (Nobody sees this. It keeps every phone busy.)",
      card: "from-amber-600 via-orange-900 to-slate-900",
    },
    seer: {
      name: "Detective",
      plural: "Detectives",
      emoji: "🕵️",
      team: "village",
      blurb: "Each night, investigate one player and learn if they're in the Mafia.",
      night: "Pick someone to investigate.",
      card: "from-indigo-600 via-blue-900 to-slate-900",
    },
    doctor: {
      name: "Doctor",
      plural: "Doctors",
      emoji: "🩺",
      team: "village",
      blurb: "Each night, save one player (yourself included) from a hit.",
      night: "Pick someone to save tonight.",
      card: "from-sky-500 via-cyan-800 to-slate-900",
    },
  },
};

export const SKIN_META: Record<Skin, { title: string; villain: string; town: string; emoji: string; dayWord: string }> = {
  werewolf: { title: "Werewolf", villain: "werewolves", town: "village", emoji: "🐺", dayWord: "village" },
  mafia: { title: "Mafia", villain: "Mafia", town: "town", emoji: "🕴️", dayWord: "town" },
};

export const MIN_PLAYERS = 4;
export const MAX_PLAYERS = 20;

export interface Setup {
  wolves: number;
  seer: boolean;
  doctor: boolean;
  /** Show the eliminated player's role. */
  reveal: boolean;
}

/** A fair default for n players: about one wolf per four players. */
export function suggestSetup(n: number): Setup {
  return {
    wolves: n <= 5 ? 1 : n <= 9 ? 2 : n <= 14 ? 3 : 4,
    seer: n >= 5,
    doctor: n >= 6,
    reveal: true,
  };
}

/** Clamp a setup so wolves are a minority and special roles fit. */
export function fixSetup(n: number, s: Partial<Setup>): Setup {
  const base = suggestSetup(n);
  const wolves = Math.max(1, Math.min(Math.ceil(n / 2) - 1 || 1, Math.round(Number(s.wolves ?? base.wolves)) || 1));
  let seer = s.seer ?? base.seer;
  let doctor = s.doctor ?? base.doctor;
  if (wolves + (seer ? 1 : 0) + (doctor ? 1 : 0) > n - 1) doctor = false;
  if (wolves + (seer ? 1 : 0) > n - 1) seer = false;
  return { wolves, seer: Boolean(seer), doctor: Boolean(doctor), reveal: s.reveal ?? true };
}

function shuffle<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Deal roles for n players (index order = player order). */
export function dealRoles(n: number, setup: Setup): Role[] {
  const s = fixSetup(n, setup);
  const roles: Role[] = Array(s.wolves).fill("wolf");
  if (s.seer) roles.push("seer");
  if (s.doctor) roles.push("doctor");
  while (roles.length < n) roles.push("villager");
  return shuffle(roles);
}

/** Most-picked index; ties are broken at random. -1 / invalid picks ignored. */
export function plurality(picks: number[], n: number): { top: number | null; counts: number[]; tie: boolean } {
  const counts = Array(n).fill(0) as number[];
  for (const p of picks) if (Number.isInteger(p) && p >= 0 && p < n) counts[p]++;
  const max = Math.max(0, ...counts);
  if (max === 0) return { top: null, counts, tie: false };
  const leaders = counts.flatMap((c, i) => (c === max ? [i] : []));
  return { top: leaders[Math.floor(Math.random() * leaders.length)], counts, tie: leaders.length > 1 };
}

export interface NightResult {
  /** Player the wolves attacked (null if they couldn't agree on anyone). */
  attacked: number | null;
  /** True when the doctor protected the attacked player. */
  saved: boolean;
  /** Who actually died. */
  killed: number | null;
}

export function resolveNight(wolfPicks: number[], save: number | null, alive: boolean[]): NightResult {
  const valid = wolfPicks.filter((p) => alive[p]);
  const { top } = plurality(valid, alive.length);
  const saved = top !== null && save === top;
  return { attacked: top, saved, killed: top !== null && !saved ? top : null };
}

/** Day vote: the plurality is voted out; a tie means nobody goes. */
export function resolveVote(votes: number[], alive: boolean[]): { out: number | null; counts: number[]; tie: boolean } {
  const valid = votes.filter((v) => alive[v]);
  const counts = Array(alive.length).fill(0) as number[];
  for (const v of valid) counts[v]++;
  const max = Math.max(0, ...counts);
  if (max === 0) return { out: null, counts, tie: false };
  const leaders = counts.flatMap((c, i) => (c === max ? [i] : []));
  return leaders.length > 1 ? { out: null, counts, tie: true } : { out: leaders[0], counts, tie: false };
}

export function winner(roles: Role[], alive: boolean[]): Team | null {
  let wolves = 0;
  let others = 0;
  roles.forEach((r, i) => {
    if (!alive[i]) return;
    if (r === "wolf") wolves++;
    else others++;
  });
  if (wolves === 0) return "village";
  if (wolves >= others) return "wolves";
  return null;
}

/* ------------------------------------------------------------------ */
/** Narration, written in short beats: each array item is spoken as its own
 * line with a pause after it, the way a storyteller would read it. */
export function script(skin: Skin) {
  const R = ROLES[skin];
  const wolfy = skin === "werewolf";
  const town = SKIN_META[skin].town;
  const wasLine = (name: string, role: Role) =>
    role === "wolf"
      ? `${name} was… ${wolfy ? "a Werewolf!" : "in the Mafia!"}`
      : `${name} was… the ${R[role].name}.`;
  return {
    intro: wolfy
      ? ["Welcome to the village.", "Somewhere among you, werewolves are hiding.", "Find them… before they find you."]
      : ["Welcome to the town.", "The Mafia is hiding among you.", "Find them… before they take over."],
    nightFall: (round: number) =>
      wolfy
        ? [`Night ${round}.`, "The moon rises over the village.", "Everyone… close your eyes."]
        : [`Night ${round}.`, "The streetlights flicker.", "Everyone… close your eyes."],
    wake: (role: Role): string[] =>
      role === "wolf"
        ? wolfy
          ? ["Werewolves… open your eyes.", "Look at each other.", "Now, silently, choose your victim."]
          : ["Mafia… open your eyes.", "Look at each other.", "Now, silently, choose your target."]
        : role === "seer"
          ? wolfy
            ? ["Seer… open your eyes.", "Choose one player.", "I'll tell you if they are a werewolf."]
            : ["Detective… open your eyes.", "Choose one player to investigate."]
          : role === "doctor"
            ? ["Doctor… open your eyes.", "Choose someone to protect tonight."]
            : [],
    sleep: (role: Role): string[] => [`${role === "wolf" ? R.wolf.plural : R[role].name}… close your eyes.`],
    roomNight: (round: number) => [
      `Night ${round}.`,
      wolfy ? "The moon rises over the village." : "The streetlights flicker.",
      "Everyone, look at your own phone.",
      "Make your choice in secret… and keep your screen hidden.",
    ],
    morningDead: (name: string, role?: Role) => [
      "Everyone… wake up.",
      wolfy ? "The sun rises over the village… but not everyone made it." : "Morning comes to the town… but not everyone made it.",
      wolfy ? `${name} was eaten in the night.` : `${name} was found sleeping with the fishes.`,
      ...(role ? [wasLine(name, role)] : []),
    ],
    morningSaved: [
      "Everyone… wake up.",
      wolfy ? "The werewolves struck last night…" : "There was a hit last night…",
      "but the Doctor got there first.",
      "Nobody died.",
    ],
    morningQuiet: ["Everyone… wake up.", `Somehow, the whole ${town} survived the night.`],
    day: ["Now… talk.", "Who's lying?", "When you're ready, vote."],
    votedOut: (name: string, role?: Role) => [
      `The ${town} has spoken.`,
      `${name}… you're out.`,
      ...(role ? [wasLine(name, role)] : []),
    ],
    tie: ["It's a tie.", `Nobody leaves the ${town} today.`],
    villageWins: wolfy
      ? ["The last werewolf is gone.", "The village is safe…", "The villagers win!"]
      : ["The last of the Mafia is behind bars.", "The town wins!"],
    wolvesWin: wolfy
      ? ["The werewolves now outnumber the villagers.", "The village belongs to them.", "The werewolves win!"]
      : ["The Mafia outnumbers the town.", "They run this place now.", "The Mafia wins!"],
  };
}

/** Night steps for the one-phone narrator, in order, for roles still alive. */
export function nightOrder(roles: Role[], alive: boolean[]): Role[] {
  const has = (r: Role) => roles.some((x, i) => x === r && alive[i]);
  return (["wolf", "seer", "doctor"] as Role[]).filter(has);
}
