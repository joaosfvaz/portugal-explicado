import type { ElectionResult, ElectionRound } from "@/lib/eleicoes/types";
import { num } from "@/lib/format";

const pctFmt = new Intl.NumberFormat("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const pct1 = (v: number) => `${pctFmt.format(v)}%`;

/**
 * Results as horizontal bars. Every list uses the same colour: the brand never uses party colours.
 * The elected candidate or the most voted list is marked with a solid bar; the others are lighter.
 * Bars are drawn on a 0–100% scale, so their length matches the number next to them.
 */
export function ResultBars({ results, limit, showSeats = false }: { results: ElectionResult[]; limit?: number; showSeats?: boolean }) {
  const sorted = [...results].sort((a, b) => (b.pct ?? 0) - (a.pct ?? 0));
  const shown = limit ? sorted.slice(0, limit) : sorted;
  return (
    <ul className="grid gap-3 sm:gap-2.5">
      {shown.map((r, i) => {
        const lead = r.elected ?? i === 0;
        return (
          <li key={r.name} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 text-sm sm:grid-cols-[minmax(0,9rem)_minmax(0,1fr)_auto]">
            <span className="truncate font-medium" title={r.name}>
              {r.short}
            </span>
            <span className="col-span-2 row-start-2 h-3 bg-sunken sm:col-span-1 sm:col-start-2 sm:row-start-1">
              <span className={`block h-full min-w-[2px] ${lead ? "bg-accent" : "bg-accent/40"}`} style={{ width: `${Math.min(r.pct ?? 0, 100)}%` }} />
            </span>
            <span className="text-right whitespace-nowrap tabular">
              {r.pct !== null ? pct1(r.pct) : "sem dados"}
              {showSeats && r.seats !== null && <span className="ml-2 text-muted">{r.seats} lug.</span>}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Full results table. "votes": candidates or answers; "seats": lists with seats and the change from the
 * previous election; "councils": câmaras won, with the previous count.
 */
export function ResultTable({ round, mode, previousLabel, winnerLabel = "Eleito" }: { round: ElectionRound; mode: "votes" | "seats" | "councils"; previousLabel?: string; winnerLabel?: string }) {
  const councils = mode === "councils";
  const sorted = [...round.results].sort((a, b) => (councils ? (b.seats ?? 0) - (a.seats ?? 0) : (b.votes ?? 0) - (a.votes ?? 0)));
  const hasPrevious = mode !== "votes" && sorted.some((r) => r.previousSeats !== null);
  const note = sorted.find((r) => r.previousNote)?.previousNote;
  return (
    <>
    {/* Phones: one card per list. */}
    <ul className="grid gap-px overflow-hidden rounded-sm border border-line bg-line text-sm sm:hidden">
      {sorted.map((r) => {
        const diff = r.seats !== null && r.previousSeats !== null ? r.seats - r.previousSeats : null;
        return (
          <li key={r.name} className="bg-surface p-4">
            <div className="flex items-baseline justify-between gap-3">
              <span className="font-semibold">{r.short}</span>
              {mode !== "votes" ? <span className="font-display text-2xl figures">{r.seats ?? "-"}</span> : <span className="font-semibold tabular">{r.pct !== null ? pct1(r.pct) : "-"}</span>}
            </div>
            {r.short !== r.name && <p className="text-xs text-muted">{r.name}</p>}
            {r.elected && <p className="text-xs font-medium text-accent">{winnerLabel}</p>}
            <p className="mt-1 text-muted tabular">
              {!councils && r.votes !== null && <>{num(r.votes)} votos</>}
              {!councils && mode === "seats" && r.pct !== null && <> · {pct1(r.pct)}</>}
              {mode !== "votes" && r.previousSeats !== null && (
                <>
                  {!councils && " · "}
                  {previousLabel ?? "Antes"}: {r.previousSeats}
                  {r.previousNote ? "*" : ""}
                  {diff !== null && diff !== 0 && ` (${diff > 0 ? `+${diff}` : diff})`}
                </>
              )}
            </p>
          </li>
        );
      })}
      {note && <li className="bg-surface p-4 text-xs text-muted">* {note}</li>}
    </ul>
    <div className="hidden overflow-x-auto rounded-sm border border-line bg-surface sm:block">
      <table className={`w-full text-sm tabular ${councils ? "min-w-[360px]" : "min-w-[560px]"}`}>
        <thead>
          <tr className="border-b border-line text-left text-xs text-muted">
            <th className="px-4 py-2 font-medium">{mode === "votes" ? "Candidato ou resposta" : "Lista"}</th>
            {!councils && <th className="px-3 py-2 text-right font-medium">Votos</th>}
            {!councils && <th className="px-3 py-2 text-right font-medium">% dos votos válidos</th>}
            {mode !== "votes" && <th className="px-3 py-2 text-right font-medium">{councils ? "Câmaras" : "Lugares"}</th>}
            {hasPrevious && <th className="px-4 py-2 text-right font-medium">{previousLabel ?? "Antes"}</th>}
          </tr>
        </thead>
        <tbody>
          {sorted.map((r) => {
            const diff = r.seats !== null && r.previousSeats !== null ? r.seats - r.previousSeats : null;
            return (
              <tr key={r.name} className="border-b border-line last:border-0">
                <td className="px-4 py-2.5">
                  <span className="font-medium">{r.short}</span>
                  {r.short !== r.name && <span className="block text-xs text-muted">{r.name}</span>}
                  {r.elected && <span className="mt-0.5 block text-xs font-medium text-accent">{winnerLabel}</span>}
                </td>
                {!councils && <td className="px-3 py-2.5 text-right">{r.votes !== null ? num(r.votes) : "-"}</td>}
                {!councils && <td className="px-3 py-2.5 text-right">{r.pct !== null ? pct1(r.pct) : "-"}</td>}
                {mode !== "votes" && <td className="px-3 py-2.5 text-right font-semibold">{r.seats ?? "-"}</td>}
                {hasPrevious && (
                  <td className="px-4 py-2.5 text-right text-muted">
                    {r.previousNote && (
                      <sup className="mr-0.5 text-accent" title={r.previousNote}>
                        *
                      </sup>
                    )}
                    {r.previousSeats ?? "-"}
                    {diff !== null && diff !== 0 && <span className="ml-1.5 text-foreground">({diff > 0 ? `+${diff}` : diff})</span>}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
      {note && <p className="border-t border-line px-4 py-2.5 text-xs leading-relaxed text-muted">* {note}</p>}
    </div>
    </>
  );
}

/** Turnout and blank/null votes, with a sentence that gives them meaning. */
export function TurnoutFacts({ round }: { round: ElectionRound }) {
  const abstention = round.turnoutPct !== null ? 100 - round.turnoutPct : null;
  const items = [
    { label: "Votaram", value: round.turnoutPct !== null ? pct1(round.turnoutPct) : "sem dados", note: round.voters !== null ? `${num(round.voters)} pessoas` : undefined },
    { label: "Não votaram", value: abstention !== null ? pct1(abstention) : "sem dados", note: round.registered !== null ? `de ${num(round.registered)} inscritos` : undefined },
    { label: "Votos em branco", value: round.blank !== null ? num(round.blank) : "sem dados" },
    { label: "Votos nulos", value: round.null !== null ? num(round.null) : "sem dados" },
  ];
  return (
    <dl className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-4">
      {items.map((it) => (
        <div key={it.label} className="bg-surface p-4">
          <dt className="text-[11px] font-medium tracking-[0.12em] text-muted uppercase">{it.label}</dt>
          <dd className="figures mt-2 font-display text-3xl leading-none font-medium">{it.value}</dd>
          {it.note && <dd className="mt-1.5 text-sm text-muted">{it.note}</dd>}
        </div>
      ))}
    </dl>
  );
}
