import { imtByTable } from "./imt";
import { monthlyPayment } from "./mortgage";
import { BDP_2026, GARANTIA_PUBLICA, IMT_2026, REGISTO_2026, SELO_2026 } from "./rules-2026";

export type PurchaseInput = {
  price: number;
  purpose: "hpp" | "secondary";
  /** Every buyer is 35 or younger, not a dependent and buys a first home as HPP. */
  young: boolean;
  nonResident: boolean;
  loan: number;
  annualRate: number;
  years: number;
  variableRate: boolean;
  oldestBorrowerAge: number;
  route: "casa-pronta" | "separado";
  bankFees: number;
  netMonthlyIncome: number;
  otherMonthlyDebt: number;
};

const r2 = (n: number) => Math.round(n * 100) / 100;

export function purchaseCosts(i: PurchaseInput) {
  const price = Math.max(0, i.price);
  const loan = Math.min(Math.max(0, i.loan), price);
  const young = i.young && i.purpose === "hpp" && !i.nonResident;

  const imtTable = young ? IMT_2026.hppYoung : i.purpose === "hpp" ? IMT_2026.hpp : IMT_2026.secondary;
  const imt = i.nonResident ? r2(price * IMT_2026.nonResidentRate) : imtByTable(price, imtTable).tax;

  const seloGross = r2(price * SELO_2026.purchase);
  const seloPurchase = young ? r2(Math.max(0, seloGross - SELO_2026.youngDeductionCap)) : seloGross;
  const seloLoan = r2(loan * SELO_2026.loan);

  let registo: number;
  if (i.route === "casa-pronta") {
    const t = REGISTO_2026.casaPronta;
    registo = loan > 0 ? (young ? t.youngWithMortgage : t.withMortgage) : young ? t.youngPurchaseOnly : t.purchaseOnly;
  } else {
    const t = REGISTO_2026.separate;
    registo = young && price <= t.youngExemptUpTo ? 0 : loan > 0 ? t.withMortgage : t.purchaseOnly;
  }

  const bankFees = Math.max(0, i.bankFees);
  const seloFees = r2(bankFees * SELO_2026.commissions);
  const taxesAndFees = r2(imt + seloPurchase + seloLoan + registo + bankFees + seloFees);
  const downPayment = r2(price - loan);

  const ltv = price ? loan / price : 0;
  const ltvLimit = i.purpose === "hpp" ? BDP_2026.ltvHpp : BDP_2026.ltvOther;
  const maxYears = i.oldestBorrowerAge <= 35 ? BDP_2026.maxYearsUpTo35 : BDP_2026.maxYearsOver35;

  const payment = r2(monthlyPayment(loan, i.annualRate, i.years));
  const stressedRate = i.variableRate && i.years > 10 ? i.annualRate + BDP_2026.stressOver10Years : i.annualRate;
  const stressedPayment = r2(monthlyPayment(loan, stressedRate, i.years));
  const dsti = i.netMonthlyIncome > 0 ? (stressedPayment + Math.max(0, i.otherMonthlyDebt)) / i.netMonthlyIncome : null;

  return {
    imt,
    seloPurchase,
    seloLoan,
    registo,
    bankFees,
    seloFees,
    taxesAndFees,
    downPayment,
    cashNeeded: r2(downPayment + taxesAndFees),
    payment,
    stressedPayment,
    checks: {
      ltv,
      ltvLimit,
      ltvOk: ltv <= ltvLimit + 1e-9,
      maxYears,
      yearsOk: i.years <= maxYears,
      dsti,
      dstiOk: dsti === null ? null : dsti <= BDP_2026.dsti + 1e-9,
    },
    young,
    garantiaPublica: young && i.oldestBorrowerAge <= GARANTIA_PUBLICA.maxAge && price <= GARANTIA_PUBLICA.priceCap,
  };
}
