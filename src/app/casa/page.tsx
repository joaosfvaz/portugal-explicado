import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { Sparkline } from "@/components/sparkline";
import { Container, PageHeader } from "@/components/ui";
import { formatValue, indicatorViews, periodLabel } from "@/lib/economia/data";

export const metadata: Metadata = {
  title: "Casa",
  description: "Custos de comprar, construir e arrendar casa em Portugal, com as regras de 2026 e simuladores.",
};

const PATHS = [
  { href: "/casa/comprar", title: "Comprar casa", text: "IMT, Imposto do Selo, registo, regras para jovens e limites do crédito.", facts: ["IMT isento até 106 346 € na habitação própria", "Taxa de esforço máxima de 45%"] },
  { href: "/casa/construir", title: "Construir casa", text: "Licença ou comunicação prévia, prazos da câmara, documentos e restituição do IVA.", facts: ["Novas regras a 1 de outubro de 2026", "IVA restituído de 23% para 6% na casa própria"] },
  { href: "/casa/arrendar", title: "Arrendar casa", text: "Atualização das rendas, contratos, IRS de senhorios e inquilinos e apoios.", facts: ["Rendas sobem até 2,24% em 2026", "IRS de 10% para rendas até 2300 €"] },
  { href: "/casa/faturas", title: "Faturas da casa", text: "O que quer dizer cada parte da fatura da luz, da água e da internet, as tarifas sociais e como reclamar.", facts: ["Tarifa social da luz: desconto médio de 33,8%", "Fidelização de 24 meses, no máximo"] },
];

export default function CasaPage() {
  const views = new Map(indicatorViews().map((v) => [v.def.slug, v]));
  const market = ["precos-habitacao", "juro-credito-habitacao"].map((s) => views.get(s)).filter((v) => v !== undefined);

  return (
    <>
      <PageHeader tile="quadrifolio" title="Casa" lead="Quanto custa ter casa em Portugal e o que a lei exige, para quem compra, constrói ou arrenda." />
      <Container className="grid gap-10 py-8">
        <section className="grid gap-4 sm:grid-cols-2">
          {PATHS.map((p) => (
            <Link key={p.href} href={p.href} className="pressable group flex flex-col rounded-sm border border-line bg-surface p-6 hover:border-accent">
              <span className="flex items-center justify-between gap-3">
                <span className="text-xl font-semibold tracking-tight group-hover:text-accent">{p.title}</span>
                <ArrowRight className="h-4 w-4 text-muted group-hover:text-accent" aria-hidden />
              </span>
              <span className="mt-2 leading-relaxed text-muted">{p.text}</span>
              <ul className="mt-5 grid gap-1.5 border-t border-line pt-4 text-sm">
                {p.facts.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </Link>
          ))}
        </section>

        {market.length > 0 && (
          <section>
            <h2 className="font-display text-2xl leading-tight font-medium">O mercado agora</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              {market.map((v) => (
                <Link key={v.def.slug} href={`/economia/${v.def.slug}`} className="pressable group rounded-sm border border-line bg-surface p-5 hover:border-accent">
                  <p className="text-sm text-muted">{v.def.title}</p>
                  <p className="mt-1 figures font-display text-4xl leading-none font-medium tracking-[-0.01em]">{formatValue(v.def, v.latest.value)}</p>
                  <p className="text-sm text-muted">{periodLabel(v.latest.period)}</p>
                  <div className="mt-3 text-accent">
                    <Sparkline points={(v.snap.series.PT ?? []).slice(-24)} />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
