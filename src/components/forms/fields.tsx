"use client";

import type { ReactNode } from "react";
import { Glossed } from "@/components/glossary/glossed";

export function NumberField({
  id,
  label,
  value,
  onChange,
  help,
  suffix,
  min,
  max,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
  suffix?: string;
  min?: number;
  max?: number;
}) {
  return (
    <div className="grid content-start gap-2">
      <label htmlFor={id} className="text-sm font-medium">
        {label}
      </label>
      <div className="flex items-center rounded-sm border border-line bg-surface focus-within:border-accent">
        <input
          id={id}
          type="number"
          inputMode="numeric"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent px-4 py-3 text-lg font-medium tabular outline-none"
          aria-describedby={help ? `${id}-help` : undefined}
        />
        {suffix && <span className="pr-4 text-sm whitespace-nowrap text-muted">{suffix}</span>}
      </div>
      {help && (
        <p id={`${id}-help`} className="text-sm text-muted">
          <Glossed>{help}</Glossed>
        </p>
      )}
    </div>
  );
}

export function Toggle({ id, label, checked, onChange, help }: { id: string; label: string; checked: boolean; onChange: (v: boolean) => void; help?: string }) {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-3 rounded-sm border border-line bg-surface px-4 py-3">
      <input id={id} type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="mt-1 h-4 w-4 accent-[var(--accent)]" />
      <span>
        <span className="font-medium">{label}</span>
        {help && <span className="mt-0.5 block text-sm text-muted">{help}</span>}
      </span>
    </label>
  );
}

export function Choice<T extends string>({ label, value, onChange, options }: { label: string; value: T; onChange: (v: T) => void; options: { id: T; label: string; help?: string }[] }) {
  return (
    <fieldset className="grid gap-2">
      <legend className="mb-2 text-sm font-medium">{label}</legend>
      <div className="grid gap-2 sm:grid-cols-2">
        {options.map((o) => (
          <label key={o.id} className="flex cursor-pointer items-start gap-3 rounded-sm border border-line bg-surface px-4 py-3 has-[:checked]:border-accent has-[:checked]:bg-accent-soft">
            <input type="radio" checked={value === o.id} onChange={() => onChange(o.id)} className="mt-1 accent-[var(--accent)]" />
            <span>
              <span className="font-medium">{o.label}</span>
              {o.help && <span className="mt-0.5 block text-sm text-muted">{o.help}</span>}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export function ResultPanel({ children }: { children: ReactNode }) {
  return (
    <div className="content-start rounded-sm border border-line bg-surface p-6" aria-live="polite">
      {children}
    </div>
  );
}

export function ResultRow({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-baseline justify-between gap-4 border-t border-line py-2.5 first:border-0">
      <dt className="text-muted">{label}</dt>
      <dd className={`whitespace-nowrap tabular ${strong ? "text-lg font-semibold" : "font-medium"}`}>{value}</dd>
    </div>
  );
}
