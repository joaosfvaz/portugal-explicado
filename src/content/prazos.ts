import type { SourceRef } from "@/components/ui";

/**
 * Deadlines that cost money or rights when missed, from September 2026 to December 2027.
 * Research notes: docs/research/prazos.md. Dates on a weekend are shown as the law states them;
 * where the Finanças moved a weekend date in 2026, the note says so.
 */

export type Audience = "todos" | "casa" | "senhorios" | "carro" | "recibos-verdes" | "familias";

export const AUDIENCE_LABEL: Record<Audience, string> = {
  todos: "Todos",
  casa: "Tenho casa",
  senhorios: "Arrendo a outros",
  carro: "Tenho carro",
  "recibos-verdes": "Recibos verdes",
  familias: "Tenho filhos",
};

export type Deadline = {
  id: string;
  title: string;
  /** First day, when the action has a window (YYYY-MM-DD). */
  start?: string;
  /** Last day (YYYY-MM-DD). */
  end: string;
  audience: Audience[];
  action: string;
  ifMissed?: string;
  note?: string;
  /** Informational: something the State does, not the reader. */
  info?: boolean;
  ref: string;
  url: string;
};

const CHECKED = "2026-09-13";

export const DEADLINES: Deadline[] = [
  { id: "ti-trimestral-2026-10", title: "Recibos verdes: declaração trimestral à Segurança Social", end: "2026-10-31", audience: ["recibos-verdes"], action: "Na Segurança Social Direta, declare quanto recebeu em julho, agosto e setembro.", ifMissed: "Pode ter coima. Ainda pode entregar em novembro e dezembro.", note: "O dia 31 é sábado.", ref: "Guia Prático 1009", url: "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf" },
  { id: "abono-escalao-2026", title: "Abono de família: revisão do escalão", end: "2026-10-31", audience: ["familias"], action: "A Segurança Social revê o escalão com os dados das Finanças. Veja o novo escalão no Portal da Segurança Social e registe os rendimentos se lhe pedirem.", info: true, ref: "Guia Prático 4001", url: "https://www.seg-social.pt/ptss/pssd/documento/cmc1z3qdt00j1kl2ya2677byz" },
  { id: "rendas-coeficiente-2027", title: "Rendas: publicação do aumento máximo para 2027", end: "2026-10-30", audience: ["senhorios", "todos"], action: "O INE publica no Diário da República o coeficiente de atualização das rendas para 2027.", info: true, ref: "NRAU, art. 24.º", url: "https://www.portaldahabitacao.pt/coeficientes-de-atualizacao-de-rendas" },
  { id: "imi-2026-11", title: "IMI: última prestação", start: "2026-11-01", end: "2026-11-30", audience: ["casa"], action: "Pague a última prestação do IMI, se o seu IMI é superior a 100 €.", ifMissed: "As prestações que faltam vencem logo.", ref: "CIMI, art. 120.º", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cimi/Pages/cimi120.aspx" },
  { id: "ti-trimestral-2027-01", title: "Recibos verdes: declaração trimestral à Segurança Social", end: "2027-01-31", audience: ["recibos-verdes"], action: "Declare quanto recebeu em outubro, novembro e dezembro.", note: "O dia 31 é domingo.", ref: "Guia Prático 1009", url: "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf" },
  { id: "senhorios-longa-duracao-2027", title: "Senhorios: comunicar contratos de renda longos", end: "2027-02-15", audience: ["senhorios"], action: "No Portal das Finanças, indique a duração ou o fim dos contratos de arrendamento habitacional de longa duração.", ref: "Finanças, principais prazos do IRS", url: "https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Rendimentos/Declaracao/prazos/Paginas/default.aspx" },
  { id: "irs-agregado-2027", title: "IRS: confirmar quem vive consigo", end: "2027-02-28", audience: ["todos"], action: "No Portal das Finanças, confirme o agregado familiar a 31 de dezembro: casal, filhos, guarda partilhada.", ifMissed: "As Finanças usam os dados do ano anterior.", note: "Em 2027 o dia 28 é domingo. Em 2026, num caso igual, as Finanças passaram o prazo para o dia útil seguinte.", ref: "CIRS, art. 58.º-A", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs58a.aspx" },
  { id: "efatura-2027", title: "e-Fatura: confirmar as faturas de 2026", end: "2027-02-28", audience: ["todos"], action: "No e-Fatura, veja as faturas pendentes e escolha o setor de cada uma: saúde, educação, casa. Quem passa recibos verdes separa as despesas da atividade.", ifMissed: "Algumas despesas podem não contar para as deduções.", note: "Em 2027 o dia 28 é domingo.", ref: "CIRS, art. 78.º-B", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78b.aspx" },
  { id: "irs-reclamar-deducoes-2027", title: "IRS: ver e reclamar as deduções", start: "2027-03-16", end: "2027-03-31", audience: ["todos"], action: "No Portal das Finanças, veja o resumo das despesas que contam para o IRS. Se faltar alguma, reclame.", ifMissed: "Perde esta forma de corrigir as deduções.", ref: "CIRS, art. 78.º-B", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78b.aspx" },
  { id: "irs-declaracao-2027", title: "IRS: entregar a declaração", start: "2027-04-01", end: "2027-06-30", audience: ["todos"], action: "Entregue a declaração de IRS dos rendimentos de 2026 no Portal das Finanças. Se tem IRS Automático, confirme a proposta.", ifMissed: "Coima de 150 € a 3 750 €. No IRS Automático, se não fizer nada, a proposta passa a valer.", ref: "CIRS, arts. 58.º-A e 60.º; RGIT, art. 116.º", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs60.aspx" },
  { id: "ti-trimestral-2027-04", title: "Recibos verdes: declaração trimestral à Segurança Social", end: "2027-04-30", audience: ["recibos-verdes"], action: "Declare quanto recebeu em janeiro, fevereiro e março.", ref: "Guia Prático 1009", url: "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf" },
  { id: "imi-2027-05", title: "IMI: pagar em maio", start: "2027-05-01", end: "2027-05-31", audience: ["casa"], action: "Pague o IMI, ou a primeira prestação. Até 100 € paga tudo agora.", ref: "CIMI, art. 120.º", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cimi/Pages/cimi120.aspx" },
  { id: "abono-prova-escolar-2027", title: "Abono de família: prova escolar dos 16 aos 24 anos", start: "2027-07-01", end: "2027-07-31", audience: ["familias"], action: "Veja no Portal da Segurança Social se a prova escolar já está feita. Se não estiver, registe a matrícula.", ifMissed: "O abono para em setembro. Se fizer a prova até 31 de dezembro, recebe os valores em atraso.", ref: "Guia Prático 4001", url: "https://www.seg-social.pt/ptss/pssd/documento/cmc1z3qdt00j1kl2ya2677byz" },
  { id: "ti-trimestral-2027-07", title: "Recibos verdes: declaração trimestral à Segurança Social", end: "2027-07-31", audience: ["recibos-verdes"], action: "Declare quanto recebeu em abril, maio e junho.", ref: "Guia Prático 1009", url: "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf" },
  { id: "iuc-2027-07", title: "IUC: 1.ª prestação, se paga mais de 500 €", start: "2027-07-01", end: "2027-07-31", audience: ["carro"], action: "Em 2027 as Finanças juntam o IUC de todos os seus veículos. Se o total passa 500 €, pague a primeira parte em julho, ou tudo de uma vez.", note: "Regra nova de 2027. O dia 31 é sábado.", ref: "Decreto-Lei n.º 161/2026, art. 6.º", url: "https://files.diariodarepublica.pt/1s/2026/08/14900/0001000015.pdf" },
  { id: "irs-pagamento-2027", title: "IRS: pagar ou receber o reembolso", end: "2027-08-31", audience: ["todos"], action: "Se tem IRS a pagar, pague até hoje. Se tem reembolso, as Finanças devem pagá-lo até hoje.", ifMissed: "Juros e cobrança pelas Finanças.", ref: "CIRS, arts. 96.º e 97.º", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs97.aspx" },
  { id: "imi-2027-08", title: "IMI: prestação de agosto", start: "2027-08-01", end: "2027-08-31", audience: ["casa"], action: "Pague a segunda prestação, se o seu IMI é superior a 500 €.", ref: "CIMI, art. 120.º", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cimi/Pages/cimi120.aspx" },
  { id: "iuc-2027-10", title: "IUC: pagar em outubro", start: "2027-10-01", end: "2027-10-31", audience: ["carro"], action: "Pague o IUC de 2027. Se pagou a primeira parte em julho, pague a segunda.", note: "Regra nova de 2027. O dia 31 é domingo.", ref: "Decreto-Lei n.º 161/2026, art. 6.º", url: "https://files.diariodarepublica.pt/1s/2026/08/14900/0001000015.pdf" },
  { id: "ti-trimestral-2027-10", title: "Recibos verdes: declaração trimestral à Segurança Social", end: "2027-10-31", audience: ["recibos-verdes"], action: "Declare quanto recebeu em julho, agosto e setembro.", ref: "Guia Prático 1009", url: "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf" },
  { id: "imi-2027-11", title: "IMI: última prestação", start: "2027-11-01", end: "2027-11-30", audience: ["casa"], action: "Pague a última prestação do IMI, se o seu IMI é superior a 100 €.", ref: "CIMI, art. 120.º", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cimi/Pages/cimi120.aspx" },
];

/** Deadlines that depend on a personal date, such as a car registration or a card expiry. */
export const PERSONAL_RULES: { title: string; audience: Audience; rule: string; ref: string; url: string }[] = [
  { title: "Recibos verdes: pagar a Segurança Social", audience: "recibos-verdes", rule: "Todos os meses, entre o dia 10 e o dia 20, paga a contribuição do mês anterior.", ref: "Guia Prático 1009", url: "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf" },
  { title: "IUC em 2026", audience: "carro", rule: "Até 31 de dezembro de 2026, paga o IUC até ao fim do mês em que o carro foi matriculado. Em 2027 a regra muda: veja julho e outubro no calendário.", ref: "CIUC, art. 17.º", url: "https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Veiculos/IUC/Paginas/default.aspx" },
  { title: "IUC de um carro novo ou importado", audience: "carro", rule: "Paga nos 30 dias depois do fim do prazo para registar o carro.", ref: "CIUC, art. 17.º", url: "https://files.diariodarepublica.pt/1s/2026/08/14900/0001000015.pdf" },
  { title: "Inspeção do carro", audience: "carro", rule: "Carros ligeiros de passageiros: aos 4 anos da 1.ª matrícula, depois aos 6 e aos 8 anos, e a seguir todos os anos.", ref: "IMT", url: "https://www.imt-ip.pt/veiculos/inspecao-de-veiculos/tipos-de-inspecoes/" },
  { title: "Carta de condução", audience: "carro", rule: "Renove nos 6 meses antes da data de validade escrita na carta. A partir dos 60 anos precisa de atestado médico.", ref: "IMT", url: "https://www.imt-ip.pt/condutores/informacoes-gerais/quero-ser-condutor/revalidacao-da-carta-de-conducao/" },
  { title: "Cartão de Cidadão", audience: "todos", rule: "Pode renovar a partir de 6 meses antes do fim da validade. Vale 5 anos até aos 25 anos e 10 anos depois. A renovação custa 16,20 €.", ref: "gov.pt", url: "https://www.gov.pt/servicos/renovar-o-cartao-de-cidadao" },
  { title: "Abono de família de um bebé", audience: "familias", rule: "Peça nos 6 meses a seguir ao nascimento. Se pedir depois, perde os meses anteriores ao pedido.", ref: "Guia Prático 4001", url: "https://www.seg-social.pt/ptss/pssd/documento/cmc1z3qdt00j1kl2ya2677byz" },
  { title: "Aumento da renda", audience: "senhorios", rule: "O senhorio avisa por escrito, pelo menos 30 dias antes, com o coeficiente e a nova renda. Só pode aumentar uma vez por ano.", ref: "Código Civil, art. 1077.º", url: "https://files.diariodarepublica.pt/1s/2006/02/041a00/15581587.pdf" },
];

export const PRAZOS_SOURCES: SourceRef[] = [
  { title: "Portal das Finanças, principais prazos do IRS", url: "https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Rendimentos/Declaracao/prazos/Paginas/default.aspx", verifiedOn: CHECKED, verification: "primary" },
  { title: "Código do IRS, arts. 58.º-A, 60.º, 78.º-B, 96.º e 97.º", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs60.aspx", verifiedOn: CHECKED, verification: "primary" },
  { title: "Código do IMI, arts. 119.º e 120.º", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cimi/Pages/cimi120.aspx", verifiedOn: CHECKED, verification: "primary" },
  { title: "Decreto-Lei n.º 161/2026, novas regras de pagamento do IUC", url: "https://files.diariodarepublica.pt/1s/2026/08/14900/0001000015.pdf", verifiedOn: CHECKED, verification: "primary" },
  { title: "Segurança Social, Guia Prático 4001 (abono de família)", url: "https://www.seg-social.pt/ptss/pssd/documento/cmc1z3qdt00j1kl2ya2677byz", verifiedOn: CHECKED, verification: "primary" },
  { title: "Segurança Social, Guia Prático 1009 (trabalhadores independentes)", url: "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf", verifiedOn: CHECKED, verification: "primary" },
  { title: "IMT, revalidação da carta e periodicidade das inspeções", url: "https://www.imt-ip.pt/veiculos/inspecao-de-veiculos/tipos-de-inspecoes/", verifiedOn: CHECKED, verification: "primary" },
];
