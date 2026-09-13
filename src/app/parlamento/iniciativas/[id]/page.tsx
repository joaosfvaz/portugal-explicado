import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowSquareOut } from "@phosphor-icons/react/dist/ssr";
import { StageTrack, VoteSummary } from "@/components/initiative-explainer";
import { authorLabel, StatusBadge } from "@/components/parlamento";
import { Container, Notice, SourceList, HeaderFrame } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getInitiative, getInitiatives, getMeta } from "@/lib/parlamento/data";
import { explainStatus, isMajorEvent, nextStep, phaseInfo, stageReached, stagesFor, TYPE_INFO } from "@/lib/parlamento/explain";
import { Glossed } from "@/components/glossary/glossed";
import type { InitiativeDetail, InitiativeEvent, RelatedInitiative } from "@/lib/parlamento/types";

export const revalidate = 3600;

export async function generateMetadata({ params }: PageProps<"/parlamento/iniciativas/[id]">): Promise<Metadata> {
  const { id } = await params;
  const i = getInitiative(id);
  return i ? { title: `${i.type} n.º ${i.number}`, description: i.title } : { title: "Iniciativa não encontrada" };
}

const external = { target: "_blank", rel: "noopener noreferrer" } as const;

export default async function IniciativaPage({ params }: PageProps<"/parlamento/iniciativas/[id]">) {
  const { id } = await params;
  const i = getInitiative(id);
  if (!i) notFound();
  const meta = getMeta();
  const seats = Object.fromEntries((meta?.parties ?? []).map((p) => [p.acronym, p.seats]));
  const known = new Set(getInitiatives().map((x) => x.id));

  const stages = stagesFor(i.typeCode);
  const reached = stageReached(i.events, i.typeCode);
  const explanation = explainStatus(i, formatDate);
  const last = i.events.at(-1);
  const isDecisive = (e: InitiativeEvent) => e.phase === i.statusPhase && e.date === i.statusDate;
  const major = i.events.filter((e) => isMajorEvent(e, isDecisive(e)));

  return (
    <>
      <HeaderFrame as="header" className="py-8 md:py-10">
          <p className="text-sm text-muted">
            {i.type} n.º {i.number}/{i.legislature} · {authorLabel(i)}
            {i.enteredOn && <> · entrou a {formatDate(i.enteredOn)}</>}
          </p>
          <h1 className="mt-2 max-w-[62ch] font-display text-3xl leading-snug font-medium tracking-[-0.01em] text-pretty md:text-4xl">{i.title}</h1>
          <p className="mt-2 text-xs text-muted">Título oficial, sem alterações.</p>

          <dl className="mt-6 grid max-w-[75ch] gap-px overflow-hidden border border-line bg-line">
            {[
              { k: "O que é", v: TYPE_INFO[i.typeCode] ? `${TYPE_INFO[i.typeCode].name}. ${TYPE_INFO[i.typeCode].effect}` : i.type },
              { k: "Onde está", v: explanation.headline },
              { k: "O que vem a seguir", v: nextStep(i.status, i.typeCode, reached) },
            ]
              .filter((row): row is { k: string; v: string } => Boolean(row.v))
              .map((row) => (
                <div key={row.k} className="grid gap-1 bg-surface px-4 py-3 sm:grid-cols-[10rem_1fr]">
                  <dt className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase sm:pt-1">{row.k}</dt>
                  <dd className="leading-relaxed">
                    <Glossed>{row.v}</Glossed>
                  </dd>
                </div>
              ))}
          </dl>

          <div className="mt-8 grid gap-6 rounded-sm bg-sunken p-5 md:p-6">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="max-w-[65ch]">
                <p className="text-xl font-semibold tracking-tight">{explanation.headline}</p>
                {explanation.body && <p className="mt-1.5 leading-relaxed text-muted">{explanation.body}</p>}
              </div>
              <StatusBadge status={i.status} />
            </div>
            {stages && reached !== null && <StageTrack stages={stages} reached={reached} status={i.status} />}
            {last && (
              <p className="text-sm text-muted">
                Último movimento: {phaseInfo(last.phase).label}, a {formatDate(last.date)}.
              </p>
            )}
          </div>
      </HeaderFrame>

      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid content-start gap-10">
          {i.decrees.length > 1 && (
            <Notice tone="warn" title="Esta iniciativa deu origem a mais do que um decreto">
              Os decretos {i.decrees.join(", ")} seguiram caminhos diferentes. O estado acima pode não descrever todos. Veja os momentos principais abaixo.
            </Notice>
          )}

          <WhatItIs i={i} />

          <details className="group">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-3 rounded-sm border border-line bg-surface px-5 py-4">
              <span>
                <span className="block font-display text-2xl leading-tight font-medium">O que aconteceu, passo a passo</span>
                <span className="mt-0.5 block text-sm text-muted">
                  {major.length} momentos principais, com as votações de cada partido. {i.events.length} fases no total.
                </span>
              </span>
              <span className="text-sm font-medium text-accent group-open:hidden">Abrir</span>
              <span className="hidden text-sm font-medium text-accent group-open:inline">Fechar</span>
            </summary>
            <section className="mt-4">
            <Timeline events={major} isDecisive={isDecisive} seats={seats} />

            {major.length < i.events.length && (
              <details className="mt-8 rounded-sm border border-line bg-surface">
                <summary className="cursor-pointer px-5 py-4 font-medium">Ver todas as {i.events.length} fases</summary>
                <ol className="divide-y divide-line border-t border-line">
                  {i.events.map((e, idx) => {
                    const plain = phaseInfo(e.phase).label;
                    return (
                      <li key={`${e.phase}-${e.date}-${idx}`} className="grid gap-1 px-5 py-3 text-sm sm:grid-cols-[110px_1fr]">
                        <span className="text-muted tabular">{formatDate(e.date)}</span>
                        <span>
                          {plain}
                          {plain !== e.phase && <span className="block text-xs text-muted">Nome oficial: {e.phase}</span>}
                          {e.note && <span className="block text-xs text-muted">{e.note}</span>}
                        </span>
                      </li>
                    );
                  })}
                </ol>
              </details>
            )}
            </section>
          </details>
        </div>

        <aside className="grid content-start gap-4">
          <SideCard title="Documentos oficiais">
            <ul className="grid gap-2">
              {i.textUrl && (
                <li>
                  <ExternalLink href={i.textUrl}>Texto completo da iniciativa</ExternalLink>
                </li>
              )}
              <li>
                <ExternalLink href={i.officialUrl}>Página no site do Parlamento</ExternalLink>
              </li>
            </ul>
            <p className="mt-3 text-xs leading-relaxed text-muted">O texto inclui a exposição de motivos, onde os autores explicam o objetivo.</p>
          </SideCard>

          {i.jointInitiatives.length > 0 && (
            <SideCard title="Debatida em conjunto com" hint="Iniciativas sobre o mesmo tema, discutidas no mesmo debate.">
              <RelatedList items={i.jointInitiatives} known={known} />
            </SideCard>
          )}

          {i.petitions.length > 0 && (
            <SideCard title={i.petitions.length === 1 ? "Petição relacionada" : `${i.petitions.length} petições relacionadas`} hint="Pedidos de cidadãos ligados a esta iniciativa.">
              <ul className="grid gap-3">
                {i.petitions.map((p) => (
                  <li key={p.id}>
                    <a
                      href={`https://www.parlamento.pt/ActividadeParlamentar/Paginas/DetalhePeticao.aspx?BID=${p.id}`}
                      {...external}
                      className="block leading-snug hover:text-accent"
                    >
                      <span className="block text-xs text-muted">Petição n.º {p.number}</span>
                      {p.subject}
                    </a>
                  </li>
                ))}
              </ul>
            </SideCard>
          )}

          {(i.origin.length > 0 || i.originated.length > 0) && (
            <SideCard title="Iniciativas ligadas">
              <RelatedList items={[...i.origin, ...i.originated]} known={known} />
            </SideCard>
          )}

          {i.authorParties.length > 0 && (
            <SideCard title="Mais iniciativas de">
              <div className="flex flex-wrap gap-2">
                {i.authorParties.map((p) => (
                  <Link key={p} href={`/parlamento/iniciativas?partido=${encodeURIComponent(p)}`} className="pressable rounded-sm border border-line px-3 py-1 text-sm hover:border-accent">
                    {p}
                  </Link>
                ))}
              </div>
            </SideCard>
          )}
        </aside>

        {meta && (
          <div className="lg:col-span-2">
            <SourceList sources={[{ title: `Assembleia da República, Dados Abertos (importado em ${formatDate(meta.importedAt)})`, url: meta.sources[0].url }]} />
          </div>
        )}
      </Container>
    </>
  );
}

