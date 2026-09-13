// Imports the economy indicators from Eurostat and Banco de Portugal (BPstat)
// into data/snapshots/economia.json. An indicator that fails keeps its previous
// values, so one broken endpoint never empties the dashboard.
// Run: npm run import:economia
import { excelDate, readSheet, type Cell } from "./lib/xlsx";
import { fetchJson, fetchWithRetry, log, writeSnapshot } from "./lib/snapshot";
import { readSnapshot } from "../src/lib/snapshots";
import { jsonStatSeries, type JsonStat } from "../src/lib/economia/jsonstat";
import { INDICATORS, type EconomiaSnapshot, type Geo, type IndicatorDef, type IndicatorSnapshot } from "../src/lib/economia/indicators";

const EUROSTAT = "https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/";
const BPSTAT = "https://bpstat.bportugal.pt/data/v1/domains/";

const round = (n: number, d = 4) => Math.round(n * 10 ** d) / 10 ** d;

const OIL_BULLETIN =
  "https://energy.ec.europa.eu/document/download/906e60ca-8b6a-44e7-8589-652854d2fd3f_en?filename=Weekly_Oil_Bulletin_Prices_History_maticni_4web.xlsx";
const DGEG = "https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/PMD";
const OIL_GEOS: Record<Geo, string> = { PT: "PT", ES: "ES", EU27_2020: "EU" };

let oilRows: Promise<Cell[][]> | null = null;
function oilBulletin() {
  oilRows ??= fetchWithRetry(OIL_BULLETIN, { timeoutMs: 120_000 })
    .then((res) => res.arrayBuffer())
    .then((buf) => readSheet(new Uint8Array(buf), "Prices with taxes"));
  return oilRows;
}

/** Latest national daily average from DGEG. Undocumented API: optional, never blocks the import. */
async function dgegLatest(fuelId: number) {
  const end = new Date();
  const start = new Date(end.getTime() - 14 * 86400000);
  const day = (d: Date) => d.toISOString().slice(0, 10);
  try {
    const js = await fetchJson<{ resultado: { Data: string; PrecoMedio: string; NumPostos: number }[] }>(
      `${DGEG}?idsTiposComb=${fuelId}&dataIni=${day(start)}&dataFim=${day(end)}`,
    );
    const rows = js.resultado
      .map((r) => ({ date: r.Data, value: Number.parseFloat(r.PrecoMedio.replace(/[^\d,]/g, "").replace(",", ".")), stations: r.NumPostos }))
      .filter((r) => r.value > 0)
      .sort((a, b) => a.date.localeCompare(b.date));
    const last = rows.at(-1);
    return last ? { ...last, source: "DGEG, Preços dos Combustíveis Online", sourceUrl: "https://precoscombustiveis.dgeg.gov.pt/" } : null;
  } catch {
    return null;
  }
}

async function load(def: IndicatorDef): Promise<IndicatorSnapshot> {
  const importedAt = new Date().toISOString();
  if (def.source.kind === "eurostat") {
    const params = new URLSearchParams({ ...def.source.params, sinceTimePeriod: def.source.since, lang: "EN" });
    for (const g of def.source.geos) params.append("geo", g);
    const js = await fetchJson<JsonStat>(`${EUROSTAT}${def.source.dataset}?${params}`);
    const bySeries = jsonStatSeries(js, "time", "geo");
    const series: IndicatorSnapshot["series"] = {};
    for (const g of def.source.geos) {
      let points = bySeries.get(g) ?? [];
      if (def.transform === "monthly14to12") points = points.map((p) => ({ ...p, value: round((p.value * 12) / 14, 2) }));
      series[g as Geo] = points;
    }
    if (!series.PT?.length) throw new Error("No values for Portugal");
    return { slug: def.slug, importedAt, sourceUpdatedAt: js.updated ?? null, series };
  }

  if (def.source.kind === "oil-bulletin") {
    const { fuel, since, dgegFuelId } = def.source;
    const rows = await oilBulletin();
    const header = rows[0] ?? [];
    const series: IndicatorSnapshot["series"] = {};
    for (const [geo, prefix] of Object.entries(OIL_GEOS) as [Geo, string][]) {
      const col = header.indexOf(`${prefix}_price_with_tax_${fuel}`);
      if (col === -1) throw new Error(`Column not found: ${prefix}_price_with_tax_${fuel}`);
      series[geo] = rows
        .slice(3)
        .filter((r) => typeof r?.[0] === "number" && typeof r[col] === "number")
        .map((r) => ({ period: excelDate(r[0] as number), value: round((r[col] as number) / 1000, 3) }))
        .filter((p) => p.period >= since && p.value > 0)
        .sort((a, b) => a.period.localeCompare(b.period));
    }
    if (!series.PT?.length) throw new Error("No values for Portugal");
    return { slug: def.slug, importedAt, sourceUpdatedAt: series.PT.at(-1)!.period, series, latestDaily: await dgegLatest(dgegFuelId) };
  }

  const url = `${BPSTAT}${def.source.domain}/datasets/${def.source.dataset}/?lang=PT&series_ids=${def.source.series}&obs_since=${def.source.since}`;
  const js = await fetchJson<JsonStat & { extension?: { obs_updated_at?: string } }>(url);
  const points = (jsonStatSeries(js, "reference_date").get("_") ?? []).map((p) => ({ period: p.period.slice(0, 7), value: p.value }));
  if (!points.length) throw new Error("No observations");
  return { slug: def.slug, importedAt, sourceUpdatedAt: js.extension?.obs_updated_at ?? null, series: { PT: points } };
}

async function main() {
  const previous = new Map((readSnapshot<EconomiaSnapshot>("economia.json")?.indicators ?? []).map((i) => [i.slug, i]));
  const indicators: IndicatorSnapshot[] = [];
  const failed: EconomiaSnapshot["failed"] = [];

  for (const def of INDICATORS) {
    try {
      const snap = await load(def);
      indicators.push(snap);
      const last = snap.series.PT?.at(-1);
      log(`${def.slug}: ${last?.period} = ${last?.value}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      failed.push({ slug: def.slug, error: message });
      const kept = previous.get(def.slug);
      if (kept) indicators.push(kept);
      log(`${def.slug}: FAILED (${message})${kept ? ", kept previous values" : ""}`);
    }
  }

  writeSnapshot("economia.json", { importedAt: new Date().toISOString(), indicators, failed } satisfies EconomiaSnapshot);
  if (failed.length) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
