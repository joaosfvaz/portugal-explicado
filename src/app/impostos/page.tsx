import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { GroupLinks } from "@/components/group-links";
import { Container, PageHeader } from "@/components/ui";
import { availableTaxYears, getTaxYear } from "@/lib/tax/data";
import { eur, pct } from "@/lib/format";

export const metadata: Metadata = {
  title: "Salário e impostos",
  description: "Quanto recebe líquido, o recibo de vencimento, o que é o IRS, como funciona, como é tributado cada tipo de rendimento, escalões, IRS Jovem e Segurança Social, com exemplos e calculadoras.",
};

export default function ImpostosPage() {
  const latest = getTaxYear(availableTaxYears()[0])!;
  const brackets = latest.irsBrackets.value;
  const jovem = latest.irsJovem.value;

  return (
    <>
      <PageHeader tile="laranja"
        title="Salário e impostos"
        lead="Quanto recebe na conta, como funciona o IRS em Portugal continental e para onde vai o dinheiro dos impostos, com os valores oficiais e calculadoras."
      />
      <Container className="grid gap-4 pt-10">
        <h2 className="font-display text-2xl font-medium">O seu salário</h2>
        <GroupLinks group="dinheiro" only={["/trabalho/salario-liquido", "/trabalho/recibo-de-vencimento", "/impostos/seguranca-social", "/impostos/onde-vai-o-meu-imposto"]} />
        <h2 className="mt-6 font-display text-2xl font-medium">O IRS</h2>
      </Container>
      <Container className="grid gap-6 pt-4 pb-10 lg:grid-cols-12">
        <Link href="/impostos/como-funciona-o-irs" className="pressable group rounded-sm border border-line bg-surface p-6 hover:border-accent lg:col-span-6">
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Comece aqui</p>
          <h2 className="mt-1 font-display text-3xl font-medium">O que é o IRS e como funciona</h2>
          <p className="mt-2 text-muted">Do que recebeu ao reembolso, em 7 passos, com um exemplo de um salário de 20 000 €.</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
            Ler o guia <ArrowRight weight="bold" />
          </p>
        </Link>
        <Link href="/impostos/tipos-de-rendimento" className="pressable group rounded-sm border border-line bg-surface p-6 hover:border-accent lg:col-span-6">
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Salário, recibos verdes, rendas, poupanças</p>
          <h2 className="mt-1 font-display text-3xl font-medium">IRS por tipo de rendimento</h2>
          <p className="mt-2 text-muted">Quanto paga cada tipo de rendimento e cada produto: depósitos, ações, ETF, PPR, seguros, criptoativos e venda de casa.</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
            Comparar <ArrowRight weight="bold" />
          </p>
        </Link>

        <Link
          href="/impostos/irs-jovem"
          className="pressable group relative overflow-hidden rounded-sm bg-accent p-7 text-on-accent lg:col-span-7 lg:row-span-2"
        >
          <p className="text-sm font-medium opacity-80">Até aos 35 anos</p>
          <h2 className="mt-2 font-display text-4xl font-medium tracking-[-0.015em]">IRS Jovem</h2>
          <p className="mt-3 max-w-[42ch] leading-relaxed opacity-90">
            Isenção de 100% no primeiro ano de rendimentos, que desce até 25% no décimo. Veja em que ano está e quanto fica isento.
          </p>
          <div className="mt-8 flex items-end gap-1.5" aria-hidden>
            {jovem.exemptionByIncomeYear.map((r, i) => (
              <div key={i} className="w-full rounded-t-sm bg-on-accent/25" style={{ height: `${r * 88}px` }} />
            ))}
          </div>
          <p className="mt-6 inline-flex items-center gap-2 font-medium">
            Verificar o meu caso <ArrowRight weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5" />
          </p>
        </Link>

        <Link href="/impostos/escaloes-irs" className="pressable group rounded-sm border border-line bg-surface p-6 hover:border-accent lg:col-span-5">
          <h2 className="font-display text-2xl leading-tight font-medium">Escalões de IRS {latest.year}</h2>
          <p className="mt-2 text-muted">
            {brackets.length} escalões, de {pct(brackets[0].rate, 1)} a {pct(brackets.at(-1)!.rate, 0)}. O que muda com cada euro a mais.
          </p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
            Ver a tabela <ArrowRight weight="bold" />
          </p>
        </Link>

        <Link href="/impostos/calculadora-escaloes" className="pressable group rounded-sm border border-line bg-surface p-6 hover:border-accent lg:col-span-5">
          <h2 className="font-display text-2xl leading-tight font-medium">Calculadora de escalões</h2>
          <p className="mt-2 text-muted">Escreva um rendimento coletável e veja o imposto de cada escalão, a taxa média e a taxa marginal.</p>
          <p className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent">
            Calcular <ArrowRight weight="bold" />
          </p>
        </Link>

        <section className="rounded-sm bg-sunken p-6 lg:col-span-12">
          <h2 className="font-semibold">Valores de referência {latest.year}</h2>
          <dl className="mt-4 grid gap-6 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <dt className="text-muted">Salário mínimo</dt>
              <dd className="mt-1 text-2xl font-semibold tabular">{eur(latest.minimumWageMonthly.value)}</dd>
            </div>
            <div>
              <dt className="text-muted">IAS</dt>
              <dd className="mt-1 text-2xl font-semibold tabular">{eur(latest.ias.value, 2)}</dd>
            </div>
            <div>
              <dt className="text-muted">Mínimo de existência</dt>
              <dd className="mt-1 text-2xl font-semibold tabular">{eur(latest.minimoExistencia.value)}</dd>
            </div>
            <div>
              <dt className="text-muted">Limite anual do IRS Jovem</dt>
              <dd className="mt-1 text-2xl font-semibold tabular">{eur(jovem.cap, 2)}</dd>
            </div>
          </dl>
          <p className="mt-5 text-sm text-muted">
            <Link href="/impostos/seguranca-social" className="underline underline-offset-4 hover:text-foreground">
              Taxas da Segurança Social
            </Link>{" "}
            ·{" "}
            <Link href="/fontes" className="underline underline-offset-4 hover:text-foreground">
              Fontes e datas de verificação
            </Link>
          </p>
        </section>
      </Container>
    </>
  );
}
