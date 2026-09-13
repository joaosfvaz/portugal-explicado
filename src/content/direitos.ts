import type { SourceRef } from "@/components/ui";

/**
 * Rights of employees in the private sector, from the Código do Trabalho in force on 2026-09-13
 * (last amended by Lei n.º 32/2025) and Segurança Social practical guides. Research notes: docs/research/direitos.md.
 */

const CHECKED = "2026-09-13";
const CT = "https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?nid=1047&tabela=leis";

export type RightsTopic = { id: string; title: string; summary: string; facts: { text: string; ref: string }[] };

export const RIGHTS: RightsTopic[] = [
  {
    id: "ferias",
    title: "Férias e subsídio de férias",
    summary: "Tem direito a 22 dias úteis de férias por ano. Recebe o salário normal nas férias e ainda um subsídio de férias, pago antes de ir.",
    facts: [
      { text: "O mínimo são 22 dias úteis por ano, de segunda a sexta, sem contar feriados.", ref: "art. 238.º" },
      { text: "No ano em que entra, ganha 2 dias úteis por cada mês de contrato, até 20 dias. Pode gozá-los depois de 6 meses completos.", ref: "art. 239.º" },
      { text: "As férias são marcadas por acordo. Sem acordo, marca o patrão, e nas empresas que não são micro entre 1 de maio e 31 de outubro.", ref: "art. 241.º" },
      { text: "O mapa de férias é feito até 15 de abril e fica afixado até 31 de outubro.", ref: "art. 241.º" },
      { text: "O subsídio de férias vale o salário base e outros valores ligados ao trabalho. É pago antes das férias, salvo acordo escrito.", ref: "art. 264.º" },
    ],
  },
  {
    id: "natal",
    title: "Subsídio de Natal",
    summary: "Recebe um mês de salário até 15 de dezembro. No ano em que entra ou sai da empresa, recebe só a parte do tempo trabalhado.",
    facts: [
      { text: "O subsídio de Natal vale um mês de salário e é pago até 15 de dezembro.", ref: "art. 263.º" },
      { text: "É proporcional ao tempo de trabalho no ano de entrada, no ano de saída e quando o contrato fica suspenso por motivo do trabalhador.", ref: "art. 263.º" },
    ],
  },
  {
    id: "faltas",
    title: "Faltas",
    summary: "Pode faltar por casamento, morte de um familiar, doença ou para cuidar de filhos. Algumas faltas são pagas e outras não. Guarde sempre um papel que prove o motivo.",
    facts: [
      { text: "Casamento: 15 dias seguidos.", ref: "art. 249.º" },
      { text: "Morte do cônjuge, companheiro ou filho: até 20 dias seguidos. Pais e sogros: até 5 dias. Avós, netos, irmãos e cunhados: até 2 dias.", ref: "art. 251.º" },
      { text: "Para cuidar de uma pessoa da família que vive consigo: até 15 dias por ano, sem salário.", ref: "arts. 252.º e 255.º" },
      { text: "Dor intensa por endometriose ou adenomiose: até 3 dias seguidos por mês, pagos, com receita médica.", ref: "art. 252.º-B" },
      { text: "O patrão pode pedir prova até 15 dias depois de avisar a falta. Sem prova, a falta passa a injustificada.", ref: "art. 254.º" },
      { text: "Faltas por doença não são pagas pelo patrão quando a Segurança Social cobre a doença.", ref: "art. 255.º" },
    ],
  },
  {
    id: "baixa",
    title: "Baixa médica",
    summary: "Com baixa médica, a Segurança Social paga a partir do 4.º dia. No primeiro mês recebe 55% do seu salário de referência. A autodeclaração de doença justifica a falta, mas não dá dinheiro.",
    facts: [
      { text: "O subsídio de doença começa no 4.º dia. Começa no 1.º dia em caso de internamento, cirurgia de ambulatório, tuberculose ou doença durante a licença parental.", ref: "Guia Prático Subsídio de Doença" },
      { text: "Até 30 dias recebe 55%. De 31 a 90 dias, 60%. De 91 a 365 dias, 70%. Mais de 365 dias, 75%. As duas primeiras taxas sobem 5% em alguns casos, por exemplo com 3 ou mais filhos.", ref: "Guia Prático Subsídio de Doença" },
      { text: "A baixa é o Certificado de Incapacidade Temporária, passado pelo médico. Chega à Segurança Social sem ter de fazer pedido.", ref: "Guia Prático Subsídio de Doença" },
      { text: "Autodeclaração de doença no SNS 24: para doença até 3 dias seguidos, no máximo 2 vezes por ano. Justifica a falta, mas esses dias não são pagos.", ref: "art. 254.º" },
    ],
  },
  {
    id: "horas-extra",
    title: "Horas extra",
    summary: "Pode fazer no máximo 2 horas extra por dia. Cada hora extra é paga a mais. Depois de 100 horas no ano, o acréscimo é maior.",
    facts: [
      { text: "Limite por ano: 175 horas em micro e pequenas empresas e 150 horas nas médias e grandes. Uma convenção coletiva pode subir até 200 horas.", ref: "art. 228.º" },
      { text: "Até 100 horas no ano, em dia útil: mais 25% na 1.ª hora e mais 37,5% nas seguintes. Em dia de descanso ou feriado: mais 50%.", ref: "art. 268.º" },
      { text: "Acima de 100 horas no ano, em dia útil: mais 50% na 1.ª hora e mais 75% nas seguintes. Em dia de descanso ou feriado: mais 100%.", ref: "art. 268.º" },
      { text: "Só são pagas as horas extra pedidas pelo patrão, ou feitas de forma que o patrão não podia deixar de saber.", ref: "art. 268.º" },
    ],
  },
  {
    id: "periodo-experimental",
    title: "Período experimental",
    summary: "No início do contrato há um período de experiência, em regra de 90 dias. Nesse tempo, qualquer um pode acabar o contrato. Depois de 60 dias, o patrão tem de avisar antes.",
    facts: [
      { text: "Contrato sem termo: 90 dias na maioria dos casos. 180 dias em cargos complexos ou de confiança, e para quem procura o primeiro emprego ou está há muito tempo desempregado. 240 dias para diretores.", ref: "art. 112.º" },
      { text: "Contrato a prazo de 6 meses ou mais: 30 dias. Contrato mais curto: 15 dias.", ref: "art. 112.º" },
      { text: "Um estágio ou contrato anterior para as mesmas funções na mesma empresa reduz ou elimina o período experimental.", ref: "art. 112.º" },
      { text: "Depois de 60 dias, o patrão tem de avisar com 7 dias. Depois de 120 dias, com 30 dias.", ref: "art. 114.º" },
    ],
  },
  {
    id: "despedimento",
    title: "Despedimento",
    summary: "Se for despedido sem culpa sua, tem direito a aviso prévio e a 14 dias de salário por cada ano na empresa. Para contestar um despedimento, tem 60 dias. Para pedir dinheiro em falta, tem 1 ano depois de sair.",
    facts: [
      { text: "Despedimento com justa causa é por comportamento grave do trabalhador, por exemplo 5 faltas injustificadas seguidas ou 10 no ano.", ref: "art. 351.º" },
      { text: "Despedimento coletivo, extinção do posto de trabalho ou inadaptação: aviso de 15 dias com menos de 1 ano na empresa, 30 dias até 5 anos, 60 dias até 10 anos e 75 dias com 10 anos ou mais.", ref: "arts. 363.º, 372.º e 379.º" },
      { text: "Nesses casos, a compensação é de 14 dias de salário base e diuturnidades por cada ano completo, com limites.", ref: "art. 366.º" },
      { text: "Se receber a compensação toda, a lei presume que aceitou o despedimento. Pode afastar esta presunção devolvendo o dinheiro.", ref: "art. 366.º" },
      { text: "No fim de um contrato a prazo por decisão do patrão, recebe 24 dias de salário base por ano.", ref: "arts. 344.º e 345.º" },
      { text: "Para contestar um despedimento individual no tribunal: 60 dias a contar do aviso. Despedimento coletivo: 6 meses.", ref: "arts. 387.º e 388.º" },
      { text: "Salários, férias ou horas extra em falta: pode pedir até 1 ano depois do fim do contrato.", ref: "art. 337.º" },
    ],
  },
  {
    id: "sair",
    title: "Despedir-se",
    summary: "Para se despedir, avise por escrito. Com até 2 anos na empresa, 30 dias antes. Com mais de 2 anos, 60 dias antes.",
    facts: [
      { text: "Contrato sem termo: aviso de 30 dias até 2 anos de casa e de 60 dias com mais de 2 anos.", ref: "art. 400.º" },
      { text: "Contrato a prazo: 30 dias se o contrato durar 6 meses ou mais, e 15 dias se durar menos.", ref: "art. 400.º" },
      { text: "Vítimas de violência doméstica com estatuto reconhecido não precisam de aviso.", ref: "art. 400.º" },
    ],
  },
  {
    id: "parentalidade",
    title: "Filhos e licença parental",
    summary: "Os pais têm entre 120 e 180 dias de licença depois do nascimento. A mãe tem de ficar 42 dias e o pai 28 dias. Pode faltar até 30 dias por ano para cuidar de um filho doente.",
    facts: [
      { text: "Licença parental inicial: 120 ou 150 dias seguidos, que os pais podem dividir. Tem mais 30 dias se cada um ficar pelo menos 30 dias sozinho.", ref: "art. 40.º" },
      { text: "A mãe pode tirar até 30 dias antes do parto e tem de tirar 42 dias seguidos depois.", ref: "art. 41.º" },
      { text: "O pai tem de tirar 28 dias nos 42 dias a seguir ao nascimento, 7 deles logo a seguir. Tem ainda 7 dias opcionais.", ref: "art. 43.º" },
      { text: "Amamentação: a mãe tem 2 períodos de até 1 hora por dia enquanto amamentar. Sem amamentação, um dos pais tem este direito até a criança fazer 1 ano.", ref: "art. 47.º" },
      { text: "Faltas para cuidar de filho doente: até 30 dias por ano com menos de 12 anos, e até 15 dias com 12 ou mais. A Segurança Social paga um subsídio para estes dias.", ref: "art. 49.º e Guia Prático Subsídio para Assistência a Filho" },
      { text: "Licença parental complementar, até o filho ter 6 anos: por exemplo 3 meses a tempo inteiro ou 12 meses a meio tempo. Avise com 30 dias.", ref: "art. 51.º" },
    ],
  },
];

