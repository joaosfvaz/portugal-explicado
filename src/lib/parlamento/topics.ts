/**
 * Everyday topics found in the official title of an initiative. Used only to choose which laws to show
 * first to ordinary readers. It matches words in the title; it never interprets what the law does.
 */

export type Topic = { id: string; label: string; pattern: RegExp };

export const TOPICS: Topic[] = [
  { id: "impostos", label: "Impostos", pattern: /\b(IRS|IVA|IMI|IMT|IUC|impost\w*|fiscal|fiscais|tribut\w*)\b/iu },
  { id: "casa", label: "Casa", pattern: /\b(habitaç\w*|arrendament\w*|rendas?|inquilin\w*|senhori\w*|imóve\w*|imobiliári\w*)\b/iu },
  { id: "trabalho", label: "Trabalho", pattern: /\b(trabalh\w*|salári\w*|emprego|desemprego|laborai?s?)\b/iu },
  { id: "pensoes", label: "Pensões", pattern: /\b(pens(ão|ões)|reformad\w*|aposentaç\w*|Segurança Social)\b/iu },
  { id: "saude", label: "Saúde", pattern: /\b(saúde|SNS|médic\w*|hospita\w*|medicament\w*)\b/iu },
  { id: "educacao", label: "Educação", pattern: /\b(escola\w*|ensino|educaç\w*|propinas?|creches?|professor\w*)\b/iu },
  { id: "familia", label: "Família", pattern: /\b(parentalidade|parental|crianças?|abono|natalidade|família\w*)\b/iu },
  { id: "transportes", label: "Transportes", pattern: /\b(transport\w*|portage\w*|combustíve\w*|passe)\b/iu },
];

/** Local or procedural matters that rarely affect most people: parish borders, town status, names. */
const LOCAL = /limites territoriais|elevaç\w* (d[aeo] )?(povoaç\w*|localidade|vila)|categoria de (vila|cidade)|denominaç\w* d[ao] freguesia|reposição d[ae] freguesia|criação d[ae] freguesia/iu;

export function titleTopics(title: string): Topic[] {
  if (LOCAL.test(title)) return [];
  return TOPICS.filter((t) => t.pattern.test(title));
}
