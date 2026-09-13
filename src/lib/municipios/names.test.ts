import { describe, expect, it } from "vitest";
import { shortSigla, slugify, titleCase } from "./names";

describe("município names", () => {
  it("shortens party and coalition siglas", () => {
    expect(shortSigla("PPD/PSD")).toBe("PSD");
    expect(shortSigla("PPD/PSD.CDS-PP.IL")).toBe("PSD/CDS/IL");
    expect(shortSigla("PS.L.PAN")).toBe("PS/Livre/PAN");
    expect(shortSigla("PCP-PEV")).toBe("CDU");
  });
  it("builds slugs and readable names", () => {
    expect(slugify("Vila Nova de Gaia")).toBe("vila-nova-de-gaia");
    expect(slugify("Ílhavo")).toBe("ilhavo");
    expect(titleCase("VILA NOVA DE GAIA")).toBe("Vila Nova de Gaia");
    expect(titleCase("MONTEMOR-O-NOVO")).toBe("Montemor-o-Novo");
  });
});
