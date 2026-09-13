import { describe, expect, it } from "vitest";
import { extremes, pointAgo } from "./stats";

describe("pointAgo", () => {
  it("finds the same month one year before", () => {
    const pts = ["2025-07", "2025-08", "2026-07", "2026-08"].map((period, i) => ({ period, value: i }));
    expect(pointAgo(pts, 1)?.period).toBe("2025-08");
  });

  it("finds the nearest week and refuses a gap too large", () => {
    const pts = [
      { period: "2025-09-08", value: 1 },
      { period: "2026-09-07", value: 2 },
    ];
    expect(pointAgo(pts, 1)?.period).toBe("2025-09-08");
    expect(pointAgo(pts, 5)).toBeNull();
  });
});

describe("extremes", () => {
  it("limits the window to the last years", () => {
    const pts = [
      { period: "2020", value: 9 },
      { period: "2025", value: 1 },
      { period: "2026", value: 3 },
    ];
    expect(extremes(pts, 1)).toEqual({ high: { period: "2026", value: 3 }, low: { period: "2025", value: 1 }, from: "2025" });
    expect(extremes(pts, null)?.high.value).toBe(9);
  });
});
