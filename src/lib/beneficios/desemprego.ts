import { DESEMPREGO_2026 } from "./rules-2026";

export type DesempregoInput = {
  /** Gross monthly salary, paid 14 times a year (holiday and Christmas pay count). */
  monthlySalary: number;
  age: number;
  /** Months with registered salaries (for the duration table). */
  monthsContributed: number;
  /** Months with registered salaries in the 24 months before unemployment. */
  monthsInLast24: number;
  /** Full 5-year blocks with registered salaries in the last 20 years. */
  fiveYearBlocks: number;
  bonus: boolean;
  rmmg: number;
};

export type DesempregoResult = {
  eligible: boolean;
  referenceMonthly: number;
  computed: number;
  monthly: number;
  appliedLimit: "minimum" | "maximum" | null;
  days: number;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/**
 * Estimate of the subsídio de desemprego. The monthly reference is 14 salaries ÷ 12
 * (the law divides 12 months of pay, including holiday and Christmas pay, by 360 days).
 * The cap of 75% of the net reference is not applied: it depends on IRS withholding.
 */
export function desemprego(input: DesempregoInput, rules = DESEMPREGO_2026): DesempregoResult {
  const eligible = input.monthsInLast24 >= rules.guaranteeDays / 30;
  const referenceMonthly = r2((Math.max(0, input.monthlySalary) * 14) / 12);
  const computed = r2(referenceMonthly * rules.rate * (input.bonus ? 1 + rules.bonus : 1));
  const minimum = input.monthlySalary >= input.rmmg ? rules.minimumIfSalaryAtLeastRmmg : rules.minimum;

  let monthly = computed;
  let appliedLimit: DesempregoResult["appliedLimit"] = null;
  if (monthly < minimum) {
    monthly = minimum;
    appliedLimit = "minimum";
  } else if (monthly > rules.maximum) {
    monthly = rules.maximum;
    appliedLimit = "maximum";
  }

  const band = rules.duration.find((b) => input.age <= b.maxAge)!;
  const col = input.monthsContributed < 15 ? 0 : input.monthsContributed < 24 ? 1 : 2;
  const days = band.days[col] + Math.max(0, Math.floor(input.fiveYearBlocks)) * band.extraPer5Years;

  return { eligible, referenceMonthly, computed, monthly: r2(monthly), appliedLimit, days: eligible ? days : 0 };
}
