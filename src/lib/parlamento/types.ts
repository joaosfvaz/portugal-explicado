import type { PartyVotes } from "./votes";

export type InitiativeStatus =
  | "em-curso"
  | "aprovada"
  | "publicada"
  | "rejeitada"
  | "vetada"
  | "retirada"
  | "nao-admitida";

export type Vote = {
  id: string;
  date: string;
  result: string | null;
  unanimous: boolean;
  description: string | null;
  parties: PartyVotes | null;
  absences: string | null;
};

export type InitiativeEvent = {
  phase: string;
  date: string;
  note: string | null;
  votes: Vote[];
  publication: { type: string; url: string | null } | null;
};

export type Author = { kind: "grupo" | "deputado" | "outro"; name: string; party?: string };

export type InitiativeSummary = {
  id: string;
  number: string;
  type: string;
  typeCode: string;
  title: string;
  authors: Author[];
  authorParties: string[];
  enteredOn: string | null;
  lastPhase: string;
  lastDate: string;
  status: InitiativeStatus;
  /** The event that decided the status, for auditability. */
  statusPhase: string | null;
  statusDate: string | null;
  /** AR decrees produced by this initiative. More than one means the status may cover only part of it. */
  decrees: string[];
  /** Highest process stage reached (see explain.ts). Null for types without a stage model. */
  stage: number | null;
};

export type RelatedInitiative = { id: string; type: string; number: string; author: string | null; title: string };

export type InitiativeDetail = InitiativeSummary & {
  legislature: string;
  session: string | null;
  textUrl: string | null;
  officialUrl: string;
  events: InitiativeEvent[];
  /** Other initiatives debated together with this one. */
  jointInitiatives: RelatedInitiative[];
  origin: RelatedInitiative[];
  originated: RelatedInitiative[];
  petitions: { id: string; number: string; subject: string }[];
  /** Legal acts cited by number in the official title, quoted as written. */
  citedActs: string[];
  /** Acts published as a result of this initiative. */
  publishedAs: { type: string; number: string; year: string; publishedOn: string | null; drUrl: string | null }[];
};

export type Deputy = {
  id: number;
  name: string;
  fullName: string;
  party: string;
  circle: string;
  situation: string;
};

export type ParlamentoMeta = {
  importedAt: string;
  legislature: string;
  legislatureStart: string;
  sourceUpdatedUpTo: string | null;
  parties: { acronym: string; name: string; seats: number }[];
  counts: Record<InitiativeStatus, number>;
  /** Per party: initiatives authored and positions in final global votes (votação final global). */
  partyStats: Record<string, { authored: number; finalVotes: { favor: number; contra: number; abstencao: number } }>;
  finalVotesCounted: number;
  totalInitiatives: number;
  sources: { title: string; url: string }[];
};

export type ApprovedAct = {
  id: string;
  type: string;
  number: string;
  year: string;
  title: string;
  publishedOn: string | null;
  drUrl: string | null;
  initiativeIds: string[];
};

export type DrAct = {
  title: string;
  actType: string;
  number: string | null;
  diarioDate: string | null;
  issuer: string | null;
  summary: string;
  url: string;
  pdfUrl: string | null;
  firstSeen: string;
};

export const STATUS_LABEL: Record<InitiativeStatus, string> = {
  "em-curso": "Em curso",
  aprovada: "Aprovada",
  publicada: "Publicada em DR",
  rejeitada: "Rejeitada",
  vetada: "Vetada",
  retirada: "Retirada",
  "nao-admitida": "Não admitida",
};
