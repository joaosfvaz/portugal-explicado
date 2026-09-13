import { RENT_TAX_2026 } from "./rules-2026";

/** Rent after one or more annual updates, rounded up to the next cent (NRAU art. 25.º). */
export function updatedRent(rent: number, coefficients: number[]) {
  const raw = coefficients.reduce((r, c) => r * c, Math.max(0, rent));
  return Math.ceil(Math.round(raw * 1e6) / 1e4) / 100;
}

/** Autonomous IRS rate for housing rents (CIRS art. 72.º), before the 10% moderate-rent rate. */
export function article72Rate(contractYears: number, renewals = 0) {
  if (contractYears >= 20) return 0.05;
  if (contractYears >= 10) return 0.1;
  if (contractYears >= 5) return Math.max(0.05, 0.15 - 0.02 * Math.max(0, Math.floor(renewals)));
  return RENT_TAX_2026.general;
}

export function landlordTax(input: { monthlyRent: number; months: number; expenses: number; contractYears: number; renewals: number }, rules = RENT_TAX_2026) {
  const base72 = article72Rate(input.contractYears, input.renewals);
  const moderate = input.monthlyRent > 0 && input.monthlyRent <= rules.moderateRentCap;
  const rate = moderate ? Math.min(rules.moderate, base72) : base72;
  const gross = Math.max(0, input.monthlyRent) * Math.max(0, input.months);
  const taxable = Math.max(0, gross - Math.max(0, input.expenses));
  return { rate, base72, moderate, gross, taxable, tax: Math.round(taxable * rate * 100) / 100 };
}

export function tenantDeduction(annualRent: number, lowIncome: boolean, rules = RENT_TAX_2026) {
  const cap = lowIncome ? rules.tenantCapLowIncome : rules.tenantCap;
  return Math.round(Math.min(Math.max(0, annualRent) * rules.tenantRate, cap) * 100) / 100;
}
