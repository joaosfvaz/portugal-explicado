/**
 * One entry per fixed page: a plain title, one sentence on what the page answers, the everyday words people
 * type to find it (search), and the pages to read next ("A seguir"). Detail pages built from data (guides,
 * institutions, indicators, elections, municípios, initiatives) get their entries in src/lib/search/index.ts.
 *
 * Keywords are words a reader may use for the same subject, without accents or with them. Only add a keyword
 * when the page really answers it.
 */

export type PageEntry = {
  href: string;
  title: string;
  summary: string;
  keywords?: string[];
  /** Up to three pages to read next, as hrefs of other entries. */
  next?: string[];
};

export const PAGES: PageEntry[] = [
  // Início
  { href: "/para-mim", title: "O que é para mim", summary: "Responda a perguntas simples e veja só as páginas que interessam à sua situação.", keywords: ["a minha situacao", "por onde comecar", "ajuda a escolher"], next: ["/vida/vou", "/vida/prazos", "/vida/ajuda"] },

  // Salário e impostos
  { href: "/impostos", title: "Salário e impostos", summary: "Quanto recebe, como funciona o IRS e para onde vai o dinheiro dos impostos.", keywords: ["impostos", "financas", "dinheiro"], next: ["/trabalho/salario-liquido", "/impostos/como-funciona-o-irs", "/vida/prazos"] },
  { href: "/trabalho/salario-liquido", title: "Quanto recebo líquido", summary: "Calcule quanto recebe na conta por mês, depois da Segurança Social e do IRS.", keywords: ["salario", "ordenado", "vencimento", "liquido", "bruto", "quanto recebo", "descontos", "calculadora", "subsidio de refeicao", "subsidio de ferias", "subsidio de natal"], next: ["/trabalho/recibo-de-vencimento", "/impostos/como-funciona-o-irs", "/trabalho/direitos"] },
  { href: "/trabalho/recibo-de-vencimento", title: "Perceber o recibo de vencimento", summary: "O que quer dizer cada linha do recibo: vencimento base, subsídios, IRS e Segurança Social.", keywords: ["recibo", "recibo de ordenado", "folha de pagamento", "vencimento base", "retencao", "descontos"], next: ["/trabalho/salario-liquido", "/impostos/seguranca-social", "/trabalho/direitos"] },
  { href: "/impostos/como-funciona-o-irs", title: "Como funciona o IRS", summary: "O IRS passo a passo: do que recebeu ao reembolso, com um exemplo.", keywords: ["irs", "declaracao", "entregar o irs", "reembolso", "deducoes", "e-fatura", "retencao na fonte", "financas"], next: ["/impostos/escaloes-irs", "/impostos/tipos-de-rendimento", "/vida/prazos"] },
  { href: "/impostos/escaloes-irs", title: "Escalões do IRS", summary: "A tabela oficial dos escalões, a taxa marginal e a taxa média, com exemplos.", keywords: ["escaloes", "taxa", "taxa marginal", "taxa media", "tabela irs"], next: ["/impostos/calculadora-escaloes", "/impostos/como-funciona-o-irs", "/trabalho/salario-liquido"] },
  { href: "/impostos/calculadora-escaloes", title: "Calculadora do IRS por escalão", summary: "Escreva um rendimento e veja o imposto de cada escalão.", keywords: ["calculadora", "simulador irs", "calcular irs"], next: ["/impostos/escaloes-irs", "/impostos/como-funciona-o-irs"] },
  { href: "/impostos/irs-jovem", title: "IRS Jovem (até 35 anos)", summary: "Quem tem direito e quanto do rendimento fica sem IRS nos primeiros anos de trabalho.", keywords: ["jovem", "jovens", "primeiro emprego", "isencao", "35 anos"], next: ["/trabalho/salario-liquido", "/impostos/como-funciona-o-irs", "/vida/nif"] },
  { href: "/impostos/tipos-de-rendimento", title: "IRS de cada tipo de rendimento", summary: "Como paga IRS o salário, os recibos verdes, as rendas, as pensões e as poupanças.", keywords: ["recibos verdes", "independente", "rendas", "pensao", "juros", "dividendos", "acoes", "ppr", "certificados de aforro", "cripto", "mais-valias", "vender casa", "poupancas"], next: ["/impostos/como-funciona-o-irs", "/vida/criar-empresa", "/impostos/seguranca-social"] },
  { href: "/impostos/seguranca-social", title: "Descontos para a Segurança Social", summary: "Quanto descontam os trabalhadores, as empresas e os trabalhadores independentes.", keywords: ["seguranca social", "taxa social unica", "tsu", "contribuicoes", "11%", "recibos verdes"], next: ["/trabalho/salario-liquido", "/trabalho/reforma", "/vida/seguranca-social-e-sns"] },
  { href: "/impostos/onde-vai-o-meu-imposto", title: "Para onde vai o meu imposto", summary: "Em que gasta o Estado: pensões, saúde, educação, juros da dívida e outras áreas.", keywords: ["orcamento", "despesa publica", "gastos do estado", "onde vai o dinheiro"], next: ["/economia/divida-publica", "/trabalho/reforma", "/parlamento"] },

  // Trabalho e reforma
  { href: "/trabalho", title: "Trabalho e reforma", summary: "Os seus direitos no trabalho, o que fazer se ficar sem emprego e como funciona a reforma.", keywords: ["emprego", "trabalhador", "patrao"], next: ["/trabalho/direitos", "/trabalho/salario-liquido", "/vida/ajuda"] },
  { href: "/trabalho/direitos", title: "Direitos no trabalho", summary: "Férias, faltas, baixa médica, horas extra, despedimento e licença parental.", keywords: ["ferias", "faltas", "baixa", "doenca", "horas extra", "despedimento", "despedido", "contrato", "periodo experimental", "licenca parental", "licenca de maternidade", "licenca de paternidade", "act"], next: ["/vida/subsidio-de-desemprego", "/trabalho/salario-liquido", "/vida/ajuda"] },
  { href: "/vida/subsidio-de-desemprego", title: "Subsídio de desemprego", summary: "Quem tem direito, quanto se recebe e durante quanto tempo, com um simulador.", keywords: ["desemprego", "desempregado", "fiquei sem trabalho", "perdi o emprego", "iefp", "subsidio"], next: ["/vida/vou/ficar-desempregado", "/trabalho/direitos", "/vida/ajuda"] },
  { href: "/trabalho/reforma", title: "A reforma", summary: "A idade da reforma, como a pensão é calculada e onde simular a sua pensão.", keywords: ["reforma", "pensao", "reformado", "idade da reforma", "reforma antecipada", "aposentacao", "cga"], next: ["/vida/vou/reformar-me", "/impostos/tipos-de-rendimento", "/vida/ajuda"] },

  // Casa
  { href: "/casa", title: "Casa", summary: "Quanto custa arrendar, comprar ou construir casa, e o que a lei exige.", keywords: ["habitacao", "morada"], next: ["/casa/arrendar", "/casa/comprar", "/casa/faturas"] },
  { href: "/casa/arrendar", title: "Arrendar casa", summary: "Quanto a renda pode subir, as regras do contrato, o IRS das rendas e os apoios.", keywords: ["renda", "arrendamento", "inquilino", "senhorio", "aumento da renda", "contrato de arrendamento", "porta 65", "apoio a renda"], next: ["/casa/faturas", "/vida/vou/mudar-de-casa", "/vida/prazos"] },
  { href: "/casa/comprar", title: "Comprar casa", summary: "IMT, Imposto do Selo, registo e crédito, com um simulador dos custos e da prestação.", keywords: ["comprar", "compra", "imt", "imposto do selo", "credito habitacao", "emprestimo", "prestacao", "hipoteca", "escritura", "entrada", "imi"], next: ["/economia/juro-credito-habitacao", "/casa/faturas", "/vida/prazos"] },
  { href: "/casa/construir", title: "Construir casa", summary: "Licença, prazos da câmara, documentos e IVA na construção da casa própria.", keywords: ["construcao", "obras", "licenca", "camara", "terreno", "projeto"], next: ["/casa/comprar", "/estado/municipios"] },
  { href: "/casa/faturas", title: "Perceber as faturas da casa", summary: "O que quer dizer cada parte da fatura, as tarifas sociais e como reclamar.", keywords: ["fatura", "conta da luz", "eletricidade", "agua", "gas", "internet", "telemovel", "televisao", "fidelizacao", "tarifa social", "potencia", "reclamar"], next: ["/vida/vou/mudar-de-casa", "/vida/burlas", "/vida/ajuda"] },

  // Papéis e serviços
  { href: "/vida", title: "Papéis e serviços", summary: "Os passos, documentos, custos e prazos dos serviços públicos mais usados.", keywords: ["burocracia", "documentos", "servicos publicos", "vida e burocracia"], next: ["/vida/vou", "/vida/prazos", "/vida/ajuda"] },
  { href: "/vida/vou", title: "Passo a passo para momentos da vida", summary: "O que fazer, por ordem, quando vai ter um filho, fica sem trabalho, se reforma ou muda de casa.", keywords: ["vou", "checklist", "lista", "o que fazer"], next: ["/vida/prazos", "/vida/ajuda", "/para-mim"] },
  { href: "/vida/prazos", title: "Datas a não esquecer", summary: "Os prazos do IRS, do IMI, do IUC e de outros pagamentos, e o que acontece se falhar.", keywords: ["prazos", "datas", "calendario", "quando pagar", "imi", "iuc", "multa", "coima", "atraso"], next: ["/impostos/como-funciona-o-irs", "/vida/carro", "/vida/burlas"] },
  { href: "/vida/abono-de-familia", title: "Abono de família", summary: "Os escalões e os valores do abono, com um simulador.", keywords: ["abono", "filhos", "crianca", "bebe", "garantia para a infancia", "apoio as familias"], next: ["/vida/vou/ter-um-filho", "/trabalho/direitos", "/vida/ajuda"] },

  // Ajuda e proteção
  { href: "/vida/ajuda", title: "Onde pedir ajuda", summary: "Os telefones e sites oficiais das Finanças, da Segurança Social, da ACT, do IEFP e do SNS 24.", keywords: ["ajuda", "contactos", "telefone", "linha", "apoio", "reclamar", "queixa", "sns 24", "act", "iefp", "financas"], next: ["/vida/burlas", "/para-mim", "/glossario"] },
  { href: "/vida/burlas", title: "Mensagens falsas e burlas", summary: "Como saber se uma SMS, email ou chamada é verdadeira e o que fazer se já respondeu.", keywords: ["burla", "fraude", "golpe", "sms", "phishing", "mensagem estranha", "email falso", "mb way", "ctt", "encomenda", "banco", "roubaram", "denunciar"], next: ["/vida/ajuda", "/casa/faturas"] },

  // O país
  { href: "/o-pais", title: "O país", summary: "Quem decide o quê, as leis em discussão, as eleições e a economia em números.", keywords: ["portugal", "politica", "governo"], next: ["/estado/municipios", "/parlamento/iniciativas", "/economia"] },
  { href: "/estado/municipios", title: "O meu município", summary: "Procure o seu concelho: quem governa a câmara e o que o Parlamento decidiu sobre ele.", keywords: ["concelho", "camara", "camara municipal", "presidente da camara", "autarquia", "vereadores", "terra"], next: ["/estado/eleicoes", "/estado/regioes-e-autarquias", "/parlamento/iniciativas"] },
  { href: "/parlamento/iniciativas", title: "Leis em discussão", summary: "Os projetos e propostas de lei no Parlamento, com o estado e o histórico de cada um.", keywords: ["leis", "lei", "iniciativas", "projeto de lei", "proposta de lei", "votacao", "aprovado", "chumbado"], next: ["/parlamento", "/o-que-mudou", "/glossario"] },
  { href: "/estado/eleicoes", title: "Eleições", summary: "Os resultados oficiais das eleições mais recentes e o que cada eleição decide.", keywords: ["eleicoes", "votar", "voto", "resultados", "legislativas", "presidenciais", "autarquicas", "europeias", "recenseamento"], next: ["/estado/municipios", "/parlamento/partidos", "/estado"] },
  { href: "/economia", title: "Economia em números", summary: "Inflação, combustíveis, desemprego, dívida e habitação, com gráficos e comparação com a UE.", keywords: ["economia", "numeros", "estatisticas", "precos", "custo de vida", "ine", "combustiveis"], next: ["/economia/inflacao", "/impostos/onde-vai-o-meu-imposto", "/o-que-mudou"] },
  { href: "/estado", title: "Como funciona o Estado", summary: "Presidente, Assembleia, Governo, tribunais, regiões e autarquias, explicados.", keywords: ["estado", "constituicao", "instituicoes", "poderes"], next: ["/estado/eleicoes", "/parlamento", "/estado/municipios"] },
  { href: "/parlamento", title: "Parlamento", summary: "O que a Assembleia da República discute, aprova e rejeita, com os votos de cada partido.", keywords: ["assembleia", "deputados", "votacoes", "parlamento"], next: ["/parlamento/iniciativas", "/parlamento/partidos", "/parlamento/diario-republica"] },
  { href: "/parlamento/partidos", title: "Partidos e deputados", summary: "Quantos deputados tem cada partido e as iniciativas de cada um.", keywords: ["partidos", "deputados", "psd", "ps", "chega", "il", "livre", "pcp", "be", "cds", "pan", "jpp"], next: ["/parlamento/iniciativas", "/estado/eleicoes"] },
  { href: "/parlamento/diario-republica", title: "Leis publicadas (Diário da República)", summary: "As leis e decretos publicados, com o resumo oficial.", keywords: ["diario da republica", "dr", "decreto-lei", "portaria", "publicado", "lei publicada"], next: ["/o-que-mudou", "/parlamento/iniciativas"] },

  // Mais
  { href: "/glossario", title: "Palavras difíceis", summary: "As palavras difíceis de impostos, casa, economia, leis e eleições, numa frase simples.", keywords: ["glossario", "significado", "o que quer dizer", "dicionario", "palavra"], next: ["/para-mim", "/vida/ajuda"] },
  { href: "/o-que-mudou", title: "O que mudou", summary: "As leis publicadas, os novos números oficiais e as mudanças de regras dos últimos dois meses.", keywords: ["novidades", "mudancas", "noticias", "novo", "atualizacoes", "rss"], next: ["/parlamento/iniciativas", "/vida/prazos", "/economia"] },
  { href: "/fontes", title: "Fontes e verificação", summary: "Todas as fontes oficiais usadas, com a data de verificação.", keywords: ["fontes", "dados", "verificacao"] },
  { href: "/en", title: "English guides", summary: "Practical guides for living in Portugal, in English.", keywords: ["english", "ingles", "estrangeiro", "expat", "foreigner"], next: ["/vida/autorizacao-de-residencia", "/vida/nif"] },
];

