import { describe, expect, it } from "vitest";
import { taxByBrackets, validateBrackets, type Bracket } from "./brackets";

// Test fixture only — not real Portuguese brackets.
const FIXTURE: Bracket[] = [
  { upTo: 10_000, rate: 0.1 },
  { upTo: 20_000, rate: 0.2 },
  { upTo: null, rate: 0.4 },
];

describe("taxByBrackets", () => {
  it("returns zero for zero or negative income", () => {
    expect(taxByBrackets(0, FIXTURE).tax).toBe(0);
    expect(taxByBrackets(-500, FIXTURE).tax).toBe(0);
    expect(taxByBrackets(0, FIXTURE).averageRate).toBe(0);
  });

  it("taxes income inside the first bracket at the first rate", () => {
    const r = taxByBrackets(5_000, FIXTURE);
    expect(r.tax).toBe(500);
    expect(r.marginalRate).toBe(0.1);
    expect(r.averageRate).toBeCloseTo(0.1);
  });

  it("splits income across brackets progressively", () => {
    const r = taxByBrackets(25_000, FIXTURE);
    // 10 000 × 10% + 10 000 × 20% + 5 000 × 40%
    expect(r.tax).toBe(1_000 + 2_000 + 2_000);
    expect(r.marginalRate).toBe(0.4);
    expect(r.averageRate).toBeCloseTo(5_000 / 25_000);
    expect(r.slices.map((s) => s.taxedAmount)).toEqual([10_000, 10_000, 5_000]);
  });

  it("treats a bracket limit as belonging to the lower bracket", () => {
    const r = taxByBrackets(10_000, FIXTURE);
    expect(r.tax).toBe(1_000);
    expect(r.marginalRate).toBe(0.1);
    expect(r.slices).toHaveLength(1);
  });
});

describe("validateBrackets", () => {
  it("rejects non-increasing limits", () => {
    expect(() => validateBrackets([{ upTo: 10, rate: 0.1 }, { upTo: 5, rate: 0.2 }, { upTo: null, rate: 0.3 }])).toThrow();
  });
  it("requires an open last bracket", () => {
    expect(() => validateBrackets([{ upTo: 10, rate: 0.1 }])).toThrow();
  });
});
