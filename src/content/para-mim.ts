/**
 * "Para mim": simple questions about a person's situation, and the pages that matter for each answer.
 * Answers stay in the reader's browser only.
 */

export type Suggestion = { href: string; title: string; why: string };

export type Situation = { id: string; label: string; suggestions: Suggestion[] };

export type Question = { id: string; question: string; situations: Situation[] };

const IRS: Suggestion = { href: "/impostos/como-funciona-o-irs", title: "Como funciona o IRS", why: "Para perceber o que desconta e porque recebe ou paga na declaração." };
const PRAZOS: Suggestion = { href: "/vida/prazos", title: "Datas a não esquecer", why: "Os prazos do IRS, do IMI e de outros pagamentos, para não pagar multas." };

export const QUESTIONS: Question[] = [
  {
    id: "trabalho",
    question: "Qual é a sua situação de trabalho?",
    situations: [
      {
        id: "conta-outrem",
        label: "Trabalho com contrato",
        suggestions: [
          { href: "/trabalho/salario-liquido", title: "Salário líquido", why: "Quanto recebe na conta depois dos descontos." },
          { href: "/trabalho/recibo-de-vencimento", title: "Recibo de vencimento", why: "O que quer dizer cada linha do recibo." },
          { href: "/trabalho/direitos", title: "Os seus direitos no trabalho", why: "Férias, baixa, horas extra e despedimento." },
          IRS,
        ],
      },
      {
        id: "recibos-verdes",
        label: "Trabalho a recibos verdes",
        suggestions: [
          { href: "/impostos/tipos-de-rendimento#categoria-b", title: "IRS dos recibos verdes", why: "Quanto da faturação conta para o IRS e porque há reembolso." },
          { href: "/vida/criar-empresa", title: "Abrir atividade", why: "Os passos para começar a passar recibos." },
          PRAZOS,
        ],
      },
      {
        id: "desempregado",
        label: "Estou sem trabalho",
        suggestions: [
          { href: "/vida/vou/ficar-desempregado", title: "Fiquei sem trabalho: o que fazer", why: "Os passos por ordem, com os prazos." },
          { href: "/vida/subsidio-de-desemprego", title: "Subsídio de desemprego", why: "Quanto pode receber e durante quanto tempo." },
        ],
      },
      {
        id: "reformado",
        label: "Estou reformado ou quase",
        suggestions: [
          { href: "/trabalho/reforma", title: "A reforma explicada", why: "A idade da reforma e como a pensão é calculada." },
          { href: "/vida/vou/reformar-me", title: "Vou reformar-me: o que fazer", why: "Os passos e onde pedir a pensão." },
          { href: "/impostos/tipos-de-rendimento#categoria-h", title: "IRS das pensões", why: "Quando a pensão paga IRS." },
        ],
      },
      {
        id: "estudante",
        label: "Estudo",
        suggestions: [
          { href: "/impostos/irs-jovem", title: "IRS Jovem", why: "Quanto do primeiro salário fica sem IRS." },
          { href: "/vida/nif", title: "Pedir o NIF", why: "O número que vai precisar para trabalhar ou arrendar." },
        ],
      },
    ],
  },
  {
    id: "casa",
    question: "E a casa onde vive?",
    situations: [
      {
        id: "arrendo",
        label: "Pago renda",
        suggestions: [
          { href: "/casa/arrendar", title: "Arrendar casa", why: "Quanto a renda pode subir e quanto deduz no IRS." },
          { href: "/casa/faturas", title: "Perceber as faturas da casa", why: "O que paga na luz, na água e nas telecomunicações." },
        ],
      },
      {
        id: "proprietario",
        label: "A casa é minha",
        suggestions: [
          { href: "/casa/faturas", title: "Perceber as faturas da casa", why: "O que paga na luz, na água e nas telecomunicações." },
          PRAZOS,
        ],
      },
      {
        id: "comprar",
        label: "Quero comprar casa",
        suggestions: [
          { href: "/casa/comprar", title: "Custos de comprar casa", why: "Quanto dinheiro precisa no dia da compra e a prestação." },
          { href: "/economia/juro-credito-habitacao", title: "Juros do crédito à habitação", why: "Como estão os juros agora." },
        ],
      },
      {
        id: "mudar",
        label: "Vou mudar de casa",
        suggestions: [{ href: "/vida/vou/mudar-de-casa", title: "Vou mudar de casa: o que fazer", why: "Morada, contratos e o que mudar nas Finanças." }],
      },
    ],
  },
  {
    id: "familia",
    question: "E a sua família?",
    situations: [
      {
        id: "filhos",
        label: "Tenho filhos",
        suggestions: [
          { href: "/vida/abono-de-familia", title: "Abono de família", why: "Quanto pode receber por cada filho." },
          { href: "/impostos/como-funciona-o-irs", title: "Deduções por filhos no IRS", why: "Quanto os filhos baixam o IRS." },
        ],
      },
      {
        id: "bebe",
        label: "Vou ter um filho",
        suggestions: [
          { href: "/vida/vou/ter-um-filho", title: "Vou ter um filho: o que fazer", why: "Registo, licença parental e apoios, por ordem." },
          { href: "/trabalho/direitos#parentalidade", title: "Licença parental", why: "Quantos dias e quanto recebe." },
        ],
      },
    ],
  },
  {
    id: "outros",
    question: "Mais alguma destas?",
    situations: [
      { id: "poupancas", label: "Tenho poupanças", suggestions: [{ href: "/impostos/tipos-de-rendimento#produtos", title: "Impostos sobre poupanças", why: "Quanto pagam depósitos, certificados, PPR e ações." }] },
      { id: "carro", label: "Tenho carro", suggestions: [{ href: "/vida/carro", title: "Carro", why: "Impostos, inspeção e documentos." }, { href: "/economia/gasoleo", title: "Preço dos combustíveis", why: "Como o preço está a mudar." }] },
      { id: "estrangeiro", label: "Vim de outro país", suggestions: [{ href: "/vida/autorizacao-de-residencia", title: "Autorização de residência", why: "Os documentos para viver em Portugal." }, { href: "/en", title: "Guides in English", why: "Os guias principais em inglês." }] },
      { id: "mensagens", label: "Recebo mensagens estranhas", suggestions: [{ href: "/vida/burlas", title: "Mensagens falsas e burlas", why: "Como saber se uma mensagem é verdadeira e onde denunciar." }] },
      { id: "concelho", label: "Quero saber sobre o meu concelho", suggestions: [{ href: "/estado/municipios", title: "O meu município", why: "Quem governa a câmara e o que o Parlamento decidiu sobre o concelho." }] },
      { id: "impostos", label: "Quero saber onde vão os impostos", suggestions: [{ href: "/impostos/onde-vai-o-meu-imposto", title: "Onde vai o meu imposto", why: "Em que é gasto o dinheiro do Estado." }] },
    ],
  },
];

/** Pages for a set of chosen situations, without repeats, in question order. */
export function suggestionsFor(chosen: string[]): Suggestion[] {
  const seen = new Set<string>();
  const out: Suggestion[] = [];
  for (const q of QUESTIONS) {
    for (const s of q.situations) {
      if (!chosen.includes(s.id)) continue;
      for (const sug of s.suggestions) {
        if (seen.has(sug.href)) continue;
        seen.add(sug.href);
        out.push(sug);
      }
    }
  }
  return out;
}
