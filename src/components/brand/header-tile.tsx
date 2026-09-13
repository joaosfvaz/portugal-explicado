"use client";

import { usePathname } from "next/navigation";
import { TilePanel, sectionTile, type TileName } from "./tiles";

/** The page header's tile panel. Uses the tile of the current section unless one is given. */
export function HeaderTile({ tile }: { tile?: TileName }) {
  const pathname = usePathname();
  const motif = tile ?? sectionTile(pathname) ?? "rosacea";
  return <TilePanel id="page-header-tile" name={motif} size={56} />;
}
