import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { SearchForm } from "@/components/search-form";
import { Container, PageHeader } from "@/components/ui";
import { searchIndex } from "@/lib/search/index";
import { KIND_LABEL, search } from "@/lib/search/search";
import { THEMES } from "@/lib/nav";

export async function generateMetadata({ searchParams }: PageProps<"/pesquisa">): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: "Pesquisar",
    description: "Procure em todas as páginas, guias, palavras difíceis, números e municípios do Portugal Explicado.",
    // The search page is useful to find; each list of results is not.
    robots: q ? { index: false } : undefined,
  };
}

const EXAMPLES = ["recibo", "renda", "IRS", "abono", "burla", "reforma", "desemprego", "IMI"];

export default async function PesquisaPage({ searchParams }: PageProps<"/pesquisa">) {
  const sp = await searchParams;
  const q = (Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "").slice(0, 120).trim();
  const { results, partial } = q ? search(searchIndex(), q) : { results: [], partial: false };

  return (
    <>
      <PageHeader title="Pesquisar" lead="Escreva uma palavra ou uma pergunta. Pode escrever sem acentos.">
        <SearchForm id="pesquisa-q" size="lg" defaultValue={q} autoFocus={!q} className="mt-6 max-w-2xl" />
      </PageHeader>

      <Container className="grid gap-10 py-10">
        {!q && (
          <section>
            <h2 className="font-display text-2xl font-medium">Exemplos</h2>
            <ul className="mt-3 flex flex-wrap gap-2">
              {EXAMPLES.map((e) => (
                <li key={e}>
                  <Link href={`/pesquisa?q=${encodeURIComponent(e)}`} className="pressable inline-block rounded-sm border border-line bg-surface px-3 py-2 hover:border-accent">
                    {e}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {q && (
          <section aria-live="polite">
            <h2 className="font-display text-2xl font-medium">
              {results.length === 0
                ? `Não encontrámos nada sobre «${q}»`
                : partial
                  ? `Não encontrámos «${q}» exatamente. Estas páginas podem ajudar:`
                  : `${results.length === 1 ? "1 resultado" : `${results.length} resultados`} para «${q}»`}
            </h2>

            {results.length > 0 && (
              <ol className="mt-5 divide-y divide-line overflow-hidden rounded-sm border border-line bg-surface">
                {results.map(({ doc }) => (
                  <li key={`${doc.kind}-${doc.href}-${doc.title}`}>
                    <Link href={doc.href} className="group flex items-start justify-between gap-4 p-4 hover:bg-sunken/60 sm:p-5">
                      <span className="min-w-0">
                        <span className="block text-xs text-muted">
                          {KIND_LABEL[doc.kind]}
                          {doc.section && <> · {doc.section}</>}
                        </span>
                        <span className="mt-0.5 block text-lg font-semibold group-hover:text-accent">{doc.title}</span>
                        {doc.summary && <span className="mt-1 block leading-relaxed text-muted">{doc.summary}</span>}
                      </span>
                      <ArrowRight className="mt-6 h-4 w-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
                    </Link>
                  </li>
                ))}
              </ol>
            )}

            <div className="mt-6 grid gap-3 rounded-sm bg-sunken p-5 leading-relaxed">
              <p>
                Procura uma lei?{" "}
                <Link href={`/parlamento/iniciativas?q=${encodeURIComponent(q)}`} className="font-medium text-accent underline underline-offset-4">
                  Procurar «{q}» nas leis do Parlamento
                </Link>
              </p>
              {results.length === 0 && (
                <p>
                  Tente outra palavra, veja as{" "}
                  <Link href="/glossario" className="font-medium text-accent underline underline-offset-4">
                    palavras difíceis
                  </Link>
                  , responda às perguntas de{" "}
                  <Link href="/para-mim" className="font-medium text-accent underline underline-offset-4">
                    O que é para mim
                  </Link>{" "}
                  ou veja{" "}
                  <Link href="/vida/ajuda" className="font-medium text-accent underline underline-offset-4">
                    onde pedir ajuda
                  </Link>
                  .
                </p>
              )}
            </div>
          </section>
        )}

        <section>
          <h2 className="font-display text-2xl font-medium">Ou escolha um tema</h2>
          <ul className="mt-4 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {THEMES.map((t) => (
              <li key={t.id} className="bg-surface">
                <Link href={t.href} className="group flex h-full items-center justify-between gap-3 p-4 font-semibold hover:bg-sunken/60">
                  <span className="group-hover:text-accent">{t.label}</span>
                  <ArrowRight className="h-4 w-4 text-muted group-hover:text-accent" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </Container>
    </>
  );
}
