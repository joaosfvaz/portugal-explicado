import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideView } from "@/components/guide";
import { getGuide, GUIDES } from "@/content/vida";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/vida/[slug]">): Promise<Metadata> {
  const g = getGuide((await params).slug);
  return g ? { title: g.title.pt, description: g.summary.pt, alternates: { languages: { en: `/en/guides/${g.enSlug}` } } } : {};
}

export default async function GuidePage({ params }: PageProps<"/vida/[slug]">) {
  const g = getGuide((await params).slug);
  if (!g) notFound();
  return <GuideView guide={g} locale="pt" />;
}
