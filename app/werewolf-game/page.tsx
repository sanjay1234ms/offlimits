import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { WolfGame } from "@/components/werewolf/WolfGame";
import { EVENT_PAGES } from "@/data/eventPages";

const page = EVENT_PAGES["werewolf-game"];

export const metadata = landingMetadata(page);

export default function WerewolfGamePage() {
  return (
    <LandingPage page={page}>
      <WolfGame defaultSkin="werewolf" />
    </LandingPage>
  );
}
