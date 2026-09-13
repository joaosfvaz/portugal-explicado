import type { Metadata } from "next";
import { IrsJovemChecker } from "@/components/tax/irs-jovem-checker";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { availableTaxYears, getTaxYear, isCalculable } from "@/lib/tax/data";
import { taxSources } from "@/lib/tax/sources";
import { eur, pct } from "@/lib/format";

export const metadata: Metadata = {
  title: "IRS Jovem 2026: quem tem direito e quanto fica isento",
  description: "Verifique se tem direito ao IRS Jovem, em que ano do regime está e quanto rendimento fica isento.",
};

export default function IrsJovemPage() {
  const years = availableTaxYears()
    .map((y) => getTaxYear(y)!)
    .filter((y) => isCalculable(y.irsJovem) && isCalculable(y.irsBrackets) && isCalculable(y.deducaoEspecificaCatA));
  const latest = years[0];
  const rules = latest?.irsJovem.value;

  return (
    <>
      <PageHeader
        title="IRS Jovem"
        lead="Uma isenção parcial de IRS para quem tem até 35 anos, durante os primeiros 10 anos de rendimentos do trabalho."
      />
      <Container className="py-10">
        {!latest ? (
          <Notice tone="bad" title="Sem dados verificados">
            Ainda não temos as regras do IRS Jovem verificadas numa fonte oficial.
          </Notice>
        ) : (
          <>
            <IrsJovemChecker
              years={years.map((y) => ({
                year: y.year,
                rules: y.irsJovem.value,
                brackets: y.irsBrackets.value,
                deducaoEspecifica: y.deducaoEspecificaCatA.value,
              }))}
            />

            <div className="mt-16 grid gap-10 lg:grid-cols-2">
              <section className="grid content-start gap-4 leading-relaxed">
                <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Quem tem direito</h2>
                <ul className="grid gap-3 text-muted">
                  <li>Ter até {rules.maxAge} anos a 31 de dezembro do ano do rendimento.</li>
                  <li>Ter rendimentos do trabalho por conta de outrem (categoria A) ou independente (categoria B).</li>
                  <li>Não ser considerado dependente no agregado familiar.</li>
                  <li>Não ter beneficiado do regime de residente não habitual, do IFICI ou do regime de ex-residentes.</li>
                  <li>Ter a situação tributária regularizada.</li>
                </ul>
                <p className="text-muted">Não é preciso ter curso superior. Essa condição existia no regime anterior a 2025.</p>
              </section>

              <section className="grid content-start gap-4 leading-relaxed">
                <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Quanto fica isento</h2>
                <div className="overflow-hidden rounded-sm border border-line bg-surface">
                  <table className="w-full text-sm tabular">
                    <thead className="bg-sunken text-left text-muted">
                      <tr>
                        <th className="px-4 py-3 font-medium">Ano de rendimentos</th>
                        <th className="px-4 py-3 text-right font-medium">Isenção</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        ["1.º", 0],
                        ["2.º ao 4.º", 1],
                        ["5.º ao 7.º", 4],
                        ["8.º ao 10.º", 7],
                      ].map(([label, idx]) => (
                        <tr key={label} className="border-t border-line">
                          <td className="px-4 py-3">{label}</td>
                          <td className="px-4 py-3 text-right font-semibold">{pct(rules.exemptionByIncomeYear[idx as number], 0)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-muted">
                  O rendimento isento nunca passa de 55 vezes o IAS: {years.map((y) => `${eur(y.irsJovem.value.cap, 2)} em ${y.year}`).join(" e ")}.
                </p>
              </section>

              <section className="grid content-start gap-4 leading-relaxed">
                <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Como se contam os anos</h2>
                <p className="text-muted">
                  A contagem começa no primeiro ano em que teve rendimentos do trabalho como sujeito passivo, mesmo que tenha sido antes de 2025. Não
                  contam os anos sem rendimentos, os anos em que foi dependente e os anos em que não tinha de entregar a declaração.
                </p>
                <p className="text-muted">
                  Exemplo da Autoridade Tributária: quem tem rendimentos desde 2018 e 30 anos em 2025 está no 8.º ano e tem 25% de isenção.
                </p>
              </section>

              <section className="grid content-start gap-4 leading-relaxed">
                <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Como pedir</h2>
                <p className="text-muted">
                  A opção faz-se todos os anos na declaração Modelo 3 de IRS. Durante o ano, pode informar a entidade patronal do ano de rendimentos em
                  que está, para reduzir a retenção na fonte. A isenção mensal considerada na retenção não pode passar de{" "}
                  {eur(rules.monthlyWithholdingCap, 2)} em {latest.year}.
                </p>
                <Notice tone="neutral">
                  O rendimento isento continua a contar para definir a taxa aplicada aos outros rendimentos.
                </Notice>
              </section>
            </div>

            <SourceList sources={years.flatMap((y) => taxSources(y, ["irsJovem", "ias", "deducaoEspecificaCatA", "irsBrackets"]))} />
          </>
        )}
      </Container>
    </>
  );
}
