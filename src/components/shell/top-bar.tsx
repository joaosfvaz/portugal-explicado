"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { List, MagnifyingGlass, X } from "@phosphor-icons/react";
import { Lockup } from "@/components/brand/tiles";
import { SidebarNav } from "./sidebar";
import { TextSize } from "./text-size";
import { SearchForm } from "@/components/search-form";

export function TopBar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-line bg-surface/90 backdrop-blur">
        <div className="flex h-14 items-center gap-4 px-4 lg:px-5">
          <button
            type="button"
            onClick={() => setOpen(true)}
            className="pressable -ml-1 grid h-9 w-9 place-items-center rounded-sm hover:bg-sunken lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={open}
          >
            <List className="h-5 w-5" />
          </button>
          <Link href="/" className="flex shrink-0 items-center" aria-label="Portugal Explicado, página inicial">
            <Lockup size="sm" />
          </Link>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden sm:block">
              <TextSize />
            </div>
            <SearchForm id="topbar-q" className="hidden w-72 md:flex" />
            <Link href="/pesquisa" className="pressable grid h-9 w-9 place-items-center rounded-sm hover:bg-sunken md:hidden" aria-label="Pesquisar no site">
              <MagnifyingGlass className="h-5 w-5" aria-hidden />
            </Link>
          </div>
        </div>
      </header>

      <div className={`fixed inset-0 z-40 lg:hidden ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-black/30 transition-opacity duration-200 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          className={`drawer absolute inset-y-0 left-0 w-[82%] max-w-xs overflow-y-auto bg-surface shadow-xl ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex h-14 items-center justify-between border-b border-line px-4">
            <span className="font-semibold">Menu</span>
            <button type="button" onClick={() => setOpen(false)} className="pressable grid h-9 w-9 place-items-center rounded-sm hover:bg-sunken" aria-label="Fechar menu">
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex items-center justify-between gap-3 border-b border-line px-5 py-3 text-sm sm:hidden">
            <span className="font-medium">Tamanho do texto</span>
            <TextSize />
          </div>
          {open && <SidebarNav onNavigate={() => setOpen(false)} />}
        </div>
      </div>
    </>
  );
}
