"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "@phosphor-icons/react";
import { nextPages } from "@/content/paginas";

/** "A seguir": two or three pages to read next, at the end of every page that has them. */
export function NextSteps() {
  const pages = nextPages(usePathname());
  if (pages.length === 0) return null;

  return (
    <nav aria-label="A seguir" className="mx-auto w-full max-w-6xl px-4 pt-4 sm:px-6">
      <h2 className="font-display text-2xl font-medium">A seguir</h2>
      <ul className="mt-3 grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-3">
        {pages.map((p) => (
          <li key={p.href} className="bg-surface">
            <Link href={p.href} className="group flex h-full items-center justify-between gap-3 p-4 font-medium hover:bg-sunken/60">
              <span className="group-hover:text-accent">{p.title}</span>
              <ArrowRight className="h-4 w-4 shrink-0 text-muted transition-transform duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-accent" aria-hidden />
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
