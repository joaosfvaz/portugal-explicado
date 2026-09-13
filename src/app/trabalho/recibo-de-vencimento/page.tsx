import type { Metadata } from "next";
import Link from "next/link";
import { Glossed } from "@/components/glossary/glossed";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { eur, pct } from "@/lib/format";
import { netSalary } from "@/lib/trabalho/salario";
import { SALARY_SOURCES } from "@/lib/trabalho/rules-2026";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "Recibo de vencimento explicado",
  description: "O que quer dizer cada linha do recibo de vencimento: vencimento base, subsídio de refeição, horas extra, IRS, Segurança Social e descontos.",
};

const LINES = [
  { name: "Vencimento base", plain: "O salário combinado no contrato, antes de descontos. Paga IRS e Segurança Social." },
  { name: "Subsídio de refeição", plain: "Não tem descontos até 6,15 € por dia em dinheiro ou 10,46 € por dia em cartão. Acima disso, a diferença paga IRS e Segurança Social." },
  { name: "Diuturnidades", plain: "Um valor extra pela antiguidade na empresa. Só existe se o contrato ou a convenção coletiva o prevê." },
  { name: "Horas extra (trabalho suplementar)", plain: "Pagas com acréscimo. Até 100 horas no ano: mais 25% na 1.ª hora e mais 37,5% nas seguintes em dia útil, e mais 50% em dia de descanso ou feriado. O IRS retido é metade da taxa do mês." },
  { name: "Subsídio de férias e de Natal", plain: "Cada um vale um mês de salário. O IRS destes subsídios é calculado à parte do salário do mês." },
  { name: "Faltas", plain: "As faltas sem justificação, e algumas justificadas, descontam dias de salário." },
  { name: "Segurança Social", plain: "Desconto de 11% sobre o que recebe, para pensões, doença, desemprego e parentalidade." },
  { name: "IRS", plain: "Imposto retido na fonte, com a taxa efetiva do mês ao lado. É um adiantamento, acertado na declaração anual." },
  { name: "Quota sindical", plain: "Só aparece se pediu ou autorizou por escrito." },
  { name: "Penhora", plain: "Um desconto ordenado por um tribunal ou outra entidade legal, para pagar uma dívida." },
  { name: "Outros descontos", plain: "Por exemplo um adiantamento ou refeições na empresa. Juntos, não podem passar de 1/6 do salário, salvo os que a lei manda descontar." },
  { name: "Líquido a receber", plain: "O valor que é transferido para a sua conta." },
];

const MANDATORY = [
  "Nome da empresa",
  "O seu nome completo",
  "O seu número da Segurança Social",
  "A sua categoria profissional",
  "O vencimento base e os outros valores pagos",
  "O período a que o pagamento diz respeito",
  "Os descontos",
  "O valor líquido a receber",
  "A taxa efetiva de IRS retido",
];

export default function ReciboPage() {
  const gross = 1200;
  const r = netSalary({ gross, household: "nao-casado", dependents: 0, mealPerDay: 8, mealDays: 21, mealPaidBy: "cartao" });
  const rows = [
    { n: 1, label: "Vencimento base", earn: eur(gross, 2) },
    { n: 2, label: `Subsídio de refeição em cartão (21 dias × 8,00 €)`, earn: eur(r.mealTotal, 2) },
    { n: 7, label: "Segurança Social (11%)", discount: eur(r.socialSecurity, 2) },
    { n: 8, label: `IRS (taxa efetiva ${pct(r.irsEffectiveRate, 1)})`, discount: eur(r.irs, 2) },
  ];

  return (
    <>
      <PageHeader title="O recibo de vencimento, linha a linha" lead="O recibo mostra o que ganhou, o que foi descontado e o que recebe na conta. O patrão tem de o entregar até ao dia do pagamento." />
      <Container className="grid gap-12 py-10">
        <section className="grid gap-8 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
          <figure>
            <div className="rounded-sm border border-line bg-surface font-mono text-sm">
              <div className="flex flex-wrap justify-between gap-2 border-b border-line p-4">
                <div>
                  <p className="font-semibold">Empresa Exemplo, Lda.</p>
                  <p className="text-muted">NIF 500 000 000</p>
                </div>
                <div className="text-right">
                  <p>Maria Silva · Técnica administrativa</p>
                  <p className="text-muted">NISS 12345678901 · setembro de 2026</p>
                </div>
              </div>
              <table className="w-full">
                <thead>
                  <tr className="border-b border-line text-left text-xs text-muted">
                    <th className="px-4 py-2 font-medium">Descrição</th>
                    <th className="px-3 py-2 text-right font-medium">Ganhos</th>
                    <th className="px-4 py-2 text-right font-medium">Descontos</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.label} className="border-b border-line">
                      <td className="px-4 py-2.5">
                        <span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-sm bg-accent font-sans text-xs text-on-accent">{row.n}</span>
                        {row.label}
                      </td>
                      <td className="px-3 py-2.5 text-right tabular">{row.earn ?? ""}</td>
                      <td className="px-4 py-2.5 text-right tabular">{row.discount ?? ""}</td>
                    </tr>
                  ))}
                  <tr className="bg-sunken font-semibold">
                    <td className="px-4 py-3">
                      <span className="mr-2 inline-grid h-5 w-5 place-items-center rounded-sm bg-accent font-sans text-xs text-on-accent">12</span>
                      Líquido a receber
                    </td>
                    <td className="px-3 py-3" />
                    <td className="px-4 py-3 text-right tabular">{eur(r.net, 2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <figcaption className="mt-2 text-sm text-muted">
              Exemplo com as regras de 2026: solteira, sem filhos, continente. Os números correspondem à{" "}
              <Link href="/trabalho/salario-liquido" className="font-medium text-accent">
                calculadora do salário líquido
              </Link>
              .
            </figcaption>
          </figure>

          <div className="grid content-start gap-4">
            <Notice tone="neutral" title="O que o recibo tem de mostrar">
              <ul className="grid gap-0.5">
                {MANDATORY.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
              <p className="mt-2">Código do Trabalho, art. 276.º, e Código do IRS, art. 99.º.</p>
            </Notice>
            <Notice tone="neutral" title="O que o patrão paga e não aparece no recibo">
              Mais {eur(r.employerSocialSecurity, 2)} para a Segurança Social (23,75%) e um seguro de acidentes de trabalho obrigatório. Neste exemplo, o custo total para a empresa é cerca de{" "}
              {eur(r.employerCost, 0)} por mês.
            </Notice>
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">O que quer dizer cada linha</h2>
          <ol className="mt-5 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {LINES.map((l, i) => (
              <li key={l.name} className="flex gap-3 bg-surface p-4">
                <span className="grid h-7 w-7 shrink-0 place-items-center rounded-sm bg-accent-soft font-display text-lg text-accent-strong figures">{i + 1}</span>
                <div>
                  <p className="font-semibold">{l.name}</p>
                  <p className="mt-1 text-sm leading-relaxed text-muted">
                    <Glossed>{l.plain}</Glossed>
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <Notice tone="warn" title="Se algo não bate certo">
          Fale primeiro com os recursos humanos da empresa. Se não resolver, pode pedir informação ou fazer queixa à Autoridade para as Condições do Trabalho (ACT), pelo 300 069 300 em dias úteis das 9h
          às 12h30, ou em gov.pt. Veja também os{" "}
          <Link href="/trabalho/direitos" className="font-medium underline underline-offset-4">
            seus direitos no trabalho
          </Link>
          .
        </Notice>

        <HelpBox topic="trabalho" />

        <SourceList sources={SALARY_SOURCES} />
      </Container>
    </>
  );
}
