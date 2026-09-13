"use client";

import { useId, useState } from "react";
import type { Bracket } from "@/lib/tax/brackets";
import { irsJovem, type IrsJovemRules } from "@/lib/tax/irs-jovem";
import { eur, pct } from "@/lib/format";
import { EuroInput, parseEuro, YearSwitch } from "./bracket-calculator";

export type JovemYearData = {
  year: number;
  rules: IrsJovemRules;
  brackets: Bracket[];
  deducaoEspecifica: number;
};

const REASONS = {
  age: "O IRS Jovem aplica-se até aos 35 anos, contados a 31 de dezembro do ano do rendimento.",
  "not-started": "O primeiro ano de rendimentos é posterior ao ano escolhido.",
  "period-ended": "Já passaram os 10 anos de obtenção de rendimentos que o regime cobre.",
  invalid: "Verifique os anos indicados. Os anos que não contam não podem ser mais do que os anos decorridos.",
} as const;

function YearField({ id, label, value, onChange, help, min, max }: { id: string; label: string; value: string; onChange: (v: string) => void; help?: string; min?: number; max?: number }) {
  return (
    <div className="grid content-start gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-sm border border-line bg-surface px-4 py-3 text-lg font-medium tabular outline-none focus:border-accent"
        aria-describedby={help ? `${id}-help` : undefined}
      />
      {help && (
        <p id={`${id}-help`} className="text-sm text-muted">
          {help}
        </p>
      )}
    </div>
  );
}

export function IrsJovemChecker({ years }: { years: JovemYearData[] }) {
  const id = useId();
  const [year, setYear] = useState(years[0].year);
  const [birth, setBirth] = useState("1998");
  const [first, setFirst] = useState("2021");
  const [skipped, setSkipped] = useState("0");
  const [raw, setRaw] = useState("24000");

  const data = years.find((y) => y.year === year)!;
  const income = parseEuro(raw);
  const input = {
    taxYear: year,
    birthYear: Number(birth),
    firstIncomeYear: Number(first),
    yearsNotCounted: Number(skipped) || 0,
    income,
  };
  const complete = birth.length === 4 && first.length === 4;
  const result = complete ? irsJovem(input, data.rules) : null;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
      <form className="grid content-start gap-6" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-2">
          <span className="text-sm font-medium">Ano do rendimento</span>
          <YearSwitch years={years.map((y) => y.year)} value={year} onChange={setYear} />
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
          <YearField id={`${id}-birth`} label="Ano de nascimento" value={birth} onChange={setBirth} min={1950} max={year} />
          <YearField
            id={`${id}-first`}
            label="Primeiro ano com rendimentos"
            value={first}
            onChange={setFirst}
            min={1970}
            max={year + 5}
            help="Como sujeito passivo, não como dependente."
          />
        </div>
        <YearField
          id={`${id}-skip`}
          label="Anos que não contam desde então"
          value={skipped}
          onChange={setSkipped}
          min={0}
          max={20}
          help="Anos sem rendimentos de trabalho, anos como dependente ou anos sem obrigação de entregar a declaração."
        />
        <EuroInput id={`${id}-income`} label="Rendimento bruto anual (categorias A e B)" value={raw} onChange={setRaw} />
      </form>

      <div className="rounded-sm border border-line bg-surface p-6" aria-live="polite">
        {!result && <p className="text-muted">Indique o ano de nascimento e o primeiro ano com rendimentos.</p>}

        {result && !result.eligible && (
          <div key={`no-${result.reason}`} className="result-enter">
            <p className="text-sm text-muted">Resultado para {year}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">Sem direito ao IRS Jovem</p>
            <p className="mt-3 max-w-[60ch] leading-relaxed text-muted">{REASONS[result.reason]}</p>
            {result.reason !== "invalid" && (
              <p className="mt-4 text-sm text-muted tabular">
                Idade a 31 de dezembro: {result.age} anos. Ano de rendimentos: {result.incomeYear}.º.
              </p>
            )}
          </div>
        )}

        {result?.eligible && (
          <div key={`${year}-${result.incomeYear}`} className="result-enter">
            <p className="text-sm text-muted">Resultado para {year}</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">
              Tem direito a {pct(result.exemptionRate, 0)} de isenção
            </p>
            <p className="mt-2 text-muted tabular">
              {result.incomeYear}.º ano de rendimentos, {result.age} anos a 31 de dezembro.
            </p>

            <dl className="mt-6 grid gap-4 border-t border-line pt-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-muted">Rendimento isento</dt>
                <dd className="mt-1 text-lg font-semibold tabular">{eur(result.exemptIncome, 2)}</dd>
              </div>
              <div>
                <dt className="text-muted">Rendimento não isento</dt>
                <dd className="mt-1 text-lg font-semibold tabular">{eur(result.taxableIncome, 2)}</dd>
              </div>
              <div>
                <dt className="text-muted">Limite anual da isenção</dt>
                <dd className="mt-1 text-lg font-semibold tabular">{eur(data.rules.cap, 2)}</dd>
              </div>
            </dl>

            {result.capApplied && (
              <p className="mt-4 rounded-sm bg-warn-soft px-3 py-2 text-sm text-warn">
                A isenção atingiu o limite anual de {eur(data.rules.cap, 2)} (55 vezes o IAS).
              </p>
            )}

            <Timeline rules={data.rules} current={result.incomeYear} />

            <details className="mt-6 text-sm">
              <summary className="cursor-pointer font-medium">Porque não mostramos a poupança em euros</summary>
              <div className="mt-3 space-y-2 leading-relaxed text-muted">
                <p>
                  O rendimento isento é a percentagem do ano aplicada ao rendimento bruto, com o limite de 55 vezes o IAS. Este valor segue a lei e o
                  folheto da Autoridade Tributária.
                </p>
                <p>
                  O imposto que deixa de pagar depende do mínimo de existência, da dedução específica, das deduções à coleta e da tributação conjunta.
                  O rendimento isento também conta para definir a taxa. Sem estes elementos, um valor em euros pode estar errado em centenas de euros,
                  sobretudo em salários baixos. O simulador completo de IRS vai calcular este valor.
                </p>
              </div>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}

function Timeline({ rules, current }: { rules: IrsJovemRules; current: number }) {
  return (
    <div className="mt-6">
      <p className="text-sm font-medium">Os 10 anos do regime</p>
      <ol className="mt-3 grid grid-cols-10 gap-1" aria-label="Percentagem de isenção por ano de rendimentos">
        {rules.exemptionByIncomeYear.map((rate, i) => {
          const n = i + 1;
          const state = n < current ? "past" : n === current ? "current" : "future";
          return (
            <li key={n} className="grid gap-1 text-center">
              <div className="flex h-16 items-end rounded-sm bg-sunken">
                <div
                  className={`w-full rounded-sm ${state === "current" ? "bg-accent" : state === "past" ? "bg-muted/30" : "bg-accent/35"}`}
                  style={{ height: `${rate * 100}%` }}
                />
              </div>
              <span className={`text-[11px] leading-tight tabular ${state === "current" ? "font-semibold text-foreground" : "text-muted"}`}>
                {n}.º
                <span className="block text-[10px] font-normal text-muted">{pct(rate, 0)}</span>
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
