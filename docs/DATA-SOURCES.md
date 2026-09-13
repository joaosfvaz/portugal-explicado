# Data Sources

_Researched and tested on 2026-09-12._

Every value shown in the app comes from one of the sources below. This document records where each source lives, how it was verified, what its quirks are, and which rules the importers apply.

## Verification levels

| Level | Meaning | Allowed in calculators |
|---|---|---|
| `primary` | Read in the legal text or in an official publication of a public body | Yes |
| `derived` | Computed from a primary rule (e.g. 55 × IAS) | Yes |
| `secondary` | Two independent reputable secondary sources agree, primary not read | No, explanatory text only, labelled "a confirmar" |
| `uncertain` | Could not be confirmed | Never shown as fact |

---

## 1. Taxes (Phase 1)

Stored by hand in `data/tax/{year}.json`, validated with Zod at build time (`src/lib/tax/data.ts`). The calculators refuse to run for a year with no file. They never fall back to another year.

### IRS brackets, art. 68.º CIRS (mainland)

| Year | Legal basis | Source read | Level |
|---|---|---|---|
| 2025 | Lei n.º 55-A/2025, de 22 de julho, art. 2.º | [DR PDF](https://files.diariodarepublica.pt/1s/2025/07/13901/0000200003.pdf) | primary |
| 2026 | Lei n.º 73-A/2025 (OE2026), art. 71.º, in force 1-1-2026 | [Portal das Finanças, art. 68.º](https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs68.aspx) | primary |

The unit test `irs-jovem.test.ts › real bracket tables` recomputes the published average rate at the top of every bracket with the progressive engine and requires a match to 5 decimals, for both years.

The law's method (tax the income up to the highest bracket limit passed at that bracket's average rate, then tax the excess at the next normal rate) is mathematically identical to the slice-by-slice progressive calculation the engine uses.

### IRS Jovem, art. 12.º-B CIRS

Regime from Lei n.º 45-A/2024 (OE2025), unchanged for 2026. The AT leaflet ([Folheto IRS Jovem 2025](https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/Folheto_IRS_jovem_2025.pdf)) was read in full. Its worked examples are unit tests.

| Rule | Value |
|---|---|
| Age | Up to 35 on 31 December of the tax year |
| Income | Categories A and B, as a taxpayer (not as a dependent) |
| Exemption by year of income | 100% · 75% (2nd to 4th) · 50% (5th to 7th) · 25% (8th to 10th) |
| Cap | Exempt income never above 55 × IAS: 28 737,50 € (2025, stated in leaflet), 29 542,15 € (2026, derived) |
| Year counting | From the first year with A/B income as a taxpayer, even before 2025. Years without A/B income, as a dependent, or without a filing duty do not count |
| Degree | Not required (old-regime condition) |
| Rate determination | Exempt income still counts to set the rate on other income (n.º 4) |

**Trap:** the Portal page for art. 12.º-B still shows an old note about "conclusão de um ciclo de estudos". It belongs to the pre-2025 regime. Most blog posts about IRS Jovem predate the reform. Reject any secondary source not dated after OE2025.

### Other tax values