function WhatItIs({ i }: { i: InitiativeDetail }) {
  const info = TYPE_INFO[i.typeCode];
  if (!info && i.citedActs.length === 0 && i.publishedAs.length === 0) return null;
  return (
    <section className="grid gap-4 md:grid-cols-2">
      {info && (
        <div className="rounded-sm border border-line bg-surface p-5 md:col-span-2">
          <h2 className="font-semibold">{info.name}: o que é</h2>
          <p className="mt-2 max-w-[70ch] leading-relaxed">{info.effect}</p>
          <p className="mt-2 text-sm text-muted">{info.who}</p>
        </div>
      )}
      {i.publishedAs.length > 0 && (
        <div className="rounded-sm bg-accent-soft p-5">
          <h2 className="font-semibold text-accent-strong">Resultado publicado</h2>
          <ul className="mt-2 grid gap-1.5">
            {i.publishedAs.map((a) => (
              <li key={`${a.type}-${a.number}-${a.year}`}>
                {a.drUrl ? (
                  <ExternalLink href={a.drUrl}>
                    {a.type} n.º {a.number}/{a.year}
                  </ExternalLink>
                ) : (
                  <span>
                    {a.type} n.º {a.number}/{a.year}
                  </span>
                )}
                {a.publishedOn && <span className="text-sm text-muted"> · {formatDate(a.publishedOn)}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}
      {i.citedActs.length > 0 && (
        <div className="rounded-sm border border-line bg-surface p-5">
          <h2 className="font-semibold">Diplomas citados no título</h2>
          <p className="mt-1 text-sm text-muted">A iniciativa refere estes diplomas. Normalmente são as leis que quer mudar.</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {i.citedActs.map((a) => (
              <li key={a} className="rounded-sm bg-sunken px-2 py-0.5 text-sm font-medium">
                {a}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}

function Timeline({ events, isDecisive, seats }: { events: InitiativeEvent[]; isDecisive: (e: InitiativeEvent) => boolean; seats: Record<string, number> }) {
  return (
    <ol className="mt-6 grid">
      {events.map((e, idx) => {
        const decisive = isDecisive(e);
        const info = phaseInfo(e.phase);
        return (
          <li key={`${e.phase}-${e.date}-${idx}`} className="relative grid grid-cols-[20px_1fr] gap-4 pb-8 last:pb-0">
            <span aria-hidden className="relative flex justify-center">
              <span className={`mt-1.5 h-2.5 w-2.5 rounded-full ${decisive ? "bg-accent ring-4 ring-accent-soft" : "bg-muted/40"}`} />
              {idx < events.length - 1 && <span className="absolute top-5 bottom-[-4px] w-px bg-line" />}
            </span>
            <div className="min-w-0">
              <p className="text-sm text-muted tabular">{formatDate(e.date)}</p>
              <p className="text-lg font-medium leading-snug">
                {info.label}
                {decisive && <span className="ml-2 align-middle text-xs font-normal text-accent">define o estado atual</span>}
              </p>
              {info.help && <p className="mt-1 max-w-[65ch] text-sm leading-relaxed text-muted">{info.help}</p>}
              {e.publication?.url && (
                <ExternalLink href={e.publication.url} className="mt-1 text-sm">
                  {e.publication.type}
                </ExternalLink>
              )}
              {e.votes.map((v) =>
                /^requerimento/i.test(v.description ?? "") ? (
                  <details key={v.id} className="mt-2 text-sm">
                    <summary className="cursor-pointer text-muted">
                      Votação de um pedido de procedimento: {v.result?.toLowerCase() ?? "sem resultado"}
                    </summary>
                    <VoteSummary v={v} seats={seats} />
                  </details>
                ) : (
                  <VoteSummary key={v.id} v={v} seats={seats} />
                ),
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function SideCard({ title, hint, children }: { title: string; hint?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-line bg-surface p-5 text-sm">
      <h2 className="font-semibold">{title}</h2>
      {hint && <p className="mt-1 text-xs text-muted">{hint}</p>}
      <div className="mt-3">{children}</div>
    </section>
  );
}

function RelatedList({ items, known }: { items: RelatedInitiative[]; known: Set<string> }) {
  return (
    <ul className="grid gap-3">
      {items.map((r) => {
        const body = (
          <>
            <span className="block text-xs text-muted">
              {r.type} n.º {r.number}
              {r.author && <> · {r.author}</>}
            </span>
            <span className="leading-snug">{r.title}</span>
          </>
        );
        return (
          <li key={r.id}>
            {known.has(r.id) ? (
              <Link href={`/parlamento/iniciativas/${r.id}`} className="block hover:text-accent">
                {body}
              </Link>
            ) : (
              <div>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}

function ExternalLink({ href, children, className = "" }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} {...external} className={`inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline ${className}`}>
      {children}
      <ArrowSquareOut aria-label="(abre noutra janela)" />
    </a>
  );
}
