import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["office-party-games"];

export const metadata = landingMetadata(page);

export default function OfficePartyGamesPage() {
  return <LandingPage page={page} />;
}
