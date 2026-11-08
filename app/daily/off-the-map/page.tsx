import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { DailyGamePage } from "@/components/daily/DailyGamePage";
import { OffTheMap } from "@/components/daily/OffTheMap";
import { DAILY_GAMES } from "@/data/daily/puzzles";

const GAME = DAILY_GAMES[1];
const TITLE = "Off the Map: Daily Geography Guessing Game";
const DESCRIPTION =
  "Five map cards a day: a landmark, a wild place, a country, a city and a bonus. Drop your pin, closest scores most. Free daily geography game, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: GAME.href },
  ...shareMetadata(TITLE, DESCRIPTION, GAME.href),
};

export default function OffTheMapPage() {
  return (
    <DailyGamePage
      game={GAME}
      title="Off the Map"
      description={DESCRIPTION}
      intro="Five cards, one world map, 30 seconds each. Find the landmark, the wild place, the country and the city, drop your pin, and watch the map fly to the real spot."
      steps={[
        "Read the card: a landmark, a wild place, a country or a city. On country and city cards the map hides its names.",
        "Find it on the map. Drag to move around, and pinch, scroll or use + to zoom in. Country and city names appear as you zoom.",
        "Tap to drop your pin. Drag it, or tap somewhere else, to move it.",
        "Press Lock my pin before the 30-second timer runs out. If time's up, your pin locks where it is. No pin scores zero.",
        "The map flies to the real spot, draws a line from your pin and shows how far off you were. Five cards, up to 100 points each.",
      ]}
      tips={[
        { title: "Zoom out first", body: "Find the right country at world view, then zoom in. Hunting for a coastline while zoomed in eats your 30 seconds." },
        { title: "Use what you know", body: "Capital cities, coasts and big rivers are good anchors. A famous falls is probably on a river border, a reef is offshore." },
        { title: "Don't leave it blank", body: "A rough pin on the right continent still scores. An empty map scores nothing." },
        { title: "Use the borders", body: "On country cards a pin anywhere inside the border scores 100, so aim for the middle of the country, not the edge." },
      ]}
      faq={[
        { q: "How is Off the Map scored?", a: "A pin within 20 km scores a perfect 100. After that points fade with distance: about 68 at 1,000 km, 35 at 2,600 km and 14 at 5,000 km. On country cards a pin anywhere inside the border scores 100, and outside it the most you can get is 85. The best possible day is 500." },
        { q: "Why are the names gone on some cards?", a: "On country and city cards, showing names would give the answer away, so the map hides them until the reveal. Borders stay on so you can still find your way." },
        { q: "Does the map wrap around?", a: "Distances are measured around the globe, so a pin just across the edge of the map from the right spot still counts as close." },
        { q: "When do I get new cards?", a: "At midnight in your time zone. Everyone gets the same five cards each day, so you can compare scores with friends." },
        { q: "Can I play older days?", a: "Yes. The last seven days are open as practice. They don't count for streaks." },
        { q: "Is it free?", a: "Yes. No app, no account, no signup." },
      ]}
    >
      <OffTheMap />
    </DailyGamePage>
  );
}
