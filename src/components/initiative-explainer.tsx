import { Check, X } from "@phosphor-icons/react/dist/ssr";
import { stageStates, type StageState } from "@/lib/parlamento/explain";
import type { InitiativeStatus, Vote } from "@/lib/parlamento/types";
import { estimateSeats, VOTE_POSITIONS, type VotePosition } from "@/lib/parlamento/votes";

export function StageTrack({ stages, reached, status }: { stages: readonly string[]; reached: number; status: InitiativeStatus }) {
  const states = stageStates(stages, reached, status);
  return (
    <ol className="grid gap-2 sm:grid-flow-col sm:auto-cols-fr" aria-label="Fases do processo">
      {stages.map((label, idx) => (
        <li key={label} className="grid gap-2" aria-current={states[idx] === "current" ? "step" : undefined}>
          <span className={`h-1.5 rounded-sm ${BAR[states[idx]]}`} />
          <span className="flex items-start gap-1.5 text-sm leading-snug">
            <StageIcon state={states[idx]} />
            <span className={states[idx] === "todo" ? "text-muted" : "font-medium"}>{label}</span>
          </span>
        </li>
      ))}
    </ol>
  );
}

const BAR: Record<StageState, string> = {
  done: "bg-accent",
  current: "bg-accent/45",
  ended: "bg-danger",
  todo: "bg-line",
};

function StageIcon({ state }: { state: StageState }) {
  if (state === "done") return <Check weight="bold" className="mt-0.5 shrink-0 text-accent" aria-label="Concluída" />;
  if (state === "ended") return <X weight="bold" className="mt-0.5 shrink-0 text-danger" aria-label="O processo terminou aqui" />;
  if (state === "current") return <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="Fase atual" />;
  return <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full border border-line" aria-hidden />;
}

const POSITION_LABEL: Record<VotePosition, string> = { favor: "A favor", contra: "Contra", abstencao: "Abstenção" };
const POSITION_BAR: Record<VotePosition, string> = { favor: "bg-accent", contra: "bg-danger", abstencao: "bg-muted/50" };

export function VoteSummary({ v, seats }: { v: Vote; seats: Record<string, number> }) {
  const estimate = v.parties ? estimateSeats(v.parties, seats) : null;
  const tone = v.result === "Aprovado" ? "text-accent" : v.result === "Rejeitado" ? "text-danger" : "";

  return (
    <div className="mt-3 rounded-sm border border-line bg-surface p-4">
      <p className={`font-semibold ${tone}`}>
        {v.result ?? "Resultado não indicado"}
        {v.unanimous && <span className="font-normal text-foreground"> por unanimidade</span>}
      </p>
      {v.description && <p className="mt-1 text-sm leading-relaxed text-muted">{v.description}</p>}

      {estimate && estimate.total > 0 && (
        <>
          <div className="mt-4 flex h-3 overflow-hidden rounded-sm bg-sunken" role="img" aria-label={VOTE_POSITIONS.map((p) => `${POSITION_LABEL[p]}: cerca de ${estimate[p]}`).join(", ")}>
            {VOTE_POSITIONS.map((p) => (
              <span key={p} className={POSITION_BAR[p]} style={{ width: `${(estimate[p] / estimate.total) * 100}%` }} />
            ))}
          </div>
          <dl className="mt-4 grid gap-4 sm:grid-cols-3">
            {VOTE_POSITIONS.map((p) => {
              const partial = v.parties!.partial.filter((x) => x.position === p);
              const named = v.parties!.deputies.filter((x) => x.position === p);
              const empty = v.parties![p].length === 0 && partial.length === 0 && named.length === 0;
              return (
                <div key={p}>
                  <dt className="flex items-baseline justify-between gap-2 text-sm">
                    <span className="flex items-center gap-1.5">
                      <span className={`h-2.5 w-2.5 rounded-sm ${POSITION_BAR[p]}`} aria-hidden />
                      {POSITION_LABEL[p]}
                    </span>
                    {!empty && <span className="font-semibold tabular">≈ {estimate[p]}</span>}
                  </dt>
                  <dd className="mt-1.5">
                    {empty ? (
                      <span className="text-sm text-muted">Ninguém</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {v.parties![p].map((party) => (
                          <span key={party} className="rounded-sm bg-sunken px-2 py-0.5 text-sm font-medium">
                            {party}
                          </span>
                        ))}
                        {partial.map((x) => (
                          <span key={x.party} className="rounded-sm border border-line px-2 py-0.5 text-sm">
                            {x.count} {x.count === 1 ? "deputado" : "deputados"} do {x.party}
                          </span>
                        ))}
                      </div>
                    )}
                    {named.length > 0 && (
                      <p className="mt-1.5 text-xs leading-relaxed text-muted">{named.map((d) => `${d.name} (${d.party})`).join(", ")}</p>
                    )}
                  </dd>
                </div>
              );
            })}
          </dl>
          {estimate.unknown > 0 && (
            <p className="mt-3 text-sm text-muted tabular">Sem posição no registo: ≈ {estimate.unknown} deputados, de partidos que não constam desta votação.</p>
          )}
          <p className="mt-4 text-xs leading-relaxed text-muted">
            Número de deputados estimado com os lugares atuais de cada partido. Não desconta ausências.
            {v.parties!.partial.length > 0 && " Quando um partido vota dividido, o registo indica quantos deputados votaram de outra forma."}
          </p>
        </>
      )}
      {v.absences && <p className="mt-2 text-xs text-muted">Ausências registadas: {v.absences}</p>}
    </div>
  );
}
