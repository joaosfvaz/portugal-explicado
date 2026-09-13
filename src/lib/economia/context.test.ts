import { describe, expect, it } from "vitest";
import { CONTEXT, contextSentences } from "./context";
import { INDICATORS } from "./indicators";

const def = { unit: "%" as const, digits: 1, frequency: "anual" as const };
const fmt = (v: number) => `${v.toFixed(1)}%`;

describe("context", () => {
  it("has plain context for every indicator", () => {
    for (const i of INDICATORS) expect(CONTEXT[i.slug], i.slug).toBeDefined();
  });

  it("finds the highest value since a past period", () => {
    const series = { PT: ["2018", "2019", "2020", "2021", "2022"].map((period, k) => ({ period, value: [5, 2, 3, 1, 4][k] })) };
    expect(contextSentences(def, { series }, fmt)[0]).toBe("É o valor mais alto desde 2018.");
  });

  it("compares with the EU average", () => {
    const series = { PT: [1, 2, 3, 2].map((value, k) => ({ period: String(2019 + k), value })), EU27_2020: [{ period: "2022", value: 3 }] };
    expect(contextSentences(def, { series }, fmt).at(-1)).toBe("Está abaixo da média da União Europeia, que é 3.0%.");
  });
});
