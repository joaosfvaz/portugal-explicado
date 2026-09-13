// Minimal XLSX reader for the import scripts: one sheet, cell values only.
// Enough for simple tabular files (numbers, shared strings, inline strings).
import { strFromU8, unzipSync } from "fflate";

export type Cell = string | number | null;

const decode = (s: string) =>
  s.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&apos;/g, "'").replace(/&amp;/g, "&");

function columnIndex(ref: string) {
  let n = 0;
  for (const ch of ref.replace(/\d+$/, "")) n = n * 26 + (ch.charCodeAt(0) - 64);
  return n - 1;
}

export function readSheet(buffer: Uint8Array, sheetName: string): Cell[][] {
  const files = unzipSync(buffer, {
    filter: (f) => f.name === "xl/workbook.xml" || f.name === "xl/_rels/workbook.xml.rels" || f.name === "xl/sharedStrings.xml" || f.name.startsWith("xl/worksheets/sheet"),
  });
  const text = (name: string) => (files[name] ? strFromU8(files[name]) : "");

  const sheet = [...text("xl/workbook.xml").matchAll(/<sheet [^>]*name="([^"]+)"[^>]*r:id="([^"]+)"/g)].find((m) => decode(m[1]) === sheetName);
  if (!sheet) throw new Error(`Sheet not found: ${sheetName}`);
  const target = [...text("xl/_rels/workbook.xml.rels").matchAll(/<Relationship [^>]*Id="([^"]+)"[^>]*Target="([^"]+)"/g)].find((m) => m[1] === sheet[2])?.[2];
  if (!target) throw new Error(`Sheet target not found: ${sheetName}`);
  const path = `xl/${target.replace(/^\/?xl\//, "")}`;

  const shared = [...text("xl/sharedStrings.xml").matchAll(/<si>([\s\S]*?)<\/si>/g)].map((m) =>
    decode([...m[1].matchAll(/<t[^>]*>([\s\S]*?)<\/t>/g)].map((t) => t[1]).join("")),
  );

  const rows: Cell[][] = [];
  for (const row of text(path).matchAll(/<row [^>]*r="(\d+)"[^>]*>([\s\S]*?)<\/row>/g)) {
    const cells: Cell[] = [];
    for (const c of row[2].matchAll(/<c r="([A-Z]+\d+)"([^>]*?)(?:\/>|>([\s\S]*?)<\/c>)/g)) {
      const type = c[2].match(/t="(\w+)"/)?.[1];
      const body = c[3] ?? "";
      const v = body.match(/<v>([\s\S]*?)<\/v>/)?.[1];
      let value: Cell = null;
      if (type === "s" && v !== undefined) value = shared[Number(v)] ?? null;
      else if (type === "inlineStr") value = decode(body.match(/<t[^>]*>([\s\S]*?)<\/t>/)?.[1] ?? "");
      else if (type === "str") value = v !== undefined ? decode(v) : null;
      else if (v !== undefined) value = Number(v);
      cells[columnIndex(c[1])] = value;
    }
    rows[Number(row[1]) - 1] = cells;
  }
  return rows;
}

/** Excel serial date (1900 system) to ISO date. */
export function excelDate(serial: number) {
  return new Date(Math.round((serial - 25569) * 86400000)).toISOString().slice(0, 10);
}
