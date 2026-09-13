import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { InstitutionView } from "@/components/guide";
import { getInstitution, INSTITUTIONS } from "@/content/estado";

export function generateStaticParams() {
  return INSTITUTIONS.map((i) => ({ slug: i.slug }));
}

export async function generateMetadata({ params }: PageProps<"/estado/[slug]">): Promise<Metadata> {
  const inst = getInstitution((await params).slug);
  return inst ? { title: inst.title.pt, description: inst.summary.pt, alternates: { languages: { en: `/en/state/${inst.enSlug}` } } } : {};
}

export default async function InstitutionPage({ params }: PageProps<"/estado/[slug]">) {
  const inst = getInstitution((await params).slug);
  if (!inst) notFound();
  return <InstitutionView inst={inst} locale="pt" />;
}
