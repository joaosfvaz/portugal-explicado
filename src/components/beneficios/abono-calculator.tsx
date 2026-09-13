"use client";

import { useId, useState } from "react";
import { EuroInput, parseEuro } from "@/components/tax/bracket-calculator";
import { Choice, NumberField, ResultPanel, ResultRow, Toggle } from "@/components/forms/fields";
import { abono } from "@/lib/beneficios/abono";
import { IAS } from "@/lib/beneficios/rules-2026";
import { eur } from "@/lib/format";

type Scenario = "novo" | "atual";

export function AbonoCalculator() {
  const id = useId();
  const [scenario, setScenario] = useState<Scenario>("novo");
  const [income, setIncome] = useState("15000");
  const [children, setChildren] = useState("1");
  const [age, setAge] = useState("24");
  const [single, setSingle] = useState(false);

  const incomeYear = scenario === "novo" ? 2025 : 2024;
  const r = abono({ householdIncome: parseEuro(income), children: Number(children) || 1, childAgeMonths: Number(age) || 0, singleParent: single, ias: IAS[incomeYear] });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <form className="grid content-start gap-5" onSubmit={(e) => e.preventDefault()}>
        <Choice
          label="Situação"
          value={scenario}
          onChange={setScenario}
          options={[
            { id: "novo", label: "Pedido novo em 2026", help: "Conta o rendimento de 2025." },
            { id: "atual", label: "Já recebe abono", help: "Conta o rendimento de 2024." },
          ]}
        />
        <EuroInput id={`${id}-inc`} label={`Rendimento anual do agregado em ${incomeYear}`} value={income} onChange={setIncome} help="Soma dos rendimentos brutos de todas as pessoas do agregado familiar." />
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField id={`${id}-kids`} label="Crianças e jovens com direito" value={children} onChange={setChildren} min={1} max={12} />
          <NumberField id={`${id}-age`} label="Idade desta criança" value={age} onChange={setAge} min={0} max={300} suffix="meses" />
        </div>
        <Toggle id={`${id}-single`} label="Família monoparental" checked={single} onChange={setSingle} help="Acresce 50% ao valor do abono." />
      </form>

      <ResultPanel>
        <p className="text-sm text-muted">Estimativa mensal para esta criança</p>
        <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{r.escalao ? eur(r.monthly + r.garantia, 2) : "Sem direito"}</p>
        <p className="mt-1 text-muted">{r.escalao ? `${r.escalao}.º escalão` : "O rendimento de referência está acima do 4.º escalão."}</p>
        <dl className="mt-5">
          <ResultRow label="Rendimento de referência" value={eur(r.referenceIncome, 2)} />
          {r.escalao && <ResultRow label="Abono base" value={eur(r.base, 2)} />}
          {r.singleParentBonus > 0 && <ResultRow label="Majoração monoparental" value={eur(r.singleParentBonus, 2)} />}
          {r.garantia > 0 && <ResultRow label="Garantia para a Infância" value={eur(r.garantia, 2)} />}
        </dl>
        {r.escalao === 4 && Number(age) > 72 && <p className="mt-3 rounded-sm bg-warn-soft px-3 py-2 text-sm text-warn">No 4.º escalão, o abono só é pago até aos 72 meses.</p>}
        <details className="mt-5 text-sm">
          <summary className="cursor-pointer font-medium">Limites dos escalões ({incomeYear})</summary>
          <dl className="mt-2">
            {r.limits.map((l, i) => (
              <ResultRow key={l} label={`${i + 1}.º escalão até`} value={eur(l, 2)} />
            ))}
          </dl>
          <p className="mt-2 leading-relaxed text-muted">
            Rendimento de referência = rendimento anual do agregado ÷ (número de crianças e jovens com direito + 1). É também preciso que o património mobiliário do agregado não passe 128 911,20 €.
          </p>
        </details>
      </ResultPanel>
    </div>
  );
}
