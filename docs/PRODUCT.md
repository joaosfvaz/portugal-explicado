# Portugal Explicado — Product Document

_Status: Phases 1–5 built (first version, no AI features) · Last updated: 2026-09-13 · Data sources: [DATA-SOURCES.md](DATA-SOURCES.md)_

## 1. Vision

One place that explains how Portugal works — the state, the economy, the laws being made, and the money rules that affect every resident — in plain Portuguese (and later English), with every fact linked to an official source.

Official information exists, but it is scattered across dozens of portals (Parlamento, Diário da República, Portal das Finanças, Segurança Social, INE, Banco de Portugal, câmaras municipais) and written for specialists. Portugal Explicado turns that into pages a normal person can read in five minutes and calculators they can trust.

### Principles

1. **Every fact has a source and a date.** Each number, rule or status shows where it came from and when it was last checked.
2. **Refuse rather than guess.** If a tax year has no verified data, the calculator says so. If a law status cannot be derived, the page shows the raw event trail instead of a badge.
3. **Neutral.** Parties, deputies and laws are presented with the same structure and the same wording rules. No editorial opinion.
4. **Explain, don't advise.** Calculators are estimates for understanding. They do not replace an accountant, a lawyer or the Autoridade Tributária.
5. **Snapshot, don't proxy.** Public data sources are slow and sometimes down. The app imports them on a schedule and serves pages from its own snapshot.

## 2. Audience

| Segment | Main need | Typical entry point |
|---|---|---|
| Young workers (18–35) | Understand IRS, IRS Jovem, net salary | Google: "simulador IRS Jovem", "escalões IRS 2026" |
| Families | Taxes, deductions, benefits, housing costs | Google, word of mouth |
| Recent immigrants | How the state and taxes work, bureaucracy steps | Google in English, expat groups |
| Students and new voters | How parliament and elections work | School, social media |
| Curious citizens, journalists, teachers | What parliament is doing, economic indicators | Direct, newsletter |

## 3. Product structure (full vision)

| Section | Content | Phase |
|---|---|---|
| **Dinheiro e Impostos** | IRS brackets explainer, IRS Jovem checker, IRS simulator, Segurança Social, IVA/IMI/IMT | 1, 1b |
| **Parlamento e Leis** | Pending and approved initiatives, votes per party, deputies, seat distribution, weekly new laws from Diário da República | 2 |
| **Economia** | Dashboard of key indicators with history and EU comparison | 3 |
| **Casa** | Build-a-house cost estimator and licensing guide, buy-a-house calculator, rent rules | 4 |
| **Vida e Burocracia** | Step guides (NIF, Cartão de Cidadão, AIMA, company, car), benefits eligibility, AI assistant with citations | 5 |
| **O Estado** | Institutions explainer: President, Assembleia, Government, courts, regions, municípios, freguesias | 5 (content), partly in 2 |

This document specifies Phases 1–3 in detail. Phases 4–5 are listed for context.

## 4. Phase 1 — Dinheiro e Impostos

### 4.1 Scope decision

A full "net salary / IRS simulator" must model the mínimo de existência, the dedução específica, all deduções à coleta with income-dependent global caps, joint taxation, the adicional de solidariedade and regional tables. A simulator that silently omits any of these produces numbers that are wrong by hundreds of euros — and users act on them.

Phase 1 therefore ships the parts that can be exactly right with verified data, and names the rest as Phase 1b:

| Feature | Phase |
|---|---|
| IRS brackets explainer (mainland), with marginal vs average rate | 1 |
| Tax on a given taxable income (rendimento coletável) — exact progressive calculation | 1 |
| IRS Jovem eligibility checker + exemption per year + exempt amount (capped) | 1 |
| IRS Jovem saving in euros (needs mínimo de existência and the full coletável chain) | 1b |
| Year selector (only years with verified data files) | 1 |
| Dedução específica and Segurança Social explainer (employee) | 1 |
| Full IRS simulator (gross → coletável → coleta → deductions → final tax) | 1b |
| Category B (recibos verdes) simplified regime | 1b |
| Madeira and Azores tables | 1b |
| Withholding tax (retenção na fonte) monthly estimate | 1b |

