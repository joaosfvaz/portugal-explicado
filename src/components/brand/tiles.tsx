import type { ReactNode, SVGProps } from "react";
import { activeItem } from "@/lib/nav";

/**
 * Azulejo tile library. Each tile is drawn on a 100 × 100 grid and repeats without seams:
 * motifs that touch an edge are halves or quarters that complete in the next tile.
 * Lines use currentColor (the ink of the tile); fills use --tile-wash.
 * Decorative only: always hidden from screen readers.
 */

const WASH = "var(--tile-wash, var(--accent-soft))";

function lens(cx: number, cy: number, length: number, width: number, angle: number, fill: string) {
  const tip = cy - length;
  const mid = cy - length / 2;
  return (
    <path
      key={`${angle}-${length}`}
      d={`M${cx} ${cy} C${cx - width} ${mid + length / 4} ${cx - width} ${mid - length / 4} ${cx} ${tip} C${cx + width} ${mid - length / 4} ${cx + width} ${mid + length / 4} ${cx} ${cy}Z`}
      transform={`rotate(${angle} ${cx} ${cy})`}
      fill={fill}
    />
  );
}

/** Rosácea: eight-petal rosette. Corner quarters form a second flower where four tiles meet. */
function Rosacea() {
  return (
    <>
      {[0, 90, 180, 270].map((a) => lens(50, 50, 36, 9, a, "currentColor"))}
      {[45, 135, 225, 315].map((a) => lens(50, 50, 26, 7, a, WASH))}
      <circle cx="50" cy="50" r="7" fill={WASH} stroke="currentColor" strokeWidth="2.5" />
      {[
        [0, 0],
        [100, 0],
        [0, 100],
        [100, 100],
      ].map(([x, y]) => (
        <g key={`${x}${y}`}>
          <circle cx={x} cy={y} r="16" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx={x} cy={y} r="8" fill="currentColor" />
        </g>
      ))}
    </>
  );
}

/** Estrela: eight-point star from two squares, with quarter rings at the corners. */
function Estrela() {
  return (
    <>
      {[0, 45].map((a) => (
        <rect key={a} x="28" y="28" width="44" height="44" transform={`rotate(${a} 50 50)`} fill={a ? WASH : "none"} stroke="currentColor" strokeWidth="2.5" />
      ))}
      <circle cx="50" cy="50" r="11" fill="currentColor" />
      {[
        [0, 0],
        [100, 0],
        [0, 100],
        [100, 100],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="22" fill="none" stroke="currentColor" strokeWidth="2" />
      ))}
      {[
        [50, 0],
        [100, 50],
        [50, 100],
        [0, 50],
      ].map(([x, y]) => (
        <circle key={`e${x}${y}`} cx={x} cy={y} r="4" fill="currentColor" />
      ))}
    </>
  );
}

/** Ponta de diamante: nested diamonds; the corners complete into diamonds across tiles. */
function Diamante() {
  return (
    <>
      <path d="M50 3 97 50 50 97 3 50Z" fill={WASH} stroke="currentColor" strokeWidth="2" />
      <path d="M50 18 82 50 50 82 18 50Z" fill="none" stroke="currentColor" strokeWidth="2" />
      <path d="M50 34 66 50 50 66 34 50Z" fill="currentColor" />
      <path d="M0 0h14L0 14ZM100 0H86l14 14ZM0 100h14L0 86ZM100 100H86l14-14Z" fill="currentColor" />
    </>
  );
}

/** Casca de laranja: quarter arcs from each corner, the classic interlaced lattice. */
function Laranja() {
  return (
    <>
      <path d="M50 0A50 50 0 0 1 100 50 50 50 0 0 1 50 100 50 50 0 0 1 0 50 50 50 0 0 1 50 0Z" fill={WASH} />
      <path d="M0 50A50 50 0 0 0 50 0M50 0A50 50 0 0 0 100 50M100 50A50 50 0 0 0 50 100M50 100A50 50 0 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="9" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="3.5" fill="currentColor" />
      {[
        [0, 0],
        [100, 0],
        [0, 100],
        [100, 100],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="7" fill="currentColor" />
      ))}
    </>
  );
}

/** Quadrifólio: four-lobed flower around a turned square. */
function Quadrifolio() {
  return (
    <>
      {[
        [50, 31],
        [69, 50],
        [50, 69],
        [31, 50],
      ].map(([x, y]) => (
        <circle key={`${x}${y}`} cx={x} cy={y} r="17" fill={WASH} stroke="currentColor" strokeWidth="2.5" />
      ))}
      <path d="M50 38 62 50 50 62 38 50Z" fill="currentColor" />
      <path d="M0 18V0h18M82 0h18v18M100 82v18H82M18 100H0V82" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M0 8V0h8M92 0h8v8M100 92v8h-8M8 100H0v-8" fill="currentColor" stroke="currentColor" strokeWidth="4" />
    </>
  );
}

/** Onda: the wave of the Rossio pavement (calçada portuguesa), continuous across tiles. */
function Onda() {
  return (
    <>
      <path d="M0 30C25 12 25 12 50 30S75 48 100 30V50C75 68 75 68 50 50S25 32 0 50Z" fill="currentColor" />
      <path d="M0 80C25 62 25 62 50 80S75 98 100 80" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M0 0C25 -18 25 -18 50 0S75 18 100 0" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M0 100C25 82 25 82 50 100S75 118 100 100" fill="none" stroke="currentColor" strokeWidth="2.5" />
      <path d="M0 80C25 62 25 62 50 80S75 98 100 80V100C75 82 75 82 50 100S25 118 0 100Z" fill={WASH} />
    </>
  );
}

