import fs from "node:fs";
import path from "node:path";
import { fetchWithRetry, log } from "./snapshot";

const AR = "https://www.parlamento.pt";
const RAW_DIR = path.join(process.cwd(), "data", "raw");

const decode = (s: string) => s.replace(/&amp;/g, "&");

/**
 * The open data files sit behind a tokenised URL that must be discovered each run:
 * dataset page → "Pasta <LEG> Legislatura" folder page → *_json.txt link.
 */
async function discoverFileUrl(datasetPage: string, legislature: string, fileName: string) {
  const page = await (await fetchWithRetry(`${AR}/Cidadania/Paginas/${datasetPage}.aspx`)).text();
  const folder = page.match(new RegExp(`title="Pasta ${legislature} Legislatura"[^>]*href="([^"]+)"`))?.[1];
  if (!folder) throw new Error(`Folder for ${legislature} not found on ${datasetPage}`);
  const folderPage = await (await fetchWithRetry(`${AR}${decode(folder)}`)).text();
  const file = [...folderPage.matchAll(/href="([^"]*_json\.txt[^"]*)"/g)].map((m) => decode(m[1])).find((u) => u.includes(`fich=${fileName}`));
  if (!file) throw new Error(`${fileName} not found in ${datasetPage} folder`);
  return file;
}

/**
 * Downloads an AR open data JSON file. With OFFLINE=1 it reuses the last raw
 * download, which keeps iteration on the parser fast.
 */
export async function loadArFile<T>(datasetPage: string, legislature: string, fileName: string): Promise<T> {
  const rawFile = path.join(RAW_DIR, fileName);
  if (process.env.OFFLINE === "1" && fs.existsSync(rawFile)) {
    log(`${fileName} (cached raw file)`);
  } else {
    log(`${fileName}: discovering download link`);
    const url = await discoverFileUrl(datasetPage, legislature, fileName);
    log(`${fileName}: downloading`);
    const res = await fetchWithRetry(url, { timeoutMs: 300_000, accept: "application/json" });
    fs.mkdirSync(RAW_DIR, { recursive: true });
    fs.writeFileSync(`${rawFile}.tmp`, Buffer.from(await res.arrayBuffer()));
    fs.renameSync(`${rawFile}.tmp`, rawFile);
    log(`${fileName}: ${Math.round(fs.statSync(rawFile).size / 1_048_576)} MB`);
  }
  const text = fs.readFileSync(rawFile, "utf8").replace(/^﻿/, "");
  return JSON.parse(text) as T;
}
