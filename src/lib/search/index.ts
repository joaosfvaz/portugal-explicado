import { PAGES } from "@/content/paginas";
import { GUIDES } from "@/content/vida";
import { INSTITUTIONS } from "@/content/estado";
import { CHECKLISTS } from "@/content/vou";
import { GLOSSARY } from "@/content/glossario";
import { ELECTIONS } from "@/content/eleicoes";
import { DEADLINES } from "@/content/prazos";
import { INDICATORS } from "@/lib/economia/indicators";
import { CONTEXT } from "@/lib/economia/context";
import { getMunicipios } from "@/lib/municipios/data";
import { activeItem } from "@/lib/nav";
import { prepare, type SearchDoc } from "./search";

const section = (href: string) => activeItem(href.split("#")[0])?.group.label;

/** Everyday words for guide pages, which come from src/content/vida.ts. */
const GUIDE_KEYWORDS: Record<string, string[]> = {
  nif: ["numero de contribuinte", "contribuinte", "financas"],
  "cartao-de-cidadao": ["cc", "bilhete de identidade", "bi", "renovar", "documento de identificacao"],
  "autorizacao-de-residencia": ["aima", "sef", "visto", "imigrante", "estrangeiro", "residencia"],
  "seguranca-social-e-sns": ["niss", "numero de utente", "centro de saude", "sns"],
  "criar-empresa": ["abrir atividade", "recibos verdes", "independente", "empresa na hora", "negocio"],
  carro: ["iuc", "imposto unico de circulacao", "inspecao", "automovel", "multa"],
};

/** Everyday words for economy indicators, whose titles use technical names. */
const INDICATOR_KEYWORDS: Record<string, string[]> = {
  "crescimento-pib": ["produto interno bruto", "crescimento da economia", "producao do pais"],
  "crescimento-pib-trimestral": ["produto interno bruto", "crescimento da economia", "producao do pais"],
  "pib-per-capita": ["produto interno bruto", "riqueza por pessoa", "nivel de vida"],
  inflacao: ["precos", "custo de vida", "subida dos precos", "ipc"],
  gasoleo: ["combustivel", "diesel", "gasolina", "preco da bomba"],
  "gasolina-95": ["combustivel", "preco da bomba"],
  "gpl-auto": ["combustivel", "gas"],
  "juro-credito-habitacao": ["euribor", "prestacao da casa", "juros"],
  "juros-divida": ["obrigacoes", "taxa de juro do estado"],
  "saldo-orcamental": ["defice", "excedente", "contas publicas"],
};

/** Every searchable thing on the site, as plain data. Built at build time and sent to the search page. */
export function searchDocs(): SearchDoc[] {
  const today = new Date().toISOString().slice(0, 10);
  const docs: SearchDoc[] = [];

  for (const p of PAGES) docs.push({ href: p.href, title: p.title, summary: p.summary, keywords: p.keywords, kind: "pagina", section: section(p.href) });

  for (const g of GUIDES) {
    docs.push({ href: `/vida/${g.slug}`, title: g.title.pt, summary: g.summary.pt, keywords: GUIDE_KEYWORDS[g.slug], kind: "guia", section: section(`/vida/${g.slug}`) });
  }
  for (const c of CHECKLISTS) {
    docs.push({ href: `/vida/vou/${c.id}`, title: c.title, summary: c.lead, kind: "passo-a-passo", section: section(`/vida/vou/${c.id}`) });
  }
  for (const i of INSTITUTIONS) {
    docs.push({ href: `/estado/${i.slug}`, title: i.title.pt, summary: i.summary.pt, kind: "instituicao", section: section(`/estado/${i.slug}`) });
  }
  for (const e of GLOSSARY) {
    docs.push({ href: `/glossario#${e.id}`, title: e.term, summary: e.short, keywords: e.match, kind: "palavra", section: "Palavras difíceis" });
  }
  for (const ind of INDICATORS) {
    docs.push({ href: `/economia/${ind.slug}`, title: ind.title, summary: CONTEXT[ind.slug]?.plain ?? "", keywords: INDICATOR_KEYWORDS[ind.slug], kind: "indicador", section: section(`/economia/${ind.slug}`) });
  }
  for (const e of ELECTIONS) {
    docs.push({ href: `/estado/eleicoes/${e.id}`, title: e.title, summary: e.chooses, kind: "eleicao", section: section(`/estado/eleicoes/${e.id}`) });
  }
  // Repeating deadlines (every quarter, every year) appear once, with the next date.
  const seenDeadlines = new Set<string>();
  for (const d of [...DEADLINES].sort((a, b) => a.end.localeCompare(b.end))) {
    if (d.info || d.end < today || seenDeadlines.has(d.title)) continue;
    seenDeadlines.add(d.title);
    docs.push({ href: "/vida/prazos", title: d.title, summary: d.action, kind: "data", section: "Datas a não esquecer" });
  }
  for (const m of getMunicipios()?.municipios ?? []) {
    docs.push({ href: `/estado/municipios/${m.slug}`, title: m.name, summary: m.district.startsWith("Região") ? `Concelho da ${m.district}.` : `Concelho do distrito: ${m.district}.`, kind: "municipio", section: "O meu município" });
  }

  return docs;
}

export const searchIndex = () => prepare(searchDocs());
