"use client";

import { useId, useState } from "react";
import { EuroInput, parseEuro } from "@/components/tax/bracket-calculator";
import { NumberField, ResultPanel, ResultRow, Toggle } from "@/components/forms/fields";
import { desemprego } from "@/lib/beneficios/desemprego";
import { RMMG_2026 } from "@/lib/beneficios/rules-2026";
import { eur, num } from "@/lib/format";

export function DesempregoCalculator() {
  const id = useId();
  const [salary, setSalary] = useState("1400");
  const [age, setAge] = useState("34");
  const [months, setMonths] = useState("36");
  const [last24, setLast24] = useState("24");
  const [blocks, setBlocks] = useState("0");
  const [bonus, setBonus] = useState(false);

  const r = desemprego({
    monthlySalary: parseEuro(salary),
    age: Number(age) || 0,
    monthsContributed: Number(months) || 0,
    monthsInLast24: Number(last24) || 0,
    fiveYearBlocks: Number(blocks) || 0,
    bonus,
    rmmg: RMMG_2026,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <form className="grid content-start gap-5" onSubmit={(e) => e.preventDefault()}>
        <EuroInput id={`${id}-sal`} label="Salário bruto mensal" value={salary} onChange={setSalary} help="Salário base pago 14 vezes por ano. Os subsídios de férias e de Natal contam." />
        <div className="grid gap-5 sm:grid-cols-2">
          <NumberField id={`${id}-age`} label="Idade" value={age} onChange={setAge} min={16} max={70} suffix="anos" />
          <NumberField id={`${id}-last`} label="Meses com descontos nos últimos 24" value={last24} onChange={setLast24} min={0} max={24} />
          <NumberField id={`${id}-months`} label="Meses com descontos (para a duração)" value={months} onChange={setMonths} min={0} max={600} />
          <NumberField id={`${id}-blocks`} label="Blocos de 5 anos com descontos nos últimos 20" value={blocks} onChange={setBlocks} min={0} max={4} />
        </div>
        <Toggle id={`${id}-bonus`} label="Majoração de 10%" checked={bonus} onChange={setBonus} help="Casal desempregado com filhos a cargo, ou família monoparental." />
      </form>

      <ResultPanel>
        {!r.eligible ? (
          <>
            <p className="text-sm text-muted">Resultado</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight">Sem prazo de garantia</p>
            <p className="mt-2 leading-relaxed text-muted">São precisos pelo menos 360 dias (12 meses) de trabalho com descontos nos 24 meses antes do desemprego. Pode ter direito ao subsídio social de desemprego, que tem regras diferentes.</p>
          </>
        ) : (
          <>
            <p className="text-sm text-muted">Estimativa do subsídio mensal</p>
            <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{eur(r.monthly, 2)}</p>
            <p className="mt-1 text-muted tabular">Durante cerca de {num(r.days)} dias ({num(Math.round(r.days / 30))} meses)</p>
            <dl className="mt-5">
              <ResultRow label="Remuneração de referência mensal" value={eur(r.referenceMonthly, 2)} />
              <ResultRow label={`65% da referência${bonus ? " + 10%" : ""}`} value={eur(r.computed, 2)} />
              {r.appliedLimit === "minimum" && <ResultRow label="Subiu para o valor mínimo" value={eur(r.monthly, 2)} />}
              {r.appliedLimit === "maximum" && <ResultRow label="Limitado ao valor máximo" value={eur(r.monthly, 2)} />}
            </dl>
            <p className="mt-4 rounded-sm bg-sunken px-3 py-2 text-sm leading-relaxed text-muted">
              O subsídio também não pode passar 75% do valor líquido da remuneração de referência, depois de descontos e retenção de IRS. Com salários altos, o valor real pode ser menor.
            </p>
          </>
        )}
      </ResultPanel>
    </div>
  );
}
