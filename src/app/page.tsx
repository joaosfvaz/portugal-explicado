import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Cercadura, SECTION_TILE, Tile, TilePanel } from "@/components/brand/tiles";
import { InitiativeRow } from "@/components/parlamento";
import { Sparkline } from "@/components/sparkline";
import { SearchForm } from "@/components/search-form";
import { Container } from "@/components/ui";
import { PAGES } from "@/content/paginas";
import { THEMES } from "@/lib/nav";
import { formatValue, indicatorViews, periodLabel } from "@/lib/economia/data";
import { pointAgo } from "@/lib/economia/stats";
import { everydaySentence } from "@/lib/economia/context";
import { titleTopics } from "@/lib/parlamento/topics";
import { DEADLINES } from "@/content/prazos";
import { eur, formatDate, num, pct } from "@/lib/format";
import { getInitiatives, getMeta } from "@/lib/parlamento/data";
import { availableTaxYears, getTaxYear } from "@/lib/tax/data";

/** The questions people come with, in their words, each going straight to the page that answers it. */
const TASKS = [
  { href: "/trabalho/salario-liquido", title: "Quanto vou receber de salário?" },
  { href: "/vida/burlas", title: "Recebi uma mensagem estranha" },
  { href: "/impostos/como-funciona-o-irs", title: "Tenho de entregar o IRS" },
  { href: "/casa/arrendar", title: "A minha renda vai subir?" },
  { href: "/vida/vou/mudar-de-casa", title: "Vou mudar de casa" },
  { href: "/vida/vou/ficar-desempregado", title: "Fiquei sem trabalho" },
  { href: "/vida/vou/ter-um-filho", title: "Vou ter um filho" },
  { href: "/casa/faturas", title: "Não percebo a fatura da luz" },
  { href: "/vida/ajuda", title: "Preciso de falar com alguém" },
];

