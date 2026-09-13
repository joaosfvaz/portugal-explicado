import { periodYear } from "./format";

type Point = { period: string; value: number };

/** The point closest to `years` before the latest one, within a tolerance that fits the frequency. */
export function pointAgo(points: Point[], years: number): Point | null {
  const last = points.at(-1);
  if (!last) return null;
  const target = periodYear(last.period) - years;
  let best: Point | null = null;
  let gap = Infinity;
  for (const p of points) {
    const d = Math.abs(periodYear(p.period) - target);
    if (d < gap) {
      gap = d;
      best = p;
    }
  }
  return gap <= 0.06 ? best : null;
}

/** Highest and lowest values in the last `years` (or the whole series when null). */
export function extremes(points: Point[], years: number | null) {
  const last = points.at(-1);
  if (!last) return null;
  const from = years === null ? -Infinity : periodYear(last.period) - years;
  const window = points.filter((p) => periodYear(p.period) >= from - 1e-6);
  const high = window.reduce((a, b) => (b.value > a.value ? b : a));
  const low = window.reduce((a, b) => (b.value < a.value ? b : a));
  return { high, low, from: window[0].period };
}
