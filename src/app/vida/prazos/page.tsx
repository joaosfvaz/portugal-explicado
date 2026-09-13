import type { Metadata } from "next";
import { DeadlineCalendar } from "@/components/prazos";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { PRAZOS_SOURCES } from "@/content/prazos";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "Datas a não esquecer",
  description: "Os prazos do IRS, do IMI, do IUC, da Segurança Social e do abono de família até ao fim de 2027, com o que fazer e o que acontece se falhar.",
};

// The list hides past dates, so rebuild the page once a day.
export const revalidate = 86400;

export default function PrazosPage() {
  const today = new Date().toISOString().slice(0, 10);
  return (
    <>
      <PageHeader
        title="Datas a não esquecer"
        lead="Os prazos que custam dinheiro quando se esquecem. Escolha a sua situação e ponha as datas no calendário do telemóvel, com um aviso 7 dias antes."
      />
      <Container className="grid gap-10 py-10">
        <DeadlineCalendar today={today} />
        <Notice tone="neutral" title="Sobre as datas">
          Quando um prazo acaba num sábado, domingo ou feriado, as Finanças costumam passá-lo para o dia útil seguinte, mas nem sempre o anunciam com antecedência. Não deixe para o último dia.
        </Notice>
        <HelpBox topic="impostos" />

        <SourceList sources={PRAZOS_SOURCES} />
      </Container>
    </>
  );
}
