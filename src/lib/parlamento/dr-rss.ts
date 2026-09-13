import type { DrAct } from "./types";

// Sumários in the Série I feed start with a verb in the third person. The issuer
// (e.g. "Presidência do Conselho de Ministros - Secretaria-Geral do Governo") comes
// before it with no separator, so the first known verb marks the split.
const SUMMARY_START =
  /\s(?=(?:Aprova|Altera|Ratifica|Retifica|Procede|Estabelece|Determina|Declara|Regulamenta|Regula|Fixa|Cria|Autoriza|Designa|Nomeia|Exonera|Prorroga|Define|Torna|Publica|Revoga|Transpõe|Atualiza|Consagra|Reconhece|Homologa|Concede|Adota|Recomenda|Suspende|Identifica|Delega|Institui|Clarifica|Reforça|Introduz|Assegura|Promove|Extingue|Converte|Prevê|Adapta|Confirma|Elege|Resolve|Viabiliza|Implementa|Aplica|Dá|Mantém|Integra|Renova|Condecora|Deslocação|Primeira|Segunda|Terceira|Quarta|Quinta|Sexta|Sétima|Oitava|Nona|Décima)\b)/;

const decodeEntities = (s: string) =>
  s
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&");

const text = (raw: string | undefined) =>
  decodeEntities((raw ?? "").replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1"))
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const tag = (item: string, name: string) => item.match(new RegExp(`<${name}[^>]*>([\\s\\S]*?)</${name}>`))?.[1];

export function splitIssuer(description: string): { issuer: string | null; summary: string } {
  const m = SUMMARY_START.exec(description);
  if (!m || m.index === 0) return { issuer: null, summary: description };
  return { issuer: description.slice(0, m.index).trim(), summary: description.slice(m.index).trim() };
}

export function parseTitle(title: string) {
  // "Portaria n.º 430-A/2026/1  -  Diário da República n.º 177/2026, Suplemento, Série I de 2026-09-11"
  const [actPart] = title.split(/\s+-\s+Diário da República/);
  const actType = actPart.replace(/\s+n\.º.*$/, "").trim();
  const number = actPart.match(/n\.º\s+(\S+)/)?.[1] ?? null;
  const diarioDate = title.match(/de (\d{4}-\d{2}-\d{2})\s*$/)?.[1] ?? null;
  return { actType, number, diarioDate, actTitle: actPart.trim() };
}

/**
 * Parses the Série I RSS feeds. The HTML feed has the detail link and the sumário;
 * the PDF feed has the PDF link. Both repeat items (one per embedded image), so
 * items are merged by title.
 */
export function parseSerie1(htmlFeed: string, pdfFeed: string, seenOn: string): DrAct[] {
  const pdfByTitle = new Map<string, string>();
  for (const item of pdfFeed.match(/<item>[\s\S]*?<\/item>/g) ?? []) {
    const title = text(tag(item, "title"));
    const link = text(tag(item, "link"));
    if (title && link && !pdfByTitle.has(title)) pdfByTitle.set(title, link);
  }

  const acts = new Map<string, DrAct>();
  for (const item of htmlFeed.match(/<item>[\s\S]*?<\/item>/g) ?? []) {
    const title = text(tag(item, "title"));
    if (!title || acts.has(title)) continue;
    const { actType, number, diarioDate, actTitle } = parseTitle(title);
    const { issuer, summary } = splitIssuer(text(tag(item, "description")));
    acts.set(title, {
      title: actTitle,
      actType,
      number,
      diarioDate,
      issuer,
      summary,
      url: text(tag(item, "link")),
      pdfUrl: pdfByTitle.get(title) ?? null,
      firstSeen: seenOn,
    });
  }
  return [...acts.values()];
}
