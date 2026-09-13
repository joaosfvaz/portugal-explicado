import { periodLabel, periodYear } from "./format";
import type { Geo, IndicatorDef, IndicatorSnapshot } from "./indicators";

/**
 * Plain-language context per indicator: what the number is in everyday terms and
 * what a rise or a fall usually means for families, companies and the State.
 * Written as general economics, with both sides, never as a judgement of the current value.
 */
export type IndicatorContext = {
  plain: string;
  families: string;
  companies: string;
  state: string;
  whenUp: { good: string; bad: string };
  whenDown?: { good: string; bad: string };
};

export const CONTEXT: Record<string, IndicatorContext> = {
  "crescimento-pib": {
    plain: "Mostra se o país produziu mais ou menos bens e serviços do que no ano anterior, já sem o efeito da subida dos preços.",
    families: "Crescimento costuma trazer mais emprego e salários a subir. Uma queda (recessão) costuma trazer despedimentos.",
    companies: "Com a economia a crescer há mais clientes e mais investimento.",
    state: "Mais atividade gera mais impostos sem subir taxas, e o peso da dívida no PIB desce.",
    whenUp: { good: "Mais emprego, mais receita de impostos.", bad: "Se crescer muito depressa, pode pressionar preços e casas." },
    whenDown: { good: "Pode aliviar a inflação.", bad: "Menos emprego e menos receita pública." },
  },
  "crescimento-pib-trimestral": {
    plain: "Compara a produção do país num trimestre com o mesmo trimestre do ano anterior. Mostra a tendência mais recente.",
    families: "É o primeiro sinal de que o emprego e os rendimentos podem melhorar ou piorar nos meses seguintes.",
    companies: "Ajuda a decidir contratações e investimento.",
    state: "Influencia as previsões do Orçamento do Estado e a receita de impostos.",
    whenUp: { good: "Sinal de mais atividade e emprego.", bad: "Um valor alto num só trimestre pode ser temporário." },
    whenDown: { good: "Pode travar a subida dos preços.", bad: "Dois trimestres seguidos de queda face ao trimestre anterior são normalmente chamados recessão." },
  },
  "pib-per-capita": {
    plain: "Mede a riqueza produzida por pessoa, ajustada ao custo de vida de cada país. A média da União Europeia vale 100.",
    families: "Um valor abaixo de 100 significa que, em média, o nível de vida é mais baixo do que a média europeia.",
    companies: "Reflete a produtividade e o poder de compra dos clientes.",
    state: "Serve de referência para os fundos europeus destinados às regiões e países com menor nível de vida.",
    whenUp: { good: "O país aproxima-se da média europeia.", bad: "Pode reduzir o acesso a alguns fundos europeus." },
    whenDown: { good: "Nenhum efeito positivo direto.", bad: "O país afasta-se do nível de vida médio europeu." },
  },
  inflacao: {
    plain: "Mostra quanto os preços no consumidor subiram num ano. Com 3% de inflação, o que custava 100 € custa agora cerca de 103 €.",
    families: "Se os salários e as pensões subirem menos do que a inflação, o dinheiro compra menos.",
    companies: "Custos de energia, materiais e salários sobem; algumas empresas conseguem subir preços, outras não.",
    state: "Recebe mais IVA, mas as pensões e salários públicos são atualizados e os juros da dívida podem subir.",
    whenUp: { good: "Reduz o peso real das dívidas antigas.", bad: "Perda de poder de compra; o BCE pode subir os juros, e o crédito à habitação fica mais caro." },
    whenDown: { good: "Os rendimentos rendem mais; os juros podem descer.", bad: "Preços a descer de forma continuada (deflação) podem travar o consumo e o investimento." },
  },
  "inflacao-anual": {
    plain: "A subida média dos preços ao longo de um ano inteiro. É o valor usado para comparar anos.",
    families: "Serve de referência para aumentos salariais e para a atualização de pensões e rendas.",
    companies: "Entra nos contratos e nas negociações salariais.",
    state: "Afeta a atualização do IAS, dos escalões de IRS e das pensões.",
    whenUp: { good: "Reduz o peso real das dívidas.", bad: "Menos poder de compra." },
    whenDown: { good: "Rendimentos rendem mais.", bad: "Muito baixa ou negativa pode sinalizar fraca procura." },
  },
  gasoleo: {
    plain: "O preço médio de um litro de gasóleo nas bombas, com impostos. Uma parte importante do preço são impostos: o ISP e o IVA.",
    families: "Pesa em quem depende do carro, sobretudo fora das cidades.",
    companies: "Transportes, agricultura e pesca sentem logo a subida, e parte passa para os preços de outros produtos.",
    state: "Recebe ISP e IVA sobre cada litro; o Governo pode baixar o ISP para compensar subidas, perdendo receita.",
    whenUp: { good: "Incentiva poupança de combustível e transportes públicos.", bad: "Mais custos de transporte e subida de outros preços." },
    whenDown: { good: "Alívio no orçamento das famílias e empresas.", bad: "Se o ISP subir em compensação, a descida nas bombas é menor." },
  },
  "gasolina-95": {
    plain: "O preço médio de um litro de gasolina simples 95 nas bombas, com impostos.",
    families: "Pesa em quem usa carro a gasolina todos os dias.",
    companies: "Afeta sobretudo serviços com frotas ligeiras.",
    state: "Recebe ISP e IVA sobre cada litro.",
    whenUp: { good: "Incentiva alternativas ao carro.", bad: "Menos dinheiro disponível para outras despesas." },
    whenDown: { good: "Alívio no orçamento.", bad: "Menos incentivo a alternativas." },
  },
  "gpl-auto": {
    plain: "O preço médio de um litro de GPL para automóveis. É mais barato por litro, mas um carro gasta mais litros de GPL do que de gasolina.",
    families: "Importa para quem tem carro adaptado a GPL.",
    companies: "Usado por algumas frotas de táxis e serviços.",
    state: "Tem impostos mais baixos por litro do que a gasolina e o gasóleo.",
    whenUp: { good: "Sem efeito positivo direto.", bad: "Reduz a poupança de quem converteu o carro." },
    whenDown: { good: "Aumenta a poupança face à gasolina.", bad: "Sem efeito negativo direto." },
  },
  desemprego: {
    plain: "A percentagem de pessoas que querem trabalhar e procuram emprego, mas não o encontram.",
    families: "Desemprego baixo facilita encontrar trabalho e negociar salários.",
    companies: "Com desemprego baixo é mais difícil contratar e os salários sobem.",
    state: "Menos desemprego significa menos subsídios pagos e mais contribuições recebidas.",
    whenUp: { good: "Pode facilitar a contratação para as empresas.", bad: "Mais famílias sem rendimento do trabalho e mais despesa com subsídios." },
    whenDown: { good: "Mais pessoas com rendimento e mais receita pública.", bad: "Muito baixo pode dificultar contratações em alguns setores." },
  },
  "salario-minimo": {
    plain: "O valor mínimo que um trabalhador a tempo inteiro pode receber por mês, pago 14 vezes por ano.",
    families: "Cada subida chega diretamente a quem ganha o salário mínimo e empurra para cima os salários logo acima dele.",
    companies: "Sobem os custos com pessoal, sobretudo em setores de salários baixos, como comércio, restauração e agricultura.",
    state: "Recebe mais contribuições e IRS; outros valores, como alguns apoios, estão ligados a ele.",
    whenUp: { good: "Mais rendimento para quem ganha menos.", bad: "Pressão sobre pequenas empresas com margens baixas." },
  },
  "divida-publica": {
    plain: "Quanto o Estado deve, comparado com o que o país produz num ano. Com 90%, a dívida equivale a cerca de 11 meses de toda a produção do país.",
    families: "Uma dívida alta deixa menos margem para baixar impostos ou aumentar serviços, porque parte do Orçamento vai para juros.",
    companies: "Afeta a confiança dos investidores e os juros a que o país e os bancos se financiam.",
    state: "Quanto maior a dívida, mais se paga em juros e mais exposto fica o país a subidas das taxas de juro.",
    whenUp: { good: "Pode financiar investimento ou apoios numa crise.", bad: "Mais juros a pagar no futuro e menos margem orçamental." },
    whenDown: { good: "Menos juros e mais margem para crises futuras.", bad: "Se descer à custa de cortes, pode reduzir serviços ou investimento." },
  },
  "saldo-orcamental": {
    plain: "A diferença entre o que o Estado recebe e o que gasta num ano. Positivo é excedente; negativo é défice.",
    families: "Um excedente dá margem para baixar impostos no futuro; um défice grande pode levar a subidas de impostos ou cortes.",
    companies: "Um défice controlado transmite estabilidade aos investidores.",
    state: "Um excedente reduz a dívida; as regras europeias limitam o défice a 3% do PIB, em regra.",
    whenUp: { good: "A dívida desce e cresce a margem para crises.", bad: "Se vier de pouco investimento público, pode faltar investimento em serviços." },
    whenDown: { good: "Pode apoiar a economia numa crise.", bad: "Mais dívida e mais juros no futuro." },
  },
  "juros-divida": {
    plain: "O juro que os investidores pedem para emprestar dinheiro ao Estado português durante 10 anos.",
    families: "Influencia indiretamente os juros do crédito à habitação e dos depósitos.",
    companies: "Serve de base para o custo de financiamento dos bancos e das grandes empresas.",
    state: "Quanto mais alto, mais caro fica emitir nova dívida e mais se gasta em juros.",
    whenUp: { good: "Os depósitos e certificados tendem a render mais.", bad: "O Estado e as empresas pagam mais para se financiar." },
    whenDown: { good: "Financiamento mais barato para o Estado e empresas.", bad: "Poupanças rendem menos." },
  },
  "precos-habitacao": {
    plain: "Quanto subiram, num ano, os preços das casas vendidas. Com 10%, uma casa de 200 000 € passa a custar cerca de 220 000 €.",
    families: "Quem tem casa vê o seu valor subir; quem quer comprar ou arrendar precisa de mais dinheiro.",
    companies: "Construção e imobiliário ganham; empresas podem ter dificuldade em atrair trabalhadores para zonas caras.",
    state: "Recebe mais IMT e IMI, mas cresce a pressão para apoios à habitação.",
    whenUp: { good: "Valoriza o património de quem tem casa.", bad: "Mais difícil comprar e arrendar, sobretudo para jovens." },
    whenDown: { good: "Casas mais acessíveis para quem compra.", bad: "Quem comprou recentemente pode ficar com uma dívida maior do que o valor da casa." },
  },
  "juro-credito-habitacao": {
    plain: "O juro médio dos novos empréstimos para comprar casa. Em 200 000 € a 30 anos, cada ponto percentual a mais custa cerca de 100 € a 120 € por mês.",
    families: "Define a prestação de quem pede crédito e, nos contratos com taxa variável, de quem já tem crédito.",
    companies: "Afeta a procura de casas e, por isso, a construção e o imobiliário.",
    state: "Juros altos levam a apoios às famílias com crédito e reduzem receita de IMT.",
    whenUp: { good: "Pode travar a subida dos preços das casas.", bad: "Prestações mais altas e menos pessoas conseguem crédito." },
    whenDown: { good: "Prestações mais baixas.", bad: "Pode aumentar a procura e empurrar os preços das casas." },
  },
  populacao: {
    plain: "O número de pessoas que vivem em Portugal a 1 de janeiro de cada ano.",
    families: "Mais população ativa ajuda a pagar pensões; menos jovens significa escolas a fechar em algumas zonas.",
    companies: "Mais população significa mais trabalhadores e mais clientes.",
    state: "Afeta a sustentabilidade da Segurança Social e o planeamento de escolas, saúde e habitação.",
    whenUp: { good: "Mais trabalhadores e contribuições.", bad: "Mais procura de casas e serviços públicos a curto prazo." },
    whenDown: { good: "Menos pressão sobre a habitação.", bad: "Menos trabalhadores para sustentar pensões e serviços." },
  },
};

