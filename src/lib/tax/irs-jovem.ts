export type IrsJovemRules = {
  maxAge: number;
  /** Exemption rate per year of obtaining income: index 0 is the 1st year. */
  exemptionByIncomeYear: number[];
  /** Annual limit of exempt income in euros (55 × IAS). */
  cap: number;
};

export type IrsJovemInput = {
  taxYear: number;
  birthYear: number;
  /** First year with category A or B income declared as a taxpayer (not as a dependent). */
  firstIncomeYear: number;
  /**
   * Years between firstIncomeYear and taxYear (exclusive) that do not count:
   * no A/B income, declared as a dependent, or not required to file.
   */
  yearsNotCounted: number;
  /** Category A and B gross income in the tax year. */
  income: number;
};

export type IneligibleReason = "age" | "not-started" | "period-ended" | "invalid";

export type IrsJovemResult =
  | {
      eligible: true;
      age: number;
      incomeYear: number;
      exemptionRate: number;
      exemptIncome: number;
      capApplied: boolean;
      taxableIncome: number;
    }
  | { eligible: false; age: number; incomeYear: number; reason: IneligibleReason };

const round2 = (n: number) => Math.round(n * 100) / 100;

/**
 * IRS Jovem (art. 12.º-B CIRS, from 2025):
 * - age up to maxAge on 31 December of the tax year;
 * - counts years of obtaining A/B income as a taxpayer, skipping years that do not count;
 * - exempt income = income × rate for that year, never above the cap.
 */
export function irsJovem(input: IrsJovemInput, rules: IrsJovemRules): IrsJovemResult {
  const age = input.taxYear - input.birthYear;
  const incomeYear = input.taxYear - input.firstIncomeYear + 1 - Math.max(0, input.yearsNotCounted);

  if (
    !Number.isInteger(input.taxYear) ||
    !Number.isInteger(input.birthYear) ||
    !Number.isInteger(input.firstIncomeYear) ||
    input.firstIncomeYear < input.birthYear ||
    input.yearsNotCounted < 0 ||
    input.yearsNotCounted > Math.max(0, input.taxYear - input.firstIncomeYear)
  ) {
    return { eligible: false, age, incomeYear, reason: "invalid" };
  }
  if (age > rules.maxAge) return { eligible: false, age, incomeYear, reason: "age" };
  if (input.firstIncomeYear > input.taxYear) return { eligible: false, age, incomeYear, reason: "not-started" };
  if (incomeYear > rules.exemptionByIncomeYear.length) {
    return { eligible: false, age, incomeYear, reason: "period-ended" };
  }

  const income = Math.max(0, input.income);
  const exemptionRate = rules.exemptionByIncomeYear[incomeYear - 1];
  const uncapped = income * exemptionRate;
  const exemptIncome = round2(Math.min(uncapped, rules.cap));

  return {
    eligible: true,
    age,
    incomeYear,
    exemptionRate,
    exemptIncome,
    capApplied: uncapped > rules.cap,
    taxableIncome: round2(income - exemptIncome),
  };
}
