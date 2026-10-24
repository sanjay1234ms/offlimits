// Tells IndexNow search engines (Bing, Yandex, Seznam, Naver…) that pages
// changed, so they recrawl in hours or days instead of weeks. Google doesn't
// use IndexNow; use Search Console for that.
//
//   npm run indexnow                 every URL in public/sitemap.xml
//   npm run indexnow -- /white-elephant /secret-santa   just these paths
//
// Run it after a deploy is live. The key file (public/<key>.txt) must be
// reachable on the live site first, or the ping is rejected.
import { readdirSync, readFileSync } from "node:fs";

const ORIGIN = "https://playofflimits.com";
const HOST = new URL(ORIGIN).host;

const keyFile = readdirSync("public").find((f) => /^[a-f0-9]{32}\.txt$/.test(f));
if (!keyFile) {
  console.error("No IndexNow key file (public/<32 hex>.txt) found.");
  process.exit(1);
}
const key = keyFile.replace(/\.txt$/, "");
const keyLocation = `${ORIGIN}/${keyFile}`;

const args = process.argv.slice(2);
const urlList = args.length
  ? args.map((p) => (p.startsWith("http") ? p : `${ORIGIN}${p.startsWith("/") ? "" : "/"}${p}`))
  : [...readFileSync("public/sitemap.xml", "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);

// The key file has to be live, or every engine rejects the ping.
const live = await fetch(keyLocation, { cache: "no-store" }).catch(() => null);
if (!live?.ok || (await live.text()).trim() !== key) {
  console.error(`Key file isn't live yet at ${keyLocation}. Deploy first, then rerun.`);
  process.exit(1);
}

const res = await fetch("https://api.indexnow.org/indexnow", {
  method: "POST",
  headers: { "Content-Type": "application/json; charset=utf-8" },
  body: JSON.stringify({ host: HOST, key, keyLocation, urlList }),
});

// 200 = accepted, 202 = accepted and key validation pending.
console.log(`IndexNow: ${res.status} ${res.statusText} for ${urlList.length} URL(s)`);
if (res.status >= 400) {
  console.error(await res.text());
  process.exit(1);
}
