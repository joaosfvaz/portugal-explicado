import type { Metadata } from "next";
import Link from "next/link";
import { Container, EmptyState, PageHeader, SourceList } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { getApprovedActs, getDrActs } from "@/lib/parlamento/data";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Leis publicadas (Diário da República)",
  description: "Leis, decretos-lei, portarias e resoluções publicados na 1.ª série do Diário da República, com o sumário oficial.",
};

export default function DiarioRepublicaPage() {
  const dr = getDrActs();
  const laws = getApprovedActs()
    .filter((a) => (a.type === "Lei" || a.type === "Lei Orgânica") && a.publishedOn)
    .slice(0, 12);

  const byDay = new Map<string, NonNullable<typeof dr>["acts"]>();
  for (const a of dr?.acts ?? []) {
    const key = a.diarioDate ?? a.firstSeen;
    byDay.set(key, [...(byDay.get(key) ?? []), a]);
  }

  return (
    <>
      <PageHeader
        title="Leis publicadas (Diário da República)"
        lead="Os atos publicados na 1.ª série, com o sumário oficial. Os sumários não são reescritos."
      >
        {dr && <p className="mt-4 text-sm text-muted">Importado em {formatDate(dr.importedAt)}.</p>}
      </PageHeader>

      <Container className="grid gap-12 py-10 lg:grid-cols-[minmax(0,1fr)_340px]">
        <section>
          {byDay.size === 0 ? (
            <EmptyState title="Ainda não há atos importados">
              Corra <code className="font-mono">npm run import:dr</code> todos os dias. O feed oficial só mostra a edição mais recente.
            </EmptyState>
          ) : (
            [...byDay].map(([day, acts]) => (
              <div key={day} className="mb-10 last:mb-0">
                <h2 className="text-lg font-semibold tracking-tight">{formatDate(day)}</h2>
                <ul className="mt-3 divide-y divide-line overflow-hidden rounded-sm border border-line bg-surface">
                  {acts.map((a) => (
                    <li key={a.url} className="px-5 py-4">
                      <p className="text-sm text-muted">
                        {a.title}
                        {a.issuer && <> · {a.issuer}</>}
                      </p>
                      <p className="mt-1 leading-relaxed">{a.summary}</p>
                      <p className="mt-2 flex gap-4 text-sm">
                        <a href={a.url} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
                          Ver no Diário da República
                        </a>
                        {a.pdfUrl && (
                          <a href={a.pdfUrl} target="_blank" rel="noopener noreferrer" className="text-muted underline-offset-4 hover:underline">
                            PDF
                          </a>
                        )}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            ))
          )}
        </section>

        <aside>
          <h2 className="text-lg font-semibold tracking-tight">Últimas leis da Assembleia</h2>
          <ul className="mt-3 grid gap-3">
            {laws.map((l) => (
              <li key={l.id} className="rounded-sm bg-sunken p-4 text-sm">
                <p className="text-muted tabular">
                  {l.type} n.º {l.number}/{l.year}
                  {l.publishedOn && <> · {formatDate(l.publishedOn)}</>}
                </p>
                <p className="mt-1 leading-snug">{l.title}</p>
                <div className="mt-2 flex gap-4">
                  {l.drUrl && (
                    <a href={l.drUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline-offset-4 hover:underline">
                      Diário da República
                    </a>
                  )}
                  {l.initiativeIds[0] && (
                    <Link href={`/parlamento/iniciativas/${l.initiativeIds[0]}`} className="text-accent underline-offset-4 hover:underline">
                      Iniciativa
                    </Link>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </aside>

        <div className="lg:col-span-2">
          <SourceList
            sources={[
              { title: "Diário da República, feed RSS da 1.ª série", url: "https://files.diariodarepublica.pt/rss/serie1-html.xml" },
              { title: "Assembleia da República, Dados Abertos: Diplomas aprovados", url: "https://www.parlamento.pt/Cidadania/Paginas/DADiplomasAprovados.aspx" },
            ]}
          />
        </div>
      </Container>
    </>
  );
}
