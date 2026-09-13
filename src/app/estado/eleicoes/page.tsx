import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { ResultBars, pct1 } from "@/components/eleicoes";
import { Container, PageHeader, SourceList } from "@/components/ui";
import { ELECTIONS, NEXT_ELECTIONS, WHO_CAN_VOTE } from "@/content/eleicoes";
import { TYPE_LABEL, type Election } from "@/lib/eleicoes/types";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Eleições em Portugal",
  description: "Os resultados oficiais das eleições mais recentes em Portugal: presidenciais, legislativas, europeias, autárquicas, regionais e referendo, com o que cada uma decide.",
};

function headline(e: Election) {
  const round = e.rounds.at(-1)!;
  if (e.type === "presidenciais") {
    const w = round.results.find((r) => r.elected);
    return w ? `${w.short} eleito na ${round.label}, com ${pct1(w.pct!)}.` : "";
  }
  if (e.type === "referendo") {
    const w = round.results.find((r) => r.elected);
    return w ? `Ganhou o «${w.short}», com ${pct1(w.pct!)}. Não vinculativo.` : "";
  }
  if (e.measure === "councils" && e.groups) {
    const [a, b] = [...e.groups.results].sort((x, y) => (y.seats ?? 0) - (x.seats ?? 0));
    return `${a.short}: ${a.seats} câmaras. ${b.short}: ${b.seats}.`;
  }
  const top = [...round.results].sort((x, y) => (y.votes ?? 0) - (x.votes ?? 0))[0];
  const majority = e.seatsTotal && e.type !== "europeias" ? Math.floor(e.seatsTotal / 2) + 1 : null;
  return `${top.short} foi a lista mais votada, com ${pct1(top.pct!)}${top.seats !== null ? ` e ${top.seats} lugares` : ""}.${majority ? ` A maioria absoluta são ${majority}.` : ""}`;
}

function ElectionCard({ e, wide }: { e: Election; wide: boolean }) {
  const round = e.rounds.at(-1)!;
  const bars = e.measure === "councils" && e.groups ? e.groups.results.map((r) => ({ ...r, pct: ((r.seats ?? 0) / (e.seatsTotal ?? 1)) * 100 })) : round.results;
  return (
    <Link href={`/estado/eleicoes/${e.id}`} className={`pressable group flex flex-col bg-surface p-5 hover:bg-sunken/50 ${wide ? "md:col-span-2" : ""}`}>
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">{TYPE_LABEL[e.type]}</p>
        <p className="text-sm text-muted">{formatDate(round.date)}</p>
      </div>
      <h3 className="mt-1 font-display text-2xl font-medium group-hover:text-accent">{e.title}</h3>
      <p className="mt-1 text-sm leading-relaxed text-muted">{e.chooses}</p>
      <p className="mt-3 leading-relaxed">{headline(e)}</p>
      <div className="mt-4">
        <ResultBars results={bars} limit={4} />
        {e.measure === "councils" && <p className="mt-2 text-xs text-muted">Percentagem das 308 câmaras.</p>}
      </div>
      <p className="mt-auto flex items-center justify-between gap-3 pt-4 text-sm">
        <span className="text-muted">Votaram {round.turnoutPct !== null ? pct1(round.turnoutPct) : "sem dados"}</span>
        <span className="inline-flex items-center gap-1.5 font-medium text-accent">
          Resultados completos <ArrowRight className="h-4 w-4" aria-hidden />
        </span>
      </p>
    </Link>
  );
}

export default function EleicoesPage() {
  const sources = ELECTIONS.flatMap((e) => e.sources.filter((s) => s.title.includes("Mapa Oficial")));
  return (
    <>
      <PageHeader
        title="Eleições"
        lead="Em Portugal vota-se para escolher o Presidente, a Assembleia da República, os deputados europeus, as câmaras e juntas de freguesia e, nos Açores e na Madeira, os parlamentos regionais."
      />
      <Container className="grid gap-12 py-10">
        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">Os resultados mais recentes</h2>
          <p className="mt-1 max-w-[70ch] text-muted">A última eleição de cada tipo, com os números dos mapas oficiais da Comissão Nacional de Eleições.</p>
          <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {ELECTIONS.map((e, i) => (
              <ElectionCard key={e.id} e={e} wide={i === ELECTIONS.length - 1 && ELECTIONS.length % 2 === 1} />
            ))}
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl leading-tight font-medium">Próximas eleições</h2>
            <p className="mt-1 text-muted">Datas limite previstas na lei. O Governo ou o Presidente marcam o dia exato.</p>
            <ul className="mt-5 divide-y divide-line rounded-sm border border-line bg-surface">
              {NEXT_ELECTIONS.map((n) => (
                <li key={n.label} className="grid gap-1 px-4 py-3 sm:grid-cols-[10rem_1fr]">
                  <span className="font-medium">{n.label}</span>
                  <span>
                    <span className="block">{n.date ? formatDate(n.date) : n.latestBy}</span>
                    <span className="block text-xs text-muted">{n.basis}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-display text-3xl leading-tight font-medium">Quem pode votar</h2>
            <ul className="mt-5 grid gap-3">
              {WHO_CAN_VOTE.map((w) => (
                <li key={w} className="border-l-2 border-accent bg-surface px-4 py-3 leading-relaxed">
                  {w}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <SourceList sources={sources} />
      </Container>
    </>
  );
}
