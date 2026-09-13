import type { Metadata } from "next";
import { Suspense } from "react";
import { DataFreshness } from "@/components/parlamento";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { filterInitiatives, getInitiatives, getMeta } from "@/lib/parlamento/data";
import { NO_FILTERS, toListItem } from "@/lib/parlamento/filters";
import { InitiativeBrowser, InitiativeList } from "./initiative-browser";

export const metadata: Metadata = {
  title: "Leis em discussão no Parlamento",
  description: "Projetos e propostas de lei, resoluções e outras iniciativas da Assembleia da República, com estado e histórico.",
};

export default function IniciativasPage() {
  const meta = getMeta();
  const all = getInitiatives();
  // The first page without filters is in the HTML. Filters run in the browser on the static list file.
  const initial = filterInitiatives(all.map(toListItem), NO_FILTERS);
  const parties = meta?.parties.map((p) => p.acronym) ?? [];

  return (
    <>
      <PageHeader
        title="Leis em discussão (iniciativas)"
        lead="Propostas que entram na Assembleia da República. Nem todas mudam a lei: veja a diferença abaixo."
      >
        <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-3">
          <div className="rounded-sm bg-sunken p-3">
            <dt className="font-semibold">Projeto ou Proposta de Lei</dt>
            <dd className="mt-1 leading-relaxed text-muted">Pode mudar a lei. Se for aprovada e promulgada, todos têm de a cumprir.</dd>
          </div>
          <div className="rounded-sm bg-sunken p-3">
            <dt className="font-semibold">Projeto de Resolução</dt>
            <dd className="mt-1 leading-relaxed text-muted">Na maioria dos casos é uma recomendação ao Governo. Não o obriga a agir.</dd>
          </div>
          <div className="rounded-sm bg-sunken p-3">
            <dt className="font-semibold">Fase</dt>
            <dd className="mt-1 leading-relaxed text-muted">Uma lei passa por 6 fases: entrada, debate, comissão, votação final, Presidente e publicação.</dd>
          </div>
        </dl>
        {meta && (
          <div className="mt-3">
            <DataFreshness meta={meta} />
          </div>
        )}
      </PageHeader>

      <Container className="py-8">
        {all.length === 0 ? (
          <EmptyState title="Ainda não há dados importados">Corra npm run import:parlamento.</EmptyState>
        ) : (
          <Suspense fallback={<InitiativeList filters={NO_FILTERS} result={initial} parties={parties} />}>
            <InitiativeBrowser initial={initial} parties={parties} />
          </Suspense>
        )}
      </Container>
    </>
  );
}
