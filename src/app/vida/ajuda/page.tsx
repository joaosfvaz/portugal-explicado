import type { Metadata } from "next";
import { ContactCard } from "@/components/help-box";
import { Container, PageHeader, SourceList } from "@/components/ui";
import { CONTACTS, CONTACT_SOURCES } from "@/content/contactos";

export const metadata: Metadata = {
  title: "Onde pedir ajuda",
  description: "Os telefones e sites oficiais das Finanças, da Segurança Social, da ACT, do IEFP, do SNS 24 e de outros serviços, com horários.",
};

const GROUPS: { title: string; ids: string[] }[] = [
  { title: "Emergência", ids: ["emergencia", "sns24", "violencia-domestica"] },
  { title: "Impostos, apoios e documentos", ids: ["financas", "seguranca-social", "linha-cidadao"] },
  { title: "Trabalho", ids: ["act", "iefp"] },
  { title: "Reclamar e resolver conflitos", ids: ["livro-reclamacoes", "banco-de-portugal", "provedor", "julgados-de-paz", "apoio-judiciario"] },
];

export default function AjudaPage() {
  return (
    <>
      <PageHeader title="Onde pedir ajuda" lead="Os contactos oficiais para tirar dúvidas, reclamar ou pedir apoio. Toque no número para ligar." />
      <Container className="grid gap-10 py-10">
        {GROUPS.map((g) => (
          <section key={g.title}>
            <h2 className="font-display text-3xl leading-tight font-medium">{g.title}</h2>
            <div className="mt-4 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2 xl:grid-cols-3">
              {g.ids.map((id) => (
                <ContactCard key={id} c={CONTACTS[id]} />
              ))}
            </div>
          </section>
        ))}
        <SourceList sources={CONTACT_SOURCES} />
      </Container>
    </>
  );
}
