import { MEAL_ALLOWANCE_2026, RETENTION_2026, SOCIAL_SECURITY_2026, type RetentionRow } from "./rules-2026";

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Months with meal allowance in a year: 12 minus one month of holidays. The page states this assumption. */
export const MEAL_MONTHS = 11;

export type Household = "nao-casado" | "casado-dois" | "casado-um";

export type SalaryInput = {
  /** Gross monthly base pay, in euros. */
  gross: number;
  household: Household;
  dependents: number;
  /** Meal allowance per working day, in euros. 0 when there is none. */
  mealPerDay: number;
  mealDays: number;
  mealPaidBy: "dinheiro" | "cartao";
};

export type SalaryResult = {
  table: keyof typeof RETENTION_2026;
  row: RetentionRow;
  mealTotal: number;
  mealExempt: number;
  mealTaxable: number;
  /** Pay that counts for IRS and Social Security: gross plus the taxable part of the meal allowance. */
  taxableBase: number;
  socialSecurity: number;
  irs: number;
  irsEffectiveRate: number;
  net: number;
  employerSocialSecurity: number;
  employerCost: number;
  /** Net in a month when the holiday or Christmas subsidy is also paid (same amount as the base pay). */
  netWithSubsidy: number;
  /** 12 salaries and 2 subsidies, with the meal allowance in MEAL_MONTHS of the 12 months. */
  netYear: number;
};

export function retentionTable(household: Household, dependents: number): keyof typeof RETENTION_2026 {
  if (household === "casado-um") return "III";
  if (household === "nao-casado" && dependents > 0) return "II";
  return "I";
}

export function findRow(rows: readonly RetentionRow[], pay: number): RetentionRow {
  return rows.find((r) => r.upTo === null || pay <= r.upTo)!;
}

/** Monthly IRS withheld (Despacho n.º 233-A/2026, n.º 3 and n.º 5 h)), rounded to the cent. */
export function monthlyRetention(pay: number, table: keyof typeof RETENTION_2026, dependents: number): { irs: number; row: RetentionRow } {
  const row = findRow(RETENTION_2026[table], pay);
  if (row.rate === 0 || pay <= 0) return { irs: 0, row };
  const rate = dependents >= 3 ? row.rate - 0.01 : row.rate;
  const deduct = row.deduct.type === "constant" ? row.deduct.value : row.deduct.rate * row.deduct.factor * (row.deduct.base - pay);
  const value = pay * rate - deduct - row.perDependent * dependents;
  return { irs: Math.max(0, round2(value)), row };
}

export function netSalary(input: SalaryInput): SalaryResult {
  const gross = Math.max(0, input.gross);
  const dependents = Math.max(0, Math.floor(input.dependents));
  const table = retentionTable(input.household, dependents);

  const days = Math.max(0, Math.floor(input.mealDays));
  const perDay = Math.max(0, input.mealPerDay);
  const limit = input.mealPaidBy === "cartao" ? MEAL_ALLOWANCE_2026.card : MEAL_ALLOWANCE_2026.cash;
  const mealTotal = round2(perDay * days);
  const mealTaxable = round2(Math.max(0, perDay - limit) * days);
  const mealExempt = round2(mealTotal - mealTaxable);

  const taxableBase = round2(gross + mealTaxable);
  const socialSecurity = round2(taxableBase * SOCIAL_SECURITY_2026.worker);
  const { irs, row } = monthlyRetention(taxableBase, table, dependents);
  const net = round2(taxableBase - socialSecurity - irs + mealExempt);

  // Subsidies are withheld separately (CIRS art. 99.º-C n.º 5), so a subsidy equal to the base pay
  // has the same discounts as the base pay.
  // A month without meal allowance has the same discounts as the base pay alone.
  const subsidy = monthlyRetention(gross, table, dependents);
  const baseNet = round2(gross - round2(gross * SOCIAL_SECURITY_2026.worker) - subsidy.irs);
  const subsidyNet = baseNet;

  const employerSocialSecurity = round2(taxableBase * SOCIAL_SECURITY_2026.employer);

  return {
    table,
    row,
    mealTotal,
    mealExempt,
    mealTaxable,
    taxableBase,
    socialSecurity,
    irs,
    irsEffectiveRate: taxableBase > 0 ? irs / taxableBase : 0,
    net,
    employerSocialSecurity,
    employerCost: round2(taxableBase + employerSocialSecurity + mealExempt),
    netWithSubsidy: round2(net + subsidyNet),
    netYear: round2(net * MEAL_MONTHS + baseNet * (12 - MEAL_MONTHS) + subsidyNet * 2),
  };
}
