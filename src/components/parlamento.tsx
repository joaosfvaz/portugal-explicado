import Link from "next/link";
import { Badge } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { progressLabel } from "@/lib/parlamento/explain";
import type { InitiativeListItem } from "@/lib/parlamento/filters";
import { STATUS_LABEL, type InitiativeStatus, type InitiativeSummary, type ParlamentoMeta } from "@/lib/parlamento/types";

const STATUS_TONE: Record<InitiativeStatus, "neutral" | "good" | "warn" | "bad"> = {
  "em-curso": "neutral",
  aprovada: "good",
  publicada: "good",
  rejeitada: "bad",
  vetada: "warn",
  retirada: "neutral",
  "nao-admitida": "neutral",
};

export function StatusBadge({ status }: { status: InitiativeStatus }) {
  return <Badge tone={STATUS_TONE[status]}>{STATUS_LABEL[status]}</Badge>;
}

export function authorLabel(i: Pick<InitiativeSummary, "authors" | "authorParties">) {
  if (i.authors.some((a) => a.name === "Governo")) return "Governo";
  if (i.authorParties.length) return i.authorParties.join(", ");
  return i.authors.map((a) => a.name).join(", ") || "Autor não indicado";
}

export function InitiativeRow({ i }: { i: InitiativeListItem }) {
  return (
    <li>
      <Link href={`/parlamento/iniciativas/${i.id}`} className="group grid gap-2 px-5 py-4 transition-colors hover:bg-sunken sm:grid-cols-[1fr_auto] sm:gap-6">
        <div className="min-w-0">
          <p className="text-sm text-muted">
            {i.type} n.º {i.number} · {authorLabel(i)}
          </p>
          <p className="mt-1 font-medium leading-snug text-pretty group-hover:text-accent">{i.title}</p>
          {progressLabel(i) && <p className="mt-1.5 text-sm text-muted">{progressLabel(i)}</p>}
        </div>
        <div className="flex items-center gap-3 text-sm text-muted sm:flex-col sm:items-end sm:gap-1.5">
          <StatusBadge status={i.status} />
          <span className="tabular whitespace-nowrap">{i.lastDate ? formatDate(i.lastDate) : ""}</span>
        </div>
      </Link>
    </li>
  );
}

/** Seat distribution as a single proportional bar. Same colour for every party, ordered by seats. */
export function SeatBar({ parties }: { parties: ParlamentoMeta["parties"] }) {
  const total = parties.reduce((s, p) => s + p.seats, 0);
  return (
    <div>
      <div className="flex h-10 gap-0.5 overflow-hidden rounded-sm" role="img" aria-label={parties.map((p) => `${p.acronym} ${p.seats}`).join(", ")}>
        {parties.map((p, idx) => (
          <div
            key={p.acronym}
            className="flex min-w-0 items-center justify-center bg-accent text-xs font-semibold text-on-accent"
            style={{ width: `${(p.seats / total) * 100}%`, opacity: 1 - (idx / parties.length) * 0.55 }}
            title={`${p.name}: ${p.seats} deputados`}
          >
            {p.seats / total > 0.06 ? p.acronym : ""}
          </div>
        ))}
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3 lg:grid-cols-5">
        {parties.map((p) => (
          <li key={p.acronym} className="flex items-baseline justify-between gap-2 tabular">
            <span className="truncate" title={p.name}>
              {p.acronym}
            </span>
            <span className="font-semibold">{p.seats}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function DataFreshness({ meta }: { meta: Pick<ParlamentoMeta, "importedAt" | "sourceUpdatedUpTo"> }) {
  return (
    <p className="text-sm text-muted">
      Dados do Parlamento importados em {formatDate(meta.importedAt)}
      {meta.sourceUpdatedUpTo && <>. Último movimento registado: {formatDate(meta.sourceUpdatedUpTo)}</>}.
    </p>
  );
}
