import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { PlayHub } from "@/components/party/PlayHub";
import { HotPotato } from "@/components/party/HotPotato";
import { VoteRound } from "@/components/party/VoteRound";
import { EVENT_PAGES } from "@/data/eventPages";
import { TURKEY_PROMPTS, THANKSGIVING_VOTE } from "@/data/events/misc";

const page = EVENT_PAGES["thanksgiving-games"];

export const metadata = landingMetadata(page);

export default function ThanksgivingGamesPage() {
  return (
    <LandingPage page={page}>
      <PlayHub
        storageKey="ol-hub-thanksgiving"
        tools={[
          { id: "turkey", title: "Pass the Turkey", emoji: "🦃", tag: "Hot potato for the table", gradient: "from-amber-400 to-orange-600", node: <HotPotato emoji="🦃" itemName="turkey" boom="GOBBLE!" prompts={TURKEY_PROMPTS} slug="thanksgiving" /> },
          { id: "vote", title: "Most Likely To", emoji: "👉", tag: "Secret votes, big reveal", gradient: "from-orange-500 to-rose-600", node: <VoteRound questions={THANKSGIVING_VOTE} title="Thanksgiving Most Likely To" slug="thanksgiving" /> },
        ]}
      />
    </LandingPage>
  );
}
