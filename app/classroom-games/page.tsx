import { LandingPage, landingMetadata } from "@/components/LandingPage";
import { LANDING_PAGES } from "@/data/landingPages";

const page = LANDING_PAGES["classroom-games"];

export const metadata = landingMetadata(page);

export default function ClassroomGamesPage() {
  return <LandingPage page={page} />;
}
