import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["sleepover-games"];

export const metadata = landingMetadata(page);

export default function SleepoverGamesPage() {
  return <LandingPage page={page} />;
}
