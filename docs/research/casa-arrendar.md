# Arrendar casa — verified legal research (mainland Portugal)

- Prepared for: Portugal Explicado (pt-PT), guide "arrendar casa" + calculators
- Research date / verifiedOn for every row: **2026-09-12** (unless stated)
- Verification levels: **primary** (value read in the official text or official portal page), **derived** (computed from primary texts), **secondary** (consolidated mirror, press, law firm), **uncertain** (conflicting or incomplete)
- Local copies of the texts that were opened: `scratchpad/arr/*.txt`, `scratchpad/dl97.txt`, `scratchpad/irs78e.txt`

> Big 2026 change: **Decreto-Lei n.º 97/2026, de 20 de maio** (under authorisation Lei n.º 9-A/2026, de 6 de março; rectified by Declaração de Retificação n.º 26/2026/1, 13-07-2026 — rectification does not touch the tenant/landlord items below except a wording fix in RSAA art. 4.º n.º 2). It creates the 10 % IRS rate for "moderate" rents (EBF art. 45.º-C), raises the tenant rent deduction (900 € in 2026, 1000 € from 2027), creates the **RSAA** (IRS exemption) and **revokes DL 68/2019 (PAA)** from 1 Sept 2026.

---

## 1. Coeficiente de atualização das rendas

| Item | Value | Legal basis | Source URL | verifiedOn | Level |
|---|---|---|---|---|---|
| Coefficient 2025 | **1,0216** (+2,16 %) | NRAU art. 24.º; Aviso n.º 23099/2024/2, DR 2.ª série n.º 203/2024, 18-10-2024 | https://diariodarepublica.pt/dr/detalhe/aviso/23099-2024-891337617 | 2026-09-12 | primary |
| Coefficient 2026 | **1,0224** (+2,24 %) | Aviso n.º 23174/2025/2, DR 2.ª série n.º 181/2025, 19-09-2025 | https://diariodarepublica.pt/dr/detalhe/aviso/23174-2025-935742337 | 2026-09-12 | primary |
| Reference for 2027 | INE: "variação média dos últimos doze meses do IPC sem habitação, referência para a atualização de rendas no próximo ano, fixou-se em 2,6% (2,56%)" (IPC destaque, agosto 2026, publ. 10-09-2026) | NRAU art. 24.º n.º 1 | https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&DESTAQUESdest_boui=770565181&DESTAQUESmodo=2 | 2026-09-12 | primary (INE figure) |
| Coefficient 2027 | **1,0256** (provisional) | = 1 + 2,56 %; Aviso in DR still to be published (legal deadline 30 Oct 2026). Not found in DR on 2026-09-12. | (INE above) | 2026-09-12 | derived — mark "provisório até Aviso" |
| How coefficient is set | Total variation of CPI without housing, last 12 months available at 31 Aug, computed by INE; Aviso in DR until 30 Oct | NRAU (Lei 6/2006) art. 24.º n.os 1–2 (text restated in both Avisos) | Avisos above; consolidated: https://www.pgdlisboa.pt/leis/lei_mostra_articulado.php?artigo_id=691A0024&nid=691&tabela=leis | 2026-09-12 | primary (via Aviso) |
| Rounding | New rent rounded **up to the next cent** (also for any formula-based rent) | NRAU art. 25.º n.os 1–2 | https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2006-34578375 | 2026-09-12 | primary |
| User-facing warning | Show 2027 as "1,0256 (provisório — Aviso no DR pendente até 30-10-2026)" in the UI string itself | — | — | 2026-09-12 | — |

### How the annual update works (CC art. 1077.º — "na falta de estipulação")
1. The contract can set its own update regime in writing. The legal regime applies only if the contract is silent (art. 1077.º n.º 1–2).
2. The rent can be updated once a year with the coefficient in force (n.º 2 a).
3. First update: one year after the contract starts; next ones one year after the previous update (n.º 2 b).
4. The landlord tells the tenant **in writing, at least 30 days before**, the coefficient and the new rent (n.º 2 c).
5. Unused updates are lost, but coefficients of earlier years can still be applied if **not more than 3 years** passed since the first date they could be applied (n.º 2 d).
6. Calculator: `nova renda = ceil_cent(renda × coeficiente)`; for catch-up, multiply the coefficients of the missed years (max 3 years back) — derived.

