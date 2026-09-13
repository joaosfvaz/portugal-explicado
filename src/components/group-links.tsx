import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PAGES } from "@/content/paginas";
import { NAV } from "@/lib/nav";

/**
 * Every page of a menu group as a list of cards, for the group's overview page. This includes the pages the
 * menu hides to stay short, so nothing is only reachable by search.
 */
export function GroupLinks({ group, summaries = {}, only }: { group: string; summaries?: Record<string, string>; /** Show only these pages. */ only?: string[] }) {
  const items = NAV.find((g) => g.id === group)?.items.filter((i) => !only || only.includes(i.href)) ?? [];
  return (
    <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
      {items.map((i) => {
        const summary = summaries[i.href] ?? PAGES.find((p) => p.href === i.href)?.summary;
        return (
          <li key={i.href} className="bg-surface">
            <Link href={i.href} className="group flex h-full flex-col p-5 hover:bg-sunken/60">
              <span className="flex items-center justify-between gap-3">
                <span className="text-lg font-semibold group-hover:text-accent">{i.label}</span>
                <ArrowRight className="h-4 w-4 shrink-0 text-muted group-hover:text-accent" aria-hidden />
              </span>
              {summary && <span className="mt-1.5 leading-relaxed text-muted">{summary}</span>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
