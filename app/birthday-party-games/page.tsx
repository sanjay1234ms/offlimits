import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { PlayHub } from "@/components/party/PlayHub";
import { HotPotato } from "@/components/party/HotPotato";
import { QuizBuilder } from "@/components/party/KnowQuiz";
import { SpicyDeck } from "@/components/party/SpicyDeck";
import { Checklist } from "@/components/party/Checklist";
import { EVENT_PAGES } from "@/data/eventPages";
import { PRESENT_PROMPTS, BIRTHDAY_QUIZ, BIRTHDAY_DECK, BIRTHDAY_HUNT } from "@/data/events/misc";

const page = EVENT_PAGES["birthday-party-games"];

export const metadata = landingMetadata(page);

export default function BirthdayPartyGamesPage() {
  return (
    <LandingPage page={page}>
      <PlayHub
        storageKey="ol-hub-birthday"
        tools={[
          { id: "present", title: "Pass the Present", emoji: "🎁", tag: "Hot potato for any age", gradient: "from-sky-400 to-violet-600", node: <HotPotato emoji="🎁" itemName="present" boom="POP!" prompts={PRESENT_PROMPTS} gradient="from-sky-400 via-violet-500 to-fuchsia-500" slug="birthday" /> },
          { id: "quiz", title: "How Well Do You Know Them", emoji: "🎂", tag: "Everyone plays on their phone", gradient: "from-amber-400 to-pink-600", badge: "Multi-phone", node: <QuizBuilder subjectLabel="Birthday person's name" subjectPlaceholder="e.g. Reg" titleTemplate="How well do you know {name}?" templates={BIRTHDAY_QUIZ} slug="birthday" /> },
          { id: "deck", title: "Adult Birthday Deck", emoji: "🥳", tag: "For the 21st, 30th and beyond", gradient: "from-fuchsia-500 to-rose-600", badge: "18+", node: <SpicyDeck title="Birthday Edition" cards={BIRTHDAY_DECK} slug="birthday" theme="birthday" /> },
          { id: "hunt", title: "Birthday Scavenger Hunt", emoji: "🗺️", tag: "Night-out challenges", gradient: "from-emerald-400 to-cyan-600", node: <Checklist items={BIRTHDAY_HUNT} title="Birthday Scavenger Hunt" storageKey="ol-hunt-birthday" gradient="from-emerald-500 to-cyan-500" /> },
        ]}
      />
    </LandingPage>
  );
}
