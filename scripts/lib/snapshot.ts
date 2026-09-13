import fs from "node:fs";
import path from "node:path";

export const SNAPSHOT_DIR = path.join(process.cwd(), "data", "snapshots");

const USER_AGENT = "PortugalExplicado/0.1 (open data importer)";

export async function fetchWithRetry(url: string, { attempts = 3, timeoutMs = 60_000, accept = "*/*" } = {}) {
  let lastError: unknown;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const res = await fetch(url, {
        headers: { "user-agent": USER_AGENT, accept },
        signal: AbortSignal.timeout(timeoutMs),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
      return res;
    } catch (err) {
      lastError = err;
      if (attempt < attempts) await new Promise((r) => setTimeout(r, 1_000 * attempt));
    }
  }
  throw lastError;
}

export async function fetchJson<T = unknown>(url: string, opts?: Parameters<typeof fetchWithRetry>[1]): Promise<T> {
  const res = await fetchWithRetry(url, { accept: "application/json", ...opts });
  return (await res.json()) as T;
}

/**
 * Writes a snapshot atomically: the previous file stays in place until the
 * new one is fully written, so a failed import never leaves a broken file.
 */
export function writeSnapshot(relPath: string, data: unknown) {
  const file = path.join(SNAPSHOT_DIR, relPath);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  const tmp = `${file}.tmp`;
  fs.writeFileSync(tmp, JSON.stringify(data, null, 2));
  fs.renameSync(tmp, file);
  const kb = Math.round(fs.statSync(file).size / 1024);
  console.log(`  wrote ${path.relative(process.cwd(), file)} (${kb} KB)`);
}

export function log(step: string) {
  console.log(`▸ ${step}`);
}
