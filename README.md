# Portugal Explicado

Taxes, Parliament, laws and the economy of Portugal explained in plain Portuguese, with every number linked to an official source.

- Product document: [docs/PRODUCT.md](docs/PRODUCT.md)
- Data sources, verification and import rules: [docs/DATA-SOURCES.md](docs/DATA-SOURCES.md)

## What is built

| Phase | Pages |
|---|---|
| 1. Impostos | `/impostos`, `/impostos/como-funciona-o-irs`, `/impostos/tipos-de-rendimento`, `/impostos/escaloes-irs`, `/impostos/calculadora-escaloes`, `/impostos/irs-jovem`, `/impostos/seguranca-social` |
| 2. Parlamento e leis | `/parlamento`, `/parlamento/iniciativas` (filters, search), `/parlamento/iniciativas/[id]` (event trail, votes per party), `/parlamento/partidos`, `/parlamento/diario-republica` |
| 3. Economia | `/economia`, `/economia/[slug]` (16 indicators incl. fuel prices, PT vs ES vs EU, plain-language context) |
| 4. Casa | `/casa`, `/casa/comprar`, `/casa/construir`, `/casa/arrendar` (calculators) |
| 5. Estado e vida | `/para-mim`, `/glossario`, `/o-que-mudou`, `/trabalho/*` (salário líquido, recibo, direitos, reforma), `/vida/vou/[id]`, `/vida/prazos`, `/vida/ajuda`, `/estado/municipios/[slug]`, `/estado`, `/estado/eleicoes`, `/estado/eleicoes/[id]`, `/estado/[slug]`, `/vida`, `/vida/[slug]`, `/vida/abono-de-familia`, `/vida/subsidio-de-desemprego`, `/en` (English guides) |
| 6. Navegação | `/pesquisa` (site search), `/o-pais` and `/trabalho` (overview pages), page trail and "A seguir" links on every page |
| | `/fontes` lists every source with its verification or import date |

The menu (`src/lib/nav.ts`) is arranged by what readers want to do, not by URL: for example `/trabalho/salario-liquido` sits under "Salário e impostos" and `/vida/burlas` under "Ajuda e proteção". URLs never move. Each group shows at most six links; the rest are marked `hidden` and listed on the group's overview page. `src/content/paginas.ts` holds the plain title, summary, search keywords and "A seguir" links of each fixed page; `src/lib/search/index.ts` adds guides, checklists, glossary words, indicators, elections, deadlines and municípios to the search.

## Run locally

```bash
npm install
npm run dev
```

## Data

Tax values are versioned by hand in `data/tax/{year}.json`. Only `primary` and `derived` values reach the calculators.

Parliament and economy data are imported into `data/snapshots/` and pages render from those files:

```bash
npm run import:parlamento   # AR open data (downloads ~95 MB; OFFLINE=1 reuses data/raw)
npm run import:dr           # Diário da República Série I feed (run daily: it only holds the latest issue)
npm run import:economia     # Eurostat, Banco de Portugal, EC Weekly Oil Bulletin and DGEG
npm run import              # all three
```

`.github/workflows/import-data.yml` runs the imports every day and commits the changed snapshots.

## Checks

```bash
npm test          # tax engine, IRS Jovem (AT leaflet cases), vote parser, status rules, RSS and JSON-stat parsers
npx tsc --noEmit
npm run lint
npm run build
```

## Adding a new tax year

1. Create `data/tax/{year}.json` from the previous year.
2. Update every value from the Orçamento do Estado and the Portal das Finanças, with `sourceUrl`, `legalBasis`, `verifiedOn` and `verification`.
3. Run `npm test`. The loader checks the schema, the bracket order and that the IRS Jovem cap equals 55 × IAS.
