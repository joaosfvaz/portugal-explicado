import type { Metadata } from "next";
import Link from "next/link";
import { DataFreshness, SeatBar } from "@/components/parlamento";
import { Container, EmptyState, PageHeader, SourceList } from "@/components/ui";
import { num, pct } from "@/lib/format";
import { getDeputies, getMeta } from "@/lib/parlamento/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Partidos e deputados",
  description: "Composição da Assembleia da República, iniciativas de cada partido e deputados por círculo eleitoral.",
};

export default function PartidosPage() {
  const meta = getMeta();
  if (!meta) {
    return (
      <Container className="py-10">
        <EmptyState title="Ainda não há dados importados">Corra npm run import:parlamento.</EmptyState>
      </Container>
    );
  }
  const deputies = getDeputies();

  return (
    <>
      <PageHeader
        title="Partidos e deputados"
        lead="Os grupos parlamentares são apresentados pela ordem do número de deputados, todos com o mesmo formato."
      >
        <div className="mt-4">
          <DataFreshness meta={meta} />
        </div>
      </PageHeader>

      <Container className="grid gap-12 py-10">
        <SeatBar parties={meta.parties} />

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Atividade por grupo parlamentar</h2>
          <p className="mt-1 max-w-[70ch] text-muted">
            Iniciativas apresentadas e sentido de voto nas {num(meta.finalVotesCounted)} votações finais globais com registo por partido nesta legislatura.
          </p>
          <div className="mt-5 overflow-x-auto rounded-sm border border-line bg-surface">
            <table className="w-full min-w-[640px] text-sm tabular">
              <thead className="bg-sunken text-left text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Grupo</th>
                  <th className="px-4 py-3 text-right font-medium">Deputados</th>
                  <th className="px-4 py-3 text-right font-medium">Iniciativas</th>
                  <th className="px-4 py-3 text-right font-medium">A favor</th>
                  <th className="px-4 py-3 text-right font-medium">Contra</th>
                  <th className="px-4 py-3 text-right font-medium">Abstenção</th>
                </tr>
              </thead>
              <tbody>
                {meta.parties.map((p) => {
                  const s = meta.partyStats[p.acronym];
                  const votes = s ? s.finalVotes.favor + s.finalVotes.contra + s.finalVotes.abstencao : 0;
                  const share = (n: number) => (votes ? pct(n / votes, 0) : "-");
                  return (
                    <tr key={p.acronym} className="border-t border-line">
                      <td className="px-4 py-3">
                        <span className="font-semibold">{p.acronym}</span> <span className="text-muted">{p.name}</span>
                      </td>
                      <td className="px-4 py-3 text-right">{p.seats}</td>
                      <td className="px-4 py-3 text-right">
                        <Link href={`/parlamento/iniciativas?partido=${encodeURIComponent(p.acronym)}`} className="text-accent underline-offset-4 hover:underline">
                          {num(s?.authored ?? 0)}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-right">{s ? share(s.finalVotes.favor) : "-"}</td>
                      <td className="px-4 py-3 text-right">{s ? share(s.finalVotes.contra) : "-"}</td>
                      <td className="px-4 py-3 text-right">{s ? share(s.finalVotes.abstencao) : "-"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <p className="mt-2 text-xs text-muted">
            Percentagens sobre as votações finais globais em que o partido teve posição registada. Não inclui votações por unanimidade sem detalhe.
          </p>
        </section>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Deputados em funções</h2>
          <div className="mt-5 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {meta.parties.map((p) => {
              const list = deputies.filter((d) => d.party === p.acronym);
              return (
                <details key={p.acronym} className="group rounded-sm border border-line bg-surface p-5 open:pb-3">
                  <summary className="flex cursor-pointer items-baseline justify-between gap-3 marker:content-none">
                    <span className="font-semibold">{p.acronym}</span>
                    <span className="text-sm text-muted tabular">{list.length} deputados</span>
                  </summary>
                  <ul className="mt-3 grid gap-1.5 text-sm">
                    {list.map((d) => (
                      <li key={d.id} className="flex justify-between gap-3">
                        <span>{d.name}</span>
                        <span className="text-right text-muted">{d.circle}</span>
                      </li>
                    ))}
                  </ul>
                </details>
              );
            })}
          </div>
        </section>

        <SourceList sources={meta.sources} />
      </Container>
    </>
  );
}
