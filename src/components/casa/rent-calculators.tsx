"use client";

import { useId, useState } from "react";
import { EuroInput, parseEuro } from "@/components/tax/bracket-calculator";
import { NumberField, ResultPanel, ResultRow, Toggle } from "@/components/forms/fields";
import { landlordTax, tenantDeduction, updatedRent } from "@/lib/casa/rent";
import { RENT_COEFFICIENTS, RENT_TAX_2026 } from "@/lib/casa/rules-2026";
import { eur, pct } from "@/lib/format";

export function RentUpdateCalculator() {
  const id = useId();
  const [rent, setRent] = useState("850");
  const [selected, setSelected] = useState<number[]>([2026]);
  const coefficients = RENT_COEFFICIENTS.filter((c) => selected.includes(c.year));
  const next = updatedRent(parseEuro(rent), coefficients.map((c) => c.value));

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="grid content-start gap-4">
        <EuroInput id={`${id}-rent`} label="Renda atual" value={rent} onChange={setRent} />
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Coeficientes a aplicar</legend>
          <div className="grid gap-2">
            {RENT_COEFFICIENTS.map((c) => (
              <Toggle
                key={c.year}
                id={`${id}-${c.year}`}
                label={`${c.year}: ${c.value.toLocaleString("pt-PT", { minimumFractionDigits: 4 })}${c.provisional ? " (provisório)" : ""}`}
                checked={selected.includes(c.year)}
                onChange={(on) => setSelected((s) => (on ? [...s, c.year] : s.filter((y) => y !== c.year)))}
                help={c.provisional ? "Valor do INE. Só é oficial depois do Aviso no Diário da República, até 30 de outubro." : undefined}
              />
            ))}
          </div>
        </fieldset>
      </div>
      <ResultPanel>
        <p className="text-sm text-muted">Nova renda</p>
        <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{eur(next, 2)}</p>
        <p className="mt-1 text-muted tabular">Mais {eur(Math.max(0, next - parseEuro(rent)), 2)} por mês</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          O senhorio só pode atualizar uma vez por ano, um ano depois do início do contrato, e tem de avisar por escrito com 30 dias de antecedência. Coeficientes de anos anteriores só podem ser usados até 3 anos depois. Se o contrato tiver outra regra de atualização, vale o contrato.
        </p>
      </ResultPanel>
    </div>
  );
}

export function LandlordTaxCalculator() {
  const id = useId();
  const [rent, setRent] = useState("900");
  const [months, setMonths] = useState("12");
  const [expenses, setExpenses] = useState("900");
  const [years, setYears] = useState("1");
  const [renewals, setRenewals] = useState("0");
  const r = landlordTax({ monthlyRent: parseEuro(rent), months: Number(months) || 0, expenses: parseEuro(expenses), contractYears: Number(years) || 0, renewals: Number(renewals) || 0 });

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <form className="grid content-start gap-4" onSubmit={(e) => e.preventDefault()}>
        <div className="grid gap-4 sm:grid-cols-2">
          <EuroInput id={`${id}-rent`} label="Renda mensal" value={rent} onChange={setRent} />
          <NumberField id={`${id}-months`} label="Meses no ano" value={months} onChange={setMonths} min={0} max={12} />
          <NumberField id={`${id}-years`} label="Duração do contrato" value={years} onChange={setYears} min={1} max={30} suffix="anos" />
          <NumberField id={`${id}-ren`} label="Renovações" value={renewals} onChange={setRenewals} min={0} max={10} />
        </div>
        <EuroInput id={`${id}-exp`} label="Despesas dedutíveis no ano" value={expenses} onChange={setExpenses} help="IMI, condomínio, seguro de renda e obras de conservação. Juros do crédito e mobília não contam." />
      </form>
      <ResultPanel>
        <p className="text-sm text-muted">IRS estimado sobre as rendas</p>
        <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{eur(r.tax, 2)}</p>
        <p className="mt-1 text-muted">Taxa de {pct(r.rate, 0)}</p>
        <dl className="mt-5">
          <ResultRow label="Rendas recebidas" value={eur(r.gross, 2)} />
          <ResultRow label="Rendimento tributável" value={eur(r.taxable, 2)} />
          <ResultRow label="Taxa pela duração do contrato" value={pct(r.base72, 0)} />
        </dl>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          {r.moderate
            ? `Rendas até ${eur(RENT_TAX_2026.moderateRentCap)} por mês pagam 10% entre 2026 e 2029, ou menos se o contrato for longo. Esta combinação é a nossa leitura da lei; a Autoridade Tributária ainda não publicou instruções.`
            : `Acima de ${eur(RENT_TAX_2026.moderateRentCap)} por mês não se aplica a taxa de 10%.`}{" "}
          Pode também optar por englobar as rendas no IRS.
        </p>
      </ResultPanel>
    </div>
  );
}

export function TenantDeductionCalculator() {
  const id = useId();
  const [rent, setRent] = useState("750");
  const [low, setLow] = useState(false);
  const annual = parseEuro(rent) * 12;
  const d = tenantDeduction(annual, low);
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div className="grid content-start gap-4">
        <EuroInput id={`${id}-rent`} label="Renda mensal que paga" value={rent} onChange={setRent} />
        <Toggle id={`${id}-low`} label="Rendimento coletável até ao 1.º escalão de IRS" checked={low} onChange={setLow} help="Até 8 342 € em 2026." />
      </div>
      <ResultPanel>
        <p className="text-sm text-muted">Dedução no IRS de 2026</p>
        <p className="mt-1 figures font-display text-5xl leading-none font-medium tracking-[-0.01em]">{eur(d, 2)}</p>
        <p className="mt-1 text-muted">15% de {eur(annual, 2)} de rendas, com o limite de {eur(low ? RENT_TAX_2026.tenantCapLowIncome : RENT_TAX_2026.tenantCap)}</p>
        <p className="mt-4 text-sm leading-relaxed text-muted">
          O limite geral é 900 € em 2026 e 1000 € a partir de 2027. O limite de 1050 € para rendimentos baixos é a nossa leitura das regras de transição. Para rendimentos até 30 000 € há um limite intermédio que ainda não calculamos. O contrato tem de estar comunicado às Finanças.
        </p>
      </ResultPanel>
    </div>
  );
}
