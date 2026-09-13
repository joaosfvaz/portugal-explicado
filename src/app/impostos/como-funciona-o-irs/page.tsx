import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { RuleTable, Section, Steps } from "@/components/casa/content";
import { WorkedExample } from "@/components/tax/worked-example";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { DEDUCTIONS, FILING, IRS_OPEN_POINTS, IRS_SOURCES, IRS_STEPS } from "@/content/irs";
import { eur, num } from "@/lib/format";
import { Glossed } from "@/components/glossary/glossed";
import { taxByBrackets } from "@/lib/tax/brackets";
import { getTaxYear } from "@/lib/tax/data";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "O que é o IRS e como funciona",
  description: "O IRS explicado passo a passo: do que recebeu ao reembolso, escalões, deduções, retenção na fonte e entrega da declaração, com um exemplo de 2026.",
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export default function ComoFuncionaIrsPage() {
  const year = getTaxYear(2026)!;
  const gross = 20_000;
  const specific = year.deducaoEspecificaCatA.value;
  const taxable = round2(gross - specific);
  const coleta = taxByBrackets(taxable, year.irsBrackets.value).tax;
  const general = 250;
  const final = round2(coleta - general);
  // Tabela I do Despacho n.º 233-A/2026: 1 428,57 € × 24,10% − 193,33 €, 14 meses.
  const withheld = round2(150.96 * 14);
  const diff = round2(withheld - final);

  return (
    <>
      <PageHeader
        title="O que é o IRS e como funciona"
        lead="O IRS é o imposto sobre o rendimento das pessoas. Paga-se sobre o que recebe num ano: salário, recibos verdes, pensões, rendas, juros e ganhos com vendas."
      />

      <Container className="grid gap-14 py-10">
        <section className="rounded-sm border-l-2 border-accent bg-accent-soft p-5 md:p-6" aria-label="Em resumo">
          <h2 className="font-display text-2xl font-medium">Em resumo, para quem tem salário ou pensão</h2>
          <ul className="mt-3 grid max-w-[75ch] gap-2 text-lg leading-relaxed">
            <li>
              <Glossed>Todos os meses, o patrão ou a Segurança Social já desconta IRS. Até 920 € por mês, não desconta nada.</Glossed>
            </li>
            <li>
              <Glossed>Uma vez por ano, entre 1 de abril e 30 de junho, entrega a declaração no Portal das Finanças. Muitas pessoas só têm de confirmar o IRS Automático.</Glossed>
            </li>
            <li>Se descontou a mais, recebe a diferença. Se descontou a menos, paga o resto.</li>
            <li>
              <Glossed>Pedir fatura com NIF, ter filhos e pagar renda baixam o imposto.</Glossed>
            </li>
          </ul>
          <p className="mt-3 text-sm text-muted">
            Quer saber quanto recebe por mês?{" "}
            <Link href="/trabalho/salario-liquido" className="font-medium text-accent">
              Calcule o salário líquido
            </Link>
            .
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          {[
            { k: "Quem paga", v: "Quem vive em Portugal paga sobre tudo o que ganha no mundo. Quem vive fora paga só sobre o que ganha em Portugal." },
            { k: "Para que serve", v: "É uma das maiores receitas do Estado. Ajuda a pagar escolas, hospitais, pensões, estradas e os outros serviços públicos." },
            { k: "Porque é progressivo", v: "Quem ganha mais paga uma percentagem maior. Quem ganha até cerca do salário mínimo não paga." },
          ].map((c) => (
            <div key={c.k} className="border-t-2 border-accent bg-surface p-5">
              <p className="font-display text-2xl font-medium">{c.k}</p>
              <p className="mt-2 leading-relaxed text-muted">{c.v}</p>
            </div>
          ))}
        </section>

        <Section title="Como se calcula, em 7 passos" lead="O cálculo é feito uma vez por ano, na declaração. Os descontos mensais são só adiantamentos.">
          <Steps
            items={IRS_STEPS.map((st) => ({
              title: st.title,
              body: (
                <>
                  <p className="text-foreground">
                    <Glossed>{st.plain}</Glossed>
                  </p>
                  <details className="mt-2">
                    <summary className="cursor-pointer text-sm font-medium text-accent">Detalhes da lei</summary>
                    <ul className="mt-2 grid gap-1 text-sm">
                      {st.details.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </details>
                </>
              ),
            }))}
          />
          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            <Link href="/impostos/escaloes-irs" className="pressable inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface px-3 py-2 font-medium hover:border-accent">
              Ver os escalões de 2026 <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <Link href="/impostos/tipos-de-rendimento" className="pressable inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface px-3 py-2 font-medium hover:border-accent">
              Como é tributado cada tipo de rendimento <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </Section>

        <Section title="Um exemplo com números reais" lead="Um salário de cerca de 1 429 € brutos por mês, ou 20 000 € por ano com os subsídios, com as regras de 2026.">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <WorkedExample
              title="Trabalhador solteiro, sem filhos"
              assumptions={["Vive no continente e não tem IRS Jovem.", "Recebe 14 salários de 1 428,57 €.", "Tem faturas com NIF suficientes para a dedução de despesas gerais."]}
              rows={[
                { label: "Salário bruto do ano", value: eur(gross, 2) },
                { label: "Dedução específica", value: `− ${eur(specific, 2)}` },
                { label: "Rendimento coletável", value: eur(taxable, 2), strong: true },
                { label: "Imposto pelos escalões (coleta)", value: eur(coleta, 2) },
                { label: "Dedução de despesas gerais", value: `− ${eur(general, 2)}` },
                { label: "IRS final do ano", value: eur(final, 2), strong: true },
                { label: "O mesmo, por mês (a dividir por 14)", value: eur(final / 14, 2) },
                { label: "Retido pelo patrão: 150,96 € × 14", value: eur(withheld, 2) },
                { label: diff >= 0 ? "Reembolso" : "A pagar", value: eur(Math.abs(diff), 2), strong: true },
              ]}
              result={
                <>
                  Paga {eur(final, 2)} de IRS no ano, cerca de {num((final / gross) * 100, 1)}% do salário bruto, embora o escalão mais alto que atinge seja de 21,2%. Sem faturas, a dedução
                  de 250 € desaparece e teria de pagar cerca de {eur(Math.abs(diff - general), 0)} em vez de receber.
                </>
              }
            />
            <div className="grid content-start gap-4">
              <Notice tone="neutral" title="Taxa do escalão não é taxa que paga">
                Este trabalhador está no 3.º escalão, de 21,2%. Mas os primeiros 8 342 € pagam 12,5% e os seguintes 15,7%. Por isso a taxa média é muito mais baixa.
              </Notice>
              <Notice tone="neutral" title="Porque há reembolso">
                A retenção mensal usa tabelas feitas para um caso típico. Na declaração entram as deduções reais da família. A diferença volta para si ou é paga ao Estado.
              </Notice>
            </div>
          </div>
        </Section>

        <Section title="Deduções mais comuns" lead="Estes valores saem do imposto, não do rendimento. Uma dedução de 250 € baixa o IRS em 250 €.">
          <RuleTable text head={["Dedução", "Como se calcula", "Máximo"]} rows={DEDUCTIONS.map((d) => [<span key="n" className="font-medium text-foreground">{d.name}</span>, d.how, d.cap])} />
          <p className="mt-3 text-sm text-muted">
            Saúde, educação, casa, lares, IVA em faturas e PPR contam juntos para um limite. Quem tem rendimento coletável até 8 342 € não tem limite. Acima disso, o limite desce de 2 500 € até 1 000 €
            aos 80 000 € (art. 78.º). Dependentes e despesas gerais ficam fora deste limite.
          </p>
        </Section>

        <Section title="O que muda para as pessoas e para o Estado">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-sm border border-line bg-surface p-5">
              <p className="font-display text-2xl font-medium">Para as pessoas</p>
              <ul className="mt-3 grid gap-2 leading-relaxed text-muted">
                <li>Pedir fatura com NIF conta: sem faturas, perde deduções.</li>
                <li>Passar para o escalão seguinte não faz pagar a taxa mais alta sobre todo o salário. Só a parte que entra nesse escalão paga essa taxa.</li>
                <li>Filhos, saúde, educação e renda baixam o imposto, até aos limites.</li>
              </ul>
            </div>
            <div className="rounded-sm border border-line bg-surface p-5">
              <p className="font-display text-2xl font-medium">Para o Estado</p>
              <ul className="mt-3 grid gap-2 leading-relaxed text-muted">
                <li>A retenção mensal dá receita regular durante todo o ano.</li>
                <li>Cada dedução ou taxa reduzida é receita a que o Estado renuncia para apoiar um objetivo, como a habitação ou a natalidade.</li>
                <li>Pedir faturas com NIF ajuda a combater a fuga ao IVA.</li>
              </ul>
            </div>
          </div>
        </Section>

        <Section title="Entregar a declaração">
          <dl className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 lg:grid-cols-3">
            {FILING.map((f) => (
              <div key={f.title} className="bg-surface p-5">
                <dt className="font-semibold">{f.title}</dt>
                <dd className="mt-1.5 text-sm leading-relaxed text-muted">{f.body}</dd>
              </div>
            ))}
          </dl>
        </Section>

        <Notice tone="warn" title="Limites desta página">
          <ul className="grid gap-1">
            {IRS_OPEN_POINTS.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
        </Notice>

        <HelpBox topic="impostos" />

        <SourceList sources={IRS_SOURCES} />
      </Container>
    </>
  );
}
