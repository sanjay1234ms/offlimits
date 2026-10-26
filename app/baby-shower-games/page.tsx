import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { PlayHub } from "@/components/party/PlayHub";
import { PoolBuilder } from "@/components/party/PredictionPool";
import { PriceGuess } from "@/components/party/PriceGuess";
import { EmojiQuiz } from "@/components/party/EmojiQuiz";
import { EVENT_PAGES } from "@/data/eventPages";
import { BABY_PRICES, BABY_EMOJI } from "@/data/events/misc";

const page = EVENT_PAGES["baby-shower-games"];

export const metadata = landingMetadata(page);

export default function BabyShowerGamesPage() {
  return (
    <LandingPage page={page}>
      <PlayHub
        storageKey="ol-hub-baby"
        tools={[
          { id: "pool", title: "Baby Prediction Pool", emoji: "🍼", tag: "Guests guess on their phones", gradient: "from-sky-400 to-indigo-500", badge: "Multi-phone", node: <PoolBuilder slug="baby-shower" /> },
          { id: "price", title: "The Price Is Right: Baby", emoji: "💸", tag: "Guess the baby gear price", gradient: "from-emerald-400 to-teal-600", node: <PriceGuess items={BABY_PRICES} /> },
          { id: "emoji", title: "Nursery Rhyme Emoji Quiz", emoji: "🐑", tag: "Shout the rhyme", gradient: "from-pink-400 to-amber-400", node: <EmojiQuiz clues={BABY_EMOJI} title="Nursery Rhyme Emoji Quiz" /> },
        ]}
      />
    </LandingPage>
  );
}
