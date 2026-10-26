import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { WolfGame } from "@/components/werewolf/WolfGame";
import { EVENT_PAGES } from "@/data/eventPages";

const page = EVENT_PAGES["mafia-game"];

export const metadata = landingMetadata(page);

export default function MafiaGamePage() {
  return (
    <LandingPage page={page}>
      <WolfGame defaultSkin="mafia" />
    </LandingPage>
  );
}
