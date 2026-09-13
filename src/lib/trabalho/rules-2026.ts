import type { SourceRef } from "@/components/ui";

/**
 * 2026 rules for a dependent worker's monthly pay in Portugal continental.
 * Retention tables: Despacho n.º 233-A/2026 (Tabelas I, II, III). Social Security: Código dos Regimes
 * Contributivos, art. 53.º. Meal allowance limit: Portaria n.º 51-B/2026/1 and CIRS art. 2.º n.º 3 b) 2).
 * Research notes: docs/research/salario.md.
 */

export type Deduct = { type: "constant"; value: number } | { type: "formula"; rate: number; factor: number; base: number };

export type RetentionRow = {
  /** Upper limit of the monthly pay for this row, inclusive. Null for the last row. */
  upTo: number | null;
  rate: number;
  deduct: Deduct;
  perDependent: number;
};

const c = (value: number): Deduct => ({ type: "constant", value });
const f = (rate: number, factor: number, base: number): Deduct => ({ type: "formula", rate, factor, base });

const SINGLE_OR_TWO_EARNERS = (perDependent: number): RetentionRow[] => [
  { upTo: 920, rate: 0, deduct: c(0), perDependent: 0 },
  { upTo: 1042, rate: 0.125, deduct: f(0.125, 2.6, 1273.85), perDependent },
  { upTo: 1108, rate: 0.157, deduct: f(0.157, 1.35, 1554.83), perDependent },
  { upTo: 1154, rate: 0.157, deduct: c(94.71), perDependent },
  { upTo: 1212, rate: 0.212, deduct: c(158.18), perDependent },
  { upTo: 1819, rate: 0.241, deduct: c(193.33), perDependent },
  { upTo: 2119, rate: 0.311, deduct: c(320.66), perDependent },
  { upTo: 2499, rate: 0.349, deduct: c(401.19), perDependent },
  { upTo: 3305, rate: 0.3836, deduct: c(487.66), perDependent },
  { upTo: 5547, rate: 0.3969, deduct: c(531.62), perDependent },
  { upTo: 20221, rate: 0.4495, deduct: c(823.4), perDependent },
  { upTo: null, rate: 0.4717, deduct: c(1272.31), perDependent },
];

export const RETENTION_2026 = {
  /** Tabela I: não casado sem dependentes, ou casado com dois titulares de rendimentos. */
  I: SINGLE_OR_TWO_EARNERS(21.43),
  /** Tabela II: não casado com um ou mais dependentes. */
  II: SINGLE_OR_TWO_EARNERS(34.29),
  /** Tabela III: casado, único titular de rendimentos. */
  III: [
    { upTo: 991, rate: 0, deduct: c(0), perDependent: 0 },
    { upTo: 1042, rate: 0.125, deduct: f(0.125, 2.6, 1372.15), perDependent: 42.86 },
    { upTo: 1108, rate: 0.125, deduct: f(0.125, 1.35, 1677.85), perDependent: 42.86 },
    { upTo: 1119, rate: 0.125, deduct: c(96.17), perDependent: 42.86 },
    { upTo: 1432, rate: 0.1272, deduct: c(98.64), perDependent: 42.86 },
    { upTo: 1962, rate: 0.157, deduct: c(141.32), perDependent: 42.86 },
    { upTo: 2240, rate: 0.1938, deduct: c(213.53), perDependent: 42.86 },
    { upTo: 2773, rate: 0.2277, deduct: c(289.47), perDependent: 42.86 },
    { upTo: 3389, rate: 0.257, deduct: c(370.72), perDependent: 42.86 },
    { upTo: 5965, rate: 0.2881, deduct: c(476.12), perDependent: 42.86 },
    { upTo: 20265, rate: 0.3843, deduct: c(1049.96), perDependent: 42.86 },
    { upTo: null, rate: 0.4717, deduct: c(2821.13), perDependent: 42.86 },
  ] satisfies RetentionRow[],
} as const;

export const SOCIAL_SECURITY_2026 = {
  worker: 0.11,
  employer: 0.2375,
};

export const MEAL_ALLOWANCE_2026 = {
  /** Exempt daily value when paid in cash. */
  cash: 6.15,
  /** Exempt daily value when paid by card or voucher: 70% above the cash limit. */
  card: 6.15 * 1.7,
};

export const CHECKED = "2026-09-13";

export const SALARY_SOURCES: SourceRef[] = [
  { title: "Despacho n.º 233-A/2026, tabelas de retenção na fonte de 2026 (continente)", url: "https://files.diariodarepublica.pt/2s/2026/01/003000001/0000200010.pdf", verifiedOn: CHECKED, verification: "primary" },
  { title: "Código dos Regimes Contributivos, art. 53.º (taxas) e arts. 44.º a 48.º (base)", url: "https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34514575", verifiedOn: CHECKED, verification: "primary" },
  { title: "Portaria n.º 51-B/2026/1, subsídio de refeição de 6,15 €", url: "https://diariodarepublica.pt/dr/detalhe/portaria/51-b-2026-1031110274", verifiedOn: CHECKED, verification: "primary" },
  { title: "Código do IRS, art. 2.º (subsídio de refeição) e art. 99.º-C (retenção de subsídios e horas extra)", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs99c.aspx", verifiedOn: CHECKED, verification: "primary" },
  { title: "Código do Trabalho, arts. 263.º, 264.º, 268.º, 276.º e 279.º", url: "https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2009-34546475", verifiedOn: CHECKED, verification: "primary" },
];
