/** Monthly payment of a fixed-rate annuity loan (French amortisation), before insurance and fees. */
export function monthlyPayment(principal: number, annualRate: number, years: number) {
  const n = Math.round(years * 12);
  if (principal <= 0 || n <= 0) return 0;
  const r = annualRate / 12;
  if (r === 0) return principal / n;
  return (principal * r) / (1 - (1 + r) ** -n);
}

export function totalInterest(principal: number, annualRate: number, years: number) {
  return monthlyPayment(principal, annualRate, years) * Math.round(years * 12) - principal;
}
