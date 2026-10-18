import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["virtual-party-games"];

export const metadata = landingMetadata(page);

export default function VirtualPartyGamesPage() {
  return <LandingPage page={page} />;
}
