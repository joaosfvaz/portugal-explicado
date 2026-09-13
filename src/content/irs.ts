import type { SourceRef } from "@/components/ui";

/**
 * How IRS works and how each type of income is taxed, for tax year 2026 (continente).
 * Values from the Código do IRS as amended by the OE 2026 (Lei 73-A/2025) and DL 97/2026.
 * Research notes and open questions: docs/research/irs.md.
 */

const CHECKED = "2026-09-13";
const s = (title: string, url: string, verification: "primary" | "derived" | "secondary" = "primary"): SourceRef => ({ title, url, verifiedOn: CHECKED, verification });

export const IRS_SOURCES: SourceRef[] = [
  s("Código do IRS, versão consolidada, Portal das Finanças", "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs68.aspx"),
  s("Lei n.º 73-A/2025, Orçamento do Estado para 2026", "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/Lei_73_A_2025.pdf"),
  s("Despacho n.º 233-A/2026, tabelas de retenção na fonte de 2026 (continente)", "https://files.diariodarepublica.pt/2s/2026/01/003000001/0000200010.pdf"),
  s("Estatuto dos Benefícios Fiscais, art. 21.º (PPR)", "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/bf_rep/Pages/ebf-artigo-21-ordm-.aspx"),
  s("Estatuto dos Benefícios Fiscais, art. 45.º-C (rendas moderadas)", "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/bf_rep/Pages/ebf45c.aspx"),
  s("Decreto-Lei n.º 97/2026, de 20 de maio", "https://files.diariodarepublica.pt/1s/2026/05/09700/0001400040.pdf"),
  s("Estatuto dos Benefícios Fiscais, art. 58.º-A (IFICI)", "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/bf_rep/Pages/ebf58a.aspx"),
];

export type IrsStep = { title: string; plain: string; details: string[] };

export const IRS_STEPS: IrsStep[] = [
  {
    title: "Somar o que recebeu, por tipo",
    plain: "Junta-se tudo o que a pessoa recebeu no ano, separado em categorias: salário, recibos verdes, juros e dividendos, rendas, mais-valias e pensões.",
    details: ["Quem vive em Portugal mais de 183 dias num período de 12 meses é residente e paga IRS sobre o que ganha em todo o mundo (art. 16.º).", "Quem não é residente só paga sobre o que ganha em Portugal."],
  },
  {
    title: "Tirar a dedução específica",
    plain: "A cada tipo de rendimento tira-se um valor que a lei considera custo de o obter. No salário e na pensão são pelo menos 4 587,09 € por pessoa.",
    details: [
      "Salário e pensões: 4 587,09 € (8,54 × IAS), ou as contribuições obrigatórias, se forem maiores (arts. 25.º e 53.º).",
      "Recibos verdes no regime simplificado: em vez de custos, conta só uma parte da faturação, por exemplo 75% nas profissões da tabela oficial (art. 31.º).",
      "Rendas: tiram-se as obras de conservação, o condomínio e o IMI (art. 41.º).",
    ],
  },
  {
    title: "Juntar os rendimentos",
    plain: "Salário, recibos verdes e pensões somam-se sempre. Juros, dividendos, rendas e ganhos com ações têm uma taxa própria, mas a pessoa pode escolher juntá-los aos outros.",
    details: [
      "Juntar os rendimentos chama-se «englobar» (art. 22.º). Quem engloba um tipo de rendimento tem de englobar tudo desse tipo no ano.",
      "Nos ganhos com a venda de imóveis, soma-se só metade do ganho (art. 43.º).",
    ],
  },
  {
    title: "Proteger quem ganha pouco",
    plain: "O mínimo de existência garante que quem ganha até cerca do salário mínimo não paga IRS, sobretudo com salário ou pensão.",
    details: [
      "Em 2026, o valor de referência é 12 880 €, ou seja 920 € × 14 meses (art. 70.º).",
      "Esta proteção deixa de se aplicar a quem recebe mais de 16 543,60 € brutos por ano.",
    ],
  },
  {
    title: "Aplicar os escalões",
    plain: "Ao rendimento que sobra, o rendimento coletável, aplicam-se os escalões. Cada parte do rendimento paga a taxa do seu escalão, de 12,5% a 48%.",
    details: [
      "Ninguém paga 48% sobre tudo. Os 48% aplicam-se só à parte acima de 86 634 € (art. 68.º).",
      "Acima de 80 000 € de rendimento coletável paga-se ainda a taxa adicional de solidariedade: 2,5% sobre a parte até 250 000 € e 5% sobre o que passar (art. 68.º-A).",
      "Casados e unidos de facto podem escolher a tributação conjunta. O rendimento do casal é dividido por dois para achar a taxa (art. 69.º).",
    ],
  },
  {
    title: "Tirar as deduções à coleta",
    plain: "Ao imposto calculado, a coleta, tiram-se valores por filhos, despesas de saúde, educação, casa, faturas e poupança para a reforma.",
    details: ["As despesas contam quando a fatura tem o seu NIF e aparece no e-Fatura.", "Há um limite total para a maior parte das deduções, que desce à medida que o rendimento sobe (art. 78.º)."],
  },
  {
    title: "Descontar o que já pagou",
    plain: "Durante o ano, o patrão, os clientes ou o banco já retiveram imposto. Se retiveram mais do que o imposto final, recebe a diferença. Se retiveram menos, paga o resto.",
    details: ["A retenção mensal no salário é um adiantamento, calculado com as tabelas de retenção de 2026.", "Quem passa recibos verdes pode ter de fazer pagamentos por conta em julho, setembro e dezembro (art. 102.º)."],
  },
];

