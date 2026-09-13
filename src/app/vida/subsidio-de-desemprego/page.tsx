import type { Metadata } from "next";
import { DesempregoCalculator } from "@/components/beneficios/desemprego-calculator";
import { Container, PageHeader, SourceList } from "@/components/ui";
import { DESEMPREGO_2026 } from "@/lib/beneficios/rules-2026";
import { eur, num } from "@/lib/format";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "Subsídio de desemprego 2026",
  description: "Quem tem direito, quanto se recebe e durante quanto tempo, com os valores de 2026 e um simulador.",
};

export default function DesempregoPage() {
  return (
    <>
      <PageHeader
        title="Subsídio de desemprego"
        lead="Para quem perdeu o emprego sem ser por vontade própria e tem pelo menos 12 meses de descontos nos últimos 24. O pedido é feito até 90 dias depois do desemprego."
      />
      <Container className="grid gap-10 py-8">
        <DesempregoCalculator />

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { k: "Valor", v: "65% da remuneração de referência" },
            { k: "Mínimo", v: `${eur(DESEMPREGO_2026.minimum, 2)} (${eur(DESEMPREGO_2026.minimumIfSalaryAtLeastRmmg, 2)} se os salários forem pelo menos o salário mínimo)` },
            { k: "Máximo", v: `${eur(DESEMPREGO_2026.maximum, 2)}, e nunca mais de 75% do valor líquido` },
          ].map((f) => (
            <div key={f.k} className="rounded-sm border border-line bg-surface p-5">
              <p className="text-sm text-muted">{f.k}</p>
              <p className="mt-1 font-semibold leading-snug">{f.v}</p>
            </div>
          ))}
        </section>

        <section>
          <h2 className="font-display text-2xl leading-tight font-medium">Duração, em dias</h2>
          <p className="mt-1 text-sm text-muted">Para quem ficou desempregado depois de 1 de abril de 2012. Os meses contam o tempo com salários registados.</p>
          <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
            <table className="w-full min-w-[620px] text-sm tabular">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th className="px-5 py-2 font-medium">Idade</th>
                  <th className="px-4 py-2 text-right font-medium">Menos de 15 meses</th>
                  <th className="px-4 py-2 text-right font-medium">15 a 23 meses</th>
                  <th className="px-4 py-2 text-right font-medium">24 meses ou mais</th>
                  <th className="px-5 py-2 text-right font-medium">Por cada 5 anos nos últimos 20</th>
                </tr>
              </thead>
              <tbody>
                {DESEMPREGO_2026.duration.map((b, i) => (
                  <tr key={i} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-muted">{["Menos de 30 anos", "30 a 39 anos", "40 a 49 anos", "50 anos ou mais"][i]}</td>
                    {b.days.map((d, j) => (
                      <td key={j} className="px-4 py-3 text-right font-medium">
                        {num(d)}
                      </td>
                    ))}
                    <td className="px-5 py-3 text-right">+{b.extraPer5Years}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <HelpBox topic="desemprego" />

        <SourceList sources={DESEMPREGO_2026.sources.map((s) => ({ ...s, verifiedOn: "2026-09-12", verification: "primary" }))} />
      </Container>
    </>
  );
}
