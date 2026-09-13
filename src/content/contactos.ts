import type { SourceRef } from "@/components/ui";

/**
 * Official help lines, checked on the organisations' own pages. Research notes: docs/research/contactos.md.
 * Call costs are shown only where the official page states them.
 */

const CHECKED = "2026-09-13";

export type Contact = { id: string; org: string; what: string; phone?: string; phoneAlt?: string; hours?: string; cost?: string; url?: string; urlLabel?: string };

export const CONTACTS: Record<string, Contact> = {
  financas: {
    id: "financas",
    org: "Finanças (Autoridade Tributária)",
    what: "IRS, IVA, IMI, IUC, dívidas e reembolsos. Também pode escrever pelo e-balcão ou marcar atendimento presencial.",
    phone: "217 206 707",
    hours: "Dias úteis, das 9h às 19h",
    url: "https://sitfiscal.portaldasfinancas.gov.pt/ebalcao/home",
    urlLabel: "e-balcão",
  },
  "seguranca-social": {
    id: "seguranca-social",
    org: "Segurança Social",
    what: "Abonos, subsídios, pensões e descontos. Tenha à mão o NISS.",
    phone: "210 545 400",
    phoneAlt: "300 502 502",
    hours: "Com pessoa: dias úteis, das 9h às 18h",
    cost: "Depende do seu operador e tarifário.",
    url: "https://www.seg-social.pt/ptss/pssd/home",
    urlLabel: "Portal da Segurança Social",
  },
  act: {
    id: "act",
    org: "Autoridade para as Condições do Trabalho (ACT)",
    what: "Salários em atraso, despedimento, férias, horários e assédio. Pode fazer queixa sem que a empresa saiba o seu nome.",
    phone: "300 069 300",
    hours: "Dias úteis, das 9h às 12h30",
    url: "https://www.gov.pt/servicos/fazer-uma-queixa-a-autoridade-para-as-condicoes-do-trabalho-act-",
    urlLabel: "Fazer queixa online",
  },
  iefp: {
    id: "iefp",
    org: "IEFP (centros de emprego)",
    what: "Procurar emprego, cursos de formação, inscrição como desempregado e subsídio de desemprego.",
    phone: "215 803 555",
    hours: "Dias úteis, das 9h às 19h",
    url: "https://iefponline.iefp.pt/IEFP/",
    urlLabel: "iefponline",
  },
  sns24: {
    id: "sns24",
    org: "SNS 24",
    what: "Se está doente e não sabe se deve ir ao centro de saúde ou ao hospital. Em emergência, ligue 112.",
    phone: "808 24 24 24",
    hours: "Saúde: 24 horas. Assuntos administrativos: das 8h às 22h",
    url: "https://www.sns24.gov.pt/",
    urlLabel: "sns24.gov.pt",
  },
  "linha-cidadao": {
    id: "linha-cidadao",
    org: "Linha Cidadão (gov.pt)",
    what: "Ajuda a usar os serviços públicos online e a encontrar a Loja do Cidadão ou o Espaço Cidadão mais perto.",
    phone: "210 489 010",
    phoneAlt: "300 003 990",
    hours: "Dias úteis, das 9h às 18h",
    cost: "Custo de chamada para a rede fixa nacional.",
    url: "https://www.gov.pt/locais-de-atendimento",
    urlLabel: "Locais de atendimento",
  },
  "banco-de-portugal": {
    id: "banco-de-portugal",
    org: "Banco de Portugal",
    what: "Problemas com um banco. Reclame primeiro no Livro de Reclamações; o Banco de Portugal acompanha a reclamação.",
    phone: "213 130 000",
    hours: "Dias úteis, das 8h30 às 18h",
    url: "https://clientebancario.bportugal.pt/pt-pt/node/66030",
    urlLabel: "Como reclamar de um banco",
  },
  "livro-reclamacoes": {
    id: "livro-reclamacoes",
    org: "Livro de Reclamações Eletrónico",
    what: "Reclamar de uma loja ou empresa: luz, água, gás, telefone, internet ou banco.",
    url: "https://www.livroreclamacoes.pt/",
    urlLabel: "livroreclamacoes.pt",
  },
  provedor: {
    id: "provedor",
    org: "Provedor de Justiça",
    what: "Se um serviço público, como as Finanças, a Segurança Social ou a câmara, o trata mal ou não responde. Reclame primeiro nesse serviço.",
    phone: "800 200 084",
    phoneAlt: "213 926 600",
    cost: "A Linha Verde 800 200 084 é gratuita.",
    url: "https://www.provedor-jus.pt/contactos/",
    urlLabel: "Fazer queixa",
  },
  "julgados-de-paz": {
    id: "julgados-de-paz",
    org: "Julgados de Paz",
    what: "Tribunais simples para conflitos até 15 000 €: dívidas, vizinhos, arrendamento. Na maioria dos casos não precisa de advogado.",
    cost: "Taxa de 70 €, paga por quem perde. Com acordo na mediação, 50 € divididos pelas duas partes.",
    url: "https://www.conselhodosjulgadosdepaz.com.pt/",
    urlLabel: "Encontrar um julgado de paz",
  },
  "apoio-judiciario": {
    id: "apoio-judiciario",
    org: "Apoio judiciário (Segurança Social)",
    what: "Se não tem dinheiro para advogado ou para pagar o tribunal, peça proteção jurídica à Segurança Social. A resposta chega em 30 dias.",
    phone: "210 545 400",
    url: "https://www.seg-social.pt/ptss/pssd/documento/cmc20g5x400ppkl2yqwl6u0pe",
    urlLabel: "Guia da proteção jurídica",
  },
  "violencia-domestica": {
    id: "violencia-domestica",
    org: "Apoio a vítimas de violência doméstica",
    what: "Se sofre violência em casa. Explicam os seus direitos e onde ter apoio.",
    phone: "800 202 148",
    phoneAlt: "SMS 3060",
    hours: "24 horas, todos os dias",
    cost: "Gratuito, anónimo e confidencial.",
    url: "https://www.cig.gov.pt/area-portal-da-violencia/portal-violencia-domestica/servico-de-informacao-as-vitimas-de-violencia-domestica/",
    urlLabel: "CIG",
  },
  emergencia: {
    id: "emergencia",
    org: "Emergência",
    what: "Perigo de vida, acidente, incêndio ou crime.",
    phone: "112",
    hours: "24 horas",
  },
};

