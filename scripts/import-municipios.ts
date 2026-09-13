// Imports the Câmara Municipal results of the 2025 local elections for each of the 308 municípios
// from the CNE mapa oficial (retificado), part II: percentages and seats per list.
// Run: npm run import:municipios   (MUNICIPIOS_ZIP=/path/to/zip to use a downloaded file)
import fs from "node:fs";
import { unzipSync } from "fflate";
import { readSheet, type Cell } from "./lib/xlsx";
import { fetchWithRetry, log, writeSnapshot } from "./lib/snapshot";
import { shortSigla, slugify, titleCase } from "../src/lib/municipios/names";
import type { CouncilList, Municipio, MunicipiosSnapshot } from "../src/lib/municipios/types";

const ZIP_URL = "https://www.cne.pt/sites/default/files/dl/eleicoes/2025_al/docs_geral/2025al-mapa-oficial_retificado.zip";
const FILE = "2025al-mapa-oficial_retificado/mapa_2_perc_mandatos_retificado.xlsx";

const siglas = (cell: Cell) => [...String(cell ?? "").matchAll(/\[([^\]]+)\]/g)].map((m) => m[1].trim());

async function main() {
  log("A obter o mapa oficial da CNE");
  const zip = process.env.MUNICIPIOS_ZIP ? new Uint8Array(fs.readFileSync(process.env.MUNICIPIOS_ZIP)) : new Uint8Array(await (await fetchWithRetry(ZIP_URL, { timeoutMs: 180_000 })).arrayBuffer());
  const xlsx = unzipSync(zip, { filter: (f) => f.name === FILE })[FILE];
  if (!xlsx) throw new Error(`${FILE} not found in zip`);
  const rows = readSheet(xlsx, "Folha1");

  const header = rows.findIndex((r) => r[0] === "CÓD");
  const names = rows[header];
  const coalitionStart = names.indexOf("PCP-PEV");
  const coalitionLetters = [42, 44, 46];
  const citizenLetters = [48, 50, 52, 54];

  const districts = new Map<string, string>();
  const municipios = new Map<string, Municipio>();

  for (const r of rows.slice(header + 2)) {
    const code = String(r[0] ?? "");
    if (!/^\d{6}$/.test(code)) continue;
    if (code.endsWith("0000")) {
      // Mainland districts use two digits (010000); the autonomous regions use one (300000, 400000).
      const region = { "3": "Região Autónoma da Madeira", "4": "Região Autónoma dos Açores" }[code[0]];
      districts.set(region ? code[0] : code.slice(0, 2), region ?? titleCase(String(r[1])));
      continue;
    }
    if (r[3] !== "CM" || r[2] !== "" || municipios.has(code)) continue;

    const coalitionNames = siglas(r[56]);
    const citizenNames = siglas(r[57]);
    const lists: CouncilList[] = [];
    const push = (col: number, sigla: string, kind: CouncilList["kind"]) => {
      const pct = r[col];
      if (typeof pct !== "number") return;
      lists.push({ sigla, short: kind === "cidadaos" ? sigla : shortSigla(sigla), kind, pct, seats: Number(r[col + 1] ?? 0) });
    };
    for (let col = 4; col < coalitionStart; col += 2) push(col, String(names[col]), "partido");
    push(coalitionStart, "PCP-PEV", "coligacao");
    coalitionLetters.forEach((col, i) => coalitionNames[i] && push(col, coalitionNames[i], "coligacao"));
    citizenLetters.forEach((col, i) => citizenNames[i] && push(col, citizenNames[i], "cidadaos"));

    lists.sort((a, b) => b.pct - a.pct || b.seats - a.seats);
    const name = titleCase(String(r[1]));
    municipios.set(code, { code, name, slug: slugify(name), district: "", council: lists, councilSeats: lists.reduce((s, l) => s + l.seats, 0) });
  }

  for (const m of municipios.values()) m.district = districts.get(m.code[0] === "3" || m.code[0] === "4" ? m.code[0] : m.code.slice(0, 2)) ?? "";
  if ([...municipios.values()].some((m) => !m.district)) throw new Error("Município without district");
  const list = [...municipios.values()].sort((a, b) => a.name.localeCompare(b.name, "pt"));
  if (list.length !== 308) throw new Error(`Expected 308 municípios, got ${list.length}`);
  const slugs = new Set(list.map((m) => m.slug));
  if (slugs.size !== list.length) throw new Error("Duplicate município slugs");

  const snapshot: MunicipiosSnapshot = {
    importedAt: new Date().toISOString(),
    election: "Eleições autárquicas de 12 de outubro de 2025",
    source: ZIP_URL,
    municipios: list,
  };
  writeSnapshot("municipios.json", snapshot);
  log(`${list.length} municípios`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
