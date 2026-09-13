import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Sparkline } from "@/components/sparkline";
import { Container, EmptyState, Notice, PageHeader, SourceList } from "@/components/ui";
import { formatChange, formatValue, getEconomia, indicatorViews, periodLabel, type IndicatorView } from "@/lib/economia/data";
import { GROUP_LABEL, type IndicatorDef } from "@/lib/economia/indicators";
import { CONTEXT, contextSentences, everydaySentence } from "@/lib/economia/context";
import { pointAgo } from "@/lib/economia/stats";
import { formatDate } from "@/lib/format";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Economia",
  description: "PIB, inflação, combustíveis, desemprego, dívida pública, salários e habitação em Portugal, com histórico e comparação com Espanha e a UE.",
};

function Widget({ v }: { v: IndicatorView }) {
  const ago = pointAgo(v.snap.series.PT ?? [], 1);
  return (
    <Link href={`/economia/${v.def.slug}`} className="pressable group flex flex-col justify-between rounded-sm border border-line bg-surface p-5 hover:border-accent">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted">{v.def.title}</p>
        <ArrowRight className="h-4 w-4 text-muted transition-colors group-hover:text-accent" aria-hidden />
      </div>
      <p className="mt-2 figures font-display text-4xl leading-none font-medium tracking-[-0.01em]">{formatValue(v.def, v.latest.value)}</p>
      {everydaySentence(v.def.slug, v.latest.value, formatValue(v.def, v.latest.value)) && (
        <p className="mt-2 leading-snug">{everydaySentence(v.def.slug, v.latest.value, formatValue(v.def, v.latest.value))}</p>
      )}
      <p className="mt-1 text-sm text-muted tabular">
        {periodLabel(v.latest.period)}
        {ago && <> · há um ano: {formatValue(v.def, ago.value)}</>}
      </p>
      <div className="mt-4 text-accent">
        <Sparkline points={(v.snap.series.PT ?? []).slice(-30)} />
      </div>
      <p className="mt-3 text-sm leading-snug text-muted">{contextSentences(v.def, v.snap, (x) => formatValue(v.def, x))[0] ?? CONTEXT[v.def.slug]?.plain}</p>
    </Link>
  );
}

export default function EconomiaPage() {
  const snap = getEconomia();
  const views = indicatorViews();

  if (!snap || views.length === 0) {
    return (
      <>
        <PageHeader title="Economia" />
        <Container className="py-10">
          <EmptyState title="Ainda não há dados importados">
            Corra <code className="font-mono">npm run import:economia</code>.
          </EmptyState>
        </Container>
      </>
    );
  }

  const bySlug = new Map(views.map((v) => [v.def.slug, v]));
  const headline = ["inflacao", "gasoleo", "desemprego", "juro-credito-habitacao"].map((s) => bySlug.get(s)).filter((v) => v !== undefined);
  const groups = Object.keys(GROUP_LABEL) as IndicatorDef["group"][];
  const sources = [...new Map(views.map((v) => [v.def.sourceName, { title: v.def.sourceName, url: v.def.sourceUrl }])).values()];

  return (
    <>
      <PageHeader tile="diamante" title="Painel da economia" lead="Os principais números do país. Clique num indicador para ver o gráfico, o histórico e a comparação com Espanha e a União Europeia.">
        <p className="mt-4 text-sm text-muted">Dados importados em {formatDate(snap.importedAt)}. Cada valor mostra o período a que se refere.</p>
      </PageHeader>

      <Container className="grid gap-8 py-8">
        {snap.failed.length > 0 && (
          <Notice tone="warn" title="Alguns indicadores não foram atualizados">
            A última importação falhou para: {snap.failed.map((f) => f.slug).join(", ")}. Mostramos os valores anteriores.
          </Notice>
        )}

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label="Indicadores em destaque">
          {headline.map((v) => (
            <Widget key={v.def.slug} v={v} />
          ))}
        </section>

        <section className="rounded-sm border border-line bg-surface">
          <h2 className="px-5 pt-5 text-lg font-semibold tracking-tight">Todos os indicadores</h2>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[720px] text-sm tabular">
              <thead>
                <tr className="border-y border-line text-left text-xs text-muted">
                  <th className="px-5 py-2 font-medium">Indicador</th>
                  <th className="px-3 py-2 text-right font-medium">Portugal</th>
                  <th className="px-3 py-2 font-medium">Período</th>
                  <th className="px-3 py-2 text-right font-medium">Face a há 1 ano</th>
                  <th className="px-3 py-2 text-right font-medium">União Europeia</th>
                  <th className="px-5 py-2 font-medium">
                    <span className="sr-only">Tendência</span>
                  </th>
                </tr>
              </thead>
              {groups.map((g) => {
                const items = views.filter((v) => v.def.group === g);
                if (!items.length) return null;
                return (
                  <tbody key={g}>
                    <tr>
                      <th colSpan={6} scope="colgroup" className="bg-sunken px-5 py-1.5 text-left text-xs font-semibold tracking-wide text-muted uppercase">
                        {GROUP_LABEL[g]}
                      </th>
                    </tr>
                    {items.map((v) => {
                      const pt = v.snap.series.PT ?? [];
                      const ago = pointAgo(pt, 1);
                      const eu = v.snap.series.EU27_2020?.at(-1);
                      return (
                        <tr key={v.def.slug} className="group relative border-b border-line transition-colors last:border-0 hover:bg-sunken/60">
                          <td className="px-5 py-3">
                            <Link href={`/economia/${v.def.slug}`} className="font-medium after:absolute after:inset-0 group-hover:text-accent">
                              {v.def.title}
                            </Link>
                            {CONTEXT[v.def.slug] && <span className="mt-0.5 block max-w-[46ch] text-xs leading-snug text-muted">{CONTEXT[v.def.slug].plain.split(". ")[0].replace(/\.$/, "")}.</span>}
                          </td>
                          <td className="px-3 py-3 text-right font-semibold">{formatValue(v.def, v.latest.value)}</td>
                          <td className="px-3 py-3 text-muted">{periodLabel(v.latest.period)}</td>
                          <td className="px-3 py-3 text-right">{ago ? formatChange(v.def, v.latest.value, ago.value) : "-"}</td>
                          <td className="px-3 py-3 text-right text-muted">{eu ? formatValue(v.def, eu.value) : "-"}</td>
                          <td className="w-32 px-5 py-3 text-accent">
                            <Sparkline points={pt.slice(-30)} />
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                );
              })}
            </table>
          </div>
        </section>

        <SourceList sources={sources} />
      </Container>
    </>
  );
}
