import { cache } from "react";
import { readSnapshot } from "@/lib/snapshots";
import { INDICATORS, type EconomiaSnapshot, type IndicatorDef, type IndicatorSnapshot } from "./indicators";
import type { Point } from "./jsonstat";

export const getEconomia = cache(() => readSnapshot<EconomiaSnapshot>("economia.json"));

export type IndicatorView = { def: IndicatorDef; snap: IndicatorSnapshot; latest: Point; previous: Point | null };

export function indicatorViews(): IndicatorView[] {
  const snap = getEconomia();
  if (!snap) return [];
  const bySlug = new Map(snap.indicators.map((i) => [i.slug, i]));
  return INDICATORS.flatMap((def) => {
    const s = bySlug.get(def.slug);
    const pt = s?.series.PT;
    if (!s || !pt?.length) return [];
    return [{ def, snap: s, latest: pt.at(-1)!, previous: pt.at(-2) ?? null }];
  });
}

export { formatChange, formatValue, periodLabel, periodShort, periodYear } from "./format";
