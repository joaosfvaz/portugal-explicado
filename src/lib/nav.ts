export type NavItem = {
  href: string;
  label: string;
  /** Extra paths that mark this item as active. */
  match?: string[];
  /** Listed on the group's overview page and found by search, but not shown in the menu. */
  hidden?: boolean;
};

export type NavGroup = {
  id: string;
  label: string;
  icon: NavIcon;
  /** Overview page of the group. A group with no items is a single link. */
  href?: string;
  items: NavItem[];
};

export type NavIcon = "home" | "search" | "person" | "coins" | "briefcase" | "house" | "papers" | "shield" | "columns" | "book";

const FUEL = ["/economia/gasolina-95", "/economia/gpl-auto"];

/**
 * The menu, arranged by what people want to do. URLs do not follow this arrangement and must not change:
 * other sites and shared links point to them.
 */
export const NAV: NavGroup[] = [
  { id: "inicio", label: "Início", icon: "home", href: "/", items: [] },
  { id: "pesquisa", label: "Pesquisar", icon: "search", href: "/pesquisa", items: [] },
  { id: "para-mim", label: "O que é para mim", icon: "person", href: "/para-mim", items: [] },
  {
    id: "dinheiro",
    label: "Salário e impostos",
    icon: "coins",
    href: "/impostos",
    items: [
      { href: "/trabalho/salario-liquido", label: "Quanto recebo líquido" },
      { href: "/trabalho/recibo-de-vencimento", label: "Perceber o recibo" },
      { href: "/impostos/como-funciona-o-irs", label: "Como funciona o IRS" },
      { href: "/impostos/escaloes-irs", label: "Escalões do IRS", match: ["/impostos/calculadora-escaloes"] },
      { href: "/impostos/irs-jovem", label: "IRS Jovem (até 35 anos)" },
      { href: "/impostos/onde-vai-o-meu-imposto", label: "Para onde vai o imposto" },
      { href: "/impostos/tipos-de-rendimento", label: "IRS de cada rendimento", hidden: true },
      { href: "/impostos/calculadora-escaloes", label: "Calculadora do IRS por escalão", hidden: true },
      { href: "/impostos/seguranca-social", label: "Descontos para a Segurança Social", hidden: true },
    ],
  },
  {
    id: "trabalho",
    label: "Trabalho e reforma",
    icon: "briefcase",
    href: "/trabalho",
    items: [
      { href: "/trabalho/direitos", label: "Direitos no trabalho" },
      { href: "/vida/subsidio-de-desemprego", label: "Subsídio de desemprego" },
      { href: "/trabalho/reforma", label: "A reforma" },
    ],
  },
  {
    id: "casa",
    label: "Casa",
    icon: "house",
    href: "/casa",
    items: [
      { href: "/casa/arrendar", label: "Arrendar casa" },
      { href: "/casa/comprar", label: "Comprar casa" },
      { href: "/casa/construir", label: "Construir casa" },
      { href: "/casa/faturas", label: "Faturas da casa" },
    ],
  },
  {
    id: "papeis",
    label: "Papéis e serviços",
    icon: "papers",
    href: "/vida",
    items: [
      { href: "/vida/vou", label: "Passo a passo (vou…)" },
      { href: "/vida/prazos", label: "Datas a não esquecer" },
      { href: "/vida/nif", label: "Pedir o NIF" },
      { href: "/vida/cartao-de-cidadao", label: "Cartão de Cidadão" },
      { href: "/vida/abono-de-familia", label: "Abono de família" },
      { href: "/vida/carro", label: "Carro" },
      { href: "/vida/seguranca-social-e-sns", label: "Segurança Social e centro de saúde", hidden: true },
      { href: "/vida/autorizacao-de-residencia", label: "Autorização de residência", hidden: true },
      { href: "/vida/criar-empresa", label: "Abrir atividade ou empresa", hidden: true },
    ],
  },
  {
    id: "ajuda",
    label: "Ajuda e proteção",
    icon: "shield",
    items: [
      { href: "/vida/ajuda", label: "Onde pedir ajuda" },
      { href: "/vida/burlas", label: "Mensagens falsas e burlas" },
    ],
  },
  {
    id: "pais",
    label: "O país",
    icon: "columns",
    href: "/o-pais",
    items: [
      { href: "/estado/municipios", label: "O meu município" },
      { href: "/parlamento/iniciativas", label: "Leis em discussão" },
      { href: "/estado/eleicoes", label: "Eleições" },
      { href: "/economia", label: "Economia em números", match: FUEL },
      { href: "/estado", label: "Como funciona o Estado" },
      { href: "/parlamento", label: "Parlamento" },
      { href: "/parlamento/partidos", label: "Partidos e deputados", hidden: true },
      { href: "/parlamento/diario-republica", label: "Leis publicadas (Diário da República)", hidden: true },
      { href: "/estado/presidente", label: "Presidente da República", hidden: true },
      { href: "/estado/assembleia", label: "Assembleia da República", hidden: true },
      { href: "/estado/governo", label: "Governo", hidden: true },
      { href: "/estado/tribunais", label: "Tribunais", hidden: true },
      { href: "/estado/regioes-e-autarquias", label: "Regiões e autarquias", hidden: true },
    ],
  },
  {
    id: "mais",
    label: "Mais",
    icon: "book",
    items: [
      { href: "/glossario", label: "Palavras difíceis" },
      { href: "/o-que-mudou", label: "O que mudou" },
      { href: "/fontes", label: "Fontes e verificação" },
      { href: "/en", label: "English guides" },
    ],
  },
];

