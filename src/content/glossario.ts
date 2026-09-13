/**
 * Plain-language glossary. Each entry has one short sentence that fits in a small popup, and the words
 * that should link to it on other pages (`match`). Definitions describe what a word means, never a judgement.
 */

export type GlossaryEntry = {
  id: string;
  term: string;
  /** Words or phrases on other pages that open this entry. Case is ignored. */
  match: string[];
  short: string;
  /** Optional second sentence or example, shown only on the glossary page. */
  more?: string;
  /** Page where the subject is explained in full. */
  href?: string;
  topic: "dinheiro" | "impostos" | "casa" | "economia" | "leis" | "eleicoes" | "estado" | "trabalho";
};

export const TOPIC_LABEL: Record<GlossaryEntry["topic"], string> = {
  dinheiro: "Dinheiro e bancos",
  impostos: "Impostos",
  casa: "Casa",
  economia: "Economia",
  leis: "Leis e Parlamento",
  eleicoes: "Eleições",
  estado: "Estado",
  trabalho: "Trabalho e Segurança Social",
};

export const GLOSSARY: GlossaryEntry[] = [
  // Economia
  { id: "pontos-percentuais", term: "Pontos percentuais (p.p.)", match: ["p.p.", "pontos percentuais"], short: "A diferença entre duas percentagens. Se a inflação passa de 2% para 3%, subiu 1 ponto percentual.", more: "Não é o mesmo que subir 1%. De 2% para 3% é uma subida de 50% no valor da taxa.", topic: "economia" },
  { id: "inflacao", term: "Inflação", match: ["inflação"], short: "Quanto os preços sobem, em média, de um ano para o outro.", more: "Com 3% de inflação, o que custava 100 € custa cerca de 103 € um ano depois.", href: "/economia/inflacao", topic: "economia" },
  { id: "variacao-homologa", term: "Variação homóloga", match: ["variação homóloga", "homóloga"], short: "A comparação com o mesmo mês ou trimestre do ano anterior.", topic: "economia" },
  { id: "pib", term: "PIB", match: ["PIB", "produto interno bruto"], short: "O valor de tudo o que o país produz num período: bens e serviços.", href: "/economia/crescimento-pib-trimestral", topic: "economia" },
  { id: "taxa-desemprego", term: "Taxa de desemprego", match: ["taxa de desemprego"], short: "A percentagem de pessoas que querem trabalhar e procuram emprego, mas não têm.", href: "/economia/desemprego", topic: "economia" },
  { id: "divida-publica", term: "Dívida pública", match: ["dívida pública"], short: "O dinheiro que o Estado deve, por ter gastado mais do que recebeu ao longo dos anos.", href: "/economia/divida-publica", topic: "economia" },
  { id: "saldo-orcamental", term: "Saldo orçamental (défice ou excedente)", match: ["saldo orçamental", "défice", "excedente orçamental"], short: "A diferença entre o que o Estado recebe e o que gasta num ano. Negativo é défice; positivo é excedente.", topic: "economia" },
  { id: "bce", term: "BCE", match: ["BCE", "Banco Central Europeu"], short: "O banco central da zona euro. Decide as taxas de juro de referência para os países do euro.", topic: "economia" },

  // Dinheiro e bancos
  { id: "taxa-de-juro", term: "Taxa de juro", match: ["taxa de juro"], short: "O preço de pedir dinheiro emprestado, em percentagem por ano.", topic: "dinheiro" },
  { id: "tan", term: "TAN", match: ["TAN", "taxa anual nominal"], short: "Taxa Anual Nominal: a taxa de juro do empréstimo, sem comissões nem seguros.", topic: "dinheiro" },
  { id: "taeg", term: "TAEG", match: ["TAEG"], short: "Taxa Anual Efetiva Global: o custo total do crédito por ano, com juros, comissões e seguros obrigatórios. Serve para comparar propostas.", topic: "dinheiro" },
  { id: "euribor", term: "Euribor", match: ["Euribor"], short: "A taxa a que os bancos europeus emprestam dinheiro entre si. Nos créditos com taxa variável, a prestação muda quando a Euribor muda.", topic: "dinheiro" },
  { id: "spread", term: "Spread", match: ["spread"], short: "A margem que o banco soma à Euribor. Fica igual durante o contrato.", topic: "dinheiro" },
  { id: "taxa-de-esforco", term: "Taxa de esforço", match: ["taxa de esforço"], short: "A parte do rendimento líquido mensal que vai para prestações de créditos.", more: "Com 2 000 € líquidos e 800 € de prestações, a taxa de esforço é 40%.", topic: "dinheiro" },
  { id: "prestacao", term: "Prestação", match: ["prestação mensal", "prestação"], short: "O valor que se paga todos os meses para devolver um empréstimo, com juros.", topic: "dinheiro" },
  { id: "ppr", term: "PPR", match: ["PPR"], short: "Plano Poupança Reforma: uma poupança para a reforma com vantagens no IRS.", href: "/impostos/tipos-de-rendimento", topic: "dinheiro" },

  // Casa
  { id: "entrada", term: "Entrada", match: ["valor da entrada"], short: "A parte do preço da casa que o comprador paga com dinheiro próprio, sem empréstimo.", topic: "casa" },
  { id: "escritura", term: "Escritura", match: ["escritura"], short: "O ato oficial em que a casa passa para o novo dono, feito num notário, advogado ou Casa Pronta.", topic: "casa" },
  { id: "casa-pronta", term: "Casa Pronta", match: ["Casa Pronta"], short: "Um balcão público onde se faz a compra e o registo da casa num só momento.", topic: "casa" },
  { id: "imt", term: "IMT", match: ["IMT"], short: "Imposto Municipal sobre as Transmissões: o imposto que se paga quando se compra uma casa ou um terreno.", href: "/casa/comprar", topic: "casa" },
  { id: "imposto-do-selo", term: "Imposto do Selo", match: ["Imposto do Selo"], short: "Um imposto sobre certos atos e contratos, como comprar casa ou pedir um empréstimo.", topic: "casa" },
  { id: "imi", term: "IMI", match: ["IMI"], short: "Imposto Municipal sobre Imóveis: o imposto anual que os donos de casas e terrenos pagam à câmara.", topic: "casa" },
  { id: "vpt", term: "Valor patrimonial tributário (VPT)", match: ["valor patrimonial tributário", "VPT"], short: "O valor da casa que as Finanças usam para calcular os impostos. Aparece na caderneta predial.", topic: "casa" },
  { id: "habitacao-propria", term: "Habitação própria e permanente", match: ["habitação própria e permanente"], short: "A casa onde a pessoa vive a maior parte do ano e onde tem a morada fiscal.", topic: "casa" },
  { id: "renda", term: "Atualização da renda", match: ["atualização da renda", "coeficiente de atualização"], short: "O aumento anual da renda permitido por lei, calculado com um coeficiente publicado todos os anos.", href: "/casa/arrendar", topic: "casa" },

  // Impostos
  { id: "irs", term: "IRS", match: ["IRS"], short: "Imposto sobre o Rendimento das Pessoas Singulares: o imposto sobre o que cada pessoa recebe num ano.", href: "/impostos/como-funciona-o-irs", topic: "impostos" },
  { id: "iva", term: "IVA", match: ["IVA"], short: "Imposto sobre o Valor Acrescentado: o imposto incluído no preço do que se compra. A taxa normal no continente é 23%.", topic: "impostos" },
  { id: "rendimento-bruto", term: "Rendimento bruto", match: ["rendimento bruto", "salário bruto", "brutos"], short: "O valor antes de descontos para impostos e Segurança Social.", topic: "impostos" },
  { id: "rendimento-liquido", term: "Rendimento líquido", match: ["rendimento líquido", "salário líquido"], short: "O valor que sobra depois dos descontos. É o que chega à conta.", topic: "impostos" },
  { id: "rendimento-coletavel", term: "Rendimento coletável", match: ["rendimento coletável"], short: "A parte do rendimento sobre a qual se calcula o IRS, depois das deduções específicas.", href: "/impostos/como-funciona-o-irs", topic: "impostos" },
  { id: "deducao-especifica", term: "Dedução específica", match: ["dedução específica", "deduções específicas"], short: "Um valor que se tira ao rendimento antes de calcular o IRS. No salário são pelo menos 4 587,09 € em 2026.", topic: "impostos" },
  { id: "coleta", term: "Coleta", match: ["coleta"], short: "O imposto calculado com os escalões, antes de tirar as deduções.", topic: "impostos" },
  { id: "deducoes-coleta", term: "Deduções à coleta", match: ["deduções à coleta", "dedução à coleta"], short: "Valores que se tiram ao imposto: filhos, saúde, educação, renda, faturas.", topic: "impostos" },
  { id: "escalao", term: "Escalão de IRS", match: ["escalões", "escalão"], short: "Uma faixa de rendimento com a sua taxa. Cada parte do rendimento paga a taxa da faixa onde está.", href: "/impostos/escaloes-irs", topic: "impostos" },
  { id: "taxa-marginal", term: "Taxa marginal", match: ["taxa marginal"], short: "A taxa que se paga sobre o último euro ganho, a do escalão mais alto atingido.", topic: "impostos" },
  { id: "taxa-media", term: "Taxa média", match: ["taxa média"], short: "O imposto total a dividir pelo rendimento. É sempre mais baixa do que a taxa marginal.", topic: "impostos" },
  { id: "retencao-na-fonte", term: "Retenção na fonte", match: ["retenção na fonte", "retenção", "retido", "retêm", "retém"], short: "Imposto descontado logo no pagamento, pelo patrão, cliente ou banco. É um adiantamento do IRS do ano.", topic: "impostos" },
  { id: "reembolso", term: "Reembolso", match: ["reembolso"], short: "O dinheiro que as Finanças devolvem quando se descontou mais IRS do que o devido.", topic: "impostos" },
  { id: "englobamento", term: "Englobamento", match: ["englobamento", "englobar", "englobado", "englobados", "engloba"], short: "Juntar rendimentos com taxa própria, como juros ou rendas, aos outros rendimentos, para pagarem a taxa dos escalões.", topic: "impostos" },
  { id: "minimo-existencia", term: "Mínimo de existência", match: ["mínimo de existência"], short: "Uma regra que garante que quem ganha até cerca do salário mínimo não paga IRS.", topic: "impostos" },
  { id: "ias", term: "IAS", match: ["IAS", "indexante dos apoios sociais"], short: "Indexante dos Apoios Sociais: um valor de referência usado para calcular apoios e limites. Em 2026 é 537,13 €.", topic: "impostos" },
  { id: "recibos-verdes", term: "Recibos verdes", match: ["recibos verdes"], short: "A forma de trabalhar por conta própria e passar faturas-recibo no Portal das Finanças.", href: "/impostos/tipos-de-rendimento", topic: "impostos" },
  { id: "mais-valia", term: "Mais-valia", match: ["mais-valias", "mais-valia"], short: "O ganho quando se vende algo por mais do que se pagou.", topic: "impostos" },
  { id: "agregado-familiar", term: "Agregado familiar", match: ["agregado familiar", "agregado"], short: "As pessoas que entram juntas na mesma declaração de IRS: casal e dependentes.", topic: "impostos" },
  { id: "dependente", term: "Dependente", match: ["dependentes", "dependente"], short: "Um filho ou outra pessoa a cargo que entra no IRS de quem o sustenta.", topic: "impostos" },
  { id: "e-fatura", term: "e-Fatura", match: ["e-Fatura"], short: "O sistema do Portal das Finanças onde aparecem as faturas com o seu NIF.", topic: "impostos" },
  { id: "nif", term: "NIF", match: ["NIF"], short: "Número de Identificação Fiscal: o número de cada pessoa nas Finanças.", href: "/vida/nif", topic: "impostos" },

  // Trabalho
  { id: "tsu", term: "TSU", match: ["TSU", "taxa social única"], short: "Taxa Social Única: as contribuições para a Segurança Social, pagas pelo trabalhador e pelo patrão.", topic: "trabalho" },
  { id: "niss", term: "NISS", match: ["NISS"], short: "Número de Identificação da Segurança Social.", href: "/vida/seguranca-social-e-sns", topic: "trabalho" },
  { id: "salario-minimo", term: "Salário mínimo", match: ["salário mínimo", "RMMG"], short: "O valor mais baixo que se pode pagar por um mês de trabalho a tempo inteiro. Em 2026 é 920 €.", href: "/economia/salario-minimo", topic: "trabalho" },

  // Leis
  { id: "projeto-de-lei", term: "Projeto de lei", match: ["projetos de lei", "projeto de lei"], short: "Uma proposta de lei apresentada por deputados ou grupos parlamentares.", topic: "leis" },
  { id: "proposta-de-lei", term: "Proposta de lei", match: ["propostas de lei", "proposta de lei"], short: "Uma proposta de lei apresentada pelo Governo ou por uma assembleia regional.", topic: "leis" },
  { id: "generalidade", term: "Votação na generalidade", match: ["na generalidade", "generalidade"], short: "A primeira votação, sobre a ideia geral da proposta.", topic: "leis" },
  { id: "especialidade", term: "Especialidade", match: ["na especialidade", "especialidade"], short: "A fase em que uma comissão de deputados discute e muda o texto artigo a artigo.", topic: "leis" },
  { id: "votacao-final-global", term: "Votação final global", match: ["votação final global"], short: "A última votação do texto completo no plenário da Assembleia.", topic: "leis" },
  { id: "promulgacao", term: "Promulgação", match: ["promulgação", "promulga", "promulgada"], short: "A assinatura do Presidente da República que permite publicar uma lei.", topic: "leis" },
  { id: "veto", term: "Veto", match: ["veto", "vetada", "vetar"], short: "Quando o Presidente não assina uma lei e a devolve com as razões. A Assembleia pode voltar a aprová-la.", topic: "leis" },
  { id: "diario-da-republica", term: "Diário da República", match: ["Diário da República"], short: "O jornal oficial onde as leis são publicadas. Uma lei só vale depois de publicada.", href: "/parlamento/diario-republica", topic: "leis" },
  { id: "decreto-lei", term: "Decreto-lei", match: ["decreto-lei", "decretos-leis"], short: "Uma lei feita pelo Governo, sobre assuntos em que a Constituição o permite.", topic: "leis" },
  { id: "plenario", term: "Plenário", match: ["plenário"], short: "A reunião de todos os deputados na sala principal da Assembleia.", topic: "leis" },
  { id: "legislatura", term: "Legislatura", match: ["legislatura"], short: "O período de trabalho de uma Assembleia eleita, em regra 4 anos.", topic: "leis" },

  // Eleições
  { id: "maioria-absoluta", term: "Maioria absoluta", match: ["maioria absoluta"], short: "Mais de metade dos lugares ou dos votos. Na Assembleia da República são 116 deputados.", topic: "eleicoes" },
  { id: "votos-validos", term: "Votos válidos", match: ["votos válidos", "votos validamente expressos"], short: "Os votos num candidato ou lista. Não contam os votos em branco nem os nulos.", topic: "eleicoes" },
  { id: "circulo-eleitoral", term: "Círculo eleitoral", match: ["círculo eleitoral", "círculos"], short: "Uma zona que elege os seus próprios deputados, como um distrito.", topic: "eleicoes" },
  { id: "dhondt", term: "Método de D'Hondt", match: ["D'Hondt"], short: "A regra matemática que transforma votos em lugares, lista a lista, em cada círculo.", topic: "eleicoes" },
  { id: "coligacao", term: "Coligação", match: ["coligação", "coligações"], short: "Dois ou mais partidos que concorrem juntos numa só lista.", topic: "eleicoes" },
  { id: "abstencao", term: "Abstenção", match: ["abstenção"], short: "Nas eleições, quem não vai votar. No Parlamento, o deputado que não vota a favor nem contra.", topic: "eleicoes" },
  { id: "referendo", term: "Referendo", match: ["referendo"], short: "Uma votação em que os eleitores respondem sim ou não a uma pergunta.", topic: "eleicoes" },

  // Estado
  { id: "autarquia", term: "Autarquia", match: ["autarquias", "autarquia"], short: "O poder local: municípios e freguesias, com órgãos eleitos pelos moradores.", href: "/estado/regioes-e-autarquias", topic: "estado" },
  { id: "municipio", term: "Município", match: ["municípios", "município", "concelho"], short: "Um concelho, governado pela câmara municipal. Há 308 em Portugal.", topic: "estado" },
  { id: "freguesia", term: "Freguesia", match: ["freguesias", "freguesia"], short: "A parte mais pequena do poder local, dentro de um município.", topic: "estado" },
  { id: "orcamento-estado", term: "Orçamento do Estado", match: ["Orçamento do Estado"], short: "A lei anual que diz quanto o Estado prevê receber e gastar, e em quê.", topic: "estado" },
];

export function glossaryEntry(id: string) {
  return GLOSSARY.find((g) => g.id === id) ?? null;
}
