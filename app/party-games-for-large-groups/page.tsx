import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["party-games-for-large-groups"];

export const metadata = landingMetadata(page);

export default function PartyGamesForLargeGroupsPage() {
  return <LandingPage page={page} />;
}
