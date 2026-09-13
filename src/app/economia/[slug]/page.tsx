import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDownRight, ArrowRight, ArrowSquareOut, ArrowUpRight, Buildings, Info, UsersThree, Bank } from "@phosphor-icons/react/dist/ssr";
import { IndicatorChart } from "@/components/economia/indicator-chart";
import { Sparkline } from "@/components/sparkline";
import { Container, Notice, HeaderFrame } from "@/components/ui";
import { formatChange, formatValue, indicatorViews, periodLabel } from "@/lib/economia/data";
import { GEO_LABEL, INDICATORS, type Geo } from "@/lib/economia/indicators";
import { CONTEXT, contextSentences } from "@/lib/economia/context";
import { extremes, pointAgo } from "@/lib/economia/stats";
import { formatDate } from "@/lib/format";
import { Glossed } from "@/components/glossary/glossed";

export function generateStaticParams() {
  return INDICATORS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/economia/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const def = INDICATORS.find((i) => i.slug === slug);
  return def ? { title: `${def.title} em Portugal`, description: def.definition } : {};
}

const GEOS: Geo[] = ["PT", "ES", "EU27_2020"];

const FREQUENCY_TEXT = {
  semanal: "Todas as semanas, com os preços de segunda-feira.",
  mensal: "Todos os meses. O último valor refere-se normalmente a um ou dois meses antes.",
  trimestral: "Todos os trimestres, cerca de dois meses depois do fim do trimestre.",
  anual: "Uma vez por ano.",
} as const;

const DEFAULT_RANGE = { semanal: "1a", mensal: "3a", trimestral: "5a", anual: "tudo" } as const;

