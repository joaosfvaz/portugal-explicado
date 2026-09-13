import type { Metadata } from "next";
import { MunicipioSearch } from "@/components/municipio-search";
import { Container, EmptyState, PageHeader } from "@/components/ui";
import { getMunicipios } from "@/lib/municipios/data";

export const metadata: Metadata = {
  title: "O meu município",
  description: "Procure o seu concelho e veja quem ganhou a câmara nas autárquicas de 2025, quantos vereadores tem cada lista e as leis do Parlamento sobre o concelho.",
};

export default function MunicipiosPage() {
  const snap = getMunicipios();
  return (
    <>
      <PageHeader
        title="O meu município"
        lead="Procure o seu concelho. Veja quem governa a câmara, quantos vereadores tem cada lista e o que o Parlamento decidiu sobre o concelho."
      />
      <Container className="py-10">
        {snap ? (
          <MunicipioSearch items={snap.municipios.map((m) => ({ slug: m.slug, name: m.name, district: m.district, winner: m.council[0]?.short ?? "" }))} />
        ) : (
          <EmptyState title="Ainda não há dados importados">
            Corra <code className="font-mono">npm run import:municipios</code>.
          </EmptyState>
        )}
      </Container>
    </>
  );
}
