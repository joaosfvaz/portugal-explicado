# Budget, bills and scam safety: research notes (2026-09-13)

## Where taxes go (`src/content/orcamento.ts`)
- Spending by function: Eurostat gov_10a_exp, Portugal, S13 general government consolidated, 2024 provisional (updated
  2026-07-21), read through the official API. Includes debt interest (GF0107 6 347,5 M€), excludes debt repayment.
  Sum of the 10 functions = 122 805,3 M€ (checked in `src/content/orcamento.test.ts`).
- The State Budget 2026 (Lei 73-A/2025, Mapa 2) splits by function only the Administração Central, unconsolidated and with
  debt repayment (352 472 M€). Not used for the per-person split, because it would mislead.
- Tax revenue 2026: Relatório OE 2026 proposal, Quadro 4.4 (the approved law has no revenue-by-tax map). Shares derived.

## Household bills (`src/app/casa/faturas/page.tsx`)
- Electricity: ERSE pages and 2026 tariff release; CIVA Lista I verbas 2.33 and 2.38; CAV 2,85 € (ERSE, OE 2026 art. 88.º).
- Not shown because only secondary: the IEC rate per kWh and the DGEG fee amount (the page names them without values);
  water tariff tiers (ERSAR site unreachable, the page describes the structure and says prices vary by município);
  gas cylinder prices and the Botija Solidária amount after the 90-day period.
- Telecom: ANACOM consumer FAQs (fidelização, early termination, price changes, tarifa social de internet 5 € + IVA).

## Scam safety (`src/app/vida/burlas/page.tsx`)
- Banco de Portugal pages (never asks for credentials; 50 € limit; refund by the end of the next working day), AT leaflet
  "Segurança da Informação", CTT phishing page, mbway.pt/seguranca, Ministério Público FAQ, CNCS, Linha Internet Segura.
- No list of current scams on purpose: it goes out of date and gives false reassurance.
- Not shown: Segurança Social alert wording and "@at.gov.pt" sender rule (press only).
