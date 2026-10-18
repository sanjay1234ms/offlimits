import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["drinking-games"];

export const metadata = landingMetadata(page);

export default function DrinkingGamesPage() {
  return <LandingPage page={page} />;
}
