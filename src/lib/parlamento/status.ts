import type { InitiativeEvent, InitiativeStatus } from "./types";

/** Final votes for bills (projetos e propostas de lei). */
const FINAL_VOTES_LAW = new Set(["Votação final global", "Votação global", "Votação final", "Votação novo decreto"]);

/** Resolutions and deliberations are decided in a single plenary vote. */
const DECIDING_VOTES_SINGLE = new Set([...FINAL_VOTES_LAW, "Votação na generalidade", "Votação Deliberação"]);

/** A rejection in these votes ends the initiative. Rejections in specialty votes do not. */
const REJECTING_VOTES = DECIDING_VOTES_SINGLE;

const PUBLISHED = new Set(["Lei (Publicação DR)", "Resolução da AR (Publicação DR)"]);
const VETO = new Set(["Veto (Receção)", "Veto (Leitura)", "Veto (Publicação)"]);

const isLawType = (typeCode: string, typeName: string) => typeName.includes("de Lei") || typeName.includes("Revisão Constitucional") || typeCode === "J" || typeCode === "P";

/**
 * Derives the current status from the event trail. Events are processed in
 * date order; each decisive event overrides the previous status, except that
 * publication in Diário da República is final. One initiative can produce more
 * than one decree, and a later event on another decree must not undo it.
 * A failed "Confirmação do decreto" means the veto stands.
 * Rules are documented in docs/DATA-SOURCES.md and covered by tests.
 */
export function deriveStatus(
  events: Pick<InitiativeEvent, "phase" | "date" | "votes">[],
  typeCode: string,
  typeName: string,
): { status: InitiativeStatus; phase: string | null; date: string | null } {
  const deciding = isLawType(typeCode, typeName) ? FINAL_VOTES_LAW : DECIDING_VOTES_SINGLE;
  let state: { status: InitiativeStatus; phase: string | null; date: string | null } = { status: "em-curso", phase: null, date: null };

  const ordered = [...events].sort((a, b) => a.date.localeCompare(b.date));
  for (const e of ordered) {
    const phase = e.phase.trim();
    const set = (status: InitiativeStatus) => {
      if (state.status !== "publicada") state = { status, phase, date: e.date };
    };

    if (phase === "Retirada da iniciativa") set("retirada");
    else if (phase === "Não admissão") set("nao-admitida");
    else if (PUBLISHED.has(phase)) set("publicada");
    else if (VETO.has(phase)) set("vetada");

    for (const v of e.votes) {
      if (phase === "Confirmação do decreto" && v.result === "Rejeitado") set("vetada");
      else if (v.result === "Rejeitado" && REJECTING_VOTES.has(phase)) set("rejeitada");
      else if (v.result === "Aprovado" && deciding.has(phase)) set("aprovada");
    }
  }
  return state;
}

/** Distinct AR decree numbers mentioned in the trail, e.g. "Decreto n.º 17/XVII". */
export function decreesOf(events: Pick<InitiativeEvent, "note">[]): string[] {
  const found = new Set<string>();
  for (const e of events) {
    for (const m of (e.note ?? "").matchAll(/Decreto (?:da Assembleia da República )?n\.º (\d+\/[IVXLC]+)/g)) found.add(m[1]);
  }
  return [...found];
}

const ACT_NUMBER =
  /\b(Lei Orgânica|Lei Constitucional|Decreto-Lei|Decreto Legislativo Regional|Decreto Regulamentar|Resolução do Conselho de Ministros|Portaria|Diretiva(?: \(UE\))?|Regulamento(?: \(UE\))?|Lei) n\.º\s*(\d+(?:-[A-Z])?\/\d{2,4}(?:\/[A-Z])?)/g;

/** Legal acts cited by number in a title, e.g. "Lei n.º 37/81". Quoted, not interpreted. */
export function citedActs(title: string): string[] {
  const found = new Set<string>();
  for (const m of title.replace(/\s+/g, " ").matchAll(ACT_NUMBER)) found.add(`${m[1]} n.º ${m[2]}`);
  return [...found];
}
