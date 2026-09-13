# Brand identity: "Azulejo e cal"

Status: **applied** to the whole site. Brand guide at `/marca` (not in the menu, `noindex`).
Last updated: 2026-09-13

## Idea

The country reaches people in pieces: laws, taxes, numbers. Portugal Explicado takes each piece and shows where it fits.
An azulejo says the same thing: one simple tile, repeated, makes a whole panel. Azulejos are also public art, made to be
seen by everyone. The identity is sober, Portuguese without being touristic, and neutral.

Avoid: mascots, cartoons, smiling objects, souvenir imagery, party colours, red/green as good/bad, shadows, glass, gradients.

## Logo

- **Mark** (`Mark` in `src/components/brand/tiles.tsx`): one tile on a 40 grid. Four petals point to the edges; four quarter
  circles sit in the corners, so marks placed side by side join into circles. Minimum size 16 px. No rotation, rounding or shadow.
- **Wordmark**: EB Garamond 500, "Portugal *Explicado*" (the second word in italic of the same family).
- **Lockup** (`Lockup`): mark + wordmark, optional uppercase tagline "Leis, contas e instituições, com fonte".
- Inverse: on cobalt, swap `--mark-ground` and `--mark-ink`.

## Colour

One accent. Tokens live on `:root` in `globals.css`; `.marca-dia` and `.marca-noite` force each palette for previews.

| Token | Name | Light | Dark | Use |
| --- | --- | --- | --- | --- |
| `--foreground` | Tinta | `#16213d` | `#e6e9f0` | Text, titles (15.5:1 on surface) |
| `--accent` | Cobalto | `#1b3d8f` | `#94b1f5` | Links, buttons, tiles, charts (9.7:1) |
| `--accent-soft` | Lavado | `#e4e9f4` | `#1b2748` | Neutral notices, selection |
| `--background` | Cal | `#f3f4f1` | `#0c1222` | Page ground |
| `--surface` | Faiança | `#fcfcfb` | `#131a2e` | Cards, tables, panels |
| `--muted` | Pedra | `#4a5470` | `#aab3c7` | Secondary text (7.3:1 on surface; raised for older readers) |
| `--tile-wash` | | `#d5deef` | `#22305a` | Second tone inside tiles |
| `--tile-grout` | | `#c9d0de` | `#273150` | Joints between tiles |

`--warn` (ochre) and `--danger` (brick red) are for states only. Vote colours keep the current rule
(favor = accent, contra = danger, no party colours). The warm tokens `--sun`, `--custard`, `--crust`, `--caramel` are retired.

## Type

- Display: **EB Garamond 500** for page and section titles and for headline figures (`.figures`: lining + tabular numerals).
- Text and UI: **Geist**. Body 17 px / 1.65, max 65 characters per line. Tables 14 px with tabular numerals.
- Labels: Geist 11 px, uppercase, 0.14em tracking.

## Tiles

Six seamless patterns on a 100 grid (`TILES`), one per section (`SECTION_TILE`):

| Tile | Section |
| --- | --- |
| Rosácea | Início, O Estado |
| Ponta de diamante | Economia |
| Casca de laranja | Impostos |
| Estrela | Parlamento |
| Quadrifólio | Casa |
| Onda (Rossio calçada wave) | Vida e burocracia |

Plus `Cercadura`, a border band used as a rule between major parts of a page.

Rules: tiles are structure, at full colour, inside panels with defined edges (page header, cover, card corner, footer).
Never behind text. Always `aria-hidden`. Functional icons stay Phosphor.

## Shape

- Corners 2 px (`rounded-sm`) on cards, buttons and fields; tiles are square.
- 1 px rules instead of shadows. Grouped cards and tables join with 1 px gaps, like grout.

## Implementation

- `HeaderFrame` / `PageHeader` (`src/components/ui.tsx`): every page header has the section tile panel at the right
  (chosen from the URL by `HeaderTile`, or the `tile` prop) and a `Cercadura` below.
- Top bar and footer use `Lockup`. Home hero uses a Rosácea panel; home section cards carry their tile in the corner.
- Favicon: `src/app/icon.svg` (the mark); `src/app/apple-icon.tsx` rasterises it at 180 px.
- The figurative illustrations (`illustrations.tsx`), the watermark pattern and the warm tokens were removed.
