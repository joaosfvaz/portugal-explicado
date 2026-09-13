import type { Metadata } from "next";
import { BracketCalculator } from "@/components/tax/bracket-calculator";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { availableTaxYears, getTaxYear, isCalculable } from "@/lib/tax/data";
import { taxSources } from "@/lib/tax/sources";

export const metadata: Metadata = {
  title: "Calculadora de escalões de IRS",
  description: "Calcule o imposto por escalão, a taxa média e a taxa marginal para um rendimento coletável.",
};

export default function CalculadoraPage() {
  const years = availableTaxYears()
    .map((y) => getTaxYear(y)!)
    .filter((y) => isCalculable(y.irsBrackets));

  return (
    <>
      <PageHeader
        title="Calculadora de escalões de IRS"
        lead="Mostra quanto imposto resulta das taxas gerais para um rendimento coletável, escalão a escalão."
      />
      <Container className="py-10">
        {years.length === 0 ? (
          <Notice tone="bad" title="Sem dados verificados">
            Ainda não temos escalões verificados numa fonte oficial.
          </Notice>
        ) : (
          <>
            <BracketCalculator years={years.map((y) => ({ year: y.year, brackets: y.irsBrackets.value }))} />
            <div className="mt-8 max-w-[70ch]">
              <Notice tone="neutral" title="Este não é o seu IRS final">
                O resultado é o imposto antes das deduções à coleta, do mínimo de existência e do adicional de solidariedade. Serve para perceber
                como funcionam os escalões.
              </Notice>
            </div>
            <SourceList sources={years.flatMap((y) => taxSources(y, ["irsBrackets"]))} />
          </>
        )}
      </Container>
    </>
  );
}
