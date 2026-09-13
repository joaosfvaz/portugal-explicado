import { ArrowSquareOut, CheckCircle } from "@phosphor-icons/react/dist/ssr";
import { Container, SourceList, HeaderFrame } from "@/components/ui";
import { formatDate } from "@/lib/format";
import { t, type Guide, type Institution, type Locale } from "@/content/types";
import { Glossed } from "@/components/glossary/glossed";

const UI = {
  pt: {
    who: "Para quem",
    where: "Onde se trata",
    facts: "Custos e prazos",
    documents: "Documentos habituais",
    steps: "Passo a passo",
    notes: "A ter em conta",
    links: "Serviços oficiais",
    sources: "Fontes",
    checked: "Informação verificada em",
    disclaimer: "Os requisitos podem mudar. Confirme sempre no serviço oficial antes de tratar do assunto.",
  },
  en: {
    who: "Who is this for",
    where: "Where to do it",
    facts: "Costs and deadlines",
    documents: "Usual documents",
    steps: "Step by step",
    notes: "Keep in mind",
    links: "Official services",
    sources: "Sources",
    checked: "Information checked on",
    disclaimer: "Requirements can change. Always confirm with the official service before you start.",
  },
} as const;

export function GuideView({ guide, locale }: { guide: Guide; locale: Locale }) {
  const ui = UI[locale];
  return (
    <>
      <HeaderFrame className="py-8">
          <h1 className="font-display text-4xl leading-[1.05] font-medium tracking-[-0.015em] text-balance sm:text-5xl">{t(guide.title, locale)}</h1>
          <p className="mt-3 max-w-[70ch] text-lg leading-relaxed text-muted">{t(guide.summary, locale)}</p>
          <p className="mt-4 text-sm text-muted">
            {ui.checked} {formatDate(guide.lastChecked)}. {ui.disclaimer}
          </p>
      </HeaderFrame>

      <Container className="grid gap-8 py-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="grid content-start gap-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <InfoCard title={ui.who}>{t(guide.audience, locale)}</InfoCard>
            <InfoCard title={ui.where}>{t(guide.where, locale)}</InfoCard>
          </div>

          <section>
            <h2 className="font-display text-2xl leading-tight font-medium">{ui.steps}</h2>
            <ol className="mt-4 grid gap-3">
              {guide.steps.map((s, i) => (
                <li key={i} className="grid grid-cols-[36px_1fr] gap-3 rounded-sm border border-line bg-surface p-4">
                  <span className="grid h-8 w-8 place-items-center rounded-sm border border-accent/30 bg-accent-soft font-display text-lg font-medium text-accent-strong figures">{i + 1}</span>
                  <div>
                    <p className="font-semibold">{t(s.title, locale)}</p>
                    <p className="mt-1 max-w-[70ch] leading-relaxed text-muted">{locale === "pt" ? <Glossed>{t(s.body, locale)}</Glossed> : t(s.body, locale)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {guide.documents && guide.documents.length > 0 && (
            <section>
              <h2 className="font-display text-2xl leading-tight font-medium">{ui.documents}</h2>
              <ul className="mt-4 grid gap-2">
                {guide.documents.map((d, i) => (
                  <li key={i} className="flex gap-2 leading-relaxed">
                    <CheckCircle className="mt-1 h-4 w-4 shrink-0 text-accent" aria-hidden />
                    {t(d, locale)}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {guide.notes && guide.notes.length > 0 && (
            <section className="rounded-sm bg-sunken p-5">
              <h2 className="font-semibold">{ui.notes}</h2>
              <ul className="mt-3 grid list-disc gap-2 pl-5 leading-relaxed text-muted">
                {guide.notes.map((n, i) => (
                  <li key={i}>{t(n, locale)}</li>
                ))}
              </ul>
            </section>
          )}
        </div>

        <aside className="grid content-start gap-4">
          <FactsCard title={ui.facts} facts={guide.facts} locale={locale} />
          <section className="rounded-sm border border-line bg-surface p-5 text-sm">
            <h2 className="font-semibold">{ui.links}</h2>
            <ul className="mt-3 grid gap-2">
              {guide.links.map((l) => (
                <li key={l.url}>
                  <a href={l.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-accent underline-offset-4 hover:underline">
                    {t(l.label, locale)} <ArrowSquareOut aria-hidden />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </aside>

        <div className="lg:col-span-2">
          <SourceList sources={guide.sources} heading={ui.sources} />
        </div>
      </Container>
    </>
  );
}

export function InstitutionView({ inst, locale }: { inst: Institution; locale: Locale }) {
  return (
    <>
      <HeaderFrame className="py-8">
          <h1 className="font-display text-4xl leading-[1.05] font-medium tracking-[-0.015em] text-balance sm:text-5xl">{t(inst.title, locale)}</h1>
          <p className="mt-3 max-w-[70ch] text-lg leading-relaxed text-muted">{t(inst.summary, locale)}</p>
          <p className="mt-4 text-sm text-muted">
            {UI[locale].checked} {formatDate(inst.lastChecked)}.
          </p>
      </HeaderFrame>
      <Container className="grid gap-6 py-8">
        {inst.sections.map((s, i) => (
          <section key={i} className="grid gap-4 rounded-sm border border-line bg-surface p-5 md:p-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div>
              <h2 className="font-display text-2xl leading-tight font-medium">{t(s.heading, locale)}</h2>
              <div className="mt-3 grid max-w-[70ch] gap-3 leading-relaxed">
                {s.body.map((p, j) => (
                  <p key={j}>{t(p, locale)}</p>
                ))}
              </div>
            </div>
            {s.facts && s.facts.length > 0 && (
              <dl className="grid content-start gap-3 rounded-sm bg-sunken p-4 text-sm">
                {s.facts.map((f, j) => (
                  <div key={j}>
                    <dt className="text-muted">{t(f.label, locale)}</dt>
                    <dd className="mt-0.5 font-semibold">{t(f.value, locale)}</dd>
                  </div>
                ))}
              </dl>
            )}
          </section>
        ))}
        <SourceList sources={inst.sources} heading={UI[locale].sources} />
      </Container>
    </>
  );
}

function InfoCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-sm border border-line bg-surface p-5">
      <h2 className="text-sm font-semibold text-muted">{title}</h2>
      <p className="mt-2 leading-relaxed">{children}</p>
    </section>
  );
}

export function FactsCard({ title, facts, locale }: { title: string; facts: Guide["facts"]; locale: Locale }) {
  return (
    <section className="rounded-sm border border-line bg-surface p-5 text-sm">
      <h2 className="font-semibold">{title}</h2>
      <dl className="mt-3 grid gap-3">
        {facts.map((f, i) => (
          <div key={i} className="border-t border-line pt-3 first:border-0 first:pt-0">
            <dt className="text-muted">{t(f.label, locale)}</dt>
            <dd className="mt-0.5 font-semibold">{t(f.value, locale)}</dd>
            {f.note && <dd className="mt-0.5 text-xs text-muted">{t(f.note, locale)}</dd>}
          </div>
        ))}
      </dl>
    </section>
  );
}
