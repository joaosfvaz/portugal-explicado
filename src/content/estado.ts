import type { SourceRef } from "@/components/ui";
import type { Institution } from "./types";

const CHECKED = "2026-09-12";
const CRP: SourceRef = {
  title: "Constituição da República Portuguesa (VII Revisão Constitucional, 2005), Assembleia da República",
  url: "https://www.parlamento.pt/Legislacao/Paginas/ConstituicaoRepublicaPortuguesa.aspx",
  verifiedOn: CHECKED,
  verification: "primary",
};

export const INSTITUTIONS: Institution[] = [
  {
    slug: "presidente",
    enSlug: "president",
    title: { pt: "Presidente da República", en: "President of the Republic" },
    summary: {
      pt: "O chefe de Estado. É eleito diretamente, não governa, mas promulga ou veta as leis, nomeia o Primeiro-Ministro e pode dissolver a Assembleia da República.",
      en: "The head of state. The President is elected directly and does not govern, but signs or vetoes laws, appoints the Prime Minister and can dissolve Parliament.",
    },
    sections: [
      {
        heading: { pt: "Quem é e como é eleito", en: "Who holds the office and how the President is elected" },
        body: [
          {
            pt: "O Presidente da República é António José Seguro. Foi eleito na segunda volta, a 8 de fevereiro de 2026, e tomou posse a 9 de março de 2026 como XXI Presidente da República.",
            en: "The President is António José Seguro. He won the second round on 8 February 2026 and took office on 9 March 2026 as the 21st President of the Republic.",
          },
          {
            pt: "Qualquer cidadão português de origem com mais de 35 anos pode candidatar-se. Ganha quem tiver mais de metade dos votos válidos; os votos em branco não contam como válidos. Se ninguém chegar a esse valor, há uma segunda volta até 21 dias depois, só com os dois candidatos mais votados.",
            en: "Any Portuguese citizen by origin over 35 can run. A candidate wins with more than half of the valid votes; blank votes do not count as valid. If nobody reaches that, a second round takes place up to 21 days later between the two most voted candidates.",
          },
        ],
        facts: [
          { label: { pt: "Mandato", en: "Term" }, value: { pt: "5 anos", en: "5 years" } },
          { label: { pt: "Limite", en: "Limit" }, value: { pt: "Não pode haver terceiro mandato seguido", en: "No third term in a row" } },
          { label: { pt: "Segunda volta de 2026", en: "2026 second round" }, value: { pt: "66,84% dos votos válidos", en: "66.84% of valid votes" } },
        ],
      },
      {
        heading: { pt: "Promulgar ou vetar leis", en: "Signing or vetoing laws" },
        body: [
          {
            pt: "Uma lei aprovada pela Assembleia só entra em vigor depois de o Presidente a promulgar e de ser publicada. O Presidente tem 20 dias para promulgar ou vetar um decreto da Assembleia. Para os decretos do Governo tem 40 dias.",
            en: "A law approved by Parliament only takes effect after the President signs it and it is published. The President has 20 days to sign or veto a decree of Parliament, and 40 days for a Government decree.",
          },
          {
            pt: "Se o Presidente vetar um decreto da Assembleia, a Assembleia pode confirmá-lo por maioria absoluta dos deputados em funções (116 de 230). Para leis orgânicas e algumas matérias são precisos dois terços dos deputados presentes. Nesse caso, o Presidente tem de promulgar em 8 dias. O veto a um decreto do Governo não pode ser ultrapassado.",
            en: "If the President vetoes a decree of Parliament, Parliament can confirm it by an absolute majority of deputies in office (116 of 230). Organic laws and some other matters need two thirds of the deputies present. The President must then sign within 8 days. A veto of a Government decree cannot be overridden.",
          },
          {
            pt: "Antes de decidir, o Presidente pode pedir ao Tribunal Constitucional que verifique se o texto respeita a Constituição. O pedido é feito em 8 dias e o Tribunal decide em 25 dias. Se o Tribunal encontrar uma inconstitucionalidade, o veto é obrigatório.",
            en: "Before deciding, the President can ask the Constitutional Court to check whether the text respects the Constitution. The request must be made within 8 days and the Court decides within 25 days. If the Court finds the text unconstitutional, the President must veto it.",
          },
        ],
        facts: [
          { label: { pt: "Decretos da Assembleia", en: "Decrees of Parliament" }, value: { pt: "20 dias para decidir", en: "20 days to decide" } },
          { label: { pt: "Decretos do Governo", en: "Government decrees" }, value: { pt: "40 dias para decidir", en: "40 days to decide" } },
          { label: { pt: "Confirmar um veto", en: "Overriding a veto" }, value: { pt: "116 deputados (maioria absoluta)", en: "116 deputies (absolute majority)" } },
        ],
      },
      {
        heading: { pt: "Dissolver a Assembleia e nomear o Governo", en: "Dissolving Parliament and appointing the Government" },
        body: [
          {
            pt: "O Presidente nomeia o Primeiro-Ministro depois de ouvir os partidos com deputados e tendo em conta os resultados das eleições. Os ministros são nomeados por proposta do Primeiro-Ministro.",
            en: "The President appoints the Prime Minister after hearing the parties in Parliament and taking the election results into account. Ministers are appointed on the Prime Minister's proposal.",
          },
          {
            pt: "O Presidente pode dissolver a Assembleia da República, depois de ouvir os partidos e o Conselho de Estado. Não o pode fazer nos 6 meses depois da eleição da Assembleia, no último semestre do seu mandato, nem durante o estado de sítio ou de emergência.",
            en: "The President can dissolve Parliament after hearing the parties and the Council of State. This is not allowed in the 6 months after a parliamentary election, in the last six months of the President's term, or during a state of siege or emergency.",
          },
        ],
      },
    ],
    sources: [
      CRP,
      { title: "Presidência da República, tomada de posse de António José Seguro", url: "https://www.presidencia.pt/atualidade/toda-a-atualidade/2026/03/tomada-de-posse-de-antonio-jose-seguro-como-xxi-presidente-da-republica/", verifiedOn: CHECKED, verification: "primary" },
      { title: "CNE, Mapa Oficial da eleição presidencial de 2026 (2.º sufrágio)", url: "https://www.cne.pt/sites/default/files/dl/eleicoes/2026_pr/docs_geral/2026_pr_2-sufragio_mapa_oficial_dr.pdf", verifiedOn: CHECKED, verification: "primary" },
    ],
    lastChecked: CHECKED,
  },
  {
    slug: "assembleia",
    enSlug: "parliament",
    title: { pt: "Assembleia da República", en: "Assembly of the Republic (Parliament)" },
    summary: {
      pt: "O parlamento. Faz as leis, aprova o Orçamento do Estado, fiscaliza o Governo e pode derrubá-lo.",
      en: "The national parliament. It makes laws, approves the State Budget, scrutinises the Government and can bring it down.",
    },
    sections: [
      {
        heading: { pt: "Composição e eleições", en: "Composition and elections" },
        body: [
          {
            pt: "A Assembleia tem 230 deputados. São eleitos em 22 círculos: os 18 distritos do continente, os Açores, a Madeira, a Europa e o resto do mundo. Os lugares são distribuídos pelo método de Hondt, que é proporcional aos votos em cada círculo.",
            en: "Parliament has 230 deputies. They are elected in 22 constituencies: the 18 mainland districts, the Azores, Madeira, Europe and the rest of the world. Seats are allocated with the D'Hondt method, which is proportional to the votes in each constituency.",
          },
          {
            pt: "Cada legislatura tem 4 sessões legislativas. Cada sessão dura um ano e começa a 15 de setembro. A legislatura atual é a XVII e o Presidente da Assembleia é José Pedro Aguiar-Branco.",
            en: "Each legislature has 4 legislative sessions. Each session lasts one year and starts on 15 September. The current legislature is the 17th and the Speaker is José Pedro Aguiar-Branco.",
          },
        ],
        facts: [
          { label: { pt: "Deputados", en: "Deputies" }, value: { pt: "230", en: "230" } },
          { label: { pt: "Legislatura", en: "Legislature" }, value: { pt: "4 anos", en: "4 years" } },
          { label: { pt: "Círculos eleitorais", en: "Constituencies" }, value: { pt: "22", en: "22" } },
        ],
      },
      {
        heading: { pt: "Que maioria é precisa", en: "Which majority is needed" },
        body: [
          {
            pt: "A maioria das votações decide-se por maioria simples: ganha a opção com mais votos, e as abstenções não contam. Algumas decisões precisam de maiorias maiores, contadas sobre os 230 deputados em funções ou sobre os deputados presentes.",
            en: "Most votes are decided by simple majority: the option with more votes wins, and abstentions do not count. Some decisions need larger majorities, counted over the 230 deputies in office or over the deputies present.",
          },
          {
            pt: "Uma lei orgânica, como a lei eleitoral ou a lei da nacionalidade, precisa de maioria absoluta dos deputados em funções na votação final global. Uma revisão da Constituição precisa de dois terços dos deputados em funções.",
            en: "An organic law, such as the electoral law or the nationality law, needs an absolute majority of deputies in office in the final vote. A constitutional revision needs two thirds of deputies in office.",
          },
        ],
        facts: [
          { label: { pt: "Maioria absoluta", en: "Absolute majority" }, value: { pt: "116 deputados", en: "116 deputies" } },
          { label: { pt: "Dois terços de 230", en: "Two thirds of 230" }, value: { pt: "154 deputados", en: "154 deputies" } },
          { label: { pt: "Revisão extraordinária da Constituição", en: "Extraordinary constitutional revision" }, value: { pt: "Quatro quintos: 184 deputados", en: "Four fifths: 184 deputies" } },
        ],
      },
      {
        heading: { pt: "Como nasce uma lei", en: "How a law is made" },
        body: [
          {
            pt: "Uma iniciativa entra na Assembleia, é debatida e votada na generalidade, analisada artigo a artigo numa comissão e votada de novo na votação final global. Depois vai para o Presidente da República e, se for promulgada, é publicada no Diário da República.",
            en: "An initiative enters Parliament, is debated and voted in general, examined article by article in a committee and voted again in the final global vote. It then goes to the President and, if signed, is published in the official journal (Diário da República).",
          },
          {
            pt: "Pode acompanhar cada iniciativa, com o estado e os votos por partido, na secção Parlamento.",
            en: "The Parlamento section (in Portuguese) shows each initiative, its status and the votes of each party.",
          },
        ],
      },
    ],
    sources: [
      CRP,
      { title: "Lei Eleitoral da Assembleia da República (Lei 14/79), versão consolidada da CNE", url: "https://www.cne.pt/sites/default/files/dl/legis_lear_consolidada_2026-07.pdf", verifiedOn: CHECKED, verification: "primary" },
      { title: "Assembleia da República, eleição do Presidente da XVII Legislatura", url: "https://www.parlamento.pt/Paginas/2025/junho/Presidente-XVIILegislatura.aspx", verifiedOn: CHECKED, verification: "primary" },
    ],
    lastChecked: CHECKED,
  },
  {
    slug: "governo",
    enSlug: "government",
    title: { pt: "Governo", en: "Government" },
    summary: {
      pt: "Conduz a política do país e dirige a administração pública. Responde perante o Presidente da República e a Assembleia da República.",
      en: "It runs the country's policy and directs public administration. It answers to the President and to Parliament.",
    },
    sections: [
      {
        heading: { pt: "Como se forma", en: "How it is formed" },
        body: [
          {
            pt: "Depois das eleições, o Presidente da República ouve os partidos e nomeia o Primeiro-Ministro. O Governo entrega o seu programa à Assembleia em 10 dias. O programa só cai se uma moção de rejeição tiver a maioria absoluta dos deputados em funções.",
            en: "After an election, the President hears the parties and appoints the Prime Minister. The Government presents its programme to Parliament within 10 days. The programme is only rejected if a rejection motion gets an absolute majority of deputies in office.",
          },
          {
            pt: "O Primeiro-Ministro é Luís Montenegro, do XXV Governo Constitucional, em funções desde 5 de junho de 2025.",
            en: "The Prime Minister is Luís Montenegro, head of the 25th Constitutional Government, in office since 5 June 2025.",
          },
        ],
        facts: [
          { label: { pt: "Entrega do programa", en: "Programme presented" }, value: { pt: "Até 10 dias depois da nomeação", en: "Within 10 days of appointment" } },
          { label: { pt: "Rejeitar o programa", en: "Rejecting the programme" }, value: { pt: "116 deputados", en: "116 deputies" } },
        ],
      },
      {
        heading: { pt: "Como pode cair", en: "How it can fall" },
        body: [
          {
            pt: "Uma moção de censura pode ser apresentada por um quarto dos deputados ou por qualquer grupo parlamentar. Só é debatida 48 horas depois. Se for aprovada pela maioria absoluta dos deputados em funções, o Governo é demitido. Se for rejeitada, quem a assinou não pode apresentar outra na mesma sessão legislativa.",
            en: "A motion of censure can be filed by a quarter of deputies or by any parliamentary group. It is debated only 48 hours later. If an absolute majority of deputies in office approves it, the Government is dismissed. If it is rejected, its signatories cannot file another one in the same legislative session.",
          },
          {
            pt: "O Governo também é demitido quando começa uma nova legislatura, quando o Presidente aceita a demissão do Primeiro-Ministro, quando o programa é rejeitado ou quando perde uma moção de confiança que ele próprio pediu. O Presidente só pode demitir o Governo para assegurar o funcionamento regular das instituições, depois de ouvir o Conselho de Estado.",
            en: "The Government is also dismissed when a new legislature begins, when the President accepts the Prime Minister's resignation, when its programme is rejected, or when it loses a confidence vote it requested. The President can only dismiss the Government to ensure that democratic institutions work normally, after hearing the Council of State.",
          },
        ],
        facts: [
          { label: { pt: "Apresentar moção de censura", en: "Filing a censure motion" }, value: { pt: "58 deputados ou um grupo parlamentar", en: "58 deputies or one parliamentary group" } },
          { label: { pt: "Aprovar moção de censura", en: "Passing a censure motion" }, value: { pt: "116 deputados", en: "116 deputies" } },
        ],
      },
    ],
    sources: [CRP, { title: "Portal do Governo, Primeiro-Ministro do XXV Governo", url: "https://www.portugal.gov.pt/pt/gc25/primeiro-ministro", verifiedOn: CHECKED, verification: "primary" }],
    lastChecked: CHECKED,
  },
  {
    slug: "tribunais",
    enSlug: "courts",
    title: { pt: "Tribunais e Ministério Público", en: "Courts and the Public Prosecutor" },
    summary: {
      pt: "Os tribunais são independentes e aplicam a lei. O Tribunal Constitucional verifica se as leis respeitam a Constituição.",
      en: "Courts are independent and apply the law. The Constitutional Court checks whether laws respect the Constitution.",
    },
    sections: [
      {
        heading: { pt: "Tribunal Constitucional", en: "Constitutional Court" },
        body: [
          {
            pt: "Tem 13 juízes. A Assembleia da República elege 10, por dois terços dos deputados presentes, e esses 10 escolhem os outros 3. Seis juízes têm de vir de outros tribunais. O mandato é de 9 anos e não pode ser renovado.",
            en: "It has 13 judges. Parliament elects 10 by two thirds of the deputies present, and those 10 choose the other 3. Six judges must come from other courts. The term is 9 years and cannot be renewed.",
          },
        ],
        facts: [
          { label: { pt: "Juízes", en: "Judges" }, value: { pt: "13", en: "13" } },
          { label: { pt: "Mandato", en: "Term" }, value: { pt: "9 anos, sem renovação", en: "9 years, not renewable" } },
        ],
      },
      {
        heading: { pt: "As outras ordens de tribunais", en: "The other court systems" },
        body: [
          {
            pt: "Os tribunais judiciais julgam a maioria dos processos civis e criminais. Começam nos tribunais de comarca, seguem para os tribunais da Relação e terminam no Supremo Tribunal de Justiça.",
            en: "Judicial courts handle most civil and criminal cases. Cases start in district courts (comarca), can go to the courts of appeal (Relação) and end at the Supreme Court of Justice.",
          },
          {
            pt: "Os tribunais administrativos e fiscais julgam litígios com a administração pública e com o Fisco. No topo está o Supremo Tribunal Administrativo. O Tribunal de Contas fiscaliza a despesa pública e dá parecer sobre a Conta Geral do Estado.",
            en: "Administrative and tax courts handle disputes with public administration and with the tax authority. At the top is the Supreme Administrative Court. The Court of Auditors checks public spending and gives an opinion on the State accounts.",
          },
        ],
      },
      {
        heading: { pt: "Ministério Público", en: "Public Prosecutor" },
        body: [
          {
            pt: "O Ministério Público representa o Estado, conduz a ação penal e defende a legalidade democrática. É dirigido pela Procuradoria-Geral da República. O Procurador-Geral é nomeado pelo Presidente da República, por proposta do Governo, para um mandato de 6 anos.",
            en: "The Public Prosecutor represents the State, leads criminal prosecution and defends democratic legality. It is headed by the Office of the Attorney General. The Attorney General is appointed by the President, on the Government's proposal, for 6 years.",
          },
        ],
        facts: [{ label: { pt: "Mandato do Procurador-Geral", en: "Attorney General's term" }, value: { pt: "6 anos", en: "6 years" } }],
      },
    ],
    sources: [CRP],
    lastChecked: CHECKED,
  },
  {
    slug: "regioes-e-autarquias",
    enSlug: "regions-and-local-government",
    title: { pt: "Regiões autónomas e autarquias", en: "Autonomous regions and local government" },
    summary: {
      pt: "Os Açores e a Madeira têm governo e parlamento próprios. Em todo o país, municípios e freguesias tratam de muitos serviços do dia a dia.",
      en: "The Azores and Madeira have their own government and parliament. Across the country, municipalities and parishes run many everyday services.",
    },
    sections: [
      {
        heading: { pt: "Açores e Madeira", en: "Azores and Madeira" },
        body: [
          {
            pt: "Cada região tem uma Assembleia Legislativa, eleita por sufrágio direto, e um Governo Regional que responde perante ela. As regiões podem fazer leis regionais nas matérias do seu estatuto e têm poder tributário próprio.",
            en: "Each region has a Legislative Assembly, directly elected, and a Regional Government that answers to it. Regions can make regional laws in the areas of their statute and have their own tax powers.",
          },
          {
            pt: "Em cada região há um Representante da República, nomeado pelo Presidente da República. É ele que nomeia o presidente do Governo Regional, tendo em conta os resultados eleitorais.",
            en: "Each region has a Representative of the Republic, appointed by the President. The Representative appoints the President of the Regional Government, taking the election results into account.",
          },
        ],
      },
      {
        heading: { pt: "Municípios e freguesias", en: "Municipalities and parishes" },
        body: [
          {
            pt: "Portugal tem 308 municípios: 278 no continente, 19 nos Açores e 11 na Madeira. Cada município tem uma câmara municipal, que governa, e uma assembleia municipal, que delibera e fiscaliza.",
            en: "Portugal has 308 municipalities: 278 on the mainland, 19 in the Azores and 11 in Madeira. Each municipality has a municipal council (câmara municipal), which governs, and a municipal assembly, which decides and scrutinises.",
          },
          {
            pt: "As freguesias são a autarquia mais próxima das pessoas. A Lei n.º 25-A/2025 repôs freguesias que tinham sido agregadas em 2013, a partir das eleições autárquicas de 12 de outubro de 2025. Os resultados oficiais dessas eleições incluem 3259 freguesias, contando o Corvo, onde não há eleição de freguesia.",
            en: "Parishes (freguesias) are the level of local government closest to people. Law 25-A/2025 restored parishes that had been merged in 2013, from the local elections of 12 October 2025. The official results of those elections include 3,259 parishes, counting Corvo, where no parish election takes place.",
          },
          {
            pt: "Os mandatos autárquicos duram 4 anos. Os presidentes de câmara e de junta de freguesia só podem fazer 3 mandatos seguidos.",
            en: "Local mandates last 4 years. Mayors and parish council presidents can serve at most 3 terms in a row.",
          },
        ],
        facts: [
          { label: { pt: "Municípios", en: "Municipalities" }, value: { pt: "308", en: "308" } },
          { label: { pt: "Freguesias (eleições de 2025)", en: "Parishes (2025 elections)" }, value: { pt: "3259, incluindo o Corvo", en: "3,259, including Corvo" } },
          { label: { pt: "Mandato", en: "Term" }, value: { pt: "4 anos, até 3 seguidos para presidentes", en: "4 years, up to 3 in a row for presidents" } },
        ],
      },
    ],
    sources: [
      CRP,
      { title: "CNE, Mapa Oficial das eleições autárquicas de 2025", url: "https://www.cne.pt/sites/default/files/dl/eleicoes/2025_al/docs_geral/2025_al_mapa_oficial_dr.pdf", verifiedOn: CHECKED, verification: "primary" },
      { title: "Lei n.º 25-A/2025, reposição de freguesias", url: "https://files.diariodarepublica.pt/1s/2025/03/05102/0000200014.pdf", verifiedOn: CHECKED, verification: "primary" },
      { title: "Lei n.º 46/2005, limitação de mandatos", url: "https://www.cne.pt/sites/default/files/dl/legis_lei_46_2005_renovacao_mandatos.pdf", verifiedOn: CHECKED, verification: "primary" },
    ],
    lastChecked: CHECKED,
  },
];

export const getInstitution = (slug: string) => INSTITUTIONS.find((i) => i.slug === slug) ?? null;
export const getInstitutionEn = (slug: string) => INSTITUTIONS.find((i) => i.enSlug === slug) ?? null;
