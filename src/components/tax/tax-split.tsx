"use client";

import { useId, useState } from "react";
import { EuroInput, parseEuro } from "@/components/tax/bracket-calculator";
import { SPENDING_2024, SPENDING_TOTAL_2024 } from "@/content/orcamento";
import { eur } from "@/lib/format";

/**
 * Splits an amount in the same proportions as public spending. Taxes are not earmarked, so this is an
 * illustration of proportions, not a record of where a person's money went.
 */
export function TaxSplit({ defaultAmount }: { defaultAmount: number }) {
  const id = useId();
  const [amount, setAmount] = useState(String(defaultAmount));
  const total = Math.max(0, parseEuro(amount));

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,4fr)_minmax(0,7fr)]">
      <div className="grid content-start gap-3">
        <EuroInput id={`${id}-amount`} label="Quanto pagou de impostos e descontos num ano" value={amount} onChange={setAmount} help="Por exemplo, o IRS e a Segurança Social do seu recibo, vezes 14. O valor inicial é um exemplo." />
        <p className="text-sm leading-relaxed text-muted">
          Os impostos não têm destino marcado: vão todos para o mesmo bolo. Esta conta mostra como o seu valor se dividiria se seguisse as mesmas proporções da despesa pública.
        </p>
      </div>
      <ul className="grid gap-px overflow-hidden border border-line bg-line">
        {SPENDING_2024.map((s, i) => {
          const share = s.amount / SPENDING_TOTAL_2024;
          return (
            <li key={s.id} className="bg-surface px-4 py-3">
              <div className="flex items-baseline justify-between gap-3">
                <span className="font-medium">{s.name}</span>
                <span className="font-display text-2xl font-medium whitespace-nowrap figures">{eur(total * share, 0)}</span>
              </div>
              <div className="mt-1.5 h-2.5 bg-sunken">
                <div className={`h-full ${i === 0 ? "bg-accent" : "bg-accent/55"}`} style={{ width: `${share * 100}%` }} />
              </div>
              <p className="mt-1 text-sm text-muted">
                {(share * 100).toLocaleString("pt-PT", { maximumFractionDigits: 1 })}% · {s.plain}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
