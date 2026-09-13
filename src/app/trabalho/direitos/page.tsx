import type { Metadata } from "next";
import Link from "next/link";
import { Glossed } from "@/components/glossary/glossed";
import { HelpBox } from "@/components/help-box";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { RIGHTS, RIGHTS_NOTE, RIGHTS_SOURCES } from "@/content/direitos";

export const metadata: Metadata = {
  title: "Os seus direitos no trabalho",
  description: "Férias, subsídios, faltas, baixa médica, horas extra, período experimental, despedimento e licença parental, explicados com a lei em vigor.",
};

export default function DireitosPage() {
  return (
    <>
      <PageHeader
        title="Os seus direitos no trabalho"
        lead="Para quem trabalha com contrato numa empresa privada. Primeiro a resposta curta; depois, se quiser, os detalhes da lei."
      >
        <nav aria-label="Temas" className="mt-6 flex flex-wrap gap-2 text-sm">
          {RIGHTS.map((r) => (
            <a key={r.id} href={`#${r.id}`} className="pressable rounded-sm border border-line bg-surface px-3 py-1.5 hover:border-accent">
              {r.title}
            </a>
          ))}
        </nav>
      </PageHeader>

      <Container className="grid gap-8 py-10">
        <Notice tone="neutral" title="A lei em vigor">
          {RIGHTS_NOTE.text}{" "}
          <Link href={RIGHTS_NOTE.href} className="font-medium underline underline-offset-4">
            Ver a proposta
          </Link>
          .
        </Notice>

        <div className="grid gap-px overflow-hidden border border-line bg-line">
          {RIGHTS.map((r) => (
            <section key={r.id} id={r.id} className="scroll-mt-28 bg-surface p-5 md:p-6">
              <h2 className="font-display text-3xl leading-tight font-medium">{r.title}</h2>
              <p className="mt-2 max-w-[70ch] text-lg leading-relaxed">
                <Glossed>{r.summary}</Glossed>
              </p>
              <details className="group mt-4">
                <summary className="cursor-pointer text-sm font-medium text-accent">Ver os detalhes da lei</summary>
                <ul className="mt-3 grid max-w-[75ch] gap-2 leading-relaxed">
                  {r.facts.map((f) => (
                    <li key={f.text} className="border-l-2 border-line pl-3">
                      <Glossed>{f.text}</Glossed> <span className="text-sm text-muted">({f.ref})</span>
                    </li>
                  ))}
                </ul>
              </details>
            </section>
          ))}
        </div>

        <div className="grid gap-3">
          <HelpBox topic="trabalho" />
          <p className="text-sm text-muted">No tribunal do trabalho, o Ministério Público representa os trabalhadores de graça, qualquer que seja o rendimento ou a nacionalidade. Se for sócio de um sindicato, pode ter apoio jurídico.</p>
        </div>

        <SourceList sources={RIGHTS_SOURCES} />
      </Container>
    </>
  );
}