Source for art. 1077.º: DRE consolidated Código Civil https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1966-34509075 — **primary** (article unchanged since Lei 6/2006). Cross-checked with PGDL mirror.

Note: DL 97/2026 art. 2.º n.º 3 uses the NRAU art. 24.º factor to update the "moderate rent" ceiling; RSAA art. 4.º n.º 2 uses it for RSAA ceilings.

---

## 2. Contract rules (Código Civil, habitação)

Source for all CC rows: **DRE consolidated Código Civil** https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1966-34509075 (text read in browser on 2026-09-12). Amendment notes on DRE: arts. 1096.º–1098.º, 1101.º, 1103.º last changed by **Lei 13/2019** (art. 2.º); art. 1095.º by Lei 82/2023 (art. 286.º, n.º 4 on tourist transitórios); art. 1076.º by **Lei 24-D/2022 art. 274.º** (in force 2023-01-01). No change by Lei 56/2023 to these articles. Cross-checked with PGDL mirror (identical).

| Item | Value | Legal basis | verifiedOn | Level |
|---|---|---|---|---|
| Contract types | Prazo certo or duração indeterminada; silence = prazo certo **5 anos** | CC 1094.º | 2026-09-12 | primary |
| Duration limits (prazo certo) | **min 1 ano, max 30 anos** (auto-adjusted); min does not apply to habitação não permanente / fins especiais transitórios (profissionais, educação, turísticos) | CC 1095.º n.os 2–3 | 2026-09-12 | primary |
| Automatic renewal | Renews at the end for **equal periods or 3 years if the period is shorter** (unless otherwise agreed); no auto-renewal for transitórios unless agreed | CC 1096.º | 2026-09-12 | primary |
| Landlord opposition to renewal — notice | **240 d** (contract/renewal ≥ 6 y); **120 d** (1–<6 y); **60 d** (6 m–<1 y); **1/3 of term** (< 6 m) | CC 1097.º n.º 1 | 2026-09-12 | primary |
| Landlord opposition to first renewal | Only takes effect **3 years after signature** (contract stays in force until then), except own/1st-degree-descendant housing need | CC 1097.º n.os 3–4 | 2026-09-12 | primary |
| Tenant opposition to renewal — notice | **120 d** (≥ 6 y); **90 d** (1–<6 y); **60 d** (6 m–<1 y); **1/3** (< 6 m) | CC 1098.º n.º 1 | 2026-09-12 | primary |
| Tenant early termination (denúncia), prazo certo | After **1/3 of the initial term/renewal**, any time with **120 d** notice (contract ≥ 1 y) or **60 d** (< 1 y); effect at end of a calendar month; if landlord opposed renewal, tenant can leave with **30 d** | CC 1098.º n.os 3–5 | 2026-09-12 | primary |
| Missing notice | Contract still ends, but tenant pays the rents of the missing notice period, except involuntary unemployment, permanent incapacity or death | CC 1098.º n.º 6 | 2026-09-12 | primary |
| Tenant denúncia, duração indeterminada | After 6 months: **120 d** (≥ 1 y effective) / **60 d** (< 1 y) | CC 1100.º | 2026-09-12 | primary |
| Landlord denúncia, duração indeterminada | Own/descendant housing need (pay 1 year of rent; 6 months notice), deep works/demolition (6 months notice + compensation/rehousing), or free denúncia with **≥ 5 years** notice (confirmed 15–12 months before) | CC 1101.º–1104.º | 2026-09-12 | primary |
| **Rendas antecipadas** | Max **2 months**, written agreement | CC 1076.º n.º 1 (red. Lei 24-D/2022 = OE 2023, not Mais Habitação) | 2026-09-12 | primary |
| **Caução** | Max **value of 2 rents** | CC 1076.º n.º 2 (red. Lei 24-D/2022) | 2026-09-12 | primary |
| Encargos/despesas | Written agreement; default: utilities → tenant; condominium common-part costs → landlord | CC 1078.º | 2026-09-12 | primary |
| RSAA contracts (arrendamento acessível) | Permanent residence min **3 years**; temporary (tenant fiscal residence in other concelho) min **3 months** | DL 97/2026 anexo III art. 5.º | 2026-09-12 | primary |

