import type { SourceRef } from "@/components/ui";
import type { TaxYear } from "./data";

type Field = Exclude<keyof TaxYear, "year" | "region">;

const TITLES: Record<Field, string> = {
  ias: "Indexante dos Apoios Sociais",
  minimumWageMonthly: "Retribuição mínima mensal garantida",
  irsBrackets: "Escalões e taxas gerais de IRS",
  solidaritySurcharge: "Adicional de solidariedade",
  minimoExistencia: "Mínimo de existência",
  deducaoEspecificaCatA: "Dedução específica da categoria A",
  irsJovem: "IRS Jovem",
  socialSecurity: "Taxas contributivas da Segurança Social",
};

export function taxSources(year: TaxYear, fields: Field[]): SourceRef[] {
  return fields.map((f) => ({
    title: `${TITLES[f]} ${year.year}: ${year[f].legalBasis}`,
    url: year[f].sourceUrl,
    verifiedOn: year[f].verifiedOn,
    verification: year[f].verification,
  }));
}
