import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { PlayHub } from "@/components/party/PlayHub";
import { VoteRound } from "@/components/party/VoteRound";
import { EVENT_PAGES } from "@/data/eventPages";
import { MOST_LIKELY_PAGES } from "@/data/keywordPages/mostLikely";
import { itemText } from "@/data/keywordPages";

const page = EVENT_PAGES["most-likely-to-game"];

export const metadata = landingMetadata(page);

/** "Who's most likely to cry?" -> "cry" (VoteRound adds the lead-in). */
function pack(path: string): string[] {
  const kp = MOST_LIKELY_PAGES.find((p) => p.path === path);
  if (!kp) return [];
  return kp.sections.flatMap((s) =>
    s.items.map((i) => itemText(i).replace(/^Who's (most|more) likely to /, "").replace(/\?$/, "")),
  );
}

export default function MostLikelyToGamePage() {
  return (
    <LandingPage page={page}>
      <PlayHub
        storageKey="ol-hub-mlt"
        heading="Pick a pack"
        tools={[
          { id: "funny", title: "Funny", emoji: "😂", tag: "Ridiculous and harmless", gradient: "from-amber-400 to-orange-600", node: <VoteRound questions={pack("/questions/funny-most-likely-to-questions")} title="Funny Most Likely To" slug="mlt-funny" /> },
          { id: "friends", title: "Friends", emoji: "👯", tag: "Savage friend-group truths", gradient: "from-fuchsia-500 to-violet-600", node: <VoteRound questions={pack("/questions/most-likely-to-questions-for-friends")} title="Most Likely To: Friends" slug="mlt-friends" /> },
          { id: "teens", title: "Teens", emoji: "📱", tag: "Sleepover drama", gradient: "from-sky-400 to-indigo-600", node: <VoteRound questions={pack("/questions/most-likely-to-questions-for-teens")} title="Most Likely To: Teens" slug="mlt-teens" /> },
          { id: "family", title: "Family", emoji: "👨‍👩‍👧", tag: "Clean, for all ages", gradient: "from-emerald-400 to-teal-600", node: <VoteRound questions={pack("/questions/most-likely-to-questions-for-family")} title="Most Likely To: Family" slug="mlt-family" /> },
        ]}
      />
    </LandingPage>
  );
}
