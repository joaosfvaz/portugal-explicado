import { describe, expect, it } from "vitest";
import { abono } from "./abono";
import { desemprego } from "./desemprego";
import { IAS, RMMG_2026 } from "./rules-2026";

describe("abono", () => {
  it("matches the published escalão limits for 2025 income", () => {
    const r = abono({ householdIncome: 0, children: 1, childAgeMonths: 12, singleParent: false, ias: IAS[2025] });
    expect(r.limits).toEqual([3657.5, 7315, 12435.5, 18287.5]);
  });

  it("uses the reference income: household income divided by children plus one", () => {
    // 20 000 € with 2 children → 6 666,67 € → 2.º escalão (2025 limits)
    const r = abono({ householdIncome: 20_000, children: 2, childAgeMonths: 24, singleParent: false, ias: IAS[2025] });
    expect(r.escalao).toBe(2);
    expect(r.monthly).toBe(161.65);
  });

  it("adds 50% for single-parent families", () => {
    const r = abono({ householdIncome: 3000, children: 1, childAgeMonths: 20, singleParent: true, ias: IAS[2025] });
    expect(r.escalao).toBe(1);
    expect(r.monthly).toBe(286.47);
  });

  it("pays no 4.º escalão after 72 months and nothing in the 5.º escalão", () => {
    expect(abono({ householdIncome: 30_000, children: 1, childAgeMonths: 80, singleParent: false, ias: IAS[2025] })).toMatchObject({ escalao: 4, monthly: 0 });
    expect(abono({ householdIncome: 50_000, children: 1, childAgeMonths: 80, singleParent: false, ias: IAS[2025] }).escalao).toBeNull();
  });

  it("tops up to the Garantia para a Infância in extreme low income", () => {
    const r = abono({ householdIncome: 4000, children: 1, childAgeMonths: 60, singleParent: false, ias: IAS[2025] });
    expect(r.garantia).toBe(52.2);
  });
});

describe("desemprego", () => {
  const base = { age: 35, monthsContributed: 30, monthsInLast24: 20, fiveYearBlocks: 0, bonus: false, rmmg: RMMG_2026 };

  it("pays 65% of the reference including holiday and Christmas pay", () => {
    const r = desemprego({ ...base, monthlySalary: 1500 });
    expect(r.referenceMonthly).toBe(1750);
    expect(r.monthly).toBe(1137.5);
  });

  it("applies the minimum and the maximum", () => {
    expect(desemprego({ ...base, monthlySalary: 500 })).toMatchObject({ monthly: 537.13, appliedLimit: "minimum" });
    expect(desemprego({ ...base, monthlySalary: 4000 })).toMatchObject({ monthly: 1342.83, appliedLimit: "maximum" });
  });

  it("reads the duration table with extra days per 5 years", () => {
    expect(desemprego({ ...base, monthlySalary: 1500, age: 52, monthsContributed: 30, fiveYearBlocks: 2 }).days).toBe(660);
    expect(desemprego({ ...base, monthlySalary: 1500, age: 25, monthsContributed: 10 }).days).toBe(150);
  });

  it("requires 12 months of salaries in the last 24", () => {
    expect(desemprego({ ...base, monthlySalary: 1500, monthsInLast24: 11 })).toMatchObject({ eligible: false, days: 0 });
  });
});
