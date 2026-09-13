import type { Metadata } from "next";
import { ParaMim } from "@/components/para-mim";
import { Container, PageHeader } from "@/components/ui";

export const metadata: Metadata = {
  title: "O que é para mim",
  description: "Responda a quatro perguntas simples e veja só as páginas que interessam à sua situação: trabalho, casa, família e dinheiro.",
};

export default function ParaMimPage() {
  return (
    <>
      <PageHeader title="O que é para mim?" lead="Responda a quatro perguntas simples. Mostramos só as páginas que interessam à sua vida." />
      <Container className="py-10">
        <ParaMim />
      </Container>
    </>
  );
}
