import type { Metadata } from "next";
import { ArrowRight, Info } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";
import { NAV } from "@/lib/nav";
import { Cercadura, Lockup, Mark, SECTION_TILE, Tile, TilePanel, TILES, type TileName } from "@/components/brand/tiles";
import { Sparkline } from "@/components/sparkline";
import { formatChange, formatValue, indicatorViews, periodLabel } from "@/lib/economia/data";
import { pointAgo } from "@/lib/economia/stats";

export const metadata: Metadata = {
  title: "Guia da marca",
  description: "Identidade visual do Portugal Explicado: ideia, logótipo, cor, tipografia, azulejos e aplicações.",
  robots: { index: false },
};

const SECTION_LABEL: Record<string, string> = Object.fromEntries(NAV.filter((g) => g.items.length > 0).map((g) => [g.id, g.label]));

/* ---------- page furniture ---------- */

function Part({ n, title, lead, children }: { n: string; title: string; lead?: ReactNode; children: ReactNode }) {
  return (
    <section className="border-t border-line py-14 first:border-0">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,15rem)_minmax(0,1fr)]">
        <header>
          <p className="figures text-xs font-medium tracking-[0.16em] text-muted uppercase">{n}</p>
          <h2 className="mt-2 font-display text-3xl font-medium tracking-[-0.01em]">{title}</h2>
          {lead && <p className="mt-3 text-[15px] leading-relaxed text-muted">{lead}</p>}
        </header>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}

function Label({ children }: { children: ReactNode }) {
  return <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">{children}</p>;
}

function Rule({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="border-t border-line pt-3">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-[15px] leading-relaxed text-muted">{children}</p>
    </div>
  );
}

type View = ReturnType<typeof indicatorViews>[number];

/* ---------- samples: proposed design ---------- */

function NewHeader({ id, tile, kicker, title, lead }: { id: string; tile: TileName; kicker: string; title: string; lead: string }) {
  return (
    <div className="overflow-hidden rounded-sm border border-line bg-surface">
      <div className="grid sm:grid-cols-[minmax(0,1fr)_11rem]">
        <div className="p-6 sm:p-8">
          <Label>{kicker}</Label>
          <h3 className="mt-2 font-display text-4xl leading-[1.05] font-medium tracking-[-0.015em] text-balance">{title}</h3>
          <p className="mt-3 max-w-[52ch] text-[17px] leading-relaxed text-muted">{lead}</p>
        </div>
        <div className="hidden border-l border-line text-accent sm:block">
          <TilePanel id={id} name={tile} size={56} />
        </div>
      </div>
      <div className="text-accent">
        <Cercadura id={`${id}-c`} height={14} />
      </div>
    </div>
  );
}

function NewCard({ v }: { v: View }) {
  const ago = pointAgo(v.snap.series.PT ?? [], 1);
  return (
    <div className="group relative rounded-sm border border-line bg-surface p-5">
      <span className="absolute top-0 right-0 h-6 w-6 overflow-hidden border-b border-l border-line text-accent" aria-hidden>
        <Tile name="diamante" className="h-full w-full" />
      </span>
      <Label>{v.def.title}</Label>
      <p className="figures mt-3 font-display text-[2.6rem] leading-none font-medium tracking-[-0.01em]">{formatValue(v.def, v.latest.value)}</p>
      <p className="mt-2 text-sm text-muted tabular">
        {periodLabel(v.latest.period)}
        {ago && <> · {formatChange(v.def, v.latest.value, ago.value)} num ano</>}
      </p>
      <div className="mt-4 border-t border-line pt-3 text-accent">
        <Sparkline points={(v.snap.series.PT ?? []).slice(-30)} />
      </div>
      <p className="mt-2 flex items-center gap-1.5 text-sm font-medium text-accent">
        Ver o indicador <ArrowRight className="h-3.5 w-3.5" aria-hidden />
      </p>
    </div>
  );
}

function Buttons() {
  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="pressable inline-flex items-center gap-2 rounded-sm bg-accent px-5 py-2.5 font-medium text-on-accent">
        Calcular o IRS <ArrowRight weight="bold" className="h-4 w-4" />
      </span>
      <span className="pressable inline-flex items-center rounded-sm border border-foreground/25 px-5 py-2.5 font-medium">Ver as fontes</span>
      <span className="inline-flex items-center gap-1.5 font-medium text-accent underline decoration-accent/30 underline-offset-4">Ler a lei</span>
    </div>
  );
}