/** "A seguir" for detail pages that come from data, by path prefix. */
export const NEXT_BY_PREFIX: { prefix: string; next: string[] }[] = [
  { prefix: "/vida/vou/", next: ["/vida/prazos", "/vida/ajuda"] },
  { prefix: "/economia/", next: ["/economia", "/impostos/onde-vai-o-meu-imposto", "/o-que-mudou"] },
  { prefix: "/estado/eleicoes/", next: ["/estado/eleicoes", "/estado/municipios", "/parlamento/partidos"] },
  { prefix: "/estado/municipios/", next: ["/estado/municipios", "/estado/eleicoes", "/estado/regioes-e-autarquias"] },
  { prefix: "/parlamento/iniciativas/", next: ["/parlamento/iniciativas", "/o-que-mudou", "/glossario"] },
  { prefix: "/estado/", next: ["/estado", "/estado/eleicoes", "/parlamento"] },
  { prefix: "/vida/", next: ["/vida/vou", "/vida/prazos", "/vida/ajuda"] },
];

/** Extra entries for guide and institution pages, which live in other content files. */
export const PAGE_NEXT: Record<string, string[]> = {
  "/vida/nif": ["/vida/cartao-de-cidadao", "/impostos/como-funciona-o-irs", "/vida/ajuda"],
  "/vida/cartao-de-cidadao": ["/vida/nif", "/vida/seguranca-social-e-sns", "/vida/ajuda"],
  "/vida/autorizacao-de-residencia": ["/vida/nif", "/vida/seguranca-social-e-sns", "/en"],
  "/vida/seguranca-social-e-sns": ["/impostos/seguranca-social", "/vida/ajuda", "/vida/abono-de-familia"],
  "/vida/criar-empresa": ["/impostos/tipos-de-rendimento", "/impostos/seguranca-social", "/vida/prazos"],
  "/vida/carro": ["/vida/prazos", "/economia/gasoleo", "/vida/burlas"],
};

