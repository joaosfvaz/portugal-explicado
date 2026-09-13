import type { Point } from "./jsonstat";

export type Geo = "PT" | "ES" | "EU27_2020";

export type IndicatorDef = {
  slug: string;
  group: "crescimento" | "precos" | "combustiveis" | "trabalho" | "financas" | "habitacao" | "pessoas";
  title: string;
  short: string;
  unit: "%" | "p.p." | "€" | "€/l" | "pessoas" | "UE=100";
  digits: number;
  frequency: "anual" | "trimestral" | "mensal" | "semanal";
  definition: string;
  /** Lower values are better (for the direction hint only; never used as a judgement label). */
  source:
    | { kind: "eurostat"; dataset: string; params: Record<string, string>; since: string; geos: Geo[] }
    | { kind: "bpstat"; domain: number; dataset: string; series: number; since: string }
    | { kind: "oil-bulletin"; fuel: "euro95" | "diesel" | "LPG"; since: string; dgegFuelId: number };
  sourceUrl: string;
  sourceName: string;
  /** Optional conversion applied to every value, documented in `note`. */
  transform?: "monthly14to12";
  note?: string;
};

const E = "https://ec.europa.eu/eurostat/databrowser/view/";

export const INDICATORS: IndicatorDef[] = [
  {
    slug: "crescimento-pib",
    group: "crescimento",
    title: "Crescimento do PIB",
    short: "PIB, variação real anual",
    unit: "%",
    digits: 1,
    frequency: "anual",
    definition: "Variação do produto interno bruto face ao ano anterior, em volume (descontada a inflação).",
    source: { kind: "eurostat", dataset: "nama_10_gdp", params: { na_item: "B1GQ", unit: "CLV_PCH_PRE" }, since: "2010", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}nama_10_gdp/default/table`,
    sourceName: "Eurostat, nama_10_gdp",
  },
  {
    slug: "crescimento-pib-trimestral",
    group: "crescimento",
    title: "PIB trimestral",
    short: "PIB, variação homóloga",
    unit: "%",
    digits: 1,
    frequency: "trimestral",
    definition: "Variação real do PIB face ao mesmo trimestre do ano anterior, ajustada de sazonalidade e dias úteis.",
    source: { kind: "eurostat", dataset: "namq_10_gdp", params: { na_item: "B1GQ", unit: "CLV_PCH_SM", s_adj: "SCA" }, since: "2019-Q1", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}namq_10_gdp/default/table`,
    sourceName: "Eurostat, namq_10_gdp",
  },
  {
    slug: "pib-per-capita",
    group: "crescimento",
    title: "PIB per capita",
    short: "PIB per capita em paridade de poder de compra",
    unit: "UE=100",
    digits: 0,
    frequency: "anual",
    definition: "PIB por habitante em paridades de poder de compra, com a média da União Europeia igual a 100.",
    source: { kind: "eurostat", dataset: "tec00114", params: {}, since: "2010", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}tec00114/default/table`,
    sourceName: "Eurostat, tec00114",
  },
  {
    slug: "inflacao",
    group: "precos",
    title: "Inflação",
    short: "Inflação homóloga (IHPC)",
    unit: "%",
    digits: 1,
    frequency: "mensal",
    definition: "Variação dos preços no consumidor face ao mesmo mês do ano anterior, pelo índice harmonizado usado em toda a UE.",
    source: { kind: "eurostat", dataset: "prc_hicp_minr", params: { coicop18: "TOTAL", unit: "RCH_A" }, since: "2022-01", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}prc_hicp_minr/default/table`,
    sourceName: "Eurostat, prc_hicp_minr",
  },
  {
    slug: "inflacao-anual",
    group: "precos",
    title: "Inflação média anual",
    short: "Inflação média anual (IHPC)",
    unit: "%",
    digits: 1,
    frequency: "anual",
    definition: "Taxa de variação média anual do índice harmonizado de preços no consumidor.",
    source: { kind: "eurostat", dataset: "prc_hicp_aind", params: { coicop: "CP00", unit: "RCH_A_AVG" }, since: "2010", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}prc_hicp_aind/default/table`,
    sourceName: "Eurostat, prc_hicp_aind",
  },
  {
    slug: "gasoleo",
    group: "combustiveis",
    title: "Preço do gasóleo",
    short: "Gasóleo simples, preço médio",
    unit: "€/l",
    digits: 3,
    frequency: "semanal",
    definition: "Preço médio de venda ao público do gasóleo rodoviário, com impostos, por litro. Valores de segunda-feira de cada semana.",
    source: { kind: "oil-bulletin", fuel: "diesel", since: "2010-01-01", dgegFuelId: 2101 },
    sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en",
    sourceName: "Comissão Europeia, Weekly Oil Bulletin",
  },
  {
    slug: "gasolina-95",
    group: "combustiveis",
    title: "Preço da gasolina 95",
    short: "Gasolina simples 95, preço médio",
    unit: "€/l",
    digits: 3,
    frequency: "semanal",
    definition: "Preço médio de venda ao público da gasolina sem chumbo 95, com impostos, por litro. Valores de segunda-feira de cada semana.",
    source: { kind: "oil-bulletin", fuel: "euro95", since: "2010-01-01", dgegFuelId: 3201 },
    sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en",
    sourceName: "Comissão Europeia, Weekly Oil Bulletin",
  },
  {
    slug: "gpl-auto",
    group: "combustiveis",
    title: "Preço do GPL Auto",
    short: "GPL Auto, preço médio",
    unit: "€/l",
    digits: 3,
    frequency: "semanal",
    definition: "Preço médio de venda ao público do gás de petróleo liquefeito para automóveis, com impostos, por litro. Valores de segunda-feira de cada semana.",
    source: { kind: "oil-bulletin", fuel: "LPG", since: "2010-01-01", dgegFuelId: 1120 },
    sourceUrl: "https://energy.ec.europa.eu/data-and-analysis/weekly-oil-bulletin_en",
    sourceName: "Comissão Europeia, Weekly Oil Bulletin",
  },
  {
    slug: "desemprego",
    group: "trabalho",
    title: "Desemprego",
    short: "Taxa de desemprego",
    unit: "%",
    digits: 1,
    frequency: "mensal",
    definition: "Percentagem da população ativa sem emprego, ajustada de sazonalidade.",
    source: { kind: "eurostat", dataset: "une_rt_m", params: { age: "TOTAL", sex: "T", unit: "PC_ACT", s_adj: "SA" }, since: "2019-01", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}une_rt_m/default/table`,
    sourceName: "Eurostat, une_rt_m",
  },
  {
    slug: "salario-minimo",
    group: "trabalho",
    title: "Salário mínimo",
    short: "Salário mínimo mensal",
    unit: "€",
    digits: 0,
    frequency: "anual",
    definition: "Retribuição mínima mensal garantida, paga 14 vezes por ano.",
    source: { kind: "eurostat", dataset: "earn_mw_cur", params: { currency: "EUR" }, since: "2015", geos: ["PT"] },
    sourceUrl: `${E}earn_mw_cur/default/table`,
    sourceName: "Eurostat, earn_mw_cur",
    transform: "monthly14to12",
    note: "O Eurostat apresenta o salário mínimo em 12 prestações. Convertemos para as 14 prestações previstas na lei (valor × 12 ÷ 14).",
  },
  {
    slug: "divida-publica",
    group: "financas",
    title: "Dívida pública",
    short: "Dívida pública, % do PIB",
    unit: "%",
    digits: 1,
    frequency: "anual",
    definition: "Dívida bruta das administrações públicas, no critério de Maastricht, em percentagem do PIB.",
    source: { kind: "eurostat", dataset: "gov_10dd_edpt1", params: { unit: "PC_GDP", sector: "S13", na_item: "GD" }, since: "2010", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}gov_10dd_edpt1/default/table`,
    sourceName: "Eurostat, gov_10dd_edpt1",
  },
  {
    slug: "saldo-orcamental",
    group: "financas",
    title: "Saldo orçamental",
    short: "Saldo das contas públicas, % do PIB",
    unit: "%",
    digits: 1,
    frequency: "anual",
    definition: "Diferença entre receitas e despesas das administrações públicas. Um valor negativo é défice; positivo é excedente.",
    source: { kind: "eurostat", dataset: "gov_10dd_edpt1", params: { unit: "PC_GDP", sector: "S13", na_item: "B9" }, since: "2010", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}gov_10dd_edpt1/default/table`,
    sourceName: "Eurostat, gov_10dd_edpt1",
  },
  {
    slug: "juros-divida",
    group: "financas",
    title: "Juros da dívida a 10 anos",
    short: "Taxa das Obrigações do Tesouro a 10 anos",
    unit: "%",
    digits: 2,
    frequency: "mensal",
    definition: "Taxa de rendibilidade média mensal das obrigações do Tesouro português com prazo residual de 10 anos.",
    source: { kind: "bpstat", domain: 26, dataset: "690b7b36fd36c0dbe249c48cbbc39524", series: 12099464, since: "2019-01-01" },
    sourceUrl: "https://bpstat.bportugal.pt/serie/12099464",
    sourceName: "Banco de Portugal, BPstat",
  },
  {
    slug: "precos-habitacao",
    group: "habitacao",
    title: "Preços da habitação",
    short: "Preços da habitação, variação homóloga",
    unit: "%",
    digits: 1,
    frequency: "trimestral",
    definition: "Variação do índice de preços da habitação face ao mesmo trimestre do ano anterior.",
    source: { kind: "eurostat", dataset: "prc_hpi_q", params: { purchase: "TOTAL", unit: "RCH_A" }, since: "2019-Q1", geos: ["PT", "ES", "EU27_2020"] },
    sourceUrl: `${E}prc_hpi_q/default/table`,
    sourceName: "Eurostat, prc_hpi_q",
  },
  {
    slug: "juro-credito-habitacao",
    group: "habitacao",
    title: "Juro do crédito à habitação",
    short: "Taxa de juro em novos créditos à habitação",
    unit: "%",
    digits: 2,
    frequency: "mensal",
    definition: "Taxa de juro média dos novos empréstimos para compra de habitação concedidos pelos bancos em Portugal.",
    source: { kind: "bpstat", domain: 21, dataset: "6eaa8db94523f54733dddc22479c11a4", series: 12533735, since: "2019-01-01" },
    sourceUrl: "https://bpstat.bportugal.pt/serie/12533735",
    sourceName: "Banco de Portugal, BPstat",
  },
  {
    slug: "populacao",
    group: "pessoas",
    title: "População",
    short: "População residente a 1 de janeiro",
    unit: "pessoas",
    digits: 0,
    frequency: "anual",
    definition: "Número de pessoas a residir em Portugal a 1 de janeiro de cada ano.",
    source: { kind: "eurostat", dataset: "demo_pjan", params: { age: "TOTAL", sex: "T" }, since: "2010", geos: ["PT"] },
    sourceUrl: `${E}demo_pjan/default/table`,
    sourceName: "Eurostat, demo_pjan",
  },
];

export const GROUP_LABEL: Record<IndicatorDef["group"], string> = {
  crescimento: "Crescimento",
  precos: "Preços",
  combustiveis: "Combustíveis",
  trabalho: "Trabalho e salários",
  financas: "Contas públicas",
  habitacao: "Habitação",
  pessoas: "População",
};

export const GEO_LABEL: Record<Geo, string> = { PT: "Portugal", ES: "Espanha", EU27_2020: "União Europeia" };

export type IndicatorSnapshot = {
  slug: string;
  importedAt: string;
  sourceUpdatedAt: string | null;
  series: Partial<Record<Geo, Point[]>>;
  /** Latest daily national average, when a daily source exists (fuel prices). */
  latestDaily?: { date: string; value: number; stations: number; source: string; sourceUrl: string } | null;
};

export type EconomiaSnapshot = {
  importedAt: string;
  indicators: IndicatorSnapshot[];
  failed: { slug: string; error: string }[];
};
