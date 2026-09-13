import type { Metadata } from "next";
import { AbonoCalculator } from "@/components/beneficios/abono-calculator";
import { Container, PageHeader, SourceList } from "@/components/ui";
import { ABONO_2026 } from "@/lib/beneficios/rules-2026";
import { eur } from "@/lib/format";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "Abono de família 2026",
  description: "Escalões, valores de 2026 e simulador do abono de família para crianças e jovens, com a Garantia para a Infância.",
};

const AGE_BANDS = [
  { label: "Até 36 meses", values: ABONO_2026.upTo36Months },
  { label: "De 36 a 72 meses", values: ABONO_2026.from36To72Months },
  { label: "Mais de 72 meses", values: ABONO_2026.over72Months },
];

export default function AbonoPage() {
  return (
    <>
      <PageHeader
        title="Abono de família"
        lead="Um apoio mensal por cada criança ou jovem, que depende do rendimento do agregado. Veja em que escalão fica e quanto pode receber em 2026."
      />
      <Container className="grid gap-10 py-8">
        <AbonoCalculator />

        <section>
          <h2 className="font-display text-2xl leading-tight font-medium">Valores mensais em 2026</h2>
          <div className="mt-4 overflow-x-auto rounded-sm border border-line bg-surface">
            <table className="w-full min-w-[560px] text-sm tabular">
              <thead>
                <tr className="border-b border-line text-left text-xs text-muted">
                  <th className="px-5 py-2 font-medium">Idade</th>
                  {[1, 2, 3, 4].map((e) => (
                    <th key={e} className="px-4 py-2 text-right font-medium">
                      {e}.º escalão
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {AGE_BANDS.map((b) => (
                  <tr key={b.label} className="border-b border-line last:border-0">
                    <td className="px-5 py-3 text-muted">{b.label}</td>
                    {b.values.map((v, i) => (
                      <td key={i} className="px-4 py-3 text-right font-medium">
                        {v ? eur(v, 2) : "Sem direito"}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <ul className="mt-4 grid list-disc gap-2 pl-5 leading-relaxed text-muted">
            <li>Famílias monoparentais recebem mais 50%.</li>
            <li>No 1.º escalão, crianças entre os 6 e os 16 anos que estudam recebem o abono a dobrar em setembro.</li>
            <li>
              A Garantia para a Infância completa o apoio até {eur(ABONO_2026.garantiaAnnual)} por ano ({eur(ABONO_2026.garantiaAnnual / 12, 2)} por mês, valor calculado) para crianças no 1.º escalão com rendimento de referência abaixo de 0,35 vezes o IAS × 14. É atribuída automaticamente.
            </li>
            <li>O 3.º escalão vai até 1,7 vezes o IAS × 14 desde julho de 2022.</li>
          </ul>
        </section>

        <HelpBox topic="familia" />

        <SourceList sources={ABONO_2026.sources.map((s) => ({ ...s, verifiedOn: "2026-09-12", verification: "primary" }))} />
      </Container>
    </>
  );
}
