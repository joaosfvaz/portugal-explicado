import type { Metadata } from "next";
import { ShieldCheck, Warning } from "@phosphor-icons/react/dist/ssr";
import { Container, Notice, PageHeader, SourceList, type SourceRef } from "@/components/ui";

export const metadata: Metadata = {
  title: "Mensagens falsas e burlas",
  description: "Como saber se uma SMS, email ou chamada das Finanças, CTT, banco ou MB WAY é verdadeira, o que fazer se já caiu numa burla e onde denunciar.",
};

const CHECKED = "2026-09-13";

const NEVER = [
  { org: "Bancos", text: "Um banco nunca lhe pede, por email, SMS ou telefone, as senhas do homebanking, os dados do cartão ou os códigos que recebe por SMS. Os burlões conseguem imitar o número e o email do banco." },
  { org: "Finanças", text: "Há emails e SMS falsos em nome das Finanças. Não dê o NIF nem a senha e não abra links nem ficheiros. As mensagens verdadeiras estão todas no Portal das Finanças, em «A minha Área», «Comunicações»." },
  { org: "CTT", text: "SMS, emails ou WhatsApp sobre encomendas retidas, taxas de alfândega, morada errada ou nova entrega, com links, são falsos e não vêm dos CTT." },
  { org: "MB WAY", text: "Nunca partilhe o PIN MB WAY, nem como pagamento nem como garantia. Nunca junte ao MB WAY um número de telemóvel que não é seu. Não siga instruções de desconhecidos para aderir ou pagar." },
];

const CHECK = [
  "Não carregue no link, não leia o código QR e não abra anexos. Escreva você o endereço oficial no navegador, ou abra a app do banco.",
  "Antes de pôr a senha das Finanças, confirme que o endereço começa por https://www.portaldasfinancas.gov.pt ou https://www.acesso.gov.pt.",
  "Desconfie de pressa e ameaças: «a conta vai ser bloqueada», «encomenda retida», «atualize em 12 horas». Veja o endereço real de quem envia e os erros de português.",
  "Mesmo que o número ou o email pareçam verdadeiros, desligue. Ligue você para a entidade, pelos contactos oficiais, nunca pelos contactos da mensagem.",
  "Nunca dê a ninguém o PIN, as senhas, os dados do cartão ou os códigos que recebe por SMS.",
];

const FOOLED = [
  "Ligue já para o seu banco, pelos contactos que o banco lhe deu.",
  "Peça para cancelar o acesso ao homebanking ou à app e, se for o caso, o cartão.",
  "Mude as senhas das contas afetadas: email, Portal das Finanças, Segurança Social Direta. Use senhas diferentes.",
  "Guarde provas: fotografias do ecrã com a mensagem, o número ou email de quem enviou, os links e os comprovativos de pagamento.",
  "Faça queixa na PSP, na GNR, na Polícia Judiciária ou no Ministério Público. A queixa por burla também pode ser feita pela internet, no Sistema Queixa Eletrónica.",
];

const REPORT = [
  { org: "Polícia (PSP, GNR ou PJ) ou Ministério Público", how: "Queixa numa esquadra, posto ou serviço do Ministério Público, ou pela internet no Sistema Queixa Eletrónica." },
  { org: "Linha Internet Segura (APAV)", how: "Apoio gratuito e confidencial a vítimas de crimes pela internet. 800 219 090, dias úteis das 8h às 23h." },
  { org: "Centro Nacional de Cibersegurança", how: "Para comunicar emails, SMS ou sites falsos: formulário no site do CNCS ou email cert@cert.pt. Não substitui a queixa à polícia." },
  { org: "Polícia Judiciária, cibercrime", how: "Email unc3t@pj.pt." },
];

