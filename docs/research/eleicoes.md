# Eleições: research notes (2026-09-13)

Data in `src/content/eleicoes.ts`. All numbers come from CNE mapas oficiais (Diário da República).

| Election | Mapa oficial |
| --- | --- |
| Presidenciais 2026, 1.º sufrágio (18 Jan) | Mapa Oficial n.º 1-A/2026 — https://www.cne.pt/sites/default/files/dl/eleicoes/2026_pr/docs_geral/2026_pr_1-sufragio_mapa_oficial_dr.pdf |
| Presidenciais 2026, 2.º sufrágio (8 Feb) | Mapa Oficial n.º 1/2026 — https://www.cne.pt/sites/default/files/dl/eleicoes/2026_pr/docs_geral/2026_pr_2-sufragio_mapa_oficial_dr.pdf |
| Legislativas 2025 (18 May) | Mapa Oficial n.º 2-A/2025 — https://www.cne.pt/sites/default/files/dl/eleicoes/2025_ar/2025_ar_mapa_oficial_dr.pdf |
| Legislativas 2024 (previous seats) | Mapa Oficial n.º 2-A/2024 — https://www.cne.pt/sites/default/files/dl/2024_ar_mapa_oficial_dr.pdf |
| Europeias 2024 (9 Jun) | Mapa Oficial n.º 4/2024 — https://www.cne.pt/sites/default/files/dl/eleicoes/2024_pe/docs_geral/2024_pe_mapa_oficial_resultados_dr.pdf |
| Autárquicas 2025 (12 Oct) | Mapa Oficial n.º 2-B/2025 + retificações n.º 11/2026/1 and n.º 14/2026/1; spreadsheet zip https://www.cne.pt/sites/default/files/dl/eleicoes/2025_al/docs_geral/2025al-mapa-oficial_retificado.zip |
| Autárquicas 2021 (previous) | Mapa Oficial n.º 1-B/2021 zip — https://www.cne.pt/sites/default/files/dl/2021al_mapa_oficial.zip |
| Regionais Açores 2024 (4 Feb) | Mapa Oficial n.º 1-B/2024 |
| Regionais Madeira 2025 (23 Mar) | Mapa Oficial n.º 2/2025 |
| Referendo 2007 (11 Feb) | Mapa Oficial n.º 1/2007 |

## Derived figures (marked "derived" in the app)

- Autárquicas: CNE publishes results per município only. Câmaras by party (2025 and 2021) are counts of the most-voted
  Câmara Municipal list in each of the 308 municípios, from part II of the retificado spreadsheet. Groups "PSD e coligações"
  (136 / 113) and "PS e coligações" (128 / 149) join every sigla that includes the party.
- Autárquicas turnout 59.29%, inscritos, brancos and nulos are sums over the 308 CM rows.
- Legislativas: the combined PSD/CDS total (91 seats, 2 008 488 votes) is a sum of two official rows. The 2024 AD figure (77)
  covers different círculos than the 2025 AD list (see notes in content).

## Open questions

- Check the autárquicas counts against an SGMAI or ANMP national total if one is published.
- In mapa_1 retificado, vote columns are shifted in the corrected rows for CM Sernancelhe and CM Porto Moniz (part II used).
- Europeias 2019, Açores 2020 and Madeira 2024 seats were not collected, so no seat change is shown for those.
- Check whether any LEOAL amendment after 2021 created voto antecipado em mobilidade for autárquicas.