function NewNotice() {
  return (
    <div className="flex gap-3 border-l-2 border-warn bg-warn-soft px-4 py-3 text-[15px] leading-relaxed">
      <Info className="mt-0.5 h-5 w-5 shrink-0 text-warn" weight="bold" aria-hidden />
      <div>
        <p className="font-semibold">Regras novas a partir de 1 de outubro</p>
        <p className="text-foreground/85">O licenciamento de obras muda com o DL 108/2026. Os passos abaixo são os que valem até lá.</p>
      </div>
    </div>
  );
}

/* ---------- page ---------- */

const PALETTE = [
  { token: "--foreground", name: "Tinta", light: "#16213d", dark: "#e6e9f0", use: "Texto e títulos. Um azul-negro, nunca preto puro.", ratio: "15.5 : 1" },
  { token: "--accent", name: "Cobalto", light: "#1b3d8f", dark: "#94b1f5", use: "A única cor de destaque: ligações, botões, azulejos, gráficos.", ratio: "9.7 : 1" },
  { token: "--accent-soft", name: "Lavado", light: "#e4e9f4", dark: "#1b2748", use: "Fundo de avisos neutros e seleção. O cobalto diluído do azulejo.", ratio: "" },
  { token: "--background", name: "Cal", light: "#f3f4f1", dark: "#0c1222", use: "Fundo da página. Branco de cal, frio, sem tom creme.", ratio: "" },
  { token: "--surface", name: "Faiança", light: "#fcfcfb", dark: "#131a2e", use: "Cartões, tabelas e painéis.", ratio: "" },
  { token: "--muted", name: "Pedra", light: "#4a5470", dark: "#aab3c7", use: "Texto secundário, datas, legendas.", ratio: "7.3 : 1" },
];

