import { describe, expect, it } from "vitest";
import { ELECTIONS, getElection } from "./eleicoes";

const sum = (xs: (number | null)[]) => xs.reduce<number>((s, x) => s + (x ?? 0), 0);

describe("election data", () => {
  it("has unique ids", () => {
    expect(new Set(ELECTIONS.map((e) => e.id)).size).toBe(ELECTIONS.length);
  });

  it("allocates every seat", () => {
    for (const id of ["legislativas-2025", "europeias-2024", "regionais-acores-2024", "regionais-madeira-2025"]) {
      const e = getElection(id)!;
      expect(sum(e.rounds[0].results.map((r) => r.seats)), id).toBe(e.seatsTotal);
    }
  });

  it("counts all 308 câmaras in 2025 and 2021", () => {
    const e = getElection("autarquicas-2025")!;
    expect(sum(e.rounds[0].results.map((r) => r.seats))).toBe(308);
    expect(sum(e.groups!.results.map((r) => r.seats))).toBe(308);
    expect(sum(e.groups!.results.map((r) => r.previousSeats))).toBe(308);
  });

  it("has the 2024 legislativas seats that add up to 230 with Madeira Primeiro (3)", () => {
    const e = getElection("legislativas-2025")!;
    expect(sum(e.rounds[0].results.map((r) => r.previousSeats)) + 3).toBe(230);
  });

  it("has percentages that add up to about 100 when every list is shown", () => {
    for (const id of ["presidenciais-2026", "europeias-2024", "regionais-acores-2024", "regionais-madeira-2025", "referendo-2007"]) {
      for (const round of getElection(id)!.rounds) {
        expect(Math.abs(sum(round.results.map((r) => r.pct)) - 100), `${id} ${round.label}`).toBeLessThan(0.05);
      }
    }
  });

  it("has turnout consistent with voters and registered", () => {
    for (const e of ELECTIONS) {
      for (const r of e.rounds) {
        if (r.voters === null || r.registered === null || r.turnoutPct === null) continue;
        expect(Math.abs((r.voters / r.registered) * 100 - r.turnoutPct), `${e.id} ${r.label}`).toBeLessThan(0.01);
      }
    }
  });

  it("marks exactly one winner in presidential rounds that elect", () => {
    const final = getElection("presidenciais-2026")!.rounds.at(-1)!;
    expect(final.results.filter((r) => r.elected)).toHaveLength(1);
  });
});