export const HELP_SETS: Record<string, string[]> = {
  impostos: ["financas", "linha-cidadao", "provedor"],
  trabalho: ["act", "seguranca-social", "iefp", "apoio-judiciario"],
  desemprego: ["iefp", "seguranca-social", "act"],
  familia: ["seguranca-social", "sns24", "linha-cidadao"],
  reforma: ["seguranca-social", "provedor"],
  casa: ["financas", "livro-reclamacoes", "banco-de-portugal", "julgados-de-paz"],
  documentos: ["linha-cidadao", "financas", "seguranca-social"],
};

export const CONTACT_SOURCES: SourceRef[] = [
  { title: "Portal das Finanças, contactos e e-balcão", url: "https://sitfiscal.portaldasfinancas.gov.pt/ebalcao/home", verifiedOn: CHECKED, verification: "primary" },
  { title: "Segurança Social, canal telefónico", url: "https://www.seg-social.pt/ptss/pssd/menu/ajuda/contactos-canais-atendimento/canal-telefonico", verifiedOn: CHECKED, verification: "primary" },
  { title: "gov.pt, pedir informações à ACT e locais de atendimento", url: "https://www.gov.pt/servicos/pedir-informacoes-a-autoridade-para-as-condicoes-do-trabalho-act-", verifiedOn: CHECKED, verification: "primary" },
  { title: "IEFP, contactos", url: "https://www.iefp.pt/contactos", verifiedOn: CHECKED, verification: "primary" },
  { title: "SNS 24 e linhas de atendimento do SNS", url: "https://www.sns.gov.pt/sns-saude-mais/linhas-de-atendimento-gerais/", verifiedOn: CHECKED, verification: "primary" },
  { title: "Banco de Portugal, atendimento telefónico", url: "https://clientebancario.bportugal.pt/pt-pt/atendimento-telefonico", verifiedOn: CHECKED, verification: "primary" },
  { title: "Provedor de Justiça, contactos", url: "https://www.provedor-jus.pt/contactos/", verifiedOn: CHECKED, verification: "primary" },
  { title: "DGPJ, como funcionam os Julgados de Paz", url: "https://dgpj.justica.gov.pt/Resolucao-de-Litigios/Julgados-de-Paz/Como-funcionam-os-Julgados-de-Paz", verifiedOn: CHECKED, verification: "primary" },
  { title: "CIG, serviço de informação às vítimas de violência doméstica", url: "https://www.cig.gov.pt/area-portal-da-violencia/portal-violencia-domestica/servico-de-informacao-as-vitimas-de-violencia-domestica/", verifiedOn: CHECKED, verification: "primary" },
];
