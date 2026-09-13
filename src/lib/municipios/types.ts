export type ListKind = "partido" | "coligacao" | "cidadaos";

export type CouncilList = {
  /** Sigla as written in the CNE mapa oficial, e.g. "PPD/PSD.CDS-PP". */
  sigla: string;
  /** Readable short name, e.g. "PSD/CDS". */
  short: string;
  kind: ListKind;
  pct: number;
  seats: number;
};

export type Municipio = {
  code: string;
  name: string;
  slug: string;
  district: string;
  /** Câmara Municipal results, most voted first. The first list's lead candidate is the presidente. */
  council: CouncilList[];
  councilSeats: number;
};

export type MunicipiosSnapshot = {
  importedAt: string;
  election: string;
  source: string;
  municipios: Municipio[];
};
