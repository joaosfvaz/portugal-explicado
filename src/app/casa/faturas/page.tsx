import type { Metadata } from "next";
import { Glossed } from "@/components/glossary/glossed";
import { HelpBox } from "@/components/help-box";
import { Container, Notice, PageHeader, SourceList, type SourceRef } from "@/components/ui";

export const metadata: Metadata = {
  title: "Perceber as faturas da casa",
  description: "O que quer dizer cada parte da fatura da luz, da água, do gás e das telecomunicações, as tarifas sociais e os seus direitos para cancelar ou reclamar.",
};

const CHECKED = "2026-09-13";

type Line = { name: string; text: string };

const ELECTRICITY: Line[] = [
  { name: "Potência contratada", text: "A força máxima de eletricidade que pode usar ao mesmo tempo, em kVA. Paga um valor fixo por dia, mesmo sem gastar. Mais potência, valor fixo mais alto. Muitas casas têm 3,45 ou 6,9 kVA." },
  { name: "Energia (kWh)", text: "O que gastou. Na tarifa simples, o preço é igual a toda a hora. Na bi-horária, é mais barato nas horas de vazio e mais caro fora delas." },
  { name: "Redes", text: "Uma parte do preço paga os cabos que trazem a eletricidade até casa. É fixada pela ERSE e é igual em qualquer empresa. Em 2026 subiu 3,5% para as casas." },
  { name: "Contribuição audiovisual", text: "Paga a rádio e televisão públicas e vem na fatura da luz, mesmo sem televisão: 2,85 € por mês mais IVA de 6%. Quem gasta menos de 400 kWh por ano não paga. Alguns beneficiários de apoios sociais pagam 1 €." },
  { name: "Imposto sobre a eletricidade e taxa da DGEG", text: "Duas pequenas linhas: um imposto por cada kWh gasto e uma taxa fixa mensal para a fiscalização das instalações. Quem tem tarifa social não paga o imposto." },
  { name: "IVA", text: "Com potência até 6,9 kVA, os primeiros 200 kWh de cada 30 dias pagam IVA de 6%, ou 300 kWh em famílias com 5 ou mais pessoas. Com potência até 3,45 kVA, a parte fixa das redes também paga 6%. O resto paga 23%. Estas taxas são do continente: nos Açores e na Madeira as taxas de IVA são mais baixas." },
];

const WATER: Line[] = [
  { name: "Parte fixa", text: "Um valor fixo por período, mesmo sem gastar água. Paga a rede e a manutenção." },
  { name: "Água gasta", text: "O que gastou, em metros cúbicos: 1 m³ são 1 000 litros. Em muitos municípios o preço do m³ sobe à medida que gasta mais." },
  { name: "Saneamento e lixo", text: "A recolha e o tratamento dos esgotos e do lixo aparecem muitas vezes na mesma fatura." },
  { name: "IVA", text: "No continente, a água da torneira paga IVA de 6%. Nos Açores e na Madeira a taxa é mais baixa." },
];

const TELECOM: Line[] = [
  { name: "Fidelização", text: "O tempo em que prometeu não cancelar. Não pode passar de 24 meses. As empresas também têm de oferecer contratos de 6 e 12 meses, e sem fidelização, e mostrar a diferença de preço." },
  { name: "Cancelar antes do fim", text: "Nos contratos desde 14 de novembro de 2022, paga no máximo 50% das mensalidades que faltam se cancelar no 1.º ano, e 30% no 2.º ano, ou menos se a vantagem que recebeu valer menos. A fatura tem de mostrar quando acaba a fidelização e quanto pagaria para sair." },
  { name: "Aumentos de preço", text: "Se o aumento não está previsto no contrato, ou é maior do que o previsto, a empresa tem de avisar por escrito com pelo menos 1 mês. Depois do aviso, tem 30 dias para cancelar sem pagar nada." },
  { name: "Tarifa social de internet", text: "Internet por 5 € mais IVA por mês, para quem recebe apoios como o complemento solidário para idosos, o rendimento social de inserção, prestações de desemprego ou abono de família. Peça ao seu operador." },
];

