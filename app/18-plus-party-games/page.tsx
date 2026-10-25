import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["18-plus-party-games"];

export const metadata = landingMetadata(page);

export default function AdultPartyGamesPage() {
  return <LandingPage page={page} />;
}
