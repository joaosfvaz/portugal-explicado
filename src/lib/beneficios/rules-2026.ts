/**
 * Benefit values for 2026, read in the Portarias and in the Instituto da Segurança Social guides.
 * Sources and verification notes are in docs/DATA-SOURCES.md.
 */
export const IAS = { 2024: 509.26, 2025: 522.5, 2026: 537.13 } as const;
export const RMMG_2026 = 920;

export const ABONO_2026 = {
  /** Upper limits of each escalão as multiples of IAS × 14 (DL 176/2003 art. 14.º, as amended by DL 56/2022). */
  escaloes: [0.5, 1, 1.7, 2.5],
  /** Monthly amounts, Portaria n.º 60/2026/1 art. 2.º n.º 1. Index = escalão − 1. */
  upTo36Months: [190.98, 161.65, 132.07, 88.43],
  from36To72Months: [75.13, 75.13, 59.33, 44.77],
  over72Months: [75.13, 75.13, 54.35, 0],
  singleParentBonus: 0.5,
  /** Garantia para a Infância: annual reference value (Portaria 60/2026/1 art. 5.º) and eligibility threshold (× IAS × 14). */
  garantiaAnnual: 1528,
  garantiaThreshold: 0.35,
  assetLimit: 128_911.2,
  sources: [
    { title: "Portaria n.º 60/2026/1 (montantes do abono de família 2026)", url: "https://files.diariodarepublica.pt/1s/2026/02/02500/0001600019.pdf" },
    { title: "Instituto da Segurança Social, Guia Prático do Abono de família (julho 2026)", url: "https://www.seg-social.pt/ptss/pssd/documento/cmc1z3qdt00j1kl2ya2677byz" },
  ],
} as const;

export const DESEMPREGO_2026 = {
  rate: 0.65,
  minimum: 537.13,
  /** 1,15 × IAS when the salaries used are at least the minimum wage (value in the ISS guide; legal article not identified). */
  minimumIfSalaryAtLeastRmmg: 617.7,
  maximum: 1342.83,
  netCap: 0.75,
  bonus: 0.1,
  guaranteeDays: 360,
  /** Duration in days (DL 220/2006 art. 37.º, Quadro I), by age band and months with registered salaries. */
  duration: [
    { maxAge: 29, days: [150, 210, 330], extraPer5Years: 30 },
    { maxAge: 39, days: [180, 330, 420], extraPer5Years: 30 },
    { maxAge: 49, days: [210, 360, 540], extraPer5Years: 45 },
    { maxAge: Infinity, days: [270, 480, 540], extraPer5Years: 60 },
  ],
  sources: [{ title: "Instituto da Segurança Social, Guia Prático do Subsídio de Desemprego (julho 2026)", url: "https://www.seg-social.pt/ptss/pssd/documento/cmc0debv9008agw2ys1kly9so" }],
} as const;
