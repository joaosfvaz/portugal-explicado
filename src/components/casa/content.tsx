import type { ReactNode } from "react";
import { Glossed } from "@/components/glossary/glossed";

export function Section({ title, lead, children, id }: { title: string; lead?: string; children: ReactNode; id?: string }) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="font-display text-3xl leading-tight font-medium tracking-[-0.01em]">{title}</h2>
      {lead && <p className="mt-1 max-w-[70ch] text-muted"><Glossed>{lead}</Glossed></p>}
      <div className="mt-5">{children}</div>
    </section>
  );
}

/** `text` lays every column out as prose (left aligned) instead of right-aligned figures. */
export function RuleTable({ head, rows, text = false }: { head: string[]; rows: ReactNode[][]; text?: boolean }) {
  return (
    <>
    {/* Phones: one card per row, with the column name next to each value. */}
    <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:hidden">
      {rows.map((r, i) => (
        <li key={i} className="bg-surface p-4">
          <div className="font-medium">{r[0]}</div>
          <dl className="mt-2 grid gap-1.5 text-sm">
            {r.slice(1).map((c, j) => (
              <div key={j} className="grid grid-cols-[minmax(0,2fr)_minmax(0,3fr)] gap-3">
                <dt className="text-muted">{head[j + 1]}</dt>
                <dd className={text ? "" : "text-right font-medium tabular"}>{c}</dd>
              </div>
            ))}
          </dl>
        </li>
      ))}
    </ul>
    <div className="hidden overflow-x-auto rounded-sm border border-line bg-surface sm:block">
      <table className="w-full min-w-[560px] text-sm">
        <thead>
          <tr className="border-b border-line text-left text-xs text-muted">
            {head.map((h, i) => (
              <th key={i} className={`px-5 py-2 font-medium ${i > 0 && !text ? "text-right" : ""}`}>
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-line last:border-0">
              {r.map((c, j) => (
                <td key={j} className={`px-5 py-3 align-top ${text ? (j === 0 ? "" : "text-muted leading-relaxed") : j > 0 ? "text-right font-medium tabular" : "text-muted"}`}>
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </>
  );
}

export function Steps({ items }: { items: { title: string; body: ReactNode; meta?: string }[] }) {
  return (
    <ol className="grid gap-3">
      {items.map((s, i) => (
        <li key={i} className="grid grid-cols-[36px_1fr] gap-3 rounded-sm border border-line bg-surface p-4">
          <span className="grid h-8 w-8 place-items-center rounded-sm border border-accent/30 bg-accent-soft font-display text-lg font-medium text-accent-strong figures">{i + 1}</span>
          <div>
            <p className="flex flex-wrap items-baseline justify-between gap-x-3 font-semibold">
              {s.title}
              {s.meta && <span className="text-sm font-normal text-muted">{s.meta}</span>}
            </p>
            <div className="mt-1 max-w-[70ch] leading-relaxed text-muted">{typeof s.body === "string" ? <Glossed>{s.body}</Glossed> : s.body}</div>
          </div>
        </li>
      ))}
    </ol>
  );
}

export function FactGrid({ items }: { items: { label: string; value: string; note?: string }[] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((f) => (
        <div key={f.label} className="rounded-sm border border-line bg-surface p-4">
          <dt className="text-sm text-muted">{f.label}</dt>
          <dd className="mt-1 text-lg font-semibold tracking-tight">{f.value}</dd>
          {f.note && <dd className="mt-1 text-xs leading-relaxed text-muted"><Glossed>{f.note}</Glossed></dd>}
        </div>
      ))}
    </dl>
  );
}
