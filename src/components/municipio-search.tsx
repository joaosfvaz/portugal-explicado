"use client";

import Link from "next/link";
import { MagnifyingGlass } from "@phosphor-icons/react";
import { useState } from "react";

type Item = { slug: string; name: string; district: string; winner: string };

const normalize = (s: string) => s.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function MunicipioSearch({ items }: { items: Item[] }) {
  const [q, setQ] = useState("");
  const query = normalize(q.trim());
  const shown = query ? items.filter((i) => normalize(i.name).includes(query) || normalize(i.district).includes(query)) : items;
  const districts = [...new Set(shown.map((i) => i.district))].sort((a, b) => a.localeCompare(b, "pt"));

  return (
    <div className="grid gap-8">
      <label className="grid max-w-lg gap-2">
        <span className="font-medium">Escreva o nome do seu concelho</span>
        <span className="flex items-center gap-2 rounded-sm border border-line bg-surface px-3 focus-within:border-accent">
          <MagnifyingGlass className="h-5 w-5 text-muted" aria-hidden />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Por exemplo: Braga" className="w-full bg-transparent py-3 text-lg outline-none" />
        </span>
      </label>
      {shown.length === 0 && <p className="text-muted">Nenhum concelho com esse nome.</p>}
      {districts.map((d) => (
        <section key={d}>
          <h2 className="font-display text-2xl font-medium">{d}</h2>
          <ul className="mt-3 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {shown
              .filter((i) => i.district === d)
              .map((i) => (
                <li key={i.slug}>
                  <Link href={`/estado/municipios/${i.slug}`} className="flex items-baseline justify-between gap-3 bg-surface px-4 py-3 hover:bg-sunken/60">
                    <span className="font-medium">{i.name}</span>
                    <span className="text-sm text-muted">{i.winner}</span>
                  </Link>
                </li>
              ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
