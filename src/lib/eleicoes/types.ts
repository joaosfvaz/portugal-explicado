import type { SourceRef } from "@/components/ui";

export type ElectionType = "presidenciais" | "legislativas" | "europeias" | "autarquicas" | "regionais" | "referendo";

export type ElectionResult = {
  /** Official list or candidate name, as in the mapa oficial. */
  name: string;
  /** Common short name or acronym. */
  short: string;
  votes: number | null;
  /** Percentage of valid votes, unless the election's `scope` says otherwise. */
  pct: number | null;
  seats: number | null;
  previousSeats: number | null;
  elected: boolean | null;
  /** Caveat shown next to `previousSeats` when the two elections are not directly comparable. */
  previousNote?: string;
};

export type ElectionRound = {
  label: string;
  date: string;
  registered: number | null;
  voters: number | null;
  turnoutPct: number | null;
  blank: number | null;
  null: number | null;
  results: ElectionResult[];
};

export type Election = {
  id: string;
  type: ElectionType;
  title: string;
  /** What the vote chooses, in one plain sentence. */
  chooses: string;
  rounds: ElectionRound[];
  seatsTotal: number | null;
  /** "votes" for national lists and candidates; "councils" when results are câmaras won (autárquicas). */
  measure: "votes" | "councils";
  /** Optional simpler grouping shown before the full table (for example coalitions grouped by party). */
  groups?: { label: string; note: string; results: ElectionResult[] };
  /** Label of the previous election used in `previousSeats`. */
  previousLabel?: string;
  /** What the totals cover, for example "Portugal e círculos da emigração". */
  scope: string;
  /** Plain explanation of what the result means in practice. */
  meaning: string[];
  /** How the vote works, with the legal basis. */
  system: string[];
  sources: SourceRef[];
  notes: string[];
};

export type NextElection = { type: ElectionType; label: string; date: string | null; latestBy: string | null; basis: string };

export const TYPE_LABEL: Record<ElectionType, string> = {
  presidenciais: "Presidenciais",
  legislativas: "Legislativas",
  europeias: "Europeias",
  autarquicas: "Autárquicas",
  regionais: "Regionais",
  referendo: "Referendo",
};
