import type { SourceRef } from "@/components/ui";

export type Locale = "pt" | "en";
export type L = { pt: string; en: string };

export type Step = { title: L; body: L };
export type Fact = { label: L; value: L; note?: L };

export type Guide = {
  slug: string;
  enSlug: string;
  title: L;
  summary: L;
  audience: L;
  where: L;
  facts: Fact[];
  documents?: L[];
  steps: Step[];
  notes?: L[];
  links: { label: L; url: string }[];
  sources: SourceRef[];
  lastChecked: string;
};

export type InstitutionSection = { heading: L; body: L[]; facts?: Fact[] };

export type Institution = {
  slug: string;
  enSlug: string;
  title: L;
  summary: L;
  sections: InstitutionSection[];
  sources: SourceRef[];
  lastChecked: string;
};

export const t = (l: L, locale: Locale) => l[locale];
