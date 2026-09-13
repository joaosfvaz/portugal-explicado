import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GuideView } from "@/components/guide";
import { getGuideEn, GUIDES } from "@/content/vida";

export const dynamicParams = false;

export function generateStaticParams() {
  return GUIDES.map((g) => ({ slug: g.enSlug }));
}

export async function generateMetadata({ params }: PageProps<"/en/guides/[slug]">): Promise<Metadata> {
  const g = getGuideEn((await params).slug);
  return g ? { title: g.title.en, description: g.summary.en, alternates: { languages: { "pt-PT": `/vida/${g.slug}` } } } : {};
}

export default async function GuideEnPage({ params }: PageProps<"/en/guides/[slug]">) {
  const g = getGuideEn((await params).slug);
  if (!g) notFound();
  return (
    <div lang="en">
      <GuideView guide={g} locale="en" />
    </div>
  );
}
