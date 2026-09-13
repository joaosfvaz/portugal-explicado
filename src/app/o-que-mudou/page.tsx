import type { Metadata } from "next";
import Link from "next/link";
import { RssSimple } from "@phosphor-icons/react/dist/ssr";
import { Container, PageHeader } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { recentChanges, type FeedItem } from "@/lib/o-que-mudou";

export const metadata: Metadata = {
  title: "O que mudou",
  description: "As leis publicadas sobre temas do dia a dia, os novos números oficiais e as mudanças de regras dos últimos dois meses.",
  alternates: { types: { "application/rss+xml": "/o-que-mudou/rss.xml" } },
};

export const revalidate = 3600;

const KIND: Record<FeedItem["kind"], string> = {
  regra: "Regra nova",
  lei: "Lei publicada",
  numero: "Número novo",
  site: "Novo no site",
};

export default function OQueMudouPage() {
  const items = recentChanges(60);
  const groups: [FeedItem["kind"], string][] = [
    ["regra", "Regras que mudaram"],
    ["lei", "Leis publicadas sobre temas do dia a dia"],
    ["numero", "Números oficiais atualizados"],
    ["site", "Novo neste site"],
  ];

  return (
    <>
      <PageHeader title="O que mudou" lead="O que mudou nos últimos dois meses, em poucas linhas: regras novas, leis publicadas, números atualizados e páginas novas.">
        <a href="/o-que-mudou/rss.xml" className="mt-5 mr-3 inline-flex items-center gap-1.5 rounded-sm border border-line bg-surface px-3 py-1.5 text-sm font-medium hover:border-accent">
          <RssSimple className="h-4 w-4" aria-hidden /> Seguir por RSS
        </a>
      </PageHeader>
      <Container className="grid gap-12 py-10">
        {groups.map(([kind, label]) => {
          const list = items.filter((i) => i.kind === kind);
          if (!list.length) return null;
          return (
            <section key={kind}>
              <h2 className="font-display text-3xl leading-tight font-medium">{label}</h2>
              <ul className="mt-4 grid gap-px overflow-hidden border border-line bg-line">
                {list.map((item) => (
                  <li key={`${item.href}-${item.date}`}>
                    <Link href={item.href} className="group grid gap-1 bg-surface p-4 hover:bg-sunken/60 sm:grid-cols-[9rem_minmax(0,1fr)]">
                      <span className="text-sm text-muted tabular">{formatDate(item.date)}</span>
                      <span>
                        <span className="block text-[11px] font-medium tracking-[0.12em] text-muted uppercase">{KIND[item.kind]}</span>
                        <span className="mt-0.5 block font-semibold leading-snug group-hover:text-accent">{item.title}</span>
                        <span className="mt-1 block text-sm leading-relaxed text-muted">{item.text}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
        <p className="text-sm text-muted">
          As leis são escolhidas pelo tema do título oficial: impostos, casa, trabalho, pensões, saúde, educação, família e transportes. Todas as leis estão na página{" "}
          <Link href="/parlamento/iniciativas" className="font-medium text-accent">
            Iniciativas
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
