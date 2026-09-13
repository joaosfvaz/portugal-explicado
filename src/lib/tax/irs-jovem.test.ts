import { describe, expect, it } from "vitest";
import { getTaxYear } from "./data";
import { taxByBrackets } from "./brackets";
import { irsJovem } from "./irs-jovem";

const y2025 = getTaxYear(2025)!;
const y2026 = getTaxYear(2026)!;
const rules2025 = y2025.irsJovem.value;
const rules2026 = y2026.irsJovem.value;

describe("real bracket tables", () => {
  // The published average rate at the top of each bracket must match the
  // progressive calculation. This checks the data file and the engine together.
  for (const year of [y2025, y2026]) {
    it(`matches the published average rates for ${year.year}`, () => {
      for (const b of year.irsBrackets.value) {
        if (b.upTo === null || b.avgRateAtTop === undefined) continue;
        const r = taxByBrackets(b.upTo, year.irsBrackets.value);
        expect(r.averageRate).toBeCloseTo(b.avgRateAtTop, 5);
      }
    });
  }
});

describe("irsJovem — AT leaflet examples (Folheto IRS Jovem 2025)", () => {
  it("income since 2018, age 30 in 2025: 8th year, 25%", () => {
    const r = irsJovem({ taxYear: 2025, birthYear: 1995, firstIncomeYear: 2018, yearsNotCounted: 0, income: 20_000 }, rules2025);
    expect(r).toMatchObject({ eligible: true, incomeYear: 8, exemptionRate: 0.25, exemptIncome: 5_000 });
  });

  it("caso 1: started 2022 at 23, 4th year in 2025 (75%), 5th in 2026 (50%)", () => {
    const base = { birthYear: 1999, firstIncomeYear: 2022, yearsNotCounted: 0, income: 18_000 };
    expect(irsJovem({ ...base, taxYear: 2025 }, rules2025)).toMatchObject({ eligible: true, incomeYear: 4, exemptionRate: 0.75 });
    expect(irsJovem({ ...base, taxYear: 2026 }, rules2026)).toMatchObject({ eligible: true, incomeYear: 5, exemptionRate: 0.5 });
  });

  it("caso 1: 10th year in 2031 is the last; 2032 is outside the period", () => {
    const base = { birthYear: 1999, firstIncomeYear: 2022, yearsNotCounted: 0, income: 18_000 };
    expect(irsJovem({ ...base, taxYear: 2031 }, rules2026)).toMatchObject({ eligible: true, incomeYear: 10, exemptionRate: 0.25 });
    expect(irsJovem({ ...base, taxYear: 2032 }, rules2026)).toMatchObject({ eligible: false, reason: "period-ended" });
  });

  it("caso 2: dependent in 2017, first year 2018, age 36 in 2028 fails the age test", () => {
    const base = { birthYear: 1992, firstIncomeYear: 2018, yearsNotCounted: 0, income: 30_000 };
    expect(irsJovem({ ...base, taxYear: 2025 }, rules2025)).toMatchObject({ eligible: true, incomeYear: 8, age: 33 });
    expect(irsJovem({ ...base, taxYear: 2028 }, rules2026)).toMatchObject({ eligible: false, reason: "age", age: 36 });
  });

  it("caso 4: a year without income does not count", () => {
    // Dependent in 2016, income as taxpayer from 2017, no income in 2022.
    const base = { birthYear: 1991, firstIncomeYear: 2017, yearsNotCounted: 1, income: 25_000 };
    expect(irsJovem({ ...base, taxYear: 2025 }, rules2025)).toMatchObject({ eligible: true, incomeYear: 8, age: 34 });
    expect(irsJovem({ ...base, taxYear: 2026 }, rules2026)).toMatchObject({ eligible: true, incomeYear: 9, age: 35 });
    expect(irsJovem({ ...base, taxYear: 2027 }, rules2026)).toMatchObject({ eligible: false, reason: "age" });
  });
});

describe("irsJovem — cap", () => {
  it("never exempts more than 55 × IAS", () => {
    const r = irsJovem({ taxYear: 2026, birthYear: 2000, firstIncomeYear: 2026, yearsNotCounted: 0, income: 40_000 }, rules2026);
    expect(r).toMatchObject({ eligible: true, exemptionRate: 1, exemptIncome: 29_542.15, capApplied: true, taxableIncome: 10_457.85 });
  });

  it("caps the exempt amount after applying the rate", () => {
    const r = irsJovem({ taxYear: 2026, birthYear: 2000, firstIncomeYear: 2025, yearsNotCounted: 0, income: 50_000 }, rules2026);
    // 75% of 50 000 = 37 500, capped at 29 542,15
    expect(r).toMatchObject({ eligible: true, incomeYear: 2, exemptIncome: 29_542.15, capApplied: true });
  });

  it("rejects inconsistent input", () => {
    expect(irsJovem({ taxYear: 2026, birthYear: 2000, firstIncomeYear: 2020, yearsNotCounted: 9, income: 1 }, rules2026)).toMatchObject({ eligible: false, reason: "invalid" });
  });
});