### Registration with AT, Imposto do Selo, receipts

| Item | Value | Legal basis | Source URL | verifiedOn | Level |
|---|---|---|---|---|---|
| Contract communication | Landlord communicates contract, changes and end to AT (Modelo 2 do Imposto do Selo) **until the end of the month after the start** (or change/end) | CIS art. 60.º n.os 1–2 | https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/selo/Pages/selo60.aspx | 2026-09-12 | primary |
| Tenant can register | If landlord does not, tenant may communicate | CIS art. 60.º n.º 4 (red. Lei 56/2023) | same | 2026-09-12 | primary |
| Imposto do Selo | **10 %** of **one month's rent** (or of the conventional increase); for < 1 month contracts, on the rent for the duration | TGIS verba 2 | https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/selo/Pages/ccod-selo-tabgiselo.aspx (local copy ccod-selo-tabgiselo.txt) | 2026-09-12 | primary |
| Rent receipts | Cat. F landlords issue official-model receipt for all amounts received (incl. caução, adiantamento) **or** file annual Modelo 44 **by end of February** (red. DL 49/2025, from 1-7-2025) | CIRS art. 115.º n.º 5 | https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs115.aspx | 2026-09-12 | primary |
| Who may use Modelo 44 instead of e-receipts | Not obliged to caixa postal eletrónica **and** (≥ 65 years at 31 Dec of previous year **or** rents ≤ 2 × IAS, FAQ states 1 074,26 € in 2026), plus rural leases | Portaria 98-A/2015; AT FAQ 1573, 5929 | https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/questoes_frequentes/pages/faqs-00358.aspx | 2026-09-12 | primary (FAQ summary via fetch) — confirm wording |

---

## 3. Landlord tax (IRS categoria F)

