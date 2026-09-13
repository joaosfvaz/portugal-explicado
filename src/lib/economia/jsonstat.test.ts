import { describe, expect, it } from "vitest";
import { jsonStatSeries, type JsonStat } from "./jsonstat";

// Shape copied from a real Eurostat une_rt_a response (values trimmed).
const EUROSTAT: JsonStat = {
  id: ["freq", "age", "unit", "sex", "geo", "time"],
  size: [1, 1, 1, 1, 3, 4],
  dimension: {
    freq: { category: { index: { A: 0 } } },
    age: { category: { index: { "Y15-74": 0 } } },
    unit: { category: { index: { PC_ACT: 0 } } },
    sex: { category: { index: { T: 0 } } },
    geo: { category: { index: { EU27_2020: 0, ES: 1, PT: 2 } } },
    time: { category: { index: { "2022": 0, "2023": 1, "2024": 2, "2025": 3 } } },
  },
  value: { "0": 6.2, "3": 6.0, "7": 10.5, "8": 6.2, "11": 6.0 },
};

describe("jsonStatSeries", () => {
  it("splits by geo using row-major indexing and skips missing values", () => {
    const s = jsonStatSeries(EUROSTAT, "time", "geo");
    expect(s.get("EU27_2020")).toEqual([
      { period: "2022", value: 6.2 },
      { period: "2025", value: 6.0 },
    ]);
    expect(s.get("ES")).toEqual([{ period: "2025", value: 10.5 }]);
    expect(s.get("PT")).toEqual([
      { period: "2022", value: 6.2 },
      { period: "2025", value: 6.0 },
    ]);
  });

  it("reads array values and array indexes (BPstat shape)", () => {
    const bp: JsonStat = {
      id: ["70", "reference_date"],
      size: [1, 4],
      dimension: {
        "70": { category: { index: ["3327"] } },
        reference_date: { category: { index: ["2026-05-31", "2026-06-30", "2026-07-31", "2026-08-31"] } },
      },
      value: [3.42, 3.33, 3.44, 3.54],
    };
    expect(jsonStatSeries(bp, "reference_date").get("_")?.at(-1)).toEqual({ period: "2026-08-31", value: 3.54 });
  });

  it("refuses datasets with an unexpected extra breakdown", () => {
    const bad = { ...EUROSTAT, size: [1, 1, 2, 1, 3, 4] };
    expect(() => jsonStatSeries(bad, "time", "geo")).toThrow(/unit/);
  });
});
