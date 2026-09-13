import { readSnapshot } from "@/lib/snapshots";
import type { ApprovedAct, Deputy, DrAct, InitiativeDetail, InitiativeSummary, ParlamentoMeta } from "./types";

/**
 * Reads a snapshot once per build. The static build renders thousands of pages, so parsing must not repeat.
 * `next dev` reads again each time, so a new import shows without a restart.
 */
function once<T>(read: () => T): () => T {
  if (process.env.NODE_ENV !== "production") return read;
  let value: { v: T } | undefined;
  return () => (value ??= { v: read() }).v;
}

export const getMeta = once(() => readSnapshot<ParlamentoMeta>("parlamento/meta.json"));
export const getInitiatives = once(() => readSnapshot<InitiativeSummary[]>("parlamento/iniciativas.json") ?? []);
export const getDeputies = once(() => readSnapshot<Deputy[]>("parlamento/deputados.json") ?? []);
export const getApprovedActs = once(() => readSnapshot<ApprovedAct[]>("parlamento/diplomas.json") ?? []);
export const getDrActs = once(() => readSnapshot<{ importedAt: string; source: string; acts: DrAct[] }>("parlamento/diario-republica.json"));

export const getInitiative = (id: string) => {
  if (!/^\d+$/.test(id)) return null;
  return readSnapshot<InitiativeDetail>(`parlamento/iniciativas/${id}.json`);
};

export { filterInitiatives, PAGE_SIZE, TYPE_GROUPS, type InitiativeFilters, type TypeGroup } from "./filters";
