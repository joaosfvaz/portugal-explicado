import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Calculator } from "@phosphor-icons/react/dist/ssr";
import { GroupLinks } from "@/components/group-links";
import { Container, PageHeader } from "@/components/ui";
import { GUIDES } from "@/content/vida";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Papéis e serviços",
  description: "O que fazer em cada momento da vida, as datas a não esquecer e guias passo a passo para NIF, Cartão de Cidadão, residência, Segurança Social, empresa, carro, abono e desemprego.",
};

const TOOLS = [
  { href: "/vida/abono-de-familia", title: "Abono de família", text: "Escalões, valores de 2026 e simulador." },
  { href: "/vida/subsidio-de-desemprego", title: "Subsídio de desemprego", text: "Quanto recebe e durante quanto tempo." },
];

export default function VidaPage() {
  return (
    <>
      <PageHeader tile="onda" title="Papéis e serviços" lead="Os passos, documentos, custos e prazos dos serviços públicos mais usados. Cada guia tem as fontes oficiais e a data em que foi verificado.">
        <Link href="/en" className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          English guides <ArrowRight className="h-4 w-4" aria-hidden />
        </Link>
      </PageHeader>
      <Container className="grid gap-10 py-8">
        <GroupLinks group="papeis" only={["/vida/vou", "/vida/prazos"]} />
        <section className="grid gap-4 sm:grid-cols-2">
          {TOOLS.map((t) => (
            <Link key={t.href} href={t.href} className="pressable group flex items-start gap-4 rounded-sm bg-accent-soft p-5">
              <Calculator className="mt-0.5 h-6 w-6 shrink-0 text-accent-strong" aria-hidden />
              <span>
                <span className="block text-lg font-semibold tracking-tight text-accent-strong">{t.title}</span>
                <span className="mt-1 block text-muted">{t.text}</span>
              </span>
            </Link>
          ))}
        </section>
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((g) => (
            <Link key={g.slug} href={`/vida/${g.slug}`} className="pressable group flex flex-col rounded-sm border border-line bg-surface p-5 hover:border-accent">
              <span className="flex items-center justify-between gap-3">
                <span className="text-lg font-semibold tracking-tight group-hover:text-accent">{g.title.pt}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
              </span>
              <span className="mt-2 leading-relaxed text-muted">{g.summary.pt}</span>
              <span className="mt-auto pt-4 text-xs text-muted">Verificado em {formatDate(g.lastChecked)}</span>
            </Link>
          ))}
        </section>
      </Container>
    </>
  );
}
