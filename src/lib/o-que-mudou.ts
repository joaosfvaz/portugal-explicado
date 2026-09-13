import { CHANGES } from "@/content/alteracoes";
import { formatValue, indicatorViews, periodLabel } from "@/lib/economia/data";
import { getInitiatives } from "@/lib/parlamento/data";
import { titleTopics } from "@/lib/parlamento/topics";

export type FeedItem = { date: string; kind: "lei" | "numero" | "regra" | "site"; title: string; text: string; href: string };

const DAY = 86_400_000;

/**
 * Everything that changed in the last `days` days: laws published on everyday topics, new official figures,
 * hand-written rule changes and new pages. Newest first.
 */
export function recentChanges(days = 60, now = new Date()): FeedItem[] {
  const since = new Date(now.getTime() - days * DAY).toISOString().slice(0, 10);

  const laws: FeedItem[] = getInitiatives()
    .filter((i) => (i.type === "Projeto de Lei" || i.type === "Proposta de Lei") && i.status === "publicada" && (i.statusDate ?? "") >= since)
    .map((i) => ({ i, topics: titleTopics(i.title) }))
    .filter(({ topics }) => topics.length > 0)
    .map(({ i, topics }) => ({
      date: i.statusDate!,
      kind: "lei" as const,
      title: i.title,
      text: `Publicada no Diário da República. Tema: ${topics.map((t) => t.label.toLowerCase()).join(", ")}.`,
      href: `/parlamento/iniciativas/${i.id}`,
    }));

  const figures: FeedItem[] = indicatorViews()
    .filter((v) => v.snap.importedAt.slice(0, 10) >= since)
    .map((v) => ({
      date: v.snap.importedAt.slice(0, 10),
      kind: "numero" as const,
      title: `${v.def.title}: ${formatValue(v.def, v.latest.value)}`,
      text: `Último valor oficial, de ${periodLabel(v.latest.period)}.`,
      href: `/economia/${v.def.slug}`,
    }));

  const manual: FeedItem[] = CHANGES.filter((c) => c.date >= since).map((c) => ({ ...c }));

  return [...manual, ...laws, ...figures].sort((a, b) => b.date.localeCompare(a.date));
}
