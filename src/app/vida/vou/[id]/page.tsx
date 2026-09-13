import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Glossed } from "@/components/glossary/glossed";
import { HelpBox } from "@/components/help-box";
import { Container, PageHeader, SourceList } from "@/components/ui";
import { CHECKLISTS, getChecklist } from "@/content/vou";

export const dynamicParams = false;

export function generateStaticParams() {
  return CHECKLISTS.map((c) => ({ id: c.id }));
}

export async function generateMetadata({ params }: PageProps<"/vida/vou/[id]">): Promise<Metadata> {
  const { id } = await params;
  const c = getChecklist(id);
  return c ? { title: `${c.title}: passo a passo`, description: c.lead } : {};
}

export default async function ChecklistPage({ params }: PageProps<"/vida/vou/[id]">) {
  const { id } = await params;
  const c = getChecklist(id);
  if (!c) notFound();

  return (
    <>
      <PageHeader title={c.title} lead={c.lead} />
      <Container className="grid gap-10 py-10 lg:grid-cols-[minmax(0,1fr)_300px]">
        <ol className="grid content-start gap-4">
          {c.steps.map((s, i) => (
            <li key={s.title} className="grid grid-cols-[2.5rem_minmax(0,1fr)] gap-4 rounded-sm border border-line bg-surface p-5">
              <span className="grid h-10 w-10 place-items-center rounded-sm border border-accent/30 bg-accent-soft font-display text-2xl text-accent-strong figures">{i + 1}</span>
              <div>
                <h2 className="text-lg font-semibold">{s.title}</h2>
                <p className="mt-1 max-w-[70ch] leading-relaxed">
                  <Glossed>{s.plain}</Glossed>
                </p>
                {(s.deadline || s.where || s.cost) && (
                  <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-3">
                    {s.deadline && (
                      <div className="rounded-sm bg-warn-soft p-3">
                        <dt className="font-semibold text-warn">Prazo</dt>
                        <dd className="mt-0.5">{s.deadline}</dd>
                      </div>
                    )}
                    {s.where && (
                      <div className="rounded-sm bg-sunken p-3">
                        <dt className="font-semibold">Onde</dt>
                        <dd className="mt-0.5">{s.where}</dd>
                      </div>
                    )}
                    {s.cost && (
                      <div className="rounded-sm bg-sunken p-3">
                        <dt className="font-semibold">Custo</dt>
                        <dd className="mt-0.5">{s.cost}</dd>
                      </div>
                    )}
                  </dl>
                )}
                {s.documents && s.documents.length > 0 && (
                  <div className="mt-3 text-sm">
                    <p className="font-semibold">Leve ou tenha à mão</p>
                    <ul className="mt-1 list-disc pl-5 text-muted">
                      {s.documents.map((d) => (
                        <li key={d}>{d}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {s.href && (
                    <Link href={s.href} className="font-medium text-accent">
                      Saber mais
                    </Link>
                  )}
                  <a href={s.source} target="_blank" rel="noopener noreferrer" className="text-muted underline underline-offset-2 hover:text-foreground">
                    Fonte oficial
                  </a>
                </p>
              </div>
            </li>
          ))}
        </ol>
        <aside className="grid content-start gap-4">
          <div className="rounded-sm border border-line bg-surface p-5">
            <p className="font-semibold">Veja também</p>
            <ul className="mt-2 grid gap-2">
              {c.related.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className="text-accent">
                    {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-sm border border-line bg-surface p-5 text-sm">
            <p className="font-semibold">Outros passo a passo</p>
            <ul className="mt-2 grid gap-2">
              {CHECKLISTS.filter((x) => x.id !== c.id).map((x) => (
                <li key={x.id}>
                  <Link href={`/vida/vou/${x.id}`} className="text-accent">
                    {x.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </aside>
        <div className="grid gap-8 lg:col-span-2">
          <HelpBox topic={c.id === "ter-um-filho" ? "familia" : c.id === "ficar-desempregado" ? "desemprego" : c.id === "reformar-me" ? "reforma" : "documentos"} />
          <SourceList sources={c.sources} />
        </div>
      </Container>
    </>
  );
}
