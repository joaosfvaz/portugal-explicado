import fs from "node:fs";
import path from "node:path";
import { z } from "zod";
import { validateBrackets } from "./brackets";

const verification = z.enum(["primary", "derived", "secondary", "uncertain"]);

const sourced = <T extends z.ZodTypeAny>(value: T) =>
  z.object({
    value,
    legalBasis: z.string().min(5),
    sourceUrl: z.url(),
    verifiedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    verification,
    formula: z.string().optional(),
    note: z.string().optional(),
  });

const bracket = z.object({
  upTo: z.number().positive().nullable(),
  rate: z.number().min(0).max(1),
  avgRateAtTop: z.number().min(0).max(1).optional(),
});

export const TaxYearSchema = z.object({
  year: z.number().int().min(2020).max(2100),
  region: z.literal("continente"),
  ias: sourced(z.number().positive()),
  minimumWageMonthly: sourced(z.number().positive()),
  irsBrackets: sourced(z.array(bracket).min(2)),
  solidaritySurcharge: sourced(
    z.array(z.object({ from: z.number(), upTo: z.number().nullable(), rate: z.number() })),
  ),
  minimoExistencia: sourced(z.number().positive()),
  deducaoEspecificaCatA: sourced(z.number().positive()),
  irsJovem: sourced(
    z.object({
      maxAge: z.number().int(),
      exemptionByIncomeYear: z.array(z.number().min(0).max(1)).min(1),
      capIasMultiple: z.number().positive(),
      cap: z.number().positive(),
      monthlyWithholdingCap: z.number().positive(),
      categories: z.array(z.enum(["A", "B"])),
    }),
  ),
  socialSecurity: sourced(
    z.object({
      employeeRate: z.number(),
      employerRate: z.number(),
      selfEmployedRate: z.number(),
      selfEmployedRelevantIncomeServices: z.number(),
      selfEmployedRelevantIncomeGoods: z.number(),
    }),
  ),
});

export type TaxYear = z.infer<typeof TaxYearSchema>;
export type Sourced = TaxYear["ias"];

const DIR = path.join(process.cwd(), "data", "tax");

/** Values that calculators may use. Secondary and uncertain values are for explanatory text only. */
export const isCalculable = (s: { verification: string }) => s.verification === "primary" || s.verification === "derived";

function load(): Map<number, TaxYear> {
  const years = new Map<number, TaxYear>();
  for (const file of fs.readdirSync(DIR).filter((f) => /^\d{4}\.json$/.test(f))) {
    const parsed = TaxYearSchema.parse(JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")));
    if (`${parsed.year}.json` !== file) throw new Error(`${file} declares year ${parsed.year}`);
    validateBrackets(parsed.irsBrackets.value);
    const { cap, capIasMultiple } = parsed.irsJovem.value;
    if (Math.abs(cap - Math.round(capIasMultiple * parsed.ias.value * 100) / 100) > 0.01) {
      throw new Error(`${file}: IRS Jovem cap does not equal ${capIasMultiple} × IAS`);
    }
    years.set(parsed.year, parsed);
  }
  return years;
}

const TAX_YEARS = load();

export function getTaxYear(year: number): TaxYear | null {
  return TAX_YEARS.get(year) ?? null;
}

/** Years with a verified data file, newest first. */
export function availableTaxYears(): number[] {
  return [...TAX_YEARS.keys()].sort((a, b) => b - a);
}
