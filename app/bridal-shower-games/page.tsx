import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { PlayHub } from "@/components/party/PlayHub";
import { QuizBuilder } from "@/components/party/KnowQuiz";
import { BingoCard } from "@/components/party/BingoCard";
import { EVENT_PAGES } from "@/data/eventPages";
import { BRIDAL_BINGO, HE_SAID_SHE_SAID, COUPLE_QUIZ } from "@/data/events/misc";

const page = EVENT_PAGES["bridal-shower-games"];

export const metadata = landingMetadata(page);

export default function BridalShowerGamesPage() {
  return (
    <LandingPage page={page}>
      <PlayHub
        storageKey="ol-hub-bridal"
        tools={[
          { id: "hesaid", title: "He Said, She Said", emoji: "🗣️", tag: "Who said it? Live leaderboard", gradient: "from-rose-400 to-pink-600", badge: "Multi-phone", node: <QuizBuilder subjectLabel="The couple's names" subjectPlaceholder="e.g. Julia & Reg" titleTemplate="He Said, She Said: {name}" templates={HE_SAID_SHE_SAID} slug="bridal-shower" /> },
          { id: "bingo", title: "Bridal Shower Bingo", emoji: "🎁", tag: "Mark gifts as they open", gradient: "from-amber-400 to-rose-500", node: <BingoCard words={BRIDAL_BINGO} title="Bridal Shower Bingo" slug="bridal-shower" /> },
          { id: "couple", title: "How Well Do You Know the Couple", emoji: "💍", tag: "Quiz the guests", gradient: "from-violet-400 to-fuchsia-600", badge: "Multi-phone", node: <QuizBuilder subjectLabel="The couple's names" subjectPlaceholder="e.g. Julia & Reg" titleTemplate="How well do you know {name}?" templates={COUPLE_QUIZ} slug="bridal-shower-couple" /> },
        ]}
      />
    </LandingPage>
  );
}
