"use client";

import { CalendarPlus } from "@phosphor-icons/react";
import { useState } from "react";
import { AUDIENCE_LABEL, DEADLINES, PERSONAL_RULES, type Audience, type Deadline } from "@/content/prazos";
import { formatDate } from "@/lib/format";
import { toIcs } from "@/lib/ics";

const AUDIENCES = Object.keys(AUDIENCE_LABEL).filter((a) => a !== "todos") as Audience[];

function download(items: Deadline[], name: string) {
  const stamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const ics = toIcs(
    items.map((d) => ({ uid: d.id, title: d.title, description: [d.action, d.ifMissed ? `Se falhar: ${d.ifMissed}` : "", d.ref].filter(Boolean).join("\n"), start: d.start ?? d.end, end: d.end, url: d.url })),
    stamp,
  );
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

const MONTH = new Intl.DateTimeFormat("pt-PT", { month: "long", year: "numeric", timeZone: "UTC" });

export function DeadlineCalendar({ today }: { today: string }) {
  const [chosen, setChosen] = useState<Audience[]>([]);
  const visible = DEADLINES.filter((d) => d.end >= today).filter((d) => d.audience.includes("todos") || chosen.some((a) => d.audience.includes(a)));
  const toggle = (a: Audience) => setChosen((c) => (c.includes(a) ? c.filter((x) => x !== a) : [...c, a]));

  const byMonth = new Map<string, Deadline[]>();
  for (const d of [...visible].sort((a, b) => a.end.localeCompare(b.end))) {
    const key = d.end.slice(0, 7);
    byMonth.set(key, [...(byMonth.get(key) ?? []), d]);
  }

  return (
    <div className="grid gap-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <fieldset>
          <legend className="text-sm font-medium">Mostrar também as datas para quem…</legend>
          <div className="mt-2 flex flex-wrap gap-2">
            {AUDIENCES.map((a) => (
              <button
                key={a}
                type="button"
                aria-pressed={chosen.includes(a)}
                onClick={() => toggle(a)}
                className="pressable rounded-sm border border-line bg-surface px-3 py-2 text-sm hover:border-accent aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent-strong"
              >
                {AUDIENCE_LABEL[a]}
              </button>
            ))}
          </div>
        </fieldset>
        <button type="button" onClick={() => download(visible.filter((d) => !d.info), "prazos-portugal-explicado.ics")} className="pressable inline-flex items-center gap-2 rounded-sm bg-accent px-4 py-2.5 font-medium text-on-accent">
          <CalendarPlus className="h-5 w-5" aria-hidden /> Pôr todas no meu calendário
        </button>
      </div>

      <ol className="grid gap-8">
        {[...byMonth.entries()].map(([month, items]) => (
          <li key={month}>
            <h2 className="font-display text-2xl font-medium first-letter:uppercase">{MONTH.format(new Date(`${month}-15T12:00:00Z`))}</h2>
            <ul className="mt-3 grid gap-px overflow-hidden border border-line bg-line">
              {items.map((d) => (
                <li key={d.id} className="grid gap-3 bg-surface p-4 sm:grid-cols-[8.5rem_minmax(0,1fr)_auto] sm:items-start">
                  <p className="font-semibold tabular">
                    {d.start ? (
                      <>
                        <span className="block text-xs font-normal text-muted">de {formatDate(d.start)}</span>
                        até {formatDate(d.end)}
                      </>
                    ) : (
                      <>até {formatDate(d.end)}</>
                    )}
                  </p>
                  <div>
                    <p className="font-semibold">
                      {d.title}
                      {d.info && <span className="ml-2 rounded-sm bg-sunken px-1.5 py-0.5 text-xs font-medium text-muted">Para saber</span>}
                    </p>
                    <p className="mt-1 leading-relaxed text-muted">{d.action}</p>
                    {d.ifMissed && (
                      <p className="mt-1 text-sm">
                        <span className="font-medium">Se falhar:</span> {d.ifMissed}
                      </p>
                    )}
                    {d.note && <p className="mt-1 text-sm text-muted">{d.note}</p>}
                    <p className="mt-1 text-xs text-muted">
                      <a href={d.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-foreground">
                        {d.ref}
                      </a>
                    </p>
                  </div>
                  {!d.info && (
                    <button type="button" onClick={() => download([d], `${d.id}.ics`)} className="pressable inline-flex items-center gap-1.5 justify-self-start rounded-sm border border-line px-3 py-1.5 text-sm font-medium hover:border-accent">
                      <CalendarPlus className="h-4 w-4" aria-hidden /> Calendário
                    </button>
                  )}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>

      <section>
        <h2 className="font-display text-3xl leading-tight font-medium">Datas que dependem de si</h2>
        <p className="mt-1 text-muted">Estas datas mudam de pessoa para pessoa: a matrícula do carro, a validade do cartão, o nascimento de um filho.</p>
        <ul className="mt-4 grid gap-px overflow-hidden border border-line bg-line md:grid-cols-2">
          {PERSONAL_RULES.filter((r) => r.audience === "todos" || chosen.includes(r.audience)).map((r) => (
            <li key={r.title} className="bg-surface p-4">
              <p className="font-semibold">{r.title}</p>
              <p className="mt-1 leading-relaxed text-muted">{r.rule}</p>
              <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-1 inline-block text-xs text-muted underline underline-offset-2 hover:text-foreground">
                {r.ref}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
