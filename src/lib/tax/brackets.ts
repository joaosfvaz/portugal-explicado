export type Bracket = {
  /** Upper limit of the bracket in euros, or null for the last bracket. */
  upTo: number | null;
  /** Normal (marginal) rate for the income inside this bracket, e.g. 0.13. */
  rate: number;
};

export type BracketSlice = {
  index: number;
  from: number;
  to: number | null;
  rate: number;
  taxedAmount: number;
  tax: number;
};

export type BracketResult = {
  income: number;
  tax: number;
  averageRate: number;
  marginalRate: number;
  slices: BracketSlice[];
};

const round2 = (n: number) => Math.round(n * 100) / 100;

export function validateBrackets(brackets: Bracket[]): void {
  if (brackets.length === 0) throw new Error("No brackets");
  let previous = 0;
  brackets.forEach((b, i) => {
    const isLast = i === brackets.length - 1;
    if (isLast !== (b.upTo === null)) {
      throw new Error("Only the last bracket may have no upper limit");
    }
    if (b.upTo !== null && b.upTo <= previous) {
      throw new Error(`Bracket ${i + 1} limit must be above ${previous}`);
    }
    if (b.rate < 0 || b.rate >= 1) throw new Error(`Bracket ${i + 1} rate out of range`);
    previous = b.upTo ?? previous;
  });
}

/**
 * Progressive tax on rendimento coletável (art. 68.º CIRS): each part of the
 * income is taxed at the rate of the bracket it falls in.
 * This is the tax before deductions à coleta, mínimo de existência and
 * the adicional de solidariedade.
 */
export function taxByBrackets(income: number, brackets: Bracket[]): BracketResult {
  validateBrackets(brackets);
  const amount = Math.max(0, Number.isFinite(income) ? income : 0);

  let from = 0;
  let tax = 0;
  let marginalRate = brackets[0].rate;
  const slices: BracketSlice[] = [];

  for (const [index, b] of brackets.entries()) {
    const to = b.upTo;
    const top = to === null ? amount : Math.min(amount, to);
    const taxedAmount = Math.max(0, top - from);
    const sliceTax = taxedAmount * b.rate;
    if (taxedAmount > 0) marginalRate = b.rate;
    slices.push({ index, from, to, rate: b.rate, taxedAmount: round2(taxedAmount), tax: round2(sliceTax) });
    tax += sliceTax;
    if (to === null || amount <= to) break;
    from = to;
  }

  return {
    income: round2(amount),
    tax: round2(tax),
    averageRate: amount > 0 ? tax / amount : 0,
    marginalRate,
    slices,
  };
}
