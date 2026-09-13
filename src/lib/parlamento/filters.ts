import type { InitiativeStatus, InitiativeSummary } from "./types";

/** Fields the list page shows and filters on. The static list file holds only these. */
export type InitiativeListItem = Pick<InitiativeSummary, "id" | "number" | "type" | "typeCode" | "title" | "authors" | "authorParties" | "lastDate" | "status" | "stage">;

export const toListItem = ({ id, number, type, typeCode, title, authors, authorParties, lastDate, status, stage }: InitiativeSummary): InitiativeListItem => ({
  id,
  number,
  type,
  typeCode,
  title,
  authors,
  authorParties,
  lastDate,
  status,
  stage,
});

export const TYPE_GROUPS = {
  leis: { label: "Projetos e propostas de lei", types: ["Projeto de Lei", "Proposta de Lei"] },
  resolucoes: { label: "Resoluções", types: ["Projeto de Resolução", "Proposta de Resolução"] },
  outras: { label: "Outras", types: ["Apreciação Parlamentar", "Projeto de Deliberação", "Inquérito Parlamentar", "Projeto de Revisão Constitucional"] },
} as const;
export type TypeGroup = keyof typeof TYPE_GROUPS;

export type InitiativeFilters = {
  group: TypeGroup | "todas";
  status: InitiativeStatus | "todos";
  party: string;
  q: string;
  page: number;
};

export const NO_FILTERS: InitiativeFilters = { group: "todas", status: "todos", party: "", q: "", page: 1 };

export const PAGE_SIZE = 30;

const normalize = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function filterInitiatives<T extends InitiativeListItem>(all: T[], f: InitiativeFilters) {
  const q = normalize(f.q.trim());
  const types: readonly string[] | null = f.group === "todas" ? null : TYPE_GROUPS[f.group].types;
  const filtered = all.filter(
    (i) =>
      (!types || types.includes(i.type)) &&
      (f.status === "todos" || i.status === f.status) &&
      (!f.party || i.authorParties.includes(f.party) || (f.party === "Governo" && i.authors.some((a) => a.name === "Governo"))) &&
      (!q || normalize(`${i.title} ${i.number}`).includes(q)),
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const page = Math.min(Math.max(1, f.page), pages);
  return { total: filtered.length, pages, page, items: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE) };
}
