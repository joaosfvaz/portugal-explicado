"use client";

import { useId, useMemo, useState } from "react";
import { taxByBrackets, type Bracket } from "@/lib/tax/brackets";
import { eur, pct } from "@/lib/format";

export type YearBrackets = { year: number; brackets: Bracket[] };

const PRESETS = [10_000, 20_000, 35_000, 60_000];

export function YearSwitch({ years, value, onChange }: { years: number[]; value: number; onChange: (y: number) => void }) {
  return (
    <div role="radiogroup" aria-label="Ano" className="inline-flex w-fit justify-self-start rounded-sm bg-sunken p-1">
      {years.map((y) => (
        <button
          key={y}
          type="button"
          role="radio"
          aria-checked={value === y}
          onClick={() => onChange(y)}
          className={`pressable rounded-sm px-3 py-1.5 text-sm font-medium tabular ${
            value === y ? "bg-surface text-foreground shadow-[0_1px_2px_rgb(20_23_26/0.08)]" : "text-muted hover:text-foreground"
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  );
}

export function EuroInput({
  id,
  label,
  value,
  onChange,
  help,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
}) {
  return (
    <div className="grid content-start gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center rounded-sm border border-line bg-surface focus-within:border-accent">
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          value={value}
          onChange={(e) => onChange(e.target.value.replace(/[^\d.,\s]/g, ""))}
          className="w-full bg-transparent px-4 py-3 text-lg font-medium tabular outline-none"
          aria-describedby={help ? `${id}-help` : undefined}
        />
        <span className="pr-4 text-muted">€</span>
      </div>
      {help && (
        <p id={`${id}-help`} className="text-sm text-muted">
          {help}
        </p>
      )}
    </div>
  );
}

export const parseEuro = (v: string) => {
  const n = Number(v.replace(/\s/g, "").replace(/\./g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
};

export function BracketCalculator({ years }: { years: YearBrackets[] }) {
  const id = useId();
  const [year, setYear] = useState(years[0].year);
  const [raw, setRaw] = useState("25000");
  const income = parseEuro(raw);
  const brackets = years.find((y) => y.year === year)!.brackets;
  const result = useMemo(() => taxByBrackets(income, brackets), [income, brackets]);
  const net = income - result.tax;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <div className="grid content-start gap-6">
        <div className="grid gap-2">
          <span className="text-sm font-medium">Ano do rendimento</span>
          <YearSwitch years={years.map((y) => y.year)} value={year} onChange={setYear} />
        </div>
        <EuroInput
          id={`${id}-income`}
          label="Rendimento coletável anual"
          value={raw}
          onChange={setRaw}
          help="O rendimento depois da dedução específica. Para salários, é o bruto anual menos a dedução específica."
        />
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setRaw(String(p))}
              className="pressable rounded-sm border border-line px-3 py-1 text-sm text-muted hover:border-accent hover:text-foreground tabular"
            >
              {eur(p)}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-sm border border-line bg-surface p-6" aria-live="polite">
        <div key={year} className="result-enter">
          <p className="text-sm text-muted">Imposto pelas taxas gerais</p>
          <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{eur(result.tax, 2)}</p>
          <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-line pt-5 text-sm">
            <div>
              <dt className="text-muted">Taxa média</dt>
              <dd className="mt-1 text-lg font-semibold tabular">{pct(result.averageRate, 2)}</dd>
            </div>
            <div>
              <dt className="text-muted">Taxa marginal</dt>
              <dd className="mt-1 text-lg font-semibold tabular">{pct(result.marginalRate, 1)}</dd>
            </div>
            <div>
              <dt className="text-muted">Fica disponível</dt>
              <dd className="mt-1 text-lg font-semibold tabular">{eur(net)}</dd>
            </div>
          </dl>
        </div>

        <SliceBar slices={result.slices} income={result.income} />

        <table className="mt-6 w-full text-sm tabular">
          <thead>
            <tr className="text-left text-muted">
              <th className="pb-2 font-normal">Escalão</th>
              <th className="pb-2 text-right font-normal">Parte do rendimento</th>
              <th className="pb-2 text-right font-normal">Taxa</th>
              <th className="pb-2 text-right font-normal">Imposto</th>
            </tr>
          </thead>
          <tbody>
            {result.slices.map((s) => (
              <tr key={s.index} className="border-t border-line">
                <td className="py-2">{s.index + 1}.º</td>
                <td className="py-2 text-right">{eur(s.taxedAmount, 2)}</td>
                <td className="py-2 text-right">{pct(s.rate, 1)}</td>
                <td className="py-2 text-right font-medium">{eur(s.tax, 2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SliceBar({ slices, income }: { slices: { index: number; taxedAmount: number; rate: number }[]; income: number }) {
  if (income <= 0) return null;
  return (
    <div className="mt-6">
      <div className="flex h-3 overflow-hidden rounded-sm bg-sunken" aria-hidden>
        {slices.map((s) => (
          <div
            key={s.index}
            style={{
              width: `${(s.taxedAmount / income) * 100}%`,
              opacity: 0.35 + (s.index / 9) * 0.65,
            }}
            className="h-full bg-accent [&:not(:last-child)]:border-r-2 [&:not(:last-child)]:border-surface"
          />
        ))}
      </div>
      <p className="mt-2 text-xs text-muted">Cada parte do rendimento paga a taxa do seu escalão. A cor mais escura corresponde a uma taxa mais alta.</p>
    </div>
  );
}
