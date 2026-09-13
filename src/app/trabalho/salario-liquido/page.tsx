import type { Metadata } from "next";
import Link from "next/link";
import { Glossed } from "@/components/glossary/glossed";
import { SalaryCalculator } from "@/components/trabalho/salary-calculator";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { SALARY_SOURCES } from "@/lib/trabalho/rules-2026";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "Salário líquido 2026: quanto recebo",
  description: "Calcule quanto recebe na conta por mês, depois da Segurança Social e do IRS, com as tabelas de retenção de 2026.",
};

const DISCOUNTS = [
  {
    title: "Segurança Social: 11%",
    text: "Paga as pensões, o subsídio de doença, o subsídio de desemprego e a licença parental. O patrão paga ainda mais 23,75% por cima do seu salário, que não sai do seu bolso.",
  },
  {
    title: "IRS retido",
    text: "Um adiantamento do IRS do ano, calculado com as tabelas de retenção de 2026. Depende do salário, da situação familiar e do número de filhos. Até 920 € por mês não há retenção.",
  },
  {
    title: "Subsídio de refeição",
    text: "Não tem descontos até 6,15 € por dia, se vier junto com o salário, ou até 10,46 € por dia, se vier em cartão ou vales. Só a parte acima destes valores paga IRS e Segurança Social.",
  },
];

export default function SalarioLiquidoPage() {
  return (
    <>
      <PageHeader
        title="Quanto recebo líquido?"
        lead="Escreva o seu salário bruto. Mostramos quanto chega à conta, quanto vai para a Segurança Social e quanto é retido de IRS, com as regras de 2026."
      />
      <Container className="grid gap-12 py-10">
        <SalaryCalculator />

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">Para onde vão os descontos</h2>
          <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            {DISCOUNTS.map((d) => (
              <div key={d.title} className="bg-surface p-5">
                <p className="font-display text-2xl font-medium">{d.title}</p>
                <p className="mt-2 leading-relaxed text-muted">
                  <Glossed>{d.text}</Glossed>
                </p>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-muted">
            Quer perceber cada linha do seu recibo?{" "}
            <Link href="/trabalho/recibo-de-vencimento" className="font-medium text-accent">
              Veja o recibo de vencimento explicado
            </Link>
            .
          </p>
        </section>

        <Notice tone="warn" title="O que esta conta não inclui">
          <ul className="grid gap-1">
            <li>IRS Jovem: quem tem até 35 anos pode ter menos IRS retido. Veja a página do IRS Jovem.</li>
            <li>Pessoas com deficiência, que usam outras tabelas de retenção.</li>
            <li>Açores e Madeira, que têm tabelas próprias. Esta conta é para o continente.</li>
            <li>Horas extra, prémios, diuturnidades e subsídios pagos em duodécimos.</li>
            <li>Quotas sindicais, penhoras e outros descontos do seu recibo.</li>
          </ul>
        </Notice>

        <HelpBox topic="trabalho" />

        <SourceList sources={SALARY_SOURCES} />
      </Container>
    </>
  );
}
