import { ABONO_2026 } from "./rules-2026";

export type AbonoInput = {
  /** Annual income of the household in the reference year. */
  householdIncome: number;
  /** Children and young people in the household with a right to abono. */
  children: number;
  childAgeMonths: number;
  singleParent: boolean;
  /** IAS of the income reference year. */
  ias: number;
};

export type AbonoResult = {
  referenceIncome: number;
  escalao: 1 | 2 | 3 | 4 | null;
  base: number;
  singleParentBonus: number;
  monthly: number;
  garantia: number;
  limits: number[];
};

const r2 = (n: number) => Math.round(n * 100) / 100;

/** Abono de família para crianças e jovens, monthly amount for one child. */
export function abono(input: AbonoInput, rules = ABONO_2026): AbonoResult {
  const referenceIncome = Math.max(0, input.householdIncome) / (Math.max(1, input.children) + 1);
  const limits = rules.escaloes.map((m) => r2(m * input.ias * 14));
  const idx = limits.findIndex((l) => referenceIncome <= l);
  const escalao = idx === -1 ? null : ((idx + 1) as 1 | 2 | 3 | 4);
  if (escalao === null) return { referenceIncome: r2(referenceIncome), escalao, base: 0, singleParentBonus: 0, monthly: 0, garantia: 0, limits };

  const table = input.childAgeMonths <= 36 ? rules.upTo36Months : input.childAgeMonths <= 72 ? rules.from36To72Months : rules.over72Months;
  const base = table[escalao - 1];
  const singleParentBonus = r2(base * (input.singleParent ? rules.singleParentBonus : 0));
  const monthly = r2(base + singleParentBonus);

  const eligibleGarantia = escalao === 1 && referenceIncome < rules.garantiaThreshold * input.ias * 14 && input.childAgeMonths < 18 * 12;
  const garantia = eligibleGarantia ? r2(Math.max(0, rules.garantiaAnnual / 12 - monthly)) : 0;

  return { referenceIncome: r2(referenceIncome), escalao, base, singleParentBonus, monthly, garantia, limits };
}
