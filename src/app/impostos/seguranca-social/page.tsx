import type { Metadata } from "next";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { availableTaxYears, getTaxYear } from "@/lib/tax/data";
import { taxSources } from "@/lib/tax/sources";
import { eur, pct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Segurança Social: taxas contributivas",
  description: "Quanto descontam os trabalhadores por conta de outrem, as empresas e os trabalhadores independentes.",
};

export default function SegurancaSocialPage() {
  const latest = getTaxYear(availableTaxYears()[0])!;
  const ss = latest.socialSecurity.value;
  const example = 1_500;
  const confirmed = latest.socialSecurity.verification === "primary";

  return (
    <>
      <PageHeader
        title="Segurança Social"
        lead="As contribuições pagam pensões, subsídio de doença, desemprego e parentalidade. Quem trabalha e quem emprega descontam uma parte do salário."
      />
      <Container className="grid gap-10 py-10 lg:grid-cols-2">
        <section className="grid content-start gap-4">
          <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Trabalho por conta de outrem</h2>
          {!confirmed && (
            <Notice tone="warn" title="Valores a confirmar">
              Estas taxas ainda não foram confirmadas numa fonte primária. Veja a nota nas fontes.
            </Notice>
          )}
          <dl className="grid grid-cols-2 gap-4">
            <div className="rounded-sm border border-line bg-surface p-5">
              <dt className="text-sm text-muted">Trabalhador</dt>
              <dd className="mt-1 text-3xl font-semibold tabular">{pct(ss.employeeRate, 0)}</dd>
            </div>
            <div className="rounded-sm border border-line bg-surface p-5">
              <dt className="text-sm text-muted">Entidade empregadora</dt>
              <dd className="mt-1 text-3xl font-semibold tabular">{pct(ss.employerRate, 2)}</dd>
            </div>
          </dl>
          <p className="leading-relaxed text-muted tabular">
            Num salário bruto de {eur(example)}, o trabalhador desconta {eur(example * ss.employeeRate, 2)} e a empresa paga mais{" "}
            {eur(example * ss.employerRate, 2)}. O custo total para a empresa é {eur(example * (1 + ss.employerRate), 2)} por mês.
          </p>
        </section>

        <section className="grid content-start gap-4">
          <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Trabalho independente</h2>
          <p className="leading-relaxed text-muted">
            A taxa é {pct(ss.selfEmployedRate, 1)} sobre o rendimento relevante. O rendimento relevante é {pct(ss.selfEmployedRelevantIncomeServices, 0)}{" "}
            do valor dos serviços prestados, ou {pct(ss.selfEmployedRelevantIncomeGoods, 0)} das vendas de bens, declarado todos os trimestres.
          </p>
          <div className="rounded-sm bg-sunken p-5 text-sm leading-relaxed tabular">
            <p className="font-medium">Exemplo: {eur(example)} por mês em serviços</p>
            <p className="mt-2 text-muted">
              Rendimento relevante: {eur(example * ss.selfEmployedRelevantIncomeServices, 2)}. Contribuição mensal:{" "}
              {eur(example * ss.selfEmployedRelevantIncomeServices * ss.selfEmployedRate, 2)}.
            </p>
          </div>
          <p className="leading-relaxed text-muted">
            No início de atividade, a obrigação de contribuir começa no 12.º mês. Não é uma isenção: é um adiamento do início.
          </p>
        </section>

        <div className="lg:col-span-2">
          <SourceList sources={taxSources(latest, ["socialSecurity"])} />
          {latest.socialSecurity.note && <p className="mt-3 max-w-[70ch] text-sm text-muted">{latest.socialSecurity.note}</p>}
        </div>
      </Container>
    </>
  );
}
