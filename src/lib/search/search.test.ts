import { describe, expect, it } from "vitest";
import { normalize, prepare, queryTokens, search, type SearchDoc } from "./search";

const DOCS: SearchDoc[] = [
  { href: "/trabalho/salario-liquido", title: "Quanto recebo líquido", summary: "Calcule quanto recebe na conta por mês.", keywords: ["salario", "ordenado"], kind: "pagina" },
  { href: "/trabalho/recibo-de-vencimento", title: "Perceber o recibo de vencimento", summary: "O que quer dizer cada linha do recibo.", kind: "pagina" },
  { href: "/economia/inflacao", title: "Inflação", summary: "Quanto sobem os preços.", kind: "indicador" },
  { href: "/glossario#irs", title: "IRS", summary: "O imposto sobre o rendimento das pessoas.", kind: "palavra" },
  { href: "/impostos/como-funciona-o-irs", title: "Como funciona o IRS", summary: "O IRS passo a passo.", kind: "pagina" },
  { href: "/estado/municipios/braga", title: "Braga", summary: "Concelho do distrito: Braga.", kind: "municipio" },
  { href: "/casa", title: "Casa", summary: "Arrendar, comprar ou construir casa.", kind: "pagina" },
];
const index = prepare(DOCS);
const hrefs = (q: string) => search(index, q).results.map((r) => r.doc.href);

describe("normalize", () => {
  it("removes accents, case and punctuation", () => {
    expect(normalize("Salário-Mínimo, Inflação!")).toBe("salario minimo inflacao");
  });

  it("drops small words but keeps a query made only of them", () => {
    expect(queryTokens("o que é o IRS")).toEqual(["irs"]);
    expect(queryTokens("o que")).toEqual(["o", "que"]);
  });
});

describe("search", () => {
  it("finds words typed without accents", () => {
    expect(hrefs("inflacao")[0]).toBe("/economia/inflacao");
  });

  it("finds a page by an everyday word that is not in its title", () => {
    expect(hrefs("ordenado")).toEqual(["/trabalho/salario-liquido"]);
  });

  it("finds a page from the start of a word", () => {
    expect(hrefs("recib")[0]).toBe("/trabalho/recibo-de-vencimento");
  });

  it("matches plurals", () => {
    expect(hrefs("salarios")).toContain("/trabalho/salario-liquido");
  });

  it("puts the exact title first", () => {
    expect(hrefs("IRS")[0]).toBe("/glossario#irs");
    expect(hrefs("como funciona o irs")[0]).toBe("/impostos/como-funciona-o-irs");
  });

  it("shows a município only when its name matches", () => {
    expect(hrefs("braga")).toEqual(["/estado/municipios/braga"]);
    expect(hrefs("distrito")).toEqual([]);
  });

  it("returns partial results, marked, when no result has every word", () => {
    const r = search(index, "recibo multa");
    expect(r.partial).toBe(true);
    expect(r.results[0].doc.href).toBe("/trabalho/recibo-de-vencimento");
  });

  it("returns nothing for an empty or unknown query", () => {
    expect(search(index, "  ").results).toEqual([]);
    expect(search(index, "xyzzy").results).toEqual([]);
  });
});
