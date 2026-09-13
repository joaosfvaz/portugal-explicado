import type { Metadata } from "next";
import { LandlordTaxCalculator, RentUpdateCalculator, TenantDeductionCalculator } from "@/components/casa/rent-calculators";
import { FactGrid, RuleTable, Section } from "@/components/casa/content";
import { Container, PageHeader, SourceList } from "@/components/ui";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "Arrendar casa em 2026",
  description: "Atualização das rendas, regras do contrato, IRS de senhorios e inquilinos, Porta 65 e apoio extraordinário à renda.",
};

const CHECKED = "2026-09-12";

export default function ArrendarPage() {
  return (
    <>
      <PageHeader
        title="Arrendar casa"
        lead="As regras para inquilinos e senhorios: quanto pode subir a renda, quanto tempo dura o contrato, que impostos se pagam e que apoios existem."
      />
      <Container className="grid gap-14 py-8">
        <Section title="Quanto pode subir a renda" id="atualizacao">
          <RentUpdateCalculator />
        </Section>

        <Section title="Regras do contrato" lead="Valem quando o contrato não diz outra coisa, e algumas valem sempre.">
          <FactGrid
            items={[
              { label: "Duração", value: "1 a 30 anos", note: "Se o contrato não disser, são 5 anos. Renova por períodos iguais, ou 3 anos se forem mais curtos." },
              { label: "Caução", value: "Até 2 rendas" },
              { label: "Rendas adiantadas", value: "Até 2 meses" },
              { label: "Primeira renovação", value: "O senhorio não pode terminar antes de 3 anos", note: "Salvo necessidade de habitação própria ou de um filho." },
              { label: "Registo nas Finanças", value: "Até ao fim do mês seguinte", note: "Pelo senhorio. Se não o fizer, o inquilino pode comunicar. Imposto do Selo de 10% de uma renda." },
              { label: "Litígios", value: "Balcão do Arrendatário e do Senhorio", note: "Os julgados de paz tratam litígios até 15 000 €, exceto despejos." },
            ]}
          />
        </Section>

        <Section title="Pré-aviso para terminar o contrato">
          <RuleTable
            head={["Duração do contrato ou da renovação", "Senhorio (oposição à renovação)", "Inquilino (oposição à renovação)"]}
            rows={[
              ["6 anos ou mais", "240 dias", "120 dias"],
              ["1 a 6 anos", "120 dias", "90 dias"],
              ["6 meses a 1 ano", "60 dias", "60 dias"],
              ["Menos de 6 meses", "1/3 do prazo", "1/3 do prazo"],
            ]}
          />
          <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">
            O inquilino pode sair antes do fim depois de cumprido 1/3 do prazo, com 120 dias de aviso (contratos de 1 ano ou mais) ou 60 dias (menos de 1 ano). Sem aviso suficiente paga as rendas desse período, salvo desemprego involuntário, incapacidade permanente ou morte.
          </p>
        </Section>

        <Section title="IRS do senhorio" lead="Desde 2026, rendas até 2300 € por mês pagam 10%, também nos contratos antigos, até 2029.">
          <LandlordTaxCalculator />
        </Section>

        <Section title="Dedução do inquilino no IRS">
          <TenantDeductionCalculator />
        </Section>

        <Section title="Apoios à renda">
          <FactGrid
            items={[
              { label: "Porta 65 Jovem", value: "18 a 35 anos", note: "Rendimento até 4 salários mínimos e taxa de esforço até 60%. Candidaturas contínuas, avaliadas todos os meses. Apoio em períodos de 12 meses, até 60 meses." },
              { label: "Porta 65+", value: "50 € a 200 € por mês", note: "Qualquer idade, se o rendimento cair mais de 20% ou se a família for monoparental." },
              { label: "Apoio extraordinário à renda", value: "Até 200 € por mês", note: "Contratos até 15 de março de 2023, taxa de esforço de 35% ou mais. Atribuído automaticamente e pago até dia 20. Em vigor até 2028." },
            ]}
          />
          <p className="mt-3 max-w-[75ch] text-sm leading-relaxed text-muted">
            O novo regime de arrendamento acessível (RSAA), com isenção de IRS para o senhorio, começou a 1 de setembro de 2026, mas os limites de renda por concelho ainda dependem de uma portaria por publicar.
          </p>
        </Section>

        <HelpBox topic="casa" />

        <SourceList
          sources={[
            { title: "Aviso n.º 23174/2025/2 (coeficiente de atualização das rendas para 2026)", url: "https://diariodarepublica.pt/dr/detalhe/aviso/23174-2025-935742337", verifiedOn: CHECKED, verification: "primary" },
            { title: "INE, Índice de Preços no Consumidor, agosto de 2026 (referência para 2027)", url: "https://www.ine.pt/xportal/xmain?xpid=INE&xpgid=ine_destaques&DESTAQUESdest_boui=770565181&DESTAQUESmodo=2", verifiedOn: CHECKED, verification: "primary" },
            { title: "Código Civil, arts. 1076.º a 1104.º (consolidado)", url: "https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/1966-34509075", verifiedOn: CHECKED, verification: "primary" },
            { title: "Decreto-Lei n.º 97/2026 (taxa de 10%, dedução do inquilino, RSAA)", url: "https://files.diariodarepublica.pt/1s/2026/05/09700/0001400040.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Código do IRS, art. 72.º, 41.º e 78.º-E", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs72.aspx", verifiedOn: CHECKED, verification: "primary" },
            { title: "Portal da Habitação, Porta 65 Jovem", url: "https://www.portaldahabitacao.pt/porta-65-jovem1", verifiedOn: CHECKED, verification: "primary" },
            { title: "Decreto-Lei n.º 20-B/2023 (apoio extraordinário à renda), consolidado", url: "https://diariodarepublica.pt/dr/legislacao-consolidada/decreto-lei/2023-210911375", verifiedOn: CHECKED, verification: "primary" },
          ]}
        />
      </Container>
    </>
  );
}
