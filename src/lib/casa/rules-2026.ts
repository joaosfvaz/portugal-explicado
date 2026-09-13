/**
 * Values for buying a home in mainland Portugal, 2026.
 * Sources and verification notes are in docs/DATA-SOURCES.md (section "Casa").
 */

export type ImtBracket = { upTo: number; rate: number; deduct: number; flat?: false } | { upTo: number; rate: number; flat: true };

const OVER = Number.POSITIVE_INFINITY;

/** CIMT art. 17.º, limits from Lei 73-A/2025 art. 83.º, parcelas from AT Ofício Circulado 40129/2026. */
export const IMT_2026 = {
  hpp: [
    { upTo: 106_346, rate: 0, deduct: 0 },
    { upTo: 145_470, rate: 0.02, deduct: 2126.92 },
    { upTo: 198_347, rate: 0.05, deduct: 6491.02 },
    { upTo: 330_539, rate: 0.07, deduct: 10457.96 },
    { upTo: 660_982, rate: 0.08, deduct: 13763.35 },
    { upTo: 1_150_853, rate: 0.06, flat: true },
    { upTo: OVER, rate: 0.075, flat: true },
  ] satisfies ImtBracket[],
  hppYoung: [
    { upTo: 330_539, rate: 0, deduct: 0 },
    { upTo: 660_982, rate: 0.08, deduct: 26443.12 },
    { upTo: 1_150_853, rate: 0.06, flat: true },
    { upTo: OVER, rate: 0.075, flat: true },
  ] satisfies ImtBracket[],
  secondary: [
    { upTo: 106_346, rate: 0.01, deduct: 0 },
    { upTo: 145_470, rate: 0.02, deduct: 1063.46 },
    { upTo: 198_347, rate: 0.05, deduct: 5427.56 },
    { upTo: 330_539, rate: 0.07, deduct: 9394.5 },
    { upTo: 633_931, rate: 0.08, deduct: 12699.89 },
    { upTo: 1_150_853, rate: 0.06, flat: true },
    { upTo: OVER, rate: 0.075, flat: true },
  ] satisfies ImtBracket[],
  /** CIMT art. 17.º n.º 10 (DL 97/2026): non-resident buyers of urban housing, no exemption. */
  nonResidentRate: 0.075,
};

export const SELO_2026 = {
  purchase: 0.008,
  /** Verba 17.1.3: credit with a term of 5 years or more. */
  loan: 0.006,
  /** Verba 17.3.4: bank commissions. */
  commissions: 0.04,
  /** CIS art. 7.º-A: deduction for young buyers, capped at 0,8% × 330 539 €. */
  youngDeductionCap: 2644.31,
};

export const REGISTO_2026 = {
  casaPronta: { purchaseOnly: 375, withMortgage: 700, youngPurchaseOnly: 150, youngWithMortgage: 250 },
  separate: { purchaseOnly: 250, withMortgage: 500, youngExemptUpTo: 330_539 },
};

/** Banco de Portugal, Recomendação Macroprudencial n.º 1/2026 (from 1 August 2026) and Instrução 23/2023. */
export const BDP_2026 = {
  ltvHpp: 0.9,
  ltvOther: 0.8,
  dsti: 0.45,
  maxYearsUpTo35: 40,
  maxYearsOver35: 35,
  /** Rate shock for variable-rate loans with a term over 10 years. */
  stressOver10Years: 0.015,
};

export const GARANTIA_PUBLICA = { maxAge: 35, priceCap: 450_000, share: 0.15, contractDeadline: "2026-12-31" };

export const IMI_2026 = { minRate: 0.003, maxRate: 0.0045, hppExemptionYears: 3, hppExemptionVptCap: 125_000, hppExemptionIncomeCap: 153_300 };

/** Rent update coefficients (NRAU art. 24.º). 2027 is provisional until the Aviso is published in Diário da República. */
export const RENT_COEFFICIENTS: { year: number; value: number; provisional: boolean }[] = [
  { year: 2025, value: 1.0216, provisional: false },
  { year: 2026, value: 1.0224, provisional: false },
  { year: 2027, value: 1.0256, provisional: true },
];

export const RENT_TAX_2026 = {
  general: 0.25,
  /** EBF art. 45.º-C (DL 97/2026): rents up to 2,5 × RMMG, income until 31-12-2029. */
  moderate: 0.1,
  moderateRentCap: 2300,
  /** Imposto do Selo on the contract: 10% of one month's rent (TGIS verba 2). */
  contractStampDuty: 0.1,
  /** Tenant deduction (CIRS art. 78.º-E): 15% of rent, capped. */
  tenantRate: 0.15,
  tenantCap: 900,
  /** Interpretation of the phased low-income cap for 2026; see docs. */
  tenantCapLowIncome: 1050,
};
