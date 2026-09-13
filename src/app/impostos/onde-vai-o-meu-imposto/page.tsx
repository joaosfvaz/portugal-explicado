import type { Metadata } from "next";
import { HelpBox } from "@/components/help-box";
import { TaxSplit } from "@/components/tax/tax-split";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { BUDGET_SOURCES, DEBT_INTEREST_2024, SPENDING_2024, SPENDING_TOTAL_2024, TAX_REVENUE_2026 } from "@/content/orcamento";
import { netSalary } from "@/lib/trabalho/salario";

export const metadata: Metadata = {
  title: "Para onde vai o meu imposto",
  description: "Em que gasta o Estado: pensões, saúde, educação, juros da dívida e outras áreas, com a divisão de 100 € e de quanto paga por ano.",
};

const mil = (n: number) => `${Math.round(n).toLocaleString("pt-PT")} milhões de euros`;

export default function OndeVaiPage() {
  // Default example: IRS and Social Security of a 1 200 € salary, 14 months.
  const example = netSalary({ gross: 1200, household: "nao-casado", dependents: 0, mealPerDay: 0, mealDays: 0, mealPaidBy: "dinheiro" });
  const defaultAmount = Math.round((example.irs + example.socialSecurity) * 14);
  const revenueTotal = TAX_REVENUE_2026.reduce((s, r) => s + r.amount, 0);

  return (
    <>
      <PageHeader
        title="Para onde vai o meu imposto"
        lead="O Estado, a Segurança Social, as regiões e as câmaras gastaram cerca de 123 mil milhões de euros em 2024. Veja em quê, e como se dividiria o que paga."
      />
      <Container className="grid gap-12 py-10">
        <section className="rounded-sm border-l-2 border-accent bg-accent-soft p-5 md:p-6">
          <h2 className="font-display text-2xl font-medium">De cada 100 € de despesa pública</h2>
          <p className="mt-3 max-w-[75ch] text-lg leading-relaxed">
            {SPENDING_2024.slice(0, 4)
              .map((s) => `${Math.round((s.amount / SPENDING_TOTAL_2024) * 100)} € vão para ${s.name.charAt(0).toLowerCase()}${s.name.slice(1)}`)
              .join(", ")}
            . Só os juros da dívida pública levam cerca de {Math.round((DEBT_INTEREST_2024 / SPENDING_TOTAL_2024) * 100)} €.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">Divida o que paga</h2>
          <div className="mt-5">
            <TaxSplit defaultAmount={defaultAmount} />
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">O que está em cada área</h2>
          <dl className="mt-5 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {SPENDING_2024.map((s) => (
              <div key={s.id} className="bg-surface p-5">
                <dt className="flex items-baseline justify-between gap-3">
                  <span className="font-display text-2xl font-medium">{s.name}</span>
                  <span className="text-sm text-muted whitespace-nowrap">{mil(s.amount)}</span>
                </dt>
                <dd className="mt-2 leading-relaxed text-muted">{s.examples}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">De onde vem o dinheiro dos impostos do Estado</h2>
          <p className="mt-1 max-w-[75ch] text-muted">Previsão para 2026 na proposta do Orçamento do Estado. Não inclui o IMI, que é das câmaras, nem os descontos para a Segurança Social, que têm orçamento próprio.</p>
          <ul className="mt-5 grid gap-px overflow-hidden border border-line bg-line">
            {TAX_REVENUE_2026.map((r) => (
              <li key={r.name} className="grid gap-1 bg-surface px-4 py-3 sm:grid-cols-[12rem_minmax(0,1fr)_auto] sm:items-center sm:gap-4">
                <span className="font-medium">{r.name}</span>
                <span className="h-2.5 bg-sunken">
                  <span className="block h-full bg-accent/70" style={{ width: `${(r.amount / revenueTotal) * 100}%` }} />
                </span>
                <span className="text-sm text-muted tabular">
                  {Math.round((r.amount / revenueTotal) * 100)}% · {mil(r.amount)}
                </span>
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-muted">O IVA é o imposto que mais dinheiro dá ao Estado. Todas as pessoas o pagam quando compram, mesmo quem não paga IRS.</p>
        </section>

        <Notice tone="neutral" title="Sobre estes números">
          A despesa é de 2024, o último ano completo publicado pelo Eurostat, e ainda é provisória. Inclui o Estado, a Segurança Social, as regiões autónomas e as câmaras, sem contar duas vezes o
          dinheiro que passa de uns para outros. Inclui os juros da dívida, mas não o pagamento da própria dívida. O Orçamento do Estado para 2026 só divide por funções a despesa da Administração Central,
          que inclui o reembolso da dívida, por isso não o usamos aqui.
        </Notice>

        <HelpBox topic="impostos" />
        <SourceList sources={BUDGET_SOURCES} />
      </Container>
    </>
  );
}
