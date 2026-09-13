import type { Metadata } from "next";
import Link from "next/link";
import { Glossed } from "@/components/glossary/glossed";
import { HelpBox } from "@/components/help-box";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";

export const metadata: Metadata = {
  title: "A reforma explicada",
  description: "A idade da reforma em 2026 e 2027, como a pensão é calculada, o que acontece se sair mais cedo ou mais tarde, e onde simular a sua pensão.",
};

const CHECKED = "2026-09-13";
const GUIDE = "https://www.seg-social.pt/ptss/pssd/documento/cmc1zt9ae00lskl2ye2zwphdb";
const PORTARIA = "https://files.diariodarepublica.pt/1s/2025/12/24900/0005500056.pdf";

const FACTS = [
  { label: "Idade normal da reforma em 2026", value: "66 anos e 9 meses" },
  { label: "Idade normal da reforma em 2027", value: "66 anos e 11 meses" },
  { label: "Mínimo de descontos para ter pensão", value: "15 anos (144 meses)" },
  { label: "Corte por sair antes da idade", value: "0,5% por cada mês" },
];

export default function ReformaPage() {
  return (
    <>
      <PageHeader title="A reforma explicada" lead="Quando se pode reformar, como a Segurança Social calcula a pensão e o que muda se sair mais cedo ou mais tarde. Não calculamos a sua pensão: só a Segurança Social tem a sua carreira completa." />
      <Container className="grid gap-12 py-10">
        <dl className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {FACTS.map((f) => (
            <div key={f.label} className="bg-surface p-5">
              <dt className="text-sm text-muted">{f.label}</dt>
              <dd className="mt-2 font-display text-3xl font-medium figures">{f.value}</dd>
            </div>
          ))}
        </dl>

        <section className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl leading-tight font-medium">Quando me posso reformar?</h2>
            <ul className="mt-4 grid gap-3 text-lg leading-relaxed">
              <li>Em 2026, a idade normal é 66 anos e 9 meses. Muda todos os anos, conforme a esperança de vida aos 65 anos.</li>
              <li>
                <Glossed>Com 60 anos ou mais e mais de 40 anos de descontos, a sua idade de reforma baixa 4 meses por cada ano a mais de 40. Por exemplo, em 2026, com 44 anos de descontos, a idade é 65 anos e 5 meses.</Glossed>
              </li>
              <li>Com carreiras muito longas, 48 anos de descontos, ou 46 anos se começou a descontar antes dos 17, pode reformar-se aos 60 anos sem cortes.</li>
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl leading-tight font-medium">Sair antes ou depois</h2>
            <ul className="mt-4 grid gap-3 text-lg leading-relaxed">
              <li>Se sair antes da sua idade de reforma, a pensão fica 0,5% mais baixa por cada mês que falta.</li>
              <li>
                O fator de sustentabilidade é um corte extra, de 17,63% em 2026. Não se aplica a quem se reforma na idade normal ou pessoal. Nas reformas antecipadas, aplica-se em alguns
                casos e não noutros: confirme a sua situação com a Segurança Social antes de pedir a reforma.
              </li>
              <li>Se trabalhar depois da idade, a pensão sobe todos os meses, até aos 70 anos: de 0,33% a 1% por mês, conforme os anos de descontos.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">Como a pensão é calculada</h2>
          <div className="mt-4 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-3">
            <div className="bg-surface p-5">
              <p className="font-display text-2xl font-medium">1. O salário de referência</p>
              <p className="mt-2 leading-relaxed text-muted">A Segurança Social olha para os salários registados ao longo da carreira e calcula um salário médio de referência.</p>
            </div>
            <div className="bg-surface p-5">
              <p className="font-display text-2xl font-medium">2. A percentagem por ano</p>
              <p className="mt-2 leading-relaxed text-muted">Cada ano de descontos vale entre 2% e 2,3% desse salário. Os salários mais baixos têm a percentagem mais alta.</p>
            </div>
            <div className="bg-surface p-5">
              <p className="font-display text-2xl font-medium">3. A multiplicação</p>
              <p className="mt-2 leading-relaxed text-muted">Salário de referência × percentagem × anos de descontos. Por exemplo, 40 anos a 2% dão 80% do salário de referência, antes de cortes ou aumentos.</p>
            </div>
          </div>
          <p className="mt-3 text-sm text-muted">Para quem começou a descontar antes de 2002, a pensão junta uma parte calculada com regras antigas e outra com as regras atuais. O simulador da Segurança Social faz estas contas.</p>
        </section>

        <Notice tone="neutral" title="Veja a sua pensão estimada">
          No Portal da Segurança Social, em Simuladores, pode ver a sua carreira de descontos e uma estimativa da pensão. Pode pedir a pensão até 3 meses antes da data em que quer começar. Veja{" "}
          <Link href="/vida/vou/reformar-me" className="font-medium underline underline-offset-4">
            os passos para se reformar
          </Link>
          .
        </Notice>

        <Notice tone="warn" title="Funcionários públicos">
          Quem desconta para a Caixa Geral de Aposentações segue as regras da CGA, que são parecidas mas não iguais. Confirme em cga.pt.
        </Notice>

        <HelpBox topic="reforma" />

        <SourceList
          sources={[
            { title: "Segurança Social, Guia Prático da Pensão de Velhice (7001, v4.78)", url: GUIDE, verifiedOn: CHECKED, verification: "primary" },
            { title: "Portaria n.º 476/2025/1, idade de reforma de 2027 e fator de sustentabilidade de 2026", url: PORTARIA, verifiedOn: CHECKED, verification: "primary" },
            { title: "Caixa Geral de Aposentações, pensão de aposentação", url: "https://www.cga.pt/pensao-de-aposentacao", verifiedOn: CHECKED, verification: "primary" },
          ]}
        />
      </Container>
    </>
  );
}
