"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { activeItem } from "@/lib/nav";

/**
 * Pages of the current group, as a horizontal tab strip. Shown only below `lg`, where the side menu is hidden;
 * on wide screens the side menu already shows the same links.
 */
export function SectionTabs() {
  const pathname = usePathname();
  const active = activeItem(pathname);
  const current = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    current.current?.scrollIntoView({ block: "nearest", inline: "nearest" });
  }, [pathname]);

  if (!active || active.group.items.length === 0) return null;
  const { group, item: activeLink } = active;
  const links = [
    ...(group.href ? [{ href: group.href, label: "Tudo", isActive: !activeLink }] : []),
    ...group.items.filter((i) => !i.hidden || i === activeLink).map((i) => ({ href: i.href, label: i.label, isActive: i === activeLink })),
  ];

  return (
    <div className="border-b border-line bg-surface lg:hidden">
      <nav aria-label={`Páginas de ${group.label}`} className="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <ul className="-mb-px flex gap-6 overflow-x-auto [scrollbar-width:none]">
          {links.map((l) => (
            <li key={l.href} className="shrink-0">
              <Link
                ref={l.isActive ? current : undefined}
                href={l.href}
                aria-current={l.isActive ? "page" : undefined}
                className="block border-b-2 border-transparent py-3 text-[15px] text-muted transition-colors hover:text-foreground aria-[current=page]:border-foreground aria-[current=page]:font-semibold aria-[current=page]:text-foreground"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
