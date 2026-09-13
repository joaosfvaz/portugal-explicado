import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ResultBars } from "@/components/eleicoes";
import { InitiativeRow } from "@/components/parlamento";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { getMunicipio, getMunicipios } from "@/lib/municipios/data";
import type { ListKind } from "@/lib/municipios/types";
import { getInitiatives } from "@/lib/parlamento/data";

export const dynamicParams = false;

export function generateStaticParams() {
  return (getMunicipios()?.municipios ?? []).map((m) => ({ slug: m.slug }));
}

export async function generateMetadata({ params }: PageProps<"/estado/municipios/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const m = getMunicipio(slug);
  return m ? { title: `${m.name}: câmara municipal`, description: `Quem ganhou a Câmara Municipal de ${m.name} em 2025, os vereadores de cada lista e as leis sobre o concelho.` } : {};
}

const KIND: Record<ListKind, string> = { partido: "Partido", coligacao: "Coligação de partidos", cidadaos: "Grupo de cidadãos, sem partido" };

const escape = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export default async function MunicipioPage({ params }: PageProps<"/estado/municipios/[slug]">) {
  const { slug } = await params;
  const m = getMunicipio(slug);
  if (!m) notFound();

  const winner = m.council[0];
  const majority = Math.floor(m.councilSeats / 2) + 1;
  const hasMajority = winner.seats >= majority;
  const elected = m.council.filter((l) => l.seats > 0);

  // Laws whose official title names this município ("Município de X", "concelho de X").
  const pattern = new RegExp(`(município|concelho|cidade|vila) d[aeo]s? ${escape(m.name)}(?![\\p{L}])`, "iu");
  const laws = getInitiatives()
    .filter((i) => pattern.test(i.title))
    .sort((a, b) => (b.lastDate ?? "").localeCompare(a.lastDate ?? ""))
    .slice(0, 8);

  return (
    <>
      <PageHeader
        title={m.name}
        lead={m.district.startsWith("Região") ? `Concelho da ${m.district}.` : `Concelho do distrito: ${m.district}.`}
      />
      <Container className="grid gap-12 py-10">
        <section className="rounded-sm border-l-2 border-accent bg-accent-soft p-5 md:p-6">
          <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Quem governa a câmara, desde 2025</p>
          <p className="mt-2 font-display text-4xl font-medium">{winner.short}</p>
          <p className="mt-1 text-muted">
            {KIND[winner.kind]}
            {winner.short !== winner.sigla && ` · ${winner.sigla}`}
          </p>
          <ul className="mt-4 grid max-w-[70ch] gap-2 text-lg leading-relaxed">
            <li>O presidente da câmara é o primeiro candidato desta lista, que teve {winner.pct.toLocaleString("pt-PT")}% dos votos.</li>
            <li>
              Tem {winner.seats} dos {m.councilSeats} lugares na câmara.{" "}
              {hasMajority
                ? "Tem maioria absoluta: pode aprovar as decisões da câmara sozinha."
                : `Não tem maioria absoluta, que são ${majority} lugares. Precisa do apoio de vereadores de outras listas para aprovar decisões.`}
            </li>
          </ul>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <div>
            <h2 className="font-display text-3xl leading-tight font-medium">Votos para a câmara municipal</h2>
            <p className="mt-1 text-muted">Percentagem de votos de cada lista e vereadores eleitos.</p>
            <div className="mt-4 rounded-sm border border-line bg-surface p-5">
              <ResultBars
                results={m.council.map((l) => ({ name: l.sigla, short: l.short, votes: null, pct: l.pct, seats: l.seats, previousSeats: null, elected: null }))}
                showSeats
              />
            </div>
          </div>
          <div>
            <h2 className="font-display text-3xl leading-tight font-medium">Os {m.councilSeats} lugares da câmara</h2>
            <p className="mt-1 text-muted">Cada quadrado é um vereador, incluindo o presidente.</p>
            <div className="mt-4 flex flex-wrap gap-1.5 rounded-sm border border-line bg-surface p-5" role="img" aria-label={elected.map((l) => `${l.short}: ${l.seats}`).join(", ")}>
              {elected.flatMap((l, li) =>
                Array.from({ length: l.seats }, (_, k) => (
                  <span key={`${l.sigla}-${k}`} className={`h-8 w-8 rounded-sm ${li === 0 ? "bg-accent" : li === 1 ? "bg-accent/55" : "bg-accent/25"}`} title={l.short} />
                )),
              )}
            </div>
            <ul className="mt-3 grid gap-1 text-sm">
              {elected.map((l, li) => (
                <li key={l.sigla} className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-sm ${li === 0 ? "bg-accent" : li === 1 ? "bg-accent/55" : "bg-accent/25"}`} aria-hidden />
                  {l.short}: {l.seats}
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <div className="rounded-sm border border-line bg-surface p-5">
            <h2 className="font-display text-2xl font-medium">O que faz a câmara</h2>
            <p className="mt-2 leading-relaxed text-muted">
              Gere serviços do dia a dia: licenças de obras e urbanismo, recolha do lixo, muitas vezes a água, escolas do 1.º ciclo, transportes locais, cultura e apoio social. Também decide
              parte do IMI e da participação no IRS dos moradores, dentro dos limites da lei.
            </p>
          </div>
          <div className="rounded-sm border border-line bg-surface p-5">
            <h2 className="font-display text-2xl font-medium">Quando é a próxima eleição</h2>
            <p className="mt-2 leading-relaxed text-muted">
              As próximas autárquicas são entre 22 de setembro e 14 de outubro de 2029. Veja os{" "}
              <Link href="/estado/eleicoes/autarquicas-2025" className="font-medium text-accent">
                resultados nacionais de 2025
              </Link>
              .
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">No Parlamento sobre {m.name}</h2>
          {laws.length ? (
            <ul className="mt-4 divide-y divide-line overflow-hidden rounded-sm border border-line bg-surface">
              {laws.map((i) => (
                <InitiativeRow key={i.id} i={i} />
              ))}
            </ul>
          ) : (
            <p className="mt-2 text-muted">Nesta legislatura não há iniciativas com o nome do concelho no título oficial.</p>
          )}
        </section>

        <Notice tone="neutral" title="Sobre os números">
          Resultados para a câmara municipal do mapa oficial da Comissão Nacional de Eleições, versão retificada. As percentagens são dos votos válidos. As assembleias municipais e de freguesia
          têm resultados próprios, que não estão nesta página.
        </Notice>

        <SourceList sources={[{ title: "CNE, Mapa Oficial n.º 2-B/2025 (retificado), resultados por município", url: "https://www.cne.pt/content/eleicoes-autarquicas-2025", verifiedOn: "2026-09-13", verification: "primary" }]} />
      </Container>
    </>
  );
}
