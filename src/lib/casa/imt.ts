import type { ImtBracket } from "./rules-2026";

const r2 = (n: number) => Math.round(n * 100) / 100;

/** IMT by CIMT art. 17.º: value × marginal rate − parcela a abater, or a single rate on the whole value. */
export function imtByTable(value: number, table: ImtBracket[]) {
  const v = Math.max(0, value);
  const bracket = table.find((b) => v <= b.upTo) ?? table.at(-1)!;
  const tax = bracket.flat ? v * bracket.rate : v * bracket.rate - bracket.deduct;
  return { tax: r2(Math.max(0, tax)), bracket, averageRate: v ? Math.max(0, tax) / v : 0 };
}