type Point = { period: string; value: number };

/** Automatic sentences that put the latest value in context. Neutral wording. */
export function contextSentences(def: Pick<IndicatorDef, "unit" | "digits" | "frequency">, snap: Pick<IndicatorSnapshot, "series">, format: (v: number) => string): string[] {
  const pt = snap.series.PT ?? [];
  const last = pt.at(-1);
  if (!last || pt.length < 3) return [];
  const out: string[] = [];

  const higherSince = [...pt].slice(0, -1).reverse().find((p) => p.value >= last.value);
  const lowerSince = [...pt].slice(0, -1).reverse().find((p) => p.value <= last.value);
  const first = pt[0];
  if (!higherSince) out.push(`É o valor mais alto desde ${periodLabel(first.period)}, o início dos dados apresentados.`);
  else if (!lowerSince) out.push(`É o valor mais baixo desde ${periodLabel(first.period)}, o início dos dados apresentados.`);
  else {
    const hYears = periodYear(last.period) - periodYear(higherSince.period);
    const lYears = periodYear(last.period) - periodYear(lowerSince.period);
    if (hYears >= 1) out.push(`É o valor mais alto desde ${periodLabel(higherSince.period)}.`);
    else if (lYears >= 1) out.push(`É o valor mais baixo desde ${periodLabel(lowerSince.period)}.`);
  }

  const window = pt.filter((p) => periodYear(p.period) > periodYear(last.period) - 10);
  if (window.length >= 4) {
    const avg = window.reduce((s, p) => s + p.value, 0) / window.length;
    const years = Math.round(periodYear(last.period) - periodYear(window[0].period));
    const diff = last.value - avg;
    const close = Math.abs(diff) <= Math.max(Math.abs(avg) * 0.03, 10 ** -def.digits);
    out.push(
      close
        ? `Está perto da média dos últimos ${years} anos (${format(avg)}).`
        : `Está ${diff > 0 ? "acima" : "abaixo"} da média dos últimos ${years} anos, que é ${format(avg)}.`,
    );
  }

  const eu = snap.series.EU27_2020 as Point[] | undefined;
  const euSame = eu?.find((p) => p.period === last.period) ?? eu?.at(-1);
  if (euSame) {
    const d = last.value - euSame.value;
    const close = Math.abs(d) <= Math.max(Math.abs(euSame.value) * 0.02, 10 ** -def.digits);
    out.push(close ? `Está perto da média da União Europeia (${format(euSame.value)}).` : `Está ${d > 0 ? "acima" : "abaixo"} da média da União Europeia, que é ${format(euSame.value)}${euSame.period !== last.period ? ` (${periodLabel(euSame.period)})` : ""}.`);
  }
  return out;
}

