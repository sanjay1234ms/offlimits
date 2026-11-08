import type { Metadata } from "next";
import { shareMetadata } from "@/lib/seo";
import { DailyGamePage } from "@/components/daily/DailyGamePage";
import { CloseCall } from "@/components/daily/CloseCall";
import { DAILY_GAMES } from "@/data/daily/puzzles";

const GAME = DAILY_GAMES[2];
const TITLE = "Close Call: Daily Number Guessing Game";
const DESCRIPTION =
  "Five number questions a day that nobody knows the answer to. Guess as close as you can and score out of 1,000. Free daily estimation game, no signup.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: GAME.href },
  ...shareMetadata(TITLE, DESCRIPTION, GAME.href),
};

export default function CloseCallPage() {
  return (
    <DailyGamePage
      game={GAME}
      title="Close Call"
      description={DESCRIPTION}
      intro="How tall is the Burj Khalifa? How many keys on a piano? Five questions a day, one guess each. You won't know, so get as close as you can."
      steps={[
        "Read the question and check the unit it wants.",
        "Tap your number on the pad. The ,000 key adds three zeros for the really big ones.",
        "Press Lock it in. One guess per question, no take-backs.",
        "See the real answer and how close you got as a percentage.",
        "After five questions you get a score out of 1,000. Share it with the group chat.",
      ]}
      tips={[
        { title: "Get the size right first", body: "Is it tens, thousands or millions? Being in the right ballpark matters more than the last digit." },
        { title: "Anchor on something you know", body: "Know a football pitch is about 100 metres? Use it to size up a building or a bridge." },
        { title: "Skip the round numbers", body: "Real answers are rarely exactly 1,000. If your gut says 'about a thousand', try 850 or 1,200." },
        { title: "Years are different", body: "Year questions score by how many years off you are, so think about what else was going on at the time." },
      ]}
      faq={[
        { q: "How is Close Call scored?", a: "Each guess scores the smaller number divided by the bigger one, so guessing double or half the answer both score 50%. Year questions lose 2% per year off. Five questions make a score out of 1,000." },
        { q: "Can I use a calculator or search?", a: "Nothing stops you, but it ruins the fun. The game is about good guessing, not looking things up." },
        { q: "Can I play with friends?", a: "Yes. Everyone gets the same five questions, so play at the same time and compare scores, or share your result in the group chat." },
        { q: "When do the questions change?", a: "At midnight in your time zone. Everyone gets the same five questions each day." },
        { q: "Can I play past days?", a: "The last seven days are open as practice and don't count for streaks. You can also play unlimited bonus rounds." },
        { q: "Is it free?", a: "Yes. No app, no account, no signup." },
      ]}
    >
      <CloseCall />
    </DailyGamePage>
  );
}
