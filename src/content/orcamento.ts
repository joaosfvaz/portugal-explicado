import type { SourceRef } from "@/components/ui";

/**
 * Public spending by function (COFOG), general government consolidated (Estado, Segurança Social, regions and
 * municípios), 2024, Eurostat gov_10a_exp, provisional. It includes debt interest and excludes debt repayment.
 * The State Budget 2026 has no consolidated split by function, so this is the latest complete picture.
 * Research notes: docs/research/orcamento.md.
 */

const CHECKED = "2026-09-13";

export type SpendingItem = { id: string; name: string; amount: number; plain: string; examples: string };

export const SPENDING_2024: SpendingItem[] = [
  { id: "protecao-social", name: "Proteção social", amount: 49_649.4, plain: "Apoios a quem não pode trabalhar ou precisa de ajuda.", examples: "Pensões (só as de velhice custaram 31 407 milhões), subsídio de desemprego, abono de família, baixas por doença, rendimento social de inserção." },
  { id: "saude", name: "Saúde", amount: 19_811.3, plain: "Tratar da saúde das pessoas.", examples: "Hospitais do SNS (11 898 milhões), centros de saúde, medicamentos comparticipados, vacinas." },
  { id: "servicos-gerais", name: "Funcionamento do Estado e juros da dívida", amount: 16_871.8, plain: "O funcionamento básico do Estado e os juros da dívida pública.", examples: "Juros da dívida (6 348 milhões), Governo, Assembleia da República, cobrança de impostos, administração das câmaras." },
  { id: "educacao", name: "Educação", amount: 12_587.7, plain: "Escolas, professores e universidades públicas.", examples: "Pré-escolar e ensino básico, secundário, universidades e politécnicos, refeições e transporte escolar, bolsas." },
  { id: "economia", name: "Economia e transportes", amount: 10_497.4, plain: "Apoio à economia, ao emprego e aos transportes.", examples: "Estradas e ferrovia, transportes públicos, agricultura e pescas, energia, formação profissional." },
  { id: "seguranca", name: "Segurança e justiça", amount: 4_777.6, plain: "Proteger as pessoas e fazer justiça.", examples: "PSP, GNR, Polícia Judiciária, bombeiros e proteção civil, tribunais, prisões." },
  { id: "defesa", name: "Defesa", amount: 2_525.8, plain: "As Forças Armadas.", examples: "Exército, Marinha, Força Aérea, missões internacionais." },
  { id: "cultura", name: "Cultura, desporto e comunicação social pública", amount: 2_398.4, plain: "Cultura, desporto e rádio e televisão públicas.", examples: "Museus, bibliotecas, teatros, pavilhões desportivos, RTP e Lusa." },
  { id: "ambiente", name: "Ambiente", amount: 2_001.0, plain: "Lixo, esgotos e natureza.", examples: "Recolha e tratamento do lixo, tratamento de esgotos, proteção de florestas e rios." },
  { id: "habitacao", name: "Habitação e serviços nas localidades", amount: 1_684.9, plain: "Casas e serviços básicos nas cidades e vilas.", examples: "Habitação pública, abastecimento de água, iluminação pública, arranjo de ruas." },
];

export const SPENDING_TOTAL_2024 = 122_805.3;
export const DEBT_INTEREST_2024 = 6_347.5;

/** State tax revenue in the 2026 budget proposal (Relatório OE 2026, Quadro 4.4), in million euros. */
export const TAX_REVENUE_2026 = [
  { name: "IVA", amount: 27_489, plain: "O imposto dentro do preço das compras." },
  { name: "IRS", amount: 19_496, plain: "O imposto sobre o que as pessoas ganham." },
  { name: "IRC", amount: 9_532, plain: "O imposto sobre os lucros das empresas." },
  { name: "ISP", amount: 4_254, plain: "O imposto sobre os combustíveis." },
  { name: "Imposto do Selo", amount: 2_458, plain: "Sobre créditos, seguros, heranças e outros atos." },
  { name: "Tabaco", amount: 1_676, plain: "O imposto sobre cigarros e tabaco." },
  { name: "Outros (IUC, ISV, bebidas e outros)", amount: 2_160, plain: "Impostos sobre carros, bebidas alcoólicas e outros." },
];

export const BUDGET_SOURCES: SourceRef[] = [
  { title: "Eurostat, despesa das administrações públicas por função (gov_10a_exp), Portugal, 2024 provisório", url: "https://ec.europa.eu/eurostat/databrowser/view/gov_10a_exp/default/table", verifiedOn: CHECKED, verification: "primary" },
  { title: "Relatório do Orçamento do Estado para 2026 (proposta), Quadro 4.4, receita fiscal do Estado", url: "https://www.oe.gov.pt/media/caijtnil/relatorio-oe2026.pdf", verifiedOn: CHECKED, verification: "primary" },
  { title: "Lei n.º 73-A/2025, Mapa 2, despesa da Administração Central por funções", url: "https://www.eo.gov.pt/politicaorcamental/OrcamentodeEstado/2026/OrcamentoEstadoAprovado/MapasContabilisticos/OE2026_doc03_Mapa02.pdf", verifiedOn: CHECKED, verification: "primary" },
];