export default async function IndicatorPage({ params }: PageProps<"/economia/[slug]">) {
  const { slug } = await params;
  const views = indicatorViews();
  const view = views.find((v) => v.def.slug === slug);
  if (!view) notFound();
  const { def, snap, latest, previous } = view;

  const pt = snap.series.PT ?? [];
  const geos = GEOS.filter((g) => snap.series[g]?.length);
  const yearAgo = pointAgo(pt, 1);
  const fiveAgo = pointAgo(pt, 5);
  const window = def.frequency === "anual" ? null : 1;
  const range = extremes(pt, window);
  const siblings = views.filter((v) => v.def.group === def.group);
  const ctx = CONTEXT[def.slug];
  const sentences = contextSentences(def, snap, (v) => formatValue(def, v));
  const unitNote = def.unit === "%" ? "A variação de uma taxa aparece em pontos percentuais (p.p.): de 3% para 4% é +1 p.p." : null;

  return (
    <>
      <HeaderFrame className="py-7">
          {siblings.length > 1 && (
            <div className="mb-5 flex flex-wrap gap-2" role="list" aria-label="Indicadores relacionados">
              {siblings.map((s) => (
                <Link
                  key={s.def.slug}
                  role="listitem"
                  href={`/economia/${s.def.slug}`}
                  aria-current={s.def.slug === def.slug ? "page" : undefined}
                  className="pressable rounded-sm border border-line px-3 py-1 text-sm text-muted hover:border-accent hover:text-foreground aria-[current=page]:border-foreground aria-[current=page]:bg-foreground aria-[current=page]:text-background"
                >
                  {capitalize(s.def.title.replace(/^Preço d[oa] /, ""))}
                </Link>
              ))}
            </div>
          )}
          <h1 className="font-display text-4xl font-medium tracking-[-0.015em]">{def.title}</h1>
          <p className="mt-2 max-w-[75ch] text-lg leading-relaxed"><Glossed>{ctx?.plain ?? def.definition}</Glossed></p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            <a href="#sobre" className="pressable inline-flex items-center gap-1.5 rounded-sm bg-sunken px-3 py-1.5 hover:text-accent">
              <Info className="h-4 w-4" aria-hidden /> Como ler
            </a>
            <a href={def.sourceUrl} target="_blank" rel="noopener noreferrer" className="pressable inline-flex items-center gap-1.5 rounded-sm bg-sunken px-3 py-1.5 hover:text-accent">
              <ArrowSquareOut className="h-4 w-4" aria-hidden /> Fonte oficial
            </a>
            <Link href="/economia" className="pressable inline-flex items-center gap-1.5 rounded-sm bg-sunken px-3 py-1.5 hover:text-accent">
              Todos os indicadores <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
      </HeaderFrame>

      <Container className="grid gap-6 py-8">
        {sentences.length > 0 && (
          <section className="rounded-sm bg-accent-soft p-5" aria-label="Em resumo">
            <h2 className="font-semibold text-accent-strong">Em resumo</h2>
            <ul className="mt-2 grid gap-1.5 leading-relaxed">
              <li>
                Portugal está em <strong className="tabular">{formatValue(def, latest.value)}</strong> ({periodLabel(latest.period)}).
              </li>
              {sentences.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </section>
        )}
        <div className="grid gap-4 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="grid content-start gap-4">
            <Card>
              <p className="text-sm font-medium text-muted">Portugal</p>
              <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{formatValue(def, latest.value)}</p>
              <p className="mt-1 text-sm text-muted">{periodLabel(latest.period)}</p>
              {previous && <Change text={formatChange(def, latest.value, previous.value)} diff={latest.value - previous.value} suffix="face ao período anterior" />}
              {snap.latestDaily && (
                <p className="mt-4 border-t border-line pt-3 text-sm leading-relaxed text-muted">
                  Média diária mais recente: <span className="font-semibold text-foreground tabular">{formatValue(def, snap.latestDaily.value)}</span>, a{" "}
                  {formatDate(snap.latestDaily.date)}, em {snap.latestDaily.stations.toLocaleString("pt-PT")} postos. Fonte: {snap.latestDaily.source}.
                </p>
              )}
            </Card>

            <Card title="Valores anteriores">
              <dl className="grid gap-2.5 text-sm">
                {previous && <Row label={`Período anterior (${periodLabel(previous.period)})`} value={formatValue(def, previous.value)} />}
                {yearAgo && <Row label={`Há 1 ano (${periodLabel(yearAgo.period)})`} value={formatValue(def, yearAgo.value)} />}
                {fiveAgo && <Row label={`Há 5 anos (${periodLabel(fiveAgo.period)})`} value={formatValue(def, fiveAgo.value)} />}
              </dl>
            </Card>

            {range && (
              <Card title={window ? "Últimos 12 meses" : `Desde ${periodLabel(range.from)}`}>
                <dl className="grid gap-2.5 text-sm">
                  <Row label={`Máximo (${periodLabel(range.high.period)})`} value={formatValue(def, range.high.value)} />
                  <Row label={`Mínimo (${periodLabel(range.low.period)})`} value={formatValue(def, range.low.value)} />
                </dl>
              </Card>
            )}
          </div>

          <Card>
            <IndicatorChart
              title={`Evolução ${geos.length > 1 ? "e comparação" : ""}`.trim()}
              format={{ unit: def.unit, digits: def.digits }}
              frequency={def.frequency}
              defaultRange={DEFAULT_RANGE[def.frequency]}
              fileName={def.slug}
              series={geos.map((g) => ({ key: g, label: GEO_LABEL[g], points: snap.series[g]! }))}
            />
            {def.note && (
              <div className="mt-4">
                <Notice tone="neutral">{def.note}</Notice>
              </div>
            )}
          </Card>
        </div>

        {ctx && (
          <section>
            <h2 className="font-display text-2xl leading-tight font-medium">O que significa</h2>
            <div className="mt-4 grid gap-4 md:grid-cols-3">
              <Impact icon={<UsersThree className="h-5 w-5" aria-hidden />} title="Para as famílias" text={ctx.families} />
              <Impact icon={<Buildings className="h-5 w-5" aria-hidden />} title="Para as empresas" text={ctx.companies} />
              <Impact icon={<Bank className="h-5 w-5" aria-hidden />} title="Para o Estado" text={ctx.state} />
            </div>
            <div className={`mt-4 grid gap-4 ${ctx.whenDown ? "md:grid-cols-2" : ""}`}>
              <UpDown title="Quando sobe" good={ctx.whenUp.good} bad={ctx.whenUp.bad} />
              {ctx.whenDown && <UpDown title="Quando desce" good={ctx.whenDown.good} bad={ctx.whenDown.bad} />}
            </div>
            <p className="mt-3 text-xs text-muted">Efeitos habituais, explicados de forma geral. O impacto real depende de outros fatores.</p>
          </section>
        )}

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_340px]">
          <Card title={geos.length > 1 ? "Portugal, Espanha e União Europeia" : "Últimos valores"}>
            {geos.length > 1 ? (
              <div className="-mx-5 overflow-x-auto">
                <table className="w-full min-w-[560px] text-sm tabular">
                  <thead>
                    <tr className="border-b border-line text-left text-xs text-muted">
                      <th className="px-5 py-2 font-medium">Região</th>
                      <th className="px-3 py-2 text-right font-medium">Último valor</th>
                      <th className="px-3 py-2 font-medium">Período</th>
                      <th className="px-3 py-2 text-right font-medium">Face a há 1 ano</th>
                      <th className="px-5 py-2 font-medium">
                        <span className="sr-only">Tendência</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {geos.map((g) => {
                      const pts = snap.series[g]!;
                      const last = pts.at(-1)!;
                      const ago = pointAgo(pts, 1);
                      return (
                        <tr key={g} className="border-b border-line last:border-0">
                          <td className="px-5 py-3 font-medium">{GEO_LABEL[g]}</td>
                          <td className="px-3 py-3 text-right font-semibold">{formatValue(def, last.value)}</td>
                          <td className="px-3 py-3 text-muted">{periodLabel(last.period)}</td>
                          <td className="px-3 py-3 text-right">{ago ? formatChange(def, last.value, ago.value) : "-"}</td>
                          <td className="w-32 px-5 py-3 text-accent">
                            <Sparkline points={pts.slice(-26)} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <table className="w-full text-sm tabular">
                <tbody>
                  {[...pt].reverse().slice(0, 10).map((p) => (
                    <tr key={p.period} className="border-b border-line last:border-0">
                      <td className="py-2 text-muted">{periodLabel(p.period)}</td>
                      <td className="py-2 text-right font-medium">{formatValue(def, p.value)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </Card>

          {geos.length > 1 && <CompareBars def={def} rows={geos.map((g) => ({ label: GEO_LABEL[g], value: snap.series[g]!.at(-1)!.value, pt: g === "PT" }))} />}
        </div>

        <section id="sobre" className="scroll-mt-20">
          <h2 className="font-display text-2xl leading-tight font-medium">Sobre este indicador</h2>
          <div className="mt-3 divide-y divide-line rounded-sm border border-line bg-surface">
            <Faq q="O que mede?">{def.definition}</Faq>
            <Faq q="Com que frequência é atualizado?">
              {FREQUENCY_TEXT[def.frequency]} Importámos os dados a {formatDate(snap.importedAt)}.
              {snap.sourceUpdatedAt && <> A fonte tem valores até {formatDate(snap.sourceUpdatedAt)}.</>}
            </Faq>
            <Faq q="De onde vêm os dados?">
              {def.sourceName}.{" "}
              <a href={def.sourceUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
                Abrir a fonte
              </a>
              {snap.latestDaily && <> A média diária vem da {snap.latestDaily.source}, um serviço público sem documentação da API. Usamos esse valor só como referência mais recente.</>}
            </Faq>
            {unitNote && <Faq q="Como ler a variação?">{unitNote}</Faq>}
            {def.note && <Faq q="Há alguma conversão?">{def.note}</Faq>}
          </div>
        </section>
      </Container>
    </>
  );
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

function Card({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-line bg-surface p-5">
      {title && <h2 className="mb-3 font-semibold">{title}</h2>}
      {children}
    </section>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="font-semibold whitespace-nowrap tabular">{value}</dd>
    </div>
  );
}

/** Direction arrow in a neutral colour: a rise is not good or bad by itself. */
function Change({ text, diff, suffix }: { text: string; diff: number; suffix: string }) {
  const Icon = diff > 0 ? ArrowUpRight : diff < 0 ? ArrowDownRight : null;
  return (
    <p className="mt-3 flex items-center gap-1 text-sm tabular">
      {Icon && <Icon weight="bold" className="h-4 w-4" aria-hidden />}
      <span className="font-semibold">{text}</span>
      <span className="text-muted">{suffix}</span>
    </p>
  );
}

function CompareBars({ def, rows }: { def: Parameters<typeof formatValue>[0]; rows: { label: string; value: number; pt: boolean }[] }) {
  const max = Math.max(...rows.map((r) => Math.abs(r.value)));
  return (
    <Card title="Último valor lado a lado">
      <ul className="grid gap-4">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex items-baseline justify-between text-sm">
              <span className={r.pt ? "font-semibold" : "text-muted"}>{r.label}</span>
              <span className="font-semibold tabular">{formatValue(def, r.value)}</span>
            </div>
            <div className="mt-1.5 h-2.5 rounded-sm bg-sunken">
              <div className={`h-full rounded-sm ${r.pt ? "bg-accent" : "bg-muted/40"}`} style={{ width: `${max ? (Math.abs(r.value) / max) * 100 : 0}%` }} />
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">Os períodos podem ser diferentes entre regiões. Veja a tabela.</p>
    </Card>
  );
}

function Impact({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-sm border border-line bg-surface p-5">
      <p className="flex items-center gap-2 font-semibold">
        <span className="text-accent">{icon}</span>
        {title}
      </p>
      <p className="mt-2 leading-relaxed text-muted">{text}</p>
    </div>
  );
}

function UpDown({ title, good, bad }: { title: string; good: string; bad: string }) {
  return (
    <div className="rounded-sm bg-sunken p-5">
      <p className="font-semibold">{title}</p>
      <dl className="mt-3 grid gap-3 sm:grid-cols-2">
        <div>
          <dt className="text-sm font-medium text-accent-strong">Lado positivo</dt>
          <dd className="mt-1 leading-relaxed"><Glossed>{good}</Glossed></dd>
        </div>
        <div>
          <dt className="text-sm font-medium text-danger">Lado negativo</dt>
          <dd className="mt-1 leading-relaxed"><Glossed>{bad}</Glossed></dd>
        </div>
      </dl>
    </div>
  );
}

function Faq({ q, children }: { q: string; children: React.ReactNode }) {
  return (
    <details className="group px-5">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-medium">
        {q}
        <span aria-hidden className="text-muted transition-transform duration-200 group-open:rotate-45">
          +
        </span>
      </summary>
      <p className="max-w-[75ch] pb-4 leading-relaxed text-muted">{children}</p>
    </details>
  );
}
