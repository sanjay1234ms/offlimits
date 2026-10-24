/** White Elephant game state, as pure functions so the UI can keep an undo
 * stack and persist to localStorage. */

export interface WeGift {
  id: number;
  label: string;
  /** Index into players. Every opened gift has a holder. */
  holder: number;
  steals: number;
  frozen: boolean;
}

export interface WeRules {
  /** Steals that freeze a gift; 0 = never freeze. */
  freezeAt: number;
  /** Number 1 may swap once every gift is open. */
  finalSwap: boolean;
}

export interface WeGame {
  players: string[];
  rules: WeRules;
  gifts: WeGift[];
  /** Index of the next player in the turn order who hasn't opened yet. */
  turn: number;
  /** Player who must act now (a robbed player acts out of order). */
  active: number;
  /** Gift the active player may not steal straight back. */
  blocked: number | null;
  phase: "playing" | "finalSwap" | "done";
  log: string[];
}

export function newGame(players: string[], rules: WeRules): WeGame {
  return {
    players,
    rules,
    gifts: [],
    turn: 0,
    active: 0,
    blocked: null,
    phase: "playing",
    log: [`${players[0]} goes first.`],
  };
}

export function canSteal(game: WeGame, gift: WeGift): boolean {
  if (game.phase === "finalSwap") return !gift.frozen && gift.holder !== 0;
  return (
    game.phase === "playing" &&
    !gift.frozen &&
    gift.holder !== game.active &&
    gift.id !== game.blocked
  );
}

function afterOpen(game: WeGame): WeGame {
  const turn = game.turn + 1;
  if (turn < game.players.length) {
    return { ...game, turn, active: turn, blocked: null };
  }
  const swappable = game.rules.finalSwap && game.gifts.some((g) => g.holder !== 0 && !g.frozen);
  return { ...game, turn, active: 0, blocked: null, phase: swappable ? "finalSwap" : "done" };
}

export function openGift(game: WeGame, label: string): WeGame {
  if (game.phase !== "playing") return game;
  const id = game.gifts.length;
  const name = label.trim() || `Gift ${id + 1}`;
  const who = game.players[game.active];
  return afterOpen({
    ...game,
    gifts: [...game.gifts, { id, label: name, holder: game.active, steals: 0, frozen: false }],
    log: [`${who} opened ${name}.`, ...game.log],
  });
}

export function stealGift(game: WeGame, giftId: number): WeGame {
  const gift = game.gifts.find((g) => g.id === giftId);
  if (!gift || !canSteal(game, gift)) return game;

  if (game.phase === "finalSwap") {
    const mine = game.gifts.find((g) => g.holder === 0)!;
    const other = gift.holder;
    return {
      ...game,
      gifts: game.gifts.map((g) =>
        g.id === gift.id ? { ...g, holder: 0 } : g.id === mine.id ? { ...g, holder: other } : g,
      ),
      phase: "done",
      log: [
        `${game.players[0]} swapped ${mine.label} for ${gift.label} with ${game.players[other]}.`,
        ...game.log,
      ],
    };
  }

  const victim = gift.holder;
  const steals = gift.steals + 1;
  const frozen = game.rules.freezeAt > 0 && steals >= game.rules.freezeAt;
  return {
    ...game,
    gifts: game.gifts.map((g) =>
      g.id === gift.id ? { ...g, holder: game.active, steals, frozen } : g,
    ),
    active: victim,
    blocked: gift.id,
    log: [
      `${game.players[game.active]} stole ${gift.label} from ${game.players[victim]}.${frozen ? " ❄️ It's frozen!" : ""}`,
      ...game.log,
    ],
  };
}

/** Number 1 keeps what they have. */
export function skipFinalSwap(game: WeGame): WeGame {
  if (game.phase !== "finalSwap") return game;
  return { ...game, phase: "done", log: [`${game.players[0]} kept their gift.`, ...game.log] };
}

export function isWeGame(v: unknown): v is WeGame {
  const g = v as WeGame;
  return Boolean(g && Array.isArray(g.players) && Array.isArray(g.gifts) && g.rules && typeof g.turn === "number");
}
