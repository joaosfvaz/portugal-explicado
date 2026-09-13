import type { Metadata } from "next";
import Link from "next/link";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { availableTaxYears, getTaxYear } from "@/lib/tax/data";
import { taxByBrackets } from "@/lib/tax/brackets";
import { taxSources } from "@/lib/tax/sources";
import { eur, num, pct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Escalões de IRS 2026 e 2025",
  description: "Tabela oficial dos escalões de IRS em Portugal continental, taxa marginal e taxa média, com exemplos.",
};

const EXAMPLE = 25_000;

export default function EscaloesPage() {
  const [latestYear, previousYear] = availableTaxYears();
  const latest = getTaxYear(latestYear)!;
  const previous = previousYear ? getTaxYear(previousYear) : null;
  const rows = latest.irsBrackets.value;
  const example = taxByBrackets(EXAMPLE, rows);
  const exampleSlices = example.slices.filter((s) => s.taxedAmount > 0);

  return (
    <>
      <PageHeader
        title={`Escalões de IRS ${latest.year}`}
        lead="O IRS é progressivo. Quem passa para um escalão mais alto só paga a taxa mais alta sobre a parte do rendimento que está nesse escalão."
      />

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
          <section>
            <h2 className="font-display text-2xl leading-tight font-medium">Tabela {latest.year}, Portugal continental</h2>
            <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
              <table className="w-full min-w-[520px] text-sm tabular">
                <thead className="bg-sunken text-left text-muted">
                  <tr>
                    <th className="px-4 py-3 font-medium">Rendimento coletável</th>
                    <th className="px-4 py-3 text-right font-medium">Taxa marginal</th>
                    <th className="px-4 py-3 text-right font-medium">Taxa média no limite</th>
                    {previous && <th className="px-4 py-3 text-right font-medium">vs {previous.year}</th>}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((b, i) => {
                    const from = i === 0 ? 0 : rows[i - 1].upTo!;
                    const prev = previous?.irsBrackets.value[i];
                    const diff = prev ? b.rate - prev.rate : 0;
                    return (
                      <tr key={i} className="border-t border-line">
                        <td className="px-4 py-3">
                          {b.upTo === null ? `Mais de ${eur(from)}` : i === 0 ? `Até ${eur(b.upTo)}` : `${eur(from)} a ${eur(b.upTo)}`}
                        </td>
                        <td className="px-4 py-3 text-right font-semibold">{pct(b.rate, 1)}</td>
                        <td className="px-4 py-3 text-right text-muted">{b.avgRateAtTop !== undefined ? pct(b.avgRateAtTop, 3) : "-"}</td>
                        {previous && (
                          <td className={`px-4 py-3 text-right ${diff < 0 ? "text-accent" : "text-muted"}`}>
                            {diff === 0 ? "igual" : `${diff > 0 ? "+" : ""}${num(diff * 100, 1)} p.p.`}
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            {previous && (
              <p className="mt-3 text-sm text-muted">
                Em {latest.year}, os limites dos escalões subiram face a {previous.year} e as taxas do 2.º ao 5.º escalão desceram 0,3 pontos percentuais.
              </p>
            )}
          </section>

          <section className="rounded-sm bg-sunken p-6">
            <h2 className="font-display text-2xl leading-tight font-medium">Exemplo com {eur(EXAMPLE)}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              O rendimento divide-se pelos escalões. Cada parte paga a sua taxa.
            </p>
            <ol className="mt-5 space-y-3 text-sm tabular">
              {exampleSlices.map((s) => (
                <li key={s.index} className="flex items-baseline justify-between gap-4">
                  <span>
                    {eur(s.taxedAmount, 0)} a {pct(s.rate, 1)}
                  </span>
                  <span className="font-medium">{eur(s.tax, 2)}</span>
                </li>
              ))}
            </ol>
            <div className="mt-5 flex items-baseline justify-between border-t border-line pt-4">
              <span className="font-semibold">Total</span>
              <span className="text-2xl font-semibold tabular">{eur(example.tax, 2)}</span>
            </div>
            <p className="mt-2 text-sm text-muted tabular">
              Taxa média {pct(example.averageRate, 2)}. Taxa marginal {pct(example.marginalRate, 1)}.
            </p>
            <Link href="/impostos/calculadora-escaloes" className="pressable mt-6 inline-flex rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-on-accent">
              Calcular outro valor
            </Link>
          </section>
        </div>

        <section className="mt-12 grid max-w-[70ch] gap-4 leading-relaxed">
          <h2 className="font-display text-2xl leading-tight font-medium">O que estes números não incluem</h2>
          <p className="text-muted">
            A tabela aplica-se ao rendimento coletável, depois da dedução específica. O imposto final também depende das deduções à coleta
            (despesas gerais, saúde, educação, habitação, dependentes), do mínimo de existência de {eur(latest.minimoExistencia.value)}, do
            adicional de solidariedade acima de {eur(80_000)} e da escolha entre tributação separada ou conjunta.
          </p>
          <Notice tone="neutral">Madeira e Açores têm taxas próprias, mais baixas. Esta página mostra apenas Portugal continental.</Notice>
        </section>

        <SourceList
          sources={[
            ...taxSources(latest, ["irsBrackets", "minimoExistencia", "solidaritySurcharge"]),
            ...(previous ? taxSources(previous, ["irsBrackets"]) : []),
          ]}
        />
      </Container>
    </>
  );
}