const SOURCES: SourceRef[] = [
  { title: "Banco de Portugal, contacto supostamente do seu banco a pedir dados", url: "https://www.bportugal.pt/page/recebeu-um-contacto-supostamente-do-seu-banco-pedir-lhe-dados-pessoais-saiba-o-que-fazer", verifiedOn: CHECKED, verification: "primary" },
  { title: "Banco de Portugal, operação que não reconhece na conta", url: "https://www.bportugal.pt/page/consultou-os-movimentos-da-sua-conta-e-ha-uma-operacao-que-nao-reconhece-saiba-o-que-fazer", verifiedOn: CHECKED, verification: "primary" },
  { title: "Autoridade Tributária, folheto Segurança da Informação", url: "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/SEG_INF.pdf", verifiedOn: CHECKED, verification: "primary" },
  { title: "CTT, alertas de phishing", url: "https://www.ctt.pt/transversais/alertas-de-phishing", verifiedOn: CHECKED, verification: "primary" },
  { title: "MB WAY, segurança", url: "https://www.mbway.pt/seguranca/", verifiedOn: CHECKED, verification: "primary" },
  { title: "Ministério Público, onde apresentar uma queixa", url: "https://www.ministeriopublico.pt/faq/onde-posso-apresentar-uma-queixa", verifiedOn: CHECKED, verification: "primary" },
  { title: "CNCS, como reportar um incidente", url: "https://www.cncs.gov.pt/pt/como-reportar-um-incidente/", verifiedOn: CHECKED, verification: "primary" },
  { title: "Linha Internet Segura, sobre a linha", url: "https://www.internetsegura.pt/lis/sobre-a-lis", verifiedOn: CHECKED, verification: "primary" },
];

export default function BurlasPage() {
  return (
    <>
      <PageHeader title="Mensagens falsas e burlas" lead="Recebeu uma SMS, um email ou uma chamada a pedir dados ou dinheiro? Veja como confirmar se é verdade, o que fazer se já respondeu e onde denunciar." />
      <Container className="grid gap-12 py-10">
        <Notice tone="bad" title="A regra mais importante">
          Nenhuma entidade séria lhe pede senhas, códigos ou o PIN por mensagem ou telefone. Na dúvida, não responda e ligue você para a entidade, pelo número oficial.
        </Notice>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">O que nunca lhe pedem</h2>
          <dl className="mt-4 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {NEVER.map((n) => (
              <div key={n.org} className="bg-surface p-5">
                <dt className="font-display text-2xl font-medium">{n.org}</dt>
                <dd className="mt-1.5 leading-relaxed text-muted">{n.text}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="flex items-center gap-2 font-display text-3xl leading-tight font-medium">
              <ShieldCheck className="h-7 w-7 text-accent" aria-hidden /> Como confirmar
            </h2>
            <ol className="mt-4 grid gap-3">
              {CHECK.map((c, i) => (
                <li key={c} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 leading-relaxed">
                  <span className="grid h-8 w-8 place-items-center rounded-sm bg-accent-soft font-display text-lg text-accent-strong figures">{i + 1}</span>
                  {c}
                </li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="flex items-center gap-2 font-display text-3xl leading-tight font-medium">
              <Warning className="h-7 w-7 text-danger" aria-hidden /> Se já respondeu ou pagou
            </h2>
            <ol className="mt-4 grid gap-3">
              {FOOLED.map((c, i) => (
                <li key={c} className="grid grid-cols-[2rem_minmax(0,1fr)] gap-3 leading-relaxed">
                  <span className="grid h-8 w-8 place-items-center rounded-sm bg-danger-soft font-display text-lg text-danger figures">{i + 1}</span>
                  {c}
                </li>
              ))}
            </ol>
            <p className="mt-4 rounded-sm bg-sunken p-4 text-sm leading-relaxed">
              <strong>Os seus direitos:</strong> depois de avisar o banco, as operações seguintes são responsabilidade do banco. Por operações que não autorizou, paga no máximo 50 €, salvo se não
              cumpriu as regras de segurança, por exemplo se deu os seus códigos. Em regra, o banco devolve o dinheiro até ao fim do dia útil seguinte ao aviso, mas essa devolução é provisória e o banco pode anulá-la se provar negligência grave.
            </p>
          </div>
        </section>

        <section>
          <h2 className="font-display text-3xl leading-tight font-medium">Onde denunciar</h2>
          <dl className="mt-4 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
            {REPORT.map((r) => (
              <div key={r.org} className="bg-surface p-5">
                <dt className="font-semibold">{r.org}</dt>
                <dd className="mt-1.5 leading-relaxed text-muted">{r.how}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-3 text-sm text-muted">Não mostramos uma lista das burlas do momento: mudam todas as semanas, e uma mensagem falsa nova não estaria na lista. Use sempre os passos acima.</p>
        </section>

        <SourceList sources={SOURCES} />
      </Container>
    </>
  );
}
