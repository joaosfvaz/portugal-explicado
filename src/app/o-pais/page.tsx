import type { Metadata } from "next";
import { GroupLinks } from "@/components/group-links";
import { Container, PageHeader } from "@/components/ui";
import { INSTITUTIONS } from "@/content/estado";

export const metadata: Metadata = {
  title: "O país",
  description: "Quem decide o quê em Portugal, as leis em discussão no Parlamento, as eleições, o seu município e a economia em números.",
};

export default function OPaisPage() {
  const institutions = Object.fromEntries(INSTITUTIONS.map((i) => [`/estado/${i.slug}`, i.summary.pt]));
  return (
    <>
      <PageHeader title="O país" lead="Quem decide o quê, as leis em discussão, as eleições, o seu município e a economia em números." />
      <Container className="grid gap-10 py-10">
        <GroupLinks group="pais" only={["/estado/municipios", "/parlamento/iniciativas", "/estado/eleicoes", "/economia", "/estado", "/parlamento"]} />
        <section>
          <h2 className="mb-4 font-display text-2xl font-medium">Parlamento</h2>
          <GroupLinks group="pais" only={["/parlamento/partidos", "/parlamento/diario-republica"]} />
        </section>
        <section>
          <h2 className="mb-4 font-display text-2xl font-medium">Como funciona o Estado</h2>
          <GroupLinks group="pais" summaries={institutions} only={Object.keys(institutions)} />
        </section>
      </Container>
    </>
  );
}
