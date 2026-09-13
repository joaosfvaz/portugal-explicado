import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container, PageHeader } from "@/components/ui";
import { CHECKLISTS } from "@/content/vou";

export const metadata: Metadata = {
  title: "Vou… passo a passo",
  description: "O que fazer, por ordem, quando vai ter um filho, fica sem trabalho, se reforma ou muda de casa.",
};

export default function VouPage() {
  return (
    <>
      <PageHeader title="Vou…" lead="Quando a vida muda, há papéis a tratar. Escolha o que lhe vai acontecer e veja os passos por ordem, com prazos, custos e documentos." />
      <Container className="py-10">
        <ul className="grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {CHECKLISTS.map((c) => (
            <li key={c.id}>
              <Link href={`/vida/vou/${c.id}`} className="group flex h-full flex-col bg-surface p-6 hover:bg-sunken/60">
                <span className="font-display text-3xl font-medium group-hover:text-accent">{c.title}</span>
                <span className="mt-2 leading-relaxed text-muted">{c.lead}</span>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
                  {c.steps.length} passos <ArrowRight className="h-4 w-4" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
