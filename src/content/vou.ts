import type { SourceRef } from "@/components/ui";

/**
 * "Vou…" checklists: the steps for a life event, in order, with deadlines, costs and documents.
 * Research notes: docs/research/vou.md.
 */

const CHECKED = "2026-09-13";

export type ChecklistStep = {
  title: string;
  plain: string;
  deadline?: string;
  where?: string;
  cost?: string;
  documents?: string[];
  href?: string;
  source: string;
};

export type Checklist = { id: string; title: string; lead: string; steps: ChecklistStep[]; related: { href: string; label: string }[]; sources: SourceRef[] };

const SS_PRENATAL = "https://www.seg-social.pt/ptss/pssd/documento/cmc20h6d800pqkl2y3q3ur06i";
const SS_ABONO = "https://www.seg-social.pt/ptss/pssd/documento/cmc1z3qdt00j1kl2ya2677byz";
const SS_PARENTAL = "https://www.seg-social.pt/ptss/pssd/documento/cmc1ynbn400fskl2y5g278wvp";
const SS_DESEMPREGO = "https://www.seg-social.pt/ptss/pssd/documento/cmc0debv9008agw2ys1kly9so";
const SS_VELHICE = "https://www.seg-social.pt/ptss/pssd/documento/cmc1zt9ae00lskl2ye2zwphdb";
const GOV_MUDAR = "https://www.gov.pt/guias/mudar-de-casa";

const src = (title: string, url: string, verification: "primary" | "secondary" = "primary"): SourceRef => ({ title, url, verifiedOn: CHECKED, verification });

