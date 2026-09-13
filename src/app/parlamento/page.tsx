import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { DataFreshness, InitiativeRow, SeatBar } from "@/components/parlamento";
import { Container, EmptyState, PageHeader, SourceList } from "@/components/ui";
import { formatDate, num } from "@/lib/format";
import { getDrActs, getInitiatives, getMeta } from "@/lib/parlamento/data";

export const metadata: Metadata = {
  title: "Parlamento",
  description: "O que a Assembleia da República discute, aprova e rejeita, com o histórico de cada iniciativa e os votos por partido.",
};

export default function ParlamentoPage() {
  const meta = getMeta();
  if (!meta) {
    return (
      <>
        <PageHeader title="Parlamento" />
        <Container className="py-10">
          <EmptyState title="Ainda não há dados importados">
            Corra <code className="font-mono">npm run import:parlamento</code> para importar os dados abertos da Assembleia da República.
          </EmptyState>
        </Container>
      </>
    );
  }

  const initiatives = getInitiatives();
  const laws = initiatives.filter((i) => i.type === "Projeto de Lei" || i.type === "Proposta de Lei");
  const decided = [...laws]
    .filter((i) => i.statusDate && ["aprovada", "publicada", "rejeitada", "vetada"].includes(i.status))
    .sort((a, b) => (b.statusDate ?? "").localeCompare(a.statusDate ?? ""))
    .slice(0, 6);
  const pendingLaws = laws.filter((i) => i.status === "em-curso").length;
  const dr = getDrActs();

  return (
    <>
      <PageHeader tile="estrela"
        title="Parlamento"
        lead={`A ${meta.legislature} Legislatura começou a ${formatDate(meta.legislatureStart)}. Aqui vê o que entra, o que é votado e o que chega ao Diário da República.`}
      >
        <div className="mt-4">
          <DataFreshness meta={meta} />
        </div>
      </PageHeader>

      <Container className="grid gap-12 py-10">
        <section>
          <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Composição</h2>
          <p className="mt-1 text-muted">{meta.parties.reduce((s, p) => s + p.seats, 0)} deputados em funções, por grupo parlamentar.</p>
          <div className="mt-5">
            <SeatBar parties={meta.parties} />
          </div>
          <Link href="/parlamento/partidos" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
            Partidos e deputados <ArrowRight weight="bold" />
          </Link>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Link href="/parlamento/iniciativas?grupo=leis&estado=em-curso" className="pressable rounded-sm bg-accent p-6 text-on-accent sm:col-span-2">
            <p className="text-sm opacity-85">Projetos e propostas de lei em curso</p>
            <p className="mt-2 figures font-display text-6xl leading-none font-medium tracking-[-0.01em]">{num(pendingLaws)}</p>
            <p className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium">
              Ver a lista <ArrowRight weight="bold" />
            </p>
          </Link>
          <Link href="/parlamento/iniciativas?estado=publicada" className="pressable rounded-sm border border-line bg-surface p-6 hover:border-accent">
            <p className="text-sm text-muted">Publicadas em Diário da República</p>
            <p className="mt-2 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{num(meta.counts.publicada)}</p>
          </Link>
          <Link href="/parlamento/iniciativas?estado=rejeitada" className="pressable rounded-sm border border-line bg-surface p-6 hover:border-accent">
            <p className="text-sm text-muted">Rejeitadas</p>
            <p className="mt-2 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{num(meta.counts.rejeitada)}</p>
          </Link>
          <p className="text-sm text-muted sm:col-span-2 lg:col-span-4">
            Contagens de todas as {num(meta.totalInitiatives)} iniciativas da legislatura, incluindo resoluções e outras.
          </p>
        </section>

        <section>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Decisões recentes sobre leis</h2>
            <Link href="/parlamento/iniciativas?grupo=leis" className="text-sm font-medium text-accent">
              Todas as iniciativas
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-line overflow-hidden rounded-sm border border-line bg-surface">
            {decided.map((i) => (
              <InitiativeRow key={i.id} i={i} />
            ))}
          </ul>
        </section>

        <section className="rounded-sm bg-sunken p-6">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">No Diário da República</h2>
            <Link href="/parlamento/diario-republica" className="text-sm font-medium text-accent">
              Ver mais
            </Link>
          </div>
          {dr && dr.acts.length > 0 ? (
            <ul className="mt-4 grid gap-4 lg:grid-cols-2">
              {dr.acts.slice(0, 4).map((a) => (
                <li key={a.url} className="rounded-sm bg-surface p-4">
                  <p className="text-sm text-muted">
                    {a.title}
                    {a.diarioDate && <> · {formatDate(a.diarioDate)}</>}
                  </p>
                  <a href={a.url} target="_blank" rel="noopener noreferrer" className="mt-1 block leading-snug hover:text-accent">
                    {a.summary}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-muted">Ainda não há atos importados. Corra npm run import:dr.</p>
          )}
        </section>

        <SourceList sources={meta.sources} />
      </Container>
    </>
  );
}
