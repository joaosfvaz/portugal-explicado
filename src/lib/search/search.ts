export type SearchKind = "pagina" | "guia" | "passo-a-passo" | "palavra" | "indicador" | "instituicao" | "eleicao" | "municipio" | "data";

export type SearchDoc = {
  href: string;
  title: string;
  summary: string;
  kind: SearchKind;
  /** Menu group label, shown next to the result. */
  section?: string;
  keywords?: string[];
};

export type SearchResult = { doc: SearchDoc; score: number };

export const KIND_LABEL: Record<SearchKind, string> = {
  pagina: "Página",
  guia: "Guia",
  "passo-a-passo": "Passo a passo",
  palavra: "Palavra",
  indicador: "Número",
  instituicao: "Instituição",
  eleicao: "Eleição",
  municipio: "Município",
  data: "Data",
};

/** Small words that say nothing about the subject. "o que é o IRS" searches for "irs". */
const STOPWORDS = new Set(
  "a o as os e de do da dos das em no na nos nas um uma uns umas para por com sem que se ao aos eu me meu minha meus minhas mim sou tenho ter quero como qual quais onde quando quanto quanta ha isto isso sobre mais muito".split(" "),
);

/** Lower case, no accents, only letters, digits and spaces. "Salário-mínimo" → "salario minimo". */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9%]+/g, " ")
    .trim();
}

export function queryTokens(query: string): string[] {
  const words = normalize(query).split(" ").filter(Boolean);
  const meaningful = words.filter((w) => !STOPWORDS.has(w));
  // A query of only small words ("o que é") still searches for them.
  return meaningful.length > 0 ? meaningful : words;
}

/** A word matches a token when it starts with it, or when both share a long start ("salarios" and "salario"). */
function wordMatches(word: string, token: string): boolean {
  if (word.startsWith(token)) return true;
  return token.length >= 5 && word.length >= 4 && token.startsWith(word.slice(0, Math.max(4, word.length - 2)));
}

function fieldMatches(words: string[], token: string): boolean {
  return words.some((w) => wordMatches(w, token));
}

type Prepared = { doc: SearchDoc; title: string[]; keywords: string[]; keywordPhrases: string[]; summary: string[] };

const KIND_WEIGHT: Record<SearchKind, number> = {
  pagina: 4,
  guia: 4,
  "passo-a-passo": 4,
  palavra: 2,
  instituicao: 2,
  eleicao: 1,
  indicador: 1,
  data: 0,
  municipio: 0,
};

export function prepare(docs: SearchDoc[]): Prepared[] {
  return docs.map((doc) => {
    const keywordPhrases = (doc.keywords ?? []).map(normalize);
    return {
      doc,
      title: normalize(doc.title).split(" "),
      keywords: keywordPhrases.join(" ").split(" ").filter(Boolean),
      keywordPhrases,
      summary: normalize(doc.summary).split(" "),
    };
  });
}

function scoreDoc(p: Prepared, tokens: string[], phrase: string, requireAll: boolean): number {
  let score = 0;
  let matched = 0;
  for (const token of tokens) {
    let best = 0;
    if (p.title.includes(token)) best = 12;
    else if (fieldMatches(p.title, token)) best = 9;
    else if (p.keywords.includes(token)) best = 8;
    else if (fieldMatches(p.keywords, token)) best = 6;
    else if (fieldMatches(p.summary, token)) best = 2;
    if (best > 0) matched++;
    score += best;
  }
  if (matched === 0 || (requireAll && matched < tokens.length)) return 0;
  const title = p.title.join(" ");
  if (title === phrase) score += 30;
  else if (phrase.length > 2 && title.startsWith(phrase)) score += 15;
  if (p.keywordPhrases.includes(phrase)) score += 15;
  // Municípios and dates only show when the title itself matches, so "casa" does not list 308 concelhos.
  if ((p.doc.kind === "municipio" || p.doc.kind === "data") && !tokens.some((t) => fieldMatches(p.title, t))) return 0;
  return score + KIND_WEIGHT[p.doc.kind] + (matched / tokens.length) * 5;
}

/**
 * Results for a query, best first. First every word must match; when nothing matches every word, results that
 * match some words are returned with `partial: true`.
 */
export function search(index: Prepared[], query: string, limit = 30): { results: SearchResult[]; partial: boolean } {
  const tokens = queryTokens(query);
  if (tokens.length === 0) return { results: [], partial: false };
  const phrase = tokens.join(" ");
  const run = (requireAll: boolean) =>
    index
      .map((p) => ({ doc: p.doc, score: scoreDoc(p, tokens, phrase, requireAll) }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || a.doc.title.localeCompare(b.doc.title, "pt"))
      .slice(0, limit);
  const all = run(true);
  if (all.length > 0 || tokens.length === 1) return { results: all, partial: false };
  return { results: run(false), partial: true };
}
