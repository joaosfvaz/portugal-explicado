const PARTY_SHORT: Record<string, string> = {
  "PPD/PSD": "PSD",
  "B.E.": "BE",
  "CDS-PP": "CDS",
  CH: "Chega",
  L: "Livre",
  "PCP-PEV": "CDU",
  "R.I.R.": "RIR",
  VP: "Volt",
};

/** Readable name for a party or coalition sigla: "PPD/PSD.CDS-PP" becomes "PSD/CDS". */
export function shortSigla(sigla: string): string {
  if (PARTY_SHORT[sigla]) return PARTY_SHORT[sigla];
  return sigla
    .split(/[./]/)
    .filter((part, i, all) => !(part === "PPD" && all[i + 1] === "PSD"))
    .map((part) => PARTY_SHORT[part] ?? PARTY_SHORT[`PPD/${part}`] ?? part)
    .join("/");
}

export function slugify(name: string): string {
  return name
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

/** "VILA NOVA DE GAIA" becomes "Vila Nova de Gaia". */
export function titleCase(name: string): string {
  const small = new Set(["de", "da", "do", "das", "dos", "e"]);
  const parts = name.toLowerCase().split(/(\s+|-)/);
  return parts
    .map((w, i) => {
      const afterHyphen = parts[i - 1] === "-";
      if (i > 0 && (small.has(w) || (afterHyphen && (w === "o" || w === "a")))) return w;
      return w.charAt(0).toUpperCase() + w.slice(1);
    })
    .join("");
}
