import type { ReactNode } from "react";

export type ExampleRow = { label: string; value: string; strong?: boolean };

/** A calculation shown line by line, with the assumptions first and the conclusion last. */
export function WorkedExample({ title, assumptions, rows, result }: { title: string; assumptions: string[]; rows: ExampleRow[]; result: ReactNode }) {
  return (
    <article className="rounded-sm border border-line bg-surface">
      <header className="border-b border-line p-5">
        <h3 className="font-display text-2xl leading-tight font-medium">{title}</h3>
        <ul className="mt-2 grid gap-1 text-sm text-muted">
          {assumptions.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
      </header>
      <dl className="divide-y divide-line text-sm">
        {rows.map((r) => (
          <div key={r.label} className={`flex items-baseline justify-between gap-4 px-5 py-2.5 ${r.strong ? "bg-sunken font-semibold" : ""}`}>
            <dt className={r.strong ? "" : "text-muted"}>{r.label}</dt>
            <dd className="text-right whitespace-nowrap tabular">{r.value}</dd>
          </div>
        ))}
      </dl>
      <p className="border-t border-line bg-accent-soft px-5 py-4 leading-relaxed">{result}</p>
    </article>
  );
}
