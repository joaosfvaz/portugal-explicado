import { describe, expect, it } from "vitest";
import { SPENDING_2024, SPENDING_TOTAL_2024, TAX_REVENUE_2026 } from "./orcamento";

describe("public spending data", () => {
  it("adds up to the Eurostat total", () => {
    expect(Math.round(SPENDING_2024.reduce((s, x) => s + x.amount, 0) * 10) / 10).toBe(SPENDING_TOTAL_2024);
  });

  it("adds up the 2026 State tax revenue to the proposal total of 67 065 M€", () => {
    expect(TAX_REVENUE_2026.reduce((s, x) => s + x.amount, 0)).toBe(67_065);
  });
});
