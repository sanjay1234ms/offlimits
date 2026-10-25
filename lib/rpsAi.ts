/** Rock Paper Scissors: rules plus a computer opponent that learns habits.
 *
 * The computer runs several small "readers", each guessing the player's next
 * throw from a different habit (favourite throw, what they do after a win or
 * loss, what follows each throw, how they answer the computer's last throw).
 * Every reader is scored on how well it would have called the player so far,
 * with older rounds fading out, and the computer throws against the best
 * one. A little randomness keeps it from being perfectly exploitable. */

export type Move = "rock" | "paper" | "scissors";
export type Outcome = "win" | "lose" | "draw";

export const MOVES: Move[] = ["rock", "paper", "scissors"];

/** What beats each move. */
export const BEATEN_BY: Record<Move, Move> = {
  rock: "paper",
  paper: "scissors",
  scissors: "rock",
};

/** Outcome from player A's point of view. */
export function judge(a: Move, b: Move): Outcome {
  if (a === b) return "draw";
  return BEATEN_BY[b] === a ? "win" : "lose";
}

export interface Round {
  player: Move;
  ai: Move;
}

type Reader = (history: Round[]) => Move | null;

const idx = (m: Move) => MOVES.indexOf(m);
const shift = (m: Move, by: number): Move => MOVES[(idx(m) + by + 3) % 3];

function mostCommon(moves: Move[], weights?: number[]): Move | null {
  if (!moves.length) return null;
  const score = [0, 0, 0];
  moves.forEach((m, i) => (score[idx(m)] += weights?.[i] ?? 1));
  const best = Math.max(...score);
  if (best === 0) return null;
  return MOVES[score.indexOf(best)];
}

/** Recency weights: the latest rounds count most. */
function recency(n: number): number[] {
  return Array.from({ length: n }, (_, i) => Math.pow(0.85, n - 1 - i));
}

const READERS: Record<string, Reader> = {
  /** The throw they make most often lately. */
  favourite: (h) => mostCommon(h.map((r) => r.player), recency(h.length)),

  /** Win-stay, lose-shift: how they change after each kind of result. */
  afterResult: (h) => {
    if (h.length < 2) return null;
    const last = h[h.length - 1];
    const lastOutcome = judge(last.player, last.ai);
    const deltas: number[] = [];
    for (let i = 1; i < h.length; i++) {
      const prev = h[i - 1];
      if (judge(prev.player, prev.ai) !== lastOutcome) continue;
      deltas.push((idx(h[i].player) - idx(prev.player) + 3) % 3);
    }
    if (!deltas.length) return null;
    const counts = [0, 0, 0];
    deltas.forEach((d) => counts[d]++);
    return shift(last.player, counts.indexOf(Math.max(...counts)));
  },

  /** What they usually throw after their own last throw. */
  followUp: (h) => {
    if (h.length < 2) return null;
    const last = h[h.length - 1].player;
    const next: Move[] = [];
    for (let i = 1; i < h.length; i++) if (h[i - 1].player === last) next.push(h[i].player);
    return mostCommon(next);
  },

  /** How they react to the computer's last throw. */
  answerAi: (h) => {
    if (h.length < 2) return null;
    const last = h[h.length - 1].ai;
    const next: Move[] = [];
    for (let i = 1; i < h.length; i++) if (h[i - 1].ai === last) next.push(h[i].player);
    return mostCommon(next);
  },
};

export interface AiState {
  history: Round[];
  /** Decayed accuracy per reader. */
  scores: Record<string, number>;
  /** Rounds where the chosen reader called the player's throw correctly. */
  reads: number;
  /** Rounds where a confident read was made. */
  attempts: number;
  /** The reader used for the pending throw, if any. */
  pending: { reader: string | null; guess: Move | null } | null;
}

export function newAi(): AiState {
  return {
    history: [],
    scores: Object.fromEntries(Object.keys(READERS).map((k) => [k, 0])),
    reads: 0,
    attempts: 0,
    pending: null,
  };
}

/** Picks the computer's throw (call before revealing the player's). */
export function aiThrow(state: AiState, rand = Math.random): { move: Move; state: AiState } {
  const h = state.history;
  let reader: string | null = null;
  let guess: Move | null = null;
  if (h.length >= 2) {
    const ranked = Object.keys(READERS).sort((a, b) => state.scores[b] - state.scores[a]);
    for (const name of ranked) {
      const g = READERS[name](h);
      if (g && state.scores[name] > 0) {
        reader = name;
        guess = g;
        break;
      }
    }
    if (!guess) {
      guess = READERS.favourite(h);
      reader = guess ? "favourite" : null;
    }
  }

  let move: Move;
  if (guess && rand() > 0.12) {
    move = BEATEN_BY[guess];
  } else if (!h.length) {
    // No history: people open with rock slightly more, and paper beats rock.
    move = rand() < 0.45 ? "paper" : MOVES[Math.floor(rand() * 3)];
  } else {
    move = MOVES[Math.floor(rand() * 3)];
  }
  return { move, state: { ...state, pending: { reader, guess } } };
}

/** Records a finished round and updates every reader's score. */
export function aiLearn(state: AiState, round: Round): AiState {
  const scores = { ...state.scores };
  for (const [name, reader] of Object.entries(READERS)) {
    const g = reader(state.history);
    scores[name] = scores[name] * 0.8 + (g === null ? 0 : g === round.player ? 1 : -0.5);
  }
  const p = state.pending;
  const attempted = Boolean(p?.guess);
  return {
    history: [...state.history, round],
    scores,
    attempts: state.attempts + (attempted ? 1 : 0),
    reads: state.reads + (attempted && p?.guess === round.player ? 1 : 0),
    pending: null,
  };
}
