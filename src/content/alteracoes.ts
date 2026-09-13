/**
 * Changes in rules that affect many people, and new pages on this site. Kept by hand, newest first.
 * Every rule change links to the official text.
 */

export type ChangeEntry = { date: string; kind: "regra" | "site"; title: string; text: string; href: string };

export const CHANGES: ChangeEntry[] = [
  {
    date: "2026-09-13",
    kind: "site",
    title: "Novas páginas para o dia a dia",
    text: "Salário líquido, recibo de vencimento, direitos no trabalho, reforma, datas a não esquecer, passo a passo para momentos da vida, faturas da casa, burlas, onde vai o seu imposto, o seu município e um glossário.",
    href: "/para-mim",
  },
  {
    date: "2026-09-13",
    kind: "site",
    title: "Eleições e guias do IRS",
    text: "Os resultados mais recentes de cada eleição, como funciona o IRS e como é tributado cada tipo de rendimento.",
    href: "/estado/eleicoes",
  },
  {
    date: "2026-08-04",
    kind: "regra",
    title: "IUC: novas datas de pagamento a partir de 2027",
    text: "As Finanças passam a juntar o IUC de todos os veículos de cada pessoa. Em 2027 paga-se em outubro, ou em julho e outubro acima de 500 €. A partir de 2028, em abril, com prestações em julho e outubro para valores altos.",
    href: "https://files.diariodarepublica.pt/1s/2026/08/14900/0001000015.pdf",
  },
  {
    date: "2026-08-01",
    kind: "regra",
    title: "Crédito à habitação: novos limites do Banco de Portugal",
    text: "Desde 1 de agosto de 2026, a prestação de todos os créditos não deve passar 45% do rendimento líquido, e o prazo máximo depende da idade.",
    href: "/casa/comprar",
  },
  {
    date: "2026-05-20",
    kind: "regra",
    title: "Rendas: IRS de 10% e dedução de 900 € para inquilinos",
    text: "O Decreto-Lei n.º 97/2026 baixa o IRS das rendas de habitação até 2 300 € por mês para 10% e sobe a dedução das rendas pagas pelos inquilinos para 900 € em 2026.",
    href: "/casa/arrendar",
  },
  {
    date: "2026-01-01",
    kind: "regra",
    title: "Salário mínimo de 920 € e novos escalões de IRS",
    text: "O salário mínimo passou para 920 € por mês. Os escalões de IRS foram atualizados e as taxas do 2.º ao 5.º escalão desceram.",
    href: "/impostos/escaloes-irs",
  },
];
