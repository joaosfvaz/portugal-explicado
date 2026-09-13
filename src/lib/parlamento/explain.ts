import type { InitiativeDetail, InitiativeEvent, InitiativeStatus, InitiativeSummary } from "./types";

/**
 * Plain-language explanations of initiative types, phases and status.
 * Every sentence is derived from the initiative type and the official event trail.
 * Nothing here interprets the title or the text of an initiative.
 */

export type TypeInfo = { name: string; who: string; effect: string };

export const TYPE_INFO: Record<string, TypeInfo> = {
  J: {
    name: "Projeto de Lei",
    who: "Apresentado por deputados ou grupos parlamentares.",
    effect: "Se for aprovado, promulgado pelo Presidente da República e publicado, passa a ser lei.",
  },
  P: {
    name: "Proposta de Lei",
    who: "Apresentada pelo Governo ou por uma Assembleia Legislativa de uma região autónoma.",
    effect:
      "Se for aprovada, promulgada pelo Presidente da República e publicada, passa a ser lei. Algumas propostas pedem autorização para o Governo legislar sobre um tema por decreto-lei.",
  },
  C: {
    name: "Projeto de Revisão Constitucional",
    who: "Apresentado por deputados.",
    effect: "Propõe alterações à Constituição. A aprovação precisa de dois terços dos deputados em funções.",
  },
  R: {
    name: "Projeto de Resolução",
    who: "Apresentado por deputados ou grupos parlamentares.",
    effect:
      "Não é uma lei. A maioria das resoluções recomenda medidas ao Governo, e uma recomendação não obriga o Governo a agir. Algumas resoluções têm efeito direto, por exemplo suspender um decreto-lei.",
  },
  S: {
    name: "Proposta de Resolução",
    who: "Apresentada pelo Governo.",
    effect: "Serve sobretudo para a Assembleia aprovar acordos e tratados internacionais.",
  },
  D: {
    name: "Projeto de Deliberação",
    who: "Apresentado na Assembleia da República.",
    effect: "Decide assuntos do funcionamento da Assembleia, como o calendário ou um processo de urgência. Não muda a lei.",
  },
  A: {
    name: "Apreciação Parlamentar",
    who: "Pedida por deputados.",
    effect: "Leva a Assembleia a rever um decreto-lei do Governo. A Assembleia pode alterar o decreto-lei ou fazer cessar a sua vigência.",
  },
  I: {
    name: "Inquérito Parlamentar",
    who: "Pedido por deputados.",
    effect: "Pede a criação de uma comissão parlamentar de inquérito para investigar um assunto.",
  },
};

export const LAW_STAGES = [
  "Entrada",
  "Debate na generalidade",
  "Especialidade na comissão",
  "Votação final global",
  "Presidente da República",
  "Publicação",
] as const;

export const RESOLUTION_STAGES = ["Entrada", "Discussão", "Votação", "Publicação"] as const;

const LAW_TYPES = new Set(["J", "P", "C"]);
const RESOLUTION_TYPES = new Set(["R", "S", "D"]);

export const isLawType = (typeCode: string) => LAW_TYPES.has(typeCode);

export function stagesFor(typeCode: string): readonly string[] | null {
  if (LAW_TYPES.has(typeCode)) return LAW_STAGES;
  if (RESOLUTION_TYPES.has(typeCode)) return RESOLUTION_STAGES;
  return null;
}

type PhaseInfo = { label: string; help?: string; major?: boolean; law?: number; resolution?: number };