| Item | Value | Legal basis | Source URL | verifiedOn | Level |
|---|---|---|---|---|---|
| General autonomous rate, habitação | **25 %** | CIRS art. 72.º n.º 2 (red. Lei 56/2023) | https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs72.aspx | 2026-09-12 | primary |
| Non-housing rents | **28 %** | CIRS 72.º n.º 1 e) | same | 2026-09-12 | primary |
| Contract ≥ 5 and < 10 y (habitação permanente) | −10 pp → **15 %**; each renewal of equal duration −2 pp more (renewal reductions max 10 pp) → floor **5 %** | CIRS 72.º n.º 3 | same | 2026-09-12 | primary (rates derived) |
| Contract ≥ 10 and < 20 y | −15 pp → **10 %** | CIRS 72.º n.º 4 | same | 2026-09-12 | primary |
| Contract ≥ 20 y (and DHD) | −20 pp → **5 %** | CIRS 72.º n.º 5 | same | 2026-09-12 | primary |
| New contract with lower rent | Extra −5 pp if rent ≥ 5 % lower than previous contract on same property (only for contracts in n.os 3–5) | CIRS 72.º n.º 24 | same | 2026-09-12 | primary |
| Exclusion of reductions | Contracts from 1-1-2024 with rent > **150 %** of PAA limits (Portaria 176/2019) do not get n.os 3–5 | CIRS 72.º n.º 23 | same | 2026-09-12 | primary — see open point (PAA revoked) |
| Loss of reduction | If contract ends early for reason attributable to landlord → lose reductions from start + compensatory interest | CIRS 72.º n.º 20 | same | 2026-09-12 | primary |
| **Rate rule for calculator** | `taxa = min(10 %, taxa do art. 72.º)` when rent ≤ 2 300 € and income ≤ 2029; otherwise art. 72.º rate. Reason: EBF 45.º-C is a comparison ("salvo quando seja aplicável uma taxa mais favorável"); 72.º n.os 3–5 reduce the n.º 2 rate (25 %), not the 10 %. Examples: < 5 y → 10 %; 5–10 y → 10 % (15 % > 10 %); 10–20 y → 10 %; ≥ 20 y → 5 % | EBF 45.º-C + CIRS 72.º | as below | 2026-09-12 | derived (plain reading; AT guidance not yet seen) |
| **NEW 10 % rate ("renda moderada")** | **10 %** for housing rents with monthly rent **≤ 2,5 × RMMG 2026** (= 2,5 × 920 € = **2 300 €**), income earned **until 31-12-2029**, **incl. existing contracts**, "salvo quando seja aplicável uma taxa mais favorável"; effects from **1-1-2026** | EBF art. 45.º-C (added by DL 97/2026 art. 9.º; DL 97/2026 art. 2.º n.º 2 a), art. 18.º n.º 2) | https://files.diariodarepublica.pt/1s/2026/05/09700/0001400040.pdf ; AT copy https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/diplomas_legislativos/Documents/decreto-lei-97-2026.pdf | 2026-09-12 | primary |
| RMMG 2026 | **920 €** | DL n.º 139/2025, 29-12-2025 | https://www.dgert.gov.pt/retribuicao-minima-mensal-garantida-para-2026 | 2026-09-12 | primary |
| Rent value for the 2 300 € test | Total paid incl. furniture/equipment/services billed separately; several tenants → whole rent; annual value ÷ months elapsed | DL 97/2026 art. 3.º | DL 97 PDF | 2026-09-12 | primary |
| Withholding (retenção) | New art. 101.º n.º 1 f): **10 %** for income under EBF 45.º-C (retention applies when tenant is an entity with organised accounts) | CIRS 101.º (red. DL 97/2026) | DL 97 PDF | 2026-09-12 | primary |
| **RSAA exemption** | Rents from RSAA contracts are **exempt** from IRS/IRC. Rent ≤ ceiling by tipologia set by **portaria** based on **80 % of INE median rent** of the concelho; permanent residence min 3 years; landlord uploads contract + AT proof on IHRU platform by **15 January** of following year; if englobamento is chosen, exempt income counts for rate | DL 97/2026 anexo III arts. 4.º–7.º; in effect **1-9-2026** (art. 18.º n.º 1 c) | DL 97 PDF | 2026-09-12 | primary |
| RSAA ceilings portaria | **Not yet published** (press 07-09-2026) | DL 97/2026 art. 16.º (30-day deadline) | https://eco.sapo.pt/2026/09/07/novo-regime-das-rendas-acessiveis-ainda-a-espera-de-portaria-para-arrancar/ | 2026-09-12 | secondary |
| PAA (DL 68/2019) | **Revoked from 1-9-2026**; PAA contracts in force keep their tax exemption | DL 97/2026 arts. 15.º n.º 2, 17.º, 18.º n.º 1 a) | DL 97 PDF | 2026-09-12 | primary |
| Englobamento | Optional for residents (rates of art. 68.º then apply) | CIRS 72.º n.º 13 | irs72 link | 2026-09-12 | primary |
| Deductible expenses | All costs actually borne and paid to obtain/guarantee the rent, **incl. rent insurance**; **excluded**: financial costs (loan interest), depreciation, furniture/appliances/decoration, AIMI | CIRS 41.º n.º 1 | https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs41.aspx | 2026-09-12 | primary |
| Condominium | Mandatory condominium charges deductible (split by permilagem if several fractions) | CIRS 41.º n.os 2–3 | same | 2026-09-12 | primary |
| IMI & Imposto do Selo | Deductible when they relate to a property whose rent is taxed that year | CIRS 41.º n.º 5 | same | 2026-09-12 | primary |
| Works before renting | Conservation/maintenance works paid in the **24 months** before the lease | CIRS 41.º n.º 7 | same | 2026-09-12 | primary |
| Rent paid by landlord who moved > 100 km | Deductible up to the rent received, if conditions met | CIRS 41.º n.º 8 (DL 57/2024) | same | 2026-09-12 | primary |
| Proof | Costs must be documented | CIRS 41.º n.º 9 | same | 2026-09-12 | primary |

