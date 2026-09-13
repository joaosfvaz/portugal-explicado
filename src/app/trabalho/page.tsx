import type { Metadata } from "next";
import { GroupLinks } from "@/components/group-links";
import { HelpBox } from "@/components/help-box";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "Trabalho e reforma",
  description: "Os seus direitos no trabalho, o subsídio de desemprego e como funciona a reforma, com a lei em vigor.",
};

export default function TrabalhoPage() {
  return (
    <>
      <PageHeader title="Trabalho e reforma" lead="Os seus direitos no trabalho, o que fazer se ficar sem emprego e como funciona a reforma." />
      <Container className="grid gap-10 py-10">
        <GroupLinks group="trabalho" />
        <section>
          <h2 className="mb-4 font-display text-2xl font-medium">Sobre o salário</h2>
          <GroupLinks group="dinheiro" only={["/trabalho/salario-liquido", "/trabalho/recibo-de-vencimento", "/impostos/seguranca-social"]} />
        </section>
        <HelpBox topic="trabalho" />
      </Container>
    </>
  );
}