/** Groups with an overview page and items: the site's themes. */
export const THEMES = NAV.filter((g) => g.href && g.items.length > 0) as (NavGroup & { href: string })[];

/**
 * Where a path sits in the menu: its group, and the item that best matches (exact match, extra matches,
 * then the longest prefix). `item` is null on a group's overview page.
 */
export function activeItem(pathname: string): { group: NavGroup; item: NavItem | null } | null {
  let best: { group: NavGroup; item: NavItem | null; score: number } | null = null;
  const consider = (group: NavGroup, item: NavItem | null, href: string, match?: string[]) => {
    let score = -1;
    if (pathname === href) score = 10_000;
    else if (match?.some((m) => pathname === m || pathname.startsWith(`${m}/`))) score = 9_000;
    else if (href !== "/" && pathname.startsWith(`${href}/`)) score = href.length;
    // An item beats its group's overview page when both match equally.
    if (score > (best?.score ?? -1) || (score >= 0 && score === best?.score && item && !best.item)) best = { group, item, score };
  };
  for (const group of NAV) {
    if (group.href) consider(group, null, group.href);
    for (const item of group.items) consider(group, item, item.href, item.match);
  }
  const found = best as { group: NavGroup; item: NavItem | null; score: number } | null;
  return found && found.score >= 0 ? { group: found.group, item: found.item } : null;
}

/** Trail from the home page to a path, for the "Localização" line. Empty on the home page. */
export function breadcrumbs(pathname: string): { href?: string; label: string; current: boolean }[] {
  if (pathname === "/") return [];
  const found = activeItem(pathname);
  if (!found || found.group.id === "inicio") return [];
  const { group, item } = found;
  const trail: { href?: string; label: string; current: boolean }[] = [{ href: "/", label: "Início", current: false }];
  const onGroupPage = !item && pathname === group.href;
  if (group.items.length > 0 || !onGroupPage) trail.push({ href: group.href, label: group.label, current: onGroupPage });
  if (item) trail.push({ href: item.href, label: item.label, current: pathname === item.href });
  if (onGroupPage && group.items.length === 0) trail.push({ label: group.label, current: true });
  return trail;
}