/** Titles for pages used in "A seguir" that have no entry above (their content lives in other files). */
export const EXTRA_TITLES: Record<string, string> = {
  "/economia/inflacao": "Inflação",
  "/economia/divida-publica": "Dívida pública",
  "/economia/juro-credito-habitacao": "Juro do crédito à habitação",
  "/economia/gasoleo": "Preço dos combustíveis",
  "/vida/vou/ter-um-filho": "Vou ter um filho",
  "/vida/vou/ficar-desempregado": "Fiquei sem trabalho",
  "/vida/vou/reformar-me": "Vou reformar-me",
  "/vida/vou/mudar-de-casa": "Vou mudar de casa",
  "/vida/nif": "Pedir o NIF",
  "/vida/cartao-de-cidadao": "Cartão de Cidadão",
  "/vida/autorizacao-de-residencia": "Autorização de residência",
  "/vida/seguranca-social-e-sns": "Segurança Social e centro de saúde",
  "/vida/criar-empresa": "Abrir atividade ou empresa",
  "/vida/carro": "Carro",
  "/estado/regioes-e-autarquias": "Regiões e autarquias",
};

/** Plain title of a page, for links. */
export function pageTitle(href: string): string | undefined {
  return PAGES.find((p) => p.href === href)?.title ?? EXTRA_TITLES[href];
}

/** Pages to read next after `pathname`, without the page itself. */
export function nextPages(pathname: string): { href: string; title: string }[] {
  const own = PAGES.find((p) => p.href === pathname)?.next ?? PAGE_NEXT[pathname] ?? NEXT_BY_PREFIX.find((n) => pathname.startsWith(n.prefix))?.next ?? [];
  return own
    .filter((href) => href !== pathname)
    .map((href) => ({ href, title: pageTitle(href) ?? "" }))
    .filter((p) => p.title)
    .slice(0, 3);
}
