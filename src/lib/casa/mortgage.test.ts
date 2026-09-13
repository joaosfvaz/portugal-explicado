import { describe, expect, it } from "vitest";
import { monthlyPayment, totalInterest } from "./mortgage";

describe("monthlyPayment", () => {
  it("matches the annuity formula", () => {
    // 200 000 € at 3% for 30 years: 843,21 € (standard amortisation tables)
    expect(monthlyPayment(200_000, 0.03, 30)).toBeCloseTo(843.21, 2);
  });

  it("handles a zero rate and invalid input", () => {
    expect(monthlyPayment(120_000, 0, 10)).toBe(1000);
    expect(monthlyPayment(0, 0.03, 30)).toBe(0);
  });

  it("computes total interest", () => {
    expect(totalInterest(200_000, 0.03, 30)).toBeCloseTo(monthlyPayment(200_000, 0.03, 30) * 360 - 200_000, 6);
  });
});
