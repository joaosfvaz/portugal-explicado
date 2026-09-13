"use client";

import Link from "next/link";
import { ArrowRight, Check } from "@phosphor-icons/react";
import { useSyncExternalStore } from "react";
import { QUESTIONS, suggestionsFor } from "@/content/para-mim";

const KEY = "pe-para-mim";
const EVENT = "pe-para-mim";
const EMPTY = "[]";

// Fallback when the browser blocks storage: answers last for this visit only.
let memory = EMPTY;

function read(): string {
  try {
    return localStorage.getItem(KEY) ?? EMPTY;
  } catch {
    return memory;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function write(ids: string[]) {
  memory = JSON.stringify(ids);
  try {
    localStorage.setItem(KEY, memory);
  } catch {
    // Keep the in-memory copy.
  }
  window.dispatchEvent(new Event(EVENT));
}

function parse(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    return Array.isArray(v) ? v.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function ParaMim() {
  const chosen = parse(useSyncExternalStore(subscribe, read, () => EMPTY));
  const toggle = (id: string) => write(chosen.includes(id) ? chosen.filter((x) => x !== id) : [...chosen, id]);
  const results = suggestionsFor(chosen);

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)]">
      <div className="grid content-start gap-8">
        {QUESTIONS.map((q, qi) => (
          <fieldset key={q.id}>
            <legend className="font-display text-2xl font-medium">
              <span className="text-accent figures">{qi + 1}.</span> {q.question}
            </legend>
            <p className="mt-1 text-sm text-muted">Pode escolher mais do que uma.</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {q.situations.map((s) => {
                const on = chosen.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(s.id)}
                    className="pressable inline-flex items-center gap-2 rounded-sm border border-line bg-surface px-4 py-2.5 text-left hover:border-accent aria-pressed:border-accent aria-pressed:bg-accent-soft aria-pressed:text-accent-strong"
                  >
                    {on && <Check weight="bold" className="h-4 w-4" aria-hidden />}
                    {s.label}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}
        {chosen.length > 0 && (
          <button type="button" onClick={() => write([])} className="justify-self-start text-sm font-medium text-muted underline underline-offset-4 hover:text-foreground">
            Limpar respostas
          </button>
        )}
      </div>

      <section aria-live="polite" className="content-start lg:sticky lg:top-20">
        <h2 className="font-display text-3xl leading-tight font-medium">Para si</h2>
        {results.length === 0 ? (
          <p className="mt-3 rounded-sm border border-dashed border-line bg-surface p-5 leading-relaxed text-muted">Escolha uma ou mais respostas. As páginas certas para si aparecem aqui.</p>
        ) : (
          <ul className="mt-4 grid gap-px overflow-hidden border border-line bg-line">
            {results.map((r) => (
              <li key={r.href}>
                <Link href={r.href} className="group flex items-start justify-between gap-4 bg-surface p-4 hover:bg-sunken/60">
                  <span>
                    <span className="block font-semibold group-hover:text-accent">{r.title}</span>
                    <span className="mt-0.5 block text-sm leading-relaxed text-muted">{r.why}</span>
                  </span>
                  <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
                </Link>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs leading-relaxed text-muted">As respostas ficam só neste aparelho. Não são enviadas para lado nenhum.</p>
      </section>
    </div>
  );
}
