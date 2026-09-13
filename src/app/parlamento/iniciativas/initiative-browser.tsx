"use client";

import Form from "next/form";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { InitiativeRow } from "@/components/parlamento";
import { EmptyState } from "@/components/ui";
import { num } from "@/lib/format";
import { filterInitiatives, NO_FILTERS, TYPE_GROUPS, type InitiativeFilters, type InitiativeListItem, type TypeGroup } from "@/lib/parlamento/filters";
import { STATUS_LABEL, type InitiativeStatus } from "@/lib/parlamento/types";
import { BASE_PATH } from "@/lib/site";

type Result = ReturnType<typeof filterInitiatives<InitiativeListItem>>;

const isDefault = (f: InitiativeFilters) => (Object.keys(NO_FILTERS) as (keyof InitiativeFilters)[]).every((k) => f[k] === NO_FILTERS[k]);

function filtersFrom(sp: URLSearchParams): InitiativeFilters {
  const group = sp.get("grupo") ?? "";
  const status = sp.get("estado") ?? "";
  return {
    group: group in TYPE_GROUPS ? (group as TypeGroup) : "todas",
    status: status in STATUS_LABEL ? (status as InitiativeStatus) : "todos",
    party: sp.get("partido") ?? "",
    q: (sp.get("q") ?? "").slice(0, 120),
    page: Number(sp.get("pagina")) || 1,
  };
}

/** The full list, fetched once per visit and only when a filter needs it. */
let listPromise: Promise<InitiativeListItem[]> | null = null;
function loadList() {
  listPromise ??= fetch(`${BASE_PATH}/parlamento/iniciativas/lista.json`).then((r) => {
    if (!r.ok) throw new Error(`HTTP ${r.status}`);
    return r.json() as Promise<InitiativeListItem[]>;
  });
  listPromise.catch(() => (listPromise = null));
  return listPromise;
}

/** Reads the filters from the address and filters the list in the browser. */
export function InitiativeBrowser({ initial, parties }: { initial: Result; parties: string[] }) {
  const filters = filtersFrom(useSearchParams());
  const needsList = !isDefault(filters);
  const [list, setList] = useState<InitiativeListItem[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!needsList || list) return;
    let live = true;
    loadList().then(
      (l) => live && setList(l),
      () => live && setFailed(true),
    );
    return () => {
      live = false;
    };
  }, [needsList, list]);

  const result = !needsList ? initial : list ? filterInitiatives(list, filters) : null;
  return <InitiativeList filters={filters} result={result} failed={failed} parties={parties} />;
}

export function InitiativeList({ filters, result, failed = false, parties }: { filters: InitiativeFilters; result: Result | null; failed?: boolean; parties: string[] }) {
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
    <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
      <aside className="grid content-start gap-6">
        <Form action="/parlamento/iniciativas" className="grid gap-2">
          <label htmlFor="q" className="text-sm font-medium">
            Pesquisar
          </label>
          <input
            key={filters.q}
            id="q"
            name="q"
            defaultValue={filters.q}
            placeholder="Palavra do título ou número"
            className="rounded-sm border border-line bg-surface px-3 py-2 outline-none placeholder:text-muted focus:border-accent"
          />
          {filters.group !== "todas" && <input type="hidden" name="grupo" value={filters.group} />}
          {filters.status !== "todos" && <input type="hidden" name="estado" value={filters.status} />}
          {filters.party && <input type="hidden" name="partido" value={filters.party} />}
        </Form>

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
            {["Governo", ...parties].map((p) => (
              <Link key={p} href={href({ partido: p })} className={chip(filters.party === p)}>
                {p}
              </Link>
            ))}
          </div>
        </div>
      </aside>

      <section aria-live="polite" aria-busy={!result && !failed}>
        {failed ? (
          <EmptyState title="Não foi possível carregar a lista">
            <Link href="/parlamento/iniciativas" className="text-accent underline underline-offset-4">
              Ver as iniciativas mais recentes
            </Link>
          </EmptyState>
        ) : !result ? (
          <p className="text-sm text-muted">A carregar as iniciativas…</p>
        ) : (
          <>
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
          </>
        )}
      </section>
    </div>
  );
}
