// Imports the latest Diário da República Série I acts from the official RSS feeds.
// The feed only holds the most recent issue, so this job must run daily; it merges
// new acts into data/snapshots/parlamento/diario-republica.json and keeps 120 days.
// Run: npm run import:dr
import { fetchWithRetry, log, writeSnapshot } from "./lib/snapshot";
import { readSnapshot } from "../src/lib/snapshots";
import { parseSerie1 } from "../src/lib/parlamento/dr-rss";
import type { DrAct } from "../src/lib/parlamento/types";

const FEED_HTML = "https://files.diariodarepublica.pt/rss/serie1-html.xml";
const FEED_PDF = "https://files.diariodarepublica.pt/rss/serie1.xml";
const KEEP_DAYS = 120;

type DrSnapshot = { importedAt: string; source: string; acts: DrAct[] };

async function main() {
  log("Fetching Série I feeds");
  const [html, pdf] = await Promise.all([
    fetchWithRetry(FEED_HTML).then((r) => r.text()),
    fetchWithRetry(FEED_PDF).then((r) => r.text()),
  ]);
  const today = new Date().toISOString().slice(0, 10);
  const fresh = parseSerie1(html, pdf, today);
  if (fresh.length === 0) throw new Error("The feed returned no acts. Keeping the previous snapshot.");

  const previous = readSnapshot<DrSnapshot>("parlamento/diario-republica.json")?.acts ?? [];
  const byUrl = new Map(previous.map((a) => [a.url, a]));
  let added = 0;
  for (const act of fresh) {
    if (!byUrl.has(act.url)) added++;
    byUrl.set(act.url, { ...act, firstSeen: byUrl.get(act.url)?.firstSeen ?? act.firstSeen });
  }

  const cutoff = new Date(Date.now() - KEEP_DAYS * 86_400_000).toISOString().slice(0, 10);
  const acts = [...byUrl.values()]
    .filter((a) => (a.diarioDate ?? a.firstSeen) >= cutoff)
    .sort((a, b) => (b.diarioDate ?? "").localeCompare(a.diarioDate ?? "") || a.title.localeCompare(b.title, "pt"));

  writeSnapshot("parlamento/diario-republica.json", { importedAt: new Date().toISOString(), source: FEED_HTML, acts } satisfies DrSnapshot);
  log(`Done. ${fresh.length} acts in feed, ${added} new, ${acts.length} kept.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
