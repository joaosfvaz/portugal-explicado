"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { EuroInput, parseEuro } from "@/components/tax/bracket-calculator";
import { Choice, NumberField, ResultPanel, ResultRow } from "@/components/forms/fields";
import { eur, pct } from "@/lib/format";
import { netSalary, type Household } from "@/lib/trabalho/salario";

export function SalaryCalculator() {
  const id = useId();
  const [gross, setGross] = useState("1200");
  const [household, setHousehold] = useState<Household>("nao-casado");
  const [dependents, setDependents] = useState("0");
  const [meal, setMeal] = useState(false);
  const [mealPerDay, setMealPerDay] = useState("6,15");
  const [mealDays, setMealDays] = useState("22");
  const [mealPaidBy, setMealPaidBy] = useState<"dinheiro" | "cartao">("cartao");
  const [details, setDetails] = useState(false);

  const r = netSalary({
    gross: parseEuro(gross),
    household,
    dependents: Number(dependents) || 0,
    mealPerDay: meal ? parseEuro(mealPerDay) : 0,
    mealDays: meal ? Number(mealDays) || 0 : 0,
    mealPaidBy,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <form className="grid content-start gap-5" onSubmit={(e) => e.preventDefault()}>
        <EuroInput id={`${id}-gross`} label="Salário bruto por mês" value={gross} onChange={setGross} help="O salário base do contrato, antes dos descontos. Está no recibo como vencimento base." />
        <Choice
          label="Situação familiar"
          value={household}
          onChange={setHousehold}
          options={[
            { id: "nao-casado", label: "Solteiro, divorciado ou viúvo" },
            { id: "casado-dois", label: "Casado, os dois ganham" },
            { id: "casado-um", label: "Casado, só eu ganho", help: "O outro não tem salário nem pensão." },
          ]}
        />
        <NumberField id={`${id}-deps`} label="Filhos ou outros dependentes" value={dependents} onChange={setDependents} min={0} max={12} />

        <fieldset className="grid gap-3 rounded-sm border border-line bg-surface p-4">
          <legend className="px-1 text-sm font-medium">Subsídio de refeição</legend>
          <label className="flex cursor-pointer items-center gap-3">
            <input type="checkbox" checked={meal} onChange={(e) => setMeal(e.target.checked)} className="h-4 w-4 accent-[var(--accent)]" />
            <span>Recebo subsídio de refeição</span>
          </label>
          {meal && (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <EuroInput id={`${id}-meal`} label="Valor por dia" value={mealPerDay} onChange={setMealPerDay} />
                <NumberField id={`${id}-days`} label="Dias de trabalho no mês" value={mealDays} onChange={setMealDays} min={0} max={31} suffix="dias" />
              </div>
              <Choice
                label="Como é pago"
                value={mealPaidBy}
                onChange={setMealPaidBy}
                options={[
                  { id: "cartao", label: "Cartão ou vales", help: "Sem descontos até 10,46 € por dia." },
                  { id: "dinheiro", label: "Junto com o salário", help: "Sem descontos até 6,15 € por dia." },
                ]}
              />
            </>
          )}
        </fieldset>
      </form>

      <ResultPanel>
        <p className="text-sm text-muted">Recebe na conta, por mês</p>
        <p className="figures mt-1 font-display text-6xl leading-none font-medium tracking-[-0.01em]">{eur(r.net, 2)}</p>
        <p className="mt-3 leading-relaxed">
          De cada 100 € de salário bruto, ficam cerca de {Math.round((r.net / Math.max(r.taxableBase + r.mealExempt, 1)) * 100)} € para si. O resto vai para a Segurança Social e para o IRS.
        </p>

        <dl className="mt-5">
          <ResultRow label="Salário bruto" value={eur(parseEuro(gross), 2)} />
          {r.mealTotal > 0 && <ResultRow label="Subsídio de refeição" value={eur(r.mealTotal, 2)} />}
          <ResultRow label="Segurança Social (11%)" value={`− ${eur(r.socialSecurity, 2)}`} />
          <ResultRow label={`IRS retido (${pct(r.irsEffectiveRate, 1)})`} value={`− ${eur(r.irs, 2)}`} />
          <ResultRow label="Líquido" value={eur(r.net, 2)} strong />
        </dl>

        <div className="mt-5 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          <div className="bg-surface p-4">
            <p className="text-sm text-muted">Nos meses com subsídio de férias ou de Natal</p>
            <p className="figures mt-1 font-display text-3xl font-medium">{eur(r.netWithSubsidy, 2)}</p>
            <p className="mt-1 text-xs text-muted">Se recebe os subsídios aos bocados, em duodécimos, este valor não se aplica.</p>
          </div>
          <div className="bg-surface p-4">
            <p className="text-sm text-muted">No ano inteiro, com os 2 subsídios</p>
            <p className="figures mt-1 font-display text-3xl font-medium">{eur(r.netYear, 0)}</p>
            {r.mealTotal > 0 && <p className="mt-1 text-xs text-muted">Conta o subsídio de refeição em 11 meses: 12 menos um mês de férias.</p>}
          </div>
        </div>

        <button type="button" onClick={() => setDetails((d) => !d)} aria-expanded={details} className="mt-5 text-sm font-medium text-accent underline underline-offset-4">
          {details ? "Esconder as contas" : "Ver as contas"}
        </button>
        {details && (
          <dl className="mt-3 text-sm">
            <ResultRow label="Tabela de retenção usada" value={`Tabela ${r.table}`} />
            <ResultRow label="Valor que conta para descontos" value={eur(r.taxableBase, 2)} />
            {r.mealTotal > 0 && <ResultRow label="Refeição sem descontos" value={eur(r.mealExempt, 2)} />}
            {r.mealTaxable > 0 && <ResultRow label="Refeição acima do limite, com descontos" value={eur(r.mealTaxable, 2)} />}
            <ResultRow label="Taxa do escalão da tabela" value={pct(Number(dependents) >= 3 && r.row.rate > 0 ? r.row.rate - 0.01 : r.row.rate, 2)} />
            <ResultRow label="O patrão paga à Segurança Social (23,75%)" value={eur(r.employerSocialSecurity, 2)} />
            <ResultRow label="Custo total para o patrão, por mês" value={eur(r.employerCost, 2)} />
          </dl>
        )}

        <p className="mt-5 text-sm leading-relaxed text-muted">
          O IRS retido todos os meses é um adiantamento. O IRS final do ano pode dar reembolso ou pagamento. Veja{" "}
          <Link href="/impostos/como-funciona-o-irs" className="font-medium text-accent">
            como funciona o IRS
          </Link>
          .
        </p>
      </ResultPanel>
    </div>
  );
}
