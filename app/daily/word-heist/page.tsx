import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { DailyGamePage } from "@/components/daily/DailyGamePage";
import { WordHeist } from "@/components/daily/WordHeist";
import { DAILY_GAMES } from "@/data/daily/puzzles";

const GAME = DAILY_GAMES[0];
const TITLE = "Word Heist: Daily Five-Letter Word Puzzle";
const DESCRIPTION =
  "Crack the five-letter vault code in six tries. A free daily word puzzle with a clue when you're stuck, streaks and practice days. No signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: GAME.href },
  ...shareMetadata(TITLE, DESCRIPTION, GAME.href),
};

export default function WordHeistPage() {
  return (
    <DailyGamePage
      game={GAME}
      title="Word Heist"
      description={DESCRIPTION}
      intro="One secret five-letter word a day, six tries to crack it. Every guess tells you which letters are in the vault code and where they go."
      steps={[
        "Type any real five-letter word and press Enter. It doesn't need to be right, it needs to be useful.",
        "Green tiles (with a bar) are the right letter in the right spot. Yellow tiles (with a dot) are in the word but somewhere else. Grey letters aren't in it at all.",
        "Use what you learned on the next guess. Made-up words are refused and don't cost you a try.",
        "Stuck after three misses? Reveal one letter. Your share card will show you used it.",
        "Crack it in six or fewer to keep your streak alive, then share your grid. It shows colours only, so no spoilers.",
      ]}
      tips={[
        { title: "Open with common letters", body: "A first word with three vowels or with R, S, T, L and N tells you the most. Save the rare letters for later." },
        { title: "Don't waste greens", body: "Once a letter is green, use your next guess to test new letters in the other four spots, even if that word can't be the answer." },
        { title: "Watch for doubles", body: "If you're out of options, the code may repeat a letter. Words like 'cheer' and 'llama' catch a lot of people." },
        { title: "Take the clue late", body: "The clue costs half a try, so it's worth it when you're down to two guesses and three possible words." },
      ]}
      faq={[
        { q: "When does a new Word Heist puzzle come out?", a: "At midnight in your own time zone. Everyone in the world gets the same word that day." },
        { q: "Is Word Heist free?", a: "Yes. No app, no account and no signup. It runs in any phone or computer browser." },
        { q: "Why was my word refused?", a: "Guesses have to be real English five-letter words from our list of about 12,000. Names, brands and typos are refused, and a refused word doesn't use a try." },
        { q: "How do streaks work?", a: "Solve the puzzle each day to grow your streak. Miss a day or run out of tries and it starts again. Streaks are saved on your device, no account needed." },
        { q: "I missed a day. Can I still play it?", a: "Yes. The last seven days stay open as practice. Practice rounds don't change your streak." },
        { q: "Can I play more than one a day?", a: "After today's puzzle you can crack bonus vaults with random words as many times as you like." },
      ]}
    >
      <WordHeist />
    </DailyGamePage>
  );
}