export const CHECKLISTS: Checklist[] = [
  {
    id: "ter-um-filho",
    title: "Vou ter um filho",
    lead: "Os passos desde a gravidez até ao primeiro ano, por ordem. Quase tudo é gratuito e pode ser feito online.",
    steps: [
      {
        title: "Pedir o abono de família pré-natal",
        plain: "A grávida pode pedir este abono a partir da 13.ª semana de gravidez. O médico passa o certificado de gravidez, que pode partilhar na app SNS 24.",
        deadline: "A partir da 13.ª semana. Se não pedir na gravidez, até 6 meses depois do nascimento.",
        where: "Portal da Segurança Social ou um balcão da Segurança Social.",
        cost: "Gratuito.",
        documents: ["NISS ou NIF de quem vai receber", "Certificado médico com o tempo de gravidez"],
        source: SS_PRENATAL,
      },
      {
        title: "Registar o nascimento",
        plain: "Registe o bebé no balcão Nascer Cidadão do hospital ou maternidade, antes da mãe ter alta. Se não for possível, faça-o online ou numa conservatória.",
        deadline: "Nos 20 dias depois do nascimento.",
        where: "Balcão Nascer Cidadão, registo online ou conservatória do Registo Civil.",
        cost: "Gratuito.",
        documents: ["Documentos de identificação dos pais", "Se os pais não são casados, o pai deve estar presente para assumir a paternidade"],
        source: "https://justica.gov.pt/Servicos/Nascer-cidadao",
      },
      {
        title: "Pedir o Cartão de Cidadão do bebé",
        plain: "Peça-o no mesmo momento do registo. O número da Segurança Social e o número de utente do SNS vêm com o cartão, sem pedido à parte.",
        deadline: "No registo. O cartão é obrigatório a partir dos 20 dias de idade.",
        cost: "Gratuito até 1 ano de idade. Depois, 15 €.",
        source: "https://justica.gov.pt/servicos/registar-nascimento",
      },
      {
        title: "Pedir o abono de família",
        plain: "Depois do Cartão de Cidadão, a Segurança Social pode enviar uma proposta de abono para o Portal. Aceite-a. Se não receber, faça o pedido.",
        deadline: "Nos 6 meses a seguir ao nascimento. Se pedir depois, perde os meses anteriores ao pedido.",
        where: "Portal da Segurança Social.",
        cost: "Gratuito.",
        href: "/vida/abono-de-familia",
        source: SS_ABONO,
      },
      {
        title: "Avisar a empresa e pedir o subsídio parental",
        plain: "Diga à empresa as datas da licença. A mãe tem de ficar 42 dias em casa depois do parto e o pai 28 dias. Peça o subsídio à Segurança Social.",
        deadline: "Se partilharem a licença, avisem as empresas até 7 dias depois do parto. Peça o subsídio até 6 meses depois de deixar de trabalhar.",
        where: "Portal da Segurança Social.",
        documents: ["IBAN", "Declaração do hospital com a data do parto, ou documento do bebé"],
        href: "/trabalho/direitos#parentalidade",
        source: SS_PARENTAL,
      },
      {
        title: "Pedir vaga numa creche gratuita",
        plain: "Com o programa Creche Feliz, a creche pode ser gratuita até aos 3 anos nas creches abrangidas. Desde abril de 2026 o pedido de vaga é só online.",
        where: "Portal da Segurança Social, Creche Feliz.",
        cost: "Gratuito nas creches abrangidas.",
        source: "https://www.seg-social.pt/ptss/pssd/menu/familia/desenvolvimento-criancas-jovens/creche-feliz",
      },
      {
        title: "Pôr o bebé no IRS",
        plain: "Diga às Finanças que o bebé faz parte do agregado familiar. Cada filho baixa o IRS da família.",
        deadline: "Até ao fim de fevereiro do ano seguinte ao nascimento.",
        where: "Portal das Finanças.",
        href: "/impostos/como-funciona-o-irs",
        source: "https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Dados_pessoais_familia/Familia/Agregado%20familiar/Paginas/default.aspx",
      },
    ],
    related: [
      { href: "/vida/abono-de-familia", label: "Calcular o abono de família" },
      { href: "/trabalho/direitos#parentalidade", label: "Licença parental" },
      { href: "/vida/prazos", label: "Datas a não esquecer" },
    ],
    sources: [
      src("Segurança Social, Guia Prático do Abono Pré-Natal", SS_PRENATAL),
      src("Segurança Social, Guia Prático do Abono de Família", SS_ABONO),
      src("Segurança Social, Guia Prático do Subsídio Parental Inicial", SS_PARENTAL),
      src("Justiça, Nascer Cidadão e registo de nascimento", "https://justica.gov.pt/Servicos/Nascer-cidadao"),
    ],
  },
  {
    id: "ficar-desempregado",
    title: "Fiquei ou vou ficar sem trabalho",
    lead: "O que fazer, por ordem, para não perder o subsídio de desemprego. O prazo mais importante são 90 dias.",
    steps: [
      {
        title: "Pedir à empresa a declaração de desemprego",
        plain: "Peça à empresa a Declaração de Situação de Desemprego. Se a empresa a entregar pela Segurança Social Direta, não precisa de a levar.",
        deadline: "A empresa tem 5 dias a contar do seu pedido.",
        where: "Na empresa. Se recusar, fale com a ACT.",
        documents: ["Declaração de Situação de Desemprego (modelo RP 5044)"],
        source: SS_DESEMPREGO,
      },
      {
        title: "Inscrever-se no centro de emprego",
        plain: "Inscreva-se no IEFP como desempregado, online no iefponline ou num centro de emprego.",
        deadline: "Faça-o logo. Para o subsídio, o prazo são 90 dias.",
        where: "iefponline.iefp.pt ou um centro de emprego do IEFP.",
        cost: "Gratuito.",
        documents: ["Cartão de Cidadão, ou documento que permita viver e trabalhar em Portugal"],
        source: "https://www.iefp.pt/inscricao-para-emprego",
      },
      {
        title: "Pedir o subsídio de desemprego",
        plain: "O subsídio pede-se no IEFP, quando se inscreve ou no portal do IEFP. Recebe a partir da data do pedido.",
        deadline: "Até 90 dias seguidos depois de ficar sem trabalho. Se pedir mais tarde, o atraso é tirado ao tempo de subsídio.",
        where: "Centro de emprego ou portal do IEFP.",
        documents: ["Documento de identificação", "IBAN", "Declaração de Situação de Desemprego, se a empresa não a enviou por via digital"],
        href: "/vida/subsidio-de-desemprego",
        source: SS_DESEMPREGO,
      },
      {
        title: "Cumprir os deveres enquanto recebe",
        plain: "Procure emprego e guarde as provas. Vá às convocatórias do centro de emprego. Avise se mudar de morada, viajar ou ficar doente.",
        deadline: "Avisos: 5 dias úteis. Justificar uma falta a uma convocatória: 5 dias.",
        documents: ["Provas de procura de emprego: candidaturas, respostas a anúncios, entrevistas"],
        source: SS_DESEMPREGO,
      },
      {
        title: "Saber o que acontece à reforma e ao IRS",
        plain: "O tempo com subsídio de desemprego conta para a sua carreira na Segurança Social. Segundo a Segurança Social, não precisa de declarar o subsídio no IRS.",
        source: SS_DESEMPREGO,
      },
    ],
    related: [
      { href: "/vida/subsidio-de-desemprego", label: "Calcular o subsídio de desemprego" },
      { href: "/trabalho/direitos#despedimento", label: "Direitos no despedimento" },
    ],
    sources: [src("Segurança Social, Guia Prático do Subsídio de Desemprego", SS_DESEMPREGO), src("IEFP, inscrição para emprego", "https://www.iefp.pt/inscricao-para-emprego")],
  },
  {
    id: "reformar-me",
    title: "Vou reformar-me",
    lead: "Como saber a sua idade de reforma, simular a pensão e fazer o pedido. A Segurança Social é quem calcula o valor final.",
    steps: [
      {
        title: "Saber a idade de reforma",
        plain: "Em 2026 a idade normal da reforma é 66 anos e 9 meses. Em 2027 é 66 anos e 11 meses. Com 60 anos ou mais e mais de 40 anos de descontos, a idade baixa 4 meses por cada ano a mais de 40.",
        href: "/trabalho/reforma",
        source: "https://files.diariodarepublica.pt/1s/2025/12/24900/0005500056.pdf",
      },
      {
        title: "Ver a sua carreira de descontos",
        plain: "No Portal da Segurança Social pode ver todos os anos em que descontou. Se faltar algum ano, corrija antes de pedir a pensão.",
        where: "Portal da Segurança Social, carreira contributiva.",
        cost: "Gratuito.",
        source: SS_VELHICE,
      },
      {
        title: "Simular o valor da pensão",
        plain: "Use o simulador de pensão da Segurança Social. O valor depende dos salários e dos anos de descontos.",
        where: "Portal da Segurança Social, simuladores.",
        source: SS_VELHICE,
      },
      {
        title: "Decidir se sai antes, na idade certa ou depois",
        plain: "Se sair antes da sua idade de reforma, a pensão baixa 0,5% por cada mês. Se sair depois, a pensão sobe todos os meses, até aos 70 anos.",
        source: SS_VELHICE,
      },
      {
        title: "Pedir a pensão",
        plain: "Peça a pensão de velhice no Portal da Segurança Social. Com 15 ou mais anos de descontos, pode receber logo uma pensão provisória.",
        deadline: "Pode pedir até 3 meses antes da data em que quer começar.",
        where: "Portal da Segurança Social ou um balcão da Segurança Social.",
        cost: "Gratuito.",
        documents: ["Documento de identificação", "IBAN"],
        source: SS_VELHICE,
      },
      {
        title: "Funcionários públicos: Caixa Geral de Aposentações",
        plain: "Se desconta para a Caixa Geral de Aposentações, o pedido segue as regras da CGA. Se ainda trabalha, o pedido é feito pelo seu serviço.",
        where: "O seu serviço, ou CGA Directa se já saiu.",
        source: "https://www.cga.pt/pensao-de-aposentacao",
      },
    ],
    related: [
      { href: "/trabalho/reforma", label: "A reforma explicada" },
      { href: "/impostos/tipos-de-rendimento#categoria-h", label: "IRS das pensões" },
    ],
    sources: [src("Segurança Social, Guia Prático da Pensão de Velhice", SS_VELHICE), src("Portaria n.º 476/2025/1, idade da reforma e fator de sustentabilidade", "https://files.diariodarepublica.pt/1s/2025/12/24900/0005500056.pdf"), src("Caixa Geral de Aposentações, pensão de aposentação", "https://www.cga.pt/pensao-de-aposentacao")],
  },
  {
    id: "mudar-de-casa",
    title: "Vou mudar de casa",
    lead: "Mude a morada uma vez, no Cartão de Cidadão, e as Finanças, a Segurança Social e o SNS ficam a saber.",
    steps: [
      {
        title: "Mudar a morada no Cartão de Cidadão",
        plain: "Faça o pedido online em gov.pt, com a Chave Móvel Digital ou o Cartão de Cidadão. Não precisa de fazer um cartão novo.",
        where: "gov.pt, ou um balcão do Registo, Loja do Cidadão ou Espaço Cidadão.",
        cost: "Online é gratuito. No balcão custa 3 €.",
        source: "https://justica.gov.pt/Registos/Identificacao/Cartao-de-Cidadao",
      },
      {
        title: "Confirmar a morada com o código da carta",
        plain: "Vai receber uma carta na casa nova com um código. Sem confirmar com esse código, a mudança não fica feita.",
        deadline: "No prazo indicado na carta.",
        where: "gov.pt ou um balcão.",
        source: "https://www.gov.pt/servicos/confirmar-a-alteracao-de-morada-do-cartao-de-cidadao",
      },
      {
        title: "Saber quem fica a saber sozinho",
        plain: "A nova morada passa para as Finanças, a Segurança Social, o SNS e o recenseamento eleitoral. Se mudar nos 60 dias antes de uma eleição, vota ainda na morada antiga.",
        source: GOV_MUDAR,
      },
      {
        title: "Tratar da luz, água, gás e internet",
        plain: "Fale com as empresas de luz, água, gás e internet. Se o seu operador não chegar à casa nova, pode negociar ou cancelar.",
        href: "/casa/faturas",
        source: GOV_MUDAR,
      },
      {
        title: "Se vai arrendar: o contrato nas Finanças",
        plain: "O senhorio tem de comunicar o contrato às Finanças. Se não o fizer, o inquilino pode comunicá-lo. Com o contrato comunicado, pode deduzir 15% da renda no IRS.",
        deadline: "Até ao fim do mês seguinte ao início do contrato.",
        where: "Portal das Finanças.",
        href: "/casa/arrendar",
        source: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/selo/Pages/selo60.aspx",
      },
      {
        title: "Se vai comprar: IMT e isenção de IMI",
        plain: "Quem compra casa paga IMT, salvo isenção. Pode ter direito a não pagar IMI durante uns anos, se pedir.",
        deadline: "Peça a isenção de IMI até 60 dias depois da escritura.",
        where: "Portal das Finanças.",
        href: "/casa/comprar",
        source: GOV_MUDAR,
      },
      {
        title: "Mudar de centro de saúde e de escola",
        plain: "Pode pedir para ficar no centro de saúde perto da casa nova. Mudar os filhos de escola não é obrigatório; se quiser, peça a transferência no Portal das Matrículas.",
        where: "Centro de saúde da nova zona.",
        documents: ["Cartão de Cidadão"],
        source: "https://www.gov.pt/servicos/mudar-de-centro-de-saude",
      },
    ],
    related: [
      { href: "/casa/arrendar", label: "Arrendar casa" },
      { href: "/casa/comprar", label: "Comprar casa" },
      { href: "/casa/faturas", label: "Perceber as faturas da casa" },
    ],
    sources: [src("gov.pt, guia Mudar de casa", GOV_MUDAR), src("Justiça, alterar a morada do Cartão de Cidadão", "https://justica.gov.pt/Registos/Identificacao/Cartao-de-Cidadao"), src("Código do Imposto do Selo, art. 60.º", "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/selo/Pages/selo60.aspx")],
  },
];

export const getChecklist = (id: string) => CHECKLISTS.find((c) => c.id === id) ?? null;