export default function Home() {
  const tax = getTaxYear(availableTaxYears()[0])!;
  const meta = getMeta();
  const laws = getInitiatives().filter((i) => i.type === "Projeto de Lei" || i.type === "Proposta de Lei");
  const recentDecisions = laws
    .filter((i) => i.statusDate && ["aprovada", "publicada", "rejeitada", "vetada"].includes(i.status))
    .filter((i) => titleTopics(i.title).length > 0)
    .sort((a, b) => (b.statusDate ?? "").localeCompare(a.statusDate ?? ""))
    .slice(0, 5);
  const today = new Date().toISOString().slice(0, 10);
  const nextDeadlines = DEADLINES.filter((d) => !d.info && d.audience.includes("todos") && d.end >= today)
    .sort((a, b) => a.end.localeCompare(b.end))
    .slice(0, 3);
  const views = new Map(indicatorViews().map((v) => [v.def.slug, v]));
  const widgets = ["inflacao", "gasoleo", "desemprego", "precos-habitacao"].map((s) => views.get(s)).filter((v) => v !== undefined);

  return (
    <>
      <section className="border-b border-line bg-surface">
        <Container className="py-10 lg:py-14">
          <div className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,380px)]">
            <div className="self-center">
              <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Leis, contas e instituições, com fonte</p>
              <h1 className="mt-3 max-w-[20ch] font-display text-4xl leading-[1.05] font-medium tracking-[-0.02em] text-balance md:text-5xl">Do que precisa hoje?</h1>
              <p className="mt-4 max-w-[52ch] text-lg leading-relaxed text-muted">Escolha uma pergunta ou escreva o que procura. Explicamos em linguagem simples, com fontes oficiais.</p>
              <SearchForm id="home-q" size="lg" className="mt-6 max-w-2xl" />
              <ul className="mt-6 grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {TASKS.map((t) => (
                  <li key={t.href}>
                    <Link href={t.href} className="pressable group flex h-full items-center justify-between gap-3 rounded-sm border border-line bg-background px-4 py-3 font-medium hover:border-accent">
                      <span className="group-hover:text-accent">{t.title}</span>
                      <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mt-5 text-muted">
                Não sabe por onde começar?{" "}
                <Link href="/para-mim" className="font-medium text-accent underline underline-offset-4">
                  Responda a 4 perguntas
                </Link>
              </p>
            </div>
            <div className="hidden min-h-[320px] border border-line text-accent lg:block">
              <TilePanel id="home-hero" name="rosacea" size={76} />
            </div>
          </div>

        </Container>
        <div className="border-t border-line text-accent">
          <Cercadura id="home-band" height={14} />
        </div>
      </section>

      <Container className="grid gap-14 py-12">
        {nextDeadlines.length > 0 && (
          <section>
            <div className="flex flex-wrap items-baseline justify-between gap-3">
              <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Próximas datas para todos</h2>
              <Link href="/vida/prazos" className="inline-flex items-center gap-2 font-medium text-accent">
                Todas as datas <ArrowRight weight="bold" />
              </Link>
            </div>
            <ul className="mt-5 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
              {nextDeadlines.map((d) => (
                <li key={d.id} className="bg-surface p-5">
                  <p className="text-sm font-semibold text-accent tabular">{d.start && d.start > today ? `De ${formatDate(d.start)} a ${formatDate(d.end)}` : `Até ${formatDate(d.end)}`}</p>
                  <p className="mt-1 font-semibold">{d.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">{d.action}</p>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Todos os temas</h2>
          <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((g) => (
              <Link key={g.id} href={g.href} className="pressable group relative flex flex-col bg-surface p-5 pb-6 hover:bg-sunken/60">
                <span className="absolute top-0 right-0 h-12 w-12 border-b border-l border-line text-accent" aria-hidden>
                  <Tile name={SECTION_TILE[g.id] ?? "rosacea"} className="h-full w-full" />
                </span>
                <p className="pr-14 font-display text-2xl font-medium group-hover:text-accent">{g.label}</p>
                <p className="mt-1 leading-relaxed text-muted">{PAGES.find((p) => p.href === g.href)?.summary}</p>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-3">
            <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">O país em números</h2>
            <Link href="/economia" className="inline-flex items-center gap-2 font-medium text-accent">
              Todos os números <ArrowRight weight="bold" />
            </Link>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {widgets.map((v) => {
              const ago = pointAgo(v.snap.series.PT ?? [], 1);
              return (
                <Link key={v.def.slug} href={`/economia/${v.def.slug}`} className="pressable group rounded-sm border border-line bg-background p-4 hover:border-accent">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">{v.def.title}</p>
                    <ArrowRight className="h-4 w-4 text-muted group-hover:text-accent" aria-hidden />
                  </div>
                  <p className="figures mt-2 font-display text-3xl leading-none font-medium">{formatValue(v.def, v.latest.value)}</p>
                  <p className="mt-2 text-sm leading-snug">{everydaySentence(v.def.slug, v.latest.value, formatValue(v.def, v.latest.value))}</p>
                  <p className="mt-1 text-xs text-muted tabular">
                    {periodLabel(v.latest.period)}
                    {ago && <> · há um ano: {formatValue(v.def, ago.value)}</>}
                  </p>
                  <div className="mt-3 text-accent">
                    <Sparkline points={(v.snap.series.PT ?? []).slice(-26)} />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-12">
          <Link href="/impostos/irs-jovem" className="pressable rounded-sm bg-accent p-6 text-on-accent lg:col-span-5">
            <p className="text-sm opacity-85">IRS {tax.year}</p>
            <p className="mt-1 font-display text-3xl font-medium">IRS Jovem</p>
            <p className="mt-2 leading-relaxed opacity-90">
              Até {tax.irsJovem.value.maxAge} anos, isenção de 100% a 25% nos primeiros 10 anos de rendimentos, até {eur(tax.irsJovem.value.cap)} por ano.
            </p>
          </Link>
          <Link href="/impostos/escaloes-irs" className="pressable rounded-sm border border-line bg-surface p-6 hover:border-accent lg:col-span-7">
            <p className="text-sm text-muted">Escalões de IRS {tax.year}</p>
            <p className="figures mt-1 font-display text-3xl font-medium">
              De {pct(tax.irsBrackets.value[0].rate, 1)} a {pct(tax.irsBrackets.value.at(-1)!.rate, 0)}, em {tax.irsBrackets.value.length} escalões
            </p>
            <p className="mt-2 leading-relaxed text-muted">Veja a diferença entre taxa marginal e taxa média, e quanto paga em cada escalão.</p>
          </Link>
        </section>

        {meta && (
          <section className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
            <div>
              <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Leis do dia a dia</h2>
              <p className="mt-2 max-w-[42ch] text-muted">
                As últimas decisões do Parlamento sobre impostos, casa, trabalho, pensões, saúde, educação, família e transportes. Escolhemos pelo tema do título oficial.
              </p>
              <p className="mt-2 max-w-[42ch] text-sm text-muted">
                Ao todo, {num(laws.filter((i) => i.status === "em-curso").length)} projetos e propostas de lei estão em curso na {meta.legislature} Legislatura.
              </p>
              <p className="mt-2 text-sm text-muted">Dados importados em {formatDate(meta.importedAt)}.</p>
              <Link href="/parlamento/iniciativas?grupo=leis" className="mt-6 inline-flex items-center gap-2 font-medium text-accent">
                Todas as iniciativas <ArrowRight weight="bold" />
              </Link>
            </div>
            <ul className="divide-y divide-line overflow-hidden rounded-sm border border-line bg-surface">
              {recentDecisions.map((i) => (
                <InitiativeRow key={i.id} i={i} />
              ))}
            </ul>
          </section>
        )}
      </Container>
    </>
  );
}
