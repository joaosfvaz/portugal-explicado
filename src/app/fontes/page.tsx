import type { Metadata } from "next";
import { Container, PageHeader, SourceList } from "@/components/ui";
import { getEconomia } from "@/lib/economia/data";
import { INDICATORS } from "@/lib/economia/indicators";
import { formatDate } from "@/lib/format";
import { getDrActs, getMeta } from "@/lib/parlamento/data";
import { availableTaxYears, getTaxYear } from "@/lib/tax/data";
import { taxSources } from "@/lib/tax/sources";
import { INSTITUTIONS } from "@/content/estado";
import { GUIDES } from "@/content/vida";
import { ABONO_2026, DESEMPREGO_2026 } from "@/lib/beneficios/rules-2026";

const uniq = <T extends { url: string }>(list: T[]) => [...new Map(list.map((x) => [x.url, x])).values()];

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Fontes",
  description: "Todas as fontes oficiais usadas, com a data de verificação ou de importação.",
};

export default function FontesPage() {
  const years = availableTaxYears().map((y) => getTaxYear(y)!);
  const meta = getMeta();
  const dr = getDrActs();
  const eco = getEconomia();
  const ecoSources = [...new Map(INDICATORS.map((i) => [i.sourceName, i])).values()].map((i) => ({
    title: `${i.sourceName}${eco ? ` (importado em ${formatDate(eco.importedAt)})` : ""}`,
    url: i.sourceUrl,
  }));

  return (
    <>
      <PageHeader
        title="Fontes"
        lead="Usamos apenas fontes oficiais. Os valores fiscais são verificados à mão e guardados por ano; os dados do Parlamento e da economia são importados automaticamente."
      />
      <Container className="max-w-4xl py-6">
        <section>
          <h2 className="mt-6 font-display text-3xl leading-tight font-medium tracking-[-0.01em]">Como classificamos cada valor</h2>
          <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-sm bg-sunken p-4">
              <dt className="font-semibold">Fonte oficial</dt>
              <dd className="mt-1 text-muted">Lido no texto legal ou na publicação de uma entidade pública. Pode ser usado nas calculadoras.</dd>
            </div>
            <div className="rounded-sm bg-sunken p-4">
              <dt className="font-semibold">Calculado a partir da lei</dt>
              <dd className="mt-1 text-muted">Resulta de uma regra oficial, por exemplo 55 vezes o IAS. Pode ser usado nas calculadoras.</dd>
            </div>
            <div className="rounded-sm bg-sunken p-4">
              <dt className="font-semibold">A confirmar</dt>
              <dd className="mt-1 text-muted">Confirmado apenas em fontes secundárias. Aparece no texto com aviso e nunca nas calculadoras.</dd>
            </div>
            <div className="rounded-sm bg-sunken p-4">
              <dt className="font-semibold">Incerto</dt>
              <dd className="mt-1 text-muted">Não conseguimos confirmar. Não é mostrado como facto.</dd>
            </div>
          </dl>
        </section>

        {years.map((y) => (
          <SourceList
            key={y.year}
            heading={`Impostos ${y.year}`}
            sources={taxSources(y, ["irsBrackets", "irsJovem", "ias", "minimumWageMonthly", "minimoExistencia", "deducaoEspecificaCatA", "solidaritySurcharge", "socialSecurity"])}
          />
        ))}

        <SourceList
          heading="Parlamento e leis"
          sources={[
            ...(meta?.sources.map((s) => ({ ...s, title: `${s.title} (importado em ${formatDate(meta.importedAt)})` })) ?? []),
            {
              title: `Diário da República, feed RSS da 1.ª série${dr ? ` (importado em ${formatDate(dr.importedAt)})` : ""}`,
              url: "https://files.diariodarepublica.pt/rss/serie1-html.xml",
            },
          ]}
        />

        <SourceList heading="Economia" sources={ecoSources} />

        <SourceList
          heading="Casa"
          sources={[
            { title: "Ofício Circulado n.º 40129/2026 (tabelas de IMT)", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/instrucoes_administrativas/Documents/Oficio_circulado_40129_2026.pdf", verifiedOn: "2026-09-12", verification: "primary" },
            { title: "Decreto-Lei n.º 97/2026 (habitação: IMT, IRS das rendas, IVA na construção)", url: "https://files.diariodarepublica.pt/1s/2026/05/09700/0001400040.pdf", verifiedOn: "2026-09-12", verification: "primary" },
            { title: "Banco de Portugal, Recomendação Macroprudencial n.º 1/2026", url: "https://www.bportugal.pt/sites/default/files/documents/2026-07/Recomendacao_Macroprudencial_n.1-2026.pdf", verifiedOn: "2026-09-12", verification: "primary" },
            { title: "Decreto-Lei n.º 108/2026 (licenciamento urbanístico)", url: "https://files.diariodarepublica.pt/1s/2026/05/10400/0024600377.pdf", verifiedOn: "2026-09-12", verification: "primary" },
            { title: "Aviso n.º 23174/2025/2 (coeficiente das rendas 2026)", url: "https://diariodarepublica.pt/dr/detalhe/aviso/23174-2025-935742337", verifiedOn: "2026-09-12", verification: "primary" },
          ]}
        />

        <SourceList
          heading="Apoios sociais"
          sources={[...ABONO_2026.sources, ...DESEMPREGO_2026.sources].map((x) => ({ ...x, verifiedOn: "2026-09-12", verification: "primary" }))}
        />

        <SourceList heading="O Estado" sources={uniq(INSTITUTIONS.flatMap((i) => i.sources))} />
        <SourceList heading="Vida e burocracia" sources={uniq(GUIDES.flatMap((g) => g.sources))} />
      </Container>
    </>
  );
}