/** Keyed on the exact official phase name. Unknown phases keep the official name. */
const PHASES: Record<string, PhaseInfo> = {
  Entrada: { label: "Deu entrada na Assembleia", major: true, law: 0, resolution: 0 },
  Admissão: { label: "Admitida pelo Presidente da Assembleia", law: 0, resolution: 0 },
  "Não admissão": { label: "Não admitida pelo Presidente da Assembleia", major: true },
  Anúncio: { label: "Anunciada no plenário", law: 0, resolution: 0 },
  Publicação: { label: "Texto publicado no Diário da Assembleia da República", law: 0, resolution: 0 },
  "Publicação em Separata": {
    label: "Publicada em separata para apreciação pública",
    help: "As leis do trabalho ficam abertas a comentários de sindicatos, empresas e cidadãos antes da votação.",
    major: true,
    law: 0,
  },
  "Baixa comissão distribuição inicial generalidade": {
    label: "Enviada a uma comissão para parecer antes do debate",
    law: 0,
    resolution: 1,
  },
  "Nova apreciação comissão generalidade": { label: "Nova análise na comissão antes do debate", law: 0, resolution: 1 },
  "Baixa comissão para discussão": { label: "Enviada a uma comissão para discussão", resolution: 1, law: 1 },
  Apreciação: { label: "Discutida na comissão", resolution: 1, law: 1 },
  "Discussão generalidade": {
    label: "Debate no plenário",
    help: "Na generalidade discute-se a ideia geral da iniciativa.",
    major: true,
    law: 1,
    resolution: 1,
  },
  "Requerimento Baixa Comissão sem Votação (Generalidade)": {
    label: "Enviada à comissão sem votação, a pedido dos autores",
    major: true,
    law: 1,
  },
  "Requerimento de adiamento de Votação (Generalidade)": { label: "Votação adiada a pedido", law: 1 },
  "Votação na generalidade": {
    label: "Votação na generalidade",
    help: "Decide se a ideia geral da iniciativa avança.",
    major: true,
    law: 1,
    resolution: 2,
  },
  "Baixa comissão especialidade": {
    label: "Enviada à comissão para análise artigo a artigo",
    help: "Na especialidade, a comissão discute e vota propostas de alteração a cada artigo.",
    major: true,
    law: 2,
    resolution: 1,
  },
  "Discussão especialidade": { label: "Discussão artigo a artigo", law: 2 },
  "Votação na especialidade": { label: "Votação artigo a artigo", major: true, law: 2 },
  "Admissão Proposta de Alteração": { label: "Proposta de alteração admitida", law: 2 },
  "Nova Baixa Comissão para Discussão": { label: "Enviada de novo à comissão", law: 2, resolution: 1 },
  "Requerimento avocação plenário": { label: "Pedido para votar artigos no plenário", law: 2 },
  "Votação final global": {
    label: "Votação final global",
    help: "Decide se o texto final é aprovado.",
    major: true,
    law: 3,
    resolution: 2,
  },
  "Votação global": { label: "Votação global", help: "Decide se o texto é aprovado.", major: true, law: 3, resolution: 2 },
  "Votação final": { label: "Votação final", help: "Decide se o texto é aprovado.", major: true, law: 3, resolution: 2 },
  "Votação Deliberação": { label: "Votação no plenário", major: true, resolution: 2 },
  "Envio à Comissão para fixação da Redação final": { label: "A comissão fixa a redação final do texto", law: 3 },
  "Requerimento dispensa redação final": { label: "Dispensa da redação final", law: 3 },
  "Decreto (Publicação)": { label: "Texto aprovado publicado como decreto da Assembleia", law: 4 },
  "Envio INCM para preparação do autógrafo": { label: "Preparação do texto para assinatura", law: 4 },
  "Envio para promulgação": { label: "Enviada ao Presidente da República", major: true, law: 4 },
  Promulgação: { label: "Promulgada pelo Presidente da República", major: true, law: 4 },
  Referenda: { label: "Referenda do Governo", help: "O Primeiro-Ministro assina a lei depois da promulgação.", law: 4 },
  "Veto (Receção)": { label: "Veto do Presidente da República", major: true, law: 4 },
  "Veto (Leitura)": { label: "Veto lido no plenário", law: 4 },
  "Veto (Publicação)": { label: "Veto publicado", law: 4 },
  "Reapreciação do decreto": { label: "Nova apreciação do texto depois do veto", major: true, law: 4 },
  "Confirmação do decreto": { label: "Votação para confirmar o texto depois do veto", major: true, law: 4 },
  "Votação novo decreto": { label: "Votação do texto alterado depois do veto", major: true, law: 4 },
  "Decreto (2ª versão) (Publicação)": { label: "Texto alterado publicado como decreto", law: 4 },
  "Envio para promulgação (2ª versão)": { label: "Texto alterado enviado ao Presidente da República", major: true, law: 4 },
  "Promulgação (2ª versão)": { label: "Texto alterado promulgado", major: true, law: 4 },
  "Referenda (2ª versão)": { label: "Referenda do texto alterado", law: 4 },
  "Envio INCM": { label: "Enviada para publicação no Diário da República", law: 5, resolution: 3 },
  "Envio INCM (2ª versão)": { label: "Texto alterado enviado para publicação", law: 5 },
  "Lei (Publicação DR)": { label: "Publicada no Diário da República como lei", major: true, law: 5 },
  "Resolução (Publicação DAR)": { label: "Resolução publicada no Diário da Assembleia", resolution: 3 },
  "Resolução da AR (Publicação DR)": { label: "Resolução publicada no Diário da República", major: true, resolution: 3 },
  "Deliberação (Publicação DAR)": { label: "Deliberação publicada no Diário da Assembleia", major: true, resolution: 3 },
  "Retirada da iniciativa": { label: "Retirada pelos autores", major: true },
  "Processo de urgência": { label: "Aprovado o processo de urgência", major: true },
  "Envio para Ratificação / Assinatura": { label: "Enviada para ratificação ou assinatura", law: 4, resolution: 3 },
};