---

## 4. Tenant tax — dedução das rendas (CIRS art. 78.º-E)

| Item | Value | Legal basis | Source URL | verifiedOn | Level |
|---|---|---|---|---|---|
| Rate | **15 %** of rent paid (net of subsidies) for habitação permanente under RAU/NRAU, contract registered and rent communicated (e-receipt / Modelo 44 / invoice) | CIRS 78.º-E n.os 1 a), 2 | https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs78e.aspx | 2026-09-12 | primary |
| Cap before 2025 (base) | 600 € (low-income 900 €) | red. Lei 82/2023 | AT "redação anterior" (ago 2024) | 2026-09-12 | primary |
| Lei 36/2024 target | 800 € (low-income 1 100 €), phased: **50 % in 2025, 75 % in 2026, 100 % in 2027** | Lei 36/2024 art. 3.º (transitional note on AT page) | irs78e link | 2026-09-12 | primary |
| **Cap 2025** | **700 €** (= 600 + 50 % × 200) | as above | irs78e link | 2026-09-12 | derived |
| **Cap 2026** | **900 €** (overrides 750 € from Lei 36/2024 phasing) | DL 97/2026 art. 15.º n.º 1 | irs78e link + DL 97 PDF | 2026-09-12 | primary |
| **Cap 2027+** | **1 000 €** | CIRS 78.º-E n.º 10 (added by DL 97/2026) | same | 2026-09-12 | primary |
| Low-income cap (taxable income ≤ 1st bracket, 8 342 € in 2026 table) | Target 1 100 €; phased: **2025 = 1 000 €**, **2026 = 1 050 € (interpretation)**, **2027 = 1 100 €**. The "sem prejuízo da aplicação do n.º 4" clause sits inside n.º 10; DL 97/2026 art. 15.º n.º 1 only says 900 € applies in 2026. Reading: n.º 4 (phased) still wins when higher. Label as interpretation in the UI copy | CIRS 78.º-E n.º 4 a), n.º 10; Lei 36/2024 art. 3.º; DL 97/2026 art. 15.º; art. 68.º table (Lei 73-A/2025) | irs78e link; https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs68.aspx | 2026-09-12 | derived (interpretation for 2026) |
| Middle band (1st bracket < income ≤ 30 000 €) | Formula `800 + (1100 − 800) × (30000 − RC)/(30000 − 1.º escalão)` at full phase-in; phased values in 2025/2026 and the interaction with the 900 €/1 000 € floor must be modelled | CIRS 78.º-E n.º 4 b) | irs78e link | 2026-09-12 | uncertain (phasing of formula) |

---

## 5. Support programmes 2026

### Porta 65 Jovem (DL 308/2007, last red. DL 42/2024, in force 1-9-2024)

