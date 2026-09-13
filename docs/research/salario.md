# Net salary and payslip: research notes (2026-09-13)

Code: `src/lib/trabalho/rules-2026.ts`, `src/lib/trabalho/salario.ts` (tests in `salario.test.ts`).

## Primary sources read
- Despacho n.º 233-A/2026 (tabelas de retenção, continente): Tabelas I, II, III transcribed row by row. Some rows have a
  parcela a abater that is a formula in R (`rate × factor × (base − R)`); the model keeps constant and formula rows apart.
  Rules applied: n.º 3 (formula, never below zero), n.º 5 h) (3+ dependants −1 p.p.), n.º 10 and CIRS art. 99.º-C n.º 5
  (subsidies withheld separately).
- Código dos Regimes Contributivos art. 53.º: worker 11%, employer 23,75%. Base: arts. 44.º, 46.º–48.º.
- Portaria n.º 51-B/2026/1: meal allowance limit 6,15 €; card/voucher limit 70% higher (CIRS art. 2.º n.º 3 b) 2)); the
  Código Contributivo art. 46.º n.º 2 l) uses the same limit.
- Código do Trabalho arts. 263.º, 264.º, 268.º, 276.º, 279.º (payslip lines and overtime rates).
- DL n.º 115/2023: FCT obligations extinct; FGCT suspended during the Acordo de Médio Prazo.

## Not modelled (the page says so)
IRS Jovem monthly cap (n.º 5 g) wording is ambiguous), disability tables IV–VII, Açores/Madeira tables, overtime,
duodécimos, union dues, garnishments.

## Open questions
- Rounding of the withheld amount is not stated in the Despacho; the app rounds to the cent.
- End date of the Acordo de Médio Prazo (FGCT restart) not confirmed in a primary source.
