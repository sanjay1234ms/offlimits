import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["couples-games"];

export const metadata = landingMetadata(page);

export default function CouplesGamesPage() {
  return <LandingPage page={page} />;
}
