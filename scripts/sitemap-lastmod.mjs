// Rewrites every <lastmod> in public/sitemap.xml with the date the page's
// own source last changed (newest git commit across its files; today if any
// of them has uncommitted edits). Run: npm run sitemap:lastmod
import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const SITEMAP = "public/sitemap.xml";
const ORIGIN = "https://playofflimits.com";

/** Source files that make up each URL's content. */
function sourcesFor(path) {
  if (path === "/") return ["app/page.tsx", "components/Hero.tsx"];
  const own = `app${path}/page.tsx`;
  if (existsSync(own)) {
    // Landing pages render data/landingPages.ts through LandingPage.tsx.
    const src = readFileSync(own, "utf8");
    return src.includes("LANDING_PAGES")
      ? [own, "data/landingPages.ts"]
      : [own];
  }
  const [, section] = path.split("/");
  switch (section) {
    case "games":
      return [
        "app/games/[slug]/page.tsx",
        "data/corePages.ts",
        "data/gameGuides.ts",
      ];
    case "questions":
      return [
        "app/questions/[slug]/page.tsx",
        "components/QuestionListPage.tsx",
        "data/questionLists.ts",
      ];
    case "occasions":
      return ["app/occasions/[slug]/page.tsx"];
    case "pickers":
      return [
        "app/pickers/[tool]/page.tsx",
        "data/pickers.ts",
        "data/pickerGuides.ts",
      ];
    default:
      return [];
  }
}

const git = (...args) =>
  execFileSync("git", args, { encoding: "utf8" }).trim();
const today = new Date().toISOString().slice(0, 10);

function lastChanged(files) {
  const present = files.filter((f) => existsSync(f));
  if (present.length === 0) return today;
  if (git("status", "--porcelain", "--", ...present)) return today;
  return git("log", "-1", "--format=%cs", "--", ...present) || today;
}

const xml = readFileSync(SITEMAP, "utf8");
let changed = 0;
const out = xml.replace(
  /(<loc>([^<]+)<\/loc>\s*<lastmod>)([^<]*)(<\/lastmod>)/g,
  (all, head, loc, old, tail) => {
    const path = loc.replace(ORIGIN, "").replace(/\/$/, "") || "/";
    const date = lastChanged(sourcesFor(path));
    if (date !== old) changed++;
    return `${head}${date}${tail}`;
  },
);
writeFileSync(SITEMAP, out);
console.log(`sitemap lastmod: ${changed} date(s) updated`);
