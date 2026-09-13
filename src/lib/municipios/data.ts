import { readSnapshot } from "@/lib/snapshots";
import type { MunicipiosSnapshot } from "./types";

export function getMunicipios(): MunicipiosSnapshot | null {
  return readSnapshot<MunicipiosSnapshot>("municipios.json");
}

export function getMunicipio(slug: string) {
  return getMunicipios()?.municipios.find((m) => m.slug === slug) ?? null;
}
