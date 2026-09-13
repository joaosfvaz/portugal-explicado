import type { SourceRef } from "@/components/ui";
import type { Guide } from "./types";

const CHECKED = "2026-09-12";
const src = (title: string, url: string, verification: "primary" | "derived" | "secondary" = "primary"): SourceRef => ({ title, url, verifiedOn: CHECKED, verification });

export const GUIDES: Guide[] = [
  {
    slug: "nif",
    enSlug: "tax-number-nif",
    title: { pt: "Pedir o NIF", en: "Getting a tax number (NIF)" },
    summary: {
      pt: "O Número de Identificação Fiscal é preciso para trabalhar, arrendar casa, abrir conta ou comprar um carro. O pedido é gratuito.",
      en: "The tax identification number (NIF) is needed to work, rent a home, open a bank account or buy a car. The request is free.",
    },
    audience: {
      pt: "Qualquer pessoa, portuguesa ou estrangeira, residente ou não. Quem tem Cartão de Cidadão já tem NIF.",
      en: "Anyone, Portuguese or foreign, resident or not. People with a Portuguese Citizen Card already have a NIF.",
    },
    where: {
      pt: "Num Serviço de Finanças ou Loja do Cidadão, com marcação. Online, através do e-balcão, só por um representante legal ou procurador.",
      en: "At a tax office (Serviço de Finanças) or Citizen Shop (Loja do Cidadão), by appointment. Online through e-balcão only through a legal representative or attorney.",
    },
    facts: [
      { label: { pt: "Custo", en: "Cost" }, value: { pt: "Gratuito", en: "Free" } },
      {
        label: { pt: "Representante fiscal", en: "Tax representative" },
        value: { pt: "Não é obrigatório para pedir o NIF", en: "Not required to get the NIF" },
        note: { pt: "Pode passar a ser, 15 dias depois de criar uma ligação fiscal em Portugal.", en: "It can become required 15 days after you create a tax link in Portugal." },
      },
      { label: { pt: "Mudar para residente", en: "Change to resident" }, value: { pt: "Comunicar em 60 dias", en: "Report within 60 days" } },
      { label: { pt: "Coima por falta de representante obrigatório", en: "Fine for a missing required representative" }, value: { pt: "75 € a 7500 €", en: "€75 to €7,500" } },
    ],
    documents: [
      { pt: "Documento de identificação ou passaporte válido.", en: "A valid ID document or passport." },
      { pt: "Não residentes: comprovativo da morada no estrangeiro, se não constar do documento.", en: "Non-residents: proof of the foreign address, if it is not on the ID." },
      { pt: "Cidadãos da UE residentes: Certificado de Registo de Cidadão da União Europeia.", en: "EU citizens living in Portugal: the EU citizen registration certificate (CRUE)." },
      { pt: "Outros estrangeiros residentes: título de residência, ou comprovativo do pedido na AIMA.", en: "Other foreign residents: residence permit, or proof of the AIMA application." },
    ],
    steps: [
      { title: { pt: "Marcar atendimento", en: "Book an appointment" }, body: { pt: "No Portal das Finanças, em Atendimento por Marcação, escolha o pedido de NIF para pessoas sem Cartão de Cidadão. Também pode ligar para o 217 206 707.", en: "On Portal das Finanças, under appointments, choose the NIF request for people without a Citizen Card. You can also call +351 217 206 707." } },
      { title: { pt: "Levar os documentos", en: "Bring the documents" }, body: { pt: "Documentos estrangeiros podem precisar de tradução certificada. Um mandatário precisa de procuração.", en: "Foreign documents may need a certified translation. An attorney needs a power of attorney." } },
      { title: { pt: "Receber o número", en: "Receive the number" }, body: { pt: "O NIF tem 9 dígitos e é o mesmo para toda a vida, mesmo quando passa de não residente a residente.", en: "The NIF has 9 digits and stays the same for life, even when you change from non-resident to resident." } },
      { title: { pt: "Verificar se precisa de representante", en: "Check if you need a representative" }, body: { pt: "Se não residir na UE ou no EEE e tiver casa, carro, contrato de trabalho ou atividade em Portugal, tem 15 dias para nomear um representante fiscal ou aderir às notificações eletrónicas ou à ViaCTT. Quem vive fora da UE e trabalha por conta própria em Portugal tem de nomear um representante para o IVA antes de começar.", en: "If you live outside the EU or EEA and have a home, car, job contract or business in Portugal, you have 15 days to name a tax representative or join electronic notifications or ViaCTT. People living outside the EU who are self-employed in Portugal must name a VAT representative before starting." } },
    ],
    notes: [
      { pt: "O guia do gov.pt diz que um não residente precisa de representante fiscal para pedir o NIF. O folheto da Autoridade Tributária de julho de 2025 diz que não é obrigatório. Seguimos a Autoridade Tributária.", en: "The gov.pt guide says a non-resident needs a tax representative to get a NIF. The tax authority leaflet of July 2025 says it is not required. We follow the tax authority." },
    ],
    links: [
      { label: { pt: "NIF no Portal das Finanças", en: "NIF on Portal das Finanças" }, url: "https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Dados_pessoais_familia/Dados_pessoais/NIF/Paginas/default.aspx" },
      { label: { pt: "Guia gov.pt para estrangeiros", en: "gov.pt guide for foreigners" }, url: "https://www.gov.pt/guias/como-pedir-o-nif-e-o-niss-para-pessoas-estrangeiras-em-portugal" },
    ],
    sources: [
      src("Autoridade Tributária, folheto NIF para cidadãos estrangeiros não residentes (julho 2025)", "https://info.portaldasfinancas.gov.pt/pt/apoio_contribuinte/Folhetos_informativos/Documents/Atribuicao_de_NIF_a_cidadaos_estrangeiros_nao_residentes.pdf"),
      src("gov.pt, Como pedir o NIF e o NISS para pessoas estrangeiras", "https://www.gov.pt/guias/como-pedir-o-nif-e-o-niss-para-pessoas-estrangeiras-em-portugal"),
    ],
    lastChecked: CHECKED,
  },
  {
    slug: "cartao-de-cidadao",
    enSlug: "citizen-card",
    title: { pt: "Pedir ou renovar o Cartão de Cidadão", en: "Getting or renewing the Citizen Card" },
    summary: {
      pt: "O Cartão de Cidadão é obrigatório para cidadãos portugueses. A partir dos 25 anos pode renová-lo online e recebê-lo em casa.",
      en: "The Citizen Card (Cartão de Cidadão) is mandatory for Portuguese citizens. From age 25 you can renew it online and get it delivered at home.",
    },
    audience: {
      pt: "Cidadãos portugueses, a partir dos 20 dias de idade. Cidadãos brasileiros com Estatuto de Igualdade também podem pedir.",
      en: "Portuguese citizens, from 20 days old. Brazilian citizens with the Equality Status can also apply.",
    },
    where: {
      pt: "Balcões do registo civil e Lojas do Cidadão, sem marcação. Espaços Cidadão a partir dos 25 anos. Consulados no estrangeiro. Online para renovações a partir dos 25 anos.",
      en: "Civil registry offices and Citizen Shops, no appointment needed. Espaços Cidadão from age 25. Consulates abroad. Online renewal from age 25.",
    },
    facts: [
      { label: { pt: "Validade abaixo dos 25 anos", en: "Validity under 25" }, value: { pt: "5 anos", en: "5 years" } },
      { label: { pt: "Validade a partir dos 25 anos", en: "Validity from 25" }, value: { pt: "10 anos", en: "10 years" } },
      { label: { pt: "Pedido normal presencial", en: "Normal request in person" }, value: { pt: "15 € (menos de 25 anos) · 18 €", en: "€15 (under 25) · €18" } },
      { label: { pt: "Renovação online ou automática", en: "Online or automatic renewal" }, value: { pt: "16,20 €", en: "€16.20" } },
      { label: { pt: "Urgente (3 dias úteis no continente)", en: "Urgent (3 working days, mainland)" }, value: { pt: "30 € · 33 €", en: "€30 · €33" } },
      { label: { pt: "Extremamente urgente", en: "Extremely urgent" }, value: { pt: "50 € · 53 €", en: "€50 · €53" } },
      { label: { pt: "Primeiro cartão até 1 ano de idade", en: "First card up to age 1" }, value: { pt: "Gratuito", en: "Free" } },
    ],
    steps: [
      { title: { pt: "Ver se está na altura", en: "Check if it is time" }, body: { pt: "Pode renovar quando o cartão expira nos próximos seis meses, já expirou, foi perdido ou roubado, ou quando mudam dados impressos, como a fotografia ou a assinatura.", en: "You can renew when the card expires within six months, has expired, was lost or stolen, or when printed data such as the photo or signature change." } },
      { title: { pt: "Escolher o canal", en: "Choose the channel" }, body: { pt: "Com 25 anos ou mais, a renovação automática com entrega em casa ou a renovação online evitam a ida ao balcão. Abaixo dos 25 anos, ou no primeiro cartão depois de 1 ano de idade, o pedido é presencial.", en: "From age 25, automatic renewal with home delivery or online renewal avoid a visit. Under 25, or for a first card after age 1, you apply in person." } },
      { title: { pt: "Escolher o prazo", en: "Choose the speed" }, body: { pt: "O pedido urgente demora 3 dias úteis no continente, 4 nos Açores e 5 na Madeira. O extremamente urgente é levantado no Campus de Justiça em Lisboa ou na Loja do Cidadão do Porto.", en: "An urgent request takes 3 working days on the mainland, 4 in the Azores and 5 in Madeira. Extremely urgent cards are collected at Campus de Justiça in Lisbon or the Porto Citizen Shop." } },
      { title: { pt: "Mudar a morada", en: "Change your address" }, body: { pt: "A alteração de morada online é gratuita. No balcão custa 3 €. A nova morada atualiza também o recenseamento eleitoral.", en: "Changing the address online is free. At the counter it costs €3. The new address also updates the electoral register." } },
    ],
    notes: [
      { pt: "Os cartões emitidos entre 13 de agosto de 2021 e 10 de junho de 2024 são válidos até 3 de agosto de 2031, por causa de um regulamento europeu.", en: "Cards issued between 13 August 2021 and 10 June 2024 are valid until 3 August 2031, because of an EU regulation." },
      { pt: "Quem prove insuficiência económica pode pedir isenção do pagamento.", en: "People who prove economic hardship can ask for a fee waiver." },
    ],
    links: [
      { label: { pt: "Cartão de Cidadão, justica.gov.pt", en: "Citizen Card, justica.gov.pt" }, url: "https://justica.gov.pt/Registos/Identificacao/Cartao-de-Cidadao" },
      { label: { pt: "Renovar online", en: "Renew online" }, url: "https://justica.gov.pt/Servicos/Renovar-online-o-Cartao-de-Cidadao" },
    ],
    sources: [src("Ministério da Justiça, Cartão de Cidadão (preços e validade)", "https://justica.gov.pt/Registos/Identificacao/Cartao-de-Cidadao")],
    lastChecked: CHECKED,
  },
  {
    slug: "autorizacao-de-residencia",
    enSlug: "residence-permit",
    title: { pt: "Autorização de residência e registo de cidadão da UE", en: "Residence permits and EU citizen registration" },
    summary: {
      pt: "Cidadãos de fora da UE precisam, em regra, de um visto de residência e de uma autorização de residência da AIMA. Cidadãos da UE registam-se na câmara municipal.",
      en: "People from outside the EU usually need a residence visa and then a residence permit from AIMA. EU citizens register at the town hall.",
    },
    audience: {
      pt: "Estrangeiros que querem viver em Portugal mais de 3 meses.",
      en: "Foreigners who want to live in Portugal for more than 3 months.",
    },
    where: {
      pt: "Visto: consulado português. Autorização de residência: Loja AIMA, com marcação. Renovações: Portal de Renovações da AIMA. Cidadãos da UE: câmara municipal da área de residência.",
      en: "Visa: Portuguese consulate. Residence permit: AIMA office, by appointment. Renewals: AIMA Renewals Portal. EU citizens: town hall (câmara municipal) where you live.",
    },
    facts: [
      {
        label: { pt: "Primeira autorização temporária (fora da CPLP)", en: "First temporary permit (non-CPLP)" },
        value: { pt: "185,60 €", en: "€185.60" },
        note: { pt: "Receção e análise 99,80 € + concessão 85,80 €, com a redução de 25% em vigor. Sem redução: 247,30 €.", en: "Intake €99.80 + issue €85.80, with the 25% reduction in force. Without it: €247.30." },
      },
      { label: { pt: "Validade da autorização temporária", en: "Temporary permit validity" }, value: { pt: "2 anos, renovável por 3", en: "2 years, renewable for 3" } },
      { label: { pt: "Emissão urgente do título", en: "Urgent card issue" }, value: { pt: "+47,80 €", en: "+€47.80" } },
      { label: { pt: "Registo de cidadão da UE (25 anos ou mais)", en: "EU citizen registration (25 or older)" }, value: { pt: "15 € online · 18 € presencial", en: "€15 online · €18 in person" } },
      { label: { pt: "Reagrupamento familiar", en: "Family reunification" }, value: { pt: "Em regra, 2 anos de residência", en: "As a rule, 2 years of residence" } },
    ],
    steps: [
      { title: { pt: "Escolher a via", en: "Choose the route" }, body: { pt: "As vias principais são o trabalho por conta de outrem ou por conta própria, rendimentos próprios ou reforma, trabalho remoto para fora de Portugal, trabalho altamente qualificado, a mobilidade CPLP e o reagrupamento familiar.", en: "The main routes are employment or self-employment, own income or pension, remote work for clients outside Portugal, highly qualified work, CPLP mobility and family reunification." } },
      { title: { pt: "Pedir o visto de residência", en: "Apply for the residence visa" }, body: { pt: "O visto é pedido no consulado português do país de residência e inclui uma marcação automática na AIMA. Para o trabalho remoto, o rendimento médio dos últimos 3 meses tem de ser pelo menos 4 vezes o salário mínimo.", en: "Apply at the Portuguese consulate where you live. The visa includes an automatic AIMA appointment. For remote work, average income in the last 3 months must be at least 4 times the minimum wage." } },
      { title: { pt: "Pedir a autorização na AIMA", en: "Apply for the permit at AIMA" }, body: { pt: "Leve passaporte, visto, comprovativo de morada, NIF e número de Segurança Social, e os documentos da sua via, por exemplo o contrato de trabalho.", en: "Bring your passport, visa, proof of address, NIF and Social Security number, and the documents for your route, for example the work contract." } },
      { title: { pt: "Renovar a tempo", en: "Renew on time" }, body: { pt: "As renovações são feitas no Portal de Renovações da AIMA.", en: "Renewals are done on the AIMA Renewals Portal." } },
      { title: { pt: "Cidadãos da UE: registar na câmara", en: "EU citizens: register at the town hall" }, body: { pt: "Até 3 meses basta o documento de identificação. Depois disso, tem 30 dias para pedir o Certificado de Registo na câmara municipal. Ao fim de 5 anos pode pedir o certificado de residência permanente na AIMA.", en: "For up to 3 months your ID is enough. After that, you have 30 days to request the registration certificate at the town hall. After 5 years you can ask AIMA for a permanent residence certificate." } },
    ],
    notes: [
      { pt: "A manifestação de interesse acabou a 4 de junho de 2024. Os pedidos de transição tinham de ser feitos até 31 de dezembro de 2025. Em 2026 não é possível fazer novos pedidos por esta via.", en: "The 'manifestação de interesse' route ended on 4 June 2024. Transition requests had to be made by 31 December 2025. New requests through this route are not possible in 2026." },
      { pt: "O visto para procura de trabalho passou a ser só para trabalho qualificado (Lei n.º 61/2025). Em setembro de 2026 os consulados ainda não o emitem, porque falta a regulamentação.", en: "The job-seeker visa is now only for qualified work (Law 61/2025). In September 2026 consulates do not issue it yet, because the implementing rules are missing." },
      { pt: "Cidadãos de Angola, Brasil, Cabo Verde, Guiné-Bissau, Moçambique e São Tomé e Príncipe não pagam a taxa de concessão ou renovação, mas pagam a receção e análise.", en: "Citizens of Angola, Brazil, Cape Verde, Guinea-Bissau, Mozambique and São Tomé and Príncipe do not pay the issue or renewal fee, but pay the intake fee." },
      { pt: "Os valores de rendimento mínimo para a via de rendimentos próprios em 2026 não foram confirmados numa fonte oficial. Confirme no consulado.", en: "The 2026 minimum income for the own-income route was not confirmed in an official source. Check with the consulate." },
    ],
    links: [
      { label: { pt: "AIMA", en: "AIMA" }, url: "https://aima.gov.pt/" },
      { label: { pt: "Vistos, Ministério dos Negócios Estrangeiros", en: "Visas, Ministry of Foreign Affairs" }, url: "https://vistos.mne.gov.pt/pt/vistos-nacionais/documentacao-instrutoria/residencia" },
      { label: { pt: "Registo de cidadão da UE, AIMA", en: "EU citizen registration, AIMA" }, url: "https://aima.gov.pt/pt/nacionais-ue-e-familiares/nacionais-ue/certificado-de-registo-para-nacionais-ue" },
    ],
    sources: [
      src("AIMA, tabela de taxas em vigor a partir de 1 de março de 2026", "https://aima.gov.pt/pt/noticias/atualizacao-da-tabela-de-taxas"),
      src("Lei n.º 61/2025 (alterações à lei de estrangeiros)", "https://files.diariodarepublica.pt/1s/2025/10/20400/0000900017.pdf"),
      src("Decreto-Lei n.º 37-A/2024 (fim da manifestação de interesse)", "https://files.diariodarepublica.pt/1s/2024/06/10601/0000200003.pdf"),
      src("Portaria n.º 13/2024 (taxas do certificado de registo de cidadão da UE)", "https://files.diariodarepublica.pt/1s/2024/01/01500/0001300017.pdf"),
      src("MNE, visto para procura de trabalho qualificado", "https://vistos.mne.gov.pt/pt/vistos-nacionais/documentacao-instrutoria/procura-de-trabalho"),
    ],
    lastChecked: CHECKED,
  },
  {
    slug: "seguranca-social-e-sns",
    enSlug: "social-security-and-health-numbers",
    title: { pt: "Número de Segurança Social e número de utente do SNS", en: "Social Security number and National Health Service number" },
    summary: {
      pt: "Quem trabalha precisa de um número de Segurança Social (NISS). Para usar o SNS sem pagar o custo dos cuidados, o registo de utente tem de estar completo.",
      en: "Anyone who works needs a Social Security number (NISS). To use the National Health Service without paying for care, your user registration must be complete.",
    },
    audience: {
      pt: "Estrangeiros e portugueses sem Cartão de Cidadão. Com Cartão de Cidadão, os dois números são atribuídos automaticamente.",
      en: "Foreigners and Portuguese people without a Citizen Card. With a Citizen Card, both numbers are assigned automatically.",
    },
    where: {
      pt: "NISS: pedido online no formulário da Segurança Social, ou pelo empregador. Número de utente: na primeira ida a um centro de saúde ou hospital público.",
      en: "NISS: online form on the Social Security website, or through the employer. Health user number: at your first visit to a public health centre or hospital.",
    },
    facts: [
      { label: { pt: "NISS", en: "NISS" }, value: { pt: "Gratuito", en: "Free" } },
      { label: { pt: "Registo de utente incompleto", en: "Incomplete health registration" }, value: { pt: "Paga o custo dos cuidados", en: "You pay the cost of care" }, note: { pt: "Passa a incompleto 180 dias depois, se faltarem dados. Regra aplicada desde janeiro de 2026.", en: "It becomes incomplete after 180 days if data are missing. Rule applied since January 2026." } },
      { label: { pt: "Sem autorização de residência", en: "Without a residence permit" }, value: { pt: "Cuidados urgentes e vitais com mais de 90 dias de residência", en: "Urgent and vital care after 90 days of residence" } },
    ],
    documents: [
      { pt: "NISS: identificação (passaporte e visto ou autorização de residência, para quem é de fora da UE).", en: "NISS: identification (passport and visa or residence permit, for non-EU citizens)." },
      { pt: "NISS: prova da situação de trabalho, por exemplo o contrato de trabalho.", en: "NISS: proof of work, for example the employment contract." },
      { pt: "Utente do SNS: identificação, NIF, autorização de residência e morada completa em Portugal.", en: "Health user: ID, NIF, residence permit and full Portuguese address." },
    ],
    steps: [
      { title: { pt: "Pedir o NISS online", en: "Request the NISS online" }, body: { pt: "Preencha o formulário para cidadãos estrangeiros no site da Segurança Social. Recebe uma carta registada a dizer onde levantar o número. Também pode pedir NIF, NISS e número de utente de uma só vez, se já tiver morada em Portugal.", en: "Fill in the form for foreign citizens on the Social Security website. You receive a registered letter saying where to collect the number. With a Portuguese address you can request NIF, NISS and health number together." } },
      { title: { pt: "Obter o número de utente", en: "Get the health user number" }, body: { pt: "É atribuído na primeira ida a um centro de saúde ou hospital público. Ter o número não garante que o SNS pague os cuidados.", en: "It is assigned on your first visit to a public health centre or hospital. Having the number does not mean the health service pays for care." } },
      { title: { pt: "Completar o registo", en: "Complete the registration" }, body: { pt: "Com o registo atualizado pode inscrever-se no centro de saúde da sua área e ter equipa de saúde familiar. Menores estrangeiros não precisam de NIF nem de autorização de residência para isso.", en: "With an updated registration you can enrol at your local health centre and get a family health team. Foreign minors do not need a NIF or residence permit for this." } },
    ],
    links: [
      { label: { pt: "Pedir o NISS, gov.pt", en: "Request the NISS, gov.pt" }, url: "https://www.gov.pt/servicos/pedir-o-numero-de-identificacao-da-seguranca-social-niss-" },
      { label: { pt: "Migrantes: cuidados de saúde, gov.pt", en: "Migrants: health care, gov.pt" }, url: "https://www.gov.pt/guias/migrantes-cuidados-de-saude-em-portugal" },
      { label: { pt: "Registo Nacional de Utentes, ACSS", en: "National User Registry, ACSS" }, url: "https://www.acss.min-saude.pt/2025/07/16/registo-nacional-de-utentes/" },
    ],
    sources: [
      src("gov.pt, Pedir o NISS", "https://www.gov.pt/servicos/pedir-o-numero-de-identificacao-da-seguranca-social-niss-"),
      src("ACSS, Registo Nacional de Utentes (Despachos 14830/2024, 40/2025 e 3118/2026)", "https://www.acss.min-saude.pt/2025/07/16/registo-nacional-de-utentes/"),
    ],
    lastChecked: CHECKED,
  },
  {
    slug: "criar-empresa",
    enSlug: "start-a-business",
    title: { pt: "Criar uma empresa ou abrir atividade", en: "Starting a company or working as self-employed" },
    summary: {
      pt: "Para trabalhar por conta própria basta abrir atividade nas Finanças. Para criar uma sociedade, a Empresa na Hora ou a Empresa Online fazem tudo num só pedido.",
      en: "To work as self-employed you only need to register your activity with the tax office. To create a company, Empresa na Hora or Empresa Online do everything in one request.",
    },
    audience: { pt: "Trabalhadores independentes, freelancers e quem quer criar uma sociedade.", en: "Self-employed workers, freelancers and anyone creating a company." },
    where: {
      pt: "Atividade: Portal das Finanças, Serviço de Finanças ou Loja do Cidadão. Sociedade: balcão Empresa na Hora (com marcação) ou Empresa Online.",
      en: "Self-employment: Portal das Finanças, a tax office or a Citizen Shop. Company: Empresa na Hora counter (by appointment) or Empresa Online.",
    },
    facts: [
      { label: { pt: "Empresa na Hora", en: "Empresa na Hora" }, value: { pt: "360 €", en: "€360" } },
      { label: { pt: "Empresa Online, pacto modelo", en: "Empresa Online, standard articles" }, value: { pt: "220 € (urgente 440 €)", en: "€220 (urgent €440)" } },
      { label: { pt: "Empresa Online, pacto próprio", en: "Empresa Online, own articles" }, value: { pt: "360 € (urgente 720 €)", en: "€360 (urgent €720)" } },
      { label: { pt: "Depósito do capital", en: "Capital deposit" }, value: { pt: "Até 5 dias úteis depois", en: "Within 5 working days" } },
      { label: { pt: "Declaração do beneficiário efetivo (RCBE)", en: "Beneficial owner declaration (RCBE)" }, value: { pt: "Até 30 dias depois", en: "Within 30 days" } },
      { label: { pt: "Segurança Social, independentes", en: "Social Security, self-employed" }, value: { pt: "21,4% sobre 70% dos serviços", en: "21.4% on 70% of service income" } },
    ],
    steps: [
      { title: { pt: "Abrir atividade antes de começar", en: "Register before you start" }, body: { pt: "A declaração de início de atividade é entregue no Portal das Finanças antes de começar, ou no próprio dia. A Segurança Social é avisada automaticamente.", en: "Submit the start-of-activity declaration on Portal das Finanças before you start, or on the same day at the latest. Social Security is notified automatically." } },
      { title: { pt: "Perceber o regime simplificado", en: "Understand the simplified regime" }, body: { pt: "Se os rendimentos da categoria B do ano anterior não passarem 200 000 €, aplica-se o regime simplificado. O IRS incide sobre uma parte do rendimento: 75% nas profissões da tabela do artigo 151.º, 35% noutros serviços e 15% nas vendas.", en: "If your self-employment income last year was not above €200,000, the simplified regime applies. Income tax applies to part of your income: 75% for professions in the article 151 table, 35% for other services and 15% for sales." } },
      { title: { pt: "Contar com a Segurança Social", en: "Plan for Social Security" }, body: { pt: "No primeiro início de atividade, o enquadramento produz efeitos no 1.º dia do 12.º mês depois do início. A partir daí, entrega a declaração trimestral em janeiro, abril, julho e outubro e paga entre os dias 10 e 20 de cada mês. A contribuição mínima é 20 € por mês.", en: "For a first activity, Social Security enrolment takes effect on the 1st day of the 12th month after you start. From then on, you file a quarterly declaration in January, April, July and October and pay between the 10th and the 20th of each month. The minimum contribution is €20 per month." } },
      { title: { pt: "Ou criar uma sociedade", en: "Or create a company" }, body: { pt: "Na Empresa na Hora todos os sócios têm de estar presentes, com identificação e NIF. Na Empresa Online, todos precisam de Cartão de Cidadão com assinatura digital ou Chave Móvel Digital. Recebe logo o pacto social, a certidão permanente e o número de Segurança Social da empresa.", en: "At Empresa na Hora all partners must attend with ID and NIF. For Empresa Online, all partners need a Citizen Card with digital signature or the Chave Móvel Digital. You immediately receive the articles, the permanent certificate and the company's Social Security number." } },
    ],
    notes: [
      { pt: "A página da Empresa na Hora indica 200 € para um pedido com marca associada, sem dizer se soma aos 360 €. Confirme antes.", en: "The Empresa na Hora page shows €200 for a request with a trademark, without saying if it is added to the €360. Check first." },
    ],
    links: [
      { label: { pt: "Abrir atividade, gov.pt", en: "Register self-employment, gov.pt" }, url: "https://www.gov.pt/servicos/abrir-atividade-nas-financas" },
      { label: { pt: "Empresa Online", en: "Empresa Online" }, url: "https://registo.justica.gov.pt/empresa" },
      { label: { pt: "Guia prático dos trabalhadores independentes", en: "Self-employed workers guide (PT)" }, url: "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf" },
    ],
    sources: [
      src("IRN, custos dos serviços (Regulamento Emolumentar, art. 22.º)", "https://irn.justica.gov.pt/Custos-dos-servicos"),
      src("Código do IRS, art. 28.º e 31.º (regime simplificado)", "https://info.portaldasfinancas.gov.pt/pt/informacao_fiscal/codigos_tributarios/cirs_rep/Pages/irs31.aspx"),
      src("Instituto da Segurança Social, Guia Prático 1009 (janeiro 2026)", "https://www.seg-social.pt/storage1/files/1009---Novo-Regime-dos-Trabalhadores-Independentes-v1-09-8TvHiLaPC6okosI9oUn9_A.pdf"),
    ],
    lastChecked: CHECKED,
  },
  {
    slug: "carro",
    enSlug: "car",
    title: { pt: "Carro: IUC, registo e importação", en: "Car: circulation tax, registration and import" },
    summary: {
      pt: "O dono do carro paga o IUC todos os anos. Quem compra um carro usado tem 60 dias para o registar. As regras de pagamento do IUC mudam em 2027.",
      en: "The car owner pays the circulation tax (IUC) every year. A buyer of a used car has 60 days to register it. IUC payment rules change in 2027.",
    },
    audience: { pt: "Donos e compradores de carros, e quem traz um carro de outro país.", en: "Car owners and buyers, and anyone bringing a car from another country." },
    where: { pt: "IUC e importação: Portal das Finanças. Registo: Automóvel Online, conservatória ou Loja do Cidadão.", en: "IUC and import: Portal das Finanças. Registration: Automóvel Online, registry office or Citizen Shop." },
    facts: [
      { label: { pt: "IUC em 2026", en: "IUC in 2026" }, value: { pt: "Até ao fim do mês da matrícula", en: "By the end of the registration month" } },
      { label: { pt: "IUC em 2027", en: "IUC in 2027" }, value: { pt: "Outubro, ou julho e outubro se passar 500 €", en: "October, or July and October above €500" } },
      { label: { pt: "IUC a partir de 2028", en: "IUC from 2028" }, value: { pt: "Abril; em 2 ou 3 prestações acima de 100 € e 500 €", en: "April; in 2 or 3 instalments above €100 and €500" } },
      { label: { pt: "Registo de mudança de dono", en: "Change of owner registration" }, value: { pt: "65 € (55,25 € online)", en: "€65 (€55.25 online)" } },
      { label: { pt: "Prazo para registar", en: "Registration deadline" }, value: { pt: "60 dias", en: "60 days" }, note: { pt: "Depois do prazo, a taxa duplica.", en: "After the deadline, the fee doubles." } },
      { label: { pt: "Declaração aduaneira de carro importado", en: "Customs declaration for an imported car" }, value: { pt: "20 dias úteis após a entrada", en: "20 working days after entry" } },
    ],
    steps: [
      { title: { pt: "Registar a compra", en: "Register the purchase" }, body: { pt: "O comprador regista a propriedade em 60 dias. Online o registo custa menos 15%. Se o comprador não registar, o vendedor pode pedir o registo.", en: "The buyer registers ownership within 60 days. Online registration costs 15% less. If the buyer does not register, the seller can request it." } },
      { title: { pt: "Pagar o IUC", en: "Pay the IUC" }, body: { pt: "Paga quem tem o carro registado em seu nome. Em 2026 o prazo é o fim do mês da matrícula. O Decreto-Lei n.º 161/2026 muda as datas a partir de 2027.", en: "The person in whose name the car is registered pays. In 2026 the deadline is the end of the registration anniversary month. Decree-Law 161/2026 changes the dates from 2027." } },
      { title: { pt: "Importar um carro usado", en: "Import a used car" }, body: { pt: "Faça a homologação e a inspeção no IMT, entregue a Declaração Aduaneira de Veículo no Portal das Finanças em 20 dias úteis e pague o ISV em 10 dias úteis. Carros usados de outros países da UE têm redução de ISV pela idade; carros de fora da UE não têm.", en: "Get approval and inspection at IMT, submit the vehicle customs declaration on Portal das Finanças within 20 working days and pay the vehicle tax (ISV) within 10 working days. Used cars from other EU countries get an age-based ISV reduction; cars from outside the EU do not." } },
    ],
    notes: [
      { pt: "As páginas oficiais sobre a redução de ISV para carros usados não são consistentes. Não mostramos percentagens até confirmar o texto consolidado da lei.", en: "Official pages on the ISV reduction for used cars are not consistent. We do not show percentages until the consolidated law text is confirmed." },
    ],
    links: [
      { label: { pt: "IUC, Portal das Finanças", en: "IUC, Portal das Finanças" }, url: "https://info.portaldasfinancas.gov.pt/pt/apoio_ao_contribuinte/Cidadaos/Veiculos/IUC/Paginas/default.aspx" },
      { label: { pt: "Registar automóvel", en: "Register a car" }, url: "https://justica.gov.pt/Servicos/Registar-automovel" },
      { label: { pt: "Imposto de carro comprado no estrangeiro", en: "Tax on a car bought abroad" }, url: "https://www.gov.pt/servicos/tratar-do-imposto-de-um-veiculo-comprado-no-estrangeiro" },
    ],
    sources: [
      src("Decreto-Lei n.º 161/2026 (novas datas do IUC)", "https://files.diariodarepublica.pt/1s/2026/08/14900/0001000015.pdf"),
      src("IRN, custos dos serviços (Regulamento Emolumentar, art. 25.º e 28.º)", "https://irn.justica.gov.pt/Custos-dos-servicos"),
      src("gov.pt, tratar do imposto de um veículo comprado no estrangeiro", "https://www.gov.pt/servicos/tratar-do-imposto-de-um-veiculo-comprado-no-estrangeiro"),
    ],
    lastChecked: CHECKED,
  },
];

export const getGuide = (slug: string) => GUIDES.find((g) => g.slug === slug) ?? null;
export const getGuideEn = (slug: string) => GUIDES.find((g) => g.enSlug === slug) ?? null;
