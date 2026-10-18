import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["christmas-party-games"];

export const metadata = landingMetadata(page);

export default function ChristmasPartyGamesPage() {
  return <LandingPage page={page} />;
}
