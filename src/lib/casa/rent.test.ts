import { describe, expect, it } from "vitest";
import { article72Rate, landlordTax, tenantDeduction, updatedRent } from "./rent";

describe("updatedRent", () => {
  it("applies the coefficient and rounds up to the next cent", () => {
    expect(updatedRent(750, [1.0224])).toBe(766.8);
    expect(updatedRent(733.33, [1.0224])).toBe(749.76);
  });

  it("chains the coefficients of missed years", () => {
    expect(updatedRent(1000, [1.0216, 1.0224])).toBe(1044.49);
  });
});

describe("landlord tax", () => {
  it("uses the art. 72.º reductions", () => {
    expect(article72Rate(1)).toBe(0.25);
    expect(article72Rate(5)).toBe(0.15);
    expect(article72Rate(5, 3)).toBe(0.09);
    expect(article72Rate(12)).toBe(0.1);
    expect(article72Rate(20)).toBe(0.05);
  });

  it("applies the 10% moderate-rent rate unless a lower rate applies", () => {
    expect(landlordTax({ monthlyRent: 900, months: 12, expenses: 800, contractYears: 1, renewals: 0 })).toMatchObject({ rate: 0.1, tax: 1000 });
    expect(landlordTax({ monthlyRent: 900, months: 12, expenses: 0, contractYears: 20, renewals: 0 }).rate).toBe(0.05);
    expect(landlordTax({ monthlyRent: 2500, months: 12, expenses: 0, contractYears: 1, renewals: 0 }).rate).toBe(0.25);
  });
});

describe("tenantDeduction", () => {
  it("is 15% of rent up to the 2026 cap", () => {
    expect(tenantDeduction(4800, false)).toBe(720);
    expect(tenantDeduction(12_000, false)).toBe(900);
    expect(tenantDeduction(12_000, true)).toBe(1050);
  });
});

import { buildCosts } from "./build";

describe("buildCosts", () => {
  it("adds land taxes, VAT and the VAT refund for an own home under the cap", () => {
    const r = buildCosts({ landPrice: 80_000, landType: "construcao", area: 150, costPerM2: 1200, municipalFees: 5000, projectFees: 12_000, ownHome: true });
    expect(r.imt).toBe(5200);
    expect(r.selo).toBe(640);
    expect(r.vat).toBe(41_400);
    expect(r.refund).toBe(30_600);
    expect(r.total).toBe(80_000 + 5200 + 640 + 180_000 + 41_400 + 17_000);
  });

  it("gives no refund above the value cap", () => {
    expect(buildCosts({ landPrice: 300_000, landType: "construcao", area: 300, costPerM2: 1500, municipalFees: 0, projectFees: 0, ownHome: true }).refundEligible).toBe(false);
  });
});
