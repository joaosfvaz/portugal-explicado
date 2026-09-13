import type { Metadata } from "next";
import Link from "next/link";
import { DataFreshness, InitiativeRow } from "@/components/parlamento";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { num } from "@/lib/format";
import { filterInitiatives, getInitiatives, getMeta, TYPE_GROUPS, type InitiativeFilters, type TypeGroup } from "@/lib/parlamento/data";
import { STATUS_LABEL, type InitiativeStatus } from "@/lib/parlamento/types";

export const metadata: Metadata = {
  title: "Leis em discussão no Parlamento",
  description: "Projetos e propostas de lei, resoluções e outras iniciativas da Assembleia da República, com estado e histórico.",
};

const one = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? "";

export default async function IniciativasPage({ searchParams }: PageProps<"/parlamento/iniciativas">) {
  const sp = await searchParams;
  const meta = getMeta();
  const all = getInitiatives();

  const groupParam = one(sp.grupo);
  const statusParam = one(sp.estado);
  const filters: InitiativeFilters = {
    group: groupParam in TYPE_GROUPS ? (groupParam as TypeGroup) : "todas",
    status: statusParam in STATUS_LABEL ? (statusParam as InitiativeStatus) : "todos",
    party: one(sp.partido),
    q: one(sp.q).slice(0, 120),
    page: Number(one(sp.pagina)) || 1,
  };
  const result = filterInitiatives(all, filters);

  const href = (patch: Partial<Record<"grupo" | "estado" | "partido" | "q" | "pagina", string>>) => {
    const params = new URLSearchParams();
    const merged = {
      grupo: filters.group === "todas" ? "" : filters.group,
      estado: filters.status === "todos" ? "" : filters.status,
      partido: filters.party,
      q: filters.q,
      pagina: "",
      ...patch,
    };
    for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v);
    const s = params.toString();
    return `/parlamento/iniciativas${s ? `?${s}` : ""}`;
  };

  const chip = (active: boolean) =>
    `pressable rounded-sm border px-3 py-1 text-sm whitespace-nowrap ${active ? "border-accent bg-accent-soft text-accent-strong" : "border-line text-muted hover:text-foreground"}`;

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
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="grid content-start gap-6">
              <form action="/parlamento/iniciativas" className="grid gap-2">
                <label htmlFor="q" className="text-sm font-medium">
                  Pesquisar
                </label>
                <input
                  id="q"
                  name="q"
                  defaultValue={filters.q}
                  placeholder="Palavra do título ou número"
                  className="rounded-sm border border-line bg-surface px-3 py-2 outline-none placeholder:text-muted focus:border-accent"
                />
                {filters.group !== "todas" && <input type="hidden" name="grupo" value={filters.group} />}
                {filters.status !== "todos" && <input type="hidden" name="estado" value={filters.status} />}
                {filters.party && <input type="hidden" name="partido" value={filters.party} />}
              </form>

              <div className="grid gap-2">
                <p className="text-sm font-medium">Tipo</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={href({ grupo: "" })} className={chip(filters.group === "todas")}>
                    Todas
                  </Link>
                  {Object.entries(TYPE_GROUPS).map(([k, g]) => (
                    <Link key={k} href={href({ grupo: k })} className={chip(filters.group === k)}>
                      {g.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-sm font-medium">Estado</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={href({ estado: "" })} className={chip(filters.status === "todos")}>
                    Todos
                  </Link>
                  {(Object.keys(STATUS_LABEL) as InitiativeStatus[]).map((s) => (
                    <Link key={s} href={href({ estado: s })} className={chip(filters.status === s)}>
                      {STATUS_LABEL[s]}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="grid gap-2">
                <p className="text-sm font-medium">Autor</p>
                <div className="flex flex-wrap gap-2">
                  <Link href={href({ partido: "" })} className={chip(!filters.party)}>
                    Todos
                  </Link>
                  {["Governo", ...(meta?.parties.map((p) => p.acronym) ?? [])].map((p) => (
                    <Link key={p} href={href({ partido: p })} className={chip(filters.party === p)}>
                      {p}
                    </Link>
                  ))}
                </div>
              </div>
            </aside>

            <section aria-live="polite">
              <p className="text-sm text-muted tabular">
                {num(result.total)} {result.total === 1 ? "iniciativa" : "iniciativas"}
                {result.pages > 1 && ` · página ${result.page} de ${result.pages}`}
              </p>
              {result.items.length === 0 ? (
                <div className="mt-4">
                  <EmptyState title="Nenhuma iniciativa com estes filtros">
                    <Link href="/parlamento/iniciativas" className="text-accent underline underline-offset-4">
                      Limpar filtros
                    </Link>
                  </EmptyState>
                </div>
              ) : (
                <ul className="mt-3 divide-y divide-line overflow-hidden rounded-sm border border-line bg-surface">
                  {result.items.map((i) => (
                    <InitiativeRow key={i.id} i={i} />
                  ))}
                </ul>
              )}
              {result.pages > 1 && (
                <nav className="mt-6 flex items-center justify-between text-sm" aria-label="Páginas">
                  {result.page > 1 ? (
                    <Link href={href({ pagina: String(result.page - 1) })} className="pressable rounded-sm border border-line px-3 py-1.5 hover:border-accent">
                      Anterior
                    </Link>
                  ) : (
                    <span />
                  )}
                  {result.page < result.pages && (
                    <Link href={href({ pagina: String(result.page + 1) })} className="pressable rounded-sm border border-line px-3 py-1.5 hover:border-accent">
                      Seguinte
                    </Link>
                  )}
                </nav>
              )}
            </section>
          </div>
        )}
      </Container>
    </>
  );
}
