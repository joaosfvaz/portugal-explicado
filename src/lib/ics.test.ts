import { describe, expect, it } from "vitest";
import { toIcs } from "./ics";

describe("toIcs", () => {
  const ics = toIcs(
    [{ uid: "irs", title: "IRS: entregar a declaração", description: "Entregue a declaração, com regras; e notas", start: "2027-04-01", end: "2027-06-30", url: "https://example.pt" }],
    "20260913T120000Z",
  );

  it("writes an all-day event that ends the day after the last day", () => {
    expect(ics).toContain("DTSTART;VALUE=DATE:20270401");
    expect(ics).toContain("DTEND;VALUE=DATE:20270701");
  });

  it("escapes commas and semicolons and uses CRLF line endings", () => {
    expect(ics).toContain("regras\\; e notas");
    expect(ics.split("\r\n")[0]).toBe("BEGIN:VCALENDAR");
    expect(ics.endsWith("END:VCALENDAR\r\n")).toBe(true);
  });

  it("folds long lines to 75 octets", () => {
    const long = toIcs([{ uid: "x", title: "É".repeat(80), description: "", start: "2027-01-01", end: "2027-01-01" }], "20260913T120000Z");
    for (const l of long.split("\r\n")) expect(new TextEncoder().encode(l).length).toBeLessThanOrEqual(75);
  });
});
