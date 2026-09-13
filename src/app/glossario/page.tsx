import type { Metadata } from "next";
import Link from "next/link";
import { Container, PageHeader } from "@/components/ui";
import { GLOSSARY, TOPIC_LABEL, type GlossaryEntry } from "@/content/glossario";

export const metadata: Metadata = {
  title: "Palavras difíceis (glossário)",
  description: "As palavras difíceis de impostos, casa, economia, leis e eleições, explicadas numa frase simples.",
};

export default function GlossarioPage() {
  const topics = Object.keys(TOPIC_LABEL) as GlossaryEntry["topic"][];
  const byName = (a: GlossaryEntry, b: GlossaryEntry) => a.term.localeCompare(b.term, "pt");

  return (
    <>
      <PageHeader
        title="Palavras difíceis"
        lead="As palavras difíceis que aparecem neste site, explicadas numa frase. Nas outras páginas, as palavras sublinhadas com pontos abrem esta explicação."
      >
        <nav aria-label="Temas" className="mt-6 flex flex-wrap gap-2 text-sm">
          {topics.map((t) => (
            <a key={t} href={`#tema-${t}`} className="pressable rounded-sm border border-line bg-surface px-3 py-1.5 hover:border-accent">
              {TOPIC_LABEL[t]}
            </a>
          ))}
        </nav>
      </PageHeader>

      <Container className="grid gap-12 py-10">
        {topics.map((t) => (
          <section key={t} id={`tema-${t}`} className="scroll-mt-28">
            <h2 className="font-display text-3xl leading-tight font-medium">{TOPIC_LABEL[t]}</h2>
            <dl className="mt-4 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
              {GLOSSARY.filter((g) => g.topic === t)
                .sort(byName)
                .map((g) => (
                  <div key={g.id} id={g.id} className="scroll-mt-28 bg-surface p-5 target:bg-accent-soft">
                    <dt className="font-display text-2xl font-medium">{g.term}</dt>
                    <dd className="mt-1.5 leading-relaxed">{g.short}</dd>
                    {g.more && <dd className="mt-1.5 text-sm leading-relaxed text-muted">{g.more}</dd>}
                    {g.href && (
                      <dd className="mt-2 text-sm">
                        <Link href={g.href} className="font-medium text-accent">
                          Saber mais
                        </Link>
                      </dd>
                    )}
                  </div>
                ))}
            </dl>
          </section>
        ))}
      </Container>
    </>
  );
}