| Item | Value | Legal basis | Source URL | verifiedOn | Level |
|---|---|---|---|---|---|
| Age | 18 to **≤ 35** (couples: one member up to 37); if 36 during support → one more consecutive application | DL 308/2007 art. 4.º (red. DL 42/2024) | https://files.diariodarepublica.pt/1s/2024/07/12600/0000200005.pdf ; https://www.portaldahabitacao.pt/porta-65-jovem1 | 2026-09-12 | primary |
| Income limits | RM ≤ 4 × **renda máxima de referência (RMR)**; corrected RM ≤ **4 × RMMG** (= 3 680 € in 2026, derived); effort rate max **60 %** | art. 7.º n.º 1 d)–f) | DL 38/2023 republication https://files.dre.pt/1s/2023/05/10300/0001500046.pdf + DL 42/2024 | 2026-09-12 | primary (3 680 € derived) |
| Max rent as exclusion | **Eliminated** (DL 42/2024); support granted **before** contract; contract must be registered within **2 months** after results | art. 7.º n.º 2 a)–b) revoked, n.º 7 | DL 42/2024 PDF | 2026-09-12 | primary |
| RMR | PAA general limit per tipologia (DL 68/2019 art. 10.º n.º 1 a)) or Portaria 277-A/2010 quadro II if better; IHRU publishes "Rendas máximas por município" 2026 PDF | art. 3.º d) | DL 42/2024; portaldahabitacao page | 2026-09-12 | primary — see open point (DL 68/2019 revoked) |
| Other requirements | Nobody owns/rents other housing; no kinship with landlord; no cumulation with other public housing support | arts. 7.º, 8.º | DL 38/2023 | 2026-09-12 | primary |
| Support | Monthly non-refundable subsidy = % of rent, **12-month periods**, decreasing, max **60 months**; % by escalão set in Portaria 277-A/2010 | art. 12.º | DL 38/2023 | 2026-09-12 | primary (escalão % not extracted) |
| Majorações | +20 % historic/ARU areas or +10 % interior; +15 % (1 dependent or disability ≥ 60 %), +20 % (2+ dependents); +10 %/+5 % single-parent; one of each group max | art. 13.º | DL 38/2023 | 2026-09-12 | primary |
| Application window | **Continuous** applications (DL 38/2023) with **monthly** evaluation cycle, ranked by income and household, within annual budget (DL 42/2024; Portaria 238/2024/1); result ~45 working days | arts. 6.º, 10.º | DL 42/2024; portaldahabitacao | 2026-09-12 | primary (Portaria 238/2024/1 not opened) |

### Porta 65+ (DL 308/2007 arts. 16.º-A–16.º-F, added by DL 38/2023)

| Item | Value | Legal basis | Source | verifiedOn | Level |
|---|---|---|---|---|---|
| Who | Any age: household with **income drop > 20 %** (vs previous 3 months or same period last year) or **single-parent** household | art. 16.º-A | DL 38/2023 PDF | 2026-09-12 | primary |
| Requirements | Registered contract; income ≤ 4 × RMA and ≤ top of **6th IRS bracket**; no other housing; no kinship | art. 16.º-D | same | 2026-09-12 | primary |
| Amount | Pays rent above an effort rate of **35 %** (months 1–12), **40 %** (13–36), **45 %** (37–60); **min 50 €, max 200 €/month**; max 60 months | art. 16.º-E | same | 2026-09-12 | primary |

### Apoio extraordinário à renda (DL 20-B/2023, red. DL 103-B/2023, DL 43/2024, Lei 56/2023)

| Item | Value | Legal basis | Source URL | verifiedOn | Level |
|---|---|---|---|---|---|
| Still in force 2026? | **Yes** — arts. 3.º–12.º in force **until 31-12-2028** | art. 25.º n.º 2 (red. DL 91/2023) | https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2023-210911375 | 2026-09-12 | primary |
| Contracts covered | Signed **until 15-03-2023**; also later contract for same tenant + same property if previous one ended by landlord's initiative | art. 3.º (red. DL 43/2024) | same | 2026-09-12 | primary |
| Who | Fiscal residence PT; registered contract (1st housing); annual income ≤ top of **6th bracket** of art. 68.º CIRS in force at attribution; **effort rate ≥ 35 %** | art. 4.º | same | 2026-09-12 | primary |
| 6th bracket top (2026 table) | **43 090 €** | CIRS 68.º (red. Lei 73-A/2025) | irs68 AT page | 2026-09-12 | primary value / uncertain which year's table applies to 2026 attribution |
| Amount | Rent − 35 % × average monthly income (1/14 of annual); minus other IHRU rent support; **max 200 €/month**; if < 20 € paid half-yearly | art. 6.º | same | 2026-09-12 | primary |
| Procedure | **No application**: IHRU attributes oficiosamente using AT data (AT → IHRU by 30 Oct; IHRU → SS by 15 Nov); paid by Segurança Social by day 20 each month; complaints on Portal da Habitação within 60 days; non-notified households can send evidence until last working day of March | arts. 8.º–10.º-A | same | 2026-09-12 | primary |
| Ends | When AT reports end of contract, or on request | art. 11.º | same | 2026-09-12 | primary |