const SOCIAL = [
  { name: "Tarifa social da eletricidade", text: "Desconto médio de 33,8% na fatura, sem contar impostos, e isenção do imposto sobre a eletricidade. É automática para quem tem potência até 6,9 kVA e recebe certos apoios sociais, ou tem rendimento anual até 6 272,64 €, mais 50% por cada pessoa da casa sem rendimentos. Vale em qualquer empresa." },
  { name: "Tarifa social do gás natural", text: "Desconto médio de 31,2%, para quem recebe certos apoios sociais e gasta até 500 m³ por ano. É automática." },
  { name: "Tarifa social da água", text: "Muitos municípios têm tarifas mais baixas para famílias com poucos rendimentos ou numerosas. As regras mudam de município para município: pergunte à câmara ou à empresa de águas." },
];

const SOURCES: SourceRef[] = [
  { title: "ERSE, compreender a fatura de eletricidade", url: "https://www.erse.pt/consumidores-de-energia/eletricidade/compreender-a-fatura/", verifiedOn: CHECKED, verification: "primary" },
  { title: "ERSE, tarifas e preços da eletricidade para 2026 (comunicado de 15-12-2025)", url: "https://www.erse.pt/media/5dypdjby/comunicado-tarifas-ele_2026.pdf", verifiedOn: CHECKED, verification: "primary" },
  { title: "ERSE, aplicação do IVA na fatura de eletricidade", url: "https://www.erse.pt/media/tcsfm4n2/ersexplica_iva-fatura_2025.pdf", verifiedOn: CHECKED, verification: "primary" },
  { title: "ERSE, tarifa social de eletricidade e gás natural (janeiro de 2026)", url: "https://www.erse.pt/media/fnuf2l0a/tarifa-social_eletricidade_gas_jan2026_pt.pdf", verifiedOn: CHECKED, verification: "primary" },
  { title: "Código do IVA, Lista I (verbas 1.7, 2.33 e 2.38)", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/civa_rep/Pages/c-iva-listas.aspx", verifiedOn: CHECKED, verification: "primary" },
  { title: "ANACOM, períodos de fidelização", url: "https://www.anacom-consumidor.pt/faq-periodos-de-fidelizacao", verifiedOn: CHECKED, verification: "primary" },
  { title: "ANACOM, atualizações de preços em 2026", url: "https://www.anacom-consumidor.pt/-/atualizacoes-de-precos-em-2026-o-que-deve-saber-sobre-o-seu-contrato-de-comunicacoes", verifiedOn: CHECKED, verification: "primary" },
  { title: "ANACOM, tarifa social de internet", url: "https://www.anacom-consumidor.pt/faq-tarifa-social-de-internet-tsi", verifiedOn: CHECKED, verification: "primary" },
];

function Block({ title, lead, lines }: { title: string; lead?: string; lines: Line[] }) {
  return (
    <section>
      <h2 className="font-display text-3xl leading-tight font-medium">{title}</h2>
      {lead && <p className="mt-1 max-w-[75ch] text-muted">{lead}</p>}
      <dl className="mt-4 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
        {lines.map((l) => (
          <div key={l.name} className="bg-surface p-5">
            <dt className="font-semibold">{l.name}</dt>
            <dd className="mt-1.5 leading-relaxed text-muted">
              <Glossed>{l.text}</Glossed>
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function FaturasPage() {
  return (
    <>
      <PageHeader title="Perceber as faturas da casa" lead="O que quer dizer cada parte da fatura da luz, da água e das telecomunicações, os descontos para quem ganha menos e os seus direitos." />
      <Container className="grid gap-12 py-10">
        <Block title="Luz" lead="As linhas que aparecem na fatura de eletricidade de uma casa." lines={ELECTRICITY} />
        <Notice tone="neutral" title="Comparar preços">
          No mercado livre, cada empresa escolhe os seus preços. No mercado regulado, é a ERSE que fixa o preço. Para comparar ofertas, tenha à mão a potência, a opção horária e o consumo anual,
          que estão na fatura, e use o simulador da ERSE.
        </Notice>
        <Block title="Água" lead="Os preços da água mudam de município para município. Cada câmara ou empresa de águas tem o seu tarifário." lines={WATER} />
        <Block title="Telefone, internet e televisão" lines={TELECOM} />
        <Block title="Tarifas sociais" lead="Descontos para quem recebe apoios sociais ou tem rendimentos baixos." lines={SOCIAL} />
        <Notice tone="warn" title="Para reclamar">
          Reclame primeiro à empresa. Se não resolver, use o Livro de Reclamações Eletrónico. Sobre energia, a linha da ERSE é o 213 033 200, em dias úteis das 9h às 19h.
        </Notice>
        <HelpBox topic="casa" />
        <SourceList sources={SOURCES} />
      </Container>
    </>
  );
}
