import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["halloween-party-games"];

export const metadata = landingMetadata(page);

export default function HalloweenPartyGamesPage() {
  return <LandingPage page={page} />;
}