export const DEDUCTIONS: { name: string; how: string; cap: string }[] = [
  { name: "Filhos e outros dependentes", how: "600 € por dependente. Mais 126 € por cada um com até 3 anos. A partir do 2.º dependente com até 6 anos, mais 300 €.", cap: "Valores fixos" },
  { name: "Pais ou avós que vivem consigo", how: "525 € por ascendente com pensão até à mínima. 635 € se for só um.", cap: "Valores fixos" },
  { name: "Despesas gerais familiares", how: "35% das faturas com NIF de quase tudo: supermercado, luz, água, telecomunicações.", cap: "250 € por pessoa; 335 € em família monoparental" },
  { name: "Saúde", how: "15% das consultas, medicamentos, exames e seguros de saúde.", cap: "1 000 € por agregado" },
  { name: "Educação", how: "30% de propinas, creches, livros e refeições escolares.", cap: "800 € por agregado; até 1 100 € com renda de estudante deslocado" },
  { name: "Renda da casa onde vive", how: "15% das rendas de um contrato de habitação permanente comunicado às Finanças.", cap: "900 € em 2026" },
  { name: "Lares e apoio domiciliário", how: "25% das mensalidades.", cap: "403,75 €" },
  { name: "IVA em faturas de certos setores", how: "15% do IVA de oficinas, cabeleireiros, restaurantes, alojamento, veterinários e, desde 2026, livrarias e cultura. 100% do IVA dos passes de transporte.", cap: "250 € por agregado" },
  { name: "PPR (poupança para a reforma)", how: "20% do valor aplicado no ano.", cap: "400 € até 35 anos; 350 € dos 35 aos 50; 300 € acima de 50" },
];

export const FILING: { title: string; body: string }[] = [
  { title: "Quando", body: "A declaração dos rendimentos de 2026 é entregue no Portal das Finanças entre 1 de abril e 30 de junho de 2027. Até ao fim de fevereiro, confirme o agregado familiar e as faturas no e-Fatura." },
  { title: "IRS Automático", body: "Para muitas pessoas com salário ou pensão, as Finanças preparam a declaração. Se não fizer nada até 30 de junho, a proposta passa a definitiva (art. 58.º-A)." },
  { title: "Quem não tem de entregar", body: "Quem só teve juros ou dividendos com retenção de 28% e não quer englobar, ou quem só teve salário ou pensão até 8 500 € sem retenção (art. 58.º). Pode entregar na mesma, por exemplo para receber deduções." },
  { title: "Casados e unidos de facto", body: "A regra é a tributação separada. O casal pode escolher a tributação conjunta na declaração. Vale a pena simular as duas no Portal das Finanças." },
  { title: "Não residentes", body: "Pagam 25% sobre salários, recibos verdes e pensões obtidos em Portugal, e 28% sobre juros e dividendos. Residentes na UE que ganham 90% ou mais em Portugal podem pedir as regras dos residentes (art. 17.º-A)." },
  { title: "Açores e Madeira", body: "As regiões autónomas têm taxas de IRS mais baixas e tabelas de retenção próprias. Os valores desta página são do continente." },
];

export type Rate = { label: string; value: string; article: string };

