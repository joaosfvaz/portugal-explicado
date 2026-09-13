"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useId, useSyncExternalStore } from "react";
import { CaretDown } from "@phosphor-icons/react";
import { activeItem, NAV } from "@/lib/nav";
import { NavGlyph } from "./nav-icon";

const KEY = "pe-nav";
const EVENT = "pe-nav";

/** Groups the reader opened or closed by hand, as a JSON string. Stays only in this browser. */
function readChoices(): string {
  try {
    return localStorage.getItem(KEY) ?? "{}";
  } catch {
    return "{}";
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", onChange);
  };
}

function parse(raw: string): Record<string, boolean> {
  try {
    const value = JSON.parse(raw);
    return value && typeof value === "object" ? value : {};
  } catch {
    return {};
  }
}

function saveChoice(id: string, open: boolean) {
  const next = { ...parse(readChoices()), [id]: open };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage can be blocked; the menu still works, but forgets the choice.
  }
  window.dispatchEvent(new Event(EVENT));
}

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const active = activeItem(pathname);
  const baseId = useId();
  const choices = parse(useSyncExternalStore(subscribe, readChoices, () => "{}"));

  return (
    <nav aria-label="Menu principal" className="grid gap-2 px-3 py-5 text-sm">
      {NAV.map((group) => {
        const hasActive = active?.group === group;

        if (group.items.length === 0 && group.href) {
          return (
            <Link
              key={group.id}
              href={group.href}
              onClick={onNavigate}
              aria-current={hasActive ? "page" : undefined}
              className="flex items-center gap-2.5 rounded-sm px-2 py-1.5 font-semibold text-foreground transition-colors hover:bg-sunken aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-strong"
            >
              <NavGlyph icon={group.icon} className="h-[18px] w-[18px] text-muted" />
              {group.label}
            </Link>
          );
        }

        // The group with the current page opens by default; a choice made by hand wins.
        const open = choices[group.id] ?? hasActive;
        const listId = `${baseId}-${group.id}`;
        const glyph = <NavGlyph icon={group.icon} className={`h-[18px] w-[18px] shrink-0 ${hasActive ? "text-accent" : "text-muted"}`} />;
        const caret = <CaretDown aria-hidden className={`h-3.5 w-3.5 text-muted transition-transform duration-200 ease-out ${open ? "" : "-rotate-90"}`} />;

        return (
          <div key={group.id}>
            {group.href ? (
              // The name opens the overview page; the arrow opens or closes the list.
              <div className="flex items-center rounded-sm">
                <Link
                  href={group.href}
                  onClick={onNavigate}
                  aria-current={hasActive && !active?.item ? "page" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-2.5 rounded-sm px-2 py-1.5 font-semibold text-foreground transition-colors hover:bg-sunken aria-[current=page]:bg-accent-soft aria-[current=page]:text-accent-strong"
                >
                  {glyph}
                  <span className="truncate">{group.label}</span>
                </Link>
                <button
                  type="button"
                  aria-expanded={open}
                  aria-controls={listId}
                  aria-label={`${open ? "Fechar" : "Abrir"} ${group.label}`}
                  onClick={() => saveChoice(group.id, !open)}
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-sm transition-colors hover:bg-sunken"
                >
                  {caret}
                </button>
              </div>
            ) : (
              <button
                type="button"
                aria-expanded={open}
                aria-controls={listId}
                onClick={() => saveChoice(group.id, !open)}
                className="flex w-full items-center gap-2.5 rounded-sm px-2 py-1.5 text-left font-semibold text-foreground transition-colors hover:bg-sunken"
              >
                {glyph}
                <span className="flex-1">{group.label}</span>
                <span className="grid h-5 w-8 place-items-center">{caret}</span>
              </button>
            )}
            <div id={listId} inert={!open} className={`grid transition-[grid-template-rows] duration-200 ease-out ${open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
              <ul className="ml-[17px] grid overflow-hidden border-l border-line pl-2">
                {group.items
                  .filter((item) => !item.hidden || active?.item === item)
                  .map((item, i) => (
                    <li key={item.href} className={i === 0 ? "mt-1" : undefined}>
                      <Link
                        href={item.href}
                        onClick={onNavigate}
                        aria-current={active?.item === item ? "page" : undefined}
                        className="block truncate rounded-sm px-2.5 py-[7px] text-muted transition-colors hover:bg-sunken hover:text-foreground aria-[current=page]:bg-accent-soft aria-[current=page]:font-medium aria-[current=page]:text-accent-strong"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        );
      })}
    </nav>
  );
}
