import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "data", "snapshots");

/** Reads a snapshot written by the import scripts, or null if it does not exist yet. */
export function readSnapshot<T>(relPath: string): T | null {
  const file = path.join(DIR, relPath);
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8")) as T;
}
