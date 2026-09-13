import { describe, expect, it } from "vitest";
import { GLOSSARY } from "../content/glossario";
import { glossParts } from "./glossary";

const ids = (text: string) => glossParts(text).flatMap((p) => (typeof p === "string" ? [] : [p.id]));

describe("glossary matching", () => {
  it("marks known words and keeps the text intact", () => {
    const text = "A taxa de esforço sobe quando a Euribor sobe.";
    const parts = glossParts(text);
    expect(parts.map((p) => (typeof p === "string" ? p : p.text)).join("")).toBe(text);
    expect(ids(text)).toEqual(["taxa-de-esforco", "euribor"]);
  });

  it("matches acronyms only in capitals and never inside other words", () => {
    expect(ids("O IRS de 2026")).toEqual(["irs"]);
    expect(ids("irs")).toEqual([]);
    expect(ids("Faltam 30 dias")).toEqual([]);
  });

  it("explains each word once per call", () => {
    expect(ids("O IRS e outra vez o IRS")).toEqual(["irs"]);
  });

  it("does not treat 'deu entrada' as the house down payment", () => {
    expect(ids("A iniciativa deu entrada na Assembleia")).toEqual([]);
  });

  it("has unique ids and a short definition for every entry", () => {
    expect(new Set(GLOSSARY.map((g) => g.id)).size).toBe(GLOSSARY.length);
    for (const g of GLOSSARY) expect(g.short.length).toBeLessThan(200);
  });
});
