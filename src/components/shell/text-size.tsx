"use client";

import { useSyncExternalStore } from "react";

const SIZES = [
  { id: "normal", label: "A", name: "Texto normal" },
  { id: "grande", label: "A", name: "Texto grande" },
  { id: "maior", label: "A", name: "Texto maior" },
] as const;

type Size = (typeof SIZES)[number]["id"];

const EVENT = "pe-text";

function readSize(): Size {
  const current = document.documentElement.getAttribute("data-text");
  return current === "grande" || current === "maior" ? current : "normal";
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  return () => window.removeEventListener(EVENT, onChange);
}

function applySize(next: Size) {
  const root = document.documentElement;
  if (next === "normal") root.removeAttribute("data-text");
  else root.setAttribute("data-text", next);
  try {
    if (next === "normal") localStorage.removeItem("pe-text");
    else localStorage.setItem("pe-text", next);
  } catch {
    // Storage can be blocked; the size still applies to this visit.
  }
  window.dispatchEvent(new Event(EVENT));
}

/** Three text sizes. The choice stays only in this browser (localStorage). */
export function TextSize() {
  const size = useSyncExternalStore(subscribe, readSize, () => "normal" as Size);
  const choose = applySize;

  return (
    <div role="radiogroup" aria-label="Tamanho do texto" className="flex items-end rounded-sm border border-line">
      {SIZES.map((s, i) => (
        <button
          key={s.id}
          type="button"
          role="radio"
          aria-checked={size === s.id}
          aria-label={s.name}
          title={s.name}
          onClick={() => choose(s.id)}
          className={`grid h-8 w-8 place-items-center font-display leading-none aria-checked:bg-accent aria-checked:text-on-accent ${i === 0 ? "text-[13px]" : i === 1 ? "text-[16px]" : "text-[19px]"}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}
