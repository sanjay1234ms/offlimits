import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { PlayHub } from "@/components/party/PlayHub";
import { CouplesQuiz } from "@/components/party/CouplesQuiz";
import { SpicyDeck } from "@/components/party/SpicyDeck";
import { EVENT_PAGES } from "@/data/eventPages";
import { COUPLES_DECK, COUPLES_QUIZ } from "@/data/events/couples";

const page = EVENT_PAGES["valentines-day-games"];

export const metadata = landingMetadata(page);

export default function ValentinesDayGamesPage() {
  return (
    <LandingPage page={page}>
      <PlayHub
        storageKey="ol-hub-valentines"
        tools={[
          { id: "quiz", title: "Couples Quiz", emoji: "💞", tag: "How in sync are you?", gradient: "from-rose-400 to-red-600", node: <CouplesQuiz questions={COUPLES_QUIZ} slug="valentines" /> },
          { id: "deck", title: "Couples Truth or Dare", emoji: "🔥", tag: "Sweet to very spicy", gradient: "from-red-500 to-fuchsia-700", badge: "18+", node: <SpicyDeck title="Couples Edition" cards={COUPLES_DECK} modes={["truth", "dare", "nhie"]} slug="valentines" theme="couples" /> },
        ]}
      />
    </LandingPage>
  );
}
