import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Container, PageHeader } from "@/components/ui";
import { INSTITUTIONS } from "@/content/estado";

export const metadata: Metadata = {
  title: "Como funciona o Estado",
  description: "Presidente da República, Assembleia, Governo, tribunais, regiões autónomas e autarquias explicados com base na Constituição.",
};

const FLOW = [
  { who: "Eleitores", what: "Elegem o Presidente, a Assembleia da República, os deputados europeus, as assembleias regionais e as autarquias." },
  { who: "Assembleia da República", what: "Faz as leis, aprova o Orçamento e fiscaliza o Governo." },
  { who: "Presidente da República", what: "Nomeia o Primeiro-Ministro, promulga ou veta leis e pode dissolver a Assembleia." },
  { who: "Governo", what: "Governa, faz decretos-leis e responde perante a Assembleia e o Presidente." },
  { who: "Tribunais", what: "Aplicam a lei com independência. O Tribunal Constitucional verifica as leis." },
];

export default function EstadoPage() {
  return (
    <>
      <PageHeader tile="rosacea"
        title="Como funciona o Estado"
        lead="Quem decide o quê em Portugal, segundo a Constituição. Cada página indica os artigos e as fontes oficiais."
      />
      <Container className="grid gap-10 py-8">
        <section>
          <h2 className="font-display text-2xl leading-tight font-medium">Os órgãos de soberania, em resumo</h2>
          <ol className="mt-4 grid gap-3 md:grid-cols-5">
            {FLOW.map((f, i) => (
              <li key={f.who} className="rounded-sm border border-line bg-surface p-4">
                <span className="text-xs font-semibold text-accent tabular">{i + 1}</span>
                <p className="mt-1 font-semibold">{f.who}</p>
                <p className="mt-1 text-sm leading-relaxed text-muted">{f.what}</p>
              </li>
            ))}
          </ol>
        </section>

        <Link href="/estado/eleicoes" className="pressable group grid gap-4 rounded-sm border border-line bg-surface p-6 hover:border-accent md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <p className="text-[11px] font-medium tracking-[0.14em] text-muted uppercase">Resultados oficiais</p>
            <h2 className="mt-1 font-display text-3xl font-medium group-hover:text-accent">Eleições</h2>
            <p className="mt-2 max-w-[70ch] leading-relaxed text-muted">
              Os resultados mais recentes das presidenciais, legislativas, europeias, autárquicas, regionais e do último referendo, com o que cada eleição decide e quando é a próxima.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 font-medium text-accent">
            Ver as eleições <ArrowRight weight="bold" />
          </span>
        </Link>

        <Link href="/estado/municipios" className="pressable group grid gap-2 rounded-sm border border-line bg-surface p-6 hover:border-accent md:grid-cols-[minmax(0,1fr)_auto] md:items-center">
          <div>
            <h2 className="font-display text-3xl font-medium group-hover:text-accent">O meu município</h2>
            <p className="mt-2 max-w-[70ch] leading-relaxed text-muted">Procure o seu concelho: quem governa a câmara, quantos vereadores tem cada lista e as leis do Parlamento sobre o concelho.</p>
          </div>
          <span className="inline-flex items-center gap-2 font-medium text-accent">
            Procurar <ArrowRight weight="bold" />
          </span>
        </Link>

        <section className="grid gap-4 sm:grid-cols-2">
          {INSTITUTIONS.map((inst) => (
            <Link key={inst.slug} href={`/estado/${inst.slug}`} className="pressable group rounded-sm border border-line bg-surface p-5 hover:border-accent">
              <div className="flex items-center justify-between gap-3">
                <p className="text-lg font-semibold tracking-tight group-hover:text-accent">{inst.title.pt}</p>
                <ArrowRight className="h-4 w-4 text-muted group-hover:text-accent" aria-hidden />
              </div>
              <p className="mt-2 leading-relaxed text-muted">{inst.summary.pt}</p>
              {inst.sections[0].facts && (
                <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
                  {inst.sections[0].facts.slice(0, 2).map((f) => (
                    <div key={f.label.pt}>
                      <dt className="text-muted">{f.label.pt}</dt>
                      <dd className="font-semibold">{f.value.pt}</dd>
                    </div>
                  ))}
                </dl>
              )}
            </Link>
          ))}
        </section>
      </Container>
    </>
  );
}
