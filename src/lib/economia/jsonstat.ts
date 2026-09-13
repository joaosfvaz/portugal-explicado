export type Point = { period: string; value: number };

type Category = { index: Record<string, number> | string[]; label?: Record<string, string> };
export type JsonStat = {
  id: string[];
  size: number[];
  dimension: Record<string, { label?: string; category: Category }>;
  value: Record<string, number | null> | (number | null)[];
  updated?: string;
  label?: string;
};

const positions = (c: Category): string[] => {
  if (Array.isArray(c.index)) return c.index;
  return Object.entries(c.index)
    .sort((a, b) => a[1] - b[1])
    .map(([k]) => k);
};

/**
 * Splits a JSON-stat 2.0 dataset into one series per category of `seriesDim`
 * (e.g. "geo"), over `timeDim`. Every other dimension must have size 1, so a
 * query that accidentally returns several units or breakdowns fails loudly
 * instead of mixing numbers.
 */
export function jsonStatSeries(js: JsonStat, timeDim: string, seriesDim?: string): Map<string, Point[]> {
  const dims = js.id;
  dims.forEach((d, i) => {
    if (d !== timeDim && d !== seriesDim && js.size[i] !== 1) {
      throw new Error(`Dimension "${d}" has ${js.size[i]} categories; narrow the query`);
    }
  });
  const cats = dims.map((d) => positions(js.dimension[d].category));
  const strides = dims.map((_, i) => js.size.slice(i + 1).reduce((a, b) => a * b, 1));
  const tIdx = dims.indexOf(timeDim);
  const sIdx = seriesDim ? dims.indexOf(seriesDim) : -1;
  if (tIdx === -1) throw new Error(`Time dimension "${timeDim}" not found`);

  const out = new Map<string, Point[]>();
  const keys = sIdx === -1 ? ["_"] : cats[sIdx];
  keys.forEach((key, s) => {
    const points: Point[] = [];
    cats[tIdx].forEach((period, t) => {
      const flat = t * strides[tIdx] + (sIdx === -1 ? 0 : s * strides[sIdx]);
      const raw = Array.isArray(js.value) ? js.value[flat] : js.value[String(flat)];
      if (typeof raw === "number" && Number.isFinite(raw)) points.push({ period, value: raw });
    });
    out.set(key, points);
  });
  return out;
}
