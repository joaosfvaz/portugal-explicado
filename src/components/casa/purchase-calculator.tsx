"use client";

import { useId, useState } from "react";
import { CheckCircle, WarningCircle } from "@phosphor-icons/react";
import { EuroInput, parseEuro } from "@/components/tax/bracket-calculator";
import { Choice, NumberField, ResultPanel, ResultRow, Toggle } from "@/components/forms/fields";
import { purchaseCosts } from "@/lib/casa/purchase";
import { BDP_2026 } from "@/lib/casa/rules-2026";
import { eur, pct } from "@/lib/format";

type AverageRate = { value: number; label: string };

/**
 * Simple mode asks only for the price, the savings for the down payment, the income and the age. It uses the
 * Banco de Portugal average rate for new loans, 30 years, Casa Pronta and no bank fees, and says so.
 */
export function PurchaseCalculator({ averageRate }: { averageRate?: AverageRate }) {
  const id = useId();
  const [simple, setSimple] = useState(true);
  const [savings, setSavings] = useState("40000");
  const [price, setPrice] = useState("280000");
  const [purpose, setPurpose] = useState<"hpp" | "secondary">("hpp");
  const [young, setYoung] = useState(false);
  const [nonResident, setNonResident] = useState(false);
  const [loan, setLoan] = useState("252000");
  const [rate, setRate] = useState("3,2");
  const [years, setYears] = useState("35");
  const [variable, setVariable] = useState(true);
  const [age, setAge] = useState("34");
  const [route, setRoute] = useState<"casa-pronta" | "separado">("casa-pronta");
  const [fees, setFees] = useState("800");
  const [income, setIncome] = useState("3200");
  const [debt, setDebt] = useState("0");

  const simpleRate = averageRate ? averageRate.value : parseEuro(rate);
  const simpleLoan = Math.max(0, parseEuro(price) - parseEuro(savings));
  const r = purchaseCosts({
    price: parseEuro(price),
    purpose,
    young,
    nonResident: simple ? false : nonResident,
    loan: simple ? simpleLoan : parseEuro(loan),
    annualRate: (simple ? simpleRate : parseEuro(rate)) / 100,
    years: simple ? 30 : Number(years) || 0,
    variableRate: simple ? true : variable,
    oldestBorrowerAge: Number(age) || 0,
    route: simple ? "casa-pronta" : route,
    bankFees: simple ? 0 : parseEuro(fees),
    netMonthlyIncome: parseEuro(income),
    otherMonthlyDebt: simple ? 0 : parseEuro(debt),
  });
  const shownYears = simple ? 30 : Number(years) || 0;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      <form className="grid content-start gap-6" onSubmit={(e) => e.preventDefault()}>
        <div role="radiogroup" aria-label="Tipo de simulação" className="grid grid-cols-2 rounded-sm border border-line bg-surface p-1 text-sm">
          {[
            { v: true, label: "Simples", help: "4 perguntas" },
            { v: false, label: "Completa", help: "Com os dados do banco" },
          ].map((o) => (
            <button key={o.label} type="button" role="radio" aria-checked={simple === o.v} onClick={() => setSimple(o.v)} className="rounded-sm px-3 py-2 text-left aria-checked:bg-accent aria-checked:text-on-accent">
              <span className="block font-semibold">{o.label}</span>
              <span className="block text-xs opacity-80">{o.help}</span>
            </button>
          ))}
        </div>

        {simple ? (
          <fieldset className="grid gap-5">
            <legend className="sr-only">Simulação simples</legend>
            <EuroInput id={`${id}-price-s`} label="Preço da casa" value={price} onChange={setPrice} />
            <EuroInput id={`${id}-savings`} label="Dinheiro que tem para a entrada" value={savings} onChange={setSavings} help="O resto é pedido ao banco." />
            <EuroInput id={`${id}-income-s`} label="Quanto a família recebe por mês, líquido" value={income} onChange={setIncome} />
            <NumberField id={`${id}-age-s`} label="Idade da pessoa mais velha que vai pedir o crédito" value={age} onChange={setAge} min={18} max={80} suffix="anos" />
            <Toggle id={`${id}-young-s`} label="Todos os compradores têm até 35 anos e é a primeira casa" checked={young} onChange={setYoung} />
            <p className="rounded-sm bg-sunken p-4 text-sm leading-relaxed text-muted">
              Para simplificar, usámos: casa para morar,{" "}
              {averageRate ? `a taxa de juro média dos novos créditos (${averageRate.label})` : `uma taxa de juro de ${rate}%`}, prazo de 30 anos, compra na Casa Pronta e sem comissões do banco. Pode mudar tudo na
              simulação completa.
            </p>
          </fieldset>
        ) : (
          <>
        <fieldset className="grid gap-5">
          <legend className="mb-1 text-lg font-semibold">A casa</legend>
          <EuroInput id={`${id}-price`} label="Preço da casa" value={price} onChange={setPrice} help="Os impostos usam o maior valor entre o preço e o valor patrimonial tributário." />
          <Choice
            label="Para que é a casa"
            value={purpose}
            onChange={setPurpose}
            options={[
              { id: "hpp", label: "Habitação própria e permanente", help: "Onde vai morar." },
              { id: "secondary", label: "Secundária ou para arrendar" },
            ]}
          />
          <Toggle id={`${id}-young`} label="Todos os compradores têm até 35 anos" checked={young} onChange={setYoung} help="Primeira casa própria, sem casa nos últimos 3 anos e sem ser dependente no IRS." />
          <Toggle id={`${id}-nr`} label="Comprador não residente em Portugal" checked={nonResident} onChange={setNonResident} help="IMT de 7,5% desde maio de 2026, com exceções." />
        </fieldset>

        <fieldset className="grid gap-5">
          <legend className="mb-1 text-lg font-semibold">O crédito</legend>
          <EuroInput id={`${id}-loan`} label="Valor do empréstimo" value={loan} onChange={setLoan} />
          <div className="grid gap-5 sm:grid-cols-2">
            <EuroInput id={`${id}-rate`} label="Taxa de juro anual (TAN), em %" value={rate} onChange={setRate} />
            <NumberField id={`${id}-years`} label="Prazo" value={years} onChange={setYears} min={1} max={50} suffix="anos" />
            <NumberField id={`${id}-age`} label="Idade do comprador mais velho" value={age} onChange={setAge} min={18} max={80} suffix="anos" />
            <EuroInput id={`${id}-fees`} label="Comissões do banco" value={fees} onChange={setFees} help="Avaliação, dossier e formalização. Cada banco define o seu valor." />
          </div>
          <Toggle id={`${id}-var`} label="Taxa variável ou mista" checked={variable} onChange={setVariable} help="O banco testa a prestação com mais 1,5 pontos na taxa." />
          <div className="grid gap-5 sm:grid-cols-2">
            <EuroInput id={`${id}-income`} label="Rendimento líquido mensal do agregado" value={income} onChange={setIncome} />
            <EuroInput id={`${id}-debt`} label="Outras prestações mensais" value={debt} onChange={setDebt} />
          </div>
          <Choice
            label="Onde faz a escritura e o registo"
            value={route}
            onChange={setRoute}
            options={[
              { id: "casa-pronta", label: "Casa Pronta", help: "Balcão que faz a compra e o registo num só ato." },
              { id: "separado", label: "Notário ou advogado + registo", help: "O custo do notário ou advogado não está incluído." },
            ]}
          />
        </fieldset>
          </>
        )}
      </form>

      <div className="grid content-start gap-4 lg:sticky lg:top-20">
        <ResultPanel>
          <p className="text-sm text-muted">Dinheiro necessário no dia da compra</p>
          <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{eur(r.cashNeeded)}</p>
          <p className="mt-1 text-muted tabular">
            {eur(r.downPayment)} de entrada + {eur(r.taxesAndFees)} de impostos e custos
          </p>
          <dl className="mt-5">
            <ResultRow label="IMT" value={eur(r.imt, 2)} />
            <ResultRow label="Imposto do Selo na compra (0,8%)" value={eur(r.seloPurchase, 2)} />
            <ResultRow label="Imposto do Selo no crédito (0,6%)" value={eur(r.seloLoan, 2)} />
            <ResultRow label={route === "casa-pronta" ? "Casa Pronta" : "Registo predial"} value={eur(r.registo, 2)} />
            <ResultRow label="Comissões + Imposto do Selo (4%)" value={eur(r.bankFees + r.seloFees, 2)} />
          </dl>
          {r.young && <p className="mt-3 text-sm text-accent-strong">Aplicámos as regras para jovens: isenção de IMT e dedução no Imposto do Selo até 330 539 €, e desconto no registo.</p>}
        </ResultPanel>

        <ResultPanel>
          <p className="text-sm text-muted">Prestação mensal estimada</p>
          <p className="mt-1 figures font-display text-4xl leading-none font-medium tracking-[-0.01em]">{eur(r.payment, 2)}</p>
          <p className="mt-1 text-sm text-muted">Sem seguros. Com o teste de esforço do banco: {eur(r.stressedPayment, 2)}.</p>
          <ul className="mt-4 grid gap-2.5 text-sm">
            <Check ok={r.checks.ltvOk} text={`Empréstimo de ${pct(r.checks.ltv, 0)} do valor da casa (limite ${pct(r.checks.ltvLimit, 0)})`} />
            <Check ok={r.checks.yearsOk} text={`Prazo de ${shownYears} anos (máximo ${r.checks.maxYears} para esta idade)`} />
            {r.checks.dsti !== null && <Check ok={Boolean(r.checks.dstiOk)} text={`Taxa de esforço de ${pct(r.checks.dsti, 0)} (limite ${pct(BDP_2026.dsti, 0)})`} />}
          </ul>
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Limites da recomendação do Banco de Portugal em vigor desde 1 de agosto de 2026. Cada banco pode ter critérios mais exigentes e até 10% dos créditos podem passar o limite da taxa de esforço.
          </p>
          {r.garantiaPublica && (
            <p className="mt-3 rounded-sm bg-accent-soft px-3 py-2 text-sm text-accent-strong">
              Pode ter acesso à garantia pública para jovens: o Estado garante até 15% do valor e o banco pode emprestar até 100%. O contrato tem de ser assinado até 31 de dezembro de 2026.
            </p>
          )}
        </ResultPanel>
      </div>
    </div>
  );
}

function Check({ ok, text }: { ok: boolean; text: string }) {
  const Icon = ok ? CheckCircle : WarningCircle;
  return (
    <li className="flex items-start gap-2">
      <Icon weight="fill" className={`mt-0.5 h-4 w-4 shrink-0 ${ok ? "text-accent" : "text-warn"}`} aria-label={ok ? "Dentro do limite" : "Acima do limite"} />
      <span>{text}</span>
    </li>
  );
}
