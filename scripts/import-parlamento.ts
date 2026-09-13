// Imports Assembleia da República open data into data/snapshots/parlamento.
// Run: npm run import:parlamento   (OFFLINE=1 reuses the last raw download)
import fs from "node:fs";
import path from "node:path";
import { loadArFile } from "./lib/parlamento-source";
import { log, SNAPSHOT_DIR, writeSnapshot } from "./lib/snapshot";
import { stageReached } from "../src/lib/parlamento/explain";
import { citedActs, decreesOf, deriveStatus } from "../src/lib/parlamento/status";
import { parseVoteDetail } from "../src/lib/parlamento/votes";
import type {
  ApprovedAct,
  Author,
  Deputy,
  InitiativeDetail,
  InitiativeEvent,
  InitiativeStatus,
  InitiativeSummary,
  ParlamentoMeta,
  RelatedInitiative,
} from "../src/lib/parlamento/types";

type RawVote = {
  id: string;
  data: string;
  resultado: string | null;
  unanime: string | null;
  descricao: string | null;
  detalhe: string | null;
  ausencias: string[] | string | null;
};
type RawEvent = {
  EvtId: string;
  Fase: string;
  DataFase: string;
  ObsFase: string | null;
  Votacao: RawVote[] | null;
  PublicacaoFase: { pubTipo: string; URLDiario: string | null }[] | null;
  IniciativasConjuntas: { id: string; descTipo: string; nr: string; autor: string | null; titulo: string }[] | null;
};
type RawLinked = { id: string; descTipo: string | null; numero: string; assunto: string };
type RawInitiative = {
  IniId: string;
  IniNr: string;
  IniTipo: string;
  IniDescTipo: string;
  IniLeg: string;
  IniSel: string | null;
  IniTitulo: string;
  IniLinkTexto: string | null;
  IniAutorGruposParlamentares: { GP: string }[] | null;
  IniAutorDeputados: { GP: string; nome: string }[] | null;
  IniAutorOutros: { nome: string; sigla: string } | null;
  IniEventos: RawEvent[] | null;
  Peticoes: RawLinked[] | null;
  IniciativasOrigem: RawLinked[] | null;
  IniciativasOriginadas: RawLinked[] | null;
};
type RawBase = {
  DetalheLegislatura: { sigla: string; dtini: string };
  GruposParlamentares: { nome: string; sigla: string }[];
  Deputados: {
    DepId: number;
    DepNomeParlamentar: string;
    DepNomeCompleto: string;
    DepCPDes: string;
    DepGP: { gpSigla: string; gpDtInicio: string }[] | null;
    DepSituacao: { sioDes: string; sioDtInicio: string; sioDtFim: string | null }[] | null;
  }[];
};
type RawDiploma = {
  Id: string;
  Tipo: string;
  Numero: string;
  AnoCivil: string;
  Titulo: string;
  Publicacao: { pubTipo: string; pubdt: string; URLDiario: string | null }[] | null;
  Iniciativas: { IniId: string }[] | null;
};

const LEG = process.env.LEGISLATURA ?? "XVII";
const clean = (s: unknown) => (Array.isArray(s) ? s.join(", ") : typeof s === "string" ? s : "").replace(/\s+/g, " ").trim();
const dateOnly = (s: string | null | undefined) => (s ? s.slice(0, 10) : null);

function authorsOf(ini: RawInitiative): Author[] {
  const authors: Author[] = [];
  for (const g of ini.IniAutorGruposParlamentares ?? []) authors.push({ kind: "grupo", name: clean(g.GP), party: clean(g.GP) });
  if (authors.length === 0) {
    for (const d of ini.IniAutorDeputados ?? []) authors.push({ kind: "deputado", name: clean(d.nome), party: clean(d.GP) });
  }
  if (ini.IniAutorOutros?.nome) authors.push({ kind: "outro", name: clean(ini.IniAutorOutros.nome) });
  return authors;
}

function eventsOf(ini: RawInitiative): InitiativeEvent[] {
  return (ini.IniEventos ?? [])
    .map((e) => ({
      phase: clean(e.Fase),
      date: dateOnly(e.DataFase) ?? "",
      note: clean(e.ObsFase) || null,
      votes: (e.Votacao ?? []).map((v) => ({
        id: v.id,
        date: dateOnly(v.data) ?? "",
        result: v.resultado,
        unanimous: v.unanime === "unanime",
        description: clean(v.descricao) || null,
        parties: parseVoteDetail(v.detalhe),
        absences: clean(v.ausencias) || null,
      })),
      publication: e.PublicacaoFase?.[0] ? { type: clean(e.PublicacaoFase[0].pubTipo), url: e.PublicacaoFase[0].URLDiario } : null,
      order: Number(e.EvtId) || 0,
    }))
    .sort((a, b) => a.date.localeCompare(b.date) || a.order - b.order)
    .map((e) => {
      const { order, ...rest } = e;
      void order;
      return rest;
    });
}