export type IncomeCategory = {
  code: string;
  name: string;
  plain: string;
  examples: string[];
  howTaxed: string[];
  rates: Rate[];
  withholding: string;
  people: string;
  state: string;
  changes2026: string[];
};

export const CATEGORIES: IncomeCategory[] = [
  {
    code: "A",
    name: "Salário",
    plain: "O dinheiro que recebe por trabalhar para uma empresa ou para outra pessoa, com contrato.",
    examples: ["Salário mensal", "Subsídios de férias e de Natal", "Horas extra", "Prémios e comissões"],
    howTaxed: [
      "Soma-se sempre aos outros rendimentos e paga a taxa dos escalões.",
      "Tira-se a dedução específica de 4 587,09 €, ou as contribuições para a Segurança Social, se forem maiores.",
      "Até aos 35 anos, o IRS Jovem isenta uma parte do salário durante 10 anos.",
      "Os prémios de produtividade pagos em 2026 estão isentos até 6% do salário base anual, se a empresa fez um aumento salarial que cumpra as regras.",
    ],
    rates: [
      { label: "Dedução específica", value: "4 587,09 €", article: "art. 25.º" },
      { label: "Taxas", value: "Escalões de 12,5% a 48%", article: "art. 68.º" },
      { label: "Limite anual do IRS Jovem", value: "29 542,15 €", article: "art. 12.º-B" },
    ],
    withholding: "O patrão retém IRS todos os meses com as tabelas de 2026. Salários até 920 € por mês não têm retenção.",
    people: "O imposto final depende do salário do ano inteiro e da família. A retenção mensal é só um adiantamento, acertado na declaração.",
    state: "É a maior fonte de receita do IRS. A retenção todos os meses dá ao Estado receita regular ao longo do ano.",
    changes2026: ["Escalões atualizados e taxas do 2.º ao 5.º escalão mais baixas.", "O mínimo de existência subiu para 12 880 €."],
  },
  {
    code: "B",
    name: "Recibos verdes e negócio próprio",
    plain: "O dinheiro de quem trabalha por conta própria: passa recibos verdes, vende produtos, tem alojamento local ou um negócio em nome individual.",
    examples: ["Arquiteto, advogado ou programador com recibos verdes", "Explicações", "Venda de artesanato", "Alojamento local"],
    howTaxed: [
      "No regime simplificado, para quem faturou até 200 000 €, não se contam as despesas uma a uma. Conta só uma parte da faturação.",
      "Nas profissões da tabela oficial conta 75% da faturação. Noutros serviços conta 35%. Nas vendas conta 15%.",
      "Nos serviços, deve ter despesas registadas de pelo menos 15% da faturação. Os 4 587,09 € da dedução específica já contam, por isso esta regra só pesa acima de cerca de 30 580 € de faturação.",
      "No 1.º ano de atividade, a parte que conta desce para metade. No 2.º ano, desce 25%.",
      "O resultado soma-se sempre aos outros rendimentos e paga a taxa dos escalões.",
    ],
    rates: [
      { label: "Profissões da tabela do art. 151.º", value: "75% da faturação", article: "art. 31.º" },
      { label: "Outros serviços", value: "35% da faturação", article: "art. 31.º" },
      { label: "Vendas, restauração e hotelaria", value: "15% da faturação", article: "art. 31.º" },
      { label: "Retenção pelo cliente (profissões da tabela)", value: "23%", article: "art. 101.º" },
      { label: "Retenção pelo cliente (outros serviços)", value: "11,5%", article: "art. 101.º" },
      { label: "Dispensa de retenção", value: "Faturação prevista abaixo de 15 000 €", article: "art. 101.º-B" },
    ],
    withholding: "Os clientes com contabilidade organizada, em regra empresas, retêm 23% ou 11,5% de cada recibo. Quem prevê faturar menos de 15 000 € pode pedir dispensa.",
    people: "Como a retenção de 23% é alta, muitas pessoas com recibos verdes recebem reembolso. Guardar faturas da atividade no e-Fatura evita pagar mais.",
    state: "O regime simplificado reduz a burocracia e o controlo, porque presume as despesas em vez de as verificar uma a uma.",
    changes2026: ["Os coeficientes e as taxas de retenção não mudaram.", "A dedução específica usada na regra dos 15% subiu para 4 587,09 €."],
  },
  {
    code: "E",
    name: "Juros e dividendos",
    plain: "O dinheiro que as suas poupanças rendem: juros de depósitos e certificados, e dividendos de ações.",
    examples: ["Juros de depósito a prazo ou conta-poupança", "Juros de Certificados de Aforro e do Tesouro", "Dividendos de ações", "Juros de obrigações"],
    howTaxed: [
      "Quando quem paga é português, o banco retém 28% e o imposto fica pago. Não é preciso declarar.",
      "Quando quem paga é estrangeiro e não retém, declara-se e paga-se 28%.",
      "Pode escolher juntar estes rendimentos aos outros. Nesse caso, os 28% retidos passam a ser um adiantamento. Os dividendos de empresas portuguesas ou da UE contam só metade.",
    ],
    rates: [
      { label: "Taxa liberatória", value: "28%", article: "art. 71.º" },
      { label: "Dividendos englobados", value: "Conta 50% do valor", article: "art. 40.º-A" },
      { label: "Entidades em paraísos fiscais", value: "35%", article: "art. 71.º" },
    ],
    withholding: "Retenção definitiva de 28% pelo banco ou pela empresa portuguesa que paga.",
    people: "Poupanças pequenas pagam 28%, mesmo quando a pessoa ganha pouco. Quem está num escalão abaixo de 28% pode pagar menos se englobar, mas tem de englobar todos os juros e dividendos do ano.",
    state: "A taxa fixa retida pelo banco é simples de cobrar e não exige declaração.",
    changes2026: ["A taxa de 28% não mudou."],
  },
  {
    code: "F",
    name: "Rendas",
    plain: "O dinheiro que recebe por arrendar uma casa, uma loja ou um terreno.",
    examples: ["Renda de uma casa arrendada para habitação", "Renda de uma loja ou escritório", "Subarrendamento"],
    howTaxed: [
      "Às rendas tiram-se as obras de conservação, o condomínio e o IMI. Os juros do crédito não contam.",
      "Desde 1 de janeiro de 2026, as rendas de habitação até 2 300 € por mês pagam 10%, até 2029 (DL 97/2026).",
      "As outras rendas de habitação pagam 25%, com taxas mais baixas para contratos longos: 15% de 5 a 10 anos, 10% de 10 a 20 anos e 5% a partir de 20 anos.",
      "As rendas de lojas e escritórios pagam 28%.",
      "Pode escolher juntar as rendas aos outros rendimentos e pagar a taxa dos escalões.",
    ],
    rates: [
      { label: "Habitação, renda até 2 300 €/mês", value: "10%", article: "EBF art. 45.º-C" },
      { label: "Habitação, regra geral", value: "25%", article: "art. 72.º" },
      { label: "Contratos de 20 anos ou mais", value: "5%", article: "art. 72.º" },
      { label: "Lojas e escritórios", value: "28%", article: "art. 72.º" },
    ],
    withholding: "Só retém o inquilino com contabilidade organizada: 25%, ou 10% nas rendas moderadas.",
    people: "Desde 2026, os senhorios com rendas moderadas pagam menos IRS. Os inquilinos podem deduzir até 900 € de renda.",
    state: "O Estado recebe menos imposto para tentar que haja mais casas para arrendar a preços moderados.",
    changes2026: ["Nova taxa de 10% para rendas de habitação até 2 300 € por mês.", "A dedução do inquilino subiu para 900 €."],
  },
  {
    code: "G",
    name: "Mais-valias",
    plain: "O ganho quando vende algo por mais do que pagou: uma casa, um terreno, ações, fundos ou criptoativos.",
    examples: ["Venda de uma casa ou terreno", "Venda de ações ou ETF", "Resgate de um fundo", "Venda de bitcoin"],
    howTaxed: [
      "O ganho é o preço de venda menos o preço de compra, as despesas da compra e da venda e as obras dos últimos 12 anos.",
      "Imóveis: soma-se metade do ganho aos outros rendimentos e paga a taxa dos escalões.",
      "Quem vende a casa onde vive e compra outra casa para viver, entre 24 meses antes e 36 meses depois, não paga sobre o valor reinvestido.",
      "Ações, fundos e ETF: o saldo do ano paga 28%, ou engloba-se. Títulos cotados detidos mais de 2 anos têm uma parte do ganho excluída: 10%, 20% a partir de 5 anos e 30% a partir de 8 anos.",
      "Criptoativos detidos 365 dias ou mais não pagam IRS. Detidos menos tempo, pagam 28% ou englobam-se.",
    ],
    rates: [
      { label: "Imóveis", value: "50% do ganho, às taxas dos escalões", article: "art. 43.º" },
      { label: "Ações, fundos e ETF", value: "28%", article: "art. 72.º" },
      { label: "Criptoativos detidos 365 dias ou mais", value: "Não pagam", article: "art. 10.º" },
      { label: "Criptoativos detidos menos de 365 dias", value: "28%", article: "art. 72.º" },
    ],
    withholding: "Não há retenção. O imposto é calculado na declaração anual.",
    people: "Quem vende a casa onde vive para comprar outra normalmente não paga IRS. Quem investe a longo prazo paga menos do que 28% sobre o ganho.",
    state: "As exclusões incentivam a habitação e a poupança de longo prazo, mas reduzem a receita e obrigam a controlar prazos.",
    changes2026: ["Vendas de casas entre 2026 e 2029 também ficam isentas se o dinheiro for reinvestido em casas para arrendar a renda moderada (DL 97/2026)."],
  },
  {
    code: "H",
    name: "Pensões",
    plain: "O dinheiro da reforma, de invalidez ou de sobrevivência, pago pela Segurança Social, pela Caixa Geral de Aposentações ou por um fundo de pensões.",
    examples: ["Pensão de velhice", "Pensão de sobrevivência", "Pensão de invalidez", "Complemento de reforma de um fundo"],
    howTaxed: [
      "Tira-se a dedução específica de 4 587,09 € por pessoa.",
      "Soma-se aos outros rendimentos e paga a taxa dos escalões.",
      "O mínimo de existência protege as pensões baixas.",
    ],
    rates: [
      { label: "Dedução específica", value: "4 587,09 €", article: "art. 53.º" },
      { label: "Não residentes", value: "25%", article: "art. 71.º" },
    ],
    withholding: "A entidade que paga retém IRS com as tabelas de pensões de 2026. Pensões até 920 € por mês não têm retenção.",
    people: "Muitas pensões baixas não pagam IRS, por causa do mínimo de existência.",
    state: "Com o envelhecimento da população, as pensões pesam cada vez mais na receita e na despesa do Estado.",
    changes2026: ["Os novos escalões, o mínimo de existência e as tabelas de retenção de 2026 também se aplicam às pensões."],
  },
];