export const RIGHTS_NOTE = {
  text: "Em 2026 o Governo apresentou a Proposta de Lei n.º 77/XVII, que alterava o Código do Trabalho. A Assembleia da República rejeitou-a a 19 de junho de 2026. As regras desta página são as da lei em vigor.",
  href: "/parlamento/iniciativas/356766",
};

export const RIGHTS_SOURCES: SourceRef[] = [
  { title: "Código do Trabalho, versão consolidada (Lei n.º 7/2009, alterada pela Lei n.º 32/2025)", url: CT, verifiedOn: CHECKED, verification: "primary" },
  { title: "Segurança Social, Guia Prático do Subsídio de Doença", url: "https://www.seg-social.pt/ptss/pssd/documento/cmdde8gsx000qi12yzi40plc6", verifiedOn: CHECKED, verification: "primary" },
  { title: "Segurança Social, Guia Prático do Subsídio para Assistência a Filho", url: "https://www.seg-social.pt/ptss/pssd/documento/cmc1yskdv00hekl2y3y5pojwg", verifiedOn: CHECKED, verification: "primary" },
  { title: "gov.pt, fazer uma queixa à ACT", url: "https://www.gov.pt/servicos/fazer-uma-queixa-a-autoridade-para-as-condicoes-do-trabalho-act-", verifiedOn: CHECKED, verification: "primary" },
  { title: "Ministério Público, patrocínio de trabalhadores", url: "https://www.ministeriopublico.pt/perguntas-frequentes/patrocinio-pelo-ministerio-publico", verifiedOn: CHECKED, verification: "primary" },
  { title: "Assembleia da República, Proposta de Lei n.º 77/XVII (Altera o Código do Trabalho)", url: "https://www.parlamento.pt/ActividadeParlamentar/Paginas/DetalheIniciativa.aspx?BID=356766", verifiedOn: CHECKED, verification: "primary" },
];
