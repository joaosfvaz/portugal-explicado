import type { Metadata } from "next";
import { BuildCalculator } from "@/components/casa/build-calculator";
import { FactGrid, Section, Steps } from "@/components/casa/content";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";

export const metadata: Metadata = {
  title: "Construir casa em 2026",
  description: "Licença ou comunicação prévia, prazos, documentos obrigatórios, impostos do terreno e restituição do IVA na construção da habitação própria.",
};

const CHECKED = "2026-09-12";

export default function ConstruirPage() {
  return (
    <>
      <PageHeader
        title="Construir casa"
        lead="Os passos para construir uma moradia, os prazos da câmara, os documentos obrigatórios e os custos que não dependem do empreiteiro."
      />
      <Container className="grid gap-14 py-8">
        <Notice tone="warn" title="As regras mudam a 1 de outubro de 2026">
          O Decreto-Lei n.º 108/2026 revê o regime do licenciamento (RJUE) a partir de 1 de outubro de 2026. Esta página segue as novas regras. Nos pedidos feitos antes, a câmara decide em 120 dias (até 300 m² de construção) ou 150 dias (300 a 2200 m²), com deferimento tácito.
        </Notice>

        <Section title="Licença ou comunicação prévia?">
          <FactGrid
            items={[
              { label: "Comunicação prévia", value: "Terreno com plano de pormenor, loteamento ou unidade de execução com parâmetros", note: "Também em zona urbana consolidada, sem cedências e com altura igual à das fachadas da rua. Não pode escolher a licença." },
              { label: "Licença", value: "Terreno só abrangido pelo PDM", note: "Também em áreas com servidões ou restrições, ou em zonas de proteção de imóveis classificados." },
              { label: "Isenção", value: "Com um pedido de informação prévia favorável e completo", note: "A obra tem de seguir exatamente o que foi aprovado." },
            ]}
          />
        </Section>

        <Section title="Passo a passo, com licença" lead="Os prazos são os do regime em vigor a partir de 1 de outubro de 2026. O silêncio da câmara nos prazos de decisão vale como aprovação.">
          <Steps
            items={[
              { title: "Pedido de informação prévia (opcional)", meta: "Decisão em 20 + 30 dias", body: "Pergunta à câmara o que pode construir no terreno. Um parecer favorável vale 2 anos, prorrogáveis por mais 1." },
              { title: "Projeto de arquitetura e termos de responsabilidade", body: "Os autores dos projetos e o coordenador assinam termos de responsabilidade. A câmara não aprecia interiores nem especialidades." },
              { title: "Submeter o pedido de licença", meta: "Saneamento em 20 dias", body: "Pode entregar as especialidades logo ou depois. A câmara verifica se o pedido está completo; se não disser nada, considera-se completo." },
              { title: "Aprovação da arquitetura", meta: "30 dias", body: "Se houver consultas a outras entidades, conta a partir do último parecer. Pode ser prorrogado uma vez." },
              { title: "Projetos de especialidades", meta: "Até 6 meses", body: "Estabilidade, águas e esgotos, eletricidade, ITED, térmica, acústica e outros aplicáveis. Prorrogável por 3 meses." },
              { title: "Decisão final", meta: "20 dias", body: "A licença é titulada pelo comprovativo das taxas pagas e pela notificação do deferimento. Já não há alvará." },
              { title: "Pagar as taxas e avisar o início da obra", meta: "5 dias antes", body: "A obra tem de começar até 12 meses depois do pagamento das taxas. Entregue a apólice de seguro de acidentes de trabalho." },
              { title: "Construir", body: "O diretor de obra regista tudo no livro de obra. Com 2 ou mais empresas em obra, é obrigatório um coordenador de segurança." },
              { title: "Começar a usar a casa", body: "Entrega uma comunicação prévia com o termo de responsabilidade do diretor de obra e pode usar a casa logo. A autorização de utilização deixou de existir." },
            ]}
          />
        </Section>

        <Section title="Documentos obrigatórios">
          <FactGrid
            items={[
              { label: "Certificação energética", value: "Pré-certificado antes da obra e certificado no fim", note: "Não foi dispensada pelas simplificações do licenciamento." },
              { label: "Estudo de ruído", value: "Com o pedido de licença" },
              { label: "Seguro de acidentes de trabalho", value: "No início da obra" },
              { label: "Plano de segurança e saúde", value: "Feito na fase de projeto", note: "A câmara não o pode exigir no pedido." },
              { label: "Ficha técnica da habitação", value: "Continua obrigatória", note: "Já não tem de ser mostrada na escritura." },
              { label: "Instalação de gás", value: "Já não é obrigatória em casas novas" },
            ]}
          />
        </Section>

        <Section title="Estimativa de custos" lead="Os impostos e a restituição de IVA seguem a lei. O preço da obra, as taxas municipais e os projetos são valores seus.">
          <BuildCalculator />
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <Notice tone="neutral" title="Taxas municipais variam muito">
              Em Almada, a taxa de urbanização é de 67,44 € a 70,99 € por m² em 2026. Em Oliveira do Bairro, a taxa de licença de uma moradia até 200 m² é de 0,63 € por m², mais outras taxas. Consulte o regulamento do seu município.
            </Notice>
            <Notice tone="neutral" title="Não há um preço oficial de construção">
              O INE publica um índice, não um preço por m²: em julho de 2026 os custos de construção de habitação nova subiram 6,8% num ano. Os 570 € por m² da Portaria n.º 471/2025/1 servem só para o cálculo do IMI.
            </Notice>
          </div>
        </Section>

        <SourceList
          sources={[
            { title: "Decreto-Lei n.º 108/2026 (revisão do RJUE)", url: "https://files.diariodarepublica.pt/1s/2026/05/10400/0024600377.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Decreto-Lei n.º 155-B/2026 (entrada em vigor a 1 de outubro de 2026)", url: "https://files.diariodarepublica.pt/1s/2026/07/14705/0000200003.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Portaria n.º 320/2026/1 (elementos dos pedidos)", url: "https://files.diariodarepublica.pt/1s/2026/07/14700/0003500087.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Decreto-Lei n.º 10/2024 (regime até 30 de setembro de 2026)", url: "https://files.diariodarepublica.pt/1s/2024/01/00500/0000500052.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Decreto-Lei n.º 97/2026, Anexo II (restituição de IVA)", url: "https://files.diariodarepublica.pt/1s/2026/05/09700/0001400040.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Decreto-Lei n.º 101-D/2020 (certificação energética)", url: "https://files.dre.pt/1s/2020/12/23701/0002100045.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Decreto-Lei n.º 273/2003 (segurança em obra)", url: "https://files.dre.pt/1s/2003/10/251a00/71997211.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Almada, Regulamento n.º 125/2026 (taxas urbanísticas)", url: "https://files.diariodarepublica.pt/2s/2026/02/025000000/0027300360.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "INE, Índice de Custos de Construção de Habitação Nova", url: "https://www.ine.pt/ine/json_indicador/pindica.jsp?op=2&varcd=0011748&lang=PT", verifiedOn: CHECKED, verification: "primary" },
            { title: "Portaria n.º 471/2025/1 (valor médio de construção para IMI)", url: "https://files.diariodarepublica.pt/1s/2025/12/24800/0000700007.pdf", verifiedOn: CHECKED, verification: "primary" },
          ]}
        />
      </Container>
    </>
  );
}
