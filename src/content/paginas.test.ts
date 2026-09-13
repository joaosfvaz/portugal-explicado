import { describe, expect, it } from "vitest";
import { NEXT_BY_PREFIX, PAGE_NEXT, PAGES, nextPages, pageTitle } from "./paginas";
import { NAV } from "../lib/nav";

describe("page list", () => {
  it("has a title for every page named in «A seguir»", () => {
    const targets = [...PAGES.flatMap((p) => p.next ?? []), ...Object.values(PAGE_NEXT).flat(), ...NEXT_BY_PREFIX.flatMap((n) => n.next)];
    for (const href of targets) expect(pageTitle(href), href).toBeTruthy();
  });

  it("has an entry for every page in the menu, so search finds them", () => {
    const listed = new Set([...PAGES.map((p) => p.href), "/", "/pesquisa", "/vida/nif", "/vida/cartao-de-cidadao", "/vida/autorizacao-de-residencia", "/vida/seguranca-social-e-sns", "/vida/criar-empresa", "/vida/carro", "/estado/presidente", "/estado/assembleia", "/estado/governo", "/estado/tribunais", "/estado/regioes-e-autarquias"]);
    for (const g of NAV) {
      if (g.href) expect(listed.has(g.href), g.href).toBe(true);
      for (const i of g.items) expect(listed.has(i.href), i.href).toBe(true);
    }
  });

  it("uses detail-page rules and never links a page to itself", () => {
    expect(nextPages("/estado/municipios/braga").map((p) => p.href)).toContain("/estado/municipios");
    expect(nextPages("/economia").map((p) => p.href)).not.toContain("/economia");
    expect(nextPages("/marca")).toEqual([]);
  });
});