export const PRODUCTS: { name: string; category: string; tax: string; when: string; note: string }[] = [
  { name: "Depósito a prazo ou conta-poupança", category: "E", tax: "28% sobre os juros", when: "O banco retém quando paga os juros", note: "Pode englobar, mas então engloba todos os juros e dividendos do ano." },
  { name: "Certificados de Aforro e do Tesouro", category: "E", tax: "28% sobre os juros", when: "Retido quando os juros são pagos", note: "Mesmas regras dos depósitos." },
  { name: "Ações: dividendos", category: "E", tax: "28%, ou metade do valor englobado", when: "Retido quando o dividendo é pago por empresa portuguesa", note: "Dividendos de empresas estrangeiras sem retenção têm de ser declarados." },
  { name: "Ações, fundos e ETF: venda", category: "G", tax: "28% sobre o saldo do ano", when: "Na declaração do ano seguinte", note: "Menos imposto para títulos cotados detidos mais de 2, 5 ou 8 anos." },
  { name: "PPR", category: "E / H", tax: "8% efetivos no resgate nas condições da lei", when: "No resgate", note: "Dá uma dedução de 20% do valor aplicado. Resgatar fora das condições obriga a devolver a dedução, com acréscimo." },
  { name: "Seguro de vida ou de capitalização", category: "E", tax: "28%; cerca de 22,4% após 5 anos e 11,2% após 8 anos", when: "Retido no resgate", note: "A redução exige que pelo menos 35% dos prémios tenham sido pagos na primeira metade do contrato." },
  { name: "Criptoativos: venda", category: "G", tax: "0% se detidos 365 dias ou mais; 28% se menos", when: "Na declaração do ano seguinte", note: "Trocar um criptoativo por outro não paga imposto nesse momento." },
  { name: "Casa: venda", category: "G", tax: "50% do ganho às taxas dos escalões", when: "Na declaração do ano seguinte", note: "Não paga sobre o valor reinvestido na nova casa onde vai viver, dentro dos prazos." },
];

export const IRS_OPEN_POINTS = [
  "Os valores são do continente. Os Açores e a Madeira têm taxas mais baixas.",
  "Não confirmámos se, na tributação conjunta, a taxa adicional de solidariedade usa o rendimento dividido por dois.",
  "As Finanças publicam os valores finais do mínimo de existência para 2026 só no início de 2027.",
];