export const geoOrder: Geo[] = ["PT", "ES", "EU27_2020"];

/**
 * One everyday sentence for the latest value of the headline indicators, for readers who do not know the
 * indicator's name. Returns null for indicators without one.
 */
export function everydaySentence(slug: string, value: number, formatted: string): string | null {
  switch (slug) {
    case "inflacao":
      return value >= 0 ? `Os preços subiram ${formatted} num ano, em média.` : `Os preços desceram ${formatted.replace("-", "").replace("−", "")} num ano, em média.`;
    case "inflacao-anual":
      return `Os preços subiram ${formatted} em média nesse ano.`;
    case "gasoleo":
      return `Um litro de gasóleo custa, em média, ${formatted} nas bombas.`;
    case "gasolina-95":
      return `Um litro de gasolina 95 custa, em média, ${formatted} nas bombas.`;
    case "desemprego":
      return `Em cada 100 pessoas que querem trabalhar, cerca de ${Math.round(value)} não têm emprego.`;
    case "precos-habitacao":
      return value >= 0 ? `As casas vendidas custam ${formatted} mais do que há um ano.` : `As casas vendidas custam ${formatted.replace("-", "").replace("−", "")} menos do que há um ano.`;
    case "juro-credito-habitacao":
      return `Os novos créditos à habitação pagam, em média, ${formatted} de juro por ano.`;
    case "salario-minimo":
      return `O salário mínimo é ${formatted} por mês, pago 14 vezes por ano.`;
    default:
      return null;
  }
}