### 4.2 Pages

- `/impostos` — hub: what IRS is, how brackets work, links to tools.
- `/impostos/escaloes-irs` — table of brackets for the selected year, an interactive "slice" chart showing how income is split across brackets, marginal vs average rate explained with examples, change vs the previous year.
- `/impostos/calculadora-escaloes` — input: rendimento coletável and year. Output: tax per bracket, total, average rate, marginal rate. Clear note that this is tax _before_ deductions à coleta.
- `/impostos/irs-jovem` — rules explained, then a checker:
  - Inputs: year of birth, tax year, first year with Category A/B income (as non-dependent), expected income, whether the person was a dependent in any year.
  - Output: eligible or not (with reason), which benefit year they are in, exemption % for that year, exempt amount (capped), and a timeline of all benefit years.
- `/impostos/seguranca-social` — employee and employer rates, self-employed basics.
- `/fontes` — global list of every source used, with last check date.

### 4.3 Data model

Yearly values live in versioned JSON files committed to the repo, validated with a schema at build time:

```
data/tax/2025.json
data/tax/2026.json
```

Each numeric value carries provenance:

```json
{
  "value": 0.13,
  "legalBasis": "Art. 68.º CIRS, redação da Lei n.º …",
  "sourceUrl": "https://…",
  "verifiedOn": "2026-09-12",
  "verification": "primary"
}
```

Rules:

- Only values with `verification: "primary"` are used by calculators. `secondary` values may appear in explanatory text marked "a confirmar"; `uncertain` values are never shown as facts.
- If `data/tax/{year}.json` is missing or incomplete, the calculator shows "Ainda não temos dados verificados para {year}" — it never falls back to another year.
- The page footer shows the legal basis and verification date of the values used.

### 4.4 Calculation engine

Pure TypeScript functions in `src/lib/tax/`, no UI dependency, unit-tested against worked examples from official or reputable published examples:

- `taxByBrackets(income, brackets)` → per-bracket breakdown, total, average and marginal rate.
- `irsJovem(input, rules)` → eligibility, benefit year, exemption rate, exempt amount, cap applied.
- No euro saving in Phase 1. It is wrong by hundreds of euros without the mínimo de existência (art. 70.º), so it moves to the Phase 1b simulator.

## 5. Phase 2 — Parlamento e Leis

### 5.1 Features

| Feature | Description |
|---|---|
| Initiatives list | All legislative initiatives of the current legislature: projetos de lei, propostas de lei, projetos de resolução. Filters: type, author/party, status, date. Search by title. |
| Initiative page | Title, type, number, authors, dates, derived status, **full event trail** (every phase with date), votes with result per party, links to official text and DR publication. |
| Status derivation | Pending / approved in final global vote / rejected / published in DR / withdrawn / lapsed. Derived from the event list with explicit, documented rules. The raw trail is always visible so a wrong derivation is auditable. |
| Votes | Per vote: date, subject, result, parties in favour / against / abstained, as recorded in the official data. |
| Parties and seats | Seat distribution of the current legislature; per party: initiatives authored, voting pattern summary. |
| Deputies | List with party, electoral circle, status; deputy page with authored initiatives. |
| "Novo no Diário da República" | Daily list of Série I acts (Leis, Decretos-Lei, Portarias…) with official sumário and link. |
| "Esta semana" | Weekly digest page: initiatives that changed status + new Série I laws. |

### 5.2 Content rule for v1

Summaries use the **official sumário / title text only**. AI-generated plain-language summaries are deferred to Phase 5, when every summary can carry citations and a review process.

### 5.3 Data pipeline

- Scheduled import script (daily) downloads the official open data files server-side, normalises them, derives statuses and writes a snapshot (`data/snapshots/parlamento/*.json`).
- Pages read only the snapshot. Each page shows "Dados do Parlamento importados em {date}".
- Import is idempotent and keeps the previous snapshot if a download or parse fails.

## 6. Phase 3 — Economia

### 6.1 Dashboard

One page `/economia` with indicator cards (latest value, period, change) and a detail page per indicator with history chart, definition, source and EU/Spain comparison where available.