function jointOf(ini: RawInitiative): RelatedInitiative[] {
  const seen = new Map<string, RelatedInitiative>();
  for (const e of ini.IniEventos ?? []) {
    for (const j of e.IniciativasConjuntas ?? []) {
      if (j.id === ini.IniId || seen.has(j.id)) continue;
      seen.set(j.id, { id: j.id, type: clean(j.descTipo), number: clean(j.nr), author: clean(j.autor) || null, title: clean(j.titulo) });
    }
  }
  return [...seen.values()];
}

const linked = (items: RawLinked[] | null): RelatedInitiative[] =>
  (items ?? []).map((l) => ({ id: l.id, type: clean(l.descTipo), number: clean(l.numero), author: null, title: clean(l.assunto) }));

async function main() {
  const [initiatives, base, diplomas] = await Promise.all([
    loadArFile<RawInitiative[]>("DAIniciativas", LEG, `Iniciativas${LEG}_json.txt`),
    loadArFile<RawBase>("DAInformacaoBase", LEG, `InformacaoBase${LEG}_json.txt`),
    loadArFile<RawDiploma[]>("DADiplomasAprovados", LEG, `Diplomas${LEG}_json.txt`),
  ]);
  if (!Array.isArray(initiatives) || initiatives.length === 0) throw new Error("Initiatives file is empty");

  const actsByInitiative = new Map<string, InitiativeDetail["publishedAs"]>();
  for (const d of diplomas) {
    const dr = (d.Publicacao ?? []).find((p) => p.pubTipo?.startsWith("DR")) ?? null;
    if (!dr) continue;
    for (const ref of d.Iniciativas ?? []) {
      const list = actsByInitiative.get(ref.IniId) ?? [];
      list.push({ type: clean(d.Tipo), number: clean(d.Numero), year: clean(d.AnoCivil), publishedOn: dateOnly(dr.pubdt), drUrl: dr.URLDiario ?? null });
      actsByInitiative.set(ref.IniId, list);
    }
  }

  log("Normalising initiatives");
  const detailDir = path.join(SNAPSHOT_DIR, "parlamento", "iniciativas");
  fs.mkdirSync(detailDir, { recursive: true });

  const summaries: InitiativeSummary[] = [];
  const counts = { "em-curso": 0, aprovada: 0, publicada: 0, rejeitada: 0, vetada: 0, retirada: 0, "nao-admitida": 0 } satisfies Record<InitiativeStatus, number>;
  let latestEvent = "";
  const partyStats: ParlamentoMeta["partyStats"] = {};
  const stat = (party: string) => (partyStats[party] ??= { authored: 0, finalVotes: { favor: 0, contra: 0, abstencao: 0 } });
  let finalVotesCounted = 0;

  for (const ini of initiatives) {
    const events = eventsOf(ini);
    const status = deriveStatus(events, ini.IniTipo, ini.IniDescTipo);
    const authors = authorsOf(ini);
    const last = events.at(-1);
    if (last && last.date > latestEvent) latestEvent = last.date;

    const summary: InitiativeSummary = {
      id: ini.IniId,
      number: ini.IniNr,
      type: clean(ini.IniDescTipo),
      typeCode: ini.IniTipo,
      title: clean(ini.IniTitulo),
      authors,
      authorParties: [...new Set(authors.map((a) => a.party).filter((p): p is string => Boolean(p)))],
      enteredOn: events.find((e) => e.phase === "Entrada")?.date ?? events[0]?.date ?? null,
      lastPhase: last?.phase ?? "",
      lastDate: last?.date ?? "",
      status: status.status,
      statusPhase: status.phase,
      statusDate: status.date,
      decrees: decreesOf(events),
      stage: stageReached(events, ini.IniTipo),
    };
    counts[summary.status]++;
    for (const p of summary.authorParties) stat(p).authored++;
    for (const e of events) {
      if (e.phase !== "Votação final global") continue;
      for (const v of e.votes) {
        if (!v.parties) continue;
        finalVotesCounted++;
        for (const position of ["favor", "contra", "abstencao"] as const) for (const p of v.parties[position]) stat(p).finalVotes[position]++;
      }
    }
    summaries.push(summary);

    const detail: InitiativeDetail = {
      ...summary,
      legislature: ini.IniLeg,
      session: ini.IniSel,
      textUrl: ini.IniLinkTexto,
      officialUrl: `https://www.parlamento.pt/ActividadeParlamentar/Paginas/DetalheIniciativa.aspx?BID=${ini.IniId}`,
      events,
      jointInitiatives: jointOf(ini),
      origin: linked(ini.IniciativasOrigem),
      originated: linked(ini.IniciativasOriginadas),
      petitions: (ini.Peticoes ?? []).map((p) => ({ id: p.id, number: clean(p.numero), subject: clean(p.assunto) })),
      citedActs: citedActs(ini.IniTitulo),
      publishedAs: actsByInitiative.get(ini.IniId) ?? [],
    };
    const tmp = path.join(detailDir, `${ini.IniId}.json.tmp`);
    fs.writeFileSync(tmp, JSON.stringify(detail));
    fs.renameSync(tmp, path.join(detailDir, `${ini.IniId}.json`));
  }
  summaries.sort((a, b) => b.lastDate.localeCompare(a.lastDate));
  log(`  ${summaries.length} initiatives, detail files in ${path.relative(process.cwd(), detailDir)}`);

  log("Sitting deputies");
  const deputies: Deputy[] = [];
  for (const d of base.Deputados) {
    const current = (d.DepSituacao ?? []).find((s) => s.sioDtFim === null && s.sioDes.startsWith("Efetivo"));
    if (!current) continue;
    const group = [...(d.DepGP ?? [])].sort((a, b) => b.gpDtInicio.localeCompare(a.gpDtInicio))[0];
    deputies.push({
      id: d.DepId,
      name: clean(d.DepNomeParlamentar),
      fullName: clean(d.DepNomeCompleto),
      party: clean(group?.gpSigla),
      circle: clean(d.DepCPDes),
      situation: clean(current.sioDes),
    });
  }
  deputies.sort((a, b) => a.name.localeCompare(b.name, "pt"));
  const seats = new Map<string, number>();
  for (const d of deputies) seats.set(d.party, (seats.get(d.party) ?? 0) + 1);
  if (deputies.length < 200 || deputies.length > 240) {
    throw new Error(`Unexpected number of sitting deputies: ${deputies.length}. Check the filter before publishing.`);
  }
  log(`  ${deputies.length} deputies`);

  log("Approved acts");
  const acts: ApprovedAct[] = diplomas
    .map((d) => {
      const dr = (d.Publicacao ?? []).find((p) => p.pubTipo?.startsWith("DR")) ?? null;
      return {
        id: d.Id,
        type: clean(d.Tipo),
        number: clean(d.Numero),
        year: clean(d.AnoCivil),
        title: clean(d.Titulo),
        publishedOn: dateOnly(dr?.pubdt),
        drUrl: dr?.URLDiario ?? null,
        initiativeIds: (d.Iniciativas ?? []).map((i) => i.IniId),
      };
    })
    .sort((a, b) => (b.publishedOn ?? "").localeCompare(a.publishedOn ?? ""));

  const partyNames = new Map(base.GruposParlamentares.map((g) => [clean(g.sigla), clean(g.nome)]));
  const meta: ParlamentoMeta = {
    importedAt: new Date().toISOString(),
    legislature: base.DetalheLegislatura.sigla,
    legislatureStart: dateOnly(base.DetalheLegislatura.dtini) ?? "",
    sourceUpdatedUpTo: latestEvent || null,
    parties: [...seats]
      .map(([acronym, n]) => ({ acronym, name: partyNames.get(acronym) ?? acronym, seats: n }))
      .sort((a, b) => b.seats - a.seats || a.acronym.localeCompare(b.acronym)),
    counts,
    // Vote lists also name individual deputies who voted apart from their group; keep groups only.
    partyStats: Object.fromEntries(Object.entries(partyStats).filter(([k]) => partyNames.has(k))),
    finalVotesCounted,
    totalInitiatives: summaries.length,
    sources: [
      { title: "Assembleia da República, Dados Abertos: Iniciativas", url: "https://www.parlamento.pt/Cidadania/Paginas/DAIniciativas.aspx" },
      { title: "Assembleia da República, Dados Abertos: Informação base", url: "https://www.parlamento.pt/Cidadania/Paginas/DAInformacaoBase.aspx" },
      { title: "Assembleia da República, Dados Abertos: Diplomas aprovados", url: "https://www.parlamento.pt/Cidadania/Paginas/DADiplomasAprovados.aspx" },
    ],
  };

  writeSnapshot("parlamento/iniciativas.json", summaries);
  writeSnapshot("parlamento/deputados.json", deputies);
  writeSnapshot("parlamento/diplomas.json", acts);
  writeSnapshot("parlamento/meta.json", meta);
  log(`Done. Status counts: ${JSON.stringify(counts)}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
