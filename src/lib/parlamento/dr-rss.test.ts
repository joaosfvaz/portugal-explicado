import { describe, expect, it } from "vitest";
import { parseSerie1, parseTitle, splitIssuer } from "./dr-rss";

const item = (title: string, link: string, description = "") => `<item>
        <title>${title}</title>
    <description type="html">
        <![CDATA[${description}]]></description>
    <link><![CDATA[${link}]]></link>
</item>`;

const TITLE = "Portaria n.º 430-A/2026/1  -  Diário da República n.º 177/2026, Suplemento, Série I de 2026-09-11";

describe("parseTitle", () => {
  it("splits type, number and date", () => {
    expect(parseTitle(TITLE)).toEqual({ actType: "Portaria", number: "430-A/2026/1", diarioDate: "2026-09-11", actTitle: "Portaria n.º 430-A/2026/1" });
    expect(parseTitle("Decreto do Presidente da República n.º 141/2026  -  Diário da República n.º 177/2026, Série I de 2026-09-11").actType).toBe(
      "Decreto do Presidente da República",
    );
  });
});

describe("splitIssuer", () => {
  it("separates multi-word issuers from the sumário", () => {
    expect(splitIssuer("Presidência do Conselho de Ministros - Secretaria-Geral do Governo Retifica a Portaria n.º 295/2026/1.")).toEqual({
      issuer: "Presidência do Conselho de Ministros - Secretaria-Geral do Governo",
      summary: "Retifica a Portaria n.º 295/2026/1.",
    });
    expect(splitIssuer("Finanças e Ambiente e Energia Procede à revisão das taxas.")).toEqual({
      issuer: "Finanças e Ambiente e Energia",
      summary: "Procede à revisão das taxas.",
    });
  });

  it("keeps the full text when no verb is found", () => {
    expect(splitIssuer("Texto sem verbo conhecido")).toEqual({ issuer: null, summary: "Texto sem verbo conhecido" });
  });
});

describe("parseSerie1", () => {
  it("merges both feeds and removes repeated items", () => {
    const html = item(TITLE, "https://diariodarepublica.pt/dr/detalhe/portaria/430-a-2026-1", "Agricultura e Mar Procede à sétima alteração.");
    const pdf = item(TITLE, "https://files.diariodarepublica.pt/1s/2026/09/17701/0000200003.pdf");
    const acts = parseSerie1(html + html, pdf + pdf, "2026-09-12");
    expect(acts).toHaveLength(1);
    expect(acts[0]).toMatchObject({
      actType: "Portaria",
      issuer: "Agricultura e Mar",
      summary: "Procede à sétima alteração.",
      pdfUrl: "https://files.diariodarepublica.pt/1s/2026/09/17701/0000200003.pdf",
      firstSeen: "2026-09-12",
    });
  });
});