export const TILES = {
  rosacea: { name: "Rosácea", Tile: Rosacea },
  estrela: { name: "Estrela", Tile: Estrela },
  diamante: { name: "Ponta de diamante", Tile: Diamante },
  laranja: { name: "Casca de laranja", Tile: Laranja },
  quadrifolio: { name: "Quadrifólio", Tile: Quadrifolio },
  onda: { name: "Onda", Tile: Onda },
} as const;

export type TileName = keyof typeof TILES;

/** One tile per section, so each part of the site has its own panel. */
/** Tile of each menu group (ids from `NAV` in src/lib/nav.ts). */
export const SECTION_TILE: Record<string, TileName> = {
  inicio: "rosacea",
  pesquisa: "rosacea",
  "para-mim": "rosacea",
  dinheiro: "laranja",
  trabalho: "estrela",
  casa: "quadrifolio",
  papeis: "onda",
  ajuda: "estrela",
  pais: "diamante",
  mais: "laranja",
};

/** Tile for a path such as "/impostos/irs-jovem": the tile of its menu group. */
export function sectionTile(href: string): TileName | undefined {
  const group = activeItem(href)?.group.id ?? "inicio";
  return SECTION_TILE[group];
}

type SvgProps = SVGProps<SVGSVGElement>;

/** A single tile, square. */
export function Tile({ name, ...props }: { name: TileName } & SvgProps) {
  const { Tile: Motif } = TILES[name];
  return (
    <svg viewBox="0 0 100 100" aria-hidden focusable="false" overflow="hidden" {...props}>
      <Motif />
    </svg>
  );
}

/** A panel of repeated tiles. `size` is the tile edge in CSS pixels. `id` must be unique on the page. */
export function TilePanel({ name, size = 64, id, grout = true, ...props }: { name: TileName; size?: number; id: string; grout?: boolean } & SvgProps) {
  const { Tile: Motif } = TILES[name];
  const scale = size / 100;
  return (
    <svg width="100%" height="100%" aria-hidden focusable="false" {...props}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          <g transform={`scale(${scale})`}>
            <Motif />
            {grout && <path d="M0 0H100V100" fill="none" stroke="var(--tile-grout, var(--line))" strokeWidth={1 / scale} />}
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}

/** Cercadura: a border band of half tiles, used as a rule between major parts of a page. */
export function Cercadura({ id, height = 20, className = "" }: { id: string; height?: number; className?: string }) {
  const w = height * 2;
  return (
    <svg width="100%" height={height} className={className} aria-hidden focusable="false">
      <defs>
        <pattern id={id} width={w} height={height} patternUnits="userSpaceOnUse">
          <g transform={`scale(${height / 20})`}>
            <path d="M0 10 10 0 20 10 30 0 40 10 30 20 20 10 10 20Z" fill="var(--tile-wash, var(--accent-soft))" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="20" cy="10" r="2.5" fill="currentColor" />
            <circle cx="0" cy="10" r="2.5" fill="currentColor" />
            <circle cx="40" cy="10" r="2.5" fill="currentColor" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height={height} fill={`url(#${id})`} />
      <path d="M0 0.5H10000M0 19.5H10000" stroke="currentColor" strokeWidth="1" transform={`scale(1 ${height / 20})`} />
    </svg>
  );
}

/**
 * The mark: one azulejo. Four petals point to the edges, four quarter circles sit in the corners.
 * Set side by side, the corners join into full circles: many small pieces make one panel.
 */
export function Mark({ className = "", title }: { className?: string; title?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role={title ? "img" : undefined} aria-hidden={title ? undefined : true} aria-label={title}>
      <rect width="40" height="40" fill="var(--mark-ground, var(--accent))" />
      <g fill="var(--mark-ink, var(--on-accent))">
        {[0, 90, 180, 270].map((a) => (
          <path key={a} d="M20 20C16.2 16 16.2 10 20 5 23.8 10 23.8 16 20 20Z" transform={`rotate(${a} 20 20)`} />
        ))}
        <path d="M0 0h6A6 6 0 0 1 0 6ZM40 0v6A6 6 0 0 1 34 0ZM0 40v-6a6 6 0 0 1 6 6ZM40 40h-6a6 6 0 0 1 6-6Z" />
      </g>
      <circle cx="20" cy="20" r="3" fill="var(--mark-ground, var(--accent))" />
    </svg>
  );
}

/** Mark and name, set together. */
export function Lockup({ size = "md", tagline }: { size?: "sm" | "md" | "lg"; tagline?: ReactNode }) {
  const mark = { sm: "h-7 w-7", md: "h-10 w-10", lg: "h-12 w-12 sm:h-16 sm:w-16" }[size];
  const text = { sm: "text-lg", md: "text-2xl", lg: "text-[1.7rem] sm:text-4xl" }[size];
  return (
    <span className="inline-flex items-center gap-3">
      <Mark className={`${mark} shrink-0`} />
      <span className="flex flex-col">
        <span className={`font-display leading-none font-medium tracking-[-0.01em] whitespace-nowrap ${text}`}>
          Portugal <span className="italic">Explicado</span>
        </span>
        {tagline && <span className="mt-1.5 text-[11px] font-medium tracking-[0.14em] text-muted uppercase">{tagline}</span>}
      </span>
    </span>
  );
}