const REGIONAL = /^(Nova )?[Aa]udição promovida pelo PAR|^Parecer d[oa] (Governo da RA|ALRA)/;

export function phaseInfo(phase: string): PhaseInfo {
  if (PHASES[phase]) return PHASES[phase];
  if (REGIONAL.test(phase)) {
    return phase.startsWith("Parecer")
      ? { label: "Parecer das regiões autónomas", law: 0, resolution: 0 }
      : { label: "Pedido de parecer às regiões autónomas", law: 0, resolution: 0 };
  }
  return { label: phase };
}

/** Events a reader needs to follow the story. The full trail stays available. */
export function isMajorEvent(e: Pick<InitiativeEvent, "phase" | "votes">, decisive: boolean) {
  return decisive || e.votes.length > 0 || Boolean(phaseInfo(e.phase).major);
}

export type StageState = "done" | "current" | "ended" | "todo";

/** Highest stage reached, from the events, for types with a stage model. */
export function stageReached(events: Pick<InitiativeEvent, "phase">[], typeCode: string): number | null {
  const stages = stagesFor(typeCode);
  if (!stages) return null;
  const key = LAW_TYPES.has(typeCode) ? "law" : "resolution";
  let reached = 0;
  for (const e of events) {
    const s = phaseInfo(e.phase)[key];
    if (s !== undefined && s > reached) reached = s;
  }
  return reached;
}

const ENDED: InitiativeStatus[] = ["rejeitada", "retirada", "nao-admitida", "vetada"];

export function stageStates(stages: readonly string[], reached: number, status: InitiativeStatus): StageState[] {
  return stages.map((_, idx) => {
    if (status === "publicada") return "done";
    if (idx < reached) return "done";
    if (idx === reached) return ENDED.includes(status) ? "ended" : "current";
    return "todo";
  });
}

/** Short progress text for lists, e.g. "Fase 3 de 6: Especialidade na comissão". */
export function progressLabel(i: Pick<InitiativeSummary, "typeCode" | "stage" | "status">) {
  const stages = stagesFor(i.typeCode);
  if (!stages || i.stage === null) return null;
  if (i.status !== "em-curso") return null;
  return `Fase ${i.stage + 1} de ${stages.length}: ${stages[i.stage]}`;
}

export type StatusExplanation = { headline: string; body: string | null };

const lower = (s: string) => s.charAt(0).toLowerCase() + s.slice(1);

