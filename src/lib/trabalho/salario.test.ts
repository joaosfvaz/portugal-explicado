import { describe, expect, it } from "vitest";
import { RETENTION_2026 } from "./rules-2026";
import { findRow, monthlyRetention, netSalary, retentionTable } from "./salario";

const base = { household: "nao-casado" as const, dependents: 0, mealPerDay: 0, mealDays: 0, mealPaidBy: "dinheiro" as const };

describe("monthly retention, Despacho 233-A/2026", () => {
  it("withholds nothing up to 920 € (Tabela I) and 991 € (Tabela III)", () => {
    expect(monthlyRetention(920, "I", 0).irs).toBe(0);
    expect(monthlyRetention(991, "III", 0).irs).toBe(0);
    expect(monthlyRetention(921, "I", 0).irs).toBeGreaterThan(0);
  });

  it("uses the formula row: 1 000 € gives 36,00 €", () => {
    expect(monthlyRetention(1000, "I", 0).irs).toBe(36);
  });

  it("uses the constant row: 1 500 € gives 168,17 €", () => {
    expect(monthlyRetention(1500, "I", 0).irs).toBe(168.17);
  });

  it("joins the formula and constant rows without a jump at 1 108 €", () => {
    const rows = RETENTION_2026.I;
    const formulaRow = rows[2];
    const constantRow = rows[3];
    const byFormula = 1108 * formulaRow.rate - (formulaRow.deduct.type === "formula" ? formulaRow.deduct.rate * formulaRow.deduct.factor * (formulaRow.deduct.base - 1108) : 0);
    const byConstant = 1108 * constantRow.rate - (constantRow.deduct.type === "constant" ? constantRow.deduct.value : 0);
    expect(Math.abs(byFormula - byConstant)).toBeLessThan(0.01);
  });

  it("includes the upper limit in its own row", () => {
    expect(findRow(RETENTION_2026.I, 1819).rate).toBe(0.241);
    expect(findRow(RETENTION_2026.I, 1819.01).rate).toBe(0.311);
  });

  it("subtracts the amount per dependent and never goes below zero", () => {
    expect(monthlyRetention(1500, "II", 1).irs).toBe(round(1500 * 0.241 - 193.33 - 34.29));
    expect(monthlyRetention(950, "II", 4).irs).toBe(0);
  });

  it("lowers the rate by 1 p.p. with three or more dependents", () => {
    expect(monthlyRetention(2000, "II", 3).irs).toBe(round(2000 * 0.301 - 320.66 - 34.29 * 3));
  });
});

describe("table choice", () => {
  it("chooses the table from the household", () => {
    expect(retentionTable("nao-casado", 0)).toBe("I");
    expect(retentionTable("nao-casado", 2)).toBe("II");
    expect(retentionTable("casado-dois", 2)).toBe("I");
    expect(retentionTable("casado-um", 0)).toBe("III");
  });
});

describe("net salary", () => {
  it("matches the worked example for 1 000 €", () => {
    const r = netSalary({ ...base, gross: 1000 });
    expect(r.socialSecurity).toBe(110);
    expect(r.irs).toBe(36);
    expect(r.net).toBe(854);
    expect(r.employerSocialSecurity).toBe(237.5);
  });

  it("matches the worked example for 1 500 €", () => {
    const r = netSalary({ ...base, gross: 1500 });
    expect(r.net).toBe(1166.83);
    expect(r.netWithSubsidy).toBe(2333.66);
    expect(r.netYear).toBe(16335.62);
  });

  it("keeps the meal allowance tax-free up to the limit and taxes only the excess", () => {
    const cash = netSalary({ ...base, gross: 1000, mealPerDay: 8, mealDays: 20, mealPaidBy: "dinheiro" });
    expect(cash.mealExempt).toBe(123);
    expect(cash.mealTaxable).toBe(37);
    expect(cash.taxableBase).toBe(1037);
    const card = netSalary({ ...base, gross: 1000, mealPerDay: 8, mealDays: 20, mealPaidBy: "cartao" });
    expect(card.mealTaxable).toBe(0);
    expect(card.net).toBe(854 + 160);
  });

  it("counts the meal allowance in 11 months of the year and not in the subsidies", () => {
    const r = netSalary({ ...base, gross: 1000, mealPerDay: 8, mealDays: 20, mealPaidBy: "cartao" });
    expect(r.netWithSubsidy).toBe(1014 + 854);
    expect(r.netYear).toBe(1014 * 11 + 854 * 1 + 854 * 2);
  });
});

function round(n: number) {
  return Math.round(n * 100) / 100;
}