| Group | Indicators |
|---|---|
| Growth | GDP real growth, GDP per capita (PPS, vs EU27 and Spain) |
| Prices | Inflation (CPI / HICP) annual and monthly |
| Jobs and income | Unemployment rate, average earnings, minimum wage history |
| Public finances | Public debt % GDP, budget balance % GDP, 10-year bond yield |
| Housing | House price index, bank valuation per m², construction cost index for new housing, mortgage rates |
| People | Resident population |

### 6.2 Data pipeline

Same pattern as Phase 2: scheduled server-side import from INE, Banco de Portugal (BPstat) and Eurostat into `data/snapshots/economia/*.json`; pages render from the snapshot; each chart credits its source and shows the import date.

## 7. Technical architecture

| Concern | Choice | Reason |
|---|---|---|
| Framework | Next.js 16 (App Router), TypeScript | SEO-friendly server rendering; most traffic arrives from search |
| Styling | Tailwind CSS 4 | Fast, consistent UI |
| Tax data | Versioned JSON in repo + schema validation | Changes yearly, must be reviewable in code review |
| Parliament / economy data | Import scripts → JSON snapshots | Sources are slow, may lack CORS, may be down |
| Scheduling | Cron (e.g. GitHub Actions or host cron) running `npm run import:*` then redeploy/revalidate | Simple, observable |
| Charts | Lightweight SVG components | No heavy client bundle |
| Tests | Unit tests for tax engine and status derivation | The two places where being wrong hurts users |
| Language | Portuguese UI first; code and data keys in English; i18n-ready structure | Main audience first |

A database (e.g. Postgres) becomes useful when search, history of changes over time or user features arrive; JSON snapshots are enough for Phases 1–3.

## 8. Trust and legal

- Footer on every page: "Informação explicativa. Não substitui aconselhamento profissional nem as fontes oficiais."
- Every data page: source links + import/verification date.
- Neutrality rules for Phase 2: identical layout for all parties, alphabetical or seat-order lists, no adjectives on votes or laws.
- Licences and attribution for each open data source recorded in `docs/DATA-SOURCES.md`.

## 9. Success metrics

| Metric | Phase 1 target (first 3 months after launch) |
|---|---|
| Organic search visits to tax pages | Growth month over month during IRS season (April–June) |
| Calculator completions | > 40% of visitors to a calculator page |
| Reported errors in tax data | 0 unresolved for more than 48 h |
| Data freshness (Phases 2–3) | Snapshot age < 36 h on 95% of days |

## 10. Roadmap

| Phase | Deliverable |
|---|---|
| 1 | Tax hub, brackets explainer and calculator, IRS Jovem checker, Segurança Social page, sources page |
| 2 | Parliament initiatives, status derivation with event trail, votes, parties, deputies, Diário da República daily list |
| 3 | Economy dashboard and indicator pages |
| 1b | Full IRS simulator, Category B, regions, withholding |
| 4 | Housing: buy cost and mortgage simulator, building guide and cost estimator, renting rules and calculators — **built** |
| 5 | State institutions content, life-admin guides, benefit calculators, English guides — **built**. AI assistant and per-initiative plain-language summaries: **deferred** |
| 5c | Everyday help for readers with little formal education: "Para mim", glossary with inline explanations, net salary calculator, payslip explainer, labour rights, pension explainer, "Vou…" checklists, deadlines calendar with calendar files, help contacts, município pages, "O que mudou" with RSS, text size control, share button, simple calculator mode — **built** |
| 6 | Easy navigation: menu by task with plain names and at most six links per group, site-wide search with everyday words and accent-free matching, task-first home page, page trail and "A seguir" links on every page, section tabs only below `lg` — **built**. Testing the names with real readers: **not done** |
| 5b | Elections (most recent result of each type, from CNE mapas oficiais) and IRS explainers (how IRS works; tax by income type and savings product) — **built** |

## 11. Open questions

- Hosting and schedule runner (Vercel + GitHub Actions cron is the default assumption).
- Whether to publish a public "reportar erro" form per page from day one.
- Brand name and domain.