---

## 6. Eviction / disputes

| Item | Value | Legal basis | Source URL | verifiedOn | Level |
|---|---|---|---|---|---|
| BNA + SIMA replaced | **Balcão do Arrendatário e do Senhorio (BAS)**, at DGAJ, national competence; succeeds Balcão Nacional do Arrendamento (procedimento especial de despejo) and the injunção em matéria de arrendamento (IMA) service | Lei 56/2023; regulated by Portaria n.º 49/2024, 15-02-2024 | https://files.diariodarepublica.pt/1s/2024/02/03300/0001000056.pdf | 2026-09-12 | primary |
| Online access | Forms/models at https://tribunais.org.pt | Portaria 49/2024 | same | 2026-09-12 | primary |
| Julgados de paz | Competent for **arrendamento urbano disputes except despejo**, value **≤ 15 000 €** | Lei 78/2001 arts. 8.º, 9.º n.º 1 g) (red. Lei 54/2013) | https://diariodarepublica.pt/dr/legislacao-consolidada/lei/2001-56735875 | 2026-09-12 | primary |

---

## Open points

1. **2027 coefficient**: INE figure 2,56 % is primary; the DR Aviso (deadline 30-10-2026) was not yet found. Show 1,0256 as provisional; re-check DR after publication.
2. ~~Código Civil articles on mirror only~~ — **resolved**: read on DRE consolidated CC (primary). Watch for any 2026/2027 housing law that amends arts. 1094.º–1104.º.
3. **Mais Habitação vs caução**: the 2-month caução and 2-month advance cap come from **Lei 24-D/2022 (OE 2023)**, not Lei 56/2023. Brief assumption in the task was wrong on origin, right on values.
4. **10 % rate vs long-contract reductions** — **resolved for the calculator** as `min(10 %, art. 72.º rate)` (see section 3). Footnote only: confirm when AT publishes an ofício-circulado / FAQ on EBF 45.º-C.
5. **Rents > 2 300 €**: 25 % (or reduced 72.º rates) still apply. Check whether the 2 300 € ceiling is updated for 2027 by portaria (DL 97/2026 art. 2.º n.º 3).
6. **RSAA portaria** (ceilings per tipologia per concelho) not published at 2026-09-07 (press). Without it the RSAA exemption cannot be used in practice.
7. **References to PAA limits after 1-9-2026**: CIRS 72.º n.º 23 (Portaria 176/2019) and Porta 65 RMR (DL 68/2019 art. 10.º) now read as RSAA art. 4.º limits (DL 97/2026 art. 14.º b)). Until the RSAA portaria exists, the practical limits are unclear.
8. **Tenant deduction middle band** (78.º-E n.º 4 b)) in 2025/2026 phasing + 900 € floor: AT has not published a worked example; model carefully or show only the general and low-income caps.
9. **Apoio extraordinário 2026 income limit**: "tabela em vigor à data da atribuição" — attribution for 2026 was in Nov 2025 → possibly the 2025 table limit, not 43 090 €. Confirm with IHRU guide.
10. **Porta 65 Jovem escalões (%)** and the 2026 "Rendas máximas por município" PDF not extracted (Portaria 277-A/2010 red. Portaria 238/2024/1). Needed for a subsidy calculator.
11. **Recibos eletrónicos dispensa**: wording from AT FAQ via summary; confirm Portaria 98-A/2015 text (2 × IAS threshold basis: annual rents).
12. ~~Julgados de paz from mirror~~ — **resolved**: DRE consolidated Lei 78/2001 (primary).
13. **Low-income tenant cap 2026 (1 050 € vs 900 €)** is an interpretation (see section 4). Re-check the AT IRS 2026 simulator / Modelo 3 instructions in 2027.