export function explainStatus(
  i: Pick<InitiativeDetail, "status" | "statusPhase" | "statusDate" | "events" | "typeCode" | "decrees" | "enteredOn">,
  formatDate: (d: string) => string,
): StatusExplanation {
  const law = LAW_TYPES.has(i.typeCode);
  const on = i.statusDate ? ` a ${formatDate(i.statusDate)}` : "";
  const after = i.events.filter((e) => !i.statusDate || e.date >= i.statusDate).map((e) => e.phase);
  const had = (...phases: string[]) => after.some((p) => phases.includes(p));
  const multi = i.decrees.length > 1;

  switch (i.status) {
    case "publicada":
      if (law) return { headline: "Publicada. Já é lei.", body: `Foi publicada no Diário da República${on}. A data em que entra em vigor está no texto da lei.` };
      return { headline: "Publicada no Diário da República.", body: `A resolução foi publicada${on}.` };

    case "aprovada":
      if (!law) {
        return {
          headline: "Aprovada.",
          body: i.typeCode === "D" ? `A deliberação foi aprovada${on}.` : `Foi aprovada${on}. Ainda não foi publicada no Diário da República.`,
        };
      }
      if (multi) return { headline: "Aprovada.", body: null };
      if (had("Promulgação", "Promulgação (2ª versão)")) {
        return { headline: "Aprovada e promulgada.", body: "O Presidente da República promulgou o texto. Falta a publicação no Diário da República." };
      }
      if (had("Envio para promulgação", "Envio para promulgação (2ª versão)")) {
        return {
          headline: "Aprovada. Aguarda o Presidente da República.",
          body: "O Presidente pode promulgar, vetar ou pedir ao Tribunal Constitucional que verifique o texto.",
        };
      }
      return {
        headline: "Aprovada em votação final.",
        body: `Foi aprovada${on}. Segue para a redação final e depois para o Presidente da República, que decide se promulga.`,
      };

    case "rejeitada":
      return {
        headline: "Rejeitada.",
        body: `Foi rejeitada na ${lower(phaseInfo(i.statusPhase ?? "").label)}${on}. O processo terminou.`,
      };

    case "vetada":
      if (i.statusPhase === "Confirmação do decreto") {
        return { headline: "Vetada. O veto manteve-se.", body: `Depois do veto do Presidente da República, a Assembleia não confirmou o texto${on}.` };
      }
      return {
        headline: "Vetada pelo Presidente da República.",
        body: "A Assembleia pode alterar o texto e votá-lo de novo, ou confirmá-lo por maioria absoluta dos deputados. Em algumas matérias são precisos dois terços.",
      };

    case "retirada":
      return { headline: "Retirada.", body: `Os autores retiraram a iniciativa${on}. O processo terminou.` };

    case "nao-admitida":
      return { headline: "Não admitida.", body: `O Presidente da Assembleia não admitiu a iniciativa${on}.` };

    case "em-curso": {
      const reached = stageReached(i.events, i.typeCode);
      const approvedInGenerality = i.events.some((e) => e.phase === "Votação na generalidade" && e.votes.some((v) => v.result === "Aprovado"));
      if (law) {
        if (approvedInGenerality && (reached ?? 0) <= 2) {
          return {
            headline: "Aprovada na generalidade. Está na comissão.",
            body: "A comissão analisa o texto artigo a artigo. Depois, o plenário faz a votação final global.",
          };
        }
        if (reached === 0) {
          return { headline: "Em curso. Aguarda debate no plenário.", body: "O debate e a votação na generalidade decidem se a ideia geral avança." };
        }
        if (reached === 1) {
          return { headline: "Em curso. Na fase de generalidade.", body: "A votação na generalidade decide se a ideia geral avança." };
        }
        return { headline: "Em curso.", body: null };
      }
      if (reached !== null && reached < 2) {
        return { headline: "Em curso. Aguarda votação.", body: "A resolução é discutida e depois votada no plenário ou na comissão." };
      }
      return { headline: "Em curso.", body: null };
    }
  }
}

const NEXT_LAW = [
  "A seguir, os deputados discutem a ideia geral no plenário e votam na generalidade.",
  "A seguir, uma comissão de deputados discute e pode mudar o texto, artigo a artigo.",
  "A seguir, todos os deputados votam o texto final, na votação final global.",
  "A seguir, o Presidente da República decide se promulga ou veta.",
  "A seguir, a lei é publicada no Diário da República. Só depois passa a valer.",
];

const NEXT_RESOLUTION = [
  "A seguir, os deputados discutem a resolução.",
  "A seguir, os deputados votam a resolução.",
  "A seguir, a resolução é publicada no Diário da República.",
];

/** One plain sentence about what normally happens next, or why nothing more will happen. */
export function nextStep(status: InitiativeStatus, typeCode: string, reached: number | null): string | null {
  if (status === "publicada") return "O processo terminou: o texto foi publicado.";
  if (status === "rejeitada") return "O processo terminou: foi rejeitada. Uma nova iniciativa sobre o mesmo tema pode ser apresentada mais tarde.";
  if (status === "retirada") return "O processo terminou: os autores retiraram a iniciativa.";
  if (status === "nao-admitida") return "O processo terminou: a iniciativa não foi admitida.";
  if (status === "vetada") return "O Presidente vetou. A Assembleia pode mudar o texto ou voltar a aprová-lo. O que acontece depois depende do motivo do veto (Constituição, arts. 136.º e 279.º).";
  if (reached === null) return null;
  const list = LAW_TYPES.has(typeCode) ? NEXT_LAW : RESOLUTION_TYPES.has(typeCode) ? NEXT_RESOLUTION : null;
  return list?.[reached] ?? null;
}
