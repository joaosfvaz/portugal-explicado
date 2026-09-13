import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResultBars, ResultTable, TurnoutFacts } from "@/components/eleicoes";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { ELECTIONS, getElection } from "@/content/eleicoes";
import { TYPE_LABEL } from "@/lib/eleicoes/types";
import { formatDate, num } from "@/lib/format";
import { Glossed } from "@/components/glossary/glossed";

export const dynamicParams = false;

export function generateStaticParams() {
  return ELECTIONS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: PageProps<"/estado/eleicoes/[id]">): Promise<Metadata> {
  const { id } = await params;
  const e = getElection(id);
  return e ? { title: `${e.title}: resultados`, description: `${e.chooses} Resultados oficiais, participação e o que o resultado significa.` } : {};
}

export default async function ElectionPage({ params }: PageProps<"/estado/eleicoes/[id]">) {
  const { id } = await params;
  const e = getElection(id);
  if (!e) notFound();

  const councils = e.measure === "councils";

  return (
    <>
      <PageHeader
        title={e.title}
        lead={e.chooses}
      >
        <p className="mt-4 text-sm text-muted">
          {TYPE_LABEL[e.type]} · {e.rounds.map((r) => `${r.label}: ${formatDate(r.date)}`).join(" · ")}
        </p>
      </PageHeader>

      <Container className="grid gap-12 py-10">
        <section className="rounded-sm border-l-2 border-accent bg-accent-soft p-5" aria-label="O que significa">
          <h2 className="font-display text-2xl font-medium">O que significa</h2>
          <ul className="mt-3 grid max-w-[75ch] gap-2 leading-relaxed">
            {e.meaning.map((m) => (
              <li key={m}>
                <Glossed>{m}</Glossed>
              </li>
            ))}
          </ul>
        </section>

        {e.groups && (
          <section>
            <h2 className="font-display text-3xl leading-tight font-medium">{e.groups.label}</h2>
            <p className="mt-1 max-w-[75ch] text-muted">{e.groups.note}</p>
            <div className="mt-5 grid gap-6 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
              <div className="rounded-sm border border-line bg-surface p-5">
                <ResultBars results={e.groups.results.filter((r) => (r.seats ?? 0) > 0).map((r) => ({ ...r, pct: ((r.seats ?? 0) / (e.seatsTotal ?? 1)) * 100 }))} />
                <p className="mt-3 text-xs text-muted">Percentagem das {e.seatsTotal} câmaras municipais.</p>
                <Link href="/estado/municipios" className="mt-3 inline-block text-sm font-medium text-accent">
                  Ver o resultado do seu concelho
                </Link>
              </div>
              <ResultTable round={{ ...e.rounds[0], results: e.groups.results }} mode="councils" previousLabel={e.previousLabel} />
            </div>
          </section>
        )}

        {e.rounds.map((round) => (
          <section key={round.label} className="grid gap-5">
            <div>
              <h2 className="font-display text-3xl leading-tight font-medium">{e.rounds.length > 1 ? round.label : councils ? "Todas as listas vencedoras" : "Resultados"}</h2>
              <p className="mt-1 text-muted">
                {formatDate(round.date)}
                {e.seatsTotal && !councils ? ` · ${e.seatsTotal} lugares${e.type !== "europeias" ? ` · maioria absoluta: ${Math.floor(e.seatsTotal / 2) + 1}` : ""}` : ""}
              </p>
            </div>
            {!councils && (
              <div className="rounded-sm border border-line bg-surface p-5">
                <ResultBars results={round.results} limit={8} showSeats={e.seatsTotal !== null} />
              </div>
            )}
            <ResultTable round={round} mode={councils ? "councils" : e.seatsTotal !== null ? "seats" : "votes"} previousLabel={e.previousLabel} winnerLabel={e.type === "referendo" ? "Resposta vencedora" : "Eleito"} />
            <TurnoutFacts round={round} />
            {round.registered !== null && round.voters !== null && (
              <p className="text-sm text-muted">
                Em cada 10 eleitores inscritos, cerca de {Math.round((round.voters / round.registered) * 10)} votaram. Os votos em branco e nulos contam para a participação, mas não para as
                percentagens de cada {e.type === "presidenciais" ? "candidato" : e.type === "referendo" ? "resposta" : "lista"}. Inscritos: {num(round.registered)}.
              </p>
            )}
          </section>
        ))}

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl leading-tight font-medium">Como funciona esta eleição</h2>
            <ul className="mt-4 grid gap-2 leading-relaxed">
              {e.system.map((x) => (
                <li key={x} className="border-l-2 border-line pl-3">
                  <Glossed>{x}</Glossed>
                </li>
              ))}
            </ul>
          </div>
          <div className="grid content-start gap-4">
            <Notice tone="neutral" title="Sobre os números">
              <p>{e.scope}</p>
              {e.notes.length > 0 && (
                <ul className="mt-2 grid gap-1.5">
                  {e.notes.map((n) => (
                    <li key={n}>{n}</li>
                  ))}
                </ul>
              )}
            </Notice>
            <p className="text-sm text-muted">
              As cores são iguais para todas as listas. O Portugal Explicado não usa cores de partidos. <Link href="/estado/eleicoes" className="font-medium text-accent">Ver todas as eleições</Link>
            </p>
          </div>
        </section>

        <SourceList sources={e.sources} />
      </Container>
    </>
  );
}
