/** Rough cost structure of building your own home. Market prices are user inputs; legal rates are from the rules. */
export const BUILD_2026 = {
  imtBuildingLand: 0.065,
  imtRustic: 0.05,
  seloPurchase: 0.008,
  vatNormal: 0.23,
  vatReduced: 0.06,
  /** DL 97/2026 Anexo II: refund limit (value of land + construction without VAT, or VPT if higher). */
  refundValueCap: 660_982,
  /** CIMI art. 39.º, Portaria 471/2025/1: average construction value for IMI purposes. Not a market price. */
  imiConstructionValue: 570,
};

export function buildCosts(i: { landPrice: number; landType: "construcao" | "rustico"; area: number; costPerM2: number; municipalFees: number; projectFees: number; ownHome: boolean }, r = BUILD_2026) {
  const land = Math.max(0, i.landPrice);
  const imt = Math.round(land * (i.landType === "construcao" ? r.imtBuildingLand : r.imtRustic) * 100) / 100;
  const selo = Math.round(land * r.seloPurchase * 100) / 100;
  const construction = Math.max(0, i.area) * Math.max(0, i.costPerM2);
  const vat = Math.round(construction * r.vatNormal * 100) / 100;
  const refundEligible = i.ownHome && land + construction <= r.refundValueCap;
  const refund = refundEligible ? Math.round(construction * (r.vatNormal - r.vatReduced) * 100) / 100 : 0;
  const fees = Math.max(0, i.municipalFees) + Math.max(0, i.projectFees);
  const total = land + imt + selo + construction + vat + fees;
  return { imt, selo, construction, vat, refundEligible, refund, fees, total: Math.round(total * 100) / 100, totalAfterRefund: Math.round((total - refund) * 100) / 100 };
}