| Value | 2025 | 2026 | Basis | Level |
|---|---|---|---|---|
| IAS | 522,50 € | 537,13 € | Portaria 6-B/2025/1; Portaria 480-A/2025/1 (confirmed on the [DGAEP page](https://www.dgaep.gov.pt/index.cfm?OBJID=3E74CF19-DA87-4B8F-81E2-51E0649AAA9F)) | primary |
| Minimum wage (RMMG) | 870 € | 920 € | DL 112/2024; DL 139/2025 (quoted in Despacho 233-A/2026 preamble) | primary |
| Mínimo de existência | 12 180 € | 12 880 € | Art. 70.º CIRS | primary |
| Dedução específica cat. A | 4 462,15 € | 4 587,09 € | 8,54 × IAS, art. 25.º CIRS | derived |
| Adicional de solidariedade | 2,5% on 80 000 to 250 000 €; 5% above | same | Art. 68.º-A CIRS | primary |
| Social Security, self-employed | 21,4% on 70% of services / 20% of goods | same | ISS guide | primary |
| Social Security, employee / employer | 11% / 23,75% | same | Only secondary sources read | **secondary** |

### Open points

- Employee and employer Social Security rates: confirm in the Código Contributivo text.
- Low-income rent deduction cap (art. 78.º-E n.º 4) for 2025 and 2026: no official AT statement found. Not used by the app.
- Madeira and Azores brackets: not collected (DLR 8/2025/M; Despacho 1179/2026 for Azores withholding).

---

## 2. Parliament and laws (Phase 2)

Importer: `scripts/import-parlamento.ts` → `data/snapshots/parlamento/`. Server-side only.

### Assembleia da República open data

Portal: <https://www.parlamento.pt/Cidadania/Paginas/DadosAbertos.aspx>. Reuse is free with attribution ("Assembleia da República"). Current legislature: **XVII** (since 2025-06-03).

| File | Dataset page | Size | Used for |
|---|---|---|---|
| `IniciativasXVII_json.txt` | `DAIniciativas.aspx` | ~93 MB | Initiatives, event trail, votes |
| `InformacaoBaseXVII_json.txt` | `DAInformacaoBase.aspx` | ~0,6 MB | Deputies, groups, legislature |
| `DiplomasXVII_json.txt` | `DADiplomasAprovados.aspx` | ~1,9 MB | Approved acts with DR links |

**Download URLs are tokenised** (`app.parlamento.pt/webutils/docs/doc.txt?path=<token>&fich=...`). The importer discovers them on every run: dataset page → link titled `Pasta XVII Legislatura` → `*_json.txt` link. No CORS for other origins. No `ETag`/`Last-Modified`. Update frequency is not documented (the latest events were ~2 weeks old during the August recess).

Quirks handled:

- `Fase` strings can carry trailing whitespace. Always trim.
- `ausencias` is sometimes an array, `descricao`/`detalhe`/`ObsFase` sometimes `null`.
- Votes live inside events (`IniEventos[].Votacao[]`); there is no separate votes dataset.
- `detalhe` is HTML: `A Favor: <I>PSD</I>, <I> CH</I><BR>Contra:<I>PS</I>`. Roll-call votes prefix seats (`86-PSD`). Dissenting deputies appear by name with their party in brackets. See `src/lib/parlamento/votes.ts`.
- Sitting deputies: `DepSituacao` entry with `sioDtFim == null` and `sioDes` starting with `Efetivo`; party = `DepGP` entry with the latest `gpDtInicio`. (`gpDtFim == null` returns nothing: all rows carry an end date.) The importer aborts if the count is outside 200 to 240.

### Status derivation

`src/lib/parlamento/status.ts`, covered by `parlamento.test.ts`. Events are sorted by date; each decisive event overrides the previous status.

| Status | Rule |
|---|---|
| `publicada` | `Lei (Publicação DR)` or `Resolução da AR (Publicação DR)`. **Final**: later events cannot change it |
| `aprovada` | `Aprovado` in a final vote. Bills: `Votação final global`, `Votação global`, `Votação final`, `Votação novo decreto`. Resolutions and deliberations: those plus `Votação na generalidade` and `Votação Deliberação` |
| `rejeitada` | `Rejeitado` in any of the deciding votes above (never in `Votação na especialidade`) |
| `vetada` | `Veto (Receção/Leitura/Publicação)`, or `Rejeitado` in `Confirmação do decreto` (the veto stands) |
| `retirada` | `Retirada da iniciativa` |
| `nao-admitida` | `Não admissão` |
| `em-curso` | None of the above |

**Why publication is final:** one initiative can produce several decrees. Proposta de Lei 1/XVII produced the nationality law (published 2026-05-18) and a Penal Code decree that was vetoed and whose confirmation failed on 2026-07-03. Without the rule, the nationality law showed as "rejeitada". The app flags initiatives with more than one decree and always shows the full event trail with the decisive event highlighted.

Summaries use the official title only. No AI-generated text.

### Diário da República

Importer: `scripts/import-dr.ts`. There is no official API; `diariodarepublica.pt/dr/...` pages are a JavaScript app.

| Feed | Content |
|---|---|
| <https://files.diariodarepublica.pt/rss/serie1-html.xml> | Série I items with detail link and description (issuer + sumário) |
| <https://files.diariodarepublica.pt/rss/serie1.xml> | Same items with PDF link |

- Only the **latest issue** is in the feed. The job must run daily; it merges into a rolling 120-day snapshot.
- Items repeat once per embedded image. Merged by title.
- The description has no separator between issuer and sumário. The split uses the first known opening verb (`Aprova`, `Altera`, `Procede`, ...). If none matches, the whole text is kept as the summary with no issuer.
- Free access and reuse under Decreto-Lei 83/2016.

### Elections (not used yet)

CNE results for AR 2025: `https://www.cne.pt/sites/default/files/dl/eleicoes/2025_ar/docs_geral/2025_ar_mapa_resultados.zip`. Note that election results by list (AD 91) differ from current parliamentary groups (PSD 89, CDS-PP 2). The app uses the groups from `InformacaoBase`.

---

## 3. Economy (Phase 3)

Importer: `scripts/import-economia.ts` → `data/snapshots/economia.json`. Indicators are defined in `src/lib/economia/indicators.ts`. A failing indicator keeps its previous values and is listed on the dashboard.

| Indicator | Source | Query | Latest at import |
|---|---|---|---|
| GDP real growth (annual) | Eurostat `nama_10_gdp` | `na_item=B1GQ&unit=CLV_PCH_PRE` | 2025: 1,9 |
| GDP real growth (y/y quarterly) | Eurostat `namq_10_gdp` | `unit=CLV_PCH_SM&s_adj=SCA` | 2026-Q2: 2,5 |
| GDP per capita PPS | Eurostat `tec00114` | EU27 = 100 | 2025: 81 |
| Inflation y/y (HICP) | Eurostat `prc_hicp_minr` | `coicop18=TOTAL&unit=RCH_A` | 2026-08: 3,6 |
| Inflation annual average | Eurostat `prc_hicp_aind` | `coicop=CP00&unit=RCH_A_AVG` | 2025: 2,2 |
| Unemployment rate | Eurostat `une_rt_m` | `s_adj=SA&age=TOTAL` | 2026-07: 5,7 |
| Minimum wage | Eurostat `earn_mw_cur` | ×12/14 to legal 14-payment value | 2026-S2: 920 |
| Public debt % GDP | Eurostat `gov_10dd_edpt1` | `na_item=GD&sector=S13` | 2025: 89,7 |
| Budget balance % GDP | Eurostat `gov_10dd_edpt1` | `na_item=B9` | 2025: 0,7 |
| House prices y/y | Eurostat `prc_hpi_q` | `purchase=TOTAL&unit=RCH_A` | 2026-Q1: 17,8 |
| Population 1 January | Eurostat `demo_pjan` | | 2025: 10 749 635 |
| 10-year bond yield | BPstat series 12099464 | domain 26 | 2026-08: 3,54 |
| Mortgage rate, new loans | BPstat series 12533735 | domain 21 | 2026-07: 2,96 |
| Diesel pump price (weekly) | EC Weekly Oil Bulletin, history XLSX | `PT/ES/EU_price_with_tax_diesel` ÷ 1000 | 2026-09-07: 2,104 €/l |
| Euro-super 95 pump price (weekly) | same | `..._euro95` | 2026-09-07: 2,093 €/l |
| LPG pump price (weekly) | same | `..._LPG` | 2026-09-07: 0,890 €/l |

### Fuel prices

- **Trend (primary):** European Commission Weekly Oil Bulletin, price history with taxes: `https://energy.ec.europa.eu/document/download/906e60ca-8b6a-44e7-8589-652854d2fd3f_en` (XLSX, ~4,5 MB, sheet "Prices with taxes"). Row 1 holds machine column names; values are EUR per 1000 litres; newest week first; footnote rows have no date. Weekly since 2005 with some missing weeks. Terms in the file: "Reproduction is authorised provided the source is acknowledged." The importer reads the file with a minimal XLSX reader (`scripts/lib/xlsx.ts`) and keeps data since 2010.
- **Latest daily average (reference only):** DGEG "Preços dos Combustíveis Online", `https://precoscombustiveis.dgeg.gov.pt/api/PrecoComb/PMD?idsTiposComb=2101,3201,1120&dataIni=…&dataFim=…`. National daily average and number of stations. The API is public but undocumented and has no published terms, so the app shows it only as "média diária mais recente" with its source, never in charts. If it fails, the import continues without it. On 2026-09-07 both sources gave the same Portugal values.
- **Not used:** ENSE reference prices (computed from international quotations, not pump prices); Eurostat HICP fuel index (an index, not a price).

Formats: both return JSON-stat 2.0 (`src/lib/economia/jsonstat.ts`). The parser refuses a response with an unexpected extra breakdown so numbers are never mixed. Both send `Access-Control-Allow-Origin: *`, but the app imports server-side anyway.

Attribution: "Source: Eurostat" and "Banco de Portugal, BPstat".

### Not used, and why

| Source | Reason |
|---|---|
| INE JSON API (`ine.pt/ine/json_indicador/pindica.jsp`) | Down for maintenance during testing (HTTP 500/503, then timeouts). Codes found for bank valuation €/m² (`0012248`) and new-housing construction cost index (`0011748`), which only INE publishes. Add in Phase 4 once verified live |
| PORDATA | No API; terms forbid reproduction. Use the original sources |
| Eurostat `prc_hicp_manr` | Discontinued after 2025 |
| State budget execution (dados.gov.pt, Entidade Orçamental) | XLS files only, no CORS; planned for a later phase |

---

## 4. Housing (Phase 4)

Values live in `src/lib/casa/rules-2026.ts` and are covered by `casa.test.ts` and `rent.test.ts`. Full research tables, with legal basis and verification level for every row: [research/casa-comprar.md](research/casa-comprar.md), [research/casa-arrendar.md](research/casa-arrendar.md), [research/casa-construir.md](research/casa-construir.md).

| Area | Key values used | Basis | Level |
|---|---|---|---|
| IMT 2026 | Tables for HPP, young buyers and other housing; 7,5 % for non-residents | CIMT art. 17.º (Lei 73-A/2025 art. 83.º; DL 97/2026); AT Ofício Circulado 40129/2026 | primary |
| Imposto do Selo | 0,8 % purchase; 0,6 % loan ≥ 5 years; 4 % bank commissions; young-buyer deduction up to 2 644,31 € | TGIS verbas 1.1, 17.1.3, 17.3.4; CIS art. 7.º-A | primary (cap derived) |
| Registo | Casa Pronta 375 € / 700 € (young 150 € / 250 €); separate registo 250 € / 500 € | RERN arts. 21.º, 27.º-A, 28.º | primary (separate-route values read in PGDL consolidated text) |
| Banco de Portugal | LTV 90 % / 80 %; DSTI 45 %; maturity 40 y (≤35) / 35 y; +1,5 p.p. shock for variable loans > 10 y | Recomendação Macroprudencial 1/2026 (from 2026-08-01); Instrução 23/2023 | primary |
| Garantia pública | ≤ 35 y, price ≤ 450 000 €, up to 15 %, contracts until 2026-12-31 | DL 44/2024; Portaria 236-A/2024/1 | primary |
| Rent update | 1,0216 (2025), 1,0224 (2026), 1,0256 (2027, provisional until the DR Aviso) | NRAU arts. 24.º–25.º | primary / derived (2027) |
| Landlord IRS | 25 %; art. 72.º reductions; 10 % for rents ≤ 2 300 €/month until 2029, applied as min(10 %, art. 72.º rate) | CIRS art. 72.º; EBF art. 45.º-C (DL 97/2026) | primary (combination rule is our reading) |
| Tenant deduction | 15 %, cap 900 € in 2026 (1 050 € low income, interpretation) | CIRS art. 78.º-E; DL 97/2026 art. 15.º | primary / derived |
| Building | Licensing regime DL 108/2026 from 2026-10-01; IMT 6,5 % building land; VAT refund 23 %→6 % for own HPP up to 660 982 € | RJUE; DL 155-B/2026; DL 97/2026 Anexo II | primary |

Not used as facts: notary, lawyer and bank fees (not regulated; user inputs), market construction price per m² (INE publishes an index only; user input), municipal urban planning fees (vary by município; two examples shown).

## 5. Benefits (Phase 5)

Values live in `src/lib/beneficios/rules-2026.ts`, tested in `beneficios.test.ts`. Research: [research/apoios-sociais.md](research/apoios-sociais.md).

| Benefit | Key values | Basis | Level |
|---|---|---|---|
| Abono de família | Escalões at 0,5 / 1 / 1,7 / 2,5 × IAS × 14; 2026 amounts; +50 % single parent | DL 176/2003; Portaria 60/2026/1 | primary |
| Garantia para a Infância | 1 528 €/year; 127,33 €/month | Portaria 60/2026/1 art. 5.º | primary / derived (monthly) |
| Subsídio de desemprego | 65 % of reference; min 537,13 € (617,70 € if salaries ≥ RMMG); max 1 342,83 €; duration table | DL 220/2006; ISS Guia Prático 6001 (2026) | primary (617,70 € legal article not identified) |

The calculator does not apply the 75 % net-reference cap, because it depends on IRS withholding. The page says so.

## 6. State institutions and life-admin guides (Phase 5)

Content lives in `src/content/estado.ts` and `src/content/vida.ts`, in Portuguese and English. Research: [research/estado-instituicoes.md](research/estado-instituicoes.md), [research/vida-nif-cc-aima-crue.md](research/vida-nif-cc-aima-crue.md), [research/vida-niss-sns-empresa-carro.md](research/vida-niss-sns-empresa-carro.md).

Known conflicts and choices:

- NIF for non-residents: gov.pt says a tax representative is needed; the AT leaflet (July 2025) says it is not required at attribution. The guide follows the AT and shows the conflict.
- Freguesias: 3 259 in the official 2025 local election results, counting Corvo. The page states the convention.
- AIMA income thresholds for the own-income route in 2026 are not confirmed; the guide says so.
- ISV age reductions for used imported cars: official pages are inconsistent, so no percentages are shown.

## 7. Economic context texts

`src/lib/economia/context.ts` holds a plain explanation per indicator (what it is, effects on families, companies and the State, and the usual positive and negative effects of a rise or fall). These are general economics, written neutrally, and do not judge the current value. Automatic context sentences (highest or lowest since, average of the last years, comparison with the EU) are computed from the snapshot and tested in `context.test.ts`.

## 8. Elections

Content: `src/content/eleicoes.ts`. Pages: `/estado/eleicoes`, `/estado/eleicoes/[id]`.

- Most recent election of each type, from the CNE mapas oficiais (primary). Full list of documents and derived figures in
  `docs/research/eleicoes.md`.
- Autárquicas câmaras by party and national turnout are **derived** counts over the 308 municípios (CNE publishes no national total).
- Results use one colour for every list. No party colours.

## 9. How IRS works and IRS by income type

Content: `src/content/irs.ts`. Pages: `/impostos/como-funciona-o-irs`, `/impostos/tipos-de-rendimento`.

- Rules and 2026 values from the Código do IRS, Lei 73-A/2025, Despacho 233-A/2026, EBF and DL 97/2026 (primary).
- Worked examples are computed from `data/tax/2026.json` with `taxByBrackets` (derived).
- Values that could not be confirmed from a primary source are left out; see `docs/research/irs.md`.

## 10. Work, money and everyday help

Content and code: `src/lib/trabalho/*`, `src/content/{direitos,prazos,contactos,vou,glossario,para-mim,alteracoes}.ts`.
Research notes: `docs/research/salario.md`, `docs/research/direitos.md`.

- Net salary: Despacho n.º 233-A/2026 retention tables, Código dos Regimes Contributivos art. 53.º (primary). Tested in
  `src/lib/trabalho/salario.test.ts` against hand-checked examples (1 000 € → 854,00 €; 1 500 € → 1 166,83 €).
- Labour rights: Código do Trabalho (Lei n.º 32/2025 version) and Segurança Social guides (primary).
- Deadlines calendar: CIRS, CIMI, DL n.º 161/2026, Segurança Social guides (primary). Calendar files are generated in the
  browser (`src/lib/ics.ts`).
- Contacts: official pages of each organisation (primary). Costs only where stated.
- Glossary: plain definitions written for the app; no figures except IAS, minimum wage and dedução específica, which come
  from `data/tax/2026.json`.

## 11. Municípios

Script: `npm run import:municipios` → `data/snapshots/municipios.json`.

- Câmara Municipal results per município from the CNE Mapa Oficial n.º 2-B/2025 (retificado), part II spreadsheet
  (percentages and seats). Coalition and citizen-group siglas come from the sheet's sigla columns (primary).
- Laws about a município are initiatives whose official title names it ("Município de X", "concelho de X").

## 12. Home page and "O que mudou"

- Everyday laws: initiatives whose official title contains words from `src/lib/parlamento/topics.ts` (derived; the page
  says the selection is by title topic). Parish border and town-status changes are excluded.
- "O que mudou" joins published laws, indicator updates and the hand-written list in `src/content/alteracoes.ts`; RSS at
  `/o-que-mudou/rss.xml`.

## 13. Where taxes go, household bills and scam safety

Research notes: `docs/research/orcamento.md`.

- Spending by function: Eurostat gov_10a_exp, general government consolidated, 2024 provisional (primary). The per-person
  split applies those proportions to an amount the reader types (derived; the page says taxes are not earmarked).
- Tax revenue 2026: Relatório do OE 2026 proposal (primary; proposal values).
- Bills: ERSE, ANACOM and CIVA (primary). Values found only in secondary sources are not shown.
- Scam safety: Banco de Portugal, AT, CTT, SIBS, Ministério Público, CNCS (primary). No list of current scams.
