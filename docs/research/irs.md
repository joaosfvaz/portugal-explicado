# IRS 2026: research notes (2026-09-13)

Content in `src/content/irs.ts`; pages `/impostos/como-funciona-o-irs` and `/impostos/tipos-de-rendimento`.
Worked examples are computed on the page with `taxByBrackets` and `data/tax/2026.json`, so they always match the calculator
(the law's average-rate method in art. 68.º n.º 2 can differ by a few cents).

## Primary sources

- Código do IRS consolidado, Portal das Finanças (arts. 2.º–102.º as cited in the content).
- Lei n.º 73-A/2025 (OE 2026): brackets, mínimo de existência 12 880 €, prémios de produtividade (art. 96.º), IVA deduction sectors.
- Despacho n.º 233-A/2026: 2026 retention tables (continente). Example: 1 428,57 € × 24,10% − 193,33 € = 150,96 €.
- EBF art. 21.º (PPR), art. 45.º-C (10% rents, DL 97/2026), art. 58.º-A (IFICI).
- DL 97/2026: 10% rent rate, tenant deduction 900 €, reinvestment exclusion for moderate-rent housing, art. 10.º renumbering.

## Not shown because not confirmed from a primary source

- Subsídio de refeição 2026 limits (6,15 € / 10,455 €): Portaria n.º 51-B/2026/1 text not read.
- Staking taxation per AT binding information (press only).
- Social Security rates used in the research examples (11% and 21,4% × 70%). The recibos verdes example on the site
  therefore leaves out the art. 31.º n.º 2 deduction and says so.

## Open questions

- Whether the taxa adicional de solidariedade uses the quociente conjugal in joint taxation (art. 69.º n.º 3 cites only art. 68.º).
- Final 2026 mínimo de existência variables are published by AT only in Q1 2027 (art. 70.º n.º 6).
- Combination of the 10% rent rate with the art. 72.º long-contract reductions (app uses the lower rate).
- Practical application of the 10/20/30% holding-period exclusion (art. 43.º n.º 5) to foreign ETFs.
- Açores and Madeira rates not covered.
