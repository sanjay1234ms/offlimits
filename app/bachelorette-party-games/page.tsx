import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { PlayHub } from "@/components/party/PlayHub";
import { SpicyDeck } from "@/components/party/SpicyDeck";
import { QuizBuilder } from "@/components/party/KnowQuiz";
import { VoteRound } from "@/components/party/VoteRound";
import { Checklist } from "@/components/party/Checklist";
import { EVENT_PAGES } from "@/data/eventPages";
import { BACHELORETTE_DECK, BRIDE_QUIZ, BACHELORETTE_VOTE, BACHELORETTE_HUNT } from "@/data/events/bachelorette";

const page = EVENT_PAGES["bachelorette-party-games"];

export const metadata = landingMetadata(page);

export default function BacheloretteGamesPage() {
  return (
    <LandingPage page={page}>
      <PlayHub
        storageKey="ol-hub-bachelorette"
        tools={[
          { id: "deck", title: "Bride Edition Truth or Dare", emoji: "😈", tag: "Cute to filthy, 5 levels", gradient: "from-fuchsia-500 to-rose-600", badge: "18+", node: <SpicyDeck title="Bride Edition" cards={BACHELORETTE_DECK} slug="bachelorette" theme="bachelorette" /> },
          { id: "quiz", title: "How Well Do You Know the Bride", emoji: "👰", tag: "Everyone plays on their phone", gradient: "from-pink-400 to-purple-600", badge: "Multi-phone", node: <QuizBuilder subjectLabel="The bride's name" subjectPlaceholder="e.g. Julia" titleTemplate="How well do you know {name}?" templates={BRIDE_QUIZ} slug="bachelorette" /> },
          { id: "vote", title: "Most Likely To", emoji: "👉", tag: "Secret votes, big reveal", gradient: "from-rose-500 to-orange-500", node: <VoteRound questions={BACHELORETTE_VOTE} title="Bachelorette Most Likely To" slug="bachelorette" /> },
          { id: "hunt", title: "Night-Out Scavenger Hunt", emoji: "🍸", tag: "Tick off dares for points", gradient: "from-violet-500 to-fuchsia-600", node: <Checklist items={BACHELORETTE_HUNT} title="Bachelorette Scavenger Hunt" storageKey="ol-hunt-bachelorette" gradient="from-fuchsia-500 to-rose-500" /> },
        ]}
      />
    </LandingPage>
  );
}
