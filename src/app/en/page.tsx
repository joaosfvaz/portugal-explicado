import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container, PageHeader } from "@/components/ui";
import { INSTITUTIONS } from "@/content/estado";
import { GUIDES } from "@/content/vida";

export const metadata: Metadata = {
  title: "Portugal explained in English",
  description: "Practical guides for living in Portugal and how the Portuguese state works, with official sources.",
};

export default function EnglishPage() {
  return (
    <div lang="en">
      <PageHeader tile="rosacea"
        title="Portugal explained, in English"
        lead="Practical guides for people who live in or move to Portugal, and how the Portuguese state works. Each page lists its official sources and the date we checked them. Calculators and data pages are in Portuguese."
      />
      <Container className="grid gap-10 py-8">
        <section>
          <h2 className="font-display text-2xl leading-tight font-medium">Everyday guides</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {GUIDES.map((g) => (
              <Card key={g.slug} href={`/en/guides/${g.enSlug}`} title={g.title.en} text={g.summary.en} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="font-display text-2xl leading-tight font-medium">How the state works</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {INSTITUTIONS.map((i) => (
              <Card key={i.slug} href={`/en/state/${i.enSlug}`} title={i.title.en} text={i.summary.en} />
            ))}
          </div>
        </section>
      </Container>
    </div>
  );
}

function Card({ href, title, text }: { href: string; title: string; text: string }) {
  return (
    <Link href={href} className="pressable group flex flex-col rounded-sm border border-line bg-surface p-5 hover:border-accent">
      <span className="flex items-center justify-between gap-3">
        <span className="text-lg font-semibold tracking-tight group-hover:text-accent">{title}</span>
        <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
      </span>
      <span className="mt-2 leading-relaxed text-muted">{text}</span>
    </Link>
  );
}
