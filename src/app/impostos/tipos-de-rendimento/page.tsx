import type { Metadata } from "next";
import Link from "next/link";
import { RuleTable, Section } from "@/components/casa/content";
import { WorkedExample } from "@/components/tax/worked-example";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { CATEGORIES, IRS_SOURCES, PRODUCTS, type IncomeCategory } from "@/content/irs";
import { eur, num } from "@/lib/format";
import { taxByBrackets } from "@/lib/tax/brackets";
import { getTaxYear } from "@/lib/tax/data";
import { Glossed } from "@/components/glossary/glossed";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "IRS por tipo de rendimento",
  description: "Como o IRS trata o salário, os recibos verdes, os juros e dividendos, as rendas, as mais-valias, as pensões e produtos como PPR, ETF e criptoativos em 2026.",
};

const round2 = (n: number) => Math.round(n * 100) / 100;

function CategorySection({ c }: { c: IncomeCategory }) {
  return (
    <section id={`categoria-${c.code.toLowerCase()}`} className="scroll-mt-28 border-t border-line pt-10">
      <div className="flex items-start gap-4">
        <span className="grid h-14 w-14 shrink-0 place-items-center border border-accent/40 bg-accent-soft font-display text-3xl font-medium text-accent-strong" aria-hidden>
          {c.code}
        </span>
        <div>
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Categoria {c.code}</p>
          <h2 className="font-display text-3xl leading-tight font-medium">{c.name}</h2>
          <p className="mt-1 max-w-[65ch] text-lg leading-relaxed text-muted">{c.plain}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
        <div>
          <p className="text-sm text-muted">
            <span className="font-medium text-foreground">Exemplos: </span>
            {c.examples.join(" · ")}
          </p>
          <h3 className="mt-5 font-semibold">Como é tributado</h3>
          <ul className="mt-2 grid gap-2 leading-relaxed">
            {c.howTaxed.map((h) => (
              <li key={h} className="border-l-2 border-line pl-3">
                <Glossed>{h}</Glossed>
              </li>
            ))}
          </ul>
        </div>
        <div className="grid content-start gap-4">
          <dl className="divide-y divide-line rounded-sm border border-line bg-surface text-sm">
            {c.rates.map((r) => (
              <div key={r.label} className="flex items-baseline justify-between gap-4 px-4 py-2.5">
                <dt className="text-muted">
                  {r.label} <span className="text-xs">({r.article})</span>
                </dt>
                <dd className="text-right font-semibold">{r.value}</dd>
              </div>
            ))}
          </dl>
          <div className="rounded-sm bg-sunken p-4 text-sm leading-relaxed">
            <p className="font-semibold">Retenção durante o ano</p>
            <p className="mt-1 text-muted"><Glossed>{c.withholding}</Glossed></p>
          </div>
        </div>
      </div>

      <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
        <div className="bg-surface p-4">
          <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">Para as pessoas</p>
          <p className="mt-1.5 text-sm leading-relaxed">{c.people}</p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">Para o Estado</p>
          <p className="mt-1.5 text-sm leading-relaxed">{c.state}</p>
        </div>
        <div className="bg-surface p-4">
          <p className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">O que mudou em 2026</p>
          <ul className="mt-1.5 grid gap-1 text-sm leading-relaxed">
            {c.changes2026.map((x) => (
              <li key={x}>{x}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export default function TiposDeRendimentoPage() {
  const year = getTaxYear(2026)!;
  const brackets = year.irsBrackets.value;

  // Recibos verdes: 30 000 € of services on the art. 151.º list, simplified regime, 23% withheld.
  const rv = { billed: 30_000, taxable: 22_500 };
  const rvColeta = taxByBrackets(rv.taxable, brackets).tax;
  const rvFinal = round2(rvColeta - 250);
  const rvWithheld = round2(rv.billed * 0.23);

  // Savings interest of 500 €, for the employee of the example on "Como funciona o IRS".
  const employeeTaxable = round2(20_000 - year.deducaoEspecificaCatA.value);
  const extra = round2(taxByBrackets(employeeTaxable + 500, brackets).tax - taxByBrackets(employeeTaxable, brackets).tax);

  return (
    <>
      <PageHeader
        title="IRS por tipo de rendimento"
        lead="O IRS não trata todo o dinheiro da mesma forma. O salário, os recibos verdes, as rendas, os juros e as vendas de ações ou de casas têm regras e taxas diferentes."
      >
        <nav aria-label="Categorias" className="mt-6 flex flex-wrap gap-2 text-sm">
          {CATEGORIES.map((c) => (
            <a key={c.code} href={`#categoria-${c.code.toLowerCase()}`} className="pressable rounded-sm border border-line bg-surface px-3 py-1.5 hover:border-accent">
              <span className="font-display font-medium text-accent">{c.code}</span> {c.name}
            </a>
          ))}
          <a href="#produtos" className="pressable rounded-sm border border-line bg-surface px-3 py-1.5 hover:border-accent">
            Poupança e investimento
          </a>
        </nav>
      </PageHeader>

      <Container className="grid gap-12 py-10">
        <Notice tone="neutral" title="Duas formas de pagar">
          O salário, os recibos verdes e as pensões juntam-se e pagam a taxa dos escalões, de 12,5% a 48%. Juros, dividendos, rendas e ganhos com ações pagam em regra uma taxa fixa, mas pode
          escolher juntá-los aos outros rendimentos. Veja o passo a passo em <Link href="/impostos/como-funciona-o-irs" className="font-medium underline underline-offset-4">Como funciona o IRS</Link>.
        </Notice>

        <div className="grid gap-12">
          {CATEGORIES.map((c) => (
            <CategorySection key={c.code} c={c} />
          ))}
        </div>

        <Section id="produtos" title="Poupança e investimento: quanto paga cada produto" lead="Resumo para quem vive em Portugal. As condições completas estão nas categorias acima.">
          <RuleTable
            text
            head={["Produto", "Imposto", "Quando se paga", "Ter em conta"]}
            rows={PRODUCTS.map((p) => [
              <span key="n">
                <span className="font-medium">{p.name}</span>
                <span className="block text-xs text-muted">Categoria {p.category}</span>
              </span>,
              <span key="t" className="font-medium text-foreground">
                {p.tax}
              </span>,
              p.when,
              p.note,
            ])}
          />
        </Section>

        <Section title="Dois exemplos" lead="Contas feitas com os escalões de 2026 do continente.">
          <div className="grid gap-6 lg:grid-cols-2">
            <WorkedExample
              title="Recibos verdes: 30 000 € num ano"
              assumptions={[
                "Profissão da tabela oficial, no regime simplificado, fora dos dois primeiros anos de atividade.",
                "Os clientes são empresas e retiveram 23%.",
                "Solteiro, sem outros rendimentos, com faturas para a dedução de despesas gerais.",
              ]}
              rows={[
                { label: "Faturação do ano", value: eur(rv.billed, 2) },
                { label: "Conta 75% (coeficiente)", value: eur(rv.taxable, 2), strong: true },
                { label: "Imposto pelos escalões", value: eur(rvColeta, 2) },
                { label: "Dedução de despesas gerais", value: `− ${eur(250, 2)}` },
                { label: "IRS final do ano", value: eur(rvFinal, 2), strong: true },
                { label: "Retido pelos clientes: 23%", value: eur(rvWithheld, 2) },
                { label: "Reembolso", value: eur(round2(rvWithheld - rvFinal), 2), strong: true },
              ]}
              result={
                <>
                  O IRS final é cerca de {num((rvFinal / rv.billed) * 100, 1)}% da faturação, mas os clientes retiveram 23%. Por isso recebe um reembolso grande. Não incluímos a dedução das
                  contribuições para a Segurança Social acima de 10% da faturação (art. 31.º, n.º 2), que baixa ainda mais o imposto.
                </>
              }
            />
            <WorkedExample
              title="500 € de juros de uma conta-poupança"
              assumptions={["Banco português.", "A mesma pessoa do exemplo do salário de 20 000 €, no 3.º escalão."]}
              rows={[
                { label: "Juros brutos", value: eur(500, 2) },
                { label: "Retenção de 28% pelo banco", value: `− ${eur(140, 2)}` },
                { label: "Recebe na conta", value: eur(360, 2), strong: true },
                { label: "Se englobar: imposto extra pelos escalões", value: eur(extra, 2) },
                { label: "Se englobar: diferença face aos 140 €", value: `${eur(round2(140 - extra), 2)} a menos`, strong: true },
              ]}
              result={
                <>
                  Sem fazer nada, paga 140 € e não precisa de declarar. Como está num escalão de 21,2%, englobar poupa cerca de {eur(round2(140 - extra), 0)}, mas obriga a englobar todos os juros e
                  dividendos do ano.
                </>
              }
            />
          </div>
        </Section>

        <HelpBox topic="impostos" />

        <SourceList sources={IRS_SOURCES} />
      </Container>
    </>
  );
}
