import type { Metadata } from "next";
import { PurchaseCalculator } from "@/components/casa/purchase-calculator";
import { indicatorViews, periodLabel } from "@/lib/economia/data";
import { FactGrid, RuleTable, Section } from "@/components/casa/content";
import { Container, Notice, PageHeader, SourceList } from "@/components/ui";
import { IMT_2026 } from "@/lib/casa/rules-2026";
import { eur, pct } from "@/lib/format";
import { HelpBox } from "@/components/help-box";

export const metadata: Metadata = {
  title: "Quanto custa comprar casa em 2026",
  description: "IMT, Imposto do Selo, registo, regras para jovens e limites do Banco de Portugal, com um simulador dos custos e da prestação.",
};

const CHECKED = "2026-09-12";

function tableRows(table: typeof IMT_2026.hpp) {
  let from = 0;
  return table.map((b) => {
    const label = Number.isFinite(b.upTo) ? `${eur(from)} a ${eur(b.upTo)}` : `Mais de ${eur(from)}`;
    from = b.upTo;
    return [label, b.flat ? `${pct(b.rate, 1)} sobre todo o valor` : pct(b.rate, 0), b.flat ? "-" : eur(b.deduct, 2)];
  });
}

export default function ComprarPage() {
  const rateView = indicatorViews().find((v) => v.def.slug === "juro-credito-habitacao");
  const averageRate = rateView
    ? { value: Math.round(rateView.latest.value * 100) / 100, label: `${String(rateView.latest.value.toFixed(2)).replace(".", ",")}%, Banco de Portugal, ${periodLabel(rateView.latest.period)}` }
    : undefined;
  return (
    <>
      <PageHeader
        title="Comprar casa"
        lead="Além da entrada, a compra tem impostos e custos que se pagam no dia da escritura. Simule os valores de 2026 e veja se o crédito cabe nos limites do Banco de Portugal."
      />
      <Container className="grid gap-14 py-8">
        <PurchaseCalculator averageRate={averageRate} />

        <Section title="O que muda em 2026">
          <FactGrid
            items={[
              { label: "Taxa de esforço máxima", value: "45%", note: "Desde 1 de agosto de 2026. Antes era 50%." },
              { label: "Prazo máximo do crédito", value: "40 anos até aos 35 anos; 35 anos depois", note: "Conta a idade do comprador mais velho." },
              { label: "IMT para não residentes", value: "7,5% sobre todo o valor", note: "Desde maio de 2026 (Decreto-Lei n.º 97/2026), com exceções e reembolso em alguns casos." },
            ]}
          />
        </Section>

        <Section title="IMT para habitação própria e permanente" lead="IMT = valor × taxa − parcela a abater. O valor é o maior entre o preço e o valor patrimonial tributário.">
          <RuleTable head={["Valor", "Taxa", "Parcela a abater"]} rows={tableRows(IMT_2026.hpp)} />
        </Section>

        <Section title="Regras para jovens até 35 anos" lead="Na primeira compra de habitação própria e permanente, sem ser dependente no IRS e sem ter tido casa nos 3 anos anteriores.">
          <FactGrid
            items={[
              { label: "IMT", value: "Isento até 330 539 €", note: "Entre 330 539 € e 660 982 € paga 8% só sobre a parte acima." },
              { label: "Imposto do Selo na compra", value: "Dedução até 2644,31 €", note: "Na prática, zero até 330 539 €. O Imposto do Selo do crédito paga-se na mesma." },
              { label: "Registo", value: "Casa Pronta a 150 € ou 250 €", note: "No registo separado, isento até 330 539 €." },
              { label: "Garantia pública", value: "Até 15% do valor, casas até 450 000 €", note: "Contratos assinados até 31 de dezembro de 2026. Rendimento até ao 8.º escalão de IRS." },
              { label: "Perde o benefício se", value: "A casa não for HPP em 6 meses", note: "Ou se tiver outro uso nos 6 anos seguintes, salvo exceções." },
            ]}
          />
        </Section>

        <Section title="Depois da compra: IMI">
          <FactGrid
            items={[
              { label: "Taxa de IMI", value: "0,3% a 0,45% do valor patrimonial", note: "Cada município fixa a sua taxa." },
              { label: "Isenção para habitação própria", value: "3 anos", note: "Valor patrimonial até 125 000 € e rendimento do agregado até 153 300 €. É automática." },
              { label: "IMI Familiar", value: "30 €, 70 € ou 140 € a menos", note: "Com 1, 2 ou 3 ou mais dependentes, se o município aderir." },
            ]}
          />
          <div className="mt-4">
            <Notice tone="neutral">
              Os honorários de notário ou advogado e as comissões bancárias não são fixados por lei. No simulador, as comissões são um valor seu. Confirme os valores com o banco.
            </Notice>
          </div>
        </Section>

        <HelpBox topic="casa" />

        <SourceList
          sources={[
            { title: "Código do IMT, art. 9.º e 17.º (Portal das Finanças)", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/CIMT/Pages/cimt17.aspx", verifiedOn: CHECKED, verification: "primary" },
            { title: "Ofício Circulado n.º 40129/2026 (tabelas de IMT 2026)", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/legislacao/instrucoes_administrativas/Documents/Oficio_circulado_40129_2026.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Decreto-Lei n.º 97/2026 (IMT de não residentes)", url: "https://files.diariodarepublica.pt/1s/2026/05/09700/0001400040.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Código do Imposto do Selo, art. 7.º-A e Tabela Geral", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/selo/Pages/selo7a.aspx", verifiedOn: CHECKED, verification: "primary" },
            { title: "Casa Pronta, Ministério da Justiça", url: "https://justica.gov.pt/Servicos/Casa-Pronta", verifiedOn: CHECKED, verification: "primary" },
            { title: "Banco de Portugal, Recomendação Macroprudencial n.º 1/2026", url: "https://www.bportugal.pt/sites/default/files/documents/2026-07/Recomendacao_Macroprudencial_n.1-2026.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Banco de Portugal, Instrução n.º 23/2023 (teste de esforço)", url: "https://www.bportugal.pt/sites/default/files/anexos/instrucoes//479974278_1.docx.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Portaria n.º 236-A/2024/1 (garantia pública para jovens)", url: "https://files.diariodarepublica.pt/gratuitos/1s/2024/09/18801.pdf", verifiedOn: CHECKED, verification: "primary" },
            { title: "Estatuto dos Benefícios Fiscais, art. 46.º (isenção de IMI)", url: "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/Cod_download/Documents/EBF.pdf", verifiedOn: CHECKED, verification: "primary" },
          ]}
        />
      </Container>
    </>
  );
}
