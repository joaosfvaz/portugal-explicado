"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CaretRight } from "@phosphor-icons/react";
import { breadcrumbs } from "@/lib/nav";

/** "Início › Casa › Faturas": where the page sits in the menu. Built from the menu, so every page gets one. */
export function Breadcrumbs({ className = "" }: { className?: string }) {
  const trail = breadcrumbs(usePathname());
  if (trail.length < 2) return null;

  return (
    <nav aria-label="Localização" className={className}>
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-sm text-muted">
        {trail.map((c, i) => (
          <li key={`${c.label}-${i}`} className="flex items-center gap-1.5">
            {i > 0 && <CaretRight className="h-3 w-3 shrink-0" aria-hidden />}
            {c.href && !c.current ? (
              <Link href={c.href} className="underline-offset-4 hover:text-foreground hover:underline">
                {c.label}
              </Link>
            ) : (
              <span aria-current={c.current ? "page" : undefined} className={c.current ? "text-foreground" : undefined}>
                {c.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
