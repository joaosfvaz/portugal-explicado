import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstitutionView } from "@/components/guide";
import { getInstitutionEn, INSTITUTIONS } from "@/content/estado";

export const dynamicParams = false;

export function generateStaticParams() {
  return INSTITUTIONS.map((i) => ({ slug: i.enSlug }));
}

export async function generateMetadata({ params }: PageProps<"/en/state/[slug]">): Promise<Metadata> {
  const inst = getInstitutionEn((await params).slug);
  return inst ? { title: inst.title.en, description: inst.summary.en, alternates: { languages: { "pt-PT": `/estado/${inst.slug}` } } } : {};
}

export default async function InstitutionEnPage({ params }: PageProps<"/en/state/[slug]">) {
  const inst = getInstitutionEn((await params).slug);
  if (!inst) notFound();
  return (
    <div lang="en">
      <InstitutionView inst={inst} locale="en" />
    </div>
  );
}