export default function MarcaPage() {
  const views = indicatorViews();
  const inflacao = views.find((v) => v.def.slug === "inflacao");
  const gasoleo = views.find((v) => v.def.slug === "gasoleo");

  return (
    <div>
      {/* Cover */}
      <div className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 text-accent opacity-[0.9]">
          <TilePanel id="capa" name="rosacea" size={88} />
        </div>
        <div className="relative mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="max-w-xl border border-line bg-surface p-6 sm:p-10">
            <Label>Guia da marca</Label>
            <div className="mt-6">
              <Lockup size="lg" />
            </div>
            <p className="mt-6 font-display text-2xl leading-snug">Um azulejo é uma peça simples. Juntas, as peças formam o painel inteiro.</p>
            <p className="mt-4 text-[15px] leading-relaxed text-muted">
              Esta página reúne as regras da identidade: ideia, logótipo, cor, tipografia, azulejos e forma.
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <Part n="01" title="A ideia" lead="O que a marca representa e porque tem este aspeto.">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-4 text-[17px] leading-relaxed">
              <p>
                O país é complexo. Leis, impostos e números chegam aos pedaços. O Portugal Explicado pega em cada peça e mostra onde encaixa: o que é, de onde vem, o que muda
                para quem.
              </p>
              <p>
                O azulejo diz o mesmo sem palavras. Cada peça é pequena e legível. Repetida, forma um painel com sentido. É também uma forma de arte pública, feita para ser
                vista por todos, em estações, igrejas e fachadas.
              </p>
            </div>
            <div className="grid content-start gap-4">
              <Rule title="Sóbria, não fria">Tom de obra de referência. Serve pessoas de todas as idades e formações. Sem piadas nem mascotes.</Rule>
              <Rule title="Portuguesa, não turística">Azulejo, cal e calçada como estrutura. Nada de postais, caricaturas ou símbolos de souvenir.</Rule>
              <Rule title="Neutra">Uma só cor de destaque. Nunca cores de partidos. Nunca vermelho e verde para dizer bom ou mau.</Rule>
              <Rule title="Com fonte">A marca ganha confiança pelas fontes e datas visíveis, não pela decoração.</Rule>
            </div>
          </div>
        </Part>

        <Part n="02" title="Logótipo" lead="Um azulejo reduzido ao essencial: quatro pétalas e quatro cantos.">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="grid place-items-center border border-line bg-surface px-4 py-10 sm:p-10 md:col-span-2">
              <Lockup size="lg" tagline="Leis, contas e instituições, com fonte" />
            </div>
            <div className="grid place-items-center border border-line bg-surface p-10">
              <div className="relative">
                <Mark className="h-32 w-32" />
                <svg viewBox="0 0 40 40" className="pointer-events-none absolute inset-0 h-32 w-32 text-danger" aria-hidden>
                  <g fill="none" stroke="currentColor" strokeWidth="0.25" strokeDasharray="0.8 0.8">
                    <path d="M20 0V40M0 20H40M0 0 40 40M40 0 0 40" />
                    <circle cx="20" cy="20" r="15" />
                    <circle cx="0" cy="0" r="6" />
                  </g>
                </svg>
              </div>
              <p className="mt-4 text-center text-sm text-muted">Construção sobre a grelha de 40</p>
            </div>
            <div className="flex flex-col items-center justify-center gap-4 border border-line bg-surface p-8">
              <div className="flex items-end gap-5">
                {["h-16 w-16", "h-10 w-10", "h-6 w-6", "h-4 w-4"].map((c) => (
                  <Mark key={c} className={c} />
                ))}
              </div>
              <p className="text-sm text-muted">Tamanho mínimo: 16 px</p>
            </div>
            <div className="grid place-items-center bg-accent p-8 text-on-accent [--mark-ground:var(--on-accent)] [--mark-ink:var(--accent)]">
              <Lockup size="md" />
            </div>
            <div className="marca-noite grid place-items-center p-8">
              <Lockup size="md" />
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Rule title="Porque funciona">Lê-se aos 16 px, no separador do browser, e aos 160 px, num cartaz. Não depende de cor.</Rule>
            <Rule title="O nome">Garamond, com Explicado em itálico: a mesma letra, a voz de quem explica.</Rule>
            <Rule title="Não fazer">Não rodar, não arredondar os cantos, não pôr sombras, não trocar as pétalas por outro desenho.</Rule>
          </div>
        </Part>

        <Part n="03" title="Cor" lead="Azul de cobalto sobre branco de cal, como no azulejo tradicional. Uma cor de destaque, nada mais.">
          <div className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {PALETTE.map((c) => (
              <div key={c.token} className="bg-surface">
                <div className="grid h-24 grid-cols-2">
                  <div style={{ background: c.light }} />
                  <div style={{ background: c.dark }} />
                </div>
                <div className="p-4">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="font-display text-xl font-medium">{c.name}</p>
                    {c.ratio && <p className="figures text-xs text-muted">contraste {c.ratio}</p>}
                  </div>
                  <p className="mt-0.5 font-mono text-xs text-muted">
                    {c.token} · {c.light} / {c.dark}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{c.use}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Rule title="Estados">Aviso em ocre e erro em vermelho-tijolo. Só para estados, nunca para decorar nem para dizer se um número é bom.</Rule>
            <Rule title="Votos">A favor em cobalto, contra em vermelho-tijolo, abstenção em pedra. Mantém-se a regra atual: sem cores de partidos.</Rule>
            <Rule title="Retirado">Os tons quentes de sol, creme, massa e caramelo saíram. Só existiam para as ilustrações.</Rule>
          </div>
        </Part>

        <Part n="04" title="Tipografia" lead="Garamond para títulos e números em destaque. Geist para ler, preencher e comparar.">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-line bg-surface p-6">
              <Label>Títulos · EB Garamond 500</Label>
              <p className="mt-4 font-display text-5xl leading-[1.05] font-medium tracking-[-0.015em]">Quem decide o quê em Portugal</p>
              <p className="figures mt-6 font-display text-6xl font-medium">2,104 €/l</p>
              <p className="mt-4 font-display text-xl text-muted italic">Algarismos alinhados e de largura fixa, para os valores ficarem em coluna.</p>
            </div>
            <div className="border border-line bg-surface p-6">
              <Label>Texto · Geist 400 e 500</Label>
              <p className="mt-4 text-[17px] leading-[1.65]">
                A inflação mede quanto sobem os preços de um ano para o outro. Com 3,6%, um cabaz que custava 100 € custa agora cerca de 103,60 €.
              </p>
              <p className="mt-4 text-[15px] leading-relaxed text-muted">O texto corrido usa 17 px, maior do que o habitual, para quem lê pior. As linhas não passam de 65 caracteres.</p>
              <div className="mt-6 divide-y divide-line border-y border-line text-sm">
                {[
                  ["Título de página", "Garamond 44 / 1.05"],
                  ["Título de secção", "Garamond 30 / 1.15"],
                  ["Subtítulo", "Geist 18 · 600"],
                  ["Texto", "Geist 17 / 1.65"],
                  ["Etiqueta", "Geist 11 · maiúsculas · 0.14em"],
                  ["Tabelas", "Geist 14 · algarismos tabulares"],
                ].map(([a, b]) => (
                  <div key={a} className="flex justify-between gap-4 py-2">
                    <span>{a}</span>
                    <span className="text-muted">{b}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Part>

        <Part n="05" title="Azulejos" lead="Seis padrões desenhados sobre a mesma grelha. Cada secção do site tem o seu.">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(Object.keys(TILES) as TileName[]).map((name) => {
              const sections = Object.entries(SECTION_TILE)
                .filter(([, t]) => t === name)
                .map(([s]) => SECTION_LABEL[s])
                .filter(Boolean);
              return (
                <div key={name} className="border border-line bg-surface">
                  <div className="h-40 border-b border-line text-accent">
                    <TilePanel id={`t-${name}`} name={name} size={64} />
                  </div>
                  <div className="flex items-baseline justify-between gap-3 p-4">
                    <p className="font-display text-xl font-medium">{TILES[name].name}</p>
                    <p className="text-right text-sm text-muted">{sections.join(", ")}</p>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 border border-line bg-surface p-5 text-accent">
            <Label>Cercadura · separa as grandes partes de uma página</Label>
            <div className="mt-4">
              <Cercadura id="cercadura-demo" height={20} />
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <Rule title="Estrutura">O azulejo aparece a cor inteira, em painéis com margem definida: cabeçalho, capa, canto de cartão, rodapé.</Rule>
            <Rule title="Nunca atrás de texto">O texto fica sempre sobre faiança lisa. O padrão fica ao lado ou à volta.</Rule>
            <Rule title="Só decoração">Os azulejos são escondidos dos leitores de ecrã. Os ícones funcionais continuam a ser Phosphor.</Rule>
          </div>
        </Part>

        <Part n="06" title="Forma" lead="O azulejo é quadrado. A interface segue essa geometria.">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border border-line bg-surface p-5">
              <div className="h-16 rounded-sm border border-foreground/30" />
              <p className="mt-3 font-medium">Cantos de 2 px</p>
              <p className="mt-1 text-sm text-muted">Cartões, botões e campos. Substituem os antigos cantos de 16 px.</p>
            </div>
            <div className="border border-line bg-surface p-5">
              <div className="h-16 border-y border-line">
                <div className="mt-[18px] h-px bg-foreground/30" />
              </div>
              <p className="mt-3 font-medium">Filetes em vez de sombras</p>
              <p className="mt-1 text-sm text-muted">Linhas de 1 px separam o conteúdo. Sem sombras, sem vidro, sem gradientes.</p>
            </div>
            <div className="border border-line bg-surface p-5">
              <div className="grid h-16 grid-cols-4 gap-px bg-line">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="bg-surface" />
                ))}
              </div>
              <p className="mt-3 font-medium">Grelha visível</p>
              <p className="mt-1 text-sm text-muted">Tabelas e grupos de cartões juntam-se com juntas de 1 px, como um painel de azulejos.</p>
            </div>
          </div>
        </Part>

        <Part n="07" title="Aplicações" lead="Os componentes do site com dados reais, em claro e escuro.">
          <div className="grid gap-10">
            <NewHeader
              id="h-economia"
              tile="diamante"
              kicker="Economia"
              title="Painel da economia"
              lead="Os principais números do país, com o histórico e a comparação com Espanha e a União Europeia."
            />

            {inflacao && gasoleo && (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <NewCard v={inflacao} />
                <NewCard v={gasoleo} />
              </div>
            )}

            <div className="grid gap-4 lg:grid-cols-2">
              <div className="marca-dia border border-line p-6">
                <Label>Claro</Label>
                <div className="mt-4 grid gap-5">
                  <Buttons />
                  <NewNotice />
                  <NewHeader id="h-vida-dia" tile="onda" kicker="Vida e burocracia" title="Pedir o NIF" lead="O número que usa para trabalhar, arrendar casa e abrir conta." />
                </div>
              </div>
              <div className="marca-noite border border-line p-6">
                <Label>Escuro</Label>
                <div className="mt-4 grid gap-5">
                  <Buttons />
                  <NewNotice />
                  <NewHeader id="h-vida-noite" tile="onda" kicker="Vida e burocracia" title="Pedir o NIF" lead="O número que usa para trabalhar, arrendar casa e abrir conta." />
                </div>
              </div>
            </div>
          </div>
        </Part>

        <Part n="08" title="O que saiu" lead="Peças da versão anterior que já não se usam.">
          <div className="grid gap-4 sm:grid-cols-2">
            <Rule title="Ilustrações figurativas">Elétrico, pastel de nata, castelo, santuário, praia, São Bento e casas. Foram substituídos pelo azulejo de cada secção.</Rule>
            <Rule title="Padrão a 10% de opacidade">O azulejo deixou de ser uma marca de água. É agora um painel com cor inteira e margens definidas.</Rule>
            <Rule title="Cantos muito redondos">Os cantos de 16 px davam um ar de aplicação de consumo. Passaram a 2 px.</Rule>
            <Rule title="Títulos em Geist">Os títulos passaram a Garamond. O texto, os formulários e as tabelas continuam em Geist.</Rule>
          </div>
        </Part>
      </div>

      <div className="text-accent">
        <Cercadura id="fim" height={20} />
      </div>
    </div>
  );
}
