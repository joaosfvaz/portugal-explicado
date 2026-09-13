import { describe, expect, it } from "vitest";
import { imtByTable } from "./imt";
import { purchaseCosts, type PurchaseInput } from "./purchase";
import { IMT_2026 } from "./rules-2026";

describe("imtByTable", () => {
  it("is continuous at every progressive bracket limit (parcelas match the AT table)", () => {
    for (const table of [IMT_2026.hpp, IMT_2026.secondary]) {
      for (let k = 0; k < table.length - 3; k++) {
        const limit = table[k].upTo;
        const below = imtByTable(limit, table).tax;
        const above = imtByTable(limit + 0.01, table).tax;
        expect(Math.abs(above - below)).toBeLessThan(1);
      }
    }
  });

  it("computes HPP examples", () => {
    expect(imtByTable(100_000, IMT_2026.hpp).tax).toBe(0);
    expect(imtByTable(200_000, IMT_2026.hpp).tax).toBe(3542.04);
    expect(imtByTable(700_000, IMT_2026.hpp).tax).toBe(42_000);
  });

  it("exempts young buyers up to 330 539 € and taxes only the excess at 8%", () => {
    expect(imtByTable(330_539, IMT_2026.hppYoung).tax).toBe(0);
    expect(imtByTable(400_000, IMT_2026.hppYoung).tax).toBe(5556.88);
  });
});

describe("purchaseCosts", () => {
  const base: PurchaseInput = {
    price: 250_000,
    purpose: "hpp",
    young: false,
    nonResident: false,
    loan: 225_000,
    annualRate: 0.03,
    years: 30,
    variableRate: true,
    oldestBorrowerAge: 40,
    route: "casa-pronta",
    bankFees: 0,
    netMonthlyIncome: 3000,
    otherMonthlyDebt: 0,
  };

  it("adds IMT, stamp duty and Casa Pronta", () => {
    const r = purchaseCosts(base);
    expect(r.imt).toBe(7042.04);
    expect(r.seloPurchase).toBe(2000);
    expect(r.seloLoan).toBe(1350);
    expect(r.registo).toBe(700);
    expect(r.cashNeeded).toBe(25_000 + 7042.04 + 2000 + 1350 + 700);
  });

  it("applies the young buyer rules", () => {
    const r = purchaseCosts({ ...base, young: true, oldestBorrowerAge: 30 });
    expect(r.imt).toBe(0);
    expect(r.seloPurchase).toBe(0);
    expect(r.seloLoan).toBe(1350);
    expect(r.registo).toBe(250);
    expect(r.garantiaPublica).toBe(true);
  });

  it("uses 7,5% for non-residents with no young exemption", () => {
    expect(purchaseCosts({ ...base, nonResident: true, young: true }).imt).toBe(18_750);
  });

  it("checks the Banco de Portugal limits with the rate shock", () => {
    const r = purchaseCosts({ ...base, loan: 240_000, years: 38 });
    expect(r.checks.ltvOk).toBe(false);
    expect(r.checks.yearsOk).toBe(false);
    expect(r.stressedPayment).toBeGreaterThan(r.payment);
  });
});
